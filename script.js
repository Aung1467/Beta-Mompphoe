let currentUser = null;
let savedBgImage = '';
let savedQrImage = '';
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
    bgLabel: "နောက်ခံပုံ (3:4 Ratio)",
    bgBtn: "📸 နောက်ခံပုံ ရွေးရန်",
    qrLabel: "QR Code / အချက်အလက်ပုံ (1:1 Ratio)",
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
    bgLabel: "Background Image (3:4)",
    bgBtn: "📸 Select Background Image",
    qrLabel: "Payment QR Code (1:1 Ratio)",
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
  },
  th: {
    introMsg: "ยินดีต้อนรับ 👋 โปรดรอสักครู่...",
    loaderMsg: "กำลังโหลด...",
    authTitle: "✨ เข้าสู่ระบบ / ลงทะเบียน ✨",
    modeSelectLabel: "เลือกรูปแบบ",
    optLogin: "เข้าสู่ระบบ (มีบัญชีแล้ว)",
    optSignup: "ลงทะเบียน (สร้างบัญชีใหม่)",
    nameLabel: "ชื่อของคุณ",
    namePlaceholder: "ใส่ชื่อของคุณ",
    numLabel: "รหัสตัวเลข",
    numPlaceholder: "ใส่ตัวเลข",
    passLabel: "รหัสผ่าน",
    passPlaceholder: "ใส่รหัสผ่าน",
    pass2Label: "ยืนยันรหัสผ่าน",
    pass2Placeholder: "ใส่รหัสผ่านอีกครั้ง",
    loginBtn: "เข้าสู่ระบบ 🔓",
    signupBtn: "สร้างบัญชี ✨",
    profileTitle: "👤 ข้อมูลส่วนตัว (Profile)",
    changeAvatar: "📷 เปลี่ยนรูปโปรไฟล์",
    reqPocketBtn: "🧧 ขอเงินค่าขนม",
    historyBtn: "📜 ประวัติการขอเงิน",
    step3Title: "🎈 เลือกเหตุผลการขอเงิน 🎈",
    dropdownLabel: "เลือกเหตุผล",
    customReasonLabel: "ระบุเหตุผลเอง",
    customReasonPlaceholder: "พิมพ์เหตุผล...",
    customNoteLabel: "เขียนข้อความขอเงิน",
    customNotePlaceholder: "พิมพ์ข้อความ...",
    bgLabel: "ภาพพื้นหลัง (แนวตั้ง 3:4)",
    bgBtn: "📸 เลือกภาพพื้นหลัง",
    qrLabel: "รูป QR Code รับเงิน (1:1)",
    qrBtn: "💳 เลือกรูป QR Code",
    backBtn: "⬅ ย้อนกลับ",
    genCardBtn: "สร้างการ์ด ✨",
    step4Title: "🎉 การ์ดขอเงินของคุณ 🎉",
    qrHint: "สแกนเพื่อโอนเงินค่าขนม 👇",
    saveBtn: "💾 บันทึก QR",
    shareBtn: "📤 แชร์การ์ด",
    profileReturnBtn: "🏠 กลับสู่หน้าโปรไฟล์",
    modalTitle: "📤 แชร์การ์ด",
    modalSub: "ส่งลิงก์และรูปภาพให้เพื่อน:",
    copyLinkBtn: "📋 คัดลอกลิงก์",
    dl1to1Btn: "📥 ดาวน์โหลดรูป 1:1",
    closeBtn: "ปิด",
    alertNote: "❌ กรุณากรอกข้อความขอเงิน",
    alertBg: "❌ กรุณาอัปโหลดภาพพื้นหลัง",
    alertQr: "❌ กรุณาอัปโหลดรูป QR Code",
    reasons: [
      { val: "ขอเงินค่าขนม", text: "ขอเงินค่าขนม" },
      { val: "ไปเที่ยวกับแฟน", text: "ไปเที่ยวกับแฟน" },
      { val: "ไปเที่ยวกับเพื่อน", text: "ไปเที่ยวกับเพื่อน" },
      { val: "เงินหมดแล้ว", text: "เงินหมดแล้ว" },
      { val: "အခြား", text: "อื่นๆ (พิมพ์เอง)" }
    ]
  },
  zh: {
    introMsg: "欢迎 👋 请稍候...",
    loaderMsg: "请稍候...",
    authTitle: "✨ 登录 / 注册 ✨",
    modeSelectLabel: "选择模式",
    optLogin: "登录 (已有账号)",
    optSignup: "注册 (新用户)",
    nameLabel: "您的姓名",
    namePlaceholder: "请输入姓名",
    numLabel: "识别码 / 数字",
    numPlaceholder: "请输入数字",
    passLabel: "密码",
    passPlaceholder: "请输入密码",
    pass2Label: "确认密码",
    pass2Placeholder: "请再次输入密码",
    loginBtn: "登录 🔓",
    signupBtn: "创建账号 ✨",
    profileTitle: "👤 个人中心 (Profile)",
    changeAvatar: "📷 更换头像",
    reqPocketBtn: "🧧 讨要零花钱",
    historyBtn: "📜 历史记录",
    step3Title: "🎈 选择讨要理由 🎈",
    dropdownLabel: "选择理由",
    customReasonLabel: "自定义理由",
    customReasonPlaceholder: "请输入自定义理由",
    customNoteLabel: "编写留言",
    customNotePlaceholder: "写点什么吧...",
    bgLabel: "背景图片 (3:4)",
    bgBtn: "📸 选择背景图",
    qrLabel: "收款 QR 码图片 (1:1)",
    qrBtn: "💳 选择 QR 码",
    backBtn: "⬅ 返回",
    genCardBtn: "生成卡片 ✨",
    step4Title: "🎉 您的零花钱请求卡 🎉",
    qrHint: "扫码支持一下零花钱 👇",
    saveBtn: "💾 保存 QR 码",
    shareBtn: "📤 分享",
    profileReturnBtn: "🏠 返回个人中心",
    modalTitle: "📤 分享卡片",
    modalSub: "发送链接与卡片：",
    copyLinkBtn: "📋 复制链接",
    dl1to1Btn: "📥 下载 1:1 图片",
    closeBtn: "关闭",
    alertNote: "❌ 请填写留言内容。",
    alertBg: "❌ 请上传背景图片。",
    alertQr: "❌ 请上传收款二维码。",
    reasons: [
      { val: "讨要节日零花钱", text: "讨要节日零花钱" },
      { val: "与对象约会", text: "与对象约会" },
      { val: "与朋友聚会", text: "与朋友聚会" },
      { val: "钱包空空", text: "钱包空空" },
      { val: "အခြား", text: "其他 (自定义)" }
    ]
  },
  ja: {
    introMsg: "ようこそ 👋 少々お待ちください...",
    loaderMsg: "読み込み中...",
    authTitle: "✨ ログイン / 新規登録 ✨",
    modeSelectLabel: "モードを選択",
    optLogin: "ログイン (アカウントをお持ちの方)",
    optSignup: "新規登録 (アカウント作成)",
    nameLabel: "お名前",
    namePlaceholder: "名前を入力",
    numLabel: "識別番号",
    numPlaceholder: "番号を入力",
    passLabel: "パスワード",
    passPlaceholder: "パスワードを入力",
    pass2Label: "パスワード再入力",
    pass2Placeholder: "もう一度入力してください",
    loginBtn: "ログイン 🔓",
    signupBtn: "アカウント作成 ✨",
    profileTitle: "👤 プロフィール (Profile)",
    changeAvatar: "📷 アバター変更",
    reqPocketBtn: "🧧 お小遣いをおねだり",
    historyBtn: "📜 リクエスト履歴",
    step3Title: "🎈 おねだりの理由を選択 🎈",
    dropdownLabel: "理由を選択",
    customReasonLabel: "自由入力",
    customReasonPlaceholder: "理由を入力...",
    customNoteLabel: "メッセージを添える",
    customNotePlaceholder: "メッセージを入力...",
    bgLabel: "背景画像 (3:4 Ratio)",
    bgBtn: "📸 背景画像を選択",
    qrLabel: "受取用QRコード (1:1 Ratio)",
    qrBtn: "💳 QRコードを選択",
    backBtn: "⬅ 戻る",
    genCardBtn: "カードを作成 ✨",
    step4Title: "🎉 おねだりカード完成 🎉",
    qrHint: "Scan or Pay to Send Pocket Money 👇",
    saveBtn: "💾 QRを保存",
    shareBtn: "📤 共有する",
    profileReturnBtn: "🏠 プロフィールへ戻る",
    modalTitle: "📤 カードを共有",
    modalSub: "リンクと画像を送信:",
    copyLinkBtn: "📋 リンクをコピー",
    dl1to1Btn: "📥 1:1画像を保存",
    closeBtn: "閉じる",
    alertNote: "❌ メッセージを入力してください。",
    alertBg: "❌ 背景画像をアップロードしてください。",
    alertQr: "❌ QRコード画像をアップロードしてください。",
    reasons: [
      { val: "お小遣いリクエスト", text: "お小遣いリクエスト" },
      { val: "恋人とデート費用", text: "恋人とデート費用" },
      { val: "友達とお出かけ", text: "友達とお出かけ" },
      { val: "ピンチでお金がない", text: "ピンチでお金がない" },
      { val: "အခြား", text: "その他 (自由入力)" }
    ]
  },
  ko: {
    introMsg: "환영합니다 👋 잠시만 기다려주세요...",
    loaderMsg: "로딩 중...",
    authTitle: "✨ 로그인 / 회원가입 ✨",
    modeSelectLabel: "모드 선택",
    optLogin: "로그인 (기존 계정)",
    optSignup: "회원가입 (신규 계정)",
    nameLabel: "이름",
    namePlaceholder: "이름을 입력하세요",
    numLabel: "식별 번호",
    numPlaceholder: "번호를 입력하세요",
    passLabel: "비밀번호",
    passPlaceholder: "비밀번호 입력",
    pass2Label: "비밀번호 확인",
    pass2Placeholder: "비밀번호 재입력",
    loginBtn: "로그인 🔓",
    signupBtn: "계정 생성 ✨",
    profileTitle: "👤 프로필 대시보드",
    changeAvatar: "📷 프로필 사진 변경",
    reqPocketBtn: "🧧 용돈 요청하기",
    historyBtn: "📜 요청 내역",
    step3Title: "🎈 요청 이유 선택 🎈",
    dropdownLabel: "이유 선택",
    customReasonLabel: "직접 입력",
    customReasonPlaceholder: "이유를 입력하세요",
    customNoteLabel: "메시지 작성",
    customNotePlaceholder: "메시지를 작성하세요...",
    bgLabel: "배경 이미지 (3:4 비율)",
    bgBtn: "📸 배경 이미지 선택",
    qrLabel: "송금 QR 코드 (1:1 비율)",
    qrBtn: "💳 QR 코드 이미지 선택",
    backBtn: "⬅ 뒤로가기",
    genCardBtn: "카드 만들기 ✨",
    step4Title: "🎉 용돈 요청 카드 🎉",
    qrHint: "스캔하여 용돈 보내기 👇",
    saveBtn: "💾 QR 저장",
    shareBtn: "📤 공유하기",
    profileReturnBtn: "🏠 프로필로 돌아가기",
    modalTitle: "📤 카드 공유",
    modalSub: "링크 및 이미지 전달:",
    copyLinkBtn: "📋 링크 복사",
    dl1to1Btn: "📥 1:1 이미지 다운로드",
    closeBtn: "닫기",
    alertNote: "❌ 요청 메시지를 작성해 주세요.",
    alertBg: "❌ 배경 이미지를 업로드해 주세요.",
    alertQr: "❌ QR 코드 이미지를 업로드해 주세요.",
    reasons: [
      { val: "용돈 요청", text: "용돈 요청" },
      { val: "연인과 데이트 비용", text: "연인과 데이트 비용" },
      { val: "친구들과 놀러가기", text: "친구들과 놀러가기" },
      { val: "지갑이 비었어요", text: "지갑이 비었어요" },
      { val: "အခြား", text: "기타 (직접 작성)" }
    ]
  }
};

// ပုံအရွယ်အစားနှင့် ဖိုင်ဆိုဒ်ကို မြန်ဆန်စွာ အဆင်ပြေအောင် သေးပေးသည့် ဖန်ရှင်
function compressImage(file, maxWidth, quality, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
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
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

window.addEventListener('DOMContentLoaded', async () => {
  populateReasonDropdown(currentLang);

  setTimeout(() => {
    const splash = document.getElementById('introSplash');
    if (splash) splash.classList.add('fade-out');
  }, 1500);

  // လင့်ခ်ထဲမှ ID ကို စစ်ဆေး၍ ကတ်ကို တိုက်ရိုက် (Direct) ပြသခြင်း
  const urlParams = new URLSearchParams(window.location.search);
  const cardId = urlParams.get('id');

  if (cardId) {
    const loader = document.getElementById('stepLoader');
    if (loader) loader.classList.add('show');

    try {
      const res = await fetch(`https://jsonblob.com/api/jsonBlob/${cardId}`);
      if (res.ok) {
        const data = await res.json();
        renderCardData(data);
        if (loader) loader.classList.remove('show');
        showStep(4); // ကတ်ပြားဆီ သို့ တိုက်ရိုက်ရောက်ရှိမည်
      } else {
        if (loader) loader.classList.remove('show');
        alert('ကတ်အချက်အလက် ရှာမတွေ့ပါ။');
      }
    } catch (err) {
      console.error(err);
      if (loader) loader.classList.remove('show');
      alert('အချက်အလက် ရယူရာတွင် အမှားအယွင်းရှိပါသည်။');
    }
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
    document.getElementById('bgImgLabel').innerText = `✅ ${input.files[0].name}`;
    compressImage(input.files[0], 400, 0.6, (compressedBase64) => {
      savedBgImage = compressedBase64;
    });
  }
}

function handleQrImage(input) {
  if (input.files && input.files[0]) {
    document.getElementById('qrImgLabel').innerText = `✅ ${input.files[0].name}`;
    compressImage(input.files[0], 300, 0.7, (compressedBase64) => {
      savedQrImage = compressedBase64;
    });
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
  if (!savedBgImage) {
    alert(d.alertBg);
    return;
  }
  if (!savedQrImage) {
    alert(d.alertQr);
    return;
  }

  const loader = document.getElementById('stepLoader');
  loader.classList.add('show');

  const payload = {
    sender: currentUser ? currentUser.name : 'Aung',
    reason: finalReason,
    note: customNote,
    bgImage: savedBgImage,
    qrImage: savedQrImage
  };

  try {
    const res = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const locationUrl = res.headers.get('Location') || res.headers.get('location');
      let blobId = '';
      if (locationUrl) {
        blobId = locationUrl.substring(locationUrl.lastIndexOf('/') + 1);
      }

      if (!blobId) {
        const resData = await res.json();
        blobId = resData.id || '';
      }

      if (blobId) {
        currentShareableLink = `${window.location.origin}${window.location.pathname}?id=${blobId}`;
        renderCardData(payload);
        loader.classList.remove('show');
        showStep(4);
      } else {
        throw new Error('No blob ID returned');
      }
    } else {
      throw new Error('Server returned ' + res.status);
    }
  } catch (err) {
    console.error('Save card error:', err);
    loader.classList.remove('show');
    alert('ကတ်ဖန်တီးရာတွင် အမှားအယွင်းရှိပါသည်။ အင်တာနက်လိုင်း စစ်ဆေးပြီး ပြန်စမ်းပေးပါ။');
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
  const d = i18n[lang] || i18n['my'];

  if (document.getElementById('introMsg')) document.getElementById('introMsg').innerText = d.introMsg;
  if (document.getElementById('lbl_loaderMsg')) document.getElementById('lbl_loaderMsg').innerText = d.loaderMsg;

  if (document.getElementById('lbl_authTitle')) document.getElementById('lbl_authTitle').innerText = d.authTitle;
  if (document.getElementById('lbl_modeSelect')) document.getElementById('lbl_modeSelect').innerText = d.modeSelectLabel;
  
  const authSelect = document.getElementById('authModeSelect');
  if (authSelect) {
    authSelect.options[0].text = d.optLogin;
    authSelect.options[1].text = d.optSignup;
  }

  if (document.getElementById('lbl_loginName')) document.getElementById('lbl_loginName').innerText = d.nameLabel;
  if (document.getElementById('loginName')) document.getElementById('loginName').placeholder = d.namePlaceholder;

  if (document.getElementById('lbl_loginPass')) document.getElementById('lbl_loginPass').innerText = d.passLabel;
  if (document.getElementById('loginPass')) document.getElementById('loginPass').placeholder = d.passPlaceholder;

  if (document.getElementById('btn_login')) document.getElementById('btn_login').innerText = d.loginBtn;

  if (document.getElementById('lbl_signupName')) document.getElementById('lbl_signupName').innerText = d.nameLabel;
  if (document.getElementById('signupName')) document.getElementById('signupName').placeholder = d.namePlaceholder;

  if (document.getElementById('lbl_signupNum')) document.getElementById('lbl_signupNum').innerText = d.numLabel;
  if (document.getElementById('signupNum')) document.getElementById('signupNum').placeholder = d.numPlaceholder;

  if (document.getElementById('lbl_signupPass1')) document.getElementById('lbl_signupPass1').innerText = d.passLabel;
  if (document.getElementById('signupPass1')) document.getElementById('signupPass1').placeholder = d.passPlaceholder;

  if (document.getElementById('lbl_signupPass2')) document.getElementById('lbl_signupPass2').innerText = d.pass2Label;
  if (document.getElementById('signupPass2')) document.getElementById('signupPass2').placeholder = d.pass2Placeholder;

  if (document.getElementById('btn_signup')) document.getElementById('btn_signup').innerText = d.signupBtn;

  if (document.getElementById('lbl_profileTitle')) document.getElementById('lbl_profileTitle').innerText = d.profileTitle;
  if (document.getElementById('lbl_changeAvatar')) document.getElementById('lbl_changeAvatar').innerText = d.changeAvatar;
  if (document.getElementById('lbl_reqPocketBtn')) document.getElementById('lbl_reqPocketBtn').innerText = d.reqPocketBtn;
  if (document.getElementById('lbl_historyBtn')) document.getElementById('lbl_historyBtn').innerText = d.historyBtn;

  if (document.getElementById('lbl_step3Title')) document.getElementById('lbl_step3Title').innerText = d.step3Title;
  if (document.getElementById('lbl_dropdown')) document.getElementById('lbl_dropdown').innerText = d.dropdownLabel;
  if (document.getElementById('lbl_customReason')) document.getElementById('lbl_customReason').innerText = d.customReasonLabel;
  if (document.getElementById('customReason')) document.getElementById('customReason').placeholder = d.customReasonPlaceholder;
  if (document.getElementById('lbl_customNote')) document.getElementById('lbl_customNote').innerText = d.customNoteLabel;
  if (document.getElementById('customNote')) document.getElementById('customNote').placeholder = d.customNotePlaceholder;
  if (document.getElementById('lbl_bgLabel')) document.getElementById('lbl_bgLabel').innerText = d.bgLabel;
  if (document.getElementById('bgImgLabel') && !savedBgImage) document.getElementById('bgImgLabel').innerText = d.bgBtn;
  if (document.getElementById('lbl_qrLabel')) document.getElementById('lbl_qrLabel').innerText = d.qrLabel;
  if (document.getElementById('qrImgLabel') && !savedQrImage) document.getElementById('qrImgLabel').innerText = d.qrBtn;
  if (document.getElementById('btn_backStep3')) document.getElementById('btn_backStep3').innerText = d.backBtn;
  if (document.getElementById('btn_genCard')) document.getElementById('btn_genCard').innerText = d.genCardBtn;

  populateReasonDropdown(lang);

  if (document.getElementById('lbl_step4Title')) document.getElementById('lbl_step4Title').innerText = d.step4Title;
  if (document.getElementById('lbl_qrHint')) document.getElementById('lbl_qrHint').innerText = d.qrHint;
  if (document.getElementById('btn_saveQr')) document.getElementById('btn_saveQr').innerText = d.saveBtn;
  if (document.getElementById('btn_share')) document.getElementById('btn_share').innerText = d.shareBtn;
  if (document.getElementById('btn_profileReturn')) document.getElementById('btn_profileReturn').innerText = d.profileReturnBtn;

  if (document.getElementById('lbl_modalTitle')) document.getElementById('lbl_modalTitle').innerText = d.modalTitle;
  if (document.getElementById('lbl_modalSub')) document.getElementById('lbl_modalSub').innerText = d.modalSub;
  if (document.getElementById('btn_copyLink')) document.getElementById('btn_copyLink').innerText = d.copyLinkBtn;
  if (document.getElementById('btn_dlQrModal')) document.getElementById('btn_dlQrModal').innerText = d.dl1to1Btn;
  if (document.getElementById('btn_closeModal')) document.getElementById('btn_closeModal').innerText = d.closeBtn;
}
