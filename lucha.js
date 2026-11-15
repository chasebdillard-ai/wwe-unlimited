/* LU:lucha — Lucha Underground Season 1 hub for WWE Unlimited.
   Self-contained: builds #v-lucha, handles #lucha routing, plays through the site's own player
   (window.__wuPlay -> play() -> fillPlayer(), so Continue Watching records every episode),
   and runs an original Web Audio soundscape (no audio files). */
(function () {
  "use strict";
  if (window.__luInit) return;
  window.__luInit = true;
  var EPS = [{"id": "3VHcv05e6gI", "n": 1, "t": "Welcome to the Temple", "s": "Prince Puma vs. Johnny Mundo", "d": 2634}, {"id": "hx0Kkir__PU", "n": 2, "t": "Los Demonios", "s": "", "d": 2523}, {"id": "rpeJBMlUL9U", "n": 3, "t": "Crossing the Border", "s": "", "d": 2581}, {"id": "xbbIhwtj9AY", "n": 4, "t": "Thrill of the Hunt", "s": "", "d": 2608}, {"id": "oM5aMYPhHe4", "n": 5, "t": "Boyle Heights Street Fight", "s": "", "d": 2691}, {"id": "HP5EZQ0CLGU", "n": 6, "t": "The Key", "s": "", "d": 2680}, {"id": "x1tZ2oSCZQk", "n": 7, "t": "$100,000 Ladder Match: Puma vs. Mundo vs. Big Ryck", "s": "", "d": 2753}, {"id": "6fFGNXo39dE", "n": 8, "t": "A Unique Opportunity", "s": "", "d": 2677}, {"id": "caLuOdIQnlo", "n": 9, "t": "Aztec Warfare", "s": "", "d": 2751}, {"id": "5necfKf0J2M", "n": 10, "t": "Law of the Jungle", "s": "", "d": 2587}, {"id": "tlDVNu2jwcs", "n": 11, "t": "Last Luchador Standing", "s": "", "d": 2692}, {"id": "lurdA3GxjjM", "n": 12, "t": "They Call Him Cage", "s": "", "d": 2681}, {"id": "59OVGo9E8dk", "n": 13, "t": "Johnny Mundo vs. The Machine", "s": "", "d": 2651}, {"id": "5hwLT6SLiNI", "n": 14, "t": "Open Mic Night", "s": "", "d": 2700}, {"id": "-r9e3LDZGVQ", "n": 15, "t": "Eye for an Eye", "s": "", "d": 2583}, {"id": "BJ56ZFaA_1s", "n": 16, "t": "Caged Animal", "s": "", "d": 2653}, {"id": "y5ypzO4_Oh0", "n": 17, "t": "A War Started in Mexico...", "s": "", "d": 2667}, {"id": "CxKig9uJtbI", "n": 18, "t": "No Escape", "s": "", "d": 2661}, {"id": "IpvJcnB7XG8", "n": 19, "t": "Grave Consequences", "s": "", "d": 2646}, {"id": "DfiVGGqKPkU", "n": 20, "t": "The Art of War", "s": "", "d": 2646}, {"id": "KTc7v1gNGmU", "n": 21, "t": "Uno! Dos! Tres!", "s": "", "d": 2638}, {"id": "A6oHgMQ1UAo", "n": 22, "t": "Mask vs. Mask", "s": "", "d": 2633}, {"id": "LygweoA_uTI", "n": 23, "t": "Fire in the Cosmos", "s": "", "d": 2657}, {"id": "MVLxHqQcThQ", "n": 24, "t": "Trios Champions", "s": "", "d": 2699}, {"id": "U7mIjC1Xh40", "n": 25, "t": "The Way of the Dragon", "s": "", "d": 2691}, {"id": "4CIhoFw-Dhw", "n": 26, "t": "The Best in the Business", "s": "", "d": 2603}, {"id": "lv5CbvltZEE", "n": 27, "t": "Ancient Medallions", "s": "", "d": 2589}, {"id": "0q05bn6DR3s", "n": 28, "t": "Shoots and Ladders", "s": "", "d": 2677}, {"id": "19vDfR_s8jo", "n": 29, "t": "Fight to the Death", "s": "", "d": 2690}, {"id": "TSrZtIzqLC8", "n": 30, "t": "Submit to the Master", "s": "", "d": 2691}, {"id": "Af6HwtDHjaM", "n": 31, "t": "The Desolation of Drago", "s": "", "d": 2671}, {"id": "XxmBttkftzY", "n": 32, "t": "All Night Long", "s": "", "d": 2632}, {"id": "1NUTAwWhP0Q", "n": 33, "t": "Death vs. The Dragon", "s": "", "d": 2692}, {"id": "0J9IgUH_seM", "n": 34, "t": "Gold and Guerreros", "s": "", "d": 2688}, {"id": "tHugDuHH0Xo", "n": 35, "t": "Fuel to the Fire", "s": "", "d": 2689}, {"id": "vhzOXtm2n2E", "n": 36, "t": "The Beginning of the End", "s": "", "d": 2589}, {"id": "UHLDHtu_F6I", "n": 37, "t": "PenUltima Lucha", "s": "", "d": 2695}, {"id": "W0fUk4Fqx6Q", "n": 38, "t": "Ultima Lucha Part 1", "s": "", "d": 2626}, {"id": "OBBFUvwmbuI", "n": 39, "t": "Ultima Lucha Part 2", "s": "", "d": 5474}];
  var SHOW = "Lucha Underground \u00b7 Season 1";
  var PLAYLIST = "https://www.youtube.com/playlist?list=PLENmTdkPbgAD8JN3OPE8qqQs3teGHh1He";
  var MAIN_VIEWS = ["home", "nxt", "wcw", "ecw", "nwa", "shows", "show", "row", "search", "list", "ss", "all", "ch", "mainevent"];
  var SND_KEY = "lu_sound";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dur(s) { var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return h ? h + ":" + pad(m) + ":" + pad(x) : m + ":" + pad(x); }

  // ---------- play queue in the site's player format ----------
  var Q = { name: SHOW, len: function () { return ITEMS.length; }, make: function (j) { return ITEMS[j]; } };
  var ITEMS = EPS.map(function (e, k) {
    return {
      _id: e.id, title: "E" + e.n + " \u00b7 " + e.t, url: "https://www.youtube.com/watch?v=" + e.id, show: SHOW,
      hours: e.d / 3600, _th: "https://i.ytimg.com/vi/" + e.id + "/hqdefault.jpg",
      _m: "Season 1 \u00b7 Episode " + e.n + " \u00b7 " + Math.round(e.d / 60) + " min", _mins: Math.round(e.d / 60), _Q: Q, _k: k
    };
  });
  try { if (window.__wuCwReg) window.__wuCwReg(ITEMS); } catch (e) {}
  function playEp(k) {
    var it = ITEMS[k];
    if (!it) return;
    if (typeof window.__wuPlay === "function") window.__wuPlay(it);
    else window.open(it.url, "_blank", "noopener");
  }
  function cwList() { try { var a = JSON.parse(localStorage.getItem("wwe_cw") || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  var byId = {};
  ITEMS.forEach(function (it, k) { byId[it._id] = k; });

  // ---------- view ----------
  var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
  var ICON_ON = '<svg class="lu-ico-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/></svg>';
  var ICON_OFF = '<svg class="lu-ico-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="m16 9.5 5 5m0-5-5 5"/></svg>';
  var built = false;
  function epCard(it, k) {
    var e = EPS[k], big = e.n === 1 || e.n === 39 || e.n === 7 || e.n === 9;
    var kick = e.n === 1 ? "Premiere" : e.n === 39 ? "Season finale" : e.n === 38 ? "Ultima Lucha" : e.n === 9 ? "Aztec Warfare" : e.n === 7 ? "Ladder Match" : "Episode " + e.n;
    return '<li id="lu-e' + e.n + '"><button type="button" class="lu-ep' + (big ? " is-big" : "") + '" data-lu-play="' + k + '" aria-label="Play episode ' + e.n + ": " + esc(e.t) + '">' +
      '<span class="lu-ep__art"><img loading="lazy" src="' + it._th + '" alt="" /><span class="lu-ep__n" aria-hidden="true">' + pad(e.n) + "</span>" +
      '<span class="lu-ep__dur">' + dur(e.d) + '</span><span class="lu-ep__play" aria-hidden="true">' + ICON_PLAY + '</span><span class="lu-ep__bar" data-lu-bar="' + it._id + '" hidden><i></i></span></span>' +
      '<span class="lu-ep__b"><span class="lu-ep__k">' + esc(kick) + '</span><span class="lu-ep__t">' + esc(e.t) + "</span>" + (e.s ? '<span class="lu-ep__s">' + esc(e.s) + "</span>" : "") + "</span></button></li>";
  }
  function build() {
    if (built) return;
    var main = document.querySelector("main") || document.body;
    var v = $("v-lucha");
    if (!v) { v = document.createElement("div"); v.className = "x-view"; v.id = "v-lucha"; v.hidden = true; main.appendChild(v); }
    var embers = "";
    for (var i = 0; i < 18; i++) {
      embers += '<span style="left:' + (4 + ((i * 53) % 92)) + "%;animation-delay:" + (-(i * 0.73) % 7).toFixed(2) + "s;animation-duration:" + (5.5 + (i % 5) * 0.9).toFixed(1) + "s;--dx:" + ((i % 2 ? 1 : -1) * (14 + (i * 7) % 50)) + 'px"></span>';
    }
    v.innerHTML =
      '<section class="lu-hero" aria-labelledby="lu-title">' +
        '<div class="lu-smoke" aria-hidden="true"></div>' +
        '<div class="lu-torch lu-torch--l" aria-hidden="true"><i></i></div><div class="lu-torch lu-torch--r" aria-hidden="true"><i></i></div>' +
        '<div class="lu-embers" aria-hidden="true">' + embers + "</div>" +
        '<div class="lu-hero__in">' +
          '<img class="lu-mask" src="lucha_mask.png" alt="" />' +
          '<h1 class="lu-word" id="lu-title"><img src="lucha_underground.png" alt="Lucha Underground" /></h1>' +
          '<p class="lu-tag">Welcome to the Temple</p>' +
          '<p class="lu-sub">Season One <b>\u00b7</b> 39 episodes <b>\u00b7</b> Boyle Heights, Los Angeles</p>' +
          '<div class="lu-acts">' +
            '<button type="button" class="lu-btn lu-btn--blood" data-lu-play="0">' + ICON_PLAY + "Enter the Temple</button>" +
            '<button type="button" class="lu-btn" id="lu-resume" hidden></button>' +
            '<button type="button" class="lu-btn lu-snd" data-lu-sound aria-pressed="false">' + ICON_ON + ICON_OFF + '<span data-lu-sndlabel>Sound</span></button>' +
          "</div>" +
          '<p class="lu-hint" id="lu-hint" hidden>Tap anywhere to wake the Temple</p>' +
        "</div>" +
      "</section>" +
      '<div class="lu-band" aria-hidden="true"></div>' +
      '<section class="lu-season" aria-labelledby="lu-s1">' +
        '<div class="lu-head"><div><h2 id="lu-s1">Season One</h2><p>From the first night in the Temple to Ultima Lucha. Every episode, in order.</p></div>' +
          '<div class="lu-jump" role="group" aria-label="Jump to episode"><button type="button" data-lu-jump="1">1\u201313</button><button type="button" data-lu-jump="14">14\u201326</button><button type="button" data-lu-jump="27">27\u201339</button></div></div>' +
        '<ol class="lu-grid">' + ITEMS.map(epCard).join("") + "</ol>" +
      "</section>" +
      '<div class="lu-band lu-band--flip" aria-hidden="true"></div>' +
      '<p class="lu-foot">Official full episodes from the <a href="' + PLAYLIST + '" target="_blank" rel="noopener">Lucha Underground YouTube channel</a>. Videos play from YouTube.</p>' +
      '<button type="button" class="lu-float" data-lu-sound aria-pressed="false">' + ICON_ON + ICON_OFF + '<span data-lu-sndlabel>Sound</span><span class="lu-eq" aria-hidden="true"><i></i><i></i><i></i></span></button>';
    built = true;
    v.addEventListener("click", onClick);
    v.addEventListener("pointerover", onHover);
    v.addEventListener("focusin", onHover);
    v.addEventListener("pointerdown", onGesture, true);
    v.addEventListener("keydown", onGesture, true);
    syncSound();
  }
  function drawProgress() {
    if (!built) return;
    var a = cwList(), last = null;
    [].forEach.call(document.querySelectorAll("[data-lu-bar]"), function (b) { b.hidden = true; });
    a.forEach(function (x) {
      if (!x || byId[x.id] == null) return;
      if (!last) last = x;
      var b = document.querySelector('[data-lu-bar="' + x.id + '"]');
      if (b && x.prog && x.dur) { b.hidden = false; b.firstChild.style.width = Math.max(3, Math.min(100, Math.round(x.prog / x.dur * 100))) + "%"; }
    });
    var r = $("lu-resume");
    if (r) {
      if (last) { var k = byId[last.id]; r.hidden = false; r.dataset.luPlay = k; r.innerHTML = ICON_PLAY + "Continue E" + EPS[k].n; }
      else { r.hidden = true; delete r.dataset.luPlay; }
    }
  }

  // ---------- fonts: loaded only for the hub ----------
  var fontsOn = false;
  function loadFonts() {
    if (fontsOn) return;
    fontsOn = true;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.id = "lu-fonts";
    l.href = "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;700&display=swap";
    document.head.appendChild(l);
  }

  // ---------- routing ----------
  var active = false;
  function enter() {
    build();
    loadFonts();
    [].forEach.call(document.querySelectorAll("main > .x-view"), function (el) { el.hidden = el.id !== "v-lucha"; });
    $("v-lucha").hidden = false;
    delete document.body.dataset.hub;
    document.body.classList.add("lu-on");
    [].forEach.call(document.querySelectorAll("[data-tab]"), function (a) { if (a.dataset.tab === "lucha") a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    var info = $("info");
    if (info && !info.hidden) { info.hidden = true; if ($("player") && $("player").hidden) document.documentElement.style.overflow = ""; }
    if (!active) window.scrollTo(0, 0);
    active = true;
    drawProgress();
    if (prefOn() && AU.ctx) AU.start();
    syncSound();
  }
  function leave() {
    if (!active) return;
    active = false;
    var v = $("v-lucha");
    if (v) v.hidden = true;
    document.body.classList.remove("lu-on");
    AU.stop();
    syncSound();
  }
  function onHash() {
    var v = (location.hash.slice(1) || "home").split("/")[0];
    if (v === "lucha") enter();
    else if (MAIN_VIEWS.indexOf(v) > -1) leave();
    else AU.stop(); // an overlay such as #live: keep the page, silence the Temple
  }

  // ---------- interaction ----------
  function onClick(e) {
    var t = e.target.closest && e.target.closest("[data-lu-play],[data-lu-sound],[data-lu-jump]");
    if (!t) return;
    if (t.dataset.luSound != null) { toggleSound(); return; }
    if (t.dataset.luJump != null) {
      var li = $("lu-e" + t.dataset.luJump);
      if (li) li.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      AU.sfx("click");
      return;
    }
    if (t.dataset.luPlay != null) { AU.sfx("click"); playEp(+t.dataset.luPlay); }
  }
  var lastHover = null;
  function onHover(e) {
    var t = e.target.closest && e.target.closest(".lu-ep,.lu-btn,.lu-jump button,.lu-float");
    if (!t || t === lastHover) return;
    lastHover = t;
    AU.sfx(t.classList.contains("lu-ep") ? "hover" : "tick");
  }
  function onGesture(e) {
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    if (e.target.closest && e.target.closest("[data-lu-sound]")) return; // the toggle handles itself
    if (prefOn() && !AU.running) AU.start();
  }
  function prefOn() { try { return localStorage.getItem(SND_KEY) !== "off"; } catch (e) { return true; } }
  function setPref(on) { try { localStorage.setItem(SND_KEY, on ? "on" : "off"); } catch (e) {} }
  function toggleSound() {
    var on = !(prefOn() && AU.running);
    setPref(on);
    if (on) AU.start(); else AU.stop();
    syncSound();
  }
  function syncSound() {
    var on = prefOn(), live = AU.running;
    [].forEach.call(document.querySelectorAll("[data-lu-sound]"), function (b) {
      b.setAttribute("aria-pressed", on && live ? "true" : "false");
      b.setAttribute("aria-label", on && live ? "Mute the Temple" : "Turn on the Temple's sound");
      b.classList.toggle("is-live", on && live);
      var l = b.querySelector("[data-lu-sndlabel]");
      if (l) l.textContent = on && live ? "Sound on" : on ? "Sound" : "Sound off";
    });
    var h = $("lu-hint");
    if (h) h.hidden = !(on && !live && active);
  }

  // ---------- original soundscape (Web Audio only) ----------
  var AU = (function () {
    var A = { ctx: null, running: false, ducked: false };
    var master, comp, drone, wind, rumble, verb, verbIn, timers = [], lastSfx = 0;
    var TARGET = 0.85;
    function noiseBuf(ctx, secs, brown) {
      var n = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), last = 0;
      for (var i = 0; i < n; i++) {
        var w = Math.random() * 2 - 1;
        if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
      }
      return b;
    }
    function impulse(ctx, secs, decay) {
      var n = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(2, n, ctx.sampleRate);
      for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay); }
      return b;
    }
    function lfo(ctx, freq, depth, target) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq; g.gain.value = depth; o.connect(g); g.connect(target); o.start();
      return o;
    }
    function graph() {
      var ctx = A.ctx;
      comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.ratio.value = 4;
      comp.connect(ctx.destination);
      master = ctx.createGain(); master.gain.value = 0; master.connect(comp);
      // cavern reverb
      verb = ctx.createConvolver(); verb.buffer = impulse(ctx, 3.6, 2.6);
      var vg = ctx.createGain(); vg.gain.value = 0.55; verb.connect(vg); vg.connect(master);
      verbIn = verb;
      // deep drone: detuned saws in a breathing low-pass, plus a fifth below the floor
      drone = ctx.createGain(); drone.gain.value = 0.17; drone.connect(master);
      var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 150; lp.Q.value = 7; lp.connect(drone);
      [[43.65, "sawtooth", 0.5], [43.95, "sawtooth", 0.5], [65.4, "sine", 0.6], [32.7, "sine", 0.9]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain(); o.type = p[1]; o.frequency.value = p[0]; g.gain.value = p[2]; o.connect(g); g.connect(lp); o.start();
      });
      lfo(ctx, 0.06, 70, lp.frequency);
      lfo(ctx, 0.11, 0.05, drone.gain);
      // wind through the temple
      wind = ctx.createGain(); wind.gain.value = 0.045; wind.connect(master); wind.connect(verbIn);
      var ws = ctx.createBufferSource(); ws.buffer = noiseBuf(ctx, 4, false); ws.loop = true;
      var bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 520; bp.Q.value = 0.9;
      ws.connect(bp); bp.connect(wind); ws.start();
      lfo(ctx, 0.09, 320, bp.frequency);
      lfo(ctx, 0.05, 0.03, wind.gain);
      // distant crowd rumble under the floor
      rumble = ctx.createGain(); rumble.gain.value = 0.10; rumble.connect(master);
      var rs = ctx.createBufferSource(); rs.buffer = noiseBuf(ctx, 5, true); rs.loop = true;
      var rlp = ctx.createBiquadFilter(); rlp.type = "lowpass"; rlp.frequency.value = 260;
      var rbp = ctx.createBiquadFilter(); rbp.type = "peaking"; rbp.frequency.value = 180; rbp.gain.value = 6;
      rs.connect(rlp); rlp.connect(rbp); rbp.connect(rumble); rs.start();
      lfo(ctx, 0.035, 0.06, rumble.gain);
    }
    function drum(t, amp, f0) {
      var ctx = A.ctx, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(f0 || 105, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.2);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(amp, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
      o.connect(g); g.connect(master); g.connect(verbIn); o.start(t); o.stop(t + 0.5);
      // skin slap
      var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf(ctx, 0.08, false); nf.type = "lowpass"; nf.frequency.value = 900;
      ng.gain.setValueAtTime(amp * 0.25, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      n.connect(nf); nf.connect(ng); ng.connect(master); n.start(t);
    }
    function gong(t, amp) {
      var ctx = A.ctx, f0 = 71 + Math.random() * 6, out = ctx.createGain();
      out.gain.value = amp; out.connect(master); out.connect(verbIn);
      [[1, 1], [1.47, 0.7], [2.09, 0.55], [2.56, 0.42], [3.39, 0.3], [4.21, 0.22], [5.43, 0.12]].forEach(function (p, i) {
        var o = ctx.createOscillator(), g = ctx.createGain(), len = 7.5 - i * 0.6;
        o.type = "sine"; o.frequency.setValueAtTime(f0 * p[0] * 1.012, t); o.frequency.exponentialRampToValueAtTime(f0 * p[0], t + 1.4);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(p[1] * 0.3, t + 0.03 + i * 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + len + 0.1);
      });
      drum(t, 0.5, 80);
    }
    function whistle(t, amp) {
      // an Aztec "death whistle"-like shriek: resonant noise + a rough tone sweeping up then sagging, echoing off stone
      var ctx = A.ctx, n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter(), o = ctx.createOscillator(), og = ctx.createGain(), g = ctx.createGain();
      n.buffer = noiseBuf(ctx, 2.4, false);
      f.type = "bandpass"; f.Q.value = 14; f2.type = "bandpass"; f2.Q.value = 9;
      f.frequency.setValueAtTime(800, t); f.frequency.exponentialRampToValueAtTime(2700, t + 0.55); f.frequency.exponentialRampToValueAtTime(1300, t + 2.1);
      f2.frequency.setValueAtTime(1150, t); f2.frequency.exponentialRampToValueAtTime(3600, t + 0.6); f2.frequency.exponentialRampToValueAtTime(1800, t + 2.1);
      o.type = "sawtooth"; o.frequency.setValueAtTime(820, t); o.frequency.exponentialRampToValueAtTime(2600, t + 0.55); o.frequency.exponentialRampToValueAtTime(1250, t + 2.1);
      og.gain.value = 0.18;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(amp, t + 0.45); g.gain.setValueAtTime(amp, t + 0.9); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.3);
      n.connect(f); n.connect(f2); o.connect(og); og.connect(f);
      f.connect(g); f2.connect(g); g.connect(master); g.connect(verbIn);
      n.start(t); o.start(t); o.stop(t + 2.4);
    }
    function loop(fn, minS, maxS, first) {
      var id = { t: 0 };
      function go() {
        if (!A.running) return;
        if (!A.ducked) try { fn(); } catch (e) {}
        id.t = setTimeout(go, (minS + Math.random() * (maxS - minS)) * 1000);
      }
      id.t = setTimeout(go, (first != null ? first : minS) * 1000);
      timers.push(id);
    }
    function heart() {
      // lub-dub at ~54 bpm, scheduled a beat ahead for steady timing
      var beat = 1.1, next = A.ctx.currentTime + 0.1, id = { t: 0 };
      function tick() {
        if (!A.running) return;
        var now = A.ctx.currentTime;
        while (next < now + 0.3) {
          if (!A.ducked) { drum(next, 0.55); drum(next + 0.24, 0.32); }
          next += beat;
        }
        id.t = setTimeout(tick, 100);
      }
      tick();
      timers.push(id);
    }
    A.start = function () {
      try {
        if (!A.ctx) {
          var C = window.AudioContext || window.webkitAudioContext;
          if (!C) return;
          A.ctx = new C();
          graph();
        }
        if (A.running) return;
        A.running = true;
        var p = A.ctx.resume && A.ctx.resume();
        if (p && p.then) p.then(syncSound, function () {});
        A.ducked = !!($("player") && !$("player").hidden);
        var t = A.ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(A.ducked ? 0 : TARGET, t + 2.2);
        heart();
        loop(function () { gong(A.ctx.currentTime + 0.05, 0.55); }, 17, 31, 3.5);
        loop(function () { whistle(A.ctx.currentTime + 0.05, 0.07); }, 34, 60, 11);
      } catch (e) { A.running = false; }
      syncSound();
    };
    A.stop = function () {
      if (!A.ctx || !A.running) { A.running = false; return; }
      A.running = false;
      timers.forEach(function (x) { clearTimeout(x.t); });
      timers = [];
      try {
        var t = A.ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(0, t + 0.35);
      } catch (e) {}
      setTimeout(function () { if (!A.running && A.ctx && A.ctx.state === "running") A.ctx.suspend().catch(function () {}); }, 420);
    };
    A.duck = function (on) {
      A.ducked = on;
      if (!A.ctx || !A.running) return;
      try {
        var t = A.ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(on ? 0 : TARGET, t + (on ? 0.25 : 1.6));
      } catch (e) {}
    };
    A.sfx = function (kind) {
      if (!A.ctx || !A.running || A.ducked) return;
      var now = performance.now();
      if (kind !== "click" && now - lastSfx < 70) return;
      lastSfx = now;
      try {
        var ctx = A.ctx, t = ctx.currentTime + 0.01;
        if (kind === "click") {
          drum(t, 0.8, 140);
          [880, 1318, 1975].forEach(function (f, i) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.type = "triangle"; o.frequency.value = f;
            g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05 / (i + 1), t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
            o.connect(g); g.connect(master); g.connect(verbIn); o.start(t); o.stop(t + 1);
          });
        } else {
          // stone knock (cards) or a dry wooden tick (buttons)
          var o = ctx.createOscillator(), g = ctx.createGain(), hi = kind === "tick";
          o.type = "sine"; o.frequency.setValueAtTime(hi ? 900 : 420, t); o.frequency.exponentialRampToValueAtTime(hi ? 500 : 190, t + 0.07);
          g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(hi ? 0.06 : 0.12, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
          o.connect(g); g.connect(master); if (!hi) g.connect(verbIn); o.start(t); o.stop(t + 0.15);
          var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
          n.buffer = noiseBuf(ctx, 0.05, false); nf.type = "bandpass"; nf.frequency.value = hi ? 3200 : 1800; nf.Q.value = 2;
          ng.gain.setValueAtTime(0.05, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
          n.connect(nf); nf.connect(ng); ng.connect(master); n.start(t);
        }
      } catch (e) {}
    };
    return A;
  })();

  // silence while a video plays; come back when the player closes (only inside the hub)
  function watchPlayer() {
    var p = $("player");
    if (!p || !window.MutationObserver) return;
    new MutationObserver(function () {
      var open = !p.hidden;
      AU.duck(open);
      if (!open) drawProgress();
    }).observe(p, { attributes: true, attributeFilter: ["hidden"] });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") { if (AU.running) { AU.stop(); AU.resumeOnShow = true; } }
    else if (AU.resumeOnShow) { AU.resumeOnShow = false; if (active && prefOn()) AU.start(); syncSound(); }
  });

  window.__lucha = { items: ITEMS, audio: AU, enter: enter, leave: leave, play: playEp, toggleSound: toggleSound };
  watchPlayer();
  window.addEventListener("hashchange", onHash);
  onHash();
})();
