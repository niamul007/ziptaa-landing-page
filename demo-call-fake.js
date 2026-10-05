/*
 * demo-call-fake.js
 *
 * STAND-IN ONLY. This file pretends to be a call so the demo card flow can be
 * tested without any network. It will be replaced by the real call source,
 * which exposes the same contract: window.DemoCall.start(businessKey, handlers)
 * and window.DemoCall.stop().
 *
 * handlers: onConnecting(), onLive(), onMessage({ role, text }),
 *           onEnd({ seconds }), onError(kind)
 *
 * IMPORTANT: start() can be asynchronous in the real implementation, so real
 * failures (mic denied, connection failed, limit reached) must be reported
 * through handlers.onError(kind), never by throwing from start().
 *
 * Test errors by adding ?demoerror=mic, ?demoerror=failed or ?demoerror=limit
 * to the page URL.
 */
(function () {
  "use strict";

  var CONNECT_DELAY = 1500;
  var ERROR_DELAY = 1000;
  var END_DELAY = 3000;
  var ERROR_KINDS = ["mic", "failed", "limit"];

  // Keyed by the radio values in index.html. Gaps are the ms to wait before
  // each line (3 to 5 seconds apart).
  var SCRIPTS = {
    salon: [
      { role: "julia", gap: 1500, text: "Thank you for calling Maple & Main Hair Studio, this is Julia. How can I help you today?" },
      { role: "you", gap: 3500, text: "Hi, I'd like to book a haircut and color for this Saturday if you have anything." },
      { role: "julia", gap: 4000, text: "Of course. I have 10:30 in the morning or 2:15 in the afternoon on Saturday. Which works better?" },
      { role: "you", gap: 3500, text: "2:15 is perfect." },
      { role: "julia", gap: 4500, text: "Great, you're booked for Saturday at 2:15 for a cut and color. Can I get your name and a number for a reminder text?" },
      { role: "you", gap: 4000, text: "Sure, it's Dana Reyes, 512 555 0142." }
    ],
    dental: [
      { role: "julia", gap: 1500, text: "Lakeview Family Dental, this is Emma. How can I help you?" },
      { role: "you", gap: 3500, text: "Hello, I'm due for a check-up and cleaning. Do you have anything next week?" },
      { role: "julia", gap: 4000, text: "Yes, we do. I can offer Tuesday at 9:00 or Thursday at 3:30. Are you a current patient with us?" },
      { role: "you", gap: 4000, text: "I am. Thursday at 3:30 works for me." },
      { role: "julia", gap: 4500, text: "Perfect, I've reserved Thursday at 3:30 for your check-up and cleaning. May I have your name and date of birth?" },
      { role: "you", gap: 4000, text: "It's Marcus Hill, March 8th, 1987." }
    ],
    home: [
      { role: "julia", gap: 1500, text: "Ridgeline Plumbing and Heating, this is Jack. What can I do for you?" },
      { role: "you", gap: 3500, text: "Hi, my kitchen sink is leaking under the cabinet and there's water on the floor." },
      { role: "julia", gap: 4000, text: "I'm sorry to hear that. Please turn off the shutoff valve under the sink if you can. Is the leak steady or just dripping?" },
      { role: "you", gap: 4500, text: "Steady drip. I've shut the valve and it's slowed down." },
      { role: "julia", gap: 4000, text: "Good. I can send a plumber tomorrow between 8 and 10 in the morning. Does that work?" },
      { role: "you", gap: 3500, text: "Yes, that works. The address is 214 Pine Street." }
    ]
  };

  var timers = [];
  var live = false;
  var liveStartedAt = 0;
  var activeHandlers = null;

  function clearTimers() {
    for (var i = 0; i < timers.length; i++) {
      clearTimeout(timers[i]);
    }
    timers = [];
  }

  function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function call(name, arg) {
    var h = activeHandlers;
    if (h && typeof h[name] === "function") {
      h[name](arg);
    }
  }

  function elapsedSeconds() {
    return Math.floor((Date.now() - liveStartedAt) / 1000);
  }

  function forcedError() {
    var match = /[?&]demoerror=([^&#]*)/.exec(window.location.search);
    if (!match) return null;
    var kind;
    try {
      kind = decodeURIComponent(match[1]);
    } catch (err) {
      return null;
    }
    return ERROR_KINDS.indexOf(kind) !== -1 ? kind : null;
  }

  function start(businessKey, handlers) {
    clearTimers();
    live = false;
    activeHandlers = handlers || {};

    call("onConnecting");

    var errorKind = forcedError();
    if (errorKind) {
      later(function () {
        live = false;
        call("onError", errorKind);
      }, ERROR_DELAY);
      return;
    }

    var script = SCRIPTS[businessKey] || SCRIPTS.salon;

    later(function () {
      live = true;
      liveStartedAt = Date.now();
      call("onLive");

      var t = 0;
      script.forEach(function (line) {
        t += line.gap;
        later(function () {
          call("onMessage", { role: line.role, text: line.text });
        }, t);
      });

      later(function () {
        live = false;
        call("onEnd", { seconds: elapsedSeconds() });
      }, t + END_DELAY);
    }, CONNECT_DELAY);
  }

  function stop() {
    clearTimers();
    if (live) {
      live = false;
      call("onEnd", { seconds: elapsedSeconds() });
    }
  }

  window.DemoCall = { start: start, stop: stop };
})();
