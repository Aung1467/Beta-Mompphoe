// -----------------------------------------------------------
// SUPABASE CONFIG (Project URL & Publishable Key)
// -----------------------------------------------------------
const SUPABASE_URL = 'https://koybxyoucyqnixvwplke.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H7XpgD2tcobQnTTH68p4Nw_9TNfH9tX';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let currentAvatarUrl = "";
let currentBgUrl = "";
let currentQrUrl = "";
let currentLang = 'my';
let createdCardId = null;

const translations = {
  my: {
    introMsg: "ခဏစောင့်ပေးပါ",
    loaderMsg: "ဒေတာချိတ်ဆက်နေသည်...",
    authTitle: "အကောင့်ဝင်ရန်",
    modeSelect: "အမျိုးအစား ရွေးချယ်ရန်",
    optLogin: "အကောင့်ရှိပြီးသား (Login)",
    optSignup: "အကောင့်သစ်ဖွင့်ရန် (Sign Up)",
    loginName: "သင်၏ နာမည်",
    loginPass: "လျှို့ဝှက်နံပါတ်",
    btnLogin: "အကောင့်ဝင်မည်",
    signupName: "သင်၏ နာမည်",
    signupNum: "ကုဒ်နံပါတ်",
    signupPass1: "လျှို့ဝှက်နံပါတ်အသစ်",
    signupPass2: "လျှို့ဝှက်နံပါတ်ကို ထပ်မံရိုက်ပါ",
    btnSignup: "အကောင့်အသစ်ဖွင့်မည်",
    profileTitle: "ကိုယ်ရေးအချက်အလက်",
    changeAvatar: "ပရိုဖိုင်ပုံပြောင်းရန်",
    reqPocketBtn: "မုန့်ဖိုးတောင်းရန်",
    historyBtn: "မှတ်တမ်းများ",
    step3Title: "မုန့်ဖိုးတောင်းမည့်အကြောင်းအရာ",
    dropdown: "အကြောင်းအရာရွေးချယ်ရန်",
    customReason: "ကိုယ်တိုင်ရေးသားရန်",
    customNote: "မုန့်ဖိုးတောင်းစာစီရန်",
    bgLabel: "နောက်ခံပုံ (4:3)",
    qrLabel: "ကျူအာလ်ပုံ / ငွေပေးချေမှုအချက်အလက်",
    bgImgLabelText: "နောက်ခံပုံရွေးရန်",
    qrImgLabelText: "ကျူအာလ်ပုံရွေးရန်",
    btnBack: "နောက်သို့",
    btnGen: "ကတ်ဖန်တီးမည် (DB သိမ်းမည်)",
    step4Title: "မုန့်ဖိုးတောင်းလွှာ",
    qrHint: "ငွေပေးချေရန် ကျူအာလ်ကိုစကန်ဖတ်ပါ",
    saveQr: "ကျူအာလ်သိမ်းရန်",
    share: "မျှဝေမည်",
    profileReturn: "ပရိုဖိုင်သို့ပြန်ရန်",
    modalTitle: "မျှဝေရန်",
    modalSub: "မုန့်ဖိုးတောင်းလွှာနှင့် လင့်ခ်ကို ပို့ရန်",
    copyLink: "လင့်ခ် ကူးယူရန်",
    dlQrModal: "QR ပုံ သိမ်းရန်",
    closeModal: "ပိတ်မည်",
    reasons: [
      { val: 'snack', text: 'မုန့်ဖိုးဝယ်စားဖို့ပါ' },
      { val: 'game', text: 'ဂိမ်းငွေဖြည့်ဖို့ပါ' },
      { val: 'date', text: 'ချစ်သူနဲ့ချိန်းတွေ့ဖို့ပါ' },
      { val: 'shopping', text: 'ပစ္စည်းဝယ်ယူဖို့ပါ' },
      { val: 'custom', text: 'အခြားအကြောင်းအရာ (ကိုယ်တိုင်ရေးရန်)' }
    ]
  },
  en: {
    introMsg: "Please wait",
    loaderMsg: "Connecting data...",
    authTitle: "Sign In",
    modeSelect: "Select Mode",
    optLogin: "Login (Existing Account)",
    optSignup: "Sign Up (New Account)",
    loginName: "Your Name",
    loginPass: "Password",
    btnLogin: "Login",
    signupName: "Your Name",
    signupNum: "Number Code",
    signupPass1: "New Password",
    signupPass2: "Confirm Password",
    btnSignup: "Sign Up",
    profileTitle: "Profile",
    changeAvatar: "Change Profile Picture",
    reqPocketBtn: "Request Pocket Money",
    historyBtn: "History",
    step3Title: "Reason for Request",
    dropdown: "Select Reason",
    customReason: "Custom Reason",
    customNote: "Custom Note",
    bgLabel: "Background (4:3 Ratio)",
    qrLabel: "QR Code / Payment Info",
    bgImgLabelText: "Select Background",
    qrImgLabelText: "Select QR Code",
    btnBack: "Back",
    btnGen: "Generate Card (Save to DB)",
    step4Title: "Pocket Money Card",
    qrHint: "Scan or Pay to Send Pocket Money",
    saveQr: "Save QR",
    share: "Share",
    profileReturn: "Return to Profile",
    modalTitle: "Share",
    modalSub: "Send card and link",
    copyLink: "Copy Link",
    dlQrModal: "Save QR",
    closeModal: "Close",
    reasons: [
      { val: 'snack', text: 'For Snacks' },
      { val: 'game', text: 'For Gaming' },
      { val: 'date', text: 'For Dating' },
      { val: 'shopping', text: 'For Shopping' },
      { val: 'custom', text: 'Custom Reason' }
    ]
  }
};

function changeLanguage(lang) {
  currentLang = lang;
  const t = translations[lang] || translations['my'];
  
  if(document.getElementById('introMsg')) document.getElementById('introMsg').innerText = t.introMsg;
  if(document.getElementById('lbl_loaderMsg')) document.getElementById('lbl_loaderMsg').innerText = t.loaderMsg;
  if(document.getElementById('lbl_authTitle')) document.getElementById('lbl_authTitle').innerText = t.authTitle;
  if(document.getElementById('lbl_modeSelect')) document.getElementById('lbl_modeSelect').innerText = t.modeSelect;
  if(document.getElementById('opt_login')) document.getElementById('opt_login').innerText = t.optLogin;
  if(document.getElementById('opt_signup')) document.getElementById('opt_signup').innerText = t.optSignup;
  
  const authModeVal = document.getElementById('authModeSelect').value;
  document.getElementById('authModeTriggerText').innerText = authModeVal === 'login' ? t.optLogin : t.optSignup;

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
  if(document.getElementById('bgImgLabel') && !currentBgUrl) document.getElementById('bgImgLabel').innerText = t.bgImgLabelText;
  if(document.getElementById('qrImgLabel') && !currentQrUrl) document.getElementById('qrImgLabel').innerText = t.qrImgLabelText;
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

  populateReasons();
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const splash = document.getElementById('introSplash');
    if(splash) splash.classList.add('fade-out');
    populateReasons();
    checkUrlParams();
  }, 400);
});

function showLoader(show, text) {
  const loader = document.getElementById('stepLoader');
  if(text) document.getElementById('lbl_loaderMsg').innerText = text;
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

function selectAuthModeOption(val, text) {
  document.getElementById('authModeTriggerText').innerText = text;
  document.getElementById('authModeSelect').value = val;
  document.getElementById('authModeCustomSelect').classList.remove('open');
  switchAuthMode(val);
}

function populateReasons() {
  const t = translations[currentLang] || translations['my'];
  const reasons = t.reasons;
  const container = document.getElementById('reasonCustomOptions');
  if(!container) return;

  const currentVal = document.getElementById('reasonDropdown').value;
  container.innerHTML = '';

  let found = false;
  reasons.forEach(r => {
    const div = document.createElement('div');
    div.className = 'custom-option';
    div.innerText = r.text;
    div.onclick = () => selectReasonOption(r.val, r.text);
    container.appendChild(div);
    if(r.val === currentVal) {
      document.getElementById('reasonTriggerText').innerText = r.text;
      found = true;
    }
  });

  if(!found && reasons.length > 0) {
    document.getElementById('reasonTriggerText').innerText = reasons[0].text;
    document.getElementById('reasonDropdown').value = reasons[0].val;
  }
  toggleCustomReason();
}

function selectReasonOption(val, text) {
  document.getElementById('reasonTriggerText').innerText = text;
  document.getElementById('reasonDropdown').value = val;
  document.getElementById('reasonCustomSelect').classList.remove('open');
  toggleCustomReason();
}

function toggleCustomDropdown(wrapperId) {
  document.querySelectorAll('.custom-select-wrapper').forEach(el => {
    if(el.id !== wrapperId) el.classList.remove('open');
  });
  document.getElementById(wrapperId).classList.toggle('open');
}

window.addEventListener('click', function(e) {
  if (!e.target.closest('.custom-select-wrapper')) {
    document.querySelectorAll('.custom-select-wrapper').forEach(el => el.classList.remove('open'));
  }
});

function toggleCustomReason() {
  const val = document.getElementById('reasonDropdown').value;
  const customGroup = document.getElementById('customReasonGroup');
  if(customGroup) {
    customGroup.style.display = (val === 'custom') ? 'block' : 'none';
  }
}

// -----------------------------------------------------------
// LOGIN WITH SUPABASE
// -----------------------------------------------------------
async function handleLogin() {
  const name = document.getElementById('loginName').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  if(!name || !pass) {
    alert(currentLang === 'en' ? 'Please enter name and password.' : 'ကျေးဇူးပြု၍ နာမည်နှင့် လျှို့ဝှက်နံပါတ် ဖြည့်ပါ။');
    return;
  }
  showLoader(true, currentLang === 'en' ? 'Checking account...' : 'အကောင့် စစ်ဆေးနေသည်...');
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('name', name)
      .eq('password', pass)
      .single();

    if (error || !data) {
      alert(currentLang === 'en' ? 'Invalid account or password.' : 'အကောင့်မရှိပါ သို့မဟုတ် လျှို့ဝှက်နံပါတ် မှားယွင်းနေပါသည်။');
      showLoader(false);
      return;
    }

    currentUser = data;
    document.getElementById('displayProfileName').innerText = data.name;
    document.getElementById('displayProfileNum').innerText = (currentLang === 'en' ? 'Code: ' : 'ကုဒ်နံပါတ် - ') + (data.code || 'VIP-001');
    showLoader(false);
    goToStep(2);
  } catch (err) {
    console.error(err);
    currentUser = { name: name, num: 'VIP-001' };
    document.getElementById('displayProfileName').innerText = name;
    document.getElementById('displayProfileNum').innerText = (currentLang === 'en' ? 'Code: ' : 'ကုဒ်နံပါတ် - ') + 'VIP-001';
    showLoader(false);
    goToStep(2);
  }
}

// -----------------------------------------------------------
// SIGNUP WITH SUPABASE
// -----------------------------------------------------------
async function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const num = document.getElementById('signupNum').value.trim();
  const p1 = document.getElementById('signupPass1').value.trim();
  const p2 = document.getElementById('signupPass2').value.trim();

  if(!name || !num || !p1 || !p2) {
    alert(currentLang === 'en' ? 'Please fill all fields.' : 'အချက်အလက်အားလုံး ဖြည့်ပါ။');
    return;
  }
  if(p1 !== p2) {
    alert(currentLang === 'en' ? 'Passwords do not match.' : 'လျှို့ဝှက်နံပါတ် နှစ်ခု မတူပါ။');
    return;
  }
  showLoader(true, currentLang === 'en' ? 'Creating account...' : 'အကောင့်ဖန်တီးနေသည်...');
  try {
    const { error } = await supabaseClient
      .from('users')
      .insert([{ name: name, code: num, password: p1 }]);

    if (error) throw error;

    alert(currentLang === 'en' ? 'Signup successful! Please login.' : 'အကောင့်ဖွင့်ခြင်း ပြီးမြောက်ပါပြီ။ ကျေးဇူးပြု၍ အကောင့်ဝင်ပါ။');
    showLoader(false);
    selectAuthModeOption('login', currentLang === 'en' ? 'Login (Existing Account)' : 'အကောင့်ရှိပြီးသား (Login)');
  } catch (err) {
    console.error(err);
    currentUser = { name: name, num: num };
    document.getElementById('displayProfileName').innerText = name;
    document.getElementById('displayProfileNum').innerText = (currentLang === 'en' ? 'Code: ' : 'ကုဒ်နံပါတ် - ') + num;
    showLoader(false);
    goToStep(2);
  }
}

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

function handleBgImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentBgUrl = e.target.result;
      document.getElementById('bgImgLabel').innerText = currentLang === 'en' ? "Background selected" : "နောက်ခံပုံ ရွေးပြီးပါပြီ";
    }
    reader.readAsDataURL(input.files[0]);
  }
}

function handleQrImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentQrUrl = e.target.result;
      document.getElementById('qrImgLabel').innerText = currentLang === 'en' ? "QR selected" : "ကျူအာလ်ပုံ ရွေးပြီးပါပြီ";
    }
    reader.readAsDataURL(input.files[0]);
  }
}

// -----------------------------------------------------------
// CARDS TABLE သို့ ဒေတာသိမ်းဆည်းခြင်း
// -----------------------------------------------------------
async function generateAndSaveCard() {
  const reasonVal = document.getElementById('reasonDropdown').value;
  let reasonText = "";
  
  if(reasonVal === 'custom') {
    reasonText = document.getElementById('customReason').value.trim() || (currentLang === 'en' ? 'Pocket Money Request' : 'မုန့်ဖိုးတောင်းခြင်း');
  } else {
    const triggerEl = document.getElementById('reasonTriggerText');
    reasonText = triggerEl ? triggerEl.innerText : "မုန့်ဖိုးတောင်းခြင်း";
  }

  const noteText = document.getElementById('customNote').value.trim() || (currentLang === 'en' ? 'Please send me some pocket money' : 'ကျေးဇူးပြု၍ မုန့်ဖိုးထည့်ပေးပါရှင့်');
  const senderName = currentUser ? currentUser.name : "Guest";
  const bg = currentBgUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop";
  const qr = currentQrUrl || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SAMPLE_QR";

  showLoader(true, currentLang === 'en' ? 'Saving to Database...' : 'Database ထဲ သိမ်းဆည်းနေသည်...');

  try {
    const { data, error } = await supabaseClient
      .from('cards')
      .insert([
        {
          sender: senderName,
          reason: reasonText,
          note: noteText,
          bg_image: bg,
          qr_image: qr
        }
      ])
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      createdCardId = data[0].id;
    }

    renderCardUI(senderName, reasonText, noteText, bg, qr);
    showLoader(false);
    goToStep(4);
  } catch (err) {
    console.error("Supabase Save Error:", err);
    renderCardUI(senderName, reasonText, noteText, bg, qr);
    showLoader(false);
    goToStep(4);
  }
}

function renderCardUI(sender, reason, note, bg, qr) {
  document.getElementById('outSender').innerText = "From: " + sender;
  document.getElementById('outReason').innerText = reason;
  document.getElementById('outNote').innerText = note;

  const bgImgEl = document.getElementById('cardBgImg');
  bgImgEl.src = bg;
  bgImgEl.style.display = 'block';

  const qrImgEl = document.getElementById('cardQrImg');
  qrImgEl.src = qr;
  document.getElementById('qrWrapper').style.display = 'block';
}

async function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const cardId = urlParams.get('id');

  if (cardId) {
    showLoader(true, currentLang === 'en' ? 'Loading card data...' : 'ကတ်အချက်အလက်များကို ဆွဲထုတ်နေသည်...');
    try {
      const { data, error } = await supabaseClient
        .from('cards')
        .select('*')
        .eq('id', cardId)
        .single();

      if (data && !error) {
        renderCardUI(data.sender, data.reason, data.note, data.bg_image, data.qr_image);
        goToStep(4);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      showLoader(false);
    }
  }
}

function openShareModal() {
  document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
  document.getElementById('shareModal').style.display = 'none';
}

function copyShareLink() {
  let shareUrl = window.location.origin + window.location.pathname;
  if (createdCardId) {
    shareUrl += "?id=" + createdCardId;
  } else {
    shareUrl = window.location.href;
  }
  navigator.clipboard.writeText(shareUrl);
  alert(currentLang === 'en' ? 'Link copied!' : 'လင့်ခ်ကို ကူးယူပြီးပါပြီ');
  closeShareModal();
}

function downloadSingleQr() {
  if(!currentQrUrl) {
    alert(currentLang === 'en' ? 'No QR image available.' : 'ကျူအာလ်ပုံ မရှိသေးပါ။');
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
  alert(currentLang === 'en' ? 'No history found.' : 'မှတ်တမ်းများ မရှိသေးပါ။');
}
