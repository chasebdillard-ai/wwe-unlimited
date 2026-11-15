/* LU:promo, the Lucha Underground launch pop-up. Shows once per visit (per browser tab session).
   Click the card or "Enter the Temple" to open #lucha; × / scrim / Esc / "Maybe later" closes to the homepage. */
(function () {
  try { if (sessionStorage.getItem("lu_promo_seen")) return; } catch (e) {}
  if (/^#lucha/.test(location.hash)) { try { sessionStorage.setItem("lu_promo_seen", "1"); } catch (e) {} return; }
  var css = document.createElement("style"); css.id = "lu-promo-css";
  css.textContent =
    ".lup{position:fixed;inset:0;z-index:10050;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.72);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);animation:lupFade .35s ease both}" +
    ".lup__card{position:relative;width:min(440px,100%);max-height:calc(100vh - 40px);overflow:hidden;border-radius:6px;cursor:pointer;color:#f3e6c8;text-align:center;" +
      "background:radial-gradient(120% 80% at 50% 0%,rgba(140,18,12,.55),transparent 60%),radial-gradient(80% 60% at 50% 100%,rgba(201,162,74,.18),transparent 70%),#0a0706;" +
      "border:2px solid #8a6a2c;box-shadow:0 0 0 1px #000,0 0 40px rgba(180,30,20,.45),0 30px 80px rgba(0,0,0,.8);animation:lupIn .45s cubic-bezier(.2,.9,.3,1.2) both}" +
    ".lup__card:before{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(90deg,rgba(201,162,74,.06) 0 2px,transparent 2px 14px),repeating-linear-gradient(0deg,rgba(201,162,74,.04) 0 2px,transparent 2px 14px);mix-blend-mode:screen}" +
    ".lup__band{height:12px;background:repeating-linear-gradient(90deg,#c9a24a 0 10px,#0a0706 10px 14px,#8f1a12 14px 24px,#0a0706 24px 28px)}" +
    ".lup__in{position:relative;padding:22px 24px 22px}" +
    ".lup__kick{display:inline-block;font:700 11px/1 system-ui,sans-serif;letter-spacing:.28em;color:#ff4a3a;border:1px solid rgba(255,74,58,.5);padding:6px 10px;border-radius:2px;margin-bottom:12px}" +
    ".lup__mask{display:block;width:96px;height:auto;margin:0 auto 6px;filter:drop-shadow(0 0 16px rgba(227,36,27,.75));animation:lupBreath 3.2s ease-in-out infinite}" +
    ".lup__word{display:block;width:min(300px,82%);height:auto;margin:0 auto 10px}" +
    ".lup__h{margin:0 0 6px;font:700 22px/1.15 Georgia,'Times New Roman',serif;letter-spacing:.06em;text-transform:uppercase;color:#e2c27a;text-shadow:0 2px 0 #000,0 0 18px rgba(201,162,74,.35)}" +
    ".lup__p{margin:0 0 16px;font:400 14px/1.45 system-ui,sans-serif;color:#cdbb94}" +
    ".lup__go{display:inline-flex;align-items:center;gap:10px;padding:13px 22px;border:1px solid #e2c27a;border-radius:2px;background:linear-gradient(#a3160d,#6d0d07);color:#fff4dc;font:800 14px/1 system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;box-shadow:0 0 22px rgba(227,36,27,.45)}" +
    ".lup__go:hover,.lup__card:hover .lup__go{filter:brightness(1.15);box-shadow:0 0 30px rgba(227,36,27,.7)}" +
    ".lup__later{display:block;margin:12px auto 0;background:none;border:0;color:#9c8a66;font:500 13px/1 system-ui,sans-serif;text-decoration:underline;cursor:pointer;padding:6px}" +
    ".lup__x{position:absolute;top:18px;right:10px;z-index:2;width:34px;height:34px;border-radius:50%;border:1px solid #8a6a2c;background:rgba(0,0,0,.75);color:#f3e6c8;font:400 22px/1 system-ui,sans-serif;cursor:pointer;display:grid;place-items:center;padding:0}" +
    ".lup__x:hover{background:#8f1a12}" +
    "body.lup-open .espn-promo{visibility:hidden}" +
    "body.lup-open{overflow:hidden}" +
    "@keyframes lupFade{from{opacity:0}to{opacity:1}}@keyframes lupIn{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}" +
    "@keyframes lupBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}" +
    "@media (max-width:420px){.lup__mask{width:78px}.lup__h{font-size:19px}.lup__in{padding:18px 18px 18px}}" +
    "@media (prefers-reduced-motion:reduce){.lup,.lup__card,.lup__mask{animation:none}}";
  document.head.appendChild(css);
  var w = document.createElement("div"); w.className = "lup"; w.id = "lu-promo";
  w.innerHTML = '<div class="lup__card" role="dialog" aria-modal="true" aria-labelledby="lup-h" tabindex="-1">' +
    '<div class="lup__band" aria-hidden="true"></div>' +
    '<button type="button" class="lup__x" data-lup-close aria-label="Close and go to the homepage">&times;</button>' +
    '<div class="lup__in"><span class="lup__kick">NEW HUB</span>' +
    '<img class="lup__mask" src="lucha_mask.png" alt="" />' +
    '<img class="lup__word" src="lucha_underground.png" alt="Lucha Underground" />' +
    '<h2 class="lup__h" id="lup-h">Welcome to the Temple</h2>' +
    '<p class="lup__p">All 39 episodes of Season 1, now streaming on WWE Unlimited.</p>' +
    '<button type="button" class="lup__go" data-lup-go>&#9654; Enter the Temple</button>' +
    '<button type="button" class="lup__later" data-lup-close>Maybe later</button></div>' +
    '<div class="lup__band" aria-hidden="true"></div></div>';
  var last = document.activeElement;
  function close(go) {
    try { sessionStorage.setItem("lu_promo_seen", "1"); } catch (e) {}
    document.removeEventListener("keydown", onKey);
    document.body.classList.remove("lup-open");
    if (w.parentNode) w.parentNode.removeChild(w);
    if (go) { location.hash = "#lucha"; window.scrollTo(0, 0); }
    else if (last && last.focus) { try { last.focus(); } catch (e) {} }
  }
  function onKey(e) { if (e.key === "Escape") close(false); }
  w.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-lup-close]")) { e.preventDefault(); close(false); return; }
    if (t.closest(".lup__card")) { e.preventDefault(); close(true); return; }
    close(false); // scrim
  });
  function show() {
    if (/^#lucha/.test(location.hash)) return;
    document.body.appendChild(w); document.body.classList.add("lup-open");
    document.addEventListener("keydown", onKey);
    var g = w.querySelector("[data-lup-go]"); if (g) g.focus({ preventScroll: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(show, 600); });
  else setTimeout(show, 600);
})();
