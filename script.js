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
let selectedBgFile = null;
let selectedQrFile = null;
let currentShareableLink = '';
let currentLang = 'my';

const i18n = {
  my: {
    introMsg: "မင်္ဂလာပါ 👋 ခဏစောင့်ပေးပါ...",
    loaderMsg: "ခဏစောင့်ပါ...",
    authTitle: "အကောင့်ဝင်ရန်",
    modeSelect: "အမျိုးအစား ရွေးချယ်ရန်",
    optLogin: "အကောင့်ရှိပြီးသား (Login ဝင်ရန်)",
    optSignup: "အကောင့်သစ်ဖွင့်ရန် (Sign Up)",
    loginName: "သင်၏ နာမည်",
    loginPass: "Password",
    btnLogin: "အကောင့်ဝင်မည် 🔓",
    signupName: "သင်၏ နာမည်",
    signupNum: "ဂဏန်း (ကုဒ်နံပါတ်)",
    signupPass1: "Password",
    signupPass2: "Password ထပ်မံရိုက်ပါ (Confirm)",
    btnSignup: "အကောင့်အသစ်ဖွင့်မည် ✨",
    profileTitle: "👤 ကိုယ်ရေးအချက်အလက် (Profile)",
    changeAvatar: "📷 Profile ပုံပြောင်းရန်",
    reqPocketBtn: "🧧 မုန့်ဖိုးတောင်းရန်",
    historyBtn: "📜 မုန့်ဖိုးတောင်းခဲ့သည့် မှတ်တမ်းများ",
    step3Title: "မုန့်ဖိုးတောင်းမည့် အကြောင်းအရာ",
    dropdown: "အကြောင်းအရာ ရွေးချယ်ရန်",
    customReason: "ကိုယ်တိုင်စာရေးရန်",
    customNote: "မုန့်ဖိုးတောင်းဖို့ စာစီရန်",
    bgLabel: "နောက်ခံပုံ",
    qrLabel: "QR Code / အချက်အလက်ပုံ",
    backStep3: "⬅ နောက်သို့",
    genCard: "ကတ်ဖန်တီးမည် ✨",
    step4Title: "🎉 မုန့်ဖိုးတောင်းလွှာ 🎉",
    qrHint: "Scan or Pay to Send Pocket Money 👇",
    saveQr: "Save QR",
    share: "Share",
    profileReturn: "🏠 Profile သို့ပြန်ရန်",
    modalTitle: "📤 မျှဝေရန် (Share)",
    modalSub: "မုန့်ဖိုးတောင်းလွှာနှင့် လင့်ခ်ကို ပို့ရန် -",
    copyLink: "📋 လင့်ခ် ကူးယူရန်",
    dlQrModal: "📥 1:1 ပုံ သိမ်းရန်",
    closeModal: "ပိတ်မည်",
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
    authTitle: "Login / Signup",
    modeSelect: "Select Option",
    optLogin: "Login (Existing Account)",
    optSignup: "Sign Up (New Account)",
    loginName: "Your Name",
    loginPass: "Password",
    btnLogin: "Login 🔓",
    signupName: "Your Name",
    signupNum: "Number / Code",
    signupPass1: "Password",
    signupPass2: "Confirm Password",
    btnSignup: "Create Account ✨",
    profileTitle: "👤 Profile Dashboard",
    changeAvatar: "📷 Change Profile Picture",
    reqPocketBtn: "🧧 Request Pocket Money",
    historyBtn: "📜 Request History",
    step3Title: "Select Request Reason",
    dropdown: "Choose Reason",
    customReason: "Custom Reason",
    customNote: "Write Request Note",
    bgLabel: "Background Image",
    qrLabel: "Payment QR Code",
    backStep3: "⬅ Back",
    genCard: "Create Card ✨",
    step4Title: "🎉 Your Request Card 🎉",
    qrHint: "Scan or Pay to Send Pocket Money 👇",
    saveQr: "Save QR",
    share: "Share",
    profileReturn: "🏠 Back to Profile",
    modalTitle: "📤 Share Request",
    modalSub: "Send card and link via:",
    copyLink: "📋 Copy Link",
    dlQrModal: "📥 Download QR",
    closeModal: "Close",
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
  },
  th: {
    introMsg: "ยินดีต้อนรับ 👋 กรุณารอสักครู่...",
    loaderMsg: "กรุณารอสักครู่...",
    authTitle: "เข้าสู่ระบบ / สมัครสมาชิก",
    modeSelect: "เลือกตัวเลือก",
    optLogin: "เข้าสู่ระบบ (บัญชีที่มีอยู่)",
    optSignup: "สมัครสมาชิก (บัญชีใหม่)",
    loginName: "ชื่อของคุณ",
    loginPass: "รหัสผ่าน",
    btnLogin: "เข้าสู่ระบบ 🔓",
    signupName: "ชื่อของคุณ",
    signupNum: "หมายเลข / รหัส",
    signupPass1: "รหัสผ่าน",
    signupPass2: "ยืนยันรหัสผ่าน",
    btnSignup: "สร้างบัญชี ✨",
    profileTitle: "👤 หน้าโปรไฟล์",
    changeAvatar: "📷 เปลี่ยนรูปโปรไฟล์",
    reqPocketBtn: "🧧 ขอค่าขนม",
    historyBtn: "📜 ประวัติการขอ",
    step3Title: "เลือกเหตุผลในการขอค่าขนม",
    dropdown: "เลือกเหตุผล",
    customReason: "เหตุผลอื่นๆ",
    customNote: "เขียนข้อความขอค่าขนม",
    bgLabel: "รูปภาพพื้นหลัง",
    qrLabel: "รูปคิวอาร์โค้ดชำระเงิน",
    backStep3: "⬅ ย้อนกลับ",
    genCard: "สร้างการ์ด ✨",
    step4Title: "🎉 การ์ดขอค่าขนมของคุณ 🎉",
    qrHint: "สแกนหรือจ่ายเพื่อส่งค่าขนม 👇",
    saveQr: "บันทึก QR",
    share: "แชร์",
    profileReturn: "🏠 กลับสู่โปรไฟล์",
    modalTitle: "📤 แชร์คำขอ",
    modalSub: "ส่งการ์ดและลิงก์ผ่าน:",
    copyLink: "📋 คัดลอกลิงก์",
    dlQrModal: "📥 บันทึกรูป QR",
    closeModal: "ปิด",
    alertNote: "❌ กรุณากรอกข้อความขอค่าขนม",
    alertBg: "❌ กรุณาอัปโหลดรูปภาพพื้นหลัง",
    alertQr: "❌ กรุณาอัปโหลดรูป QR Code",
    reasons: [
      { val: "ขอค่าขนม", text: "ขอค่าขนม" },
      { val: "ไปเดทกับแฟน", text: "ไปเดทกับแฟน" },
      { val: "ไปเที่ยวกับเพื่อน", text: "ไปเที่ยวกับเพื่อน" },
      { val: "เงินหมดแล้ว", text: "เงินหมดแล้ว" },
      { val: "အခြား", text: "อื่นๆ (เขียนเอง)" }
    ]
  },
  zh: {
    introMsg: "欢迎 👋 请稍候...",
    loaderMsg: "请稍候...",
    authTitle: "登录 / 注册",
    modeSelect: "选择选项",
    optLogin: "登录（已有账号）",
    optSignup: "注册（新账号）",
    loginName: "您的姓名",
    loginPass: "密码",
    btnLogin: "登录 🔓",
    signupName: "您的姓名",
    signupNum: "编号",
    signupPass1: "密码",
    signupPass2: "确认密码",
    btnSignup: "创建账号 ✨",
    profileTitle: "👤 个人中心",
    changeAvatar: "📷 更换头像",
    reqPocketBtn: "🧧 索要零花钱",
    historyBtn: "📜 历史记录",
    step3Title: "选择索要原因",
    dropdown: "选择原因",
    customReason: "自定义原因",
    customNote: "填写留言",
    bgLabel: "背景图片",
    qrLabel: "收款二维码",
    backStep3: "⬅ 返回",
    genCard: "生成卡片 ✨",
    step4Title: "🎉 您的零花钱申请卡 🎉",
    qrHint: "扫码或转账零花钱 👇",
    saveQr: "保存二维码",
    share: "分享",
    profileReturn: "🏠 返回个人中心",
    modalTitle: "📤 分享申请",
    modalSub: "通过以下方式发送卡片和链接：",
    copyLink: "📋 复制链接",
    dlQrModal: "📥 下载二维码",
    closeModal: "关闭",
    alertNote: "❌ 请填写留言内容。",
    alertBg: "❌ 请上传背景图片。",
    alertQr: "❌ 请上传二维码图片。",
    reasons: [
      { val: "零花钱申请", text: "零花钱申请" },
      { val: "约会", text: "约会" },
      { val: "和朋友聚会", text: "和朋友聚会" },
      { val: "没钱了", text: "没钱了" },
      { val: "အခြား", text: "其他 (自定义)" }
    ]
  },
  ja: {
    introMsg: "ようこそ 👋 少々お待ちください...",
    loaderMsg: "お待ちください...",
    authTitle: "ログイン / 登録",
    modeSelect: "オプション選択",
    optLogin: "ログイン (既存アカウント)",
    optSignup: "新規登録 (アカウント作成)",
    loginName: "お名前",
    loginPass: "パスワード",
    btnLogin: "ログイン 🔓",
    signupName: "お名前",
    signupNum: "番号 / コード",
    signupPass1: "パスワード",
    signupPass2: "パスワード確認",
    btnSignup: "アカウント作成 ✨",
    profileTitle: "👤 プロフィール",
    changeAvatar: "📷 アバター変更",
    reqPocketBtn: "🧧 お小遣いを請求する",
    historyBtn: "📜 履歴",
    step3Title: "請求理由の選択",
    dropdown: "理由を選択",
    customReason: "カスタム理由",
    customNote: "メッセージを入力",
    bgLabel: "背景画像",
    qrLabel: "QRコード画像",
    backStep3: "⬅ 戻る",
    genCard: "カード作成 ✨",
    step4Title: "🎉 あなたのお小遣い請求カード 🎉",
    qrHint: "スキャンして送金 👇",
    saveQr: "QR保存",
    share: "シェア",
    profileReturn: "🏠 プロフィールに戻る",
    modalTitle: "📤 シェア",
    modalSub: "カードとリンクを送信:",
    copyLink: "📋 リンクコピー",
    dlQrModal: "📥 QR保存",
    closeModal: "閉じる",
    alertNote: "❌ メッセージを入力してください。",
    alertBg: "❌ 背景画像をアップロードしてください。",
    alertQr: "❌ QRコード画像をアップロードしてください。",
    reasons: [
      { val: "お小遣い請求", text: "お小遣い請求" },
      { val: "デート", text: "デート" },
      { val: "友達とお出かけ", text: "友達とお出かけ" },
      { val: "お金がない", text: "お金がない" },
      { val: "အခြား", text: "その他 (自由入力)" }
    ]
  },
  ko: {
    introMsg: "환영합니다 👋 잠시만 기다려주세요...",
    loaderMsg: "잠시만 기다려주세요...",
    authTitle: "로그인 / 회원가입",
    modeSelect: "옵션 선택",
    optLogin: "로그인 (기존 계정)",
    optSignup: "회원가입 (새 계정)",
    loginName: "이름",
    loginPass: "비밀번호",
    btnLogin: "로그인 🔓",
    signupName: "이름",
    signupNum: "번호 / 코드",
    signupPass1: "비밀번호",
    signupPass2: "비밀번호 확인",
    btnSignup: "계정 생성 ✨",
    profileTitle: "👤 프로필 대시보드",
    changeAvatar: "📷 아바타 변경",
    reqPocketBtn: "🧧 용돈 요청하기",
    historyBtn: "📜 요청 내역",
    step3Title: "용돈 요청 사유 선택",
    dropdown: "사유 선택",
    customReason: "직접 입력",
    customNote: "요청 메시지 작성",
    bgLabel: "배경 이미지",
    qrLabel: "결제 QR 코드",
    backStep3: "⬅ 뒤로",
    genCard: "카드 만들기 ✨",
    step4Title: "🎉 용돈 요청 카드 🎉",
    qrHint: "스캔하여 송금하세요 👇",
    saveQr: "QR 저장",
    share: "공유",
    profileReturn: "🏠 프로필로 돌아가기",
    modalTitle: "📤 공유하기",
    modalSub: "카드 및 링크 공유:",
    copyLink: "📋 링크 복사",
    dlQrModal: "📥 QR 다운로드",
    closeModal: "닫기",
    alertNote: "❌ 요청 메시지를 작성해주세요.",
    alertBg: "❌ 배경 이미지를 업로드해주세요.",
    alertQr: "❌ QR 코드 이미지를 업로드해주세요.",
    reasons: [
      { val: "용돈 요청", text: "용돈 요청" },
      { val: "데이트 비용", text: "데이트 비용" },
      { val: "친구들과 놀기", text: "친구들과 놀기" },
      { val: "잔고 부족", text: "잔고 부족" },
      { val: "အခြား", text: "기타 (직접 작성)" }
    ]
  }
};

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

window.addEventListener('DOMContentLoaded', async () => {
  changeLanguage(currentLang);

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
            qrImage: data.qr_image
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
  }
  if (data.qrImage) {
    savedQrImage = data.qrImage;
    const qrEl = document.getElementById('cardQrImg');
    const qrWr = document.getElementById('qrWrapper');
    qrEl.src = data.qrImage;
    qrWr.style.display = 'block';
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
    document.getElementById('bgImgLabel').innerText = `✅ HD ပုံရွေးပြီးပါပြီ`;
  }
}

function handleQrImage(input) {
  if (input.files && input.files[0]) {
    selectedQrFile = input.files[0];
    document.getElementById('qrImgLabel').innerText = `✅ QR ပုံရွေးပြီးပါပြီ`;
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
      qr_image: savedQrImage
    };

    const sb = getSupabase();
    if (!sb) {
      throw new Error('Supabase SDK error.');
    }

    const { data, error } = await sb
      .from('cards')
      .insert([payload])
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      const generatedId = data[0].id;
      currentShareableLink = `${window.location.origin}${window.location.pathname}?id=${generatedId}`;
      
      renderCardData({
        sender: payload.sender,
        reason: payload.reason,
        note: payload.note,
        bgImage: payload.bg_image,
        qrImage: payload.qr_image
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
  const t = i18n[lang] || i18n['my'];
  
  // Update UI texts safely
  const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
  
  setTxt('introMsg', t.introMsg);
  setTxt('lbl_loaderMsg', t.loaderMsg);
  setTxt('lbl_authTitle', t.authTitle);
  setTxt('lbl_modeSelect', t.modeSelect);
  
  const authModeSelect = document.getElementById('authModeSelect');
  if(authModeSelect && authModeSelect.options.length >= 2) {
    authModeSelect.options[0].text = t.optLogin;
    authModeSelect.options[1].text = t.optSignup;
  }
  
  setTxt('lbl_loginName', t.loginName);
  setTxt('lbl_loginPass', t.loginPass);
  setTxt('btn_login', t.btnLogin);
  
  setTxt('lbl_signupName', t.signupName);
  setTxt('lbl_signupNum', t.signupNum);
  setTxt('lbl_signupPass1', t.signupPass1);
  setTxt('lbl_signupPass2', t.signupPass2);
  setTxt('btn_signup', t.btnSignup);
  
  setTxt('lbl_profileTitle', t.profileTitle);
  setTxt('lbl_changeAvatar', t.changeAvatar);
  setTxt('lbl_reqPocketBtn', t.reqPocketBtn);
  setTxt('lbl_historyBtn', t.historyBtn);
  
  setTxt('lbl_step3Title', t.step3Title);
  setTxt('lbl_dropdown', t.dropdown);
  setTxt('lbl_customReason', t.customReason);
  setTxt('lbl_customNote', t.customNote);
  setTxt('lbl_bgLabel', t.bgLabel);
  setTxt('lbl_qrLabel', t.qrLabel);
  setTxt('btn_backStep3', t.backStep3);
  setTxt('btn_genCard', t.genCard);
  
  setTxt('lbl_step4Title', t.step4Title);
  setTxt('lbl_qrHint', t.qrHint);
  setTxt('btn_saveQr', t.saveQr);
  setTxt('btn_share', t.share);
  setTxt('btn_profileReturn', t.profileReturn);
  
  setTxt('lbl_modalTitle', t.modalTitle);
  setTxt('lbl_modalSub', t.modalSub);
  setTxt('btn_copyLink', t.copyLink);
  setTxt('btn_dlQrModal', t.dlQrModal);
  setTxt('btn_closeModal', t.closeModal);
  
  populateReasonDropdown(lang);
}
