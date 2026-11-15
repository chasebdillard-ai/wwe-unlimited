/* LIVE channels for members. Shared account with Blockbuster+ (same origin, same Supabase session). */
(function () {
  "use strict";
  var CFG = window.LIVE_CFG || {};
  var SB = "https://cubbuiahnhgfpdeubldu.supabase.co", KEY = "sb_publishable_Sj8SNl5Zi0AwjxsIrNGNtQ_B--yHhYi", SKEY = "hvplus_session";
  var EPOCH = Date.UTC(2026, 10, 15, 5, 0, 0) / 1000; // Sun Nov 15 2026, 12:00 AM Eastern
  var PHONE_DOMAIN = "phone.blockbuster-plus.app";
  var curIdx = 0, session = null, DATA = null, cur = null, player = null, timer = null, guideTimer = null, skips = 0;
  var d = document;

  function nowS() { return Date.now() / 1000; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function load() { try { session = JSON.parse(localStorage.getItem(SKEY) || "null"); } catch (e) { session = null; } }
  function save() { try { if (session) localStorage.setItem(SKEY, JSON.stringify(session)); else localStorage.removeItem(SKEY); } catch (e) {} }
  function setSession(x) {
    var s = x && x.session && x.session.access_token ? x.session : x;
    if (!s || !s.access_token) return false;
    session = { access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at || Math.floor(nowS()) + (s.expires_in || 3600), user: s.user || x.user };
    save(); return true;
  }
  function post(path, body) {
    return fetch(SB + path, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.text().then(function (t) { var j = {}; try { j = t ? JSON.parse(t) : {}; } catch (e) {} if (!r.ok) { var e = new Error(j.msg || j.error_description || j.message || ("Error " + r.status)); e.code = j.error_code || j.code; throw e; } return j; }); });
  }
  function refreshIfNeeded() {
    if (!session) return Promise.resolve(false);
    if (session.expires_at - nowS() > 60) return Promise.resolve(true);
    return post("/auth/v1/token?grant_type=refresh_token", { refresh_token: session.refresh_token })
      .then(function (j) { return setSession(j); }, function () { session = null; save(); return false; });
  }
  function toEmail(id) {
    id = String(id || "").trim();
    if (id.indexOf("@") > 0) return { email: id.toLowerCase(), phone: "" };
    var digits = id.replace(/\D/g, "");
    if (digits.length === 10) digits = "1" + digits;
    if (digits.length < 11) return null;
    return { email: "p" + digits + "@" + PHONE_DOMAIN, phone: "+" + digits };
  }
  function friendly(e) {
    var m = String(e && e.message || ""), c = String(e && e.code || "");
    if (/invalid_credentials|Invalid login/i.test(c + m)) return "That email/phone and password don't match.";
    if (/already|exists|registered/i.test(c + m)) return "That email or phone already has an account. Sign in instead.";
    if (/weak|least 6|password/i.test(c + m)) return "Password needs at least 6 characters.";
    if (/Failed to fetch|NetworkError/i.test(m)) return "Can't reach the server. Check your connection.";
    return m || "Something went wrong. Try again.";
  }

  // ---------- styles ----------
  var css = "" +
    ".lv-btn{position:fixed;right:14px;bottom:14px;z-index:9998;display:flex;align-items:center;gap:8px;padding:11px 16px;border-radius:999px;border:0;background:#d90429;color:#fff;font:800 15px/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;box-shadow:0 6px 24px rgba(0,0,0,.45);cursor:pointer}" +
    ".lv-dot{width:10px;height:10px;border-radius:50%;background:#fff;animation:lvp 1.4s infinite}@keyframes lvp{50%{opacity:.25}}" +
    ".lv-ov{position:fixed;inset:0;z-index:9999;background:#07080c;color:#f2f2f5;overflow:auto;font:15px/1.45 system-ui,-apple-system,sans-serif;-webkit-overflow-scrolling:touch}" +
    ".lv-ov[hidden]{display:none}.lv-wrap{max-width:1100px;margin:0 auto;padding:14px 14px 40px}" +
    ".lv-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}" +
    ".lv-top h2{margin:0;font-size:20px;letter-spacing:.04em;display:flex;align-items:center;gap:10px}" +
    ".lv-badge{background:#d90429;color:#fff;padding:3px 8px;border-radius:4px;font-size:12px;font-weight:800;letter-spacing:.1em}" +
    ".lv-x{background:#1b1d26;color:#fff;border:0;border-radius:999px;padding:9px 14px;font-weight:700;cursor:pointer}" +
    ".lv-tabs{display:flex;gap:8px;overflow-x:auto;margin-bottom:12px}" +
    ".lv-tab{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;border:2px solid #22252f;background:#11131a;color:#fff;font-weight:800;cursor:pointer}" +
    ".lv-tab img{height:22px;width:auto}.lv-tab[aria-pressed=true]{border-color:var(--c,#d90429);background:#1a1d27}" +
    ".lv-screen{position:relative;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden}" +
    ".lv-screen iframe,.lv-screen>div{position:absolute;inset:0;width:100%;height:100%;border:0}" +
    ".lv-bug{position:absolute;top:10px;left:10px;z-index:2;pointer-events:none;background:rgba(0,0,0,.55);padding:4px 8px;border-radius:6px;font-weight:800;font-size:12px;letter-spacing:.08em}" +
    ".lv-now{margin:12px 0 4px;font-size:13px;color:#9aa0ad;text-transform:uppercase;letter-spacing:.08em}.lv-title{margin:0;font-size:19px}" +
    ".lv-bar{height:4px;background:#22252f;border-radius:3px;margin:10px 0 18px;overflow:hidden}.lv-bar i{display:block;height:100%;background:var(--c,#d90429)}" +
    ".lv-guide{list-style:none;margin:0;padding:0;border-top:1px solid #22252f}.lv-guide li{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #22252f}" +
    ".lv-guide b{flex:0 0 78px;color:#9aa0ad;font-weight:700}.lv-guide span{flex:1}" +
    ".lv-auth{max-width:420px;margin:40px auto;background:#11131a;border:1px solid #22252f;border-radius:14px;padding:22px}" +
    ".lv-auth h3{margin:0 0 6px;font-size:22px}.lv-auth p{margin:0 0 14px;color:#b8bcc8}" +
    ".lv-auth label{display:block;font-size:13px;font-weight:700;margin:10px 0 4px;color:#c8ccd6}" +
    ".lv-auth input{width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid #333847;background:#07080c;color:#fff;font-size:16px}" +
    ".lv-go{width:100%;margin-top:16px;padding:13px;border:0;border-radius:10px;background:#d90429;color:#fff;font-weight:800;font-size:16px;cursor:pointer}" +
    ".lv-sw{margin-top:12px;text-align:center;font-size:14px}.lv-sw button{background:none;border:0;color:#7fb2ff;font-weight:700;cursor:pointer;font-size:14px}" +
    ".lv-n{font-size:12px;font-weight:700;color:#cfd3dc;background:#0007;padding:2px 6px;border-radius:999px}.lv-watch{position:absolute;top:10px;right:10px;z-index:2;pointer-events:none;background:rgba(217,4,41,.9);padding:4px 9px;border-radius:6px;font-weight:800;font-size:12px}" +
    ".lv-slate{position:absolute;inset:0;z-index:1;overflow:hidden;background:#050507;display:grid;place-items:center;text-align:center}" +
    ".lv-sl-bg{position:absolute;inset:-20%;background:radial-gradient(60% 50% at 50% 45%,rgba(212,160,23,.28),transparent 70%),repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,transparent 1px 3px);animation:lvSl 6s ease-in-out infinite}" +
    ".lv-sl-in{position:relative;padding:44px 4% 4%}.lv-bug{max-width:calc(100% - 200px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lv-sl-k{margin:0 0 2%;font:800 clamp(10px,1.6vw,14px)/1 system-ui,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#d4a017}" +
    ".lv-sl-a{margin:0;font:600 clamp(14px,3vw,28px)/1.1 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#e9e9ee}" +
    ".lv-sl-b{margin:.15em 0 .35em;font:900 clamp(30px,8vw,84px)/1 system-ui,sans-serif;letter-spacing:.04em;color:#fff;text-shadow:0 0 30px rgba(217,4,41,.6);animation:lvGl 2.4s ease-in-out infinite}" +
    ".lv-sl-n{margin:0;font:600 clamp(12px,2vw,17px)/1.35 system-ui,sans-serif;color:#cfd3dc}.lv-sl-n b{color:#fff}.lv-sl-c{margin:.5em 0 0;font:800 clamp(13px,2.2vw,20px)/1 ui-monospace,Menlo,monospace;color:#d4a017;letter-spacing:.06em}" +
    "@keyframes lvSl{50%{transform:scale(1.08) translateY(2%)}}@keyframes lvGl{50%{text-shadow:0 0 46px rgba(217,4,41,.95),0 0 4px #fff}}" + /* EOTN:css */
    ".lv-err{color:#ff7a8a;font-size:14px;margin-top:10px;min-height:1em}.lv-me{font-size:13px;color:#9aa0ad}.lv-me button{background:none;border:0;color:#7fb2ff;cursor:pointer;font-size:13px}";
  var st = d.createElement("style"); st.textContent = css; d.head.appendChild(st);

  // ---------- shell ----------
  var btn = d.createElement("button"); btn.className = "lv-btn"; btn.type = "button";
  btn.innerHTML = '<span class="lv-dot"></span>LIVE TV'; btn.setAttribute("aria-label", "Open live channels");
  var ov = d.createElement("div"); ov.className = "lv-ov"; ov.hidden = true; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Live channels");
  d.body.appendChild(btn); d.body.appendChild(ov);
  btn.addEventListener("click", open);
  if (location.hash === "#live") setTimeout(open, 50);

  window.__lvOpen = function (ch) { if (ch) { cur = ch; try { localStorage.setItem("live_ch_" + (CFG.site || ""), ch); } catch (e) {} } if (!ov.hidden && DATA && session) { tune(ch); return; } open(); }; // EOTN:open
  function open() { ov.hidden = false; d.documentElement.style.overflow = "hidden"; if (location.hash !== "#live") history.replaceState(null, "", "#live"); render(); }
  function close() {
    rtStop(); ov.hidden = true; d.documentElement.style.overflow = ""; stop();
    if (location.hash === "#live") history.replaceState(null, "", location.pathname + location.search);
  }
  function stop() { clearTimeout(timer); clearInterval(guideTimer); if (player && player.destroy) { try { player.destroy(); } catch (e) {} } player = null; }

  function top(extra) {
    return '<div class="lv-top"><h2><span class="lv-badge">LIVE</span>' + esc(CFG.brand || "Live TV") + '</h2><div>' + (extra || "") + '<button class="lv-x" type="button" data-close>✕ Close</button></div></div>';
  }
  function wire() { ov.querySelectorAll("[data-close]").forEach(function (b) { b.onclick = close; }); }

  function render() {
    load();
    refreshIfNeeded().then(function (ok) { if (ok) renderLive(); else renderAuth("up"); });
  }

  // ---------- account ----------
  function renderAuth(mode) {
    stop();
    var up = mode === "up";
    ov.innerHTML = '<div class="lv-wrap">' + top() + '<form class="lv-auth" novalidate>' +
      "<h3>" + (up ? "Create a free account" : "Sign in") + "</h3>" +
      "<p>" + (up ? "Members get " + esc(CFG.pitch || "live channels") + ", playing 24/7. Everyone watches the same thing at the same time." : "Welcome back. Your Blockbuster+ account works here too.") + "</p>" +
      (up ? '<label for="lv-name">Display name</label><input id="lv-name" autocomplete="nickname" maxlength="40">' : "") +
      '<label for="lv-id">Email or phone number</label><input id="lv-id" autocomplete="username" inputmode="email" required>' +
      (up ? '<label for="lv-ph">Phone (optional, if you used email above)</label><input id="lv-ph" type="tel" autocomplete="tel">' : "") +
      '<label for="lv-pw">Password</label><input id="lv-pw" type="password" autocomplete="' + (up ? "new-password" : "current-password") + '" minlength="6" required>' +
      '<div class="lv-err" role="alert"></div><button class="lv-go" type="submit">' + (up ? "Create account" : "Sign in") + "</button>" +
      '<div class="lv-sw">' + (up ? 'Already a member? <button type="button" data-sw="in">Sign in</button>' : 'New here? <button type="button" data-sw="up">Create an account</button>') + "</div></form></div>";
    wire();
    ov.querySelector("[data-sw]").onclick = function () { renderAuth(this.dataset.sw); };
    var f = ov.querySelector("form"), err = ov.querySelector(".lv-err"), go = ov.querySelector(".lv-go");
    f.onsubmit = function (ev) {
      ev.preventDefault(); err.textContent = "";
      var who = toEmail(f.querySelector("#lv-id").value), pw = f.querySelector("#lv-pw").value;
      if (!who) { err.textContent = "Enter an email or a full phone number with area code."; return; }
      if (pw.length < 6) { err.textContent = "Password needs at least 6 characters."; return; }
      go.disabled = true; go.textContent = up ? "Creating…" : "Signing in…";
      var p;
      if (up) {
        var nm = (f.querySelector("#lv-name").value || "").trim(), ph = (f.querySelector("#lv-ph").value || "").trim() || who.phone;
        p = post("/auth/v1/signup", { email: who.email, password: pw, data: { display_name: nm || (who.phone ? "Member" : who.email.split("@")[0]), phone: ph, signup_site: "WWE Unlimited" } })
          .then(function (j) { if (setSession(j)) return j; return post("/auth/v1/token?grant_type=password", { email: who.email, password: pw }); });
      } else p = post("/auth/v1/token?grant_type=password", { email: who.email, password: pw });
      p.then(function (j) { if (j && j.access_token) setSession(j); if (!session) throw new Error("Couldn't sign in."); renderLive(); },
        function (e) { err.textContent = friendly(e); go.disabled = false; go.textContent = up ? "Create account" : "Sign in"; });
    };
  }
  function signOut() {
    if (session) fetch(SB + "/auth/v1/logout", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + session.access_token } }).catch(function () {});
    session = null; save(); rtStop(); renderAuth("in");
  }


  // ---------- live viewer counts (Supabase Realtime presence) ----------
  var rt = { ws: null, ref: 1, joined: false, state: {}, hb: null, retry: null, want: false };
  function rtSend(o) { if (rt.ws && rt.ws.readyState === 1) rt.ws.send(JSON.stringify(o)); }
  function rtTopic() { return "realtime:live-" + (CFG.site || "site"); }
  function rtTrack() { if (rt.joined && cur) rtSend({ topic: rtTopic(), event: "presence", payload: { type: "presence", event: "track", payload: { ch: cur } }, ref: String(++rt.ref), join_ref: "1" }); }
  function rtStart() {
    rt.want = true;
    if (rt.ws || !window.WebSocket) return;
    var uid = session && session.user && session.user.id || ("anon-" + Math.random().toString(36).slice(2));
    var ws = rt.ws = new WebSocket(SB.replace("https", "wss") + "/realtime/v1/websocket?apikey=" + KEY + "&vsn=1.0.0");
    ws.onopen = function () {
      rt.state = {}; rt.joined = false;
      rtSend({ topic: rtTopic(), event: "phx_join", payload: { config: { presence: { key: uid }, broadcast: { self: false }, private: false } }, ref: "1", join_ref: "1" });
      rt.hb = setInterval(function () { rtSend({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(++rt.ref) }); }, 25000);
    };
    ws.onmessage = function (e) {
      var m; try { m = JSON.parse(e.data); } catch (x) { return; }
      if (m.event === "phx_reply" && m.ref === "1" && m.payload && m.payload.status === "ok") { rt.joined = true; rtTrack(); }
      else if (m.event === "presence_state") { rt.state = m.payload || {}; counts(); }
      else if (m.event === "presence_diff") {
        var j = m.payload.joins || {}, l = m.payload.leaves || {};
        Object.keys(l).forEach(function (k) {
          var gone = (l[k].metas || []).map(function (x) { return x.phx_ref; });
          if (rt.state[k]) { rt.state[k].metas = rt.state[k].metas.filter(function (x) { return gone.indexOf(x.phx_ref) < 0; }); if (!rt.state[k].metas.length) delete rt.state[k]; }
        });
        Object.keys(j).forEach(function (k) { rt.state[k] = rt.state[k] || { metas: [] }; rt.state[k].metas = rt.state[k].metas.concat(j[k].metas || []); });
        counts();
      }
    };
    ws.onclose = function () {
      clearInterval(rt.hb); rt.ws = null; rt.joined = false;
      if (rt.want) { clearTimeout(rt.retry); rt.retry = setTimeout(rtStart, 4000); }
    };
  }
  function rtStop() { rt.want = false; clearTimeout(rt.retry); if (rt.ws) { try { rt.ws.close(); } catch (e) {} } rt.ws = null; rt.state = {}; }
  function counts() {
    var c = {}, total = 0;
    Object.keys(rt.state).forEach(function (k) { var ms = rt.state[k].metas || []; var last = ms[ms.length - 1]; if (last && last.ch) { c[last.ch] = (c[last.ch] || 0) + 1; total++; } });
    ov.querySelectorAll("[data-ch]").forEach(function (b) { var n = b.querySelector(".lv-n"); if (!n) { n = d.createElement("span"); n.className = "lv-n"; b.appendChild(n); } n.textContent = "👁 " + (c[b.dataset.ch] || 0); });
    var w = ov.querySelector(".lv-watch"); if (w && cur) { var n2 = c[cur] || 0; w.textContent = "👁 " + n2.toLocaleString() + " watching now"; }
  }

  // ---------- schedule ----------
  function getData() {
    if (DATA) return Promise.resolve(DATA);
    return fetch(CFG.data + "?v=" + (CFG.ver || 1)).then(function (r) { return r.json(); }).then(function (j) {
      DATA = {};
      Object.keys(j).forEach(function (k) {
        var L = j[k], tot = 0, starts = [];
        L.forEach(function (x) { starts.push(tot); tot += x[2]; });
        DATA[k] = { items: L, starts: starts, total: tot };
      });
      (CFG.channels || []).forEach(function (c) { if (c.events) DATA[c.id] = { sched: c.events.slice().sort(function (x, y) { return x[0] - y[0]; }), items: [], starts: [], total: 0 }; }); // EOTN:data
      return DATA;
    });
  }
  function at(ch, t) {
    var c = DATA[ch], pos = ((t - EPOCH) % c.total + c.total) % c.total, lo = 0, hi = c.items.length - 1;
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (c.starts[mid] <= pos) lo = mid; else hi = mid - 1; }
    return { i: lo, off: pos - c.starts[lo], begin: t - (pos - c.starts[lo]) };
  }
  function fmtTime(t) { return new Date(t * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }

  function renderLive() {
    stop();
    var chs = CFG.channels || [];
    var curCh = cur && chs.some(function (c) { return c.id === cur; }) ? cur : (localStorage.getItem("live_ch_" + (CFG.site || "")) || chs[0].id);
    if (!chs.some(function (c) { return c.id === curCh; })) curCh = chs[0].id;
    var email = session && session.user && session.user.email || "";
    var me = /@phone\.blockbuster-plus\.app$/.test(email) ? "+" + email.slice(1, email.indexOf("@")) : email;
    ov.innerHTML = '<div class="lv-wrap">' + top('<span class="lv-me">' + esc(me) + ' · <button type="button" data-out>Sign out</button></span> ') +
      (chs.length > 1 ? '<div class="lv-tabs" role="tablist">' + chs.map(function (c) {
        return '<button class="lv-tab" type="button" role="tab" data-ch="' + c.id + '" style="--c:' + c.color + '">' + (c.logo ? '<img src="' + c.logo + '" alt="">' : "") + esc(c.name) + "</button>";
      }).join("") + "</div>" : "") +
      '<div class="lv-screen"><span class="lv-bug"></span><span class="lv-watch">👁 … watching now</span><div id="lv-player"></div></div>' +
      '<p class="lv-now">Now playing</p><h3 class="lv-title"></h3><div class="lv-bar"><i></i></div>' +
      '<p class="lv-now">Coming up</p><ul class="lv-guide"></ul></div>';
    wire();
    ov.querySelector("[data-out]").onclick = signOut;
    ov.querySelectorAll("[data-ch]").forEach(function (b) { b.onclick = function () { tune(b.dataset.ch); }; });
    ov.querySelector(".lv-guide").innerHTML = "<li><span>Loading the schedule…</span></li>";
    rtStart();
    getData().then(function () { tune(curCh); }, function () { ov.querySelector(".lv-guide").innerHTML = "<li><span>Couldn't load the schedule. Check your connection.</span></li>"; });
  }

  function ytReady() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    return new Promise(function (res) {
      var prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () { if (prev) prev(); res(); };
      if (!d.getElementById("yt-api")) { var s = d.createElement("script"); s.id = "yt-api"; s.src = "https://www.youtube.com/iframe_api"; d.head.appendChild(s); }
    });
  }

  function tune(ch, forceIdx) {
    cur = ch; try { localStorage.setItem("live_ch_" + (CFG.site || ""), ch); } catch (e) {}
    var cfg = (CFG.channels || []).filter(function (c) { return c.id === ch; })[0] || {};
    ov.querySelectorAll("[data-ch]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.ch === ch); });
    ov.querySelector(".lv-wrap").style.setProperty("--c", cfg.color || "#d90429");
    ov.querySelector(".lv-bug").textContent = "● LIVE · " + (cfg.name || "");
    rtTrack(); counts();
    if (DATA[ch] && DATA[ch].sched) { tuneSched(ch); return; } unslate(); // EOTN:tune
    var c = DATA[ch], t = nowS(), a = at(ch, t), idx = a.i, off = a.off, begin = a.begin;
    if (forceIdx != null) { idx = forceIdx % c.items.length; off = 0; begin = t; }
    var it = c.items[idx]; curIdx = idx;
    ov.querySelector(".lv-title").textContent = it[1];
    guide(ch, idx, begin);
    clearInterval(guideTimer);
    guideTimer = setInterval(function () { var p = Math.min(100, (nowS() - begin) / it[2] * 100); var bar = ov.querySelector(".lv-bar i"); if (bar) bar.style.width = p + "%"; }, 1000);
    clearTimeout(timer);
    timer = setTimeout(function () { skips = 0; tune(ch); }, Math.max(2, it[2] - off + 1) * 1000);
    ytReady().then(function () {
      if (cur !== ch) return;
      var vars = { autoplay: 1, start: Math.floor(off), playsinline: 1, rel: 0, modestbranding: 1 };
      if (player && player.loadVideoById) { player.loadVideoById({ videoId: it[0], startSeconds: Math.floor(off) }); return; }
      player = new YT.Player("lv-player", { videoId: it[0], playerVars: vars, host: "https://www.youtube.com",
        events: {
          onReady: function (e) { try { e.target.playVideo(); } catch (x) {} },
          onError: function () { // can't play here: move on to the next program
            if (DATA[cur] && DATA[cur].sched) { slate(null, 1); return; } // EOTN:err
            if (++skips > 8) return; tune(cur, curIdx + 1);
          },
          onStateChange: function (e) { if (e.data === 0) { skips = 0; tune(cur); } }
        } });
    });
  }

  // EOTN:sched, "Event of the Night": one scheduled event per night at 8 PM ET. Otherwise it shows a looping "Stay tuned" slate.
  function etTime(t) { try { return new Date(t * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }).replace(/ /g, "\u00a0") + "\u00a0ET"; } catch (e) { return fmtTime(t); } }
  function etDay(t) {
    try {
      var f = function (x) { return new Date(x * 1000).toLocaleDateString("en-US", { timeZone: "America/New_York" }); };
      var n = nowS();
      if (f(t) === f(n)) return "Tonight";
      if (f(t) === f(n + 86400)) return "Tomorrow";
      return new Date(t * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York" });
    } catch (e) { return ""; }
  }
  function hms(s) { s = Math.max(0, Math.floor(s)); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (x < 10 ? "0" : "") + x; }
  function schedNext(c, t) { for (var i = 0; i < c.sched.length; i++) if (c.sched[i][0] > t) return c.sched[i]; return null; }
  function schedNow(c, t) { for (var i = 0; i < c.sched.length; i++) { var e = c.sched[i]; if (e[0] <= t && t < e[0] + e[3]) return e; } return null; }
  function unslate() {
    var sc = ov.querySelector(".lv-screen"); if (!sc) return;
    var s = sc.querySelector(".lv-slate"); if (s) s.parentNode.removeChild(s);
    var p = sc.querySelector("#lv-player"); if (!p) { p = d.createElement("div"); p.id = "lv-player"; sc.appendChild(p); }
    p.style.display = "";
  }
  function slate(nx, trouble) {
    var sc = ov.querySelector(".lv-screen"); if (!sc) return;
    if (player && player.destroy) { try { player.destroy(); } catch (e) {} } player = null;
    sc.querySelectorAll("#lv-player,.lv-slate").forEach(function (n) { n.parentNode.removeChild(n); });
    var p = d.createElement("div"); p.id = "lv-player"; p.style.display = "none"; sc.appendChild(p);
    var s = d.createElement("div"); s.className = "lv-slate";
    s.innerHTML = '<div class="lv-sl-bg"></div><div class="lv-sl-in"><p class="lv-sl-k">Event of the Night</p>' +
      '<p class="lv-sl-a">Stay tuned to</p><p class="lv-sl-b">WWE UNLIMITED</p>' +
      (trouble ? '<p class="lv-sl-n">We\'re having trouble with tonight\'s broadcast. Stay tuned.</p>' :
        nx ? '<p class="lv-sl-n">Up next: <b>' + esc(nx[2]) + '</b> · ' + etDay(nx[0]) + " " + etTime(nx[0]) + '</p><p class="lv-sl-c" data-cd="' + nx[0] + '"></p>' :
        '<p class="lv-sl-n">Every night at 8:00 PM ET</p>') + "</div>";
    sc.appendChild(s);
  }
  function tuneSched(ch) {
    var c = DATA[ch], t = nowS(), ev = schedNow(c, t), nx = schedNext(c, t);
    clearTimeout(timer); clearInterval(guideTimer);
    var bar = ov.querySelector(".lv-bar i"), h = "";
    c.sched.filter(function (e) { return e[0] > t; }).slice(0, 7).forEach(function (e) { h += "<li><b>" + etDay(e[0]) + "<br>" + etTime(e[0]) + "</b><span>" + esc(e[2]) + "</span></li>"; });
    if (ev) h += "<li><b>" + etTime(ev[0] + ev[3]) + "</b><span>Stay tuned to WWE Unlimited</span></li>";
    ov.querySelector(".lv-guide").innerHTML = h || "<li><b>8:00 PM ET</b><span>Next event of the night coming soon</span></li>";
    if (!ev) {
      ov.querySelector(".lv-title").textContent = "Stay Tuned to WWE Unlimited";
      if (bar) bar.style.width = "0%";
      slate(nx);
      var tick = function () { var el = ov.querySelector("[data-cd]"); if (el) el.textContent = "Starts in " + hms(+el.getAttribute("data-cd") - nowS()); };
      tick(); guideTimer = setInterval(tick, 1000);
      if (nx) timer = setTimeout(function () { if (cur === ch) tune(ch); }, Math.min(2147000000, Math.max(1000, (nx[0] - nowS()) * 1000 + 500)));
      return;
    }
    var off = t - ev[0];
    ov.querySelector(".lv-title").textContent = ev[2];
    unslate();
    guideTimer = setInterval(function () { var b = ov.querySelector(".lv-bar i"); if (b) b.style.width = Math.min(100, (nowS() - ev[0]) / ev[3] * 100) + "%"; }, 1000);
    timer = setTimeout(function () { if (cur === ch) tune(ch); }, Math.max(2, ev[0] + ev[3] - nowS() + 1) * 1000);
    ytReady().then(function () {
      if (cur !== ch) return;
      if (player && player.loadVideoById) { player.loadVideoById({ videoId: ev[1], startSeconds: Math.floor(off) }); return; }
      player = new YT.Player("lv-player", { videoId: ev[1], host: "https://www.youtube.com",
        playerVars: { autoplay: 1, start: Math.floor(off), playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: function (e) { try { e.target.playVideo(); } catch (x) {} },
          onError: function () { if (DATA[cur] && DATA[cur].sched) slate(null, 1); else if (++skips <= 8) tune(cur, curIdx + 1); },
          onStateChange: function (e) { if (e.data === 0) { skips = 0; tune(cur); } }
        } });
    });
  }
  // EOTN:end
  function guide(ch, idx, begin) {
    var c = DATA[ch], h = "", t = begin + c.items[idx][2];
    for (var k = 1; k <= 8; k++) { var it = c.items[(idx + k) % c.items.length]; h += "<li><b>" + fmtTime(t) + "</b><span>" + esc(it[1]) + "</span></li>"; t += it[2]; }
    ov.querySelector(".lv-guide").innerHTML = h;
  }

  d.addEventListener("keydown", function (e) { if (e.key === "Escape" && !ov.hidden) close(); });
})();
