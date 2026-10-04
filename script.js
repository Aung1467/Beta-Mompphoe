// Supabase Configuration (သင်၏ Supabase အချက်အလက်များထည့်ရန်)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
let supabaseClient = null;

try {
  if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.error("Supabase init error:", e);
}

// App State
let currentUser = null;
let currentAvatarUrl = "";
let currentBgUrl = "";
let currentQrUrl = "";

// Multi-language Dictionaries
const translations = {
  my: {
    introMsg: "မင်္ဂလာပါ 👋 ခဏစောင့်ပေးပါ...",
    loaderMsg: "ခဏစောင့်ပါ...",
    authTitle: "အကောင့်ဝင်ရန်",
    modeSelect: "အမျိုးအစား ရွေးချယ်ရန်",
    loginName: "သင်၏ နာမည်",
    loginPass: "Password",
    btnLogin: "အကောင့်ဝင်မည် 🔓",
    signupName: "သင်၏ နာမည်",
    signupNum: "ဂဏန်း (ကုဒ်နံပါတ်)",
    signupPass1: "Password အသစ်ပေးရန်",
    signupPass2: "Password ထပ်မံရိုက်ပါ",
    btnSignup: "အကောင့်အသစ်ဖွင့်မည် ✨",
    profileTitle: "👤 ကိုယ်ရေးအချက်အလက်",
    changeAvatar: "📷 Profile ပုံပြောင်းရန်",
    reqPocketBtn: "🧧 မုန့်ဖိုးတောင်းရန်",
    historyBtn: "📜 မှတ်တမ်းများ",
    step3Title: "မုန့်ဖိုးတောင်းမည့် အကြောင်းအရာ",
    dropdown: "အကြောင်းအရာ ရွေးချယ်ရန်",
    customReason: "ကိုယ်တိုင်စာရေးရန်",
    customNote: "မုန့်ဖိုးတောင်းဖို့ စာစီရန်",
    bgLabel: "နောက်ခံပုံ (4:3 Ratio)",
    qrLabel: "QR Code / အချက်အလက်ပုံ",
    btnBack: "⬅ နောက်သို့",
    btnGen: "ကတ်ဖန်တီးမည် ✨",
    step4Title: "🎉 မုန့်ဖိုးတောင်းလွှာ 🎉",
    qrHint: "Scan or Pay to Send Pocket Money 👇",
    saveQr: "Save QR",
    share: "Share",
    profileReturn: "🏠 Profile သို့ပြန်ရန်",
    modalTitle: "📤 မျှဝေရန်",
    modalSub: "မုန့်ဖိုးတောင်းလွှာနှင့် လင့်ခ်ကို ပို့ရန် -",
    copyLink: "📋 လင့်ခ် ကူးယူရန်",
    dlQrModal: "📥 QR ပုံ သိမ်းရန်",
    closeModal: "ပိတ်မည်"
  },
  en: {
    introMsg: "Hello 👋 Please wait...",
    loaderMsg: "Please wait...",
    authTitle: "Sign In",
    modeSelect: "Select Mode",
    loginName: "Your Name",
    loginPass: "Password",
    btnLogin: "Login 🔓",
    signupName: "Your Name",
    signupNum: "Number Code",
    signupPass1: "New Password",
    signupPass2: "Confirm Password",
    btnSignup: "Sign Up ✨",
    profileTitle: "👤 Profile",
    changeAvatar: "📷 Change Profile Picture",
    reqPocketBtn: "🧧 Request Pocket Money",
    historyBtn: "📜 History",
    step3Title: "Reason for Request",
    dropdown: "Select Reason",
    customReason: "Custom Reason",
    customNote: "Custom Note",
    bgLabel: "Background (4:3 Ratio)",
    qrLabel: "QR Code / Payment Info",
    btnBack: "⬅ Back",
    btnGen: "Generate Card ✨",
    step4Title: "🎉 Pocket Money Card 🎉",
    qrHint: "Scan or Pay to Send Pocket Money 👇",
    saveQr: "Save QR",
    share: "Share",
    profileReturn: "🏠 Return to Profile",
    modalTitle: "📤 Share",
    modalSub: "Send card and link -",
    copyLink: "📋 Copy Link",
    dlQrModal: "📥 Save QR",
    closeModal: "Close"
  }
};

let currentLang = 'my';

function changeLanguage(lang) {
  currentLang = lang;
  const t = translations[lang] || translations['my'];
  
  if(document.getElementById('introMsg')) document.getElementById('introMsg').innerText = t.introMsg;
  if(document.getElementById('lbl_loaderMsg')) document.getElementById('lbl_loaderMsg').innerText = t.loaderMsg;
  if(document.getElementById('lbl_authTitle')) document.getElementById('lbl_authTitle').innerText = t.authTitle;
  if(document.getElementById('lbl_modeSelect')) document.getElementById('lbl_modeSelect').innerText = t.modeSelect;
  if(document.getElementById('lbl_loginName')) document.getElementById('lbl_loginName').innerText = t.loginName;
  if(document.getElementById('lbl_loginPass')) document.getElementById('lbl_loginPass').innerText = t.loginPass;
  if(document.getElementById('btn_login')) document.getElementById('btn_login').innerText = t.btnLogin;
  if(document.getElementById('lbl_signupName')) document.getElementById('lbl_signupName').innerText = t.signupName;
  if(document.getElementById('lbl_signupNum')) document.getElementById('lbl_signupNum').innerText = t.signupNum;
  if(document.getElementById('lbl_signupPass1')) document.getElementById('lbl_signupPass1').innerText = t.signupPass1;
  if(document.getElementById('lbl_signupPass2')) document.getElementById('lbl_signupPass2').innerText = t.signupPass2;
  if(document.getElementById('btn_signup')) document.getElementById('btn_signup').innerText = t.btnSignup;
  if(document.getElementById('lbl_profileTitle')) document.getElementById('lbl_profileTitle').innerText = t.profileTitle;
  if(document.getElementById('lbl_changeAvatar')) document.getElementById('lbl_changeAvatar').innerText = t.changeAvatar;
  if(document.getElementById('lbl_reqPocketBtn')) document.getElementById('lbl_reqPocketBtn').innerText = t.reqPocketBtn;
  if(document.getElementById('lbl_historyBtn')) document.getElementById('lbl_historyBtn').innerText = t.historyBtn;
  if(document.getElementById('lbl_step3Title')) document.getElementById('lbl_step3Title').innerText = t.step3Title;
  if(document.getElementById('lbl_dropdown')) document.getElementById('lbl_dropdown').innerText = t.dropdown;
  if(document.getElementById('lbl_customReason')) document.getElementById('lbl_customReason').innerText = t.customReason;
  if(document.getElementById('lbl_customNote')) document.getElementById('lbl_customNote').innerText = t.customNote;
  if(document.getElementById('lbl_bgLabel')) document.getElementById('lbl_bgLabel').innerText = t.bgLabel;
  if(document.getElementById('lbl_qrLabel')) document.getElementById('lbl_qrLabel').innerText = t.qrLabel;
  if(document.getElementById('btn_backStep3')) document.getElementById('btn_backStep3').innerText = t.btnBack;
  if(document.getElementById('btn_genCard')) document.getElementById('btn_genCard').innerText = t.btnGen;
  if(document.getElementById('lbl_step4Title')) document.getElementById('lbl_step4Title').innerText = t.step4Title;
  if(document.getElementById('lbl_qrHint')) document.getElementById('lbl_qrHint').innerText = t.qrHint;
  if(document.getElementById('btn_saveQr')) document.getElementById('btn_saveQr').innerText = t.saveQr;
  if(document.getElementById('btn_share')) document.getElementById('btn_share').innerText = t.share;
  if(document.getElementById('btn_profileReturn')) document.getElementById('btn_profileReturn').innerText = t.profileReturn;
  if(document.getElementById('lbl_modalTitle')) document.getElementById('lbl_modalTitle').innerText = t.modalTitle;
  if(document.getElementById('lbl_modalSub')) document.getElementById('lbl_modalSub').innerText = t.modalSub;
  if(document.getElementById('btn_copyLink')) document.getElementById('btn_copyLink').innerText = t.copyLink;
  if(document.getElementById('btn_dlQrModal')) document.getElementById('btn_dlQrModal').innerText = t.dlQrModal;
  if(document.getElementById('btn_closeModal')) document.getElementById('btn_closeModal').innerText = t.closeModal;
}

// Intro Splash fade out on load
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('introSplash');
    if(splash) splash.classList.add('fade-out');
  }, 1200);
  populateReasons();
});

function showLoader(show) {
  const loader = document.getElementById('stepLoader');
  if(loader) {
    if(show) loader.classList.add('show');
    else loader.classList.remove('show');
  }
}

function goToStep(stepNum) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('step' + stepNum);
  if(target) target.classList.add('active');
}

// Switch Login / Signup Forms
function switchAuthMode(mode) {
  const loginSec = document.getElementById('loginFormSection');
  const signupSec = document.getElementById('signupFormSection');
  if(mode === 'login') {
    if(loginSec) loginSec.style.display = 'block';
    if(signupSec) signupSec.style.display = 'none';
  } else {
    if(loginSec) loginSec.style.display = 'none';
    if(signupSec) signupSec.style.display = 'block';
  }
}

// Populate Reasons for Custom Dropdown
function populateReasons() {
  const reasons = [
    { val: 'snack', text: '☕ မုန့်ဖိုးဝယ်စားဖို့ပါ' },
    { val: 'game', text: '🎮 ဂိမ်းငွေဖြည့်ဖို့ပါ' },
    { val: 'date', text: '🌹 ရည်းစားနဲ့ Date ဖို့ပါ' },
    { val: 'shopping', text: '🛍 Shopping ဝယ်ဖို့ပါ' },
    { val: 'custom', text: '✨ အခြားအကြောင်းအရာ (ကိုယ်တိုင်ရေးရန်)' }
  ];

  const container = document.getElementById('reasonCustomOptions');
  if(!container) return;
  container.innerHTML = '';

  reasons.forEach(r => {
    const div = document.createElement('div');
    div.className = 'custom-option';
    div.innerText = r.text;
    div.onclick = () => selectReasonOption(r.val, r.text);
    container.appendChild(div);
  });

  // Set default first
  if(reasons.length > 0) {
    document.getElementById('reasonTriggerText').innerText = reasons[0].text;
    document.getElementById('reasonDropdown').value = reasons[0].val;
    toggleCustomReason();
  }
}

function selectReasonOption(val, text) {
  document.getElementById('reasonTriggerText').innerText = text;
  document.getElementById('reasonDropdown').value = val;
  document.getElementById('reasonCustomSelect').classList.remove('open');
  toggleCustomReason();
}

function toggleCustomReason() {
  const val = document.getElementById('reasonDropdown').value;
  const customGroup = document.getElementById('customReasonGroup');
  if(customGroup) {
    if(val === 'custom') {
      customGroup.style.display = 'block';
    } else {
      customGroup.style.display = 'none';
    }
  }
}

// Handle Login
function handleLogin() {
  const name = document.getElementById('loginName').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  if(!name || !pass) {
    alert('ကျေးဇူးပြု၍ နာမည်နှင့် Password ဖြည့်ပါ။');
    return;
  }
  showLoader(true);
  setTimeout(() => {
    showLoader(false);
    currentUser = { name: name, num: 'VIP-001' };
    document.getElementById('displayProfileName').innerText = name;
    document.getElementById('displayProfileNum').innerText = 'ဂဏန်း: VIP-001';
    goToStep(2);
  }, 800);
}

// Handle Signup
function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const num = document.getElementById('signupNum').value.trim();
  const p1 = document.getElementById('signupPass1').value.trim();
  const p2 = document.getElementById('signupPass2').value.trim();

  if(!name || !num || !p1 || !p2) {
    alert('အချက်အလက်အားလုံး ဖြည့်ပါ။');
    return;
  }
  if(p1 !== p2) {
    alert('Password နှစ်ခု မတူပါ။');
    return;
  }
  showLoader(true);
  setTimeout(() => {
    showLoader(false);
    currentUser = { name: name, num: num };
    document.getElementById('displayProfileName').innerText = name;
    document.getElementById('displayProfileNum').innerText = 'ဂဏန်း: ' + num;
    goToStep(2);
  }, 800);
}

// Profile Avatar Update
function updateProfileAvatar(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentAvatarUrl = e.target.result;
      const box = document.getElementById('profileAvatarBox');
      box.innerHTML = `<img src="${currentAvatarUrl}" alt="Avatar">`;
    }
    reader.readAsDataURL(input.files[0]);
  }
}

// Background Image Handler
function handleBgImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentBgUrl = e.target.result;
      document.getElementById('bgImgLabel').innerText = "✅ နောက်ခံပုံ ရွေးပြီးပါပြီ";
    }
    reader.readAsDataURL(input.files[0]);
  }
}

// QR Image Handler
function handleQrImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentQrUrl = e.target.result;
      document.getElementById('qrImgLabel').innerText = "✅ QR ပုံ ရွေးပြီးပါပြီ";
    }
    reader.readAsDataURL(input.files[0]);
  }
}

// Generate Card
function generateAndSaveCard() {
  const reasonVal = document.getElementById('reasonDropdown').value;
  let reasonText = "";
  if(reasonVal === 'custom') {
    reasonText = document.getElementById('customReason').value.trim() || "မုန့်ဖိုးတောင်းခြင်း";
  } else {
    const triggerEl = document.getElementById('reasonTriggerText');
    reasonText = triggerEl ? triggerEl.innerText : "မုန့်ဖိုးတောင်းခြင်း";
  }

  const noteText = document.getElementById('customNote').value.trim() || "ကျေးဇူးပြု၍ မုန့်ဖိုးထည့်ပေးပါရှင့် ❤️";
  const senderName = currentUser ? currentUser.name : "Guest";

  document.getElementById('outSender').innerText = "From: " + senderName;
  document.getElementById('outReason').innerText = reasonText;
  document.getElementById('outNote').innerText = noteText;

  const bgImgEl = document.getElementById('cardBgImg');
  if(currentBgUrl) {
    bgImgEl.src = currentBgUrl;
    bgImgEl.style.display = 'block';
  } else {
    bgImgEl.style.display = 'none';
  }

  const qrImgEl = document.getElementById('cardQrImg');
  const qrWrapper = document.getElementById('qrWrapper');
  if(currentQrUrl) {
    qrImgEl.src = currentQrUrl;
    qrWrapper.style.display = 'block';
  } else {
    qrWrapper.style.display = 'none';
  }

  showLoader(true);
  setTimeout(() => {
    showLoader(false);
    goToStep(4);
  }, 600);
}

// Share Modal Functions
function openShareModal() {
  document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
  document.getElementById('shareModal').style.display = 'none';
}

function copyShareLink() {
  navigator.clipboard.writeText(window.location.href);
  alert('📋 လင့်ခ်ကို ကူးယူပြီးပါပြီ!');
  closeShareModal();
}

function downloadSingleQr() {
  if(!currentQrUrl) {
    alert('QR ပုံ မရှိသေးပါ။');
    return;
  }
  const a = document.createElement('a');
  a.href = currentQrUrl;
  a.download = 'PocketMoney_QR.png';
  a.click();
}

function downloadSingleQrFromModal() {
  downloadSingleQr();
  closeShareModal();
}

function viewHistory() {
  alert('📜 မုန့်ဖိုးတောင်းခဲ့သည့် မှတ်တမ်းများ မရှိသေးပါ။');
}
