'use strict';
// fixes.js - script.js ၏ နောက်မှာ load လုပ်ပါ။ script.js ကို မပြင်ရပါ။
(function () {
  var cardId = new URLSearchParams(window.location.search).get('id');
  var isVisitor = !!cardId;
  var gateOpened = false;
  var cardReady = false;
  var pendingPlay = false;

  var GATE_TEXT = {
    my: { title: 'မုန့်ဖိုးတောင်းလွှာ ရောက်ရှိနေပါပြီ', btn: 'ဖွင့်ကြည့်မယ် ✨' },
    en: { title: 'You received a request card', btn: 'Open it ✨' },
    ja: { title: 'リクエストカードが届きました', btn: '開く ✨' },
    ko: { title: '요청 카드가 도착했어요', btn: '열어보기 ✨' },
    th: { title: 'คุณได้รับการ์ดขอค่าขนม', btn: 'เปิดดู ✨' },
    zh: { title: '你收到了一张请求卡', btn: '打开看看 ✨' }
  };

  function gateText() {
    var lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'my';
    return GATE_TEXT[lang] || GATE_TEXT.my;
  }

  // ---------- CSS ----------
  var css = document.createElement('style');
  css.textContent = '\
  #exportCard > *:not(#cardBgImg):not(#cardBgVideo):not(#outSender):not(.emoji-overlay) { position: relative !important; z-index: 5 !important; }\
  #exportCard > #outSender { position: absolute !important; top: 8px !important; right: 8px !important; left: auto !important; width: fit-content !important; max-width: 80% !important; align-self: auto !important; }\
  #openGate { position: fixed; inset: 0; z-index: 998; background: rgba(5,3,15,0.94); backdrop-filter: blur(10px); display: flex; justify-content: center; align-items: center; padding: 20px; transition: opacity .5s ease, visibility .5s ease; }\
  #openGate.hide { opacity: 0; visibility: hidden; pointer-events: none; }\
  .gate-box { text-align: center; padding: 28px 24px; width: 100%; max-width: 310px; background: rgba(10,12,28,0.96); border-radius: 24px; border: 2px solid rgba(0,242,254,0.6); box-shadow: 0 0 30px rgba(0,242,254,0.4), inset 0 0 20px rgba(255,0,85,0.15); animation: gateIn .8s cubic-bezier(0.16,1,0.3,1) both; }\
  .gate-envelope { font-size: 64px; margin-bottom: 8px; animation: gateFloat 2.4s ease-in-out infinite; filter: drop-shadow(0 0 14px rgba(255,0,85,0.7)); }\
  .gate-title { color: #00f2fe; font-size: 18px; font-weight: 700; text-shadow: 0 0 8px rgba(0,242,254,0.4); margin-bottom: 6px; }\
  .gate-from { color: #ffeaa7; font-size: 13px; font-weight: 600; margin-bottom: 20px; min-height: 18px; word-break: break-word; }\
  .gate-btn { width: 100%; padding: 12px 16px; border: none; border-radius: 14px; cursor: pointer; background: linear-gradient(135deg,#ff0055,#ff3377); color: #fff; font-size: 14px; font-weight: 700; animation: gatePulse 1.6s ease-in-out infinite; }\
  @keyframes gateIn { 0% { opacity: 0; transform: scale(.85) translateY(30px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }\
  @keyframes gateFloat { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-10px) rotate(4deg); } }\
  @keyframes gatePulse { 0%,100% { box-shadow: 0 4px 14px rgba(255,0,85,.4); } 50% { box-shadow: 0 4px 26px rgba(255,0,85,.85); } }';
  document.head.appendChild(css);

  // ---------- Gate (shared link ဖြင့်ဝင်သူအတွက်သာ) ----------
  var gate = null;

  function hideGate() {
    if (!gate) return;
    gate.classList.add('hide');
    setTimeout(function () { if (gate && gate.parentNode) gate.parentNode.removeChild(gate); gate = null; }, 600);
  }

  function buildGate() {
    gate = document.createElement('div');
    gate.id = 'openGate';
    gate.innerHTML = '<div class="gate-box"><div class="gate-envelope">🧧</div><div class="gate-title"></div><div class="gate-from"></div><button type="button" class="gate-btn"></button></div>';
    document.body.appendChild(gate);

    var tx = gateText();
    gate.querySelector('.gate-title').textContent = tx.title;
    gate.querySelector('.gate-btn').textContent = tx.btn;

    gate.querySelector('.gate-btn').addEventListener('click', function () {
      gateOpened = true;
      var player = document.getElementById('cardAudioPlayer');
      // ခလုတ်နှိပ်ချိန်ထဲမှာတင် play() ခေါ်ရမည် (browser က ခွင့်ပြုသည်)
      if (player && player.getAttribute('src')) {
        player.muted = false;
        player.play().catch(function (e) { console.log('Play error:', e); });
      } else {
        pendingPlay = true; // ကတ်ဒေတာ မရောက်သေးလျှင် ရောက်တာနဲ့ ဖွင့်မည်
      }
      var vid = document.getElementById('cardBgVideo');
      if (vid && vid.getAttribute('src')) vid.play().catch(function () {});
      hideGate();
    });
  }

  if (isVisitor) buildGate();

  // ---------- renderCardData ကို wrap ----------
  var origRender = window.renderCardData;
  if (typeof origRender === 'function') {
    window.renderCardData = function (data) {
      origRender(data);
      cardReady = true;

      if (gate && data) {
        var from = gate.querySelector('.gate-from');
        if (from) from.textContent = data.sender ? 'From: ' + data.sender : '';
      }

      var player = document.getElementById('cardAudioPlayer');
      if (!player) return;

      if (isVisitor && !gateOpened) {
        // Gate မဖွင့်ရသေးခင် အသံမမြည်စေရန် ရပ်ထားမည်
        player.pause();
      } else if (pendingPlay && player.getAttribute('src')) {
        pendingPlay = false;
        player.muted = false;
        player.play().catch(function (e) { console.log('Play error:', e); });
      }
    };
  }

  // ---------- ကတ်မတွေ့ / သက်တမ်းကုန် ဆိုလျှင် Gate ကို ဖယ်မည် ----------
  var origClear = window.clearUrlParams;
  if (typeof origClear === 'function') {
    window.clearUrlParams = function () {
      origClear();
      hideGate();
    };
  }

  // ကတ်မရောက်ဘဲ ၁၀ စက္ကန့်ကျော်လျှင် Gate မကပ်နေစေရန်
  if (isVisitor) {
    setTimeout(function () { if (!cardReady) hideGate(); }, 10000);
  }

  // ---------- Music bar ကို နှိပ်လျှင်လည်း မြည်စေရန် ----------
  var audioGroup = document.getElementById('cardAudioGroup');
  if (audioGroup) {
    audioGroup.style.cursor = 'pointer';
    audioGroup.addEventListener('click', function () {
      var p = document.getElementById('cardAudioPlayer');
      if (p && p.paused) p.play().catch(function () {});
    });
  }
})();
