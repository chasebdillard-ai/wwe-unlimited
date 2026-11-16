/* Member comments on videos + live chat on LIVE TV. Shared Supabase accounts (hvplus_session). Config: window.HKC = {site, stage, anchor, place} */
(function () {
  var C = window.HKC || {}; if (!C.site) return;
  var SB = "https://cubbuiahnhgfpdeubldu.supabase.co", KEY = "sb_publishable_Sj8SNl5Zi0AwjxsIrNGNtQ_B--yHhYi", SKEY = "hvplus_session";
  var d = document;
  function now() { return Date.now() / 1000; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function sess() { try { return JSON.parse(localStorage.getItem(SKEY) || "null"); } catch (e) { return null; } }
  function token() {
    var s = sess(); if (!s || !s.access_token) return Promise.resolve(null);
    if ((s.expires_at || 0) - now() > 60) return Promise.resolve(s);
    return fetch(SB + "/auth/v1/token?grant_type=refresh_token", { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: s.refresh_token }) })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (!j || !j.access_token) return null;
        var n = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at || Math.floor(now()) + (j.expires_in || 3600), user: j.user || s.user };
        try { localStorage.setItem(SKEY, JSON.stringify(n)); } catch (e) {} return n;
      }, function () { return null; });
  }
  function list(key, opt) {
    var q = SB + "/rest/v1/comments?select=id,user_id,display_name,body,created_at&site=eq." + C.site + "&video_key=eq." + encodeURIComponent(key) +
      "&order=created_at." + (opt.asc ? "asc" : "desc") + "&limit=" + (opt.limit || 100) + (opt.since ? "&created_at=gt." + encodeURIComponent(opt.since) : "");
    return token().then(function (s) {
      return fetch(q, { headers: { apikey: KEY, Authorization: "Bearer " + (s ? s.access_token : KEY) } }).then(function (r) { return r.ok ? r.json() : []; });
    });
  }
  function add(key, body) {
    return token().then(function (s) {
      if (!s) throw new Error("signin");
      return fetch(SB + "/rest/v1/comments", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + s.access_token, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({ site: C.site, video_key: key, body: body }) }).then(function (r) { if (!r.ok) throw new Error("post"); return r.json(); });
    });
  }
  function del(id) {
    return token().then(function (s) { if (!s) return; return fetch(SB + "/rest/v1/comments?id=eq." + id, { method: "DELETE", headers: { apikey: KEY, Authorization: "Bearer " + s.access_token } }); });
  }
  function ago(t) {
    var s = Math.max(0, now() - Date.parse(t) / 1000);
    if (s < 60) return "just now"; if (s < 3600) return Math.floor(s / 60) + "m ago"; if (s < 86400) return Math.floor(s / 3600) + "h ago";
    if (s < 86400 * 30) return Math.floor(s / 86400) + "d ago";
    try { return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch (e) { return ""; }
  }
  function me() { var s = sess(); return s && s.user ? s.user.id : null; }
  function signIn() { if (window.__lvOpen) window.__lvOpen(); }

  var st = d.createElement("style");
  st.textContent =
    ".hkc{margin:18px 0 8px;background:#0d0d10;color:#f3f3f5;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px;font:15px/1.45 system-ui,-apple-system,sans-serif;text-align:left}" +
    ".hkc h3{margin:0 0 10px;font:800 17px/1.2 system-ui,-apple-system,sans-serif;letter-spacing:.02em;text-transform:uppercase;color:#fff}.hkc h3 small{font-weight:600;color:rgba(255,255,255,.6);margin-left:6px;text-transform:none}" +
    ".hkc form{display:grid;gap:8px;margin-bottom:12px}.hkc textarea,.hkc input{width:100%;box-sizing:border-box;background:#18181d;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:10px 12px;font:15px/1.4 system-ui,-apple-system,sans-serif;resize:vertical}" +
    ".hkc textarea{min-height:64px}.hkc .row{display:flex;gap:8px;align-items:center}.hkc .row input{flex:1}" +
    ".hkc button.go{justify-self:end;background:#ffd400;color:#0a0a0a;border:0;border-radius:999px;padding:9px 18px;font:800 14px system-ui,-apple-system,sans-serif;cursor:pointer;min-height:40px}" +
    ".hkc button.go:disabled{opacity:.5}.hkc .si{background:#18181d;border:1px dashed rgba(255,255,255,.25);border-radius:10px;padding:12px;margin-bottom:12px;color:rgba(255,255,255,.8)}" +
    ".hkc .si button{background:none;border:0;color:#ffd400;font:700 15px system-ui,-apple-system,sans-serif;cursor:pointer;padding:0;text-decoration:underline}" +
    ".hkc ul{list-style:none;margin:0;padding:0;display:grid;gap:12px}.hkc li{display:grid;gap:2px;border-top:1px solid rgba(255,255,255,.08);padding-top:10px}" +
    ".hkc li b{color:#fff;font-weight:700}.hkc li .t{color:rgba(255,255,255,.5);font-size:12px;margin-left:6px}.hkc li p{margin:0;white-space:pre-wrap;word-wrap:break-word;color:rgba(255,255,255,.88)}" +
    ".hkc li .x{justify-self:start;background:none;border:0;color:rgba(255,255,255,.45);font-size:12px;cursor:pointer;padding:2px 0}.hkc .empty{color:rgba(255,255,255,.55)}.hkc .err{color:#ff6b6b;font-size:13px}" +
    ".hkc--chat ul{max-height:300px;overflow:auto;gap:8px;overscroll-behavior:contain}.hkc--chat li{border:0;padding:0;display:block}.hkc--chat li p{display:inline}.hkc--chat li b{margin-right:6px;color:#ffd400}" +
    ".hkc--chat .live{display:inline-block;background:#d90429;color:#fff;font:800 11px/1 system-ui;letter-spacing:.08em;padding:3px 6px;border-radius:4px;margin-right:8px;vertical-align:2px}";
  d.head.appendChild(st);

  function li(c, chat) {
    var mine = c.user_id && c.user_id === me();
    if (chat) return '<li data-id="' + c.id + '"><b>' + esc(c.display_name) + "</b><p>" + esc(c.body) + "</p></li>";
    return '<li data-id="' + c.id + '"><div><b>' + esc(c.display_name) + '</b><span class="t">' + ago(c.created_at) + "</span></div><p>" + esc(c.body) + "</p>" +
      (mine ? '<button class="x" type="button" data-del="' + c.id + '">Delete</button>' : "") + "</li>";
  }
  function formHtml(chat) {
    if (!sess()) return '<div class="si"><button type="button" data-si>Sign in</button> with your member account to ' + (chat ? "chat." : "comment.") + "</div>";
    return chat ? '<form class="row"><input maxlength="300" placeholder="Say something…" aria-label="Chat message" /><button class="go" type="submit">Send</button></form>' :
      '<form><textarea maxlength="1000" placeholder="Add a comment…" aria-label="Add a comment"></textarea><button class="go" type="submit">Post</button><span class="err" hidden></span></form>';
  }

  /* ---------- video comments ---------- */
  var box = null, curKey = null;
  function keyFrom(src) {
    if (!src || src === "about:blank") return null;
    var m = src.match(/(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/); if (m) return m[1];
    m = src.match(/[?&]list=([A-Za-z0-9_-]+)/); if (m) return "list:" + m[1];
    m = src.match(/rumble\.com\/embed\/([A-Za-z0-9]+)/); if (m) return "rumble:" + m[1];
    return "url:" + src.split("?")[0].slice(-150);
  }
  function drawVideo(key) {
    var a = d.querySelector(C.anchor); if (!a) return;
    if (!box || !d.body.contains(box)) { box = d.createElement("section"); box.className = "hkc"; box.setAttribute("aria-label", "Comments"); }
    if (C.place === "before") { if (box.nextSibling !== a) a.parentNode.insertBefore(box, a); } else if (a.nextSibling !== box) a.parentNode.insertBefore(box, a.nextSibling);
    box.innerHTML = '<h3>Comments <small></small></h3>' + formHtml(false) + '<ul><li class="empty">Loading…</li></ul>';
    wireForm(box, key, false);
    load(key);
  }
  function load(key) {
    list(key, { limit: 100 }).then(function (L) {
      if (key !== curKey || !box) return;
      box.querySelector("h3 small").textContent = L.length ? (L.length >= 100 ? "100+" : L.length) : "";
      box.querySelector("ul").innerHTML = L.length ? L.map(function (c) { return li(c, false); }).join("") : '<li class="empty">No comments yet. Start the conversation.</li>';
    });
  }
  function wireForm(root, key, chat) {
    var b = root.querySelector("[data-si]"); if (b) b.onclick = signIn;
    var f = root.querySelector("form"); if (!f) return;
    f.onsubmit = function (e) {
      e.preventDefault();
      var inp = f.querySelector("textarea,input"), v = inp.value.trim(), go = f.querySelector(".go"), er = f.querySelector(".err");
      if (!v) return; go.disabled = true; if (er) er.hidden = true;
      add(key, v).then(function () { inp.value = ""; go.disabled = false; if (chat) chatPoll(); else load(key); },
        function (x) { go.disabled = false; if (x && x.message === "signin") { signIn(); return; } if (er) { er.textContent = "Couldn't post. Try again."; er.hidden = false; } });
    };
  }
  d.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-del]"); if (!b) return;
    e.preventDefault(); if (!confirm("Delete this comment?")) return;
    del(b.getAttribute("data-del")).then(function () { var l = b.closest("li"); if (l) l.parentNode.removeChild(l); });
  });
  var lastSess = !!sess();
  setInterval(function () {
    var stage = d.querySelector(C.stage), f = stage && stage.querySelector("iframe"), vis = stage && stage.offsetParent !== null;
    var k = vis && f ? keyFrom(f.getAttribute("src") || f.src) : null;
    var s = !!sess(), sc = s !== lastSess; lastSess = s;
    if (k && (k !== curKey || sc || !box || !d.body.contains(box))) { curKey = k; drawVideo(k); }
    else if (!k && curKey) { curKey = null; }
    chatTick(sc);
  }, 800);

  /* ---------- live chat in LIVE TV ---------- */
  var chat = null, chatKey = null, chatLast = null, chatT = 0;
  function liveCh() { try { return localStorage.getItem("live_ch_" + C.site) || ""; } catch (e) { return ""; } }
  function chatTick(sc) {
    var ov = d.querySelector(".lv-ov"), wrap = ov && !ov.hidden && ov.querySelector(".lv-wrap"), bar = wrap && wrap.querySelector(".lv-bar");
    if (!bar) { chatKey = null; return; }
    var ch = liveCh() || ((window.LIVE_CFG || {}).channels || [{}])[0].id || "main", k = "live:" + ch;
    if (k !== chatKey || sc || !chat || !wrap.contains(chat)) {
      chatKey = k; chatLast = null;
      chat = d.createElement("section"); chat.className = "hkc hkc--chat"; chat.setAttribute("aria-label", "Live chat");
      chat.innerHTML = '<h3><span class="live">LIVE</span>Live chat</h3><ul aria-live="polite"><li class="empty">Loading chat…</li></ul><div style="height:10px"></div>' + formHtml(true);
      bar.parentNode.insertBefore(chat, bar.nextSibling);
      wireForm(chat, k, true); chatT = 0;
    }
    if (Date.now() - chatT > 4000) chatPoll();
  }
  function chatPoll() {
    chatT = Date.now(); var k = chatKey, c = chat; if (!k || !c) return;
    var since = chatLast || new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    list(k, { asc: true, limit: 80, since: since }).then(function (L) {
      if (k !== chatKey || c !== chat) return;
      var ul = c.querySelector("ul"), first = !chatLast;
      if (first) ul.innerHTML = "";
      var atBottom = ul.scrollHeight - ul.scrollTop - ul.clientHeight < 40;
      L.forEach(function (m) { if (!ul.querySelector('[data-id="' + m.id + '"]')) ul.insertAdjacentHTML("beforeend", li(m, true)); chatLast = m.created_at; });
      if (first && !L.length) { ul.innerHTML = '<li class="empty">No messages yet. Say hi.</li>'; chatLast = new Date(Date.now() - 5000).toISOString(); }
      else if (L.length) { var e = ul.querySelector(".empty"); if (e) e.parentNode.removeChild(e); }
      while (ul.children.length > 150) ul.removeChild(ul.firstChild);
      if (first || atBottom) ul.scrollTop = ul.scrollHeight;
    });
  }
})();
