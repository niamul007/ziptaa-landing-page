/*
 * demo-call-vapi.js — live voice demo for the landing page (window.DemoCall).
 *
 * SECURITY NOTES
 * - A Vapi public key is visible to every visitor by design. In the Vapi
 *   dashboard, restrict it to these three assistants (salon, dental, home)
 *   and, if offered, to this site's domains.
 * - The daily call limit is stored in the visitor's browser (localStorage),
 *   so it is a courtesy and not security. Anyone can clear it.
 *
 * Contract (see demo-card.js):
 *   DemoCall.start(businessKey, {
 *     onConnecting(), onLive(), onMessage({ role: "julia" | "you", text }),
 *     onEnd({ seconds }), onError(kind)   // kind: "mic" | "failed" | "limit"
 *   });
 *   DemoCall.stop();
 */
(function () {
  "use strict";

  var CONFIG = {
    PUBLIC_KEY: "eae9b2e5-8f79-4114-b16e-9fd036fc08eb",
    ASSISTANTS: {
      salon: "e0f2b32c-1b0f-46b1-8c94-3f71399b0589",
      dental: "ec56baa8-b8af-4ef1-b1fa-0888c670787b",
      home: "0e617364-6038-4990-a94b-03068de59fa5"
    },
    MAX_SECONDS: 90,
    DAILY_LIMIT: 3
  };

  var SDK_URL = "https://esm.sh/@vapi-ai/web@2.3.10";
  var STORAGE_KEY = "ziptaa_demo_calls";

  var VapiClass = null; // cached SDK class
  var sdkPromise = null; // in-flight / settled SDK load
  var vapi = null; // single Vapi instance
  var current = null; // state of the call in progress, or null

  function isPlaceholder(value) {
    return typeof value !== "string" || value === "" || value.indexOf("PASTE_") === 0;
  }

  function safe(fn, arg) {
    // A throwing UI handler must never break the call flow.
    if (typeof fn !== "function") return;
    try {
      fn(arg);
    } catch (e) {
      console.warn("[DemoCall] handler threw");
    }
  }

  // ---- daily limit (localStorage, always guarded) ----

  function today() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function readCount() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return 0;
      var rec = JSON.parse(raw);
      if (!rec || rec.day !== today()) return 0;
      var n = Number(rec.count);
      return isFinite(n) && n > 0 ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  function incrementCount() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ day: today(), count: readCount() + 1 })
      );
    } catch (e) {
      /* blocked or private-mode storage: ignore */
    }
  }

  // ---- finishing a call: at most one of onEnd / onError ----

  function clearTimer(call) {
    if (call.timer) {
      clearTimeout(call.timer);
      call.timer = null;
    }
    if (call.connectTimer) {
      clearTimeout(call.connectTimer);
      call.connectTimer = null;
    }
  }

  function finishEnd(call) {
    if (call.done) return;
    call.done = true;
    clearTimer(call);
    if (current === call) current = null;
    var seconds = call.startedAt
      ? Math.max(0, Math.floor((Date.now() - call.startedAt) / 1000))
      : 0;
    safe(call.handlers.onEnd, { seconds: seconds });
  }

  function finishError(call, kind) {
    if (call.done) return;
    call.done = true;
    clearTimer(call);
    if (current === call) current = null;
    if (vapi) {
      try {
        vapi.stop();
      } catch (e) {
        /* best effort */
      }
    }
    safe(call.handlers.onError, kind);
  }

  function classifyError(error) {
    var text = "";
    try {
      var raw =
        error && (error.message || error.errorMsg)
          ? error.message || error.errorMsg
          : String(error);
      text = (typeof raw === "string" ? raw : String(raw)).toLowerCase();
    } catch (e) {
      text = "";
    }
    return /permission|notallowed|denied|microphone/.test(text) ? "mic" : "failed";
  }

  // ---- SDK loading (first start only) ----

  function loadSdk() {
    if (VapiClass) return Promise.resolve(VapiClass);
    if (!sdkPromise) {
      sdkPromise = import(SDK_URL)
        .then(function (mod) {
          VapiClass = mod.default;
          if (typeof VapiClass !== "function") throw new Error("bad sdk");
          return VapiClass;
        })
        .catch(function (err) {
          sdkPromise = null; // allow a retry on the next start
          throw err;
        });
    }
    return sdkPromise;
  }

  function ensureInstance() {
    if (vapi) return vapi;
    vapi = new VapiClass(CONFIG.PUBLIC_KEY);

    // Listeners are attached once and route to the current call only.
    vapi.on("call-start", function () {
      var call = current;
      if (!call || call.done) {
        // A late call-start must never leave a call running unseen.
        try {
          vapi.stop();
        } catch (e) {
          /* best effort */
        }
        return;
      }
      if (call.live) return;
      call.live = true;
      call.startedAt = Date.now();
      if (call.connectTimer) {
        clearTimeout(call.connectTimer);
        call.connectTimer = null;
      }
      incrementCount();
      call.timer = setTimeout(function () {
        call.timer = null;
        if (current === call && !call.done && vapi) {
          try {
            vapi.stop();
          } catch (e) {
            /* best effort */
          }
        }
      }, (CONFIG.MAX_SECONDS + 3) * 1000);
      safe(call.handlers.onLive);
    });

    vapi.on("message", function (message) {
      var call = current;
      if (!call || call.done || !message) return;
      if (message.type !== "transcript" || message.transcriptType !== "final") return;
      var text = typeof message.transcript === "string" ? message.transcript.trim() : "";
      if (!text) return;
      var role = message.role === "assistant" ? "julia" : message.role === "user" ? "you" : null;
      if (!role) return;
      safe(call.handlers.onMessage, { role: role, text: text });
    });

    vapi.on("call-end", function () {
      if (!current) return;
      if (!current.live) finishError(current, "failed");
      else finishEnd(current);
    });

    vapi.on("error", function (error) {
      if (current) finishError(current, classifyError(error));
    });

    return vapi;
  }

  // ---- public API ----

  function start(businessKey, handlers) {
    if (current) return; // a call is already in progress
    handlers = handlers || {};

    if (readCount() >= CONFIG.DAILY_LIMIT) {
      safe(handlers.onError, "limit");
      return;
    }

    var assistantId = CONFIG.ASSISTANTS[businessKey];
    if (isPlaceholder(CONFIG.PUBLIC_KEY) || isPlaceholder(assistantId)) {
      console.warn("[DemoCall] Public key or assistant id is not configured.");
      safe(handlers.onError, "failed");
      return;
    }

    var call = {
      handlers: handlers,
      live: false,
      done: false,
      startedAt: 0,
      timer: null,
      connectTimer: null
    };
    current = call;
    call.connectTimer = setTimeout(function () {
      call.connectTimer = null;
      if (!call.live && !call.done) finishError(call, "failed");
    }, 30000);
    safe(handlers.onConnecting);

    loadSdk()
      .then(function () {
        if (call.done) return;
        ensureInstance();
        return vapi.start(assistantId, { maxDurationSeconds: CONFIG.MAX_SECONDS });
      })
      .catch(function (error) {
        // SDK import failure or a rejected vapi.start().
        finishError(call, VapiClass ? classifyError(error) : "failed");
      });
  }

  function stop() {
    if (!current || !current.live || !vapi) return;
    try {
      vapi.stop();
    } catch (e) {
      /* best effort */
    }
  }

  window.DemoCall = { start: start, stop: stop };
})();
