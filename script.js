// Supabase Credentials
const SUPABASE_URL = 'https://koybxyoucyqnixvwplke.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H7XpgD2tcobQnTTH68p4Nw_9TNfH9tX';

let supabaseClient = null;

function getSupabase() {
  if (!supabaseClient && window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

let currentUser = null;
let savedBgImage = '';
let savedQrImage = '';
let savedMusicUrl = '';
let selectedBgFile = null;
let selectedQrFile = null;
let currentShareableLink = '';
let currentLang = 'my';
let cardTimerInterval = null;
let historyTimerInterval = null; 
let isSharedLinkVisitor = false; 

// Music Folder ထဲရှိ သီချင်းစာရင်း
const localMusicList = [
  { name: '🎵 song1.mp3', url: 'music/song1.mp3' },
  { name: '🎵 song2.mp3', url: 'music/song2.mp3' },
  { name: '🎵 song3.mp3', url: 'music/song3.mp3' },
  { name: '🎵 song4.mp3', url: 'music/song4.mp3' }
];

// မြန်မာဘာသာစာသားများ သီးသန့်
const i18n = {
  my: {
    pageTitle: "မုန့်ဖိုးတောင်းလွှာ Web App",
    introMsg: "မင်္ဂလာပါ ခဏစောင့်ပေးပါ...",
    loaderMsg: "ခဏစောင့်ပါ...",
    authTitle: "အကောင့်ဝင်ရန်",
    modeSelectLabel: "အမျိုးအစား ရွေးချယ်ရန်",
    optLogin: "အကောင့်ရှိပြီးသား",
    optSignup: "အကောင့်သစ်ဖွင့်ရန်",
    nameLabel: "နာမည်",
    namePlaceholder: "နာမည်ရိုက်ပါ",
    numLabel: "ID နံပါတ်",
    numPlaceholder: "နှစ်သက်ရာထည့်နိုင်သည်",
    passLabel: "Password",
    passPlaceholder: "Password ရိုက်ပါ",
    pass2Label: "Password ထပ်မံရိုက်ပါ",
    pass2Placeholder: "Password ကို ထပ်ရိုက်ပါ",
    loginBtn: "အကောင့်ဝင်မည်",
    signupBtn: "အကောင့်အသစ်ဖွင့်မည်",
    profileTitle: "ကိုယ်ရေးအချက်အလက်",
    changeAvatar: "Profile ပုံပြောင်းရန်",
    changeNickBtn: "နာမည်ပြောင်းရန်",
    reqPocketBtn: "🧧 မုန့်ဖိုးတောင်းရန်",
    historyBtn: "မှတ်တမ်းများ",
    historyTitle: "မှတ်တမ်းများ",
    backHistoryBtn: "⬅ နောက်သို့",
    step3Title: "မုန့်ဖိုးတောင်းမည့် အကြောင်းအရာ",
    dropdownLabel: "အကြောင်းအရာ ရွေးချယ်ရန်",
    customReasonLabel: "ကိုယ်တိုင်စာရေးရန်",
    customReasonPlaceholder: "အကြောင်းအရာ ရေးပါ",
    customNoteLabel: "မုန့်ဖိုးတောင်းဖို့ စာစီရန်",
    customNotePlaceholder: "စာစီပါ...",
    musicLabel: "သီချင်း ရွေးချယ်ရန်",
    bgLabel: "နောက်ခံပုံ",
    bgBtn: "📸 နောက်ခံပုံ ရွေးရန်",
    qrLabel: "QR Code / အချက်အလက်ပုံ (HD)",
    qrBtn: "💳 QR Code / ပုံ ရွေးရန်",
    backBtn: "⬅ နောက်သို့",
    genCardBtn: "ကတ်ဖန်တီးမည် ✨",
    step4Title: " 😌 မုန့်ဖိုးတောင်းလွှာ 😌 ",
    qrHint: "", 
    saveBtn: "💾 Save QR",
    shareBtn: "📤 မျှဝေရန်",
    profileReturnBtn: "🏠 Profile သို့ပြန်ရန်",
    modalTitle: "📤 မျှဝေရန်",
    modalSub: "မုန့်ဖိုးတောင်းလွှာနှင့် လင့်ခ်ကို ပို့ရန် -",
    copyLinkBtn: "📋 Link ယူမည်",
    dl1to1Btn: "📥 Save QR",
    closeBtn: "ပိတ်မည်",
    alertNote: "❌ ကျေးဇူးပြု၍ မုန့်ဖိုးတောင်းဖို့ စာစီရန် (Note) ကို ဖြည့်စွက်ပါ။",
    alertBg: "❌ ကျေးဇူးပြု၍ နောက်ခံပုံ (Background Image) ထည့်ပါ။",
    alertQr: "❌ ကျေးဇူးပြု၍ QR Code / အချက်အလက်ပုံ ထည့်ပါ။",
    reasons: [
      { val: "သတင်းကျွတ်မုန့်ဖိုး", text: "သတင်းကျွတ်မုန့်ဖိုး" },
      { val: "ရည်းစားနဲ့လျှောက်လည်ရန်", text: "ရည်းစားနဲ့လျှောက်လည်ရန်" },
      { val: "သူငယ်ချင်းတွေနဲ့လျှောက်လည်ရန်", text: "သူငယ်ချင်းတွေနဲ့လျှောက်လည်ရန်" },
      { val: "သုံးစရာမရှိတော့လို့", text: "သုံးစရာမရှိတော့လို့" },
      { val: "အခြား", text: "အခြား (ကိုယ်တိုင်ရေးမည်)" }
    ]
  }
};

// 🌟 Floating Animation & Reduced Glow Effect Styles
const cardStyleInjected = document.createElement('style');
cardStyleInjected.innerHTML = `
  .preview-eq-bars {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: radial-gradient(circle, #000 0%, #111 18%, #333 20%, #777 24%, #222 28%, #aaa 32%, #111 38%, #333 60%, #000 100%),
                conic-gradient(from 0deg, #111, #555, #aaa, #fff, #aaa, #555, #111);
    background-blend-mode: overlay;
    border: 2px solid #00f2fe;
    position: relative;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(0, 242, 254, 0.4), inset 0 0 6px rgba(255, 255, 255, 0.3);
  }

  .preview-eq-bars::before {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background: #090d16;
    border: 2px solid #00f2fe;
    border-radius: 50%;
    z-index: 2;
  }

  .preview-eq-bars::after {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    border: 1px dashed rgba(255, 255, 255, 0.35);
    border-radius: 50%;
    z-index: 1;
  }

  .p-bar {
    display: none !important;
  }

  .preview-eq-bars.playing {
    animation: spinCdDisc 1.8s linear infinite !important;
  }

  @keyframes spinCdDisc {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Floating Animation Effect for Card Container */
  @keyframes cardFloating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
    100% { transform: translateY(0px); }
  }

  #step4 {
    position: relative !important;
    overflow: hidden !important;
    border: 2px solid rgba(0, 242, 254, 0.5) !important;
    border-radius: 18px !important;
    box-shadow: 0 4px 15px rgba(0, 242, 254, 0.15) !important; /* Reduced Glow Effect */
    animation: cardFloating 4s ease-in-out infinite !important;
  }

  #cardBgImg {
    display: block !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: fill !important; /* Strength/Stretch to fill completely */
    z-index: 0 !important;
  }

  #step4 > *:not(#cardBgImg) {
    position: relative !important;
    z-index: 2 !important;
  }

  #lbl_qrHint {
    display: none !important;
  }

  #cardQrImg {
    display: block !important;
    max-width: 100% !important;
    height: auto !important;
  }

  #qrWrapper {
    display: block !important;
  }

  .top-card-timer {
    position: absolute;
    top: 20px;
    right: 145px;
    z-index: 100;
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 12px;
    border: 1.5px solid rgba(0, 242, 254, 0.5);
    background: rgba(10, 12, 28, 0.95);
    color: #00f2fe;
    box-shadow: 0 0 8px rgba(0, 242, 254, 0.3);
    display: none;
    align-items: center;
    gap: 6px;
  }

  .custom-preview-player {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 4px 0 !important;
    margin: 4px auto !important;
    height: auto !important;
  }

  #outReason {
    margin-bottom: 18px !important;
    display: block !important;
    font-weight: bold;
    color: #ffffff !important;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.6) !important;
  }
  #outNote {
    margin-top: 10px !important;
    display: block !important;
    font-weight: bold;
    color: #ffffff !important;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.6) !important;
  }
`;
document.head.appendChild(cardStyleInjected);

// Text Localization Function
function updateTexts() {
  const d = i18n.my;
  if(document.getElementById('page_title')) document.getElementById('page_title').innerText = d.pageTitle;
  if(document.getElementById('introMsg')) document.getElementById('introMsg').innerText = d.introMsg;
  if(document.getElementById('lbl_loaderMsg')) document.getElementById('lbl_loaderMsg').innerText = d.loaderMsg;
  if(document.getElementById('lbl_authTitle')) document.getElementById('lbl_authTitle').innerText = d.authTitle;
  if(document.getElementById('lbl_modeSelect')) document.getElementById('lbl_modeSelect').innerText = d.modeSelectLabel;

  const currentAuthMode = document.getElementById('authModeSelect') ? document.getElementById('authModeSelect').value : 'login';
  if(document.getElementById('authModeTriggerText')) {
    document.getElementById('authModeTriggerText').innerText = (currentAuthMode === 'signup') ? d.optSignup : d.optLogin;
  }
  
  const optLoginEl = document.getElementById('optLoginText');
  if(optLoginEl) {
    optLoginEl.innerText = d.optLogin;
    optLoginEl.onclick = () => selectAuthModeOption('login', d.optLogin);
  }
  
  const optSignupEl = document.getElementById('optSignupText');
  if(optSignupEl) {
    optSignupEl.innerText = d.optSignup;
    optSignupEl.onclick = () => selectAuthModeOption('signup', d.optSignup);
  }
  
  if(document.getElementById('lbl_loginName')) document.getElementById('lbl_loginName').innerText = d.nameLabel;
  if(document.getElementById('loginName')) document.getElementById('loginName').placeholder = d.namePlaceholder;
  if(document.getElementById('lbl_loginPass')) document.getElementById('lbl_loginPass').innerText = d.passLabel;
  if(document.getElementById('loginPass')) document.getElementById('loginPass').placeholder = d.passPlaceholder;
  if(document.getElementById('btn_login')) document.getElementById('btn_login').innerText = d.loginBtn;

  if(document.getElementById('lbl_signupName')) document.getElementById('lbl_signupName').innerText = d.nameLabel;
  if(document.getElementById('signupName')) document.getElementById('signupName').placeholder = d.namePlaceholder;
  if(document.getElementById('lbl_signupNum')) document.getElementById('lbl_signupNum').innerText = d.numLabel;
  if(document.getElementById('signupNum')) document.getElementById('signupNum').placeholder = d.numPlaceholder;
  if(document.getElementById('lbl_signupPass1')) document.getElementById('lbl_signupPass1').innerText = d.passLabel;
  if(document.getElementById('signupPass1')) document.getElementById('signupPass1').placeholder = d.passPlaceholder;
  if(document.getElementById('lbl_signupPass2')) document.getElementById('lbl_signupPass2').innerText = d.pass2Label;
  if(document.getElementById('signupPass2')) document.getElementById('signupPass2').placeholder = d.pass2Placeholder;
  if(document.getElementById('btn_signup')) document.getElementById('btn_signup').innerText = d.signupBtn;

  if(document.getElementById('lbl_profileTitle')) document.getElementById('lbl_profileTitle').innerText = d.profileTitle;
  if(document.getElementById('lbl_changeAvatar')) document.getElementById('lbl_changeAvatar').innerText = d.changeAvatar;
  if(document.getElementById('lbl_changeNick')) document.getElementById('lbl_changeNick').innerText = d.changeNickBtn;

  if(document.getElementById('lbl_reqPocketBtn')) document.getElementById('lbl_reqPocketBtn').innerText = d.reqPocketBtn;
  if(document.getElementById('lbl_historyBtn')) document.getElementById('lbl_historyBtn').innerText = d.historyBtn;
  if(document.getElementById('lbl_historyTitle')) document.getElementById('lbl_historyTitle').innerText = d.historyTitle;
  if(document.getElementById('btn_backHistory')) document.getElementById('btn_backHistory').innerText = d.backHistoryBtn;

  if(document.getElementById('lbl_step3Title')) document.getElementById('lbl_step3Title').innerText = d.step3Title;
  if(document.getElementById('lbl_dropdown')) document.getElementById('lbl_dropdown').innerText = d.dropdownLabel;
  if(document.getElementById('reasonTriggerText') && i18n.my.reasons.length > 0) {
    document.getElementById('reasonTriggerText').innerText = i18n.my.reasons[0].text;
  }
  if(document.getElementById('lbl_customReason')) document.getElementById('lbl_customReason').innerText = d.customReasonLabel;
  if(document.getElementById('customReason')) document.getElementById('customReason').placeholder = d.customReasonPlaceholder;
  if(document.getElementById('lbl_customNote')) document.getElementById('lbl_customNote').innerText = d.customNoteLabel;
  if(document.getElementById('customNote')) document.getElementById('customNote').placeholder = d.customNotePlaceholder;

  if(document.getElementById('lbl_musicLabel')) document.getElementById('lbl_musicLabel').innerText = d.musicLabel;
  if(document.getElementById('lbl_bgLabel')) document.getElementById('lbl_bgLabel').innerText = d.bgLabel;
  if(document.getElementById('bgImgLabel')) document.getElementById('bgImgLabel').innerText = d.bgBtn;
  if(document.getElementById('lbl_qrLabel')) document.getElementById('lbl_qrLabel').innerText = d.qrLabel;
  if(document.getElementById('qrImgLabel')) document.getElementById('qrImgLabel').innerText = d.qrBtn;

  if(document.getElementById('btn_backStep3')) document.getElementById('btn_backStep3').innerText = d.backBtn;
  if(document.getElementById('btn_genCard')) document.getElementById('btn_genCard').innerText = d.genCardBtn;

  if(document.getElementById('lbl_step4Title')) document.getElementById('lbl_step4Title').innerText = d.step4Title;
  if(document.getElementById('lbl_qrHint')) {
    document.getElementById('lbl_qrHint').innerText = d.qrHint;
    document.getElementById('lbl_qrHint').style.display = 'none';
  }
  if(document.getElementById('btn_saveQr')) document.getElementById('btn_saveQr').innerText = d.saveBtn;
  if(document.getElementById('btn_share')) document.getElementById('btn_share').innerText = d.shareBtn;
  if(document.getElementById('btn_profileReturn')) document.getElementById('btn_profileReturn').innerText = d.profileReturnBtn;

  if(document.getElementById('lbl_modalTitle')) document.getElementById('lbl_modalTitle').innerText = d.modalTitle;
  if(document.getElementById('lbl_modalSub')) document.getElementById('lbl_modalSub').innerText = d.modalSub;
  if(document.getElementById('btn_copyLink')) document.getElementById('btn_copyLink').innerText = d.copyLinkBtn;
  if(document.getElementById('btn_dlQrModal')) document.getElementById('btn_dlQrModal').innerText = d.dl1to1Btn;
  if(document.getElementById('btn_closeModal')) document.getElementById('btn_closeModal').innerText = d.closeBtn;
}

// Compress File to HD DataURL
function compressFileToDataUrl(file, maxWidth = 900, quality = 0.8) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// Music Dropdown Functions
function populateMusicDropdown() {
  const container = document.getElementById('musicCustomOptions');
  if (!container) return;
  container.innerHTML = '';

  const currentVal = document.getElementById('musicDropdown').value;
  let found = false;

  localMusicList.forEach(song => {
    const div = document.createElement('div');
    div.className = 'custom-option';
    div.innerText = song.name;
    div.onclick = () => selectMusicOption(song.url, song.name);
    container.appendChild(div);

    if (song.url === currentVal) {
      document.getElementById('musicTriggerText').innerText = song.name;
      found = true;
    }
  });

  if (!found && localMusicList.length > 0) {
    document.getElementById('musicTriggerText').innerText = localMusicList[0].name;
    document.getElementById('musicDropdown').value = localMusicList[0].url;
    savedMusicUrl = localMusicList[0].url;
    
    const previewGroup = document.getElementById('audioPreviewGroup');
    const player = document.getElementById('audioPreviewPlayer');
    if (previewGroup && player) {
      previewGroup.style.display = 'block';
      player.src = localMusicList[0].url;
      player.load();
      player.loop = true;
    }
  }
}

function selectMusicOption(url, name) {
  document.getElementById('musicTriggerText').innerText = name;
  document.getElementById('musicDropdown').value = url;
  document.getElementById('musicCustomSelect').classList.remove('open');
  
  savedMusicUrl = url;
  const previewGroup = document.getElementById('audioPreviewGroup');
  const player = document.getElementById('audioPreviewPlayer');
  if (previewGroup && player) {
    previewGroup.style.display = 'block';
    player.src = url;
    player.load();
    player.loop = true;
    
    player.play().then(() => {
      const eqContainer = document.querySelector('.preview-eq-bars');
      if(eqContainer) eqContainer.classList.add('playing');
    }).catch(e => console.log("Auto-play error:", e));
  }
}

function toggleCustomDropdown(wrapperId) {
  document.querySelectorAll('.custom-select-wrapper').forEach(el => {
    if (el.id !== wrapperId) el.classList.remove('open');
  });
  document.getElementById(wrapperId).classList.toggle('open');
}

window.addEventListener('click', function(e) {
  if (!e.target.closest('.custom-select-wrapper')) {
    document.querySelectorAll('.custom-select-wrapper').forEach(el => el.classList.remove('open'));
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  updateTexts();
  populateReasonDropdown('my');
  populateMusicDropdown();

  setTimeout(() => {
    const splash = document.getElementById('introSplash');
    if (splash) splash.classList.add('fade-out');
  }, 1500);

  const urlParams = new URLSearchParams(window.location.search);
  const cardId = urlParams.get('id');

  if (cardId) {
    isSharedLinkVisitor = true;
    const loader = document.getElementById('stepLoader');
    if (loader) loader.classList.add('show');

    const previewPlayer = document.getElementById('audioPreviewPlayer');
    if (previewPlayer) {
      previewPlayer.pause();
      previewPlayer.currentTime = 0;
    }

    try {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await sb
          .from('cards')
          .select('*')
          .eq('id', cardId)
          .single();

        if (data && !error) {
          renderCardData({
            sender: data.sender,
            reason: data.reason,
            note: data.note,
            bgImage: data.bg_image || data.bgImage,
            qrImage: data.qr_image || data.qrImage,
            musicUrl: data.music_url || data.musicUrl
          });
          if (loader) loader.classList.remove('show');
          showStep(4);
          
          startCardTimer(cardId);
          return;
        }
      }
    } catch (err) {
      console.error('Supabase load error:', err);
    }
    if (loader) loader.classList.remove('show');
  }
});

function renderCardData(data) {
  if (!data) return;

  document.getElementById('outSender').innerText = data.sender ? `From: ${data.sender}` : '';
  document.getElementById('outReason').innerText = data.reason || '';
  document.getElementById('outNote').innerText = data.note || '';

  const bgImgSrc = data.bgImage || data.bg_image || savedBgImage;
  if (bgImgSrc) {
    savedBgImage = bgImgSrc;
    const bgEl = document.getElementById('cardBgImg');
    if (bgEl) {
      bgEl.src = bgImgSrc;
      bgEl.style.display = 'block';
      bgEl.style.position = 'absolute';
      bgEl.style.top = '0';
      bgEl.style.left = '0';
      bgEl.style.width = '100%';
      bgEl.style.height = '100%';
      bgEl.style.objectFit = 'fill'; // Stretched to fill completely
      bgEl.style.zIndex = '0';
    }
  }

  const qrImgSrc = data.qrImage || data.qr_image || savedQrImage;
  if (qrImgSrc) {
    savedQrImage = qrImgSrc;
    const qrEl = document.getElementById('cardQrImg');
    const qrWr = document.getElementById('qrWrapper');
    if (qrEl) {
      qrEl.src = qrImgSrc;
      qrEl.style.display = 'block';
      qrEl.style.maxWidth = '100%';
      qrEl.style.height = 'auto';
    }
    if (qrWr) {
      qrWr.style.display = 'block';
    }
  }

  const mUrl = data.musicUrl || data.music_url || savedMusicUrl;
  if (mUrl) {
    savedMusicUrl = mUrl;
    const cardPlayer = document.getElementById('cardAudioPlayer');
    const cardAudioGroup = document.getElementById('cardAudioGroup');
    if (cardPlayer && cardAudioGroup) {
      cardPlayer.src = mUrl;
      cardPlayer.load();
      cardPlayer.play().catch(e => console.log("Autoplay prevented:", e));
      cardAudioGroup.style.display = 'flex';
    }
  }
}

function startCardTimer(cardId) {
  if (cardTimerInterval) clearInterval(cardTimerInterval);

  const storageKey = `card_expire_${cardId || 'local_card'}`;
  let expireTime = localStorage.getItem(storageKey);

  if (!expireTime) {
    expireTime = Date.now() + 120 * 60 * 1000;
    localStorage.setItem(storageKey, expireTime);
  } else {
    expireTime = parseInt(expireTime, 10);
  }

  let timerEl = document.getElementById('topCardTimer');
  if (!timerEl) {
    timerEl = document.createElement('div');
    timerEl.id = 'topCardTimer';
    timerEl.className = 'top-card-timer';
    document.body.appendChild(timerEl);
  }
  timerEl.style.display = 'flex';

  cardTimerInterval = setInterval(async () => {
    const now = Date.now();
    const distance = expireTime - now;

    if (distance <= 0) {
      clearInterval(cardTimerInterval);
      if (timerEl) timerEl.innerText = "⏳ အချိန်ကုန်သွားပါပြီ";
      
      await deleteCardDataAndClean(cardId, storageKey);
      return;
    }

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (timerEl) {
      timerEl.innerHTML = `⏳ ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }, 1000);
}

async function deleteCardDataAndClean(cardId, storageKey) {
  savedBgImage = '';
  savedQrImage = '';
  savedMusicUrl = '';
  currentShareableLink = '';
  localStorage.removeItem(storageKey);

  const timerEl = document.getElementById('topCardTimer');
  if (timerEl) timerEl.style.display = 'none';

  const bgEl = document.getElementById('cardBgImg');
  if (bgEl) bgEl.style.display = 'none';
  const qrWr = document.getElementById('qrWrapper');
  if (qrWr) qrWr.style.display = 'none';
  document.getElementById('outSender').innerText = '';
  document.getElementById('outReason').innerText = '';
  document.getElementById('outNote').innerText = '';
  
  const cardAudioGroup = document.getElementById('cardAudioGroup');
  if (cardAudioGroup) cardAudioGroup.style.display = 'none';
  const cardPlayer = document.getElementById('cardAudioPlayer');
  if (cardPlayer) {
    cardPlayer.pause();
    cardPlayer.src = '';
  }

  if (cardId) {
    try {
      const sb = getSupabase();
      if (sb) {
        await sb.from('cards').delete().eq('id', cardId);
      }
    } catch (err) {
      console.error('Supabase Delete Error:', err);
    }

    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({path: cleanUrl}, '', cleanUrl);
    }
  }

  alert('⚠️ ကတ်သက်တမ်း (မိနစ် 120) ပြည့်သွားပြီဖြစ်ပါ၍ အချက်အလက်များနှင့် လင့်ခ်များကို အလိုအလျောက် ဖျက်ဆီးပြီးပါပြီ။');
  goToStep(2);
}

function switchAuthMode(mode) {
  const loginSec = document.getElementById('loginFormSection');
  const signupSec = document.getElementById('signupFormSection');

  if (mode === 'login') {
    loginSec.style.display = 'block';
    signupSec.style.display = 'none';
  } else {
    loginSec.style.display = 'none';
    signupSec.style.display = 'block';
  }
}

function selectAuthModeOption(val, text) {
  document.getElementById('authModeTriggerText').innerText = text;
  document.getElementById('authModeSelect').value = val;
  document.getElementById('authModeCustomSelect').classList.remove('open');
  switchAuthMode(val);
}

function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const num = document.getElementById('signupNum').value.trim();
  const p1 = document.getElementById('signupPass1').value;
  const p2 = document.getElementById('signupPass2').value;

  if (!name || !num || !p1 || !p2) {
    alert('အချက်အလက်များအားလုံး ဖြည့်သွင်းပါ။');
    return;
  }
  if (p1 !== p2) {
    alert('Password ၂ ခု မတူပါ။ ကျေးဇူးပြု၍ စစ်ဆေးပါ။');
    return;
  }

  const userData = { name, num, pass: p1, avatar: '', history: [] };
  localStorage.setItem(`user_${num}`, JSON.stringify(userData));
  
  alert('✅ အကောင့်အသစ် ဖွင့်ပြီးပါပြီ!');
  currentUser = userData;
  setupProfileView();
  goToStep(2);
}

function handleLogin() {
  const name = document.getElementById('loginName').value.trim();
  const pass = document.getElementById('loginPass').value;

  if (!name || !pass) {
    alert('နာမည်နှင့် Password ဖြည့်ပါ။');
    return;
  }

  let foundUser = null;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('user_')) {
      const u = JSON.parse(localStorage.getItem(key));
      if (u.name === name) {
        foundUser = u;
        break;
      }
    }
  }

  if (!foundUser) {
    alert('ဤနာမည်ဖြင့် မှတ်ပုံတင်ထားသော အကောင့်မရှိပါ။ အကောင့်သစ်ဖွင့်ပါ။');
    return;
  }

  if (foundUser.pass !== pass) {
    alert('Password မှားယွင်းနေပါသည်။');
    return;
  }

  if (!foundUser.history) foundUser.history = [];
  currentUser = foundUser;
  setupProfileView();
  goToStep(2);
}

function setupProfileView() {
  if (!currentUser) return;
  document.getElementById('displayProfileName').innerText = currentUser.name;
  document.getElementById('displayProfileNum').innerText = `ID: ${currentUser.num}`;
  
  if (currentUser.avatar) {
    document.getElementById('profileAvatarBox').innerHTML = `<img src="${currentUser.avatar}" alt="Avatar">`;
  }
}

function updateProfileAvatar(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentUser.avatar = e.target.result;
      localStorage.setItem(`user_${currentUser.num}`, JSON.stringify(currentUser));
      document.getElementById('profileAvatarBox').innerHTML = `<img src="${currentUser.avatar}" alt="Avatar">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function viewHistory() {
  renderHistoryList();
  goToStep(5);
}

function renderHistoryList() {
  if (historyTimerInterval) clearInterval(historyTimerInterval);

  const container = document.getElementById('historyListContainer');
  if (!container) return;
  container.innerHTML = '';

  if (!currentUser || !currentUser.history || currentUser.history.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #cbd5e1; font-size: 13px; padding: 20px;">မှတ်တမ်းများ မရှိသေးပါ။</p>';
    return;
  }

  currentUser.history.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'history-item-row';
    row.style.display = 'flex';
    row.style.flexDirection = 'column';
    row.style.position = 'relative';
    row.style.padding = '8px 12px';
    row.style.marginBottom = '6px';
    row.style.borderRadius = '10px';
    row.style.background = 'rgba(15, 23, 42, 0.85)';
    row.style.border = '1px solid rgba(255, 255, 255, 0.08)';

    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.justifyContent = 'space-between';
    topRow.style.alignItems = 'center';
    topRow.style.width = '100%';
    topRow.style.position = 'relative';
    topRow.style.marginBottom = '2px';

    const expireText = document.createElement('span');
    expireText.className = 'history-timer-span';
    expireText.style.fontSize = '11px';
    expireText.style.color = '#ff4757';
    expireText.style.fontWeight = '600';
    expireText.dataset.cardId = item.id;
    expireText.innerText = 'သက်တမ်း - 120:00';

    const menuBtn = document.createElement('button');
    menuBtn.className = 'history-menu-btn';
    menuBtn.innerHTML = '≡';
    menuBtn.style.background = 'transparent';
    menuBtn.style.border = 'none';
    menuBtn.style.color = '#fff';
    menuBtn.style.fontSize = '16px';
    menuBtn.style.cursor = 'pointer';
    menuBtn.style.padding = '0 4px';
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      toggleHistoryDropdown(index);
    };

    topRow.appendChild(expireText);
    topRow.appendChild(menuBtn);

    const dropdown = document.createElement('div');
    dropdown.className = 'history-dropdown-menu';
    dropdown.id = `historyDropdown_${index}`;
    dropdown.style.position = 'absolute';
    dropdown.style.top = '26px';
    dropdown.style.right = '0';
    dropdown.style.zIndex = '9999';
    dropdown.style.background = '#1e293b';
    dropdown.style.border = '1px solid rgba(255,255,255,0.15)';
    dropdown.style.borderRadius = '8px';
    dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
    dropdown.style.display = 'none';
    dropdown.style.minWidth = '90px';

    const viewItem = document.createElement('div');
    viewItem.className = 'history-dropdown-item';
    viewItem.innerText = 'ကြည့်ရန်';
    viewItem.style.padding = '6px 12px';
    viewItem.style.cursor = 'pointer';
    viewItem.style.fontSize = '12px';
    viewItem.style.color = '#fff';
    viewItem.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
    viewItem.onclick = () => viewCardFromHistory(item.id);

    const deleteItem = document.createElement('div');
    deleteItem.className = 'history-dropdown-item';
    deleteItem.innerText = 'ဖျက်ပြစ်ရန်';
    deleteItem.style.padding = '6px 12px';
    deleteItem.style.cursor = 'pointer';
    deleteItem.style.fontSize = '12px';
    deleteItem.style.color = '#ff4757';
    deleteItem.onclick = () => deleteCardFromHistory(item.id, index);

    dropdown.appendChild(viewItem);
    dropdown.appendChild(deleteItem);
    topRow.appendChild(dropdown);

    const bottomRow = document.createElement('div');
    bottomRow.style.width = '100%';

    const linkText = document.createElement('span');
    linkText.className = 'history-link-text';
    linkText.style.display = 'block';
    linkText.style.width = '100%';
    linkText.style.fontSize = '11.5px';
    linkText.style.color = '#cbd5e1';
    linkText.style.wordBreak = 'break-all';

    let cleanLink = item.link || '';
    if (cleanLink.includes('my-pocket-money')) {
      const pmIdx = cleanLink.indexOf('my-pocket-money');
      cleanLink = cleanLink.substring(0, pmIdx + 'my-pocket-money'.length);
    } else {
      cleanLink = cleanLink.split('?')[0];
    }

    linkText.innerText = `${index + 1}. ${item.reason || 'မုန့်ဖိုးတောင်းလွှာ'} - ${cleanLink}`;
    bottomRow.appendChild(linkText);

    row.appendChild(topRow);
    row.appendChild(bottomRow);

    container.appendChild(row);
  });

  updateHistoryTimers();
  historyTimerInterval = setInterval(updateHistoryTimers, 1000);
}

function updateHistoryTimers() {
  const timerSpans = document.querySelectorAll('.history-timer-span');
  timerSpans.forEach(span => {
    const cardId = span.dataset.cardId;
    const storageKey = `card_expire_${cardId || 'local_card'}`;
    let expireTime = localStorage.getItem(storageKey);

    if (!expireTime) {
      expireTime = Date.now() + 120 * 60 * 1000;
      localStorage.setItem(storageKey, expireTime);
    } else {
      expireTime = parseInt(expireTime, 10);
    }

    const now = Date.now();
    const distance = expireTime - now;

    if (distance <= 0) {
      span.innerText = "သက်တမ်း - အချိန်ကုန်သွားပါပြီ";
      return;
    }

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    span.innerText = `သက်တမ်း - ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });
}

function toggleHistoryDropdown(index) {
  document.querySelectorAll('.history-dropdown-menu').forEach((el, idx) => {
    if (idx !== index) {
      el.classList.remove('show');
      el.style.display = 'none';
    }
  });
  const target = document.getElementById(`historyDropdown_${index}`);
  if (target) {
    target.classList.toggle('show');
    if (target.classList.contains('show')) {
      target.style.display = 'block';
    } else {
      target.style.display = 'none';
    }
  }
}

window.addEventListener('click', function(e) {
  if (!e.target.closest('.history-menu-btn') && !e.target.closest('.history-dropdown-menu')) {
    document.querySelectorAll('.history-dropdown-menu').forEach(el => {
      el.classList.remove('show');
      el.style.display = 'none';
    });
  }
});

async function viewCardFromHistory(cardId) {
  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');

  try {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from('cards')
        .select('*')
        .eq('id', cardId)
        .single();

      if (data && !error) {
        currentShareableLink = `${window.location.origin}${window.location.pathname}?id=${cardId}`;
        renderCardData({
          sender: data.sender,
          reason: data.reason,
          note: data.note,
          bgImage: data.bg_image || data.bgImage,
          qrImage: data.qr_image || data.qrImage,
          musicUrl: data.music_url || data.musicUrl
        });
        if (loader) loader.classList.remove('show');
        showStep(4);
        startCardTimer(cardId);
        return;
      } else {
        alert('❌ ဤကတ်သည် သက်တမ်းကုန်သွားပြီ (သို့) မရှိတော့ပါ။');
      }
    }
  } catch (err) {
    console.error('View history card error:', err);
  }
  if (loader) loader.classList.remove('show');
}

async function deleteCardFromHistory(cardId, index) {
  if (!confirm('ဤမှတ်တမ်းကို ဖျက်ရန် သေချာပါသလား?')) return;

  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');

  try {
    const sb = getSupabase();
    if (sb) {
      await sb.from('cards').delete().eq('id', cardId);
    }
  } catch (err) {
    console.error('Delete card error:', err);
  }

  if (currentUser && currentUser.history) {
    currentUser.history.splice(index, 1);
    localStorage.setItem(`user_${currentUser.num}`, JSON.stringify(currentUser));
  }

  if (loader) loader.classList.remove('show');
  renderHistoryList();
}

function goToStep(stepNumber) {
  const timerEl = document.getElementById('topCardTimer');
  if (timerEl && stepNumber !== 4) {
    timerEl.style.display = 'none';
  }

  const loader = document.getElementById('stepLoader');
  loader.classList.add('show');
  setTimeout(() => {
    loader.classList.remove('show');
    showStep(stepNumber);
  }, 800);
}

function returnToProfileOrLogin() {
  if (isSharedLinkVisitor) {
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({path: cleanUrl}, '', cleanUrl);
    }
    isSharedLinkVisitor = false;
    
    const cardPlayer = document.getElementById('cardAudioPlayer');
    if (cardPlayer) {
      cardPlayer.pause();
      cardPlayer.currentTime = 0;
    }
    const timerEl = document.getElementById('topCardTimer');
    if (timerEl) timerEl.style.display = 'none';

    goToStep(1);
  } else {
    goToStep(2);
  }
}

function showStep(stepNumber) {
  const steps = document.querySelectorAll('.step');
  steps.forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(`step${stepNumber}`);
  if (target) {
    target.style.display = 'block';
    setTimeout(() => target.classList.add('active'), 50);
  }

  if (stepNumber === 4) {
    const previewPlayer = document.getElementById('audioPreviewPlayer');
    if (previewPlayer) {
      previewPlayer.pause();
      previewPlayer.currentTime = 0;
    }
    const eqContainer = document.querySelector('.preview-eq-bars');
    if (eqContainer) {
      eqContainer.classList.remove('playing');
    }
  }
}

function toggleCustomReason() {
  const dropdownVal = document.getElementById('reasonDropdownVal').value;
  const customGroup = document.getElementById('customReasonGroup');
  customGroup.style.display = (dropdownVal === 'အခြား') ? 'block' : 'none';
}

function populateReasonDropdown(lang) {
  const container = document.getElementById('reasonDropdown');
  if (!container) return;
  container.innerHTML = '';
  
  const reasonsList = i18n.my.reasons;
  reasonsList.forEach(item => {
    const div = document.createElement('div');
    div.className = 'custom-option';
    div.innerText = item.text;
    div.onclick = () => selectReasonOption(item.val, item.text);
    container.appendChild(div);
  });

  if (reasonsList.length > 0) {
    document.getElementById('reasonTriggerText').innerText = reasonsList[0].text;
    document.getElementById('reasonDropdownVal').value = reasonsList[0].val;
  }
  toggleCustomReason();
}

function selectReasonOption(val, text) {
  document.getElementById('reasonTriggerText').innerText = text;
  document.getElementById('reasonDropdownVal').value = val;
  document.getElementById('reasonCustomSelect').classList.remove('open');
  toggleCustomReason();
}

async function handleBgImage(input) {
  if (input.files && input.files[0]) {
    selectedBgFile = input.files[0];
    document.getElementById('bgImgLabel').innerText = `⏳ နောက်ခံပုံ တင်နေပါပြီ...`;
    savedBgImage = await compressFileToDataUrl(selectedBgFile, 900, 0.8);
    document.getElementById('bgImgLabel').innerText = `✅ HD ပုံရွေးပြီးပါပြီ (${input.files[0].name})`;
  }
}

async function handleQrImage(input) {
  if (input.files && input.files[0]) {
    selectedQrFile = input.files[0];
    document.getElementById('qrImgLabel').innerText = `⏳ QR ပုံ တင်နေပါပြီ...`;
    savedQrImage = await compressFileToDataUrl(selectedQrFile, 700, 0.8);
    document.getElementById('qrImgLabel').innerText = `✅ QR ပုံရွေးပြီးပါပြီ (${input.files[0].name})`;
  }
}

async function generateAndSaveCard() {
  const previewPlayer = document.getElementById('audioPreviewPlayer');
  if (previewPlayer) {
    previewPlayer.pause();
    previewPlayer.currentTime = 0;
  }
  const eqContainer = document.querySelector('.preview-eq-bars');
  if (eqContainer) {
    eqContainer.classList.remove('playing');
  }

  const reasonVal = document.getElementById('reasonDropdownVal').value;
  const customReason = document.getElementById('customReason').value.trim();
  const customNote = document.getElementById('customNote').value.trim();
  const finalReason = (reasonVal === 'အခြား' && customReason) ? customReason : reasonVal;

  const d = i18n.my;

  if (!customNote) {
    alert(d.alertNote);
    return;
  }

  if (selectedBgFile && !savedBgImage) {
    savedBgImage = await compressFileToDataUrl(selectedBgFile, 900, 0.8);
  }
  if (selectedQrFile && !savedQrImage) {
    savedQrImage = await compressFileToDataUrl(selectedQrFile, 700, 0.8);
  }

  if (!savedBgImage) {
    alert(d.alertBg);
    return;
  }
  if (!savedQrImage) {
    alert(d.alertQr);
    return;
  }

  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');

  try {
    const payload = {
      sender: currentUser ? currentUser.name : 'Aung',
      reason: finalReason,
      note: customNote,
      bg_image: savedBgImage,
      qr_image: savedQrImage,
      music_url: savedMusicUrl
    };

    const sb = getSupabase();
    if (!sb) {
      throw new Error('Supabase SDK မတက်ပါ။');
    }

    const { data, error } = await sb
      .from('cards')
      .insert([payload])
      .select();

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      const generatedId = data[0].id;
      currentShareableLink = `${window.location.origin}${window.location.pathname}?id=${generatedId}`;
      
      if (currentUser) {
        if (!currentUser.history) currentUser.history = [];
        currentUser.history.unshift({
          id: generatedId,
          link: currentShareableLink,
          reason: finalReason,
          createdAt: new Date().toLocaleString()
        });
        localStorage.setItem(`user_${currentUser.num}`, JSON.stringify(currentUser));
      }

      renderCardData({
        sender: payload.sender,
        reason: payload.reason,
        note: payload.note,
        bgImage: payload.bg_image,
        qrImage: payload.qr_image,
        musicUrl: payload.music_url
      });

      if (loader) loader.classList.remove('show');
      showStep(4);

      startCardTimer(generatedId);

      const cardPlayer = document.getElementById('cardAudioPlayer');
      const cardAudioGroup = document.getElementById('cardAudioGroup');
      if (cardPlayer && cardAudioGroup && savedMusicUrl) {
        cardPlayer.src = savedMusicUrl;
        cardPlayer.load();
        cardPlayer.play().catch(e => console.log("Card audio play error:", e));
        cardAudioGroup.style.display = 'flex';
      }
    }
  } catch (err) {
    console.error('Supabase Save Error:', err);
    if (loader) loader.classList.remove('show');
    alert('Error: ' + (err.message || JSON.stringify(err)));
  }
}

function downloadSingleQr() {
  if (!savedQrImage) {
    alert('QR ပုံ မထည့်ရသေးပါ။');
    return;
  }
  const link = document.createElement('a');
  link.download = 'Payment_QR_HD.png';
  link.href = savedQrImage;
  link.click();
}

function downloadSingleQrFromModal() {
  downloadSingleQr();
  closeShareModal();
}

function openShareModal() {
  document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
  document.getElementById('shareModal').style.display = 'none';
}

function copyShareLink() {
  navigator.clipboard.writeText(currentShareableLink).then(() => {
    alert('✅ လင့်ခ်ကူးယူပြီးပါပြီ!');
    closeShareModal();
  });
}

function changeLanguage(lang) {
  currentLang = 'my';
  updateTexts();
}
