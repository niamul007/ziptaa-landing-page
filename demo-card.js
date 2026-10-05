(function () {
  "use strict";

  var MAX_BUBBLES = 6;
  var LIMIT_LABEL = "1:30";

  function init() {
    var card = document.getElementById("demo-card");
    var startBtn = document.getElementById("demo-start");
    if (!card || !startBtn) return;

    var endBtn = document.getElementById("demo-end");
    var againBtn = document.getElementById("demo-again");
    var retryBtn = document.getElementById("demo-retry");
    var radios = card.querySelectorAll(".demo-options input[type=\"radio\"]");
    var captions = card.querySelector('.demo-view[data-view="live"] .demo-captions');
    var timerEl = card.querySelector(".demo-timer");
    var endedTimeEl = card.querySelector(".demo-ended-time");
    var trialLink = card.querySelector(".demo-error-trial");

    var timerId = null;
    var startedAt = 0;

    function fmt(totalSeconds) {
      var s = Math.max(0, Math.floor(totalSeconds));
      var m = Math.floor(s / 60);
      var r = s % 60;
      return m + ":" + (r < 10 ? "0" : "") + r;
    }

    function isVisible(el) {
      return !!el && el.getClientRects().length > 0;
    }

    function focusFor(state) {
      var target = null;
      if (state === "idle") {
        target = startBtn;
      } else if (state === "live") {
        target = endBtn;
      } else if (state === "ended") {
        target = againBtn;
      } else if (state === "error") {
        target = isVisible(retryBtn) ? retryBtn : trialLink;
      }
      if (target && typeof target.focus === "function") target.focus();
    }

    function setState(state, errorKind) {
      card.dataset.state = state;
      if (state === "error") {
        var kind = errorKind === "mic" || errorKind === "failed" || errorKind === "limit"
          ? errorKind
          : "failed";
        card.dataset.error = kind;
      } else {
        card.removeAttribute("data-error");
      }
      focusFor(state);
    }

    function selectedRadio() {
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) return radios[i];
      }
      return null;
    }

    function copySelection(radio) {
      var option = radio.closest(".demo-opt");
      if (!option) return;
      var nameEl = option.querySelector("strong");
      var iconEl = option.querySelector(".demo-avatar");
      var name = nameEl ? nameEl.textContent : "";
      var views = ["live", "connecting", "ended", "error"];

      views.forEach(function (view) {
        var root = card.querySelector('.demo-view[data-view="' + view + '"]');
        if (!root) return;
        var nameTarget = root.querySelector(".demo-live-name");
        var avatarTarget = root.querySelector(".demo-avatar");
        if (nameTarget) nameTarget.textContent = name;
        if (avatarTarget && iconEl) {
          // Copy the static avatar icon nodes from the option (no string markup).
          avatarTarget.textContent = "";
          for (var n = iconEl.firstChild; n; n = n.nextSibling) {
            avatarTarget.appendChild(n.cloneNode(true));
          }
        }
      });
    }

    function stopTimer() {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    function tick() {
      if (timerEl) {
        timerEl.textContent = fmt((Date.now() - startedAt) / 1000) + " / " + LIMIT_LABEL;
      }
    }

    function startTimer() {
      stopTimer();
      startedAt = Date.now();
      tick();
      timerId = setInterval(tick, 1000);
    }

    function clearCaptions() {
      if (!captions) return;
      var bubbles = captions.querySelectorAll(".demo-cap");
      for (var i = 0; i < bubbles.length; i++) {
        captions.removeChild(bubbles[i]);
      }
    }

    var handlers = {
      onConnecting: function () {
        setState("connecting");
      },
      onLive: function () {
        clearCaptions();
        setState("live");
        startTimer();
      },
      onMessage: function (msg) {
        if (!captions || !msg) return;
        var isJulia = msg.role === "julia";
        var p = document.createElement("p");
        p.className = "demo-cap " + (isJulia ? "demo-cap-julia" : "demo-cap-you");
        var who = document.createElement("span");
        who.className = "demo-cap-who";
        who.textContent = isJulia ? "Julia" : "You";
        p.appendChild(who);
        p.appendChild(document.createTextNode(String(msg.text == null ? "" : msg.text)));
        captions.appendChild(p);

        var bubbles = captions.querySelectorAll(".demo-cap");
        for (var i = 0; i < bubbles.length - MAX_BUBBLES; i++) {
          captions.removeChild(bubbles[i]);
        }
      },
      onEnd: function (info) {
        stopTimer();
        var seconds = info && typeof info.seconds === "number" ? info.seconds : 0;
        if (endedTimeEl) endedTimeEl.textContent = fmt(seconds);
        setState("ended");
      },
      onError: function (kind) {
        stopTimer();
        setState("error", kind);
      }
    };

    function begin() {
      var radio = selectedRadio();
      if (!radio) return;
      copySelection(radio);
      setState("connecting");

      if (!window.DemoCall || typeof window.DemoCall.start !== "function") {
        console.warn("DemoCall is not available; cannot start the demo call.");
        setState("error", "failed");
        return;
      }

      try {
        window.DemoCall.start(radio.value, handlers);
      } catch (err) {
        console.warn("DemoCall.start threw:", err);
        stopTimer();
        setState("error", "failed");
      }
    }

    startBtn.addEventListener("click", begin);

    if (endBtn) {
      endBtn.addEventListener("click", function () {
        if (window.DemoCall && typeof window.DemoCall.stop === "function") {
          window.DemoCall.stop();
        }
      });
    }

    if (againBtn) {
      againBtn.addEventListener("click", function () {
        setState("idle");
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener("click", begin);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
