'use strict';

// ==========================================
// Constants
// ==========================================
const SUPABASE_URL = 'https://koybxyoucyqnixvwplke.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtveWJ4eW91Y3lxbml4dndwbGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNDE4NzYsImV4cCI6MjEwNjYxNzg3Nn0.V_TYzwjFO3SwnYUudWsxntm3prfckEXoAynuX5MxM-g';

const MEDIA_BUCKET = 'card-media';
const CARD_LIFETIME_MS = 120 * 60 * 1000;
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_SECONDS = 15;
const HASH_PREFIX = 'sha256$';

// ==========================================
// ==========================================
function showCustomAlert(message) {
  let alertBox = document.getElementById('customAlertBox');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.id = 'customAlertBox';
    alertBox.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-20px);
      background: rgba(15, 23, 42, 0.95); border: 1.5px solid rgba(0, 242, 254, 0.5);
      color: #fff; padding: 12px 20px; border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 242, 254, 0.3); z-index: 99999; font-size: 13.5px;
      display: flex; align-items: center; gap: 10px; opacity: 0; transition: all 0.3s ease;
      backdrop-filter: blur(6px); text-align: center; max-width: 90%;
    `;
    document.body.appendChild(alertBox);
  }

  clearTimeout(alertBox._showTimer);
  clearTimeout(alertBox._hideTimer);
  clearTimeout(alertBox._endTimer);

  alertBox.textContent = String(message);
  alertBox.style.display = 'flex';

  alertBox._showTimer = setTimeout(() => {
    alertBox.style.opacity = '1';
    alertBox.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);

  alertBox._hideTimer = setTimeout(() => {
    alertBox.style.opacity = '0';
    alertBox.style.transform = 'translateX(-50%) translateY(-20px)';
    alertBox._endTimer = setTimeout(() => { alertBox.style.display = 'none'; }, 300);
  }, 3500);
}

window.alert = function (msg) {
  showCustomAlert(msg);
};

// ==========================================
// Policy Modal Data (Multi-language)
// ==========================================
const CONTACT_EMAIL = 'monpphoe@gmail.com';

const legalContent = {
  about: {
    my: { title: "ကျွန်ုပ်တို့အကြောင်း", body: "<p>Pocket Request App မှ ကြိုဆိုပါတယ်။ စိတ်ကြိုက် QR Pocket Card များနှင့် Digital Request Card များကို လွယ်ကူလျင်မြန်စွာ ဖန်တီးပြီး မျှဝေနိုင်အောင် ကူညီပေးသော ဝန်ဆောင်မှုဖြစ်ပါတယ်။</p>" },
    en: { title: "About Us", body: "<p>Welcome to Pocket Request App. We offer a convenient tool to generate, customize, and share personalized QR pocket cards and digital request cards effortlessly.</p>" },
    ja: { title: "私たちについて", body: "<p>Pocket Request Appへようこそ。パーソナライズされたQRポケットカードを簡単に作成、カスタマイズ、共有できる便利なツールを提供しています。</p>" },
    ko: { title: "회사 소개", body: "<p>Pocket Request App에 오신 것을 환영합니다. 개인 맞춤형 QR 포켓 카드를 쉽게 생성, 맞춤 설정 및 공유할 수 있는 편리한 도구를 제공합니다.</p>" },
    th: { title: "เกี่ยวกับเรา", body: "<p>ยินดีต้อนรับสู่ Pocket Request App เราให้บริการเครื่องมือที่สะดวกในการสร้าง ปรับแต่ง และแชร์การ์ด QR ดิจิทัลได้อย่างง่ายดาย</p>" },
    zh: { title: "关于我们", body: "<p>欢迎使用 Pocket Request App。我们提供便捷的工具，供您轻松生成、自定义和分享个性化 QR 卡片。</p>" }
  },
  contact: {
    my: { title: "ဆက်သွယ်ရန်", body: `<p>မေးမြန်းလိုသည်များ သို့မဟုတ် အကြံပြုချက်များရှိပါက အောက်ပါ အီးမေးလ်မှတစ်ဆင့် ဆက်သွယ်နိုင်ပါသည်။</p><p style='margin-top:8px;'>📧 Email: <b>${CONTACT_EMAIL}</b></p>` },
    en: { title: "Contact Us", body: `<p>If you have any questions or feedback, feel free to reach out to us:</p><p style='margin-top:8px;'>📧 Email: <b>${CONTACT_EMAIL}</b></p>` },
    ja: { title: "お問い合わせ", body: `<p>ご質問やご意見がございましたら、お気軽にお問い合わせください。</p><p style='margin-top:8px;'>📧 Email: <b>${CONTACT_EMAIL}</b></p>` },
    ko: { title: "문의하기", body: `<p>질문이나 피드백이 있으시면 언제든지 문의해 주세요.</p><p style='margin-top:8px;'>📧 Email: <b>${CONTACT_EMAIL}</b></p>` },
    th: { title: "ติดต่อเรา", body: `<p>หากคุณมีคำถามหรือข้อเสนอแนะ โปรดติดต่อเราได้ที่:</p><p style='margin-top:8px;'>📧 Email: <b>${CONTACT_EMAIL}</b></p>` },
    zh: { title: "联系我们", body: `<p>如果您有任何疑问或反馈，请随时联系我们：</p><p style='margin-top:8px;'>📧 Email: <b>${CONTACT_EMAIL}</b></p>` }
  },
  privacy: {
    my: {
      title: "ကိုယ်ရေးအချက်အလက် မူဝါဒ",
      body: `
        <p><b>ကျွန်ုပ်တို့ သိမ်းဆည်းသော အချက်အလက်များ</b></p>
        <p>အက်ပ်ကို လည်ပတ်စေရန် လိုအပ်သည်များကိုသာ သိမ်းဆည်းပါသည် - နာမည်၊ ID နံပါတ်၊ Password (ပြန်ဖတ်၍မရသော hash အဖြစ်)၊ ရွေးချယ်ထည့်သွင်းသော Profile ပုံ၊ နှင့် သင်ဖန်တီးသော ကတ်အကြောင်းအရာ (စာသား၊ နောက်ခံပုံ/Video၊ QR ပုံ၊ ရွေးထားသောသီချင်း)။</p>
        <p style="margin-top:8px;"><b>သက်တမ်းနှင့် ဖျက်ခြင်း</b></p>
        <p>ဖန်တီးထားသော ကတ်နှင့် တင်ထားသော ဖိုင်များကို မိနစ် ၁၂၀ ကျော်လျှင် အလိုအလျောက် ဖျက်ပါသည်။ Profile နှင့် အကောင့်အချက်အလက်များကိုမူ အကောင့်ရှိနေသရွေ့ သိမ်းထားပြီး ဖျက်ပေးရန် အီးမေးလ်ဖြင့် တောင်းဆိုနိုင်ပါသည်။</p>
        <p style="margin-top:8px;"><b>မျှဝေခြင်း</b></p>
        <p>သင့်အချက်အလက်များကို မည်သူ့ကိုမျှ ရောင်းချခြင်း မပြုပါ။ ကတ်လင့်ခ်ကို သင်ကိုယ်တိုင် မျှဝေလျှင် လင့်ခ်ရသူ မည်သူမဆို ကတ်ကို မြင်နိုင်ပါမည်။</p>
        <p style="margin-top:8px;"><b>ကြော်ငြာနှင့် Cookies</b></p>
        <p>ကျွန်ုပ်တို့သည် Google အပါအဝင် Third-party ကြော်ငြာဝန်ဆောင်သူများကို အသုံးပြုပါသည်။ ၎င်းတို့သည် ဤဝက်ဘ်ဆိုက်နှင့် အခြားဝက်ဘ်ဆိုက်များသို့ သင်ဝင်ရောက်ဖူးမှုအပေါ် မူတည်၍ ကြော်ငြာပြသရန် cookies သုံးနိုင်ပါသည်။ ကိုယ်ပိုင်ပြင်ဆင်ထားသော ကြော်ငြာကို <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="color:#00f2fe;">Google Ads Settings</a> တွင် ပိတ်နိုင်ပါသည်။</p>
        <p style="margin-top:8px;">မေးမြန်းရန် - <b>${CONTACT_EMAIL}</b></p>`
    },
    en: {
      title: "Privacy Policy",
      body: `
        <p><b>What we store</b></p>
        <p>We only store what is needed to run the app: your display name, ID number, a password (stored as a one-way hash), an optional profile picture, and the content of cards you create (message, background image/video, QR image, chosen music).</p>
        <p style="margin-top:8px;"><b>Retention and deletion</b></p>
        <p>Cards and their uploaded media are automatically deleted 120 minutes after creation. Account details and profile picture are kept while your account exists; email us to have them removed.</p>
        <p style="margin-top:8px;"><b>Sharing</b></p>
        <p>We do not sell your data. If you share a card link, anyone with the link can view that card until it expires.</p>
        <p style="margin-top:8px;"><b>Advertising and cookies</b></p>
        <p>We use third-party vendors, including Google, to serve ads. They may use cookies to show ads based on your prior visits to this and other websites. You can opt out of personalized advertising in <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="color:#00f2fe;">Google Ads Settings</a>.</p>
        <p style="margin-top:8px;">Questions: <b>${CONTACT_EMAIL}</b></p>`
    },
    ja: {
      title: "プライバシーポリシー",
      body: `
        <p><b>保存する情報</b></p>
        <p>アプリの運営に必要な情報のみを保存します：名前、ID番号、パスワード（不可逆のハッシュ）、任意のプロフィール画像、作成したカードの内容（メッセージ、背景画像/動画、QR画像、選択した音楽）。</p>
        <p style="margin-top:8px;"><b>保存期間と削除</b></p>
        <p>作成したカードとアップロードされたメディアは、作成から120分後に自動的に削除されます。アカウント情報とプロフィール画像はアカウントが存在する間保持され、削除はメールでご依頼いただけます。</p>
        <p style="margin-top:8px;"><b>共有</b></p>
        <p>お客様のデータを販売することはありません。カードのリンクを共有すると、有効期限まで、リンクを知る人は誰でもそのカードを閲覧できます。</p>
        <p style="margin-top:8px;"><b>広告とCookie</b></p>
        <p>Googleを含む第三者の配信事業者が広告を配信します。これらの事業者は、お客様の当サイトや他のサイトへの過去のアクセス情報に基づいて広告を表示するためにCookieを使用することがあります。パーソナライズ広告は<a href="https://adssettings.google.com" target="_blank" rel="noopener" style="color:#00f2fe;">Googleの広告設定</a>で無効にできます。</p>
        <p style="margin-top:8px;">お問い合わせ：<b>${CONTACT_EMAIL}</b></p>`
    },
    ko: {
      title: "개인정보 처리방침",
      body: `
        <p><b>저장하는 정보</b></p>
        <p>앱 운영에 필요한 정보만 저장합니다: 이름, ID 번호, 비밀번호(단방향 해시), 선택한 프로필 사진, 생성한 카드 내용(메시지, 배경 이미지/동영상, QR 이미지, 선택한 음악).</p>
        <p style="margin-top:8px;"><b>보관 기간 및 삭제</b></p>
        <p>생성된 카드와 업로드된 미디어는 생성 후 120분이 지나면 자동으로 삭제됩니다. 계정 정보와 프로필 사진은 계정이 존재하는 동안 보관되며, 삭제를 원하시면 이메일로 요청해 주세요.</p>
        <p style="margin-top:8px;"><b>공유</b></p>
        <p>귀하의 데이터를 판매하지 않습니다. 카드 링크를 공유하면 만료 전까지 링크를 가진 누구나 해당 카드를 볼 수 있습니다.</p>
        <p style="margin-top:8px;"><b>광고 및 쿠키</b></p>
        <p>Google을 포함한 제3자 광고 업체가 광고를 게재합니다. 이들은 귀하의 이 사이트 및 다른 사이트 방문 기록을 바탕으로 광고를 표시하기 위해 쿠키를 사용할 수 있습니다. 맞춤 광고는 <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="color:#00f2fe;">Google 광고 설정</a>에서 해제할 수 있습니다.</p>
        <p style="margin-top:8px;">문의: <b>${CONTACT_EMAIL}</b></p>`
    },
    th: {
      title: "นโยบายความเป็นส่วนตัว",
      body: `
        <p><b>ข้อมูลที่เราจัดเก็บ</b></p>
        <p>เราจัดเก็บเฉพาะข้อมูลที่จำเป็นต่อการทำงานของแอป ได้แก่ ชื่อ หมายเลข ID รหัสผ่าน (เก็บเป็นแฮชแบบทางเดียว) รูปโปรไฟล์ (ถ้ามี) และเนื้อหาการ์ดที่คุณสร้าง (ข้อความ รูป/วิดีโอพื้นหลัง รูป QR เพลงที่เลือก)</p>
        <p style="margin-top:8px;"><b>ระยะเวลาเก็บและการลบ</b></p>
        <p>การ์ดและไฟล์ที่อัปโหลดจะถูกลบอัตโนมัติหลังสร้างครบ 120 นาที ส่วนข้อมูลบัญชีและรูปโปรไฟล์จะเก็บไว้ตราบที่บัญชียังอยู่ หากต้องการให้ลบ โปรดส่งอีเมลถึงเรา</p>
        <p style="margin-top:8px;"><b>การแชร์</b></p>
        <p>เราไม่ขายข้อมูลของคุณ หากคุณแชร์ลิงก์การ์ด ทุกคนที่มีลิงก์จะดูการ์ดนั้นได้จนกว่าจะหมดอายุ</p>
        <p style="margin-top:8px;"><b>โฆษณาและคุกกี้</b></p>
        <p>เราใช้ผู้ให้บริการโฆษณาภายนอก รวมถึง Google ซึ่งอาจใช้คุกกี้เพื่อแสดงโฆษณาตามการเข้าชมเว็บไซต์นี้และเว็บไซต์อื่นของคุณ คุณสามารถปิดโฆษณาเฉพาะบุคคลได้ที่ <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="color:#00f2fe;">การตั้งค่าโฆษณาของ Google</a></p>
        <p style="margin-top:8px;">สอบถาม: <b>${CONTACT_EMAIL}</b></p>`
    },
    zh: {
      title: "隐私政策",
      body: `
        <p><b>我们存储的信息</b></p>
        <p>我们仅存储运行应用所必需的信息：昵称、ID 编号、密码（以不可逆哈希形式存储）、可选的头像，以及您创建的卡片内容（留言、背景图片/视频、QR 图片、所选音乐）。</p>
        <p style="margin-top:8px;"><b>保存期限与删除</b></p>
        <p>生成的卡片及其上传的媒体文件将在创建 120 分钟后自动删除。账号信息和头像在账号存续期间保留，如需删除请发送邮件联系我们。</p>
        <p style="margin-top:8px;"><b>分享</b></p>
        <p>我们不会出售您的数据。如果您分享卡片链接，在卡片过期前，任何拥有链接的人都可以查看该卡片。</p>
        <p style="margin-top:8px;"><b>广告与 Cookie</b></p>
        <p>我们使用包括 Google 在内的第三方广告服务商投放广告，他们可能会根据您对本网站及其他网站的访问记录，使用 Cookie 展示广告。您可以在 <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="color:#00f2fe;">Google 广告设置</a> 中停用个性化广告。</p>
        <p style="margin-top:8px;">联系方式：<b>${CONTACT_EMAIL}</b></p>`
    }
  },
  terms: {
    my: { title: "စည်းမျဉ်းနှင့် စည်းကမ်းများ", body: "<p>Pocket Request App ကို အသုံးပြုခြင်းဖြင့် QR Card များကို တာဝန်ယူမှုရှိစွာ ဖန်တီးသုံးစွဲရန် သဘောတူညီပါသည်။ မသမာသော လုပ်ရပ်များ၊ လိမ်လည်လှည့်ဖြားခြင်း၊ ဥပဒေမဲ့ သို့မဟုတ် ညစ်ညမ်းသော အကြောင်းအရာများ မျှဝေခြင်းကို တင်းကြပ်စွာ တားမြစ်ထားပါသည်။ ကိုယ်ပိုင်မဟုတ်သော QR ကုဒ်၊ အခြားသူ၏ ပုံများကို ခွင့်ပြုချက်မရဘဲ အသုံးမပြုရပါ။ စည်းကမ်းဖောက်ဖျက်သော ကတ်နှင့် အကောင့်များကို ကြိုတင်အသိပေးခြင်းမရှိဘဲ ဖျက်ပိုင်ခွင့်ရှိပါသည်။</p>" },
    en: { title: "Terms & Conditions", body: "<p>By using Pocket Request App, you agree to generate and share QR cards responsibly. Fraud, misuse, and the distribution of illegal or obscene content are strictly prohibited. Do not use QR codes or images that do not belong to you without permission. We may remove cards and accounts that violate these terms without prior notice.</p>" },
    ja: { title: "利用規約", body: "<p>Pocket Request Appを使用することで、責任を持ってQRカードを生成および共有することに同意したことになります。詐欺、不正利用、違法または猥褻なコンテンツの配布は固く禁止されています。他人のQRコードや画像を無断で使用しないでください。規約に違反するカードおよびアカウントは、事前の通知なく削除される場合があります。</p>" },
    ko: { title: "이용약관", body: "<p>Pocket Request App을 사용함으로써 귀하는 책임감 있게 QR 카드를 생성하고 공유하는 데 동의하게 됩니다. 사기, 오용, 불법 또는 음란한 콘텐츠의 유포는 엄격히 금지됩니다. 타인의 QR 코드나 이미지를 무단으로 사용하지 마세요. 약관을 위반하는 카드와 계정은 사전 통지 없이 삭제될 수 있습니다.</p>" },
    th: { title: "ข้อกำหนดและเงื่อนไข", body: "<p>การใช้ Pocket Request App ถือว่าคุณตกลงที่จะสร้างและแชร์การ์ด QR อย่างมีความรับผิดชอบ ห้ามฉ้อโกง ใช้ในทางที่ผิด หรือเผยแพร่เนื้อหาผิดกฎหมายหรืออนาจารโดยเด็ดขาด ห้ามใช้ QR Code หรือรูปภาพของผู้อื่นโดยไม่ได้รับอนุญาต เราขอสงวนสิทธิ์ลบการ์ดและบัญชีที่ละเมิดข้อกำหนดโดยไม่ต้องแจ้งล่วงหน้า</p>" },
    zh: { title: "条款与条件", body: "<p>使用 Pocket Request App 即表示您同意负责任地生成和分享 QR 卡片。严禁欺诈、滥用以及传播违法或淫秽内容。未经许可，请勿使用不属于您的 QR 码或图片。对于违反条款的卡片和账号，我们有权在不事先通知的情况下删除。</p>" }
  }
};

function getActiveLang() {
  return (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'my';
}

function openLegalModal(type) {
  const lang = getActiveLang();
  const group = legalContent[type];
  if (!group) return;
  const content = group[lang] || group.en || group.my;

  const modalTitle = document.getElementById('legalModalTitle');
  const modalBody = document.getElementById('legalModalBody');
  const modal = document.getElementById('legalModal');
  const closeBtn = document.getElementById('legalModalClose');

  if (modalTitle) modalTitle.textContent = content.title;
  if (modalBody) modalBody.innerHTML = content.body;
  if (closeBtn) closeBtn.textContent = (i18n[lang] || i18n.my).closeBtn;
  if (modal) modal.style.display = 'flex';
}

function closeLegalModal() {
  const modal = document.getElementById('legalModal');
  if (modal) modal.style.display = 'none';
}

// ==========================================
// State
// ==========================================
let supabaseClient = null;

function setLoader(on) {
  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.toggle('show', !!on);
}

function withTimeout(promise, ms = 12000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Request timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function getSupabase() {
  if (!supabaseClient && window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
  }
  return supabaseClient;
}

let currentUser = null;
let savedMusicUrl = '';
let displayedQrImage = '';
let currentShareableLink = '';
let currentLang = 'my';
let cardTimerInterval = null;
let historyTimerInterval = null;
let isSharedLinkVisitor = false;
let currentCardReason = '';
let currentCardId = '';
let currentCardMusicBase = '';
let isGenerating = false;

const uploads = {
  bg: { file: null, url: '', fallback: '', busy: false, token: 0 },
  qr: { file: null, url: '', fallback: '', busy: false, token: 0 }
};

const localMusicList = Array.from({ length: 14 }, (_, i) => ({
  name: `🎵 song${i + 1}.mp3`,
  url: `music/song${i + 1}.mp3`
}));

// ==========================================
// i18n
// ==========================================
const i18n = {
  my: {
    pageTitle: "Beta Monpphoe",
    introMsg: "ကြိုဆိုပါတယ် ခဏစောင့်ပေးပါ...",
    gateTitle: "🧧 မုန့်ဖိုးတောင်းလွှာ ရောက်ရှိနေပါတယ်",
    gateBtn: "🧧 ဖွင့်ကြည့်မယ်",
    loaderMsg: "ခဏစောင့်ပါ...",
    noticeBtnText: "! သိရန်",
    noticeTitle: "📌 အသုံးပြုသူများသိစေရန်",
    noticeItems: [
      "အက်ပ်လည်ပတ်ရန် လိုအပ်သော အချက်အလက်များ (နာမည်၊ ID၊ Password hash၊ ကတ်အကြောင်းအရာ) ကိုသာ သိမ်းဆည်းပြီး မည်သူ့ကိုမျှ မရောင်းချပါ။ အသေးစိတ်ကို Privacy Policy တွင် ဖတ်ပါ။",
      "အကောင်းမြင်စိတ်ထားပြီး သင့်တော်သည့်အတိုင်းသာ သုံးကြပါရန်မေတ္တာရပ်ခံပါသည်",
      "အကောင့်ဝင်ရောက်ပြီးမှသာ မုန့်ဖိုးတောင်းလွှာများ ဖန်တီးနိုင်ပါသည်။",
      "မှန်ကန်သော QR Code နှင့် နောက်ခံပုံ/ဗီဒီယိုများကို အသုံးပြုပါ။",
      "ဖန်တီးထားသော ကတ်လင့်ခ်များသည် 120 မိနစ်သာ သက်တမ်းရှိပါသည်။",
      "ညစ်ညမ်းသော VD/ပုံများ, နိုင်ငံရေး, ဘာသာရေး စသည်တို့ကို မပြုလုပ်ကြပါရန် မေတ္တာရပ်ခံပါသည်",
      'အကြံပြုချက်များပေးလိုပါကဆက်သွယ်ရန် Tiktok: <a href="https://www.tiktok.com/@_yato_003?_r=1&_t=ZS-9AIzhZsSGE3" target="_blank" rel="noopener" style="color: #00f2fe; text-decoration: underline;"> Yato </a>'
    ],
    noticeCloseText: "ပိတ်မည်",
    authTitle: "အကောင့်ဝင်ရန်",
    modeSelectLabel: "အမျိုးအစား ရွေးချယ်ရန်",
    optLogin: "အကောင့်ရှိပြီးသား",
    optSignup: "အကောင့်သစ်ဖွင့်ရန်",
    nameLabel: "နာမည်",
    namePlaceholder: "နာမည်ရိုက်ပါ",
    numLabel: "ID နံပါတ်",
    numPlaceholder: "နှစ်သက်ရာထည့်နိုင်သည်",
    passLabel: "Password",
    passPlaceholder: "Password ရိုက်ပါ",
    pass2Label: "Password ထပ်မံရိုက်ပါ",
    pass2Placeholder: "Password ကို ထပ်ရိုက်ပါ",
    loginBtn: "အကောင့်ဝင်မည်",
    signupBtn: "အကောင့်အသစ်ဖွင့်မည်",
    logoutBtn: "🚪 အကောင့်ထွက်ရန်",
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
    bgLabel: "နောက်ခံပုံ / Video (9:16, Max 15s)",
    bgBtn: "📸/🎬 ပုံ သို့မဟုတ် Video",
    qrLabel: "QR Code / အချက်အလက်ပုံ",
    qrBtn: "💳 QR Code / ပုံ ရွေးရန်",
    backBtn: "⬅ နောက်သို့",
    genCardBtn: "ကတ်ဖန်တီးမည် ✨",
    step4Title: " မုန့်ဖိုးတောင်းလွှာ ",
    saveBtn: "💾 Save QR",
    shareBtn: "📤 မျှဝေရန်",
    profileReturnBtn: "🏠 Profile",
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
    ],
    msg: {
      fillAll: 'အချက်အလက်များအားလုံး ဖြည့်သွင်းပါ။',
      idOrNameTaken: '⚠ ဤ ID သို့မဟုတ် နာမည် အသုံးပြုပြီးသား ဖြစ်ပါသည်။ အခြားတစ်ခု ပြောင်းသုံးပါ',
      passRule: '⚠ Password သည် အနည်းဆုံး ၆ လုံး ရှိရမည်ဖြစ်ပြီး English စာလုံး ပါဝင်ရပါမည်။',
      passMismatch: 'Password ၂ ခု မတူပါ။',
      signupOk: '✅ အကောင့်အသစ် ဖွင့်ပြီးပါပြီ!',
      loginFill: 'နာမည်နှင့် Password ဖြည့်ပါ။',
      noAccount: 'ဤနာမည်ဖြင့် မှတ်ပုံတင်ထားသော အကောင့်မရှိပါ။',
      wrongPass: 'Password မှားယွင်းနေပါသည်။',
      dbError: 'ဆာဗာနှင့် ချိတ်ဆက်၍ မရပါ။ နောက်မှ ပြန်ကြိုးစားပါ။',
      nickTitle: 'နာမည်ပြောင်းရန်',
      nickPlaceholder: 'နာမည်အသစ် ရိုက်ထည့်ပါ',
      cancel: 'မလုပ်တော့ပါ',
      nickOk: 'နာမည်ပြောင်းလဲပြီးပါပြီ!',
      nickTaken: 'ဤနာမည် အသုံးပြုပြီးသား ဖြစ်ပါသည်။',
      noHistory: 'မှတ်တမ်းများ မရှိသေးပါ။',
      view: 'ကြည့်ရန်',
      del: 'ဖျက်ပြစ်ရန်',
      expires: 'သက်တမ်း',
      expired: 'သက်တမ်း - အချိန်ကုန်သွားပါပြီ',
      cardGone: '❌ ဤကတ်သည် သက်တမ်းကုန်သွားပြီ (သို့) မရှိတော့ပါ။',
      confirmDel: 'ဤမှတ်တမ်းကို ဖျက်ရန် သေချာပါသလား?',
      videoLong: '⚠️ Video ကြာချိန်သည် 15 စက္ကန့်ထက် မပိုရပါ။',
      videoBig: '⚠️ Video ဖိုင်အရွယ်အစားသည် 15MB ထက် မပိုရပါ။',
      checking: '⏳ Video စစ်ဆေးနေပါပြီ...',
      uploadingBg: '⏳ ဖိုင် တင်နေပါပြီ...',
      uploadingQr: '⏳ QR ပုံ တင်နေပါပြီ...',
      uploadFail: '❌ ဖိုင်တင်၍ မရပါ။ နောက်မှ ပြန်ကြိုးစားပါ။',
      waitUpload: '⏳ ဖိုင်တင်နေဆဲ ဖြစ်ပါသည်။ ပြီးမှ ကတ်ဖန်တီးပါ။',
      goneTitle: 'ကတ် မတွေ့ပါ',
      homeBtn: '🏠 ပင်မစာမျက်နှာသို့',
      noQr: 'QR ပုံ မထည့်ရသေးပါ။',
      linkCopied: '✅ လင့်ခ်ကူးယူပြီးပါပြီ!',
      copyFail: '❌ လင့်ခ်ကူးယူ၍ မရပါ။',
      expireEnd: '⚠️ ကတ်သက်တမ်း (မိနစ် 120) ပြည့်သွားပြီဖြစ်ပါ၍ အချက်အလက်များနှင့် လင့်ခ်များကို အလိုအလျောက် ဖျက်ဆီးပြီးပါပြီ။',
      left: 'အထိသာ'
    }
  },
  en: {
    pageTitle: "Beta Monpphoe",
    introMsg: "Welcome! Please wait...",
    gateTitle: "🧧 You received a pocket money request",
    gateBtn: "🧧 Tap to open",
    loaderMsg: "Please wait...",
    noticeBtnText: "! Notice",
    noticeTitle: "📌 Notice for Users",
    noticeItems: [
      "We only store what is needed to run the app (name, ID, password hash, card content) and never sell it. See the Privacy Policy for details.",
      "Please use this app responsibly with a positive mindset.",
      "You can only create pocket money requests after logging in.",
      "Please use correct QR codes and background images/videos.",
      "Created card links are only valid for 120 minutes.",
      "Please avoid inappropriate content, politics, or religious items.",
      'If you want to send pocket money or give feedback / Tiktok: <a href="https://www.tiktok.com/@_yato_003?_r=1&_t=ZS-9AIzhZsSGE3" target="_blank" rel="noopener" style="color: #00f2fe; text-decoration: underline;">@Yato</a>'
    ],
    noticeCloseText: "Close",
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
    logoutBtn: "🚪 Log out",
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
    bgLabel: "Background Image / Video (9:16, Max 15s)",
    bgBtn: "📸/🎬 Choose BG Image or Video",
    qrLabel: "QR Code / Payment Info (HD)",
    qrBtn: "💳 Choose QR Image",
    backBtn: "⬅ Back",
    genCardBtn: "Create Card ✨",
    step4Title: " Pocket Money Request ",
    saveBtn: "💾 Save QR",
    shareBtn: "📤 Share",
    profileReturnBtn: "🏠 Profile",
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
    ],
    msg: {
      fillAll: 'Please fill in all fields.',
      idOrNameTaken: '⚠️ This ID or Name is already registered.',
      passRule: '⚠ Password must be at least 6 characters and contain English letters.',
      passMismatch: 'Passwords do not match.',
      signupOk: '✅ Account created successfully!',
      loginFill: 'Please enter name and password.',
      noAccount: 'Account not found. Please sign up.',
      wrongPass: 'Incorrect password.',
      dbError: 'Could not reach the server. Please try again later.',
      nickTitle: 'Change Name',
      nickPlaceholder: 'Enter new name',
      cancel: 'Cancel',
      nickOk: 'Name updated successfully!',
      nickTaken: 'This name is already taken.',
      noHistory: 'No history records found.',
      view: 'View',
      del: 'Delete',
      expires: 'Expires',
      expired: 'Expired',
      cardGone: '❌ Card has expired or been removed.',
      confirmDel: 'Are you sure you want to delete this record?',
      videoLong: '⚠️ Video duration must not exceed 15 seconds.',
      videoBig: '⚠️ Video file must not exceed 15MB.',
      checking: '⏳ Checking video...',
      uploadingBg: '⏳ Uploading...',
      uploadingQr: '⏳ Uploading...',
      uploadFail: '❌ Upload failed. Please try again later.',
      waitUpload: '⏳ Still uploading. Please wait until it finishes.',
      goneTitle: 'Card not available',
      homeBtn: '🏠 Go to Home',
      noQr: 'No QR image uploaded.',
      linkCopied: '✅ Link copied to clipboard!',
      copyFail: '❌ Could not copy the link.',
      expireEnd: '⚠️ Card expired (120 min). Data cleaned.',
      left: 'Left'
    }
  },
  ja: {
    pageTitle: "Beta Monpphoe",
    introMsg: "ようこそ！少々お待ちください...",
    gateTitle: "🧧 お小遣いリクエストが届いています",
    gateBtn: "🧧 開いてみる",
    loaderMsg: "お待ちください...",
    noticeBtnText: "! お知らせ",
    noticeTitle: "📌 利用規約・注意事項",
    noticeItems: [
      "アプリの運営に必要な情報（名前、ID、パスワードのハッシュ、カード内容）のみを保存し、販売することはありません。詳細はプライバシーポリシーをご覧ください。",
      "マナーを守り、適切にご利用ください。",
      "お小遣いリクエストの作成にはログインが必要です。",
      "正確なQRコードと背景画像/動画を使用してください。",
      "作成されたカードリンクの有効期限は120分間です。",
      "不適切なコンテンツ、政治、宗教に関する使用はお控えください。",
      'サポート・フィードバック / Tiktok: <a href="https://www.tiktok.com/@_yato_003?_r=1&_t=ZS-9AIzhZsSGE3" target="_blank" rel="noopener" style="color: #00f2fe; text-decoration: underline;">@Yato</a>'
    ],
    noticeCloseText: "閉じる",
    authTitle: "アカウント認証",
    modeSelectLabel: "選択してください",
    optLogin: "ログイン",
    optSignup: "新規登録",
    nameLabel: "名前",
    namePlaceholder: "名前を入力",
    numLabel: "ID番号",
    numPlaceholder: "任意のIDを入力",
    passLabel: "パスワード",
    passPlaceholder: "パスワードを入力",
    pass2Label: "パスワード再入力",
    pass2Placeholder: "もう一度入力",
    loginBtn: "ログイン",
    signupBtn: "新規登録",
    logoutBtn: "🚪 ログアウト",
    profileTitle: "プロフィール",
    changeAvatar: "アバター変更",
    changeNickBtn: "名前変更",
    reqPocketBtn: "🧧 お小遣いをおねだり",
    historyBtn: "履歴",
    historyTitle: "リクエスト履歴",
    backHistoryBtn: "⬅ 戻る",
    step3Title: "リクエスト詳細",
    dropdownLabel: "理由を選択",
    customReasonLabel: "自由入力",
    customReasonPlaceholder: "理由を入力",
    customNoteLabel: "メッセージ",
    customNotePlaceholder: "メッセージを入力...",
    musicLabel: "BGM選択",
    bgLabel: "背景画像 / 動画 (9:16、最大15秒)",
    bgBtn: "📸/🎬 背景を選択",
    qrLabel: "QRコード / 決済情報",
    qrBtn: "💳 QR画像を選択",
    backBtn: "⬅ 戻る",
    genCardBtn: "カード作成 ✨",
    step4Title: " お小遣いリクエスト ",
    saveBtn: "💾 QRを保存",
    shareBtn: "📤 共有",
    profileReturnBtn: "🏠 プロフィール",
    modalTitle: "📤 共有",
    modalSub: "リクエストカードとリンクを送信:",
    copyLinkBtn: "📋 リンクをコピー",
    dl1to1Btn: "📥 QRを保存",
    closeBtn: "閉じる",
    alertNote: "❌ メッセージを入力してください。",
    alertBg: "❌ 背景画像または動画(15秒以内)を設定してください。",
    alertQr: "❌ QRコード画像をアップロードしてください。",
    reasons: [
      { val: "သတင်းကျွတ်မုန့်ဖိုး", text: "お祭りのお小遣い" },
      { val: "ရည်းစားနဲ့လျှောက်လည်ရန်", text: "恋人とデート用" },
      { val: "သူငယ်ချင်းတွေနဲ့လျှောက်လည်ရန်", text: "友達と遊ぶ用" },
      { val: "သုံးစရာမရှိတော့လို့", text: "お金が足りない" },
      { val: "အခြား", text: "その他 (手入力)" }
    ],
    msg: {
      fillAll: 'すべての項目を入力してください。',
      idOrNameTaken: '⚠️ このIDまたは名前は既に登録されています。',
      passRule: '⚠ パスワードは6文字以上で、英字を含める必要があります。',
      passMismatch: 'パスワードが一致しません。',
      signupOk: '✅ アカウントを作成しました！',
      loginFill: '名前とパスワードを入力してください。',
      noAccount: 'アカウントが見つかりません。新規登録してください。',
      wrongPass: 'パスワードが違います。',
      dbError: 'サーバーに接続できません。後でもう一度お試しください。',
      nickTitle: '名前変更',
      nickPlaceholder: '新しい名前を入力',
      cancel: 'キャンセル',
      nickOk: '名前を更新しました！',
      nickTaken: 'この名前は既に使用されています。',
      noHistory: '履歴はありません。',
      view: '表示',
      del: '削除',
      expires: '有効期限',
      expired: '期限切れ',
      cardGone: '❌ このカードは期限切れか、既に削除されています。',
      confirmDel: 'この履歴を削除してもよろしいですか？',
      videoLong: '⚠️ 動画は15秒以内にしてください。',
      videoBig: '⚠️ 動画ファイルは15MB以下にしてください。',
      checking: '⏳ 動画を確認中...',
      uploadingBg: '⏳ アップロード中...',
      uploadingQr: '⏳ アップロード中...',
      uploadFail: '❌ アップロードに失敗しました。後でもう一度お試しください。',
      waitUpload: '⏳ アップロード中です。完了までお待ちください。',
      goneTitle: 'カードが見つかりません',
      homeBtn: '🏠 ホームへ',
      noQr: 'QR画像がありません。',
      linkCopied: '✅ リンクをコピーしました！',
      copyFail: '❌ リンクをコピーできませんでした。',
      expireEnd: '⚠️ カードの有効期限（120分）が切れました。データは削除されました。',
      left: '残り'
    }
  },
  ko: {
    pageTitle: "Beta Monpphoe",
    introMsg: "환영합니다! 잠시만 기다려주세요...",
    gateTitle: "🧧 용돈 요청 카드가 도착했어요",
    gateBtn: "🧧 열어보기",
    loaderMsg: "잠시만 기다려주세요...",
    noticeBtnText: "! 공지사항",
    noticeTitle: "📌 이용자 유의사항",
    noticeItems: [
      "앱 운영에 필요한 정보(이름, ID, 비밀번호 해시, 카드 내용)만 저장하며 판매하지 않습니다. 자세한 내용은 개인정보 처리방침을 확인하세요.",
      "건전한 목적으로 올바르게 사용해 주시기 바랍니다.",
      "로그인 후 용돈 요청 카드를 생성할 수 있습니다.",
      "올바른 QR 코드와 배경 이미지/동영상을 사용해 주세요.",
      "생성된 카드 링크의 유효 기간은 120분입니다.",
      "음란물, 정치적, 종교적 콘텐츠 게시를 금지합니다.",
      '후원 및 문의 / Tiktok: <a href="https://www.tiktok.com/@_yato_003?_r=1&_t=ZS-9AIzhZsSGE3" target="_blank" rel="noopener" style="color: #00f2fe; text-decoration: underline;">@Yato</a>'
    ],
    noticeCloseText: "닫기",
    authTitle: "계정 인증",
    modeSelectLabel: "옵션 선택",
    optLogin: "기존 계정 로그인",
    optSignup: "새 계정 만들기",
    nameLabel: "이름",
    namePlaceholder: "이름 입력",
    numLabel: "ID 번호",
    numPlaceholder: "원하는 ID 입력",
    passLabel: "비밀번호",
    passPlaceholder: "비밀번호 입력",
    pass2Label: "비밀번호 확인",
    pass2Placeholder: "비밀번호 재입력",
    loginBtn: "로그인",
    signupBtn: "회원가입",
    logoutBtn: "🚪 로그아웃",
    profileTitle: "프로필",
    changeAvatar: "아바타 변경",
    changeNickBtn: "이름 수정",
    reqPocketBtn: "🧧 용돈 요청하기",
    historyBtn: "히스토리",
    historyTitle: "요청 기록",
    backHistoryBtn: "⬅ 뒤로가기",
    step3Title: "요청 상세 내용",
    dropdownLabel: "사유 선택",
    customReasonLabel: "직접 입력 사유",
    customReasonPlaceholder: "사유를 입력하세요",
    customNoteLabel: "메시지 작성",
    customNotePlaceholder: "메시지를 입력하세요...",
    musicLabel: "음악 선택",
    bgLabel: "배경 이미지 / 동영상 (9:16, 최대 15초)",
    bgBtn: "📸/🎬 배경 선택",
    qrLabel: "QR 코드 / 결제 정보",
    qrBtn: "💳 QR 이미지 선택",
    backBtn: "⬅ 뒤로가기",
    genCardBtn: "카드 생성 ✨",
    step4Title: " 용돈 요청 카드 ",
    saveBtn: "💾 QR 저장",
    shareBtn: "📤 공유",
    profileReturnBtn: "🏠 프로필",
    modalTitle: "📤 공유하기",
    modalSub: "요청 카드와 링크 전송:",
    copyLinkBtn: "📋 링크 복사",
    dl1to1Btn: "📥 QR 저장",
    closeBtn: "닫기",
    alertNote: "❌ 메시지를 입력해 주세요.",
    alertBg: "❌ 배경 이미지 또는 동영상(최대 15초)을 등록해 주세요.",
    alertQr: "❌ QR 코드 이미지를 등록해 주세요.",
    reasons: [
      { val: "သတင်းကျွတ်မုန့်ဖိုး", text: "명절 용돈" },
      { val: "ရည်းစားနဲ့လျှောက်လည်ရန်", text: "연인과 데이트 비용" },
      { val: "သူငယ်ချင်းတွေနဲ့လျှောက်လည်ရန်", text: "친구들과 놀기" },
      { val: "သုံးစရာမရှိတော့လို့", text: "용돈 떨어짐" },
      { val: "အခြား", text: "기타 (직접 입력)" }
    ],
    msg: {
      fillAll: '모든 항목을 입력해 주세요.',
      idOrNameTaken: '⚠️ 이미 등록된 ID 또는 이름입니다.',
      passRule: '⚠ 비밀번호는 6자 이상이며 영문자를 포함해야 합니다.',
      passMismatch: '비밀번호가 일치하지 않습니다.',
      signupOk: '✅ 계정이 생성되었습니다!',
      loginFill: '이름과 비밀번호를 입력해 주세요.',
      noAccount: '계정을 찾을 수 없습니다. 회원가입을 해주세요.',
      wrongPass: '비밀번호가 올바르지 않습니다.',
      dbError: '서버에 연결할 수 없습니다. 나중에 다시 시도해 주세요.',
      nickTitle: '이름 변경',
      nickPlaceholder: '새 이름 입력',
      cancel: '취소',
      nickOk: '이름이 변경되었습니다!',
      nickTaken: '이미 사용 중인 이름입니다.',
      noHistory: '기록이 없습니다.',
      view: '보기',
      del: '삭제',
      expires: '만료까지',
      expired: '만료됨',
      cardGone: '❌ 만료되었거나 삭제된 카드입니다.',
      confirmDel: '이 기록을 삭제하시겠습니까?',
      videoLong: '⚠️ 동영상은 15초를 초과할 수 없습니다.',
      videoBig: '⚠️ 동영상 파일은 15MB를 초과할 수 없습니다.',
      checking: '⏳ 동영상 확인 중...',
      uploadingBg: '⏳ 업로드 중...',
      uploadingQr: '⏳ 업로드 중...',
      uploadFail: '❌ 업로드에 실패했습니다. 나중에 다시 시도해 주세요.',
      waitUpload: '⏳ 업로드 중입니다. 완료될 때까지 기다려 주세요.',
      goneTitle: '카드를 찾을 수 없음',
      homeBtn: '🏠 홈으로',
      noQr: 'QR 이미지가 없습니다.',
      linkCopied: '✅ 링크가 복사되었습니다!',
      copyFail: '❌ 링크를 복사하지 못했습니다.',
      expireEnd: '⚠️ 카드의 유효 기간(120분)이 만료되어 데이터가 삭제되었습니다.',
      left: '남음'
    }
  },
  th: {
    pageTitle: "Beta Monpphoe",
    introMsg: "ยินดีต้อนรับ กรุณารอสักครู่...",
    gateTitle: "🧧 มีการ์ดขอค่าขนมส่งถึงคุณ",
    gateBtn: "🧧 กดเพื่อเปิดดู",
    loaderMsg: "กรุณารอสักครู่...",
    noticeBtnText: "! ข้อแนะนำ",
    noticeTitle: "📌 ข้อตกลงการใช้งาน",
    noticeItems: [
      "เราจัดเก็บเฉพาะข้อมูลที่จำเป็นต่อการทำงานของแอป (ชื่อ, ID, แฮชรหัสผ่าน, เนื้อหาการ์ด) และไม่ขายข้อมูล ดูรายละเอียดในนโยบายความเป็นส่วนตัว",
      "กรุณาใช้งานอย่างเหมาะสมและสร้างสรรค์",
      "ต้องเข้าสู่ระบบก่อนจึงจะสามารถสร้างการขอค่าขนมได้",
      "กรุณาใช้ QR Code และรูป/วิดีโอพื้นหลังที่ถูกต้อง",
      "ลิงก์การ์ดที่สร้างจะมีอายุใช้งานเพียง 120 นาทีเท่านั้น",
      "งดใช้รูป/วิดีโออนาจาร การเมือง หรือเรื่องศาสนา",
      'ให้ค่าขนมผู้สร้าง / ข้อเสนอแนะ Tiktok: <a href="https://www.tiktok.com/@_yato_003?_r=1&_t=ZS-9AIzhZsSGE3" target="_blank" rel="noopener" style="color: #00f2fe; text-decoration: underline;">@Yato</a>'
    ],
    noticeCloseText: "ปิด",
    authTitle: "เข้าสู่ระบบ / ลงทะเบียน",
    modeSelectLabel: "เลือกตัวเลือก",
    optLogin: "เข้าสู่ระบบ",
    optSignup: "สมัครบัญชีใหม่",
    nameLabel: "ชื่อ",
    namePlaceholder: "กรอกชื่อของคุณ",
    numLabel: "หมายเลข ID",
    numPlaceholder: "กรอก ID ตามต้องการ",
    passLabel: "รหัสผ่าน",
    passPlaceholder: "กรอกรหัสผ่าน",
    pass2Label: "ยืนยันรหัสผ่าน",
    pass2Placeholder: "กรอกรหัสผ่านอีกครั้ง",
    loginBtn: "เข้าสู่ระบบ",
    signupBtn: "สมัครสมาชิก",
    logoutBtn: "🚪 ออกจากระบบ",
    profileTitle: "ข้อมูลส่วนตัว",
    changeAvatar: "เปลี่ยนรูปโปรไฟล์",
    changeNickBtn: "แก้ไขชื่อ",
    reqPocketBtn: "🧧 ขอค่าขนม",
    historyBtn: "ประวัติ",
    historyTitle: "ประวัติการขอ",
    backHistoryBtn: "⬅ ย้อนกลับ",
    step3Title: "รายละเอียดการขอค่าขนม",
    dropdownLabel: "เลือกเหตุผล",
    customReasonLabel: "ระบุเหตุผลเอง",
    customReasonPlaceholder: "กรอกเหตุผลของคุณ",
    customNoteLabel: "เขียนข้อความ",
    customNotePlaceholder: "พิมพ์ข้อความที่นี่...",
    musicLabel: "เลือกเพลง",
    bgLabel: "รูป / วิดีโอพื้นหลัง (9:16, สูงสุด 15 วินาที)",
    bgBtn: "📸/🎬 เลือกรูปหรือวิดีโอ",
    qrLabel: "QR Code / ข้อมูลการชำระเงิน",
    qrBtn: "💳 เลือกรูป QR Code",
    backBtn: "⬅ ย้อนกลับ",
    genCardBtn: "สร้างการ์ด ✨",
    step4Title: " การ์ดขอค่าขนม ",
    saveBtn: "💾 บันทึก QR",
    shareBtn: "📤 แชร์",
    profileReturnBtn: "🏠 โปรไฟล์",
    modalTitle: "📤 แชร์ลิงก์",
    modalSub: "ส่งการ์ดขอค่าขนมและลิงก์ไปยัง:",
    copyLinkBtn: "📋 คัดลอกลิงก์",
    dl1to1Btn: "📥 บันทึก QR",
    closeBtn: "ปิด",
    alertNote: "❌ กรุณากรอกข้อความ (Note)",
    alertBg: "❌ กรุณาใส่รูปหรือวิดีโอพื้นหลัง (ไม่เกิน 15 วินาที)",
    alertQr: "❌ กรุณาใส่รูป QR Code",
    reasons: [
      { val: "သတင်းကျွတ်မုန့်ဖိုး", text: "ค่าขนมเทศกาล" },
      { val: "ရည်းစားနဲ့လျှောက်လည်ရန်", text: "ไปเที่ยวกับแฟน" },
      { val: "သူငယ်ချင်းတွေနဲ့လျှောက်လည်ရန်", text: "ไปเที่ยวกับเพื่อน" },
      { val: "သုံးစရာမရှိတော့လို့", text: "เงินหมดแล้ว" },
      { val: "အခြား", text: "อื่นๆ (พิมพ์เอง)" }
    ],
    msg: {
      fillAll: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
      idOrNameTaken: '⚠️ ID หรือชื่อนี้ถูกใช้งานแล้ว',
      passRule: '⚠ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษรและมีตัวอักษรภาษาอังกฤษ',
      passMismatch: 'รหัสผ่านไม่ตรงกัน',
      signupOk: '✅ สร้างบัญชีสำเร็จ!',
      loginFill: 'กรุณากรอกชื่อและรหัสผ่าน',
      noAccount: 'ไม่พบบัญชี กรุณาสมัครสมาชิก',
      wrongPass: 'รหัสผ่านไม่ถูกต้อง',
      dbError: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่ภายหลัง',
      nickTitle: 'แก้ไขชื่อ',
      nickPlaceholder: 'กรอกชื่อใหม่',
      cancel: 'ยกเลิก',
      nickOk: 'อัปเดตชื่อเรียบร้อยแล้ว!',
      nickTaken: 'ชื่อนี้ถูกใช้งานแล้ว',
      noHistory: 'ยังไม่มีประวัติ',
      view: 'ดู',
      del: 'ลบ',
      expires: 'หมดอายุใน',
      expired: 'หมดอายุแล้ว',
      cardGone: '❌ การ์ดนี้หมดอายุหรือถูกลบแล้ว',
      confirmDel: 'ต้องการลบรายการนี้ใช่หรือไม่?',
      videoLong: '⚠️ วิดีโอต้องยาวไม่เกิน 15 วินาที',
      videoBig: '⚠️ ไฟล์วิดีโอต้องมีขนาดไม่เกิน 15MB',
      checking: '⏳ กำลังตรวจสอบวิดีโอ...',
      uploadingBg: '⏳ กำลังอัปโหลด...',
      uploadingQr: '⏳ กำลังอัปโหลด...',
      uploadFail: '❌ อัปโหลดไม่สำเร็จ กรุณาลองใหม่ภายหลัง',
      waitUpload: '⏳ กำลังอัปโหลดอยู่ กรุณารอให้เสร็จก่อน',
      goneTitle: 'ไม่พบการ์ด',
      homeBtn: '🏠 กลับหน้าแรก',
      noQr: 'ยังไม่ได้ใส่รูป QR',
      linkCopied: '✅ คัดลอกลิงก์แล้ว!',
      copyFail: '❌ ไม่สามารถคัดลอกลิงก์ได้',
      expireEnd: '⚠️ การ์ดหมดอายุ (120 นาที) ข้อมูลถูกลบเรียบร้อยแล้ว',
      left: 'เหลือ'
    }
  },
  zh: {
    pageTitle: "Beta Monpphoe",
    introMsg: "欢迎！请稍候...",
    gateTitle: "🧧 您收到一张零花钱请求卡",
    gateBtn: "🧧 点击打开",
    loaderMsg: "请稍候...",
    noticeBtnText: "! 注意事项",
    noticeTitle: "📌 用户须知",
    noticeItems: [
      "我们仅存储运行应用所必需的信息（昵称、ID、密码哈希、卡片内容），并且不会出售。详情请见隐私政策。",
      "请保持善意并合规合理地使用本应用。",
      "只有在登录后才能创建零花钱请求卡片。",
      "请上传正确的 QR Code 收款码和背景图片/视频。",
      "生成的卡片链接有效期仅为 120 分钟。",
      "禁止发布色情低俗、政治、宗教等不当内容。",
      '给创作者打赏 / 提建议 Tiktok: <a href="https://www.tiktok.com/@_yato_003?_r=1&_t=ZS-9AIzhZsSGE3" target="_blank" rel="noopener" style="color: #00f2fe; text-decoration: underline;">@Yato</a>'
    ],
    noticeCloseText: "关闭",
    authTitle: "账号登录",
    modeSelectLabel: "选择模式",
    optLogin: "登录已有账号",
    optSignup: "注册新账号",
    nameLabel: "姓名",
    namePlaceholder: "请输入姓名",
    numLabel: "ID 编号",
    numPlaceholder: "可输入自定义 ID",
    passLabel: "密码",
    passPlaceholder: "请输入密码",
    pass2Label: "确认密码",
    pass2Placeholder: "再次输入密码",
    loginBtn: "登录",
    signupBtn: "注册",
    logoutBtn: "🚪 退出登录",
    profileTitle: "个人资料",
    changeAvatar: "更换头像",
    changeNickBtn: "修改名字",
    reqPocketBtn: "🧧 讨要零花钱",
    historyBtn: "历史记录",
    historyTitle: "请求记录",
    backHistoryBtn: "⬅ 返回",
    step3Title: "请求详细内容",
    dropdownLabel: "选择事由",
    customReasonLabel: "自定义事由",
    customReasonPlaceholder: "输入事由",
    customNoteLabel: "留言内容",
    customNotePlaceholder: "在此输入留言...",
    musicLabel: "选择背景音乐",
    bgLabel: "背景图片 / 视频 (9:16，最长15秒)",
    bgBtn: "📸/🎬 选择背景图片或视频",
    qrLabel: "QR Code / 收款码",
    qrBtn: "💳 选择 QR Code 图片",
    backBtn: "⬅ 返回",
    genCardBtn: "生成卡片 ✨",
    step4Title: " 零花钱请求卡 ",
    saveBtn: "💾 保存 QR",
    shareBtn: "📤 分享",
    profileReturnBtn: "🏠 主页",
    modalTitle: "📤 分享链接",
    modalSub: "发送您的请求卡和链接至：",
    copyLinkBtn: "📋 复制链接",
    dl1to1Btn: "📥 保存 QR",
    closeBtn: "关闭",
    alertNote: "❌ 请填写留言内容。",
    alertBg: "❌ 请上传背景图片或视频（不超过15秒）。",
    alertQr: "❌ 请上传 QR Code 收款码图片。",
    reasons: [
      { val: "သတင်းကျွတ်မုန့်ဖိုး", text: "节日零花钱" },
      { val: "ရည်းစားနဲ့လျှောက်လည်ရန်", text: "和对象约会" },
      { val: "သူငယ်ချင်းတွေနဲ့လျှောက်လည်ရန်", text: "和朋友聚会" },
      { val: "သုံးစရာမရှိတော့လို့", text: "钱包瘪了" },
      { val: "အခြား", text: "其他（自定义）" }
    ],
    msg: {
      fillAll: '请填写所有字段。',
      idOrNameTaken: '⚠️ 该 ID 或姓名已被注册。',
      passRule: '⚠ 密码至少 6 位，且必须包含英文字母。',
      passMismatch: '两次输入的密码不一致。',
      signupOk: '✅ 账号创建成功！',
      loginFill: '请输入姓名和密码。',
      noAccount: '未找到账号，请先注册。',
      wrongPass: '密码错误。',
      dbError: '无法连接服务器，请稍后重试。',
      nickTitle: '修改名字',
      nickPlaceholder: '输入新名字',
      cancel: '取消',
      nickOk: '名字修改成功！',
      nickTaken: '该名字已被使用。',
      noHistory: '暂无记录。',
      view: '查看',
      del: '删除',
      expires: '剩余',
      expired: '已过期',
      cardGone: '❌ 该卡片已过期或已被删除。',
      confirmDel: '确定要删除这条记录吗？',
      videoLong: '⚠️ 视频时长不能超过 15 秒。',
      videoBig: '⚠️ 视频文件不能超过 15MB。',
      checking: '⏳ 正在检查视频...',
      uploadingBg: '⏳ 上传中...',
      uploadingQr: '⏳ 上传中...',
      uploadFail: '❌ 上传失败，请稍后重试。',
      waitUpload: '⏳ 仍在上传中，请等待完成。',
      goneTitle: '找不到卡片',
      homeBtn: '🏠 返回首页',
      noQr: '尚未上传 QR 图片。',
      linkCopied: '✅ 链接已复制！',
      copyFail: '❌ 无法复制链接。',
      expireEnd: '⚠️ 卡片已过期（120分钟），数据已自动清理。',
      left: '剩余'
    }
  }
};

function t() {
  return i18n[currentLang] || i18n.my;
}

// ==========================================
// Injected CSS
// ==========================================
const cardStyleInjected = document.createElement('style');
cardStyleInjected.textContent = `
  .preview-eq-bars, #audioPreviewGroup .preview-eq-bars { display: none !important; }

  .mini-eq-container {
    display: inline-flex; align-items: flex-end; gap: 2.5px; height: 14px;
    margin-left: auto; padding-right: 6px; vertical-align: middle;
  }
  .mini-eq-bar { width: 3px; background: #00f2fe; border-radius: 2px; box-shadow: 0 0 6px #00f2fe; animation: eqJump 0.8s ease-in-out infinite alternate; }
  .mini-eq-bar:nth-child(1) { height: 35%; animation-delay: 0.1s; }
  .mini-eq-bar:nth-child(2) { height: 100%; animation-delay: 0.3s; }
  .mini-eq-bar:nth-child(3) { height: 60%; animation-delay: 0.2s; }
  .mini-eq-bar:nth-child(4) { height: 85%; animation-delay: 0.4s; }
  @keyframes eqJump { 0% { height: 20%; opacity: 0.5; } 100% { height: 100%; opacity: 1; } }

  .custom-select-wrapper, #musicCustomSelect, #reasonCustomSelect {
    position: relative !important; display: flex !important; flex-direction: column !important;
    width: 100% !important; box-sizing: border-box !important; margin-bottom: 6px !important;
  }

  #musicCustomSelect .custom-select-trigger, .custom-select-trigger {
    width: 100% !important; box-sizing: border-box !important; display: flex !important;
    align-items: center !important; justify-content: space-between !important; cursor: pointer !important;
  }

  .custom-options, #musicCustomOptions, #reasonDropdown {
    display: none !important; position: absolute !important; top: 100% !important; left: 0 !important;
    width: 100% !important; max-height: 180px !important; overflow-y: auto !important; z-index: 99999 !important;
    background: rgba(15, 23, 42, 0.98) !important; border: 1.5px solid rgba(0, 242, 254, 0.5) !important;
    border-radius: 12px !important; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8) !important;
    backdrop-filter: blur(10px) !important; margin-top: 4px !important; box-sizing: border-box !important;
    opacity: 1 !important;
  }

  .custom-select-wrapper.open .custom-options,
  #musicCustomSelect.open #musicCustomOptions,
  #reasonCustomSelect.open #reasonDropdown { display: block !important; }

  .custom-option {
    padding: 10px 14px !important; cursor: pointer !important; font-size: 13px !important; color: #fff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important; transition: background 0.2s ease !important;
  }
  .custom-option:hover { background: rgba(0, 242, 254, 0.15) !important; color: #00f2fe !important; }

  #audioPreviewGroup {
    width: 100% !important; box-sizing: border-box !important; display: flex !important;
    margin-bottom: 6px !important; margin-top: 0px !important;
  }
  #audioPreviewPlayer { width: 100% !important; box-sizing: border-box !important; }
  #lbl_bgLabel { margin-top: 2px !important; }

  #outReason {
    margin-bottom: 12px !important; display: block !important; font-weight: 700 !important; color: #ffffff !important;
    font-size: 16px !important; text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8) !important;
    word-break: break-word;
  }
  #outNote {
    margin-top: 6px !important; display: block !important; font-weight: 600 !important; color: #ffffff !important;
    font-size: 13px !important; line-height: 1.4 !important;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8) !important;
    word-break: break-word; white-space: pre-wrap;
  }

  #exportCard {
    position: relative !important; overflow: hidden !important;
    box-shadow: none !important;
    animation: none !important;
    aspect-ratio: 9 / 16 !important;
    width: min(100%, calc((100vh - 340px) * 0.5625)) !important;
    width: min(100%, calc((100dvh - 340px) * 0.5625)) !important;
    max-width: 320px !important; min-width: 170px !important;
    margin: 0 auto 10px auto !important; border-radius: 0 !important; border: none !important;
    background: transparent !important; display: flex !important; flex-direction: column !important;
    justify-content: space-between !important; padding: 14px !important;
  }

  #cardBgImg, #cardBgVideo {
    position: absolute !important; inset: 0 !important; top: 0 !important; left: 0 !important;
    width: 100% !important; height: 100% !important; object-fit: cover !important; z-index: 0 !important;
    pointer-events: none !important; background: transparent !important; filter: none !important;
  }

  #cardFeather {
    --feather-h: 30%;
    position: absolute; left: 0; right: 0; bottom: 0; height: var(--feather-h);
    z-index: 1; pointer-events: none;
    background: linear-gradient(to top,
      rgba(5, 3, 15, 0.96) 0%, rgba(5, 3, 15, 0.84) 25%,
      rgba(5, 3, 15, 0.45) 55%, rgba(5, 3, 15, 0.12) 82%, rgba(5, 3, 15, 0) 100%);
  }
  .app-card > .step { position: relative; z-index: 2; }
  .app-card:not(.no-scroll) > #cardBgImg,
  .app-card:not(.no-scroll) > #cardBgVideo,
  .app-card:not(.no-scroll) > #cardFeather,
  .app-card.bg-hidden > #cardBgImg,
  .app-card.bg-hidden > #cardBgVideo,
  .app-card.bg-hidden > #cardFeather { visibility: hidden !important; }

  #exportCard > *:not(#cardBgImg):not(#cardBgVideo):not(#outSender):not(#emojiOverlay) { position: relative !important; z-index: 5 !important; }

  #outSender, .sender-tag {
    position: absolute !important; top: 6px !important; right: 6px !important; left: auto !important;
    width: auto !important; max-width: 80% !important; display: inline-block !important; padding: 3px 9px !important;
    font-size: 10.5px !important; font-weight: 700 !important; background: var(--primary, #ff0055) !important;
    color: #ffffff !important; border-radius: 6px !important; box-shadow: 0 1px 4px rgba(255, 0, 85, 0.35) !important;
    z-index: 10 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;
    width: fit-content !important; height: auto !important; line-height: 1.35 !important;
  }

  #lbl_qrHint { display: none !important; }

  #cardQrImg { display: block !important; width: 100% !important; height: 100% !important; object-fit: contain !important; }

  .qr-img-wrapper, #qrWrapper {
    display: none; width: 100% !important; max-width: 100px !important; aspect-ratio: 1 / 1 !important;
    margin: 0 auto !important; border-radius: 10px !important; overflow: hidden !important;
    border: 2px solid rgba(255, 255, 255, 0.9) !important; background: rgba(255, 255, 255, 0.95) !important; z-index: 5 !important;
    position: relative !important; animation: none !important; box-shadow: none !important;
  }
  .qr-img-wrapper.visible, #qrWrapper.visible { display: block !important; }

  .top-card-timer {
    position: fixed; top: calc(58px + env(safe-area-inset-top, 0px)); left: 50%; transform: translateX(-50%); z-index: 100;
    padding: 6px 14px; font-size: 13px; font-weight: 700; display: none; align-items: center; gap: 6px;
    background: rgba(10, 12, 28, 0.9); border: 1.5px solid rgba(0, 242, 254, 0.5); border-radius: 12px; color: #fff;
  }

  .app-card.no-scroll {
    overflow: hidden !important; max-height: none !important; scrollbar-width: none;
    background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
  }
  .app-card.no-scroll::-webkit-scrollbar { display: none; }
  body.lock-scroll { overflow: hidden !important; height: 100vh; height: 100dvh; }

  #cardAudioGroup { background: transparent !important; box-shadow: none !important; }

  /* ===== Open gate countdown ===== */
  .gate-box { transition: opacity 0.35s ease, transform 0.35s ease; }
  .gate-box.leaving { animation: gateOut 0.35s ease forwards !important; pointer-events: none; }
  @keyframes gateOut { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.8) translateY(-20px); } }
  #gateCountdown {
    position: absolute; inset: 0; display: none; align-items: center; justify-content: center;
    flex-direction: column; pointer-events: none;
  }
  #gateCountdown.show { display: flex; }
  #gateCountdown .num {
    font-size: 130px; font-weight: 700; line-height: 1; color: #00f2fe;
    text-shadow: 0 0 25px rgba(0, 242, 254, 0.8), 0 0 60px rgba(255, 0, 85, 0.6);
  }
  #gateCountdown .num.pop { animation: countPop 0.85s cubic-bezier(0.2, 0.8, 0.3, 1) both; }
  #gateCountdown .ring {
    position: absolute; width: 150px; height: 150px; border-radius: 50%;
    border: 3px solid rgba(0, 242, 254, 0.7); opacity: 0;
  }
  #gateCountdown .ring.pop { animation: ringPulse 0.85s ease-out both; }
  @keyframes countPop {
    0% { transform: scale(2.4); opacity: 0; }
    25% { transform: scale(1); opacity: 1; }
    75% { transform: scale(0.95); opacity: 1; }
    100% { transform: scale(0.6); opacity: 0; }
  }
  @keyframes ringPulse {
    0% { transform: scale(0.4); opacity: 0.9; }
    100% { transform: scale(2.6); opacity: 0; }
  }

  /* ===== Card reveal animation ===== */
  #exportCard.card-hidden { visibility: hidden !important; }
  #exportCard.card-reveal { animation: cardReveal 1.1s cubic-bezier(0.2, 0.9, 0.3, 1.1) both !important; }
  @keyframes cardReveal {
    0% { opacity: 0; transform: perspective(900px) rotateY(-100deg) scale(0.4) translateY(50px); filter: blur(10px) brightness(2); }
    55% { opacity: 1; transform: perspective(900px) rotateY(10deg) scale(1.07) translateY(0); filter: blur(0) brightness(1.4); }
    80% { transform: perspective(900px) rotateY(-3deg) scale(0.99); filter: brightness(1.1); }
    100% { opacity: 1; transform: perspective(900px) rotateY(0) scale(1); filter: none; }
  }
  .sparkle-piece {
    position: absolute; top: 0; will-change: transform, opacity;
    animation-name: sparkleFall; animation-timing-function: ease-in; animation-fill-mode: both;
  }
  @keyframes sparkleFall {
    0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateY(108vh) rotate(420deg); opacity: 0.9; }
  }

  /* ===== Step 4 layout: From tag in the corner, title under it, text + QR in one centered column ===== */
  #step4 > h2 {
    margin: 34px 0 10px; font-size: 18px; color: #e8fdff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 14px rgba(0, 242, 254, 0.55);
  }
  #outSender, .sender-tag { top: 14px !important; right: 14px !important; }
  #outSender:empty { display: none !important; }
  .app-card:not(.no-scroll) > #outSender,
  .app-card.bg-hidden > #outSender { visibility: hidden !important; }
  .app-card.no-scroll::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 30%;
    z-index: 1; pointer-events: none;
    background: linear-gradient(to bottom, rgba(5, 3, 15, 0.62), rgba(5, 3, 15, 0));
  }
  .app-card.bg-hidden::before { display: none; }

  #exportCard {
    width: 100% !important; max-width: none !important; min-width: 0 !important;
    aspect-ratio: auto !important; padding: 0 !important;
    height: min(calc(100vh - 340px), 569px) !important;
    height: min(calc(100dvh - 340px), 569px) !important;
    min-height: 240px !important;
    justify-content: flex-end !important;
  }
  .card-header-content { margin: 0 auto 12px !important; padding: 0 !important; width: 100% !important; text-align: center !important; }
  #outReason { font-size: 18px !important; margin-bottom: 6px !important; }
  #outNote { font-size: 14px !important; margin-top: 0 !important; max-height: 8.4em; overflow: hidden; }
  .card-qr-overlay { padding: 0 !important; }
  .qr-img-wrapper, #qrWrapper { max-width: 120px !important; }
  #cardAudioGroup { margin: 0 !important; }

  /* ===== Global UI consistency: one control height (44px), equal columns, even spacing ===== */
  .app-card .btn:not(.btn-mini), .app-card .file-btn, .app-card .custom-select-trigger {
    min-height: 44px; box-sizing: border-box; display: flex; align-items: center;
    justify-content: center; line-height: 1.3;
  }
  .app-card .custom-select-trigger { justify-content: space-between; }
  .app-card input[type="text"], .app-card input[type="password"] { height: 44px; box-sizing: border-box; }

  #step2 .dashboard-actions { gap: 10px; }
  #step2 .dashboard-actions .btn { padding: 0 14px !important; font-size: 13.5px !important; }
  #step2 .profile-action-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 6px 0 14px; align-items: stretch;
  }
  #step2 .profile-action-row > * {
    display: flex !important; align-items: center; justify-content: center; flex: none;
    width: 100%; height: 44px; min-height: 44px; margin: 0; padding: 0 8px !important;
    box-sizing: border-box; font-size: 12.5px !important; line-height: 1.25;
    text-align: center; white-space: normal;
  }
  #btn_deleteAccount { min-height: 40px !important; margin-top: 6px; background: transparent !important; }

  /* ===== Top bar: Notice and Language share the same height/font; language is a small dropdown ===== */
  .notice-btn, #langTrigger {
    height: 38px; box-sizing: border-box; display: inline-flex; align-items: center; gap: 8px;
    padding: 0 14px; font-size: 13px; font-weight: 700; line-height: 1; border-radius: 12px;
  }
  #langTrigger {
    border: 1.5px solid rgba(0, 242, 254, 0.6); background: rgba(10, 12, 28, 0.95); color: #fff;
    cursor: pointer; box-shadow: 0 0 10px var(--accent-glow); outline: none;
  }
  #langTrigger .lang-arrow { color: var(--accent); font-size: 12px; transition: transform 0.2s ease; }
  #langDD.open #langTrigger .lang-arrow { transform: rotate(180deg); }
  #langList {
    display: none; position: absolute; top: calc(100% + 6px); right: 0; min-width: 100%; width: max-content;
    z-index: 300; padding: 4px; background: rgba(15, 23, 42, 0.98);
    border: 1.5px solid rgba(0, 242, 254, 0.5); border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px);
  }
  #langDD.open #langList { display: block; }
  .lang-item {
    display: flex; align-items: center; height: 36px; padding: 0 12px; border-radius: 8px;
    font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; white-space: nowrap;
  }
  .lang-item:hover, .lang-item.active { background: rgba(0, 242, 254, 0.15); color: var(--accent); }

  /* QR: square frame, image stretched to fill it */
  #cardQrImg { object-fit: fill !important; }

  /* ===== Timer: plain text inside the card frame, stuck to the top ===== */
  .top-card-timer {
    position: absolute !important; top: 16px !important; left: 50% !important; transform: translateX(-50%) !important;
    padding: 0 !important; background: none !important; border: none !important; border-radius: 0 !important;
    box-shadow: none !important; z-index: 10 !important; white-space: nowrap;
    font-size: 12px !important; font-weight: 600 !important; line-height: 1.35 !important; color: #ffffff !important;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.95), 0 0 8px rgba(0, 0, 0, 0.8);
  }

  /* ===== Title (reason) + note: centered together in the middle of the card ===== */
  #outReason { display: none !important; }
  #exportCard {
    display: grid !important; grid-template-columns: 100%; grid-template-rows: 1fr 1fr;
    justify-content: stretch !important; align-items: stretch;
    height: min(calc(100vh - 272px), 637px) !important;
    height: min(calc(100dvh - 272px), 637px) !important;
  }
  .card-header-content { grid-area: 1 / 1 / 3 / 2; align-self: center; margin: 0 auto !important; }
  .card-qr-overlay { grid-area: 2 / 1 / 3 / 2; align-self: end; }
  .card-header-content > #lbl_step4Title {
    display: block; width: fit-content; max-width: 90%; margin: 0 auto 10px; padding: 0;
    font-size: 17px; font-weight: 700; line-height: 1.4; color: #ffffff; text-align: center;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8); word-break: break-word;
  }

  /* ===== Volume control (card owner only): plain white speaker in the top-left corner ===== */
  #volBtn {
    position: absolute; top: 10px; left: 14px; right: auto; z-index: 12;
    width: 28px; height: 28px; padding: 0; margin: 0; display: none; align-items: center; justify-content: center;
    background: none; border: none; box-shadow: none; cursor: pointer; line-height: 0;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.85)); -webkit-tap-highlight-color: transparent;
  }
  #volBtn svg { display: block; width: 22px; height: 22px; }
  #volPanel {
    position: absolute; top: 44px; left: 14px; right: auto; z-index: 12;
    display: none; flex-direction: column; align-items: stretch; gap: 4px; padding: 0;
    background: none; border: none; box-shadow: none;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.9));
  }
  #volPanel.open { display: flex; }
  #volPanel label { display: flex; align-items: center; gap: 8px; color: #ffffff; font-size: 14px; margin: 0; }
  #volPanel input[type=range] { width: 110px; height: 4px; margin: 0; padding: 0; accent-color: #00f2fe; }
  #volPanel .vol-rows { display: flex; flex-direction: column; gap: 8px; }
  #volSave {
    display: inline-flex; align-items: center; align-self: flex-end; margin: 0; padding: 4px 0; background: none; border: none;
    box-shadow: none; color: #ffffff; font-size: 13px; font-weight: 700; cursor: pointer; min-height: 0;
    white-space: nowrap; -webkit-tap-highlight-color: transparent;
  }
  #volSave:disabled { opacity: 0.5; }

  /* ===== Button row order: Save QR, Profile, Share ===== */
  .btn-row-mini > #btn_saveQr { order: 1; }
  .btn-row-mini > #btn_profileReturn { order: 2; }
  .btn-row-mini > #btn_share { order: 3; }
`;
document.head.appendChild(cardStyleInjected);

// ==========================================
// Text Localization
// ==========================================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setPlaceholder(id, value) {
  const el = document.getElementById(id);
  if (el) el.placeholder = value;
}

function updateTexts() {
  const d = t();

  setText('page_title', d.pageTitle);
  document.title = d.pageTitle;
  setText('introMsg', d.introMsg);
  setText('lbl_loaderMsg', d.loaderMsg);
  setText('gateTitle', d.gateTitle);
  setText('gateBtn', d.gateBtn);

  setText('btn_notice', d.noticeBtnText);
  setText('lbl_noticeTitle', d.noticeTitle);
  const noticeListEl = document.getElementById('lbl_noticeList');
  if (noticeListEl && d.noticeItems) {
    noticeListEl.innerHTML = '';
    d.noticeItems.forEach((itemText, index) => {
      const li = document.createElement('li');
      if (index === d.noticeItems.length - 1) li.style.marginTop = '6px';
      li.innerHTML = itemText;
      noticeListEl.appendChild(li);
    });
  }
  setText('btn_noticeClose', d.noticeCloseText);

  setText('lbl_authTitle', d.authTitle);
  setText('lbl_modeSelect', d.modeSelectLabel);

  const authModeSelect = document.getElementById('authModeSelect');
  const currentAuthMode = authModeSelect ? authModeSelect.value : 'login';
  setText('authModeTriggerText', currentAuthMode === 'signup' ? d.optSignup : d.optLogin);

  const optLoginEl = document.getElementById('optLoginText');
  if (optLoginEl) {
    optLoginEl.textContent = d.optLogin;
    optLoginEl.onclick = () => selectAuthModeOption('login', t().optLogin);
  }
  const optSignupEl = document.getElementById('optSignupText');
  if (optSignupEl) {
    optSignupEl.textContent = d.optSignup;
    optSignupEl.onclick = () => selectAuthModeOption('signup', t().optSignup);
  }

  setText('lbl_loginName', d.nameLabel);
  setPlaceholder('loginName', d.namePlaceholder);
  setText('lbl_loginPass', d.passLabel);
  setPlaceholder('loginPass', d.passPlaceholder);
  setText('btn_login', d.loginBtn);

  setText('lbl_signupName', d.nameLabel);
  setPlaceholder('signupName', d.namePlaceholder);
  setText('lbl_signupNum', d.numLabel);
  setPlaceholder('signupNum', d.numPlaceholder);
  setText('lbl_signupPass1', d.passLabel);
  setPlaceholder('signupPass1', d.passPlaceholder);
  setText('lbl_signupPass2', d.pass2Label);
  setPlaceholder('signupPass2', d.pass2Placeholder);
  setText('btn_signup', d.signupBtn);

  setText('lbl_profileTitle', d.profileTitle);
  setText('lbl_changeAvatar', '📷 ' + d.changeAvatar);
  setText('lbl_changeNick', '✏ ' + d.changeNickBtn);
  setText('lbl_reqPocketBtn', d.reqPocketBtn);
  setText('lbl_historyBtn', d.historyBtn);
  setText('btn_logout', d.logoutBtn);
  setText('lbl_historyTitle', d.historyTitle);
  setText('btn_backHistory', d.backHistoryBtn);

  setText('lbl_step3Title', d.step3Title);
  setText('lbl_dropdown', d.dropdownLabel);
  setText('lbl_customReason', d.customReasonLabel);
  setPlaceholder('customReason', d.customReasonPlaceholder);
  setText('lbl_customNote', d.customNoteLabel);
  setPlaceholder('customNote', d.customNotePlaceholder);

  setText('lbl_musicLabel', d.musicLabel);
  setText('lbl_bgLabel', d.bgLabel);
  if (!uploads.bg.file) setText('bgImgLabel', d.bgBtn);
  setText('lbl_qrLabel', d.qrLabel);
  if (!uploads.qr.file) setText('qrImgLabel', d.qrBtn);

  setText('btn_backStep3', d.backBtn);
  setText('btn_genCard', d.genCardBtn);

  syncStep4Title(d);
  setText('btn_saveQr', d.saveBtn);
  setText('btn_share', d.shareBtn);
  setText('btn_profileReturn', d.profileReturnBtn);

  setText('lbl_step6Title', d.msg.goneTitle);
  setText('btn_step6Home', d.msg.homeBtn);

  setText('lbl_modalTitle', d.modalTitle);
  setText('lbl_modalSub', d.modalSub);
  setText('btn_copyLink', d.copyLinkBtn);
  setText('btn_dlQrModal', d.dl1to1Btn);
  setText('btn_closeModal', d.closeBtn);
  updateExtraTexts();
}

function changeLanguage(lang) {
  currentLang = i18n[lang] ? lang : 'my';
  window.currentLang = currentLang;
  updateTexts();
  populateReasonDropdown(currentLang);

  const step5 = document.getElementById('step5');
  if (step5 && step5.classList.contains('active')) renderHistoryList();
}

// ==========================================
// File helpers
// ==========================================
function isVideoFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith('video/')) return true;
  const ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
  return ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'm4v'].includes(ext);
}

function isVideoSource(src) {
  if (!src) return false;
  if (src.startsWith('data:video/')) return true;
  return /\.(mp4|webm|mov|3gp|m4v)(\?|#|$)/i.test(src);
}

function compressFileToDataUrl(file, maxWidth = 900, quality = 0.8) {
  return new Promise((resolve) => {
    if (!file) return resolve('');

    const reader = new FileReader();
    reader.onerror = () => resolve('');

    if (isVideoFile(file)) {
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
      return;
    }

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
    reader.readAsDataURL(file);
  });
}

function getVideoDuration(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);
    let done = false;

    const finish = (value) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      URL.revokeObjectURL(objectUrl);
      resolve(value);
    };

    const timer = setTimeout(() => finish(0), 3000);
    video.onloadedmetadata = () => finish(video.duration);
    video.onerror = () => finish(0);
    video.src = objectUrl;
    video.load();
  });
}

function parseDbTime(value) {
  if (!value) return Date.now();
  if (typeof value === 'number') return value;
  let s = String(value).trim();
  const looksIso = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(s);
  const hasZone = /(Z|[+-]\d{2}(:?\d{2})?)$/i.test(s.replace(/^\d{4}-\d{2}-\d{2}/, ''));
  if (looksIso && !hasZone) s = s.replace(' ', 'T') + 'Z';
  const ms = new Date(s).getTime();
  return isNaN(ms) ? Date.now() : ms;
}

// ==========================================
// Supabase Storage helpers
// ==========================================
function makeMediaPath(folder, blob) {
  const subtype = ((blob.type || '').split('/')[1] || 'bin').replace('jpeg', 'jpg').replace('quicktime', 'mov');
  return `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${subtype}`;
}

function publicMediaUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

function xhrUpload(blob, path, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/${MEDIA_BUCKET}/${path}`);
    xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    xhr.setRequestHeader('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
    xhr.setRequestHeader('Content-Type', blob.type || 'application/octet-stream');

    const start = performance.now();
    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const sec = Math.max((performance.now() - start) / 1000, 0.05);
      onProgress(e.loaded / e.total, (e.loaded * 8) / sec);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const sec = Math.max((performance.now() - start) / 1000, 0.05);
        resolve((blob.size * 8) / sec);
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.onabort = () => reject(new Error('Upload aborted'));
    xhr.send(blob);
  });
}

function formatSpeed(bitsPerSec) {
  if (!isFinite(bitsPerSec) || bitsPerSec <= 0) return '0 Kbps';
  if (bitsPerSec >= 1e6) return (bitsPerSec / 1e6).toFixed(2) + ' Mbps';
  return Math.round(bitsPerSec / 1e3) + ' Kbps';
}

async function uploadMedia(sb, dataUrl, folder) {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const path = makeMediaPath(folder, blob);
    const { error } = await sb.storage.from(MEDIA_BUCKET).upload(path, blob, {
      contentType: blob.type,
      cacheControl: '3600'
    });
    if (error) throw error;
    return sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  } catch (err) {
    console.warn('Storage upload failed, falling back to inline data:', err);
    return dataUrl;
  }
}

function storagePathFromUrl(url) {
  if (!url || url.startsWith('data:')) return null;
  const marker = `/${MEDIA_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.substring(idx + marker.length).split('?')[0]);
}

async function removeMediaFiles(sb, urls) {
  const paths = urls.map(storagePathFromUrl).filter(Boolean);
  if (!paths.length) return;
  try {
    await sb.storage.from(MEDIA_BUCKET).remove(paths);
  } catch (err) {
    console.warn('Storage remove failed:', err);
  }
}

async function deleteCardRecord(cardId) {
  const sb = getSupabase();
  if (!sb || !cardId) return;
  try {
    const { data } = await sb.from('cards').select('bg_image, qr_image').eq('id', cardId).maybeSingle();
    await sb.from('cards').delete().eq('id', cardId);
    if (data) await removeMediaFiles(sb, [data.bg_image, data.qr_image]);
  } catch (err) {
    console.error('Delete card record error:', err);
  }
}

// ==========================================
// ==========================================
async function hashPassword(pass, salt) {
  if (!(window.crypto && window.crypto.subtle)) {
    throw new Error('Secure context (HTTPS) required');
  }
  const data = new TextEncoder().encode(`${salt}:${pass}`);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  return HASH_PREFIX + hex;
}

function escapeLike(value) {
  return value.replace(/[\\%_]/g, (c) => '\\' + c);
}

// ==========================================
// Dropdowns (music / reason / auth)
// ==========================================
function getMiniEqHtml() {
  return `<div class="mini-eq-container"><div class="mini-eq-bar"></div><div class="mini-eq-bar"></div><div class="mini-eq-bar"></div><div class="mini-eq-bar"></div></div>`;
}

function setMusicTrigger(name) {
  const el = document.getElementById('musicTriggerText');
  if (!el) return;
  el.textContent = name + ' ';
  el.insertAdjacentHTML('beforeend', getMiniEqHtml());
}

function populateMusicDropdown() {
  const container = document.getElementById('musicCustomOptions');
  if (!container) return;
  container.innerHTML = '';

  const musicDropdown = document.getElementById('musicDropdown');
  const currentVal = musicDropdown ? musicDropdown.value : '';
  let found = false;

  localMusicList.forEach((song) => {
    const div = document.createElement('div');
    div.className = 'custom-option';
    div.textContent = song.name;
    div.onclick = () => selectMusicOption(song.url, song.name);
    container.appendChild(div);

    if (song.url === currentVal) {
      setMusicTrigger(song.name);
      found = true;
    }
  });

  if (!found && localMusicList.length > 0) {
    setMusicTrigger(localMusicList[0].name);
    if (musicDropdown) musicDropdown.value = localMusicList[0].url;
    savedMusicUrl = localMusicList[0].url;

    const player = document.getElementById('audioPreviewPlayer');
    if (player) {
      player.src = localMusicList[0].url;
      player.loop = true;
    }
  }
}

function selectMusicOption(url, name) {
  setMusicTrigger(name);

  const musicDropdown = document.getElementById('musicDropdown');
  if (musicDropdown) musicDropdown.value = url;

  const musicCustomSelect = document.getElementById('musicCustomSelect');
  if (musicCustomSelect) musicCustomSelect.classList.remove('open');

  savedMusicUrl = url;
  const player = document.getElementById('audioPreviewPlayer');
  if (player) {
    player.src = url;
    player.load();
    player.loop = true;
    player.play().catch((e) => console.log('Auto-play error:', e));
  }
}

function toggleCustomDropdown(wrapperId) {
  document.querySelectorAll('.custom-select-wrapper').forEach((el) => {
    if (el.id !== wrapperId) el.classList.remove('open');
  });
  const wrapper = document.getElementById(wrapperId);
  if (wrapper) wrapper.classList.toggle('open');
}

function toggleCustomReason() {
  const reasonDropdownVal = document.getElementById('reasonDropdownVal');
  const dropdownVal = reasonDropdownVal ? reasonDropdownVal.value : '';
  const customGroup = document.getElementById('customReasonGroup');
  if (customGroup) customGroup.style.display = (dropdownVal === 'အခြား') ? 'block' : 'none';
}

function populateReasonDropdown(lang) {
  const container = document.getElementById('reasonDropdown');
  if (!container) return;
  container.innerHTML = '';

  const reasonsList = (i18n[lang] || i18n.my).reasons;
  reasonsList.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'custom-option';
    div.textContent = item.text;
    div.onclick = () => selectReasonOption(item.val, item.text);
    container.appendChild(div);
  });

  const reasonDropdownVal = document.getElementById('reasonDropdownVal');
  const currentVal = reasonDropdownVal ? reasonDropdownVal.value : '';
  const selected = reasonsList.find((r) => r.val === currentVal) || reasonsList[0];

  if (selected) {
    setText('reasonTriggerText', selected.text);
    if (reasonDropdownVal) reasonDropdownVal.value = selected.val;
  }
  toggleCustomReason();
}

function selectReasonOption(val, text) {
  setText('reasonTriggerText', text);
  const reasonDropdownVal = document.getElementById('reasonDropdownVal');
  if (reasonDropdownVal) reasonDropdownVal.value = val;
  const reasonCustomSelect = document.getElementById('reasonCustomSelect');
  if (reasonCustomSelect) reasonCustomSelect.classList.remove('open');
  toggleCustomReason();
}

function switchAuthMode(mode) {
  const loginSec = document.getElementById('loginFormSection');
  const signupSec = document.getElementById('signupFormSection');
  if (loginSec) loginSec.style.display = (mode === 'login') ? 'block' : 'none';
  if (signupSec) signupSec.style.display = (mode === 'login') ? 'none' : 'block';
}

function selectAuthModeOption(val, text) {
  setText('authModeTriggerText', text);
  const authModeSelect = document.getElementById('authModeSelect');
  if (authModeSelect) authModeSelect.value = val;
  const wrapper = document.getElementById('authModeCustomSelect');
  if (wrapper) wrapper.classList.remove('open');
  switchAuthMode(val);
}

// ==========================================
// Global click handlers
// ==========================================
window.addEventListener('click', function (e) {
  if (!e.target.closest('.custom-select-wrapper')) {
    document.querySelectorAll('.custom-select-wrapper').forEach((el) => el.classList.remove('open'));
  }

  if (e.target === document.getElementById('legalModal')) closeLegalModal();
  if (e.target === document.getElementById('noticeModal')) {
    document.getElementById('noticeModal').style.display = 'none';
  }

  if (!e.target.closest('.history-menu-btn') && !e.target.closest('.history-dropdown-menu')) {
    document.querySelectorAll('.history-dropdown-menu').forEach((el) => {
      el.classList.remove('show');
      el.style.display = 'none';
    });
  }
});

// ==========================================
// Init
// ==========================================
async function fetchCardById(sb, cardId) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { data, error } = await sb.from('cards').select('*').eq('id', cardId).maybeSingle();
      if (!error) return { data: data || null, networkError: false };
      console.warn('Card fetch error:', error);
    } catch (err) {
      console.warn('Card fetch exception:', err);
    }
    await sleep(600);
  }
  return { data: null, networkError: true };
}

const extraI18n = {
  my: { deleteBtn: '🗑 အကောင့်ဖျက်ရန်', deleteConfirm: 'အကောင့်နှင့် ကတ်အားလုံးကို အပြီးဖျက်မည်။ ပြန်ယူ၍ မရပါ။ သေချာပါသလား?', deleteDone: '✅ အကောင့်ကို ဖျက်ပြီးပါပြီ။', reportBtn: '⚠ Report', reportConfirm: 'ဤကတ်ကို မသင့်တော်ဟု Report လုပ်မလား?', reportSent: '✅ Report ပို့ပြီးပါပြီ။ ကျေးဇူးတင်ပါသည်။', reportFail: '❌ Report ပို့၍ မရပါ။ နောက်မှ ပြန်ကြိုးစားပါ။' },
  en: { deleteBtn: '🗑 Delete account', deleteConfirm: 'Your account and all your cards will be permanently deleted. This cannot be undone. Continue?', deleteDone: '✅ Your account has been deleted.', reportBtn: '⚠ Report', reportConfirm: 'Report this card as inappropriate?', reportSent: '✅ Report sent. Thank you.', reportFail: '❌ Could not send the report. Please try again later.' },
  ja: { deleteBtn: '🗑 アカウント削除', deleteConfirm: 'アカウントとすべてのカードが完全に削除されます。元に戻せません。続けますか？', deleteDone: '✅ アカウントを削除しました。', reportBtn: '⚠ 通報', reportConfirm: 'このカードを不適切として通報しますか？', reportSent: '✅ 通報しました。ありがとうございます。', reportFail: '❌ 通報できませんでした。後でもう一度お試しください。' },
  ko: { deleteBtn: '🗑 계정 삭제', deleteConfirm: '계정과 모든 카드가 영구 삭제되며 되돌릴 수 없습니다. 계속하시겠습니까?', deleteDone: '✅ 계정이 삭제되었습니다.', reportBtn: '⚠ 신고', reportConfirm: '이 카드를 부적절한 콘텐츠로 신고하시겠습니까?', reportSent: '✅ 신고가 접수되었습니다. 감사합니다.', reportFail: '❌ 신고를 보내지 못했습니다. 나중에 다시 시도해 주세요.' },
  th: { deleteBtn: '🗑 ลบบัญชี', deleteConfirm: 'บัญชีและการ์ดทั้งหมดจะถูกลบถาวรและกู้คืนไม่ได้ ต้องการดำเนินการต่อหรือไม่?', deleteDone: '✅ ลบบัญชีเรียบร้อยแล้ว', reportBtn: '⚠ รายงาน', reportConfirm: 'รายงานการ์ดนี้ว่าไม่เหมาะสมหรือไม่?', reportSent: '✅ ส่งรายงานแล้ว ขอบคุณ', reportFail: '❌ ส่งรายงานไม่สำเร็จ กรุณาลองใหม่ภายหลัง' },
  zh: { deleteBtn: '🗑 删除账号', deleteConfirm: '账号及所有卡片将被永久删除，无法恢复。确定继续吗？', deleteDone: '✅ 账号已删除。', reportBtn: '⚠ 举报', reportConfirm: '确定举报此卡片内容不当吗？', reportSent: '✅ 举报已提交，谢谢。', reportFail: '❌ 举报提交失败，请稍后重试。' }
};

function ex() {
  return extraI18n[currentLang] || extraI18n.en;
}

function updateExtraTexts() {
  const x = ex();
  setText('btn_deleteAccount', x.deleteBtn);
  setText('btn_report', x.reportBtn);
}

function setupExtras() {
  const head = document.head;
  if (!document.querySelector('link[rel="manifest"]')) {
    const l = document.createElement('link');
    l.rel = 'manifest';
    l.href = '/manifest.json';
    head.appendChild(l);
  }
  if (!document.querySelector('meta[name="theme-color"]')) {
    const m = document.createElement('meta');
    m.name = 'theme-color';
    m.content = '#05030f';
    head.appendChild(m);
  }
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js').catch((e) => console.warn('SW register failed:', e));
  }

  const actions = document.querySelector('#step2 .dashboard-actions');
  if (actions && !document.getElementById('btn_deleteAccount')) {
    const del = document.createElement('button');
    del.type = 'button';
    del.id = 'btn_deleteAccount';
    del.className = 'btn btn-secondary';
    del.style.cssText = 'padding:10px; font-size:13px; color:#ff6b81; border-color:rgba(255,107,129,0.45);';
    del.onclick = deleteAccount;
    actions.appendChild(del);
  }

  const row = document.querySelector('#step4 .btn-row-mini');
  if (row && !document.getElementById('btn_report')) {
    const rep = document.createElement('button');
    rep.type = 'button';
    rep.id = 'btn_report';
    rep.style.cssText = 'display:none; margin:8px auto 0; background:transparent; border:none; color:#fff; font-size:11px; font-weight:700; text-decoration:underline; cursor:pointer; text-shadow:1px 1px 4px rgba(0,0,0,0.9); position:relative; z-index:6;';
    rep.onclick = reportCard;
    row.insertAdjacentElement('afterend', rep);
  }
  updateExtraTexts();
  setupLangDropdown();
}

const LANG_OPTIONS = [
  ['my', '🇲🇲', 'မြန်မာ'], ['en', '🇬🇧', 'English'], ['ja', '🇯🇵', '日本語'],
  ['ko', '🇰🇷', '한국어'], ['th', '🇹🇭', 'ไทย'], ['zh', '🇨🇳', '中文']
];

function setupLangDropdown() {
  const sel = document.getElementById('userLang');
  if (!sel || document.getElementById('langDD')) return;
  const host = sel.parentElement;
  sel.style.display = 'none';
  host.style.position = 'relative';

  const dd = document.createElement('div');
  dd.id = 'langDD';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.id = 'langTrigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  const list = document.createElement('div');
  list.id = 'langList';
  list.setAttribute('role', 'listbox');

  const refresh = () => {
    const cur = LANG_OPTIONS.find((o) => o[0] === currentLang) || LANG_OPTIONS[0];
    trigger.textContent = '';
    const label = document.createElement('span');
    label.textContent = cur[1] + ' ' + cur[2];
    const arrow = document.createElement('span');
    arrow.className = 'lang-arrow';
    arrow.textContent = '▾';
    trigger.append(label, arrow);
    list.querySelectorAll('.lang-item').forEach((el) => el.classList.toggle('active', el.dataset.code === currentLang));
  };

  LANG_OPTIONS.forEach(([code, flag, name]) => {
    const item = document.createElement('div');
    item.className = 'lang-item';
    item.dataset.code = code;
    item.setAttribute('role', 'option');
    item.textContent = flag + ' ' + name;
    item.onclick = () => {
      sel.value = code;
      changeLanguage(code);
      dd.classList.remove('open');
      refresh();
    };
    list.appendChild(item);
  });

  trigger.onclick = (e) => { e.stopPropagation(); dd.classList.toggle('open'); };
  document.addEventListener('click', (e) => { if (!dd.contains(e.target)) dd.classList.remove('open'); });

  dd.append(trigger, list);
  host.appendChild(dd);
  refresh();
}

async function deleteAccount() {
  if (!currentUser) return;
  const x = ex();
  if (!confirm(x.deleteConfirm)) return;

  const num = currentUser.num;
  const ids = (currentUser.history || []).map((h) => h.id);
  setLoader(true);
  try {
    const sb = getSupabase();
    if (!sb) throw new Error('No client');
    for (const id of ids) await deleteCardRecord(id);
    const { error } = await withTimeout(sb.from('users').delete().eq('num', num));
    if (error) throw error;
    handleLogout();
    alert(x.deleteDone);
  } catch (err) {
    console.error('Delete account error:', err);
    setLoader(false);
    alert(t().msg.dbError);
  }
}

async function reportCard() {
  const x = ex();
  let cardId = '';
  try { cardId = new URL(currentShareableLink).searchParams.get('id') || ''; } catch (e) { /* ignore */ }
  if (!cardId) return;
  if (!confirm(x.reportConfirm)) return;

  const btn = document.getElementById('btn_report');
  if (btn) btn.disabled = true;
  try {
    const sb = getSupabase();
    if (!sb) throw new Error('No client');
    const { error } = await withTimeout(sb.from('reports').insert([{ card_id: cardId }]));
    if (error) throw error;
    alert(x.reportSent);
  } catch (err) {
    console.error('Report error:', err);
    if (btn) btn.disabled = false;
    alert(x.reportFail);
  }
}

function setupCardBackdrop() {
  const appCard = document.querySelector('.app-card');
  if (!appCard) return;
  const img = document.getElementById('cardBgImg');
  const vid = document.getElementById('cardBgVideo');
  let feather = document.getElementById('cardFeather');
  if (!feather) {
    feather = document.createElement('div');
    feather.id = 'cardFeather';
  }
  appCard.insertBefore(feather, appCard.firstChild);
  if (vid) appCard.insertBefore(vid, appCard.firstChild);
  if (img) appCard.insertBefore(img, appCard.firstChild);
  const tag = document.getElementById('outSender');
  if (tag) appCard.insertBefore(tag, feather.nextSibling);
}

window.addEventListener('DOMContentLoaded', async () => {
  setupCardBackdrop();
  setupExtras();
  window.currentLang = currentLang;
  updateTexts();
  populateReasonDropdown(currentLang);
  populateMusicDropdown();

  setTimeout(() => {
    const splash = document.getElementById('introSplash');
    if (splash) splash.classList.add('fade-out');
  }, 1500);

  const urlParams = new URLSearchParams(window.location.search);
  const cardId = urlParams.get('id');
  if (!cardId) return;

  isSharedLinkVisitor = true;
  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');

  const previewPlayer = document.getElementById('audioPreviewPlayer');
  if (previewPlayer) previewPlayer.pause();

  const m = t().msg;

  try {
    const sb = getSupabase();
    if (!sb) {
      if (loader) loader.classList.remove('show');
      showUnavailable(m.dbError);
      return;
    }

    const { data, networkError } = await fetchCardById(sb, cardId);
    if (loader) loader.classList.remove('show');

    if (!data) {
      showUnavailable(networkError ? m.dbError : m.cardGone);
      return;
    }

    const expireTime = parseDbTime(data.created_at) + CARD_LIFETIME_MS;
    if (Date.now() > expireTime) {
      await deleteCardRecord(cardId);
      showUnavailable(m.expireEnd);
      return;
    }

    currentShareableLink = `${window.location.origin}${window.location.pathname}?id=${cardId}`;
    renderCardData(data);
    showStep(4);
    startCardTimer(cardId, expireTime);
    showOpenGate(data.sender);
  } catch (err) {
    console.error('Supabase load error:', err);
    if (loader) loader.classList.remove('show');
    showUnavailable(t().msg.dbError);
  }
});

function showUnavailable(message) {
  stopCardTimer();
  setText('lbl_step6Title', t().msg.goneTitle);
  setText('lbl_step6Msg', message);
  setText('btn_step6Home', t().msg.homeBtn);
  showStep(6);
}

function leaveUnavailable() {
  clearUrlParams();
  isSharedLinkVisitor = false;
  goToStep(currentUser ? 2 : 1);
}

// ==========================================
// ==========================================
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function launchSparkles() {
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:997; overflow:hidden;';
  const icons = ['✨', '🧧', '💖', '⭐', '🎉', '💫'];
  for (let i = 0; i < 28; i++) {
    const span = document.createElement('span');
    span.className = 'sparkle-piece';
    span.textContent = icons[Math.floor(Math.random() * icons.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.fontSize = (14 + Math.random() * 18) + 'px';
    span.style.animationDuration = (2.2 + Math.random() * 1.6) + 's';
    span.style.animationDelay = (Math.random() * 0.9) + 's';
    box.appendChild(span);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 5000);
}

function showOpenGate(sender) {
  const gate = document.getElementById('openGate');
  const btn = document.getElementById('gateBtn');
  const gateBox = gate ? gate.querySelector('.gate-box') : null;
  if (!gate || !btn || !gateBox) return;

  const cardPlayer = document.getElementById('cardAudioPlayer');
  const bgVideo = document.getElementById('cardBgVideo');
  const exportCard = document.getElementById('exportCard');
  if (cardPlayer) cardPlayer.pause();
  if (bgVideo) bgVideo.pause();

  const appCardEl = document.querySelector('.app-card');
  if (appCardEl) appCardEl.classList.add('bg-hidden');
  if (exportCard) {
    exportCard.classList.remove('card-reveal');
    exportCard.classList.add('card-hidden');
  }

  let cd = document.getElementById('gateCountdown');
  if (!cd) {
    cd = document.createElement('div');
    cd.id = 'gateCountdown';
    cd.innerHTML = '<div class="ring"></div><div class="num"></div>';
    gate.appendChild(cd);
  }
  cd.classList.remove('show');

  setText('gateTitle', t().gateTitle);
  setText('gateFrom', sender ? `From: ${sender}` : '');
  btn.textContent = t().gateBtn;
  btn.disabled = false;
  gateBox.classList.remove('leaving');

  gate.classList.remove('hide');
  gate.classList.add('show');

  btn.onclick = async () => {
    btn.disabled = true;

    if (cardPlayer && cardPlayer.getAttribute('src')) {
      cardPlayer.play().catch((e) => console.log('Audio play error:', e));
    }

    gateBox.classList.add('leaving');
    await sleep(380);

    // Countdown 3, 2, 1, 0
    const numEl = cd.querySelector('.num');
    const ringEl = cd.querySelector('.ring');
    cd.classList.add('show');
    for (const n of [3, 2, 1, 0]) {
      numEl.textContent = String(n);
      ringEl.classList.remove('pop');
      numEl.classList.remove('pop');
      void numEl.offsetWidth;
      ringEl.classList.add('pop');
      numEl.classList.add('pop');
      await sleep(850);
    }
    cd.classList.remove('show');

    // Card reveal animation
    if (appCardEl) appCardEl.classList.remove('bg-hidden');
    if (exportCard) {
      exportCard.classList.remove('card-hidden');
      void exportCard.offsetWidth;
      exportCard.classList.add('card-reveal');
    }
    if (bgVideo && bgVideo.getAttribute('src')) {
      playBgVideoWithSound(bgVideo);
    }
    gate.classList.add('hide');
    launchSparkles();
    setTimeout(() => gate.classList.remove('show'), 550);
  };
}

function clearUrlParams() {
  if (window.history && window.history.replaceState) {
    const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
  }
}

// ==========================================
// Card rendering & timer
// ==========================================
// ==========================================
// Card title pill + volume control
// ==========================================
// The title lives inside the card so it is centered together with the note.
function moveTitleIntoCard() {
  const h = document.getElementById('lbl_step4Title');
  const box = document.querySelector('.card-header-content');
  if (h && box && h.parentNode !== box) box.insertBefore(h, box.firstChild);
}
moveTitleIntoCard();

function syncStep4Title(d) {
  const h = document.getElementById('lbl_step4Title');
  if (!h) return;
  h.textContent = currentCardReason || ((d && d.step4Title) || '');
  h.classList.toggle('reason-pill', !!currentCardReason);
}

const VOL_ICON_ON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M11 5 6 9H3v6h3l5 4V5z" fill="#fff"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
const VOL_ICON_OFF =
  '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M11 5 6 9H3v6h3l5 4V5z" fill="#fff"/><path d="M16 9l5 6"/><path d="M21 9l-5 6"/></svg>';

// Puts the speaker in the top-left corner, on the same row as the "From" tag.
function positionVolumeControl() {
  const btn = document.getElementById('volBtn');
  const panel = document.getElementById('volPanel');
  if (!btn || !panel) return;
  const size = 28;
  const tag = document.getElementById('outSender');
  let top = 10;
  if (tag && tag.offsetWidth && tag.offsetParent) {
    top = tag.offsetTop + (tag.offsetHeight - size) / 2;
  }
  btn.style.top = top + 'px';
  panel.style.top = (top + size + 6) + 'px';
}

// Applies the slider values to the real audio/video elements.
function applyVolumeLevels() {
  const music = document.getElementById('volMusic');
  const video = document.getElementById('volVideo');
  const audioEl = document.getElementById('cardAudioPlayer');
  const videoEl = document.getElementById('cardBgVideo');
  if (music && audioEl) audioEl.volume = music.value / 100;
  if (video && videoEl) videoEl.volume = video.value / 100;
  if (video) {
    const hasVideo = !!(videoEl && videoEl.getAttribute('src'));
    video.disabled = !hasVideo;
    if (video.parentNode) video.parentNode.style.opacity = hasVideo ? '1' : '0.35';
  }
  const btn = document.getElementById('volBtn');
  if (btn && music && video) {
    const off = (+music.value === 0 && +video.value === 0);
    const state = off ? 'off' : 'on';
    if (btn.dataset.state !== state) {
      btn.dataset.state = state;
      btn.innerHTML = off ? VOL_ICON_OFF : VOL_ICON_ON;
    }
  }
}

const VOL_TEXT = {
  my: { ok: '✅ အသံ သိမ်းပြီးပါပြီ', fail: '❌ အသံ သိမ်း၍ မရပါ' },
  en: { ok: '✅ Volume saved', fail: '❌ Could not save volume' },
  ja: { ok: '✅ 音量を保存しました', fail: '❌ 音量を保存できませんでした' },
  ko: { ok: '✅ 볼륨이 저장되었습니다', fail: '❌ 볼륨을 저장할 수 없습니다' },
  th: { ok: '✅ บันทึกระดับเสียงแล้ว', fail: '❌ บันทึกระดับเสียงไม่สำเร็จ' },
  zh: { ok: '✅ 音量已保存', fail: '❌ 无法保存音量' }
};

// Song URL format: "music/song1.mp3#vol=30,60" -> { base, music: 30, video: 60 } (100 = full).
function parseMusicVolume(raw) {
  const out = { base: String(raw || ''), music: 100, video: 100 };
  const i = out.base.indexOf('#vol=');
  if (i >= 0) {
    const parts = out.base.slice(i + 5).split(',');
    out.base = out.base.slice(0, i);
    const m = parseInt(parts[0], 10);
    const v = parseInt(parts[1], 10);
    if (!isNaN(m)) out.music = Math.min(100, Math.max(0, m));
    if (!isNaN(v)) out.video = Math.min(100, Math.max(0, v));
  }
  return out;
}

// Saves the owner's volume levels on the card so shared-link viewers hear the same mix.
async function saveVolumeLevels() {
  const msg = VOL_TEXT[currentLang] || VOL_TEXT.en;
  const saveBtn = document.getElementById('volSave');
  const sb = getSupabase();
  if (!sb || !currentCardId) { alert(msg.fail); return; }

  const m = Math.round(+document.getElementById('volMusic').value);
  const v = Math.round(+document.getElementById('volVideo').value);
  const newUrl = (m === 100 && v === 100) ? currentCardMusicBase : `${currentCardMusicBase}#vol=${m},${v}`;

  if (saveBtn) saveBtn.disabled = true;
  try {
    const { data, error } = await sb.from('cards').update({ music_url: newUrl }).eq('id', currentCardId).select('id');
    if (error) throw error;
    // With row-level security an update can succeed but change 0 rows.
    if (!data || data.length === 0) throw new Error('No rows updated (check the cards UPDATE policy)');
    alert(msg.ok);
    const panel = document.getElementById('volPanel');
    if (panel) panel.classList.remove('open');
  } catch (err) {
    console.error('Save volume error:', err);
    alert(msg.fail);
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
}

function setupVolumeControl() {
  const appCard = document.querySelector('.app-card');
  if (!appCard || document.getElementById('volBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'volBtn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Volume');
  btn.innerHTML = VOL_ICON_ON;
  btn.dataset.state = 'on';

  const panel = document.createElement('div');
  panel.id = 'volPanel';
  panel.innerHTML =
    '<div class="vol-rows">' +
    '<label><span>🎵</span><input type="range" id="volMusic" min="0" max="100" value="100"></label>' +
    '<label><span>🎬</span><input type="range" id="volVideo" min="0" max="100" value="100"></label>' +
    '</div>' +
    '<button type="button" id="volSave">✓ Save</button>';

  appCard.appendChild(btn);
  appCard.appendChild(panel);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
  });
  panel.addEventListener('click', (e) => e.stopPropagation());
  panel.querySelector('#volSave').addEventListener('click', saveVolumeLevels);
  document.addEventListener('click', () => panel.classList.remove('open'));
  window.addEventListener('resize', positionVolumeControl);

  panel.querySelector('#volMusic').addEventListener('input', () => {
    const audioEl = document.getElementById('cardAudioPlayer');
    // Moving the slider is a tap, so it can also (re)start the song if it was paused.
    if (audioEl && audioEl.getAttribute('src') && audioEl.paused && +panel.querySelector('#volMusic').value > 0) {
      audioEl.play().catch((e) => console.log('Audio play error:', e));
    }
    applyVolumeLevels();
  });
  panel.querySelector('#volVideo').addEventListener('input', () => {
    const videoEl = document.getElementById('cardBgVideo');
    // Moving the slider is a tap, so it can also lift a muted-autoplay fallback.
    if (videoEl && videoEl.muted && +panel.querySelector('#volVideo').value > 0) videoEl.muted = false;
    applyVolumeLevels();
  });
}

// Only the card owner sees the speaker; people opening a shared link do not.
function updateVolumeControl(stepNumber) {
  setupVolumeControl();
  const btn = document.getElementById('volBtn');
  const panel = document.getElementById('volPanel');
  const show = stepNumber === 4 && !isSharedLinkVisitor;
  if (btn) btn.style.display = show ? 'flex' : 'none';
  if (panel && !show) panel.classList.remove('open');
  positionVolumeControl();
  applyVolumeLevels();
}

// Video background sound: 'replace' = the video's own sound replaces the chosen music
// (only when the video really has audio); 'mix' = video sound and music play together.
const VIDEO_AUDIO_MODE = 'mix';

function videoHasAudio(v) {
  if (typeof v.mozHasAudio === 'boolean') return v.mozHasAudio;
  if (v.audioTracks && v.audioTracks.length > 0) return true;
  if (typeof v.webkitAudioDecodedByteCount === 'number') return v.webkitAudioDecodedByteCount > 0;
  return false;
}

function playBgVideoWithSound(v) {
  if (!v) return;
  v.muted = false;

  const applyAudioMode = () => {
    if (VIDEO_AUDIO_MODE !== 'replace') return;
    setTimeout(() => {
      const cp = document.getElementById('cardAudioPlayer');
      if (cp && !v.muted && !v.paused && videoHasAudio(v)) cp.pause();
    }, 800);
  };

  const p = v.play();
  if (!p || !p.then) { applyAudioMode(); return; }
  p.then(applyAudioMode).catch(() => {
    // Browser blocked autoplay with sound: play muted, unmute on the first tap.
    v.muted = true;
    v.play().catch((e) => console.log('Video play error:', e));
    const unmute = () => {
      v.muted = false;
      document.removeEventListener('pointerdown', unmute, true);
      applyAudioMode();
    };
    document.addEventListener('pointerdown', unmute, true);
  });
}

function renderCardData(data) {
  if (!data) return;

  const appCardEl = document.querySelector('.app-card');
  if (appCardEl) appCardEl.classList.remove('bg-hidden');
  const exportCardEl = document.getElementById('exportCard');
  if (exportCardEl) exportCardEl.classList.remove('card-hidden');

  setText('outSender', data.sender ? `From: ${data.sender}` : '');
  setText('outReason', data.reason || '');
  setText('outNote', data.note || '');
  currentCardReason = String(data.reason || '').trim();
  syncStep4Title(t());

  const bgSrc = data.bgImage || data.bg_image || '';
  const bgImgEl = document.getElementById('cardBgImg');
  const bgVideoEl = document.getElementById('cardBgVideo');

  if (bgSrc) {
    if (isVideoSource(bgSrc)) {
      if (bgImgEl) bgImgEl.style.display = 'none';
      if (bgVideoEl) {
        bgVideoEl.muted = false;
        bgVideoEl.preload = 'auto';
        bgVideoEl.onloadeddata = () => {
          try { if (bgVideoEl.paused) bgVideoEl.currentTime = 0.05; } catch (e) { /* ignore */ }
        };
        bgVideoEl.src = bgSrc;
        bgVideoEl.style.display = 'block';
        bgVideoEl.load();
        playBgVideoWithSound(bgVideoEl);
      }
    } else {
      if (bgVideoEl) {
        bgVideoEl.pause();
        bgVideoEl.removeAttribute('src');
        bgVideoEl.style.display = 'none';
      }
      if (bgImgEl) {
        bgImgEl.src = bgSrc;
        bgImgEl.style.display = 'block';
      }
    }
  }

  const qrImgSrc = data.qrImage || data.qr_image || '';
  const qrEl = document.getElementById('cardQrImg');
  const qrWr = document.getElementById('qrWrapper');
  displayedQrImage = qrImgSrc;
  if (qrImgSrc) {
    if (qrEl) qrEl.src = qrImgSrc;
    if (qrWr) qrWr.classList.add('visible');
  } else if (qrWr) {
    qrWr.classList.remove('visible');
  }

  // The song URL may carry the owner's saved volumes as "#vol=music,video".
  const musicInfo = parseMusicVolume(data.musicUrl || data.music_url || '');
  const mUrl = musicInfo.base;
  currentCardMusicBase = musicInfo.base;
  setupVolumeControl();
  const volMusicEl = document.getElementById('volMusic');
  const volVideoEl = document.getElementById('volVideo');
  if (volMusicEl) volMusicEl.value = musicInfo.music;
  if (volVideoEl) volVideoEl.value = musicInfo.video;
  const cardPlayer = document.getElementById('cardAudioPlayer');
  const cardAudioGroup = document.getElementById('cardAudioGroup');
  if (cardPlayer && cardAudioGroup) {
    if (mUrl) {
      cardPlayer.src = mUrl;
      cardPlayer.load();
      cardPlayer.play().catch((e) => console.log('Autoplay prevented:', e));
      cardAudioGroup.style.display = 'flex';
    } else {
      cardPlayer.pause();
      cardAudioGroup.style.display = 'none';
    }
  }
  positionVolumeControl();
  applyVolumeLevels();
}

function stopCardTimer() {
  if (cardTimerInterval) {
    clearInterval(cardTimerInterval);
    cardTimerInterval = null;
  }
  const timerEl = document.getElementById('topCardTimer');
  if (timerEl) timerEl.style.display = 'none';
}

function startCardTimer(cardId, expireTime) {
  stopCardTimer();
  currentCardId = cardId || '';

  if (!expireTime) expireTime = Date.now() + CARD_LIFETIME_MS;

  let timerEl = document.getElementById('topCardTimer');
  if (!timerEl) {
    timerEl = document.createElement('div');
    timerEl.id = 'topCardTimer';
    timerEl.className = 'top-card-timer';
    (document.querySelector('.app-card') || document.body).appendChild(timerEl);
  }
  timerEl.style.display = 'flex';

  const tick = async () => {
    const distance = expireTime - Date.now();
    if (distance <= 0) {
      stopCardTimer();
      await deleteCardDataAndClean(cardId);
      return;
    }
    const minutes = Math.floor(distance / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);
    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${t().msg.left}`;
  };

  tick();
  cardTimerInterval = setInterval(tick, 1000);
}

async function deleteCardDataAndClean(cardId) {
  currentShareableLink = '';
  displayedQrImage = '';
  stopCardTimer();

  const bgEl = document.getElementById('cardBgImg');
  if (bgEl) bgEl.style.display = 'none';
  const bgVideoEl = document.getElementById('cardBgVideo');
  if (bgVideoEl) {
    bgVideoEl.pause();
    bgVideoEl.removeAttribute('src');
    bgVideoEl.style.display = 'none';
  }
  const qrWr = document.getElementById('qrWrapper');
  if (qrWr) qrWr.classList.remove('visible');

  setText('outSender', '');
  setText('outReason', '');
  setText('outNote', '');
  currentCardReason = '';
  syncStep4Title(t());

  const cardAudioGroup = document.getElementById('cardAudioGroup');
  if (cardAudioGroup) cardAudioGroup.style.display = 'none';
  const cardPlayer = document.getElementById('cardAudioPlayer');
  if (cardPlayer) {
    cardPlayer.pause();
    cardPlayer.removeAttribute('src');
  }

  if (cardId) {
    await deleteCardRecord(cardId);
    clearUrlParams();

    if (currentUser && Array.isArray(currentUser.history)) {
      const before = currentUser.history.length;
      currentUser.history = currentUser.history.filter((h) => h.id !== cardId);
      if (currentUser.history.length !== before) await syncUserToSupabase();
    }
  }

  alert(t().msg.expireEnd);

  if (isSharedLinkVisitor || !currentUser) {
    isSharedLinkVisitor = false;
    goToStep(1);
  } else {
    goToStep(2);
  }
}

// ==========================================
// Auth
// ==========================================
async function handleSignup() {
  const m = t().msg;
  const name = (document.getElementById('signupName').value || '').trim();
  const num = (document.getElementById('signupNum').value || '').trim();
  const p1 = document.getElementById('signupPass1').value || '';
  const p2 = document.getElementById('signupPass2').value || '';

  if (!name || !num || !p1 || !p2) {
    alert(m.fillAll);
    return;
  }

  if (p1.length < 6 || !/[a-zA-Z]/.test(p1)) {
    alert(m.passRule);
    return;
  }

  if (p1 !== p2) {
    alert(m.passMismatch);
    return;
  }

  const sb = getSupabase();
  if (!sb) {
    alert(m.dbError);
    return;
  }

  const btn = document.getElementById('btn_signup');
  if (btn) btn.disabled = true;
  let navigating = false;
  setLoader(true);

  try {
    const [byNum, byName] = await withTimeout(Promise.all([
      sb.from('users').select('num').eq('num', num).limit(1),
      sb.from('users').select('num').ilike('name', escapeLike(name)).limit(1)
    ]));

    if (byNum.error || byName.error) throw (byNum.error || byName.error);

    if ((byNum.data && byNum.data.length) || (byName.data && byName.data.length)) {
      alert(m.idOrNameTaken);
      return;
    }

    const hashed = await hashPassword(p1, num);
    const userData = { name, num, pass: hashed, avatar: '', history: [] };
    const { error } = await withTimeout(sb.from('users').insert([userData]));
    if (error) throw error;

    alert(m.signupOk);
    currentUser = userData;
    setupProfileView();
    navigating = true;
    goToStep(2);
  } catch (err) {
    console.error('Signup error:', err);
    alert(m.dbError);
  } finally {
    if (btn) btn.disabled = false;
    if (!navigating) setLoader(false);
  }
}

async function handleLogin() {
  const m = t().msg;
  const name = (document.getElementById('loginName').value || '').trim();
  const pass = document.getElementById('loginPass').value || '';

  if (!name || !pass) {
    alert(m.loginFill);
    return;
  }

  const sb = getSupabase();
  if (!sb) {
    alert(m.dbError);
    return;
  }

  const btn = document.getElementById('btn_login');
  if (btn) btn.disabled = true;
  let navigating = false;
  setLoader(true);

  try {
    const { data: foundUser, error } = await withTimeout(sb
      .from('users')
      .select('*')
      .ilike('name', escapeLike(name))
      .limit(1)
      .maybeSingle());

    if (error) throw error;
    if (!foundUser) {
      alert(m.noAccount);
      return;
    }

    const stored = foundUser.pass || '';
    let ok = false;
    let needsUpgrade = false;

    if (stored.startsWith(HASH_PREFIX)) {
      ok = (stored === await hashPassword(pass, foundUser.num));
    } else if (stored === pass) {
      ok = true;
      needsUpgrade = true;
    }

    if (!ok) {
      alert(m.wrongPass);
      return;
    }

    if (!Array.isArray(foundUser.history)) foundUser.history = [];
    currentUser = foundUser;

    if (needsUpgrade) {
      currentUser.pass = await hashPassword(pass, foundUser.num);
      await syncUserToSupabase();
    }

    setupProfileView();
    navigating = true;
    goToStep(2);
  } catch (err) {
    console.error('Login error:', err);
    alert(m.dbError);
  } finally {
    if (btn) btn.disabled = false;
    if (!navigating) setLoader(false);
  }
}

function handleLogout() {
  stopCardTimer();
  if (historyTimerInterval) {
    clearInterval(historyTimerInterval);
    historyTimerInterval = null;
  }
  currentUser = null;
  resetCardForm(true);

  const avatarBox = document.getElementById('profileAvatarBox');
  if (avatarBox) {
    avatarBox.innerHTML = '<svg width="38" height="38" viewBox="0 0 24 24" fill="#a4b0be"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
  }
  ['loginName', 'loginPass', 'signupName', 'signupNum', 'signupPass1', 'signupPass2'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  goToStep(1);
}

function setupProfileView() {
  if (!currentUser) return;
  setText('displayProfileName', currentUser.name);
  setText('displayProfileNum', `ID: ${currentUser.num}`);

  const profileAvatarBox = document.getElementById('profileAvatarBox');
  if (currentUser.avatar && profileAvatarBox) {
    profileAvatarBox.innerHTML = '';
    const img = document.createElement('img');
    img.src = currentUser.avatar;
    img.alt = 'Avatar';
    profileAvatarBox.appendChild(img);
  }
}

async function syncUserToSupabase() {
  if (!currentUser) return;
  const sb = getSupabase();
  if (!sb) return;
  try {
    const { error } = await withTimeout(sb.from('users').update({
      name: currentUser.name,
      pass: currentUser.pass,
      avatar: currentUser.avatar,
      history: currentUser.history
    }).eq('num', currentUser.num));
    if (error) console.error('Sync user error:', error);
  } catch (err) {
    console.error('Sync user failed:', err);
  }
}

async function changeNickname() {
  if (!currentUser) return;
  const m = t().msg;

  let modal = document.getElementById('customNickModal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'customNickModal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999; opacity: 0; transition: opacity 0.3s ease;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background: rgba(15, 23, 42, 0.95); border: 1.5px solid rgba(0, 242, 254, 0.5);
    box-shadow: 0 0 20px rgba(0, 242, 254, 0.2); border-radius: 16px; padding: 22px 20px;
    width: 88%; max-width: 320px; text-align: center; color: #fff;
    transform: scale(0.9); transition: transform 0.3s ease;
  `;

  const title = document.createElement('h3');
  title.textContent = m.nickTitle;
  title.style.cssText = 'margin: 0 0 14px 0; font-size: 16px; color: #00f2fe; font-weight: 600;';

  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 40;
  input.placeholder = m.nickPlaceholder;
  input.value = currentUser.name || '';
  input.style.cssText = `
    width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(0, 242, 254, 0.4);
    background: rgba(255,255,255,0.07); color: #fff; font-size: 14px; outline: none;
    margin-bottom: 18px; box-sizing: border-box; text-align: center;
  `;

  const row = document.createElement('div');
  row.style.cssText = 'display: flex; gap: 10px; justify-content: center;';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = m.cancel;
  cancelBtn.style.cssText = `
    flex: 1; padding: 9px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.1); color: #ccc; cursor: pointer; font-size: 13px;
  `;

  const okBtn = document.createElement('button');
  okBtn.textContent = 'OK';
  okBtn.style.cssText = `
    flex: 1; padding: 9px; border-radius: 8px; border: none;
    background: linear-gradient(135deg, #00f2fe, #4facfe); color: #090d16; font-weight: bold;
    cursor: pointer; font-size: 13px; box-shadow: 0 0 10px rgba(0,242,254,0.4);
  `;

  row.append(cancelBtn, okBtn);
  box.append(title, input, row);
  modal.appendChild(box);
  document.body.appendChild(modal);

  setTimeout(() => {
    modal.style.opacity = '1';
    box.style.transform = 'scale(1)';
    input.focus();
    input.select();
  }, 10);

  const closeModal = () => {
    modal.style.opacity = '0';
    box.style.transform = 'scale(0.9)';
    setTimeout(() => modal.remove(), 300);
  };

  cancelBtn.onclick = closeModal;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  okBtn.onclick = async () => {
    const newName = input.value.trim();
    if (!newName || newName === currentUser.name) {
      closeModal();
      return;
    }

    okBtn.disabled = true;
    try {
      const sb = getSupabase();
      if (sb) {
        const { data: clash } = await sb
          .from('users')
          .select('num')
          .ilike('name', escapeLike(newName))
          .neq('num', currentUser.num)
          .limit(1);
        if (clash && clash.length) {
          alert(m.nickTaken);
          okBtn.disabled = false;
          return;
        }
      }
      currentUser.name = newName;
      await syncUserToSupabase();
      setupProfileView();
      alert(m.nickOk);
      closeModal();
    } catch (err) {
      console.error('Change nickname error:', err);
      alert(m.dbError);
      okBtn.disabled = false;
    }
  };
}

async function updateProfileAvatar(input) {
  if (!(input.files && input.files[0]) || !currentUser) return;
  const dataUrl = await compressFileToDataUrl(input.files[0], 300, 0.8);
  input.value = '';
  if (!dataUrl) return;

  currentUser.avatar = dataUrl;
  await syncUserToSupabase();
  setupProfileView();
}

// ==========================================
// History
// ==========================================
function viewHistory() {
  renderHistoryList();
  goToStep(5);
}

function getHistoryExpireTime(item) {
  if (item.expiresAt) return item.expiresAt;
  const stored = localStorage.getItem(`card_expire_${item.id}`);
  if (stored) return parseInt(stored, 10);
  const fallback = Date.now() + CARD_LIFETIME_MS;
  try { localStorage.setItem(`card_expire_${item.id}`, String(fallback)); } catch (e) { /* ignore */ }
  return fallback;
}

function renderHistoryList() {
  if (historyTimerInterval) clearInterval(historyTimerInterval);

  const container = document.getElementById('historyListContainer');
  if (!container) return;
  container.innerHTML = '';
  const m = t().msg;

  if (!currentUser || !currentUser.history || currentUser.history.length === 0) {
    const p = document.createElement('p');
    p.style.cssText = 'text-align: center; color: #cbd5e1; font-size: 13px; padding: 20px;';
    p.textContent = m.noHistory;
    container.appendChild(p);
    return;
  }

  currentUser.history.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'history-item-row';
    row.style.cssText = 'display:flex; flex-direction:column; position:relative; padding:8px 12px; margin-bottom:6px; border-radius:10px; background:rgba(15,23,42,0.85); border:1px solid rgba(255,255,255,0.08);';

    const topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex; justify-content:space-between; align-items:center; width:100%; position:relative; margin-bottom:2px;';

    const expireText = document.createElement('span');
    expireText.className = 'history-timer-span';
    expireText.style.cssText = 'font-size:11px; color:#ff4757; font-weight:600;';
    expireText.dataset.expire = String(getHistoryExpireTime(item));

    const menuBtn = document.createElement('button');
    menuBtn.className = 'history-menu-btn';
    menuBtn.textContent = '≡';
    menuBtn.style.cssText = 'background:transparent; border:none; color:#fff; font-size:16px; cursor:pointer; padding:0 4px;';
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      toggleHistoryDropdown(index);
    };

    topRow.append(expireText, menuBtn);

    const dropdown = document.createElement('div');
    dropdown.className = 'history-dropdown-menu';
    dropdown.id = `historyDropdown_${index}`;
    dropdown.style.cssText = 'position:absolute; top:26px; right:0; z-index:9999; background:#1e293b; border:1px solid rgba(255,255,255,0.15); border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.5); display:none; min-width:90px;';

    const viewItem = document.createElement('div');
    viewItem.className = 'history-dropdown-item';
    viewItem.textContent = m.view;
    viewItem.style.cssText = 'padding:6px 12px; cursor:pointer; font-size:12px; color:#fff; border-bottom:1px solid rgba(255,255,255,0.06);';
    viewItem.onclick = () => viewCardFromHistory(item.id);

    const deleteItem = document.createElement('div');
    deleteItem.className = 'history-dropdown-item';
    deleteItem.textContent = m.del;
    deleteItem.style.cssText = 'padding:6px 12px; cursor:pointer; font-size:12px; color:#ff4757;';
    deleteItem.onclick = () => deleteCardFromHistory(item.id, index);

    dropdown.append(viewItem, deleteItem);
    topRow.appendChild(dropdown);

    const linkText = document.createElement('span');
    linkText.className = 'history-link-text';
    linkText.style.cssText = 'display:block; width:100%; font-size:11.5px; color:#cbd5e1; word-break:break-all;';
    linkText.textContent = `${index + 1}. ${item.reason || ''} - ${item.link || ''}`;

    row.append(topRow, linkText);
    container.appendChild(row);
  });

  updateHistoryTimers();
  historyTimerInterval = setInterval(updateHistoryTimers, 1000);
}

function updateHistoryTimers() {
  const m = t().msg;
  document.querySelectorAll('.history-timer-span').forEach((span) => {
    const distance = parseInt(span.dataset.expire, 10) - Date.now();
    if (distance <= 0) {
      span.textContent = m.expired;
      return;
    }
    const minutes = Math.floor(distance / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);
    span.textContent = `${m.expires} - ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });
}

function toggleHistoryDropdown(index) {
  document.querySelectorAll('.history-dropdown-menu').forEach((el) => {
    if (el.id !== `historyDropdown_${index}`) {
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

async function viewCardFromHistory(cardId) {
  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');

  try {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from('cards').select('*').eq('id', cardId).maybeSingle();

      if (data && !error) {
        const expireTime = parseDbTime(data.created_at) + CARD_LIFETIME_MS;
        if (Date.now() > expireTime) {
          if (loader) loader.classList.remove('show');
          await deleteCardDataAndClean(cardId);
          return;
        }

        currentShareableLink = `${window.location.origin}${window.location.pathname}?id=${cardId}`;
        renderCardData(data);
        if (loader) loader.classList.remove('show');
        showStep(4);
        startCardTimer(cardId, expireTime);
        return;
      }
    }
    alert(t().msg.cardGone);
  } catch (err) {
    console.error('View history card error:', err);
  }
  if (loader) loader.classList.remove('show');
}

async function deleteCardFromHistory(cardId, index) {
  if (!confirm(t().msg.confirmDel)) return;

  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');

  await deleteCardRecord(cardId);

  if (currentUser && currentUser.history) {
    currentUser.history.splice(index, 1);
    await syncUserToSupabase();
  }

  if (loader) loader.classList.remove('show');
  renderHistoryList();
}

// ==========================================
// Navigation
// ==========================================
function goToStep(stepNumber) {
  if (stepNumber !== 4) stopCardTimer();
  if (stepNumber !== 5 && historyTimerInterval) {
    clearInterval(historyTimerInterval);
    historyTimerInterval = null;
  }

  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');
  setTimeout(() => {
    if (loader) loader.classList.remove('show');
    showStep(stepNumber);
  }, 600);
}

function returnToProfileOrLogin() {
  stopCardTimer();

  if (isSharedLinkVisitor || !currentUser) {
    clearUrlParams();
    isSharedLinkVisitor = false;
    goToStep(1);
  } else {
    goToStep(2);
  }
}

function showStep(stepNumber) {
  document.querySelectorAll('.step').forEach((s) => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(`step${stepNumber}`);
  if (target) {
    target.style.display = 'block';
    setTimeout(() => target.classList.add('active'), 50);
  }

  const appCard = document.querySelector('.app-card');
  if (appCard) {
    appCard.scrollTop = 0;
    appCard.classList.toggle('no-scroll', stepNumber === 4);
  }
  document.body.classList.toggle('lock-scroll', stepNumber === 4);
  const reportBtnEl = document.getElementById('btn_report');
  if (reportBtnEl) reportBtnEl.style.display = (stepNumber === 4 && isSharedLinkVisitor) ? 'block' : 'none';
  updateVolumeControl(stepNumber);
  window.scrollTo(0, 0);

  if (stepNumber !== 3) {
    const previewPlayer = document.getElementById('audioPreviewPlayer');
    if (previewPlayer) previewPlayer.pause();
  }
  if (stepNumber !== 4) {
    const cardPlayer = document.getElementById('cardAudioPlayer');
    if (cardPlayer) cardPlayer.pause();
    const bgVideo = document.getElementById('cardBgVideo');
    if (bgVideo) bgVideo.pause();
  }
}

// ==========================================
// ==========================================
function updateGenButton() {
  const btn = document.getElementById('btn_genCard');
  if (btn) btn.disabled = isGenerating || uploads.bg.busy || uploads.qr.busy;
}

function setFileLabel(el, text, percent) {
  if (!el) return;
  el.textContent = text;
  el.style.setProperty('--p', (percent == null ? 0 : percent) + '%');
}

async function processAndUpload(kind, file) {
  const u = uploads[kind];
  const sb = getSupabase();
  const label = document.getElementById(kind === 'bg' ? 'bgImgLabel' : 'qrImgLabel');
  const m = t().msg;
  const isVid = isVideoFile(file);
  const token = ++u.token;

  if (u.url && sb) removeMediaFiles(sb, [u.url]);
  u.file = file;
  u.url = '';
  u.fallback = '';
  u.busy = true;
  updateGenButton();
  setFileLabel(label, kind === 'bg' ? m.uploadingBg : m.uploadingQr, 0);

  let blob = file;
  let dataUrl = '';

  try {
    if (!isVid) {
      dataUrl = await compressFileToDataUrl(file, kind === 'bg' ? 1080 : 700, 0.85);
      if (dataUrl) blob = await (await fetch(dataUrl)).blob();
    }
    if (u.token !== token) return;

    const path = makeMediaPath(kind, blob);
    const avgBps = await xhrUpload(blob, path, (ratio, bps) => {
      if (u.token !== token) return;
      const pct = Math.round(ratio * 100);
      setFileLabel(label, `⏳ ${pct}% · ${formatSpeed(bps)}`, pct);
    });

    if (u.token !== token) {
      if (sb) removeMediaFiles(sb, [publicMediaUrl(path)]);
      return;
    }

    u.url = publicMediaUrl(path);
    const kindIcon = kind === 'qr' ? 'QR' : (isVid ? '🎬 Video' : '📸 Image');
    setFileLabel(label, `✅ ${kindIcon} (${file.name}) · ${formatSpeed(avgBps)}`, 100);
  } catch (err) {
    if (u.token !== token) return;
    console.warn('Upload error:', err);

    if (!isVid && dataUrl) {
      u.fallback = dataUrl;
      setFileLabel(label, `✅ ${kind === 'qr' ? 'QR' : '📸 Image'} (${file.name})`, 100);
    } else {
      alert(m.uploadFail);
      u.file = null;
      setFileLabel(label, kind === 'bg' ? t().bgBtn : t().qrBtn, 0);
    }
  } finally {
    if (u.token === token) {
      u.busy = false;
      updateGenButton();
    }
  }
}

async function handleBgImage(input) {
  if (!(input.files && input.files[0])) return;

  const file = input.files[0];
  const m = t().msg;
  const bgImgLabel = document.getElementById('bgImgLabel');
  const isVid = isVideoFile(file);

  const resetBg = () => {
    input.value = '';
    uploads.bg.token++;
    uploads.bg.file = null;
    setFileLabel(bgImgLabel, t().bgBtn, 0);
  };

  if (isVid) {
    if (file.size > MAX_VIDEO_BYTES) {
      alert(m.videoBig);
      resetBg();
      return;
    }
    setFileLabel(bgImgLabel, m.checking, 0);
    const duration = await getVideoDuration(file);
    if (duration > MAX_VIDEO_SECONDS) {
      alert(m.videoLong);
      resetBg();
      return;
    }
  }

  await processAndUpload('bg', file);
}

async function handleQrImage(input) {
  if (!(input.files && input.files[0])) return;
  await processAndUpload('qr', input.files[0]);
}

function resetCardForm(discard) {
  const sb = getSupabase();
  ['bg', 'qr'].forEach((k) => {
    const u = uploads[k];
    u.token++;
    if (discard && u.url && sb) removeMediaFiles(sb, [u.url]);
    u.file = null;
    u.url = '';
    u.fallback = '';
    u.busy = false;
  });

  document.querySelectorAll('#step3 input[type=file]').forEach((i) => { i.value = ''; });
  const note = document.getElementById('customNote');
  if (note) note.value = '';
  const customReason = document.getElementById('customReason');
  if (customReason) customReason.value = '';

  setFileLabel(document.getElementById('bgImgLabel'), t().bgBtn, 0);
  setFileLabel(document.getElementById('qrImgLabel'), t().qrBtn, 0);
  updateGenButton();
}

async function generateAndSaveCard() {
  if (isGenerating) return;

  const d = t();

  if (!currentUser) {
    goToStep(1);
    return;
  }

  if (uploads.bg.busy || uploads.qr.busy) {
    alert(d.msg.waitUpload);
    return;
  }

  const previewPlayer = document.getElementById('audioPreviewPlayer');
  if (previewPlayer) previewPlayer.pause();

  const reasonVal = (document.getElementById('reasonDropdownVal') || {}).value || '';
  const customReason = ((document.getElementById('customReason') || {}).value || '').trim();
  const customNote = ((document.getElementById('customNote') || {}).value || '').trim();
  const finalReason = (reasonVal === 'အခြား' && customReason) ? customReason : reasonVal;

  if (!customNote) {
    alert(d.alertNote);
    return;
  }

  if (!uploads.bg.url && !uploads.bg.fallback) {
    alert(d.alertBg);
    return;
  }
  if (!uploads.qr.url && !uploads.qr.fallback) {
    alert(d.alertQr);
    return;
  }

  const sb = getSupabase();
  if (!sb) {
    alert(d.msg.dbError);
    return;
  }

  isGenerating = true;
  updateGenButton();
  const loader = document.getElementById('stepLoader');
  if (loader) loader.classList.add('show');

  try {
    const [bgUrl, qrUrl] = await Promise.all([
      uploads.bg.url ? uploads.bg.url : uploadMedia(sb, uploads.bg.fallback, 'bg'),
      uploads.qr.url ? uploads.qr.url : uploadMedia(sb, uploads.qr.fallback, 'qr')
    ]);

    const payload = {
      sender: currentUser.name,
      reason: finalReason,
      note: customNote,
      bg_image: bgUrl,
      qr_image: qrUrl,
      music_url: savedMusicUrl
    };

    const { data, error } = await sb.from('cards').insert([payload]).select();
    if (error) throw error;

    if (!(data && data.length > 0)) throw new Error('Card was not created.');

    const row = data[0];
    const generatedId = row.id;
    const expireTime = parseDbTime(row.created_at) + CARD_LIFETIME_MS;
    currentShareableLink = `${window.location.origin}${window.location.pathname}?id=${generatedId}`;

    if (!Array.isArray(currentUser.history)) currentUser.history = [];
    currentUser.history.unshift({
      id: generatedId,
      link: currentShareableLink,
      reason: finalReason,
      createdAt: new Date().toISOString(),
      expiresAt: expireTime
    });
    currentUser.history = currentUser.history.slice(0, 50);
    await syncUserToSupabase();

    renderCardData({
      sender: payload.sender,
      reason: payload.reason,
      note: payload.note,
      bg_image: payload.bg_image,
      qr_image: payload.qr_image,
      music_url: payload.music_url
    });

    resetCardForm(false);

    if (loader) loader.classList.remove('show');
    showStep(4);
    startCardTimer(generatedId, expireTime);
  } catch (err) {
    console.error('Supabase Save Error:', err);
    if (loader) loader.classList.remove('show');
    alert('Error: ' + (err.message || JSON.stringify(err)));
  } finally {
    isGenerating = false;
    updateGenButton();
  }
}

// ==========================================
// Save / Share
// ==========================================
async function downloadSingleQr() {
  const src = displayedQrImage;
  if (!src) {
    alert(t().msg.noQr);
    return;
  }

  try {
    const blob = await (await fetch(src)).blob();
    const ext = (blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `Payment_QR.${ext}`;
    link.href = objectUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
  } catch (err) {
    console.error('Download QR error:', err);
    window.open(src, '_blank', 'noopener');
  }
}

async function downloadSingleQrFromModal() {
  await downloadSingleQr();
  closeShareModal();
}

function openShareModal() {
  const shareModal = document.getElementById('shareModal');
  if (shareModal) shareModal.style.display = 'flex';
}

function closeShareModal() {
  const shareModal = document.getElementById('shareModal');
  if (shareModal) shareModal.style.display = 'none';
}

async function copyShareLink() {
  const m = t().msg;
  if (!currentShareableLink) {
    alert(m.copyFail);
    return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(currentShareableLink);
    } else {
      const ta = document.createElement('textarea');
      ta.value = currentShareableLink;
      ta.style.cssText = 'position:fixed; opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      if (!ok) throw new Error('copy failed');
    }
    alert(m.linkCopied);
    closeShareModal();
  } catch (err) {
    console.error('Copy link error:', err);
    alert(m.copyFail);
  }
}
