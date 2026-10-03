let currentUser = null;
let savedBgImage = '';
let savedQrImage = '';
let currentShareableLink = '';
let currentLang = 'my';

const i18n = {
  my: {
    authTitle: "✨ အကောင့်ဝင်ရန် (Login / Signup) ✨",
    modeSelectLabel: "အမျိုးအစား ရွေးချယ်ရန်",
    optLogin: "အကောင့်ရှိပြီးသား (Login ဝင်ရန်)",
    optSignup: "အကောင့်သစ်ဖွင့်ရန် (Sign Up)",
    nameLabel: "သင်၏ နာမည်",
    numLabel: "ဂဏန်း (ကုဒ်နံပါတ်)",
    passLabel: "Password",
    pass2Label: "Password ထပ်မံရိုက်ပါ (Confirm)",
    loginBtn: "အကောင့်ဝင်မည် 🔓",
    signupBtn: "အကောင့်အသစ်ဖွင့်မည် ✨",
    profileTitle: "👤 ကိုယ်ရေးအချက်အလက် (Profile)",
    changeAvatar: "📷 Profile ပုံပြောင်းရန်",
    reqPocketBtn: "🧧 မုန့်ဖိုးတောင်းရန်",
    historyBtn: "📜 မုန့်ဖိုးတောင်းခဲ့သည့် မှတ်တမ်းများ",
    step3Title: "🎈 မုန့်ဖိုးတောင်းမည့် အကြောင်းအရာ 🎈",
    dropdown: "အကြောင်းအရာ ရွေးချယ်ရန်",
    customReason: "ကိုယ်တိုင်စာရေးရန်",
    customNote: "မုန့်ဖိုးတောင်းဖို့ စာစီရန်",
    bgLabel: "နောက်ခံပုံ (3:4 Ratio)",
    qrLabel: "QR Code / အချက်အလက်ပုံ (1:1 Ratio)",
    genCard: "ကတ်ဖန်တီးမည် ✨",
    step4Title: "🎉 သင့်မုန့်ဖိုးတောင်းလွှာ 🎉",
    qrHint: "Scan or Pay to Send Pocket Money 👇"
  },
  en: {
    authTitle: "✨ Login / Signup ✨",
    modeSelectLabel: "Select Mode",
    optLogin: "Login (Existing Account)",
    optSignup: "Sign Up (New Account)",
    nameLabel: "Your Name",
    numLabel: "Number / Code",
    passLabel: "Password",
    pass2Label: "Confirm Password",
    loginBtn: "Login 🔓",
    signupBtn: "Create Account ✨",
    profileTitle: "👤 Profile Dashboard",
    changeAvatar: "📷 Change Profile Picture",
    reqPocketBtn: "🧧 Request Pocket Money",
    historyBtn: "📜 Request History",
    step3Title: "🎈 Select Request Reason 🎈",
    dropdown: "Choose Reason",
    customReason: "Custom Reason",
    customNote: "Write Request Message",
    bgLabel: "Background Image (3:4)",
    qrLabel: "QR Code Image (1:1)",
    genCard: "Create Card ✨",
    step4Title: "🎉 Your Request Card 🎉",
    qrHint: "Scan or Pay to Send Pocket Money 👇"
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  setTimeout(() => {
    const splash = document.getElementById('introSplash');
    if (splash) splash.classList.add('fade-out');
  }, 2000);

  const urlParams = new URLSearchParams(window.location.search);
  const cardId = urlParams.get('id');

  if (cardId) {
    const loader = document.getElementById('stepLoader');
    loader.classList.add('show');
    try {
      const res = await fetch(`/api/card?id=${cardId}`);
      if (res.ok) {
        const data = await res.json();
        document.getElementById('outSender').innerText = data.sender ? `From: ${data.sender}` : '';
        document.getElementById('outReason').innerText = data.reason;
        document.getElementById('outNote').innerText = data.note;

        if (data.bgImage) {
          const bgEl = document.getElementById('cardBgImg');
          bgEl.src = data.bgImage;
          bgEl.style.display = 'block';
        }
        if (data.qrImage) {
          savedQrImage = data.qrImage;
          const qrEl = document.getElementById('cardQrImg');
          const qrWr = document.getElementById('qrWrapper');
          qrEl.src = data.qrImage;
          qrWr.style.display = 'block';
        }
        loader.classList.remove('show');
        goToStep(4);
      } else {
        alert('ကတ်ကို ရှာမတွေ့ပါ။');
        loader.classList.remove('show');
      }
    } catch (err) {
      loader.classList.remove('show');
    }
  }
});

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

  const userData = { name, num, pass: p1, avatar: '' };
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

  // Search stored user by name
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

  currentUser = foundUser;
  setupProfileView();
  goToStep(2);
}

function setupProfileView() {
  if (!currentUser) return;
  document.getElementById('displayProfileName').innerText = currentUser.name;
  document.getElementById('displayProfileNum').innerText = `ဂဏန်း: ${currentUser.num}`;
  
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
  alert('📜 သင် တောင်းဆိုခဲ့ဖူးသော မှတ်တမ်းများ မရှိသေးပါ။');
}

function goToStep(stepNumber) {
  const loader = document.getElementById('stepLoader');
  loader.classList.add('show');
  setTimeout(() => {
    loader.classList.remove('show');
    const steps = document.querySelectorAll('.step');
    steps.forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });
    const target = document.getElementById(`step${stepNumber}`);
    target.style.display = 'block';
    setTimeout(() => target.classList.add('active'), 50);
  }, 800);
}

function toggleCustomReason() {
  const dropdown = document.getElementById('reasonDropdown');
  const customGroup = document.getElementById('customReasonGroup');
  customGroup.style.display = (dropdown.value === 'အခြား') ? 'block' : 'none';
}

function handleBgImage(input) {
  if (input.files && input.files[0]) {
    document.getElementById('bgImgLabel').innerText = `✅ ${input.files[0].name}`;
    const reader = new FileReader();
    reader.onload = (e) => { savedBgImage = e.target.result; };
    reader.readAsDataURL(input.files[0]);
  }
}

function handleQrImage(input) {
  if (input.files && input.files[0]) {
    document.getElementById('qrImgLabel').innerText = `✅ ${input.files[0].name}`;
    const reader = new FileReader();
    reader.onload = (e) => { savedQrImage = e.target.result; };
    reader.readAsDataURL(input.files[0]);
  }
}

async function generateAndSaveCard() {
  const reasonDropdown = document.getElementById('reasonDropdown').value;
  const customReason = document.getElementById('customReason').value.trim();
  const customNote = document.getElementById('customNote').value.trim();
  const finalReason = (reasonDropdown === 'အခြား' && customReason) ? customReason : reasonDropdown;

  // အချက်အလက် သို့မဟုတ် ပုံများ မပြည့်စုံပါက ရှေ့ဆက်မသွားရန် စစ်ဆေးခြင်း
  if (!customNote) {
    alert('❌ ကျေးဇူးပြု၍ မုန့်ဖိုးတောင်းဖို့ စာစီရန် (Note) ကို ဖြည့်စွက်ပါ။');
    return;
  }
  if (!savedBgImage) {
    alert('❌ ကျေးဇူးပြု၍ နောက်ခံပုံ (Background Image) ထည့်ပါ။');
    return;
  }
  if (!savedQrImage) {
    alert('❌ ကျေးဇူးပြု၍ QR Code / အချက်အလက်ပုံ ထည့်ပါ။');
    return;
  }

  const payload = {
    sender: currentUser ? currentUser.name : 'Aung',
    reason: finalReason,
    note: customNote,
    bgImage: savedBgImage,
    qrImage: savedQrImage
  };

  const loader = document.getElementById('stepLoader');
  loader.classList.add('show');

  try {
    const response = await fetch('/api/card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (result.success) {
      currentShareableLink = `${window.location.origin}/?id=${result.id}`;

      document.getElementById('outSender').innerText = `From: ${payload.sender}`;
      document.getElementById('outReason').innerText = finalReason;
      document.getElementById('outNote').innerText = customNote;

      const bgEl = document.getElementById('cardBgImg');
      if (savedBgImage) {
        bgEl.src = savedBgImage;
        bgEl.style.display = 'block';
      }

      const qrEl = document.getElementById('cardQrImg');
      const qrWr = document.getElementById('qrWrapper');
      if (savedQrImage) {
        qrEl.src = savedQrImage;
        qrWr.style.display = 'block';
      }

      loader.classList.remove('show');
      goToStep(4);
      navigator.clipboard.writeText(currentShareableLink);
    } else {
      loader.classList.remove('show');
      alert('ကတ်သိမ်းဆည်းရာတွင် အမှားအယွင်းရှိသည်။');
    }
  } catch (err) {
    loader.classList.remove('show');
    alert('ဆာဗာသို့ ချိတ်ဆက်၍မရပါ။ Netlify တွင် တင်ပြီးမှ စမ်းသပ်ပါ။');
  }
}

function downloadSingleQr() {
  if (!savedQrImage) {
    alert('QR ပုံ မထည့်ရသေးပါ။');
    return;
  }
  const link = document.createElement('a');
  link.download = 'Payment_QR.png';
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
  currentLang = lang;
  const d = i18n[lang];
  document.getElementById('lbl_authTitle').innerText = d.authTitle;
  document.getElementById('lbl_modeSelect').innerText = d.modeSelectLabel;
  document.getElementById('authModeSelect').options[0].text = d.optLogin;
  document.getElementById('authModeSelect').options[1].text = d.optSignup;
  document.getElementById('lbl_loginName').innerText = d.nameLabel;
  document.getElementById('lbl_loginPass').innerText = d.passLabel;
  document.getElementById('lbl_signupName').innerText = d.nameLabel;
  document.getElementById('lbl_signupNum').innerText = d.numLabel;
  document.getElementById('lbl_signupPass1').innerText = d.passLabel;
  document.getElementById('lbl_signupPass2').innerText = d.pass2Label;
  document.getElementById('lbl_profileTitle').innerText = d.profileTitle;
  document.getElementById('lbl_changeAvatar').innerText = d.changeAvatar;
  document.getElementById('lbl_reqPocketBtn').innerText = d.reqPocketBtn;
  document.getElementById('lbl_historyBtn').innerText = d.historyBtn;
  document.getElementById('lbl_step3Title').innerText = d.step3Title;
  document.getElementById('lbl_dropdown').innerText = d.dropdown;
  document.getElementById('lbl_customReason').innerText = d.customReason;
  document.getElementById('lbl_customNote').innerText = d.customNote;
  document.getElementById('lbl_bgLabel').innerText = d.bgLabel;
  document.getElementById('lbl_qrLabel').innerText = d.qrLabel;
  document.getElementById('lbl_step4Title').innerText = d.step4Title;
  document.getElementById('lbl_qrHint').innerText = d.qrHint;
}
