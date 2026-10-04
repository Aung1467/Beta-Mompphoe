// Supabase Credentials
const SUPABASE_URL = 'https://koybxyoucyqnixvwplke.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H7XpgD2tcobQnTTH68p4Nw_9TNfH9tX';

// RapidAPI TikTok Downloader Credentials
const TIKTOK_API_HOST = 'tiktok-video-downloader-api1.p.rapidapi.com';
const TIKTOK_API_KEY = '70859b2b0dmsh50bef4b29850745p174506jsnde824fc2401a';
const TIKTOK_API_URL = 'https://tiktok-video-downloader-api1.p.rapidapi.com/api/tiktok/links';

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

const i18n = {
  my: {
    introMsg: "မင်္ဂလာပါ 👋 ခဏစောင့်ပေးပါ...",
    loaderMsg: "ခဏစောင့်ပါ...",
    authTitle: "✨ အကောင့်ဝင်ရန် (Login / Signup) ✨",
    modeSelectLabel: "အမျိုးအစား ရွေးချယ်ရန်",
    optLogin: "အကောင့်ရှိပြီးသား (Login ဝင်ရန်)",
    optSignup: "အကောင့်သစ်ဖွင့်ရန် (Sign Up)",
    nameLabel: "သင်၏ နာမည်",
    namePlaceholder: "နာမည်ရိုက်ပါ",
    numLabel: "ဂဏန်း (ကုဒ်နံပါတ်)",
    numPlaceholder: "ဂဏန်းရိုက်ပါ",
    passLabel: "Password",
    passPlaceholder: "Password ရိုက်ပါ",
    pass2Label: "Password ထပ်မံရိုက်ပါ (Confirm)",
    pass2Placeholder: "Password ကို ထပ်ရိုက်ပါ",
    loginBtn: "အကောင့်ဝင်မည် 🔓",
    signupBtn: "အကောင့်အသစ်ဖွင့်မည် ✨",
    profileTitle: "👤 ကိုယ်ရေးအချက်အလက် (Profile)",
    changeAvatar: "📷 Profile ပုံပြောင်းရန်",
    reqPocketBtn: "🧧 မုန့်ဖိုးတောင်းရန်",
    historyBtn: "📜 မုန့်ဖိုးတောင်းခဲ့သည့် မှတ်တမ်းများ",
    step3Title: "🎈 မုန့်ဖိုးတောင်းမည့် အကြောင်းအရာ 🎈",
    dropdownLabel: "အကြောင်းအရာ ရွေးချယ်ရန်",
    customReasonLabel: "ကိုယ်တိုင်စာရေးရန်",
    customReasonPlaceholder: "အကြောင်းအရာ ရေးပါ",
    customNoteLabel: "မုန့်ဖိုးတောင်းဖို့ စာစီရန်",
    customNotePlaceholder: "စာစီပါ...",
    musicLabel: "သီချင်းထည့်ရန်",
    musicPlaceholder: "tiktok video link ထည့်ရန်",
    audioPreview: "သီချင်း နားဆောင်ရန် (Preview)",
    bgLabel: "နောက်ခံပုံ (3:4 Ratio HD)",
    bgBtn: "📸 နောက်ခံပုံ ရွေးရန် (အကြည်)",
    qrLabel: "QR Code / အချက်အလက်ပုံ (HD)",
    qrBtn: "💳 QR Code ပုံ ရွေးရန်",
    backBtn: "⬅ နောက်သို့",
    genCardBtn: "ကတ်ဖန်တီးမည် ✨",
    step4Title: "🎉 သင့်မုန့်ဖိုးတောင်းလွှာ 🎉",
    qrHint: "Scan or Pay to Send Pocket Money 👇",
    saveBtn: "💾 Save QR",
    shareBtn: "📤 Share",
    profileReturnBtn: "🏠 Profile သို့ပြန်ရန်",
    modalTitle: "📤 မျှဝေရန် (Share)",
    modalSub: "မုန့်ဖိုးတောင်းလွှာနှင့် လင့်ခ်ကို ပို့ရန် -",
    copyLinkBtn: "📋 လင့်ခ် ကူးယူရန်",
    dl1to1Btn: "📥 1:1 ပုံ သိမ်းရန်",
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
  },
  en: {
    introMsg: "Welcome 👋 Please wait...",
    loaderMsg: "Please wait...",
    authTitle: "✨ Login / Signup ✨",
    modeSelectLabel: "Select Option",
    optLogin: "Login (Existing Account)",
    optSignup: "Sign Up (New Account)",
    nameLabel: "Your Name",
    namePlaceholder: "Enter your name",
    numLabel: "Number / Code",
    numPlaceholder: "Enter code number",
    passLabel: "Password",
    passPlaceholder: "Enter password",
    pass2Label: "Confirm Password",
    pass2Placeholder: "Re-enter password",
    loginBtn: "Login 🔓",
    signupBtn: "Create Account ✨",
    profileTitle: "👤 Profile Dashboard",
    changeAvatar: "📷 Change Profile Picture",
    reqPocketBtn: "🧧 Request Pocket Money",
    historyBtn: "📜 Request History",
    step3Title: "🎈 Select Request Reason 🎈",
    dropdownLabel: "Choose Reason",
    customReasonLabel: "Custom Reason",
    customReasonPlaceholder: "Write custom reason",
    customNoteLabel: "Write Request Note",
    customNotePlaceholder: "Write your note here...",
    musicLabel: "Add Music",
    musicPlaceholder: "tiktok video link ထည့်ရန်",
    audioPreview: "Preview Audio",
    bgLabel: "Background Image (3:4 HD)",
    bgBtn: "📸 Select HD Background",
    qrLabel: "Payment QR Code (HD)",
    qrBtn: "💳 Select QR Code Image",
    backBtn: "⬅ Back",
    genCardBtn: "Create Card ✨",
    step4Title: "🎉 Your Request Card 🎉",
    qrHint: "Scan or Pay to Send Pocket Money 👇",
    saveBtn: "💾 Save QR",
    shareBtn: "📤 Share",
    profileReturnBtn: "🏠 Back to Profile",
    modalTitle: "📤 Share Request",
    modalSub: "Send card and link via:",
    copyLinkBtn: "📋 Copy Link",
    dl1to1Btn: "📥 Download 1:1 Image",
    closeBtn: "Close",
    alertNote: "❌ Please write a request note.",
    alertBg: "❌ Please upload a background image.",
    alertQr: "❌ Please upload a QR code image.",
    reasons: [
      { val: "Pocket Money Request", text: "Pocket Money Request" },
      { val: "Date with Lover", text: "Date with Lover" },
      { val: "Hangout with Friends", text: "Hangout with Friends" },
      { val: "Out of Money", text: "Out of Money" },
      { val: "အခြား", text: "Other (Custom Write)" }
    ]
  }
};

// ပုံမဝါးစေရန် HD Quality (maxWidth 1200, quality 0.85) သို့ မြှင့်ထားပါသည်
function compressFileToDataUrl(file, maxWidth = 1200, quality = 0.85) {
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

// TikTok API မှတဆင့် သီချင်းလင့်ခ်ဆွဲထုတ်ခြင်း နှင့် Preview လုပ်ခြင်း (Array နှင့် Object နှစ်မျိုးလုံးကို Support လုပ်ပေးသည်)
async function handleMusicPreview(url) {
  if (!url || !url.trim().includes('tiktok.com')) return;
  
  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');

  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': TIKTOK_API_HOST,
        'x-rapidapi-key': TIKTOK_API_KEY
      },
      body: JSON.stringify({ url: url.trim() })
    };

    const response = await fetch(TIKTOK_API_URL, options);
    const result = await response.json();
    
    // API မှ အချက်အလက် ဘာတွေပြန်လာသလဲ Console တွင် စစ်ဆေးရန်
    console.log("TikTok API Response Data:", result);

    if (loader) loader.classList.remove('show');

    // Array ဖြစ်နေလျှင် ပထမ Index ကိုယူရန်၊ မဟုတ်လျှင် Result ကို တိုက်ရိုက်ယူရန်
    const resData = Array.isArray(result) ? result[0] : result;
    
    if (resData) {
      console.log("Object Keys inside resData:", Object.keys(resData));
    }

    let audioSrc = '';
    if (resData) {
      audioSrc = resData.music || 
                 resData.audio || 
                 resData.play || 
                 resData.url || 
                 resData.nowm || 
                 resData.musicUrl || 
                 resData.sound || 
                 resData.music_dl ||
                 (resData.data && (resData.data.music || resData.data.audio || resData.data.play || resData.data.url)) ||
                 (resData.music_info && resData.music_info.url) || '';

      // အကယ်၍ အထက်ပါ Keys များထဲတွင် မတွေ့ပါက http ပါသော Link မှန်သမျှကို အလိုအလျောက် ရှာယူမည်
      if (!audioSrc && typeof resData === 'object') {
        for (let key in resData) {
          if (typeof resData[key] === 'string' && resData[key].startsWith('http')) {
            audioSrc = resData[key];
            break;
          }
        }
      }
    }

    if (audioSrc) {
      savedMusicUrl = audioSrc;
      const previewGroup = document.getElementById('audioPreviewGroup');
      const player = document.getElementById('audioPreviewPlayer');
      if (previewGroup && player) {
        previewGroup.style.display = 'block';
        player.src = audioSrc;
      }
      alert('✅ TikTok သီချင်းကို အောင်မြင်စွာ ရယူနိုင်ပါပြီ!');
    } else {
      alert('❌ ဤလင့်ခ်မှ သီချင်းဖိုင်ကို ရှာမတွေ့ပါ။ (Console တွင် Object Keys ကို စစ်ဆေးပါ)');
    }
  } catch (err) {
    if (loader) loader.classList.remove('show');
    console.error('TikTok API Error:', err);
    alert('❌ သီချင်းဆွဲထုတ်ရာတွင် အမှားအယွင်းရှိနေပါသည်။');
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  populateReasonDropdown(currentLang);

  setTimeout(() => {
    const splash = document.getElementById('introSplash');
    if (splash) splash.classList.add('fade-out');
  }, 1500);

  const urlParams = new URLSearchParams(window.location.search);
  const cardId = urlParams.get('id');

  if (cardId) {
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
          renderCardData({
            sender: data.sender,
            reason: data.reason,
            note: data.note,
            bgImage: data.bg_image,
            qrImage: data.qr_image,
            musicUrl: data.music_url
          });
          if (loader) loader.classList.remove('show');
          showStep(4);
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
  document.getElementById('outSender').innerText = data.sender ? `From: ${data.sender}` : '';
  document.getElementById('outReason').innerText = data.reason || '';
  document.getElementById('outNote').innerText = data.note || '';

  if (data.bgImage) {
    savedBgImage = data.bgImage;
    const bgEl = document.getElementById('cardBgImg');
    bgEl.src = data.bgImage;
    bgEl.style.display = 'block';
    bgEl.style.width = '100%';
    bgEl.style.height = '100%';
    bgEl.style.objectFit = 'cover';
  }
  if (data.qrImage) {
    savedQrImage = data.qrImage;
    const qrEl = document.getElementById('cardQrImg');
    const qrWr = document.getElementById('qrWrapper');
    qrEl.src = data.qrImage;
    qrWr.style.display = 'block';
  }
  if (data.musicUrl) {
    savedMusicUrl = data.musicUrl;
  }
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
    showStep(stepNumber);
  }, 800);
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
}

function toggleCustomReason() {
  const dropdown = document.getElementById('reasonDropdown');
  const customGroup = document.getElementById('customReasonGroup');
  customGroup.style.display = (dropdown.value === 'အခြား') ? 'block' : 'none';
}

function populateReasonDropdown(lang) {
  const dropdown = document.getElementById('reasonDropdown');
  if (!dropdown) return;
  const currentVal = dropdown.value;
  dropdown.innerHTML = '';
  
  const reasonsList = i18n[lang] ? i18n[lang].reasons : i18n['my'].reasons;
  reasonsList.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.val;
    opt.innerText = item.text;
    dropdown.appendChild(opt);
  });

  if (currentVal) dropdown.value = currentVal;
  toggleCustomReason();
}

function handleBgImage(input) {
  if (input.files && input.files[0]) {
    selectedBgFile = input.files[0];
    document.getElementById('bgImgLabel').innerText = `✅ HD ပုံရွေးပြီးပါပြီ (${input.files[0].name})`;
  }
}

function handleQrImage(input) {
  if (input.files && input.files[0]) {
    selectedQrFile = input.files[0];
    document.getElementById('qrImgLabel').innerText = `✅ QR ပုံရွေးပြီးပါပြီ (${input.files[0].name})`;
  }
}

async function generateAndSaveCard() {
  const reasonDropdown = document.getElementById('reasonDropdown').value;
  const customReason = document.getElementById('customReason').value.trim();
  const customNote = document.getElementById('customNote').value.trim();
  const finalReason = (reasonDropdown === 'အခြား' && customReason) ? customReason : reasonDropdown;

  const d = i18n[currentLang] || i18n['my'];

  if (!customNote) {
    alert(d.alertNote);
    return;
  }
  if (!selectedBgFile && !savedBgImage) {
    alert(d.alertBg);
    return;
  }
  if (!selectedQrFile && !savedQrImage) {
    alert(d.alertQr);
    return;
  }

  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');

  try {
    if (selectedBgFile) {
      savedBgImage = await compressFileToDataUrl(selectedBgFile, 1200, 0.85);
    }
    if (selectedQrFile) {
      savedQrImage = await compressFileToDataUrl(selectedQrFile, 900, 0.85);
    }

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
      throw new Error('Supabase SDK မတက်ပါ။ index.html တွင် Supabase Script ရှိမရှိ စစ်ဆေးပါ။');
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

let openShareModal = function() {
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
  populateReasonDropdown(lang);
}
