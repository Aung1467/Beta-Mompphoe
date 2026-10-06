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
  { name: '🎵 song4.mp3', url: 'music/song4.mp3' },
  { name: '🎵 song5.mp3', url: 'music/song5.mp3' },
  { name: '🎵 song6.mp3', url: 'music/song6.mp3' },
  { name: '🎵 song7.mp3', url: 'music/song7.mp3' },
  { name: '🎵 song8.mp3', url: 'music/song8.mp3' },
  { name: '🎵 song9.mp3', url: 'music/song9.mp3' },
  { name: '🎵 song10.mp3', url: 'music/song10.mp3' },
  { name: '🎵 song11.mp3', url: 'music/song11.mp3' },
  { name: '🎵 song12.mp3', url: 'music/song12.mp3' },
  { name: '🎵 song13.mp3', url: 'music/song13.mp3' }
];

// ဘာသာစကား စာသားများ (မြန်မာ / English)
const i18n = {
  my: {
    pageTitle: "Beta Monpphoe",
    introMsg: "ကြိုဆိုပါတယ် ခဏစောင့်ပေးပါ...",
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
    bgLabel: "နောက်ခံပုံ / Video (Max 15s)",
    bgBtn: "📸/🎬 ပုံ သို့မဟုတ် Video",
    qrLabel: "QR Code / အချက်အလက်ပုံ",
    qrBtn: "💳 QR Code / ပုံ ရွေးရန်",
    backBtn: "⬅ နောက်သို့",
    genCardBtn: "ကတ်ဖန်တီးမည် ✨",
    step4Title: " မုန့်ဖိုးတောင်းလွှာ ",
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
    alertBg: "❌ ကျေးဇူးပြု၍ နောက်ခံပုံ သို့မဟုတ် Video (Max 15s) ထည့်ပါ။",
    alertQr: "❌ ကျေးဇူးပြု၍ QR Code / အချက်အလက်ပုံ ထည့်ပါ။",
    reasons: [
      { val: "သတင်းကျွတ်မုန့်ဖိုး", text: "သတင်းကျွတ်မုန့်ဖိုး" },
      { val: "ရည်းစားနဲ့လျှောက်လည်ရန်", text: "ရည်းစားနဲ့လျှောက်လည်ရန်" },
      { val: "သူငယ်ချင်းတွေနဲ့လျှောက်လည်ရန်", text: "သူငယ်ချင်းတွေနဲ့လျှောက်လည်ရန်" },
      { val: "သုံးစရာမရှိတော့လို့", text: "သုံးစရာမရှိတော့လို့" },
      { val: "အခြား", text: "အခြား (ကိုယ်တိုင်ရေးမည်)" }
    ]
  },
  en: {
    pageTitle: "Beta Monpphoe",
    introMsg: "Welcome! Please wait...",
    loaderMsg: "Please wait...",
    authTitle: "Account Auth",
    modeSelectLabel: "Select Option",
    optLogin: "Login Existing Account",
    optSignup: "Create New Account",
    nameLabel: "Name",
    namePlaceholder: "Enter your name",
    numLabel: "ID Number",
    numPlaceholder: "Enter any ID",
    passLabel: "Password",
    passPlaceholder: "Enter password",
    pass2Label: "Confirm Password",
    pass2Placeholder: "Re-enter password",
    loginBtn: "Login",
    signupBtn: "Sign Up",
    profileTitle: "User Profile",
    changeAvatar: "Change Avatar",
    changeNickBtn: "Edit Name",
    reqPocketBtn: "🧧 Request Pocket Money",
    historyBtn: "History",
    historyTitle: "Request History",
    backHistoryBtn: "⬅ Back",
    step3Title: "Request Details",
    dropdownLabel: "Select Reason",
    customReasonLabel: "Custom Reason",
    customReasonPlaceholder: "Enter your reason",
    customNoteLabel: "Custom Note / Message",
    customNotePlaceholder: "Type your note here...",
    musicLabel: "Select Music",
    bgLabel: "Background Image / Video (Max 15s)",
    bgBtn: "📸/🎬 Choose BG Image or Video",
    qrLabel: "QR Code / Payment Info (HD)",
    qrBtn: "💳 Choose QR Image",
    backBtn: "⬅ Back",
    genCardBtn: "Create Card",
    step4Title: " Pocket Money Request ",
    qrHint: "", 
    saveBtn: "💾 Save QR",
    shareBtn: "📤 Share Request",
    profileReturnBtn: "🏠 Return to Profile",
    modalTitle: "📤 Share Link",
    modalSub: "Send your request card and link to:",
    copyLinkBtn: "📋 Copy Link",
    dl1to1Btn: "📥 Save QR",
    closeBtn: "Close",
    alertNote: "❌ Please fill in the custom note field.",
    alertBg: "❌ Please upload a background image or video (Max 15s).",
    alertQr: "❌ Please upload a QR code / Payment image.",
    reasons: [
      { val: "သတင်းကျွတ်မုန့်ဖိုး", text: "Thadingyut Pocket Money" },
      { val: "ရည်းစားနဲ့လျှောက်လည်ရန်", text: "Go out with lover" },
      { val: "သူငယ်ချင်းတွေနဲ့လျှောက်လည်ရန်", text: "Hang out with friends" },
      { val: "သုံးစရာမရှိတော့လို့", text: "Out of pocket money" },
      { val: "အခြား", text: "Other (Custom)" }
    ]
  }
};

// 🌟 Injected CSS Styles
const cardStyleInjected = document.createElement('style');
cardStyleInjected.innerHTML = `
  /* Floating Animation */
  @keyframes float1to1 {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }

  /* Fast Glow Animation (1.0s speed) */
  @keyframes realisticFireGlow {
    0% {
      border-color: #ff3838;
      box-shadow: 0 0 8px #ff4d4d, 0 0 16px #ff9f1a, inset 0 0 8px #ff3838;
    }
    50% {
      border-color: #ff9f1a;
      box-shadow: 0 0 14px #ffb142, 0 0 24px #ff5252, inset 0 0 12px #ff9f1a;
    }
    100% {
      border-color: #ff3838;
      box-shadow: 0 0 8px #ff4d4d, 0 0 16px #ff9f1a, inset 0 0 8px #ff3838;
    }
  }

  .preview-eq-bars, #audioPreviewGroup .preview-eq-bars {
    display: none !important;
  }

  /* Mini Equalizer Wave Animation */
  .mini-eq-container {
    display: inline-flex;
    align-items: flex-end;
    gap: 2.5px;
    height: 14px;
    margin-left: auto;
    padding-right: 6px;
    vertical-align: middle;
  }

  .mini-eq-bar {
    width: 3px;
    background: #00f2fe;
    border-radius: 2px;
    box-shadow: 0 0 6px #00f2fe;
    animation: eqJump 0.8s ease-in-out infinite alternate;
  }

  .mini-eq-bar:nth-child(1) { height: 35%; animation-delay: 0.1s; }
  .mini-eq-bar:nth-child(2) { height: 100%; animation-delay: 0.3s; }
  .mini-eq-bar:nth-child(3) { height: 60%; animation-delay: 0.2s; }
  .mini-eq-bar:nth-child(4) { height: 85%; animation-delay: 0.4s; }

  @keyframes eqJump {
    0% { height: 20%; opacity: 0.5; }
    100% { height: 100%; opacity: 1; }
  }

  #musicCustomSelect .custom-select-trigger {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  #outReason {
    margin-bottom: 12px !important;
    display: block !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 16px !important;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8) !important;
  }

  #outNote {
    margin-top: 6px !important;
    display: block !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    font-size: 13px !important;
    line-height: 1.4 !important;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8) !important;
  }

  #exportCard {
    position: relative !important;
    overflow: hidden !important;
    box-shadow: 0 0 20px rgba(0, 242, 254, 0.4), 0 10px 24px rgba(0, 0, 0, 0.8) !important;
    animation: none !important;
    width: 100% !important;
    max-width: 320px !important;
    aspect-ratio: 3 / 4 !important;
    margin: 0 auto 14px auto !important;
    border-radius: 20px !important;
    border: 2px solid var(--accent) !important;
    background: #0f1123 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    padding: 14px !important;
  }

  /* BG Image and BG Video Positioning */
  #cardBgImg, #cardBgVideo {
    position: absolute !important;
    inset: 0 !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    z-index: 1 !important;
    pointer-events: none !important;
  }

  #exportCard > *:not(#cardBgImg):not(#cardBgVideo) {
    position: relative !important;
    z-index: 5 !important;
  }

  #outSender, .sender-tag {
    position: absolute !important;
    top: 6px !important;
    right: 6px !important;
    left: auto !important;
    width: auto !important;
    max-width: fit-content !important;
    display: inline-block !important;
    padding: 3px 9px !important;
    font-size: 10.5px !important;
    font-weight: 700 !important;
    background: var(--primary, #ff0055) !important;
    color: #ffffff !important;
    border-radius: 6px !important;
    box-shadow: 0 2px 8px rgba(255, 0, 85, 0.4) !important;
    z-index: 10 !important;
    white-space: nowrap !important;
  }

  #lbl_qrHint {
    display: none !important;
  }

  #cardQrImg {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }

  .qr-img-wrapper, #qrWrapper {
    display: block !important;
    width: 100% !important;
    max-width: 95px !important;
    aspect-ratio: 1 / 1 !important;
    margin: 0 auto !important;
    border-radius: 10px !important;
    overflow: hidden !important;
    border: 2px solid #ff3838 !important;
    background: rgba(255, 255, 255, 0.95) !important;
    z-index: 5 !important;
    position: relative !important;
    animation: float1to1 3.5s ease-in-out infinite, realisticFireGlow 1.0s infinite ease-in-out !important;
  }

  .top-card-timer {
    position: absolute;
    top: 75px;
    left: 50%;
transform: translateX(-50%);
    z-index: 100;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 700;
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
`;
document.head.appendChild(cardStyleInjected);

// Helper: LocalStorage ထဲတွင် နာမည်တူရှိမရှိ စစ်ဆေးသည့် Function
function isNameTaken(name, currentNum = null) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('user_')) {
      const u = JSON.parse(localStorage.getItem(key));
      // တကယ်လို့ နာမည်တူပြီး ID (num) မတူရင် တူတယ်ဟု သတ်မှတ်မည်
      if (u.name.toLowerCase() === name.toLowerCase() && u.num !== currentNum) {
        return true;
      }
    }
  }
  return false;
}

// Text Localization Function
function updateTexts() {
  const d = i18n[currentLang] || i18n.my;
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
  
  if(document.getElementById('lbl_customReason')) document.getElementById('lbl_customReason').innerText = d.customReasonLabel;
  if(document.getElementById('customReason')) document.getElementById('customReason').placeholder = d.customReasonPlaceholder;
  if(document.getElementById('lbl_customNote')) document.getElementById('lbl_customNote').innerText = d.customNoteLabel;
  if(document.getElementById('customNote')) document.getElementById('customNote').placeholder = d.customNotePlaceholder;

  if(document.getElementById('lbl_musicLabel')) document.getElementById('lbl_musicLabel').innerText = d.musicLabel;
  if(document.getElementById('lbl_bgLabel')) document.getElementById('lbl_bgLabel').innerText = d.bgLabel;
  if(document.getElementById('bgImgLabel') && !selectedBgFile) document.getElementById('bgImgLabel').innerText = d.bgBtn;
  if(document.getElementById('lbl_qrLabel')) document.getElementById('lbl_qrLabel').innerText = d.qrLabel;
  if(document.getElementById('qrImgLabel') && !selectedQrFile) document.getElementById('qrImgLabel').innerText = d.qrBtn;

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

// Language Switcher Function
function changeLanguage(lang) {
  currentLang = lang || 'my';
  updateTexts();
  populateReasonDropdown(currentLang);
}

// Compress File or Read File as DataURL
function compressFileToDataUrl(file, maxWidth = 900, quality = 0.8) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    
    if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

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

// Check Video Duration (Max 15s)
function getVideoDuration(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => resolve(0);
    video.src = URL.createObjectURL(file);
  });
}

// Helper: Mini Equalizer Html
function getMiniEqHtml() {
  return `
    <div class="mini-eq-container">
      <div class="mini-eq-bar"></div>
      <div class="mini-eq-bar"></div>
      <div class="mini-eq-bar"></div>
      <div class="mini-eq-bar"></div>
    </div>
  `;
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
      document.getElementById('musicTriggerText').innerHTML = `${song.name} ${getMiniEqHtml()}`;
      found = true;
    }
  });

  if (!found && localMusicList.length > 0) {
    document.getElementById('musicTriggerText').innerHTML = `${localMusicList[0].name} ${getMiniEqHtml()}`;
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
  document.getElementById('musicTriggerText').innerHTML = `${name} ${getMiniEqHtml()}`;
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
    player.play().catch(e => console.log("Auto-play error:", e));
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
  populateReasonDropdown(currentLang);
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

// Render Card Data
function renderCardData(data) {
  if (!data) return;

  document.getElementById('outSender').innerText = data.sender ? `From: ${data.sender}` : '';
  document.getElementById('outReason').innerText = data.reason || '';
  document.getElementById('outNote').innerText = data.note || '';

  const bgSrc = data.bgImage || data.bg_image || savedBgImage;
  const bgImgEl = document.getElementById('cardBgImg');
  const bgVideoEl = document.getElementById('cardBgVideo');

  if (bgSrc) {
    savedBgImage = bgSrc;
    const isVideo = bgSrc.startsWith('data:video/') || bgSrc.endsWith('.mp4');

    if (isVideo) {
      if (bgImgEl) bgImgEl.style.display = 'none';
      if (bgVideoEl) {
        bgVideoEl.src = bgSrc;
        bgVideoEl.style.display = 'block';
        bgVideoEl.play().catch(e => console.log("Video play error:", e));
      }
    } else {
      if (bgVideoEl) {
        bgVideoEl.pause();
        bgVideoEl.style.display = 'none';
      }
      if (bgImgEl) {
        bgImgEl.src = bgSrc;
        bgImgEl.style.display = 'block';
      }
    }
  }

  const qrImgSrc = data.qrImage || data.qr_image || savedQrImage;
  if (qrImgSrc) {
    savedQrImage = qrImgSrc;
    const qrEl = document.getElementById('cardQrImg');
    const qrWr = document.getElementById('qrWrapper');
    if (qrEl) qrEl.src = qrImgSrc;
    if (qrWr) qrWr.style.display = 'block';
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

function stopCardTimer() {
  if (cardTimerInterval) {
    clearInterval(cardTimerInterval);
    cardTimerInterval = null;
  }
  const timerEl = document.getElementById('topCardTimer');
  if (timerEl) timerEl.style.display = 'none';
}

function startCardTimer(cardId) {
  stopCardTimer();

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
      stopCardTimer();
      await deleteCardDataAndClean(cardId, storageKey);
      return;
    }

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 120));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (timerEl) {
      timerEl.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}အထိသာ`;
    }
  }, 1000);
}

async function deleteCardDataAndClean(cardId, storageKey) {
  savedBgImage = '';
  savedQrImage = '';
  savedMusicUrl = '';
  currentShareableLink = '';
  localStorage.removeItem(storageKey);

  stopCardTimer();

  const bgEl = document.getElementById('cardBgImg');
  if (bgEl) bgEl.style.display = 'none';
  const bgVideoEl = document.getElementById('cardBgVideo');
  if (bgVideoEl) {
    bgVideoEl.pause();
    bgVideoEl.style.display = 'none';
  }
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

  alert(currentLang === 'en' ? '⚠️️ Card expired (120 min). Data cleaned.' : '⚠️ ကတ်သက်တမ်း (မိနစ် 120) ပြည့်သွားပြီဖြစ်ပါ၍ အချက်အလက်များနှင့် လင့်ခ်များကို အလိုအလျောက် ဖျက်ဆီးပြီးပါပြီ။');
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

// 🌟 Account သစ်ဖွင့်ခြင်း (Signup Validation - ID နှင့် Name နှစ်ခုလုံး တူမရအောင် စစ်ဆေးပေးသည်)
function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const num = document.getElementById('signupNum').value.trim();
  const p1 = document.getElementById('signupPass1').value;
  const p2 = document.getElementById('signupPass2').value;

  // ၁။ ကွက်လပ်များ ပြည့်စုံစွာ ဖြည့်ထားခြင်း ရှိမရှိ စစ်ဆေးခြင်း
  if (!name || !num || !p1 || !p2) {
    alert(currentLang === 'en' ? 'Please fill in all fields.' : 'အချက်အလက်များအားလုံး ဖြည့်သွင်းပါ။');
    return;
  }

  // ၂။ ID တစ်ယောက်ယောက် သုံးပြီးသား ဟုတ်/မဟုတ် စစ်ဆေးခြင်း
  if (localStorage.getItem(`user_${num}`)) {
    alert(
      currentLang === 'en'
        ? '⚠️ This ID is already registered. Please choose another ID.'
        : '⚠️ ဤ ID အား အသုံးပြုပြီးသား ဖြစ်ပါသည်။ အခြား ID တစ်ခု ပြောင်းလဲ ရိုက်ထည့်ပါ'
    );
    return;
  }

  // ၃။ နာမည် တူနေသူ ရှိမရှိ စစ်ဆေးခြင်း (Name Unique Check)
  if (isNameTaken(name)) {
    alert(
      currentLang === 'en'
        ? '⚠️ This name is already taken. Please choose a different name.'
        : '⚠️ ဤနာမည်ဖြင့် အကောင့်ဖွင့်ထားပြီး ဖြစ်ပါသည်။ ကျေးဇူးပြု၍ အခြားနာမည်တစ်ခု ပြောင်းလဲသုံးပေးပါ။'
    );
    return;
  }

  // ၄။ Password အနည်းဆုံး ၆ လုံး နှင့် English စာလုံး ပါဝင်မှု ရှိမရှိ စစ်ဆေးခြင်း
  const hasEnglishLetter = /[a-zA-Z]/.test(p1);
  if (p1.length < 6 || !hasEnglishLetter) {
    alert(
      currentLang === 'en'
        ? '⚠️ Password must be at least 6 characters and contain English letters (a-z/A-Z).'
        : '⚠️ Password သည် အနည်းဆုံး ၆ လုံး ရှိရမည်ဖြစ်ပြီး English စာလုံး (a-z/A-Z) ပါဝင်ရပါမည်။'
    );
    return;
  }

  // ၅။ Password ၂ ခု ကိုက်ညီမှု စစ်ဆေးခြင်း
  if (p1 !== p2) {
    alert(currentLang === 'en' ? 'Passwords do not match.' : 'Password ၂ ခု မတူပါ။ ကျေးဇူးပြု၍ စစ်ဆေးပါ။');
    return;
  }

  const userData = { name, num, pass: p1, avatar: '', history: [] };
  localStorage.setItem(`user_${num}`, JSON.stringify(userData));
  
  alert(currentLang === 'en' ? '✅ Account created successfully!' : '✅ အကောင့်အသစ် ဖွင့်ပြီးပါပြီ!');
  currentUser = userData;
  setupProfileView();
  goToStep(2);
}

// Account ဝင်ရောက်ခြင်း (Login)
function handleLogin() {
  const name = document.getElementById('loginName').value.trim();
  const pass = document.getElementById('loginPass').value;

  if (!name || !pass) {
    alert(currentLang === 'en' ? 'Please enter name and password.' : 'နာမည်နှင့် Password ဖြည့်ပါ။');
    return;
  }

  let foundUser = null;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('user_')) {
      const u = JSON.parse(localStorage.getItem(key));
      if (u.name.toLowerCase() === name.toLowerCase()) {
        foundUser = u;
        break;
      }
    }
  }

  if (!foundUser) {
    alert(currentLang === 'en' ? 'Account not found. Please sign up.' : 'ဤနာမည်ဖြင့် မှတ်ပုံတင်ထားသော အကောင့်မရှိပါ။ အကောင့်သစ်ဖွင့်ပါ။');
    return;
  }

  if (foundUser.pass !== pass) {
    alert(currentLang === 'en' ? 'Incorrect password.' : 'Password မှားယွင်းနေပါသည်။');
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

// 🌟 နာမည်ပြောင်းသည့်အခါ နာမည်တူရှိနေပါက ပြောင်းမရအောင် စစ်ဆေးသည့် Logic ပါဝင်သော Function
function changeNickname() {
  if (!currentUser) return;
  
  let modal = document.getElementById('customNickModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'customNickModal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999; opacity: 0; transition: opacity 0.3s ease;
    `;
    modal.innerHTML = `
      <div style="
        background: rgba(15, 23, 42, 0.95);
        border: 1.5px solid rgba(0, 242, 254, 0.5);
        box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
        border-radius: 16px; padding: 22px 20px; width: 88%; max-width: 320px;
        text-align: center; color: #fff; transform: scale(0.9); transition: transform 0.3s ease;
      ">
        <h3 style="margin: 0 0 14px 0; font-size: 16px; color: #00f2fe; font-weight: 600;">
          ${currentLang === 'en' ? 'Change Name' : 'နာမည်ပြောင်းရန်'}
        </h3>
        <input type="text" id="customNickInput" placeholder="${currentLang === 'en' ? 'Enter new name' : 'နာမည်အသစ် ရိုက်ထည့်ပါ'}" style="
          width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(0, 242, 254, 0.4);
          background: rgba(255,255,255,0.07); color: #fff; font-size: 14px; outline: none; margin-bottom: 18px; box-sizing: border-box; text-align: center;
        "/>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="customNickCancel" style="
            flex: 1; padding: 9px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.1); color: #ccc; cursor: pointer; font-size: 13px;
          ">${currentLang === 'en' ? 'Cancel' : 'မလုပ်တော့ပါ'}</button>
          <button id="customNickOk" style="
            flex: 1; padding: 9px; border-radius: 8px; border: none;
            background: linear-gradient(135deg, #00f2fe, #4facfe); color: #090d16; font-weight: bold; cursor: pointer; font-size: 13px; box-shadow: 0 0 10px rgba(0,242,254,0.4);
          ">OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const input = modal.querySelector('#customNickInput');
  input.value = currentUser.name || '';
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.children[0].style.transform = 'scale(1)';
    input.focus();
  }, 10);

  const closeModal = () => {
    modal.style.opacity = '0';
    modal.children[0].style.transform = 'scale(0.9)';
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  };

  modal.querySelector('#customNickCancel').onclick = closeModal;

  modal.querySelector('#customNickOk').onclick = () => {
    const newName = input.value.trim();
    if (newName) {
      // နာမည်အသစ်သည် အခြားသူ သုံးပြီးသားဖြစ်နေပါက Alert ထုတ်ပြမည်
      if (isNameTaken(newName, currentUser.num)) {
        alert(
          currentLang === 'en'
            ? '⚠️ This name is already taken by another user.'
            : '⚠️ ဤနာမည်အား အခြားသူတစ်ဦးမှ အသုံးပြုထားပြီး ဖြစ်ပါသည်။ အခြားနာမည်တစ်ခု ပြောင်းလဲရိုက်ထည့်ပါ။'
        );
        return;
      }

      currentUser.name = newName;
      localStorage.setItem(`user_${currentUser.num}`, JSON.stringify(currentUser));
      setupProfileView();
      alert(currentLang === 'en' ? "Name updated successfully!" : "နာမည်ပြောင်းလဲပြီးပါပြီ!");
      closeModal();
    }
  };
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
    container.innerHTML = `<p style="text-align: center; color: #cbd5e1; font-size: 13px; padding: 20px;">${currentLang === 'en' ? 'No history records found.' : 'မှတ်တမ်းများ မရှိသေးပါ။'}</p>`;
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
    expireText.innerText = '120:00';

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
    viewItem.innerText = currentLang === 'en' ? 'View' : 'ကြည့်ရန်';
    viewItem.style.padding = '6px 12px';
    viewItem.style.cursor = 'pointer';
    viewItem.style.fontSize = '12px';
    viewItem.style.color = '#fff';
    viewItem.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
    viewItem.onclick = () => viewCardFromHistory(item.id);

    const deleteItem = document.createElement('div');
    deleteItem.className = 'history-dropdown-item';
    deleteItem.innerText = currentLang === 'en' ? 'Delete' : 'ဖျက်ပြစ်ရန်';
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
      span.innerText = currentLang === 'en' ? 'Expired' : 'သက်တမ်း - အချိန်ကုန်သွားပါပြီ';
      return;
    }

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    span.innerText = `${currentLang === 'en' ? 'Expires' : 'သက်တမ်း'} - ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
    target.style.display = target.classList.contains('show') ? 'block' : 'none';
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
        alert(currentLang === 'en' ? '❌ Card has expired or been removed.' : '❌ ဤကတ်သည် သက်တမ်းကုန်သွားပြီ (သို့) မရှိတော့ပါ။');
      }
    }
  } catch (err) {
    console.error('View history card error:', err);
  }
  if (loader) loader.classList.remove('show');
}

async function deleteCardFromHistory(cardId, index) {
  if (!confirm(currentLang === 'en' ? 'Are you sure you want to delete this record?' : 'ဤမှတ်တမ်းကို ဖျက်ရန် သေချာပါသလား?')) return;

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
  if (stepNumber !== 4) {
    stopCardTimer();
  }

  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');
  setTimeout(() => {
    if (loader) loader.classList.remove('show');
    showStep(stepNumber);
  }, 800);
}

function returnToProfileOrLogin() {
  stopCardTimer();
  
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
  
  const reasonsList = (i18n[lang] || i18n.my).reasons;
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
    const file = input.files[0];

    if (file.type.startsWith('video/')) {
      const duration = await getVideoDuration(file);
      if (duration > 15) {
        alert(currentLang === 'en' ? '⚠️ Video duration must not exceed 15 seconds.' : '⚠️ Video ကြာချိန်သည် 15 စက္ကန့်ထက် မပိုရပါ။');
        input.value = '';
        return;
      }
    }

    selectedBgFile = file;
    document.getElementById('bgImgLabel').innerText = currentLang === 'en' ? `⏳ Uploading...` : `⏳ ဖိုင် တင်နေပါပြီ...`;
    savedBgImage = await compressFileToDataUrl(selectedBgFile, 900, 0.8);
    
    const isVid = file.type.startsWith('video/');
    document.getElementById('bgImgLabel').innerText = `✅ ${isVid ? '🎬 Video' : '📸 Image'} (${file.name})`;
  }
}

async function handleQrImage(input) {
  if (input.files && input.files[0]) {
    selectedQrFile = input.files[0];
    document.getElementById('qrImgLabel').innerText = currentLang === 'en' ? `⏳ Uploading...` : `⏳ QR ပုံ တင်နေပါပြီ...`;
    savedQrImage = await compressFileToDataUrl(selectedQrFile, 700, 0.8);
    document.getElementById('qrImgLabel').innerText = `✅ QR (${input.files[0].name})`;
  }
}

async function generateAndSaveCard() {
  const previewPlayer = document.getElementById('audioPreviewPlayer');
  if (previewPlayer) {
    previewPlayer.pause();
    previewPlayer.currentTime = 0;
  }

  const reasonVal = document.getElementById('reasonDropdownVal').value;
  const customReason = document.getElementById('customReason').value.trim();
  const customNote = document.getElementById('customNote').value.trim();
  const finalReason = (reasonVal === 'အခြား' && customReason) ? customReason : reasonVal;

  const d = i18n[currentLang] || i18n.my;

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
      throw new Error('Supabase SDK client error.');
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
    alert(currentLang === 'en' ? 'No QR image uploaded.' : 'QR ပုံ မထည့်ရသေးပါ။');
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
    alert(currentLang === 'en' ? '✅ Link copied to clipboard!' : '✅ လင့်ခ်ကူးယူပြီးပါပြီ!');
    closeShareModal();
  });
}
