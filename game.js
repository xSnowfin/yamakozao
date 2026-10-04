/* ============================================================
   Lost in the Wind — 蔵王ジャンプ台フェスティバル 謎解きゲーム
   プロトタイプ実装（HTML/CSS/JS 単体・カメラ不要のQR体験シミュレーション）

   仕様：会場に散らばった3つのQRコードを自由な順番で探索する。
   QRコードを読み取る＝その場所の謎が出題されるトリガー。
   謎を解くと羽根を1枚獲得し、マップに戻って別のQRを探せる。
   3つすべて解き終えたら、最終選択パートへ進む。
   ============================================================ */

(() => {
"use strict";

/* ---------------- ゲームデータ ----------------
   各ルートの spots 配列に、その場所固有の謎（title/desc/visual/hint/answer/story）を
   直接ひも付けている。QRコード1つ＝spot1つ＝謎1つ、という1:1対応。          */

const ROUTES = {
  main: {
    label: "温泉の印",
    badgeClass: "main",
    color: "#e6a44a",
    theme: "蔵王温泉の印",
    spots: [
      {
        id:"k1", name:"朱の印", x:100, y:90,
        title:"印その一：朱",
        desc:"<ruby>魔法<rt>まほう</rt></ruby>をかけると、謎が<ruby>浮<rt>う</rt></ruby>かび上がってきた。「<ruby>伝説<rt>でんせつ</rt></ruby>の湯に必要な印」の手がかりになるかもしれない。",
        visual:"今から1900年前、<ruby>日本武尊<rt>やまとたけるのみこと</rt></ruby>に付き<ruby>添<rt>そ</rt></ruby>った人物が蔵王温泉を発見した。<br> 以下の5つのひらがな暗号を正しい順番に並べ替えるとその人物の名前になる。<br><strong>た・ゆ・び・が・き・の</strong><br> 彼のフルネームを答えよ。",
        hint:"フルネームを漢字で書くと吉備多賀由になるよ。",
        answer:["きびのたがゆ"],
        story:"謎を解くと近くから<ruby>不思議<rt>ふしぎ</rt></ruby>な光が…<br>謎を解いた<ruby>証<rt>あかし</rt></ruby>として「<ruby>朱<rt>しゅ</rt></ruby>の印」を手に入れた！",
      },

      {
        id:"k2", name:"琥珀の印", x:220, y:180,
        title:"印その二：琥珀",
        desc:"<ruby>魔法<rt>まほう</rt></ruby>をかけると、謎が<ruby>浮<rt>う</rt></ruby>かび上がってきた。「<ruby>伝説<rt>でんせつ</rt></ruby>の湯に必要な印」の手がかりになるかもしれない。",
        visual:"蔵王温泉の大きな特徴は、東北<ruby>随一<rt>ずいいち</rt></ruby>を誇る<ruby>強酸性<rt>きょうさんせい</rt></ruby>の<ruby>硫黄泉<rt>いおうせん</rt></ruby>であること。<br>肌と血管を<ruby>若返<rt>わかがえ</rt></ruby>らせ、<ruby>殺菌・美肌効果<rt>さっきん・びはだこうか</rt></ruby>があることから何と呼ばれているだろうか？<br>○○○づくりの湯<br>○に当てはまるひらがなを入力せよ。",
        hint:"お肌が<ruby>綺麗<rt>きれい</rt></ruby>になって<ruby>魅力的<rt>みりょくてき</rt></ruby>になる人を表す言葉がはいるよ。",
        answer:["びじん"],
        story:"謎を解くと近くから<ruby>不思議<rt>ふしぎ</rt></ruby>な光が…<br>謎を解いた<ruby>証<rt>あかし</rt></ruby>として「<ruby>琥珀<rt>こはく</rt></ruby>の印」を手に入れた！",
      },

      {
        id:"k3", name:"蒼の印", x:130, y:300,
        title:"印その三：蒼",
        desc:"<ruby>魔法<rt>まほう</rt></ruby>をかけると、謎が<ruby>浮<rt>う</rt></ruby>かび上がってきた。「<ruby>伝説<rt>でんせつ</rt></ruby>の湯に必要な印」の手がかりになるかもしれない。",
        visual:"蔵王温泉で100年以上愛されている、米粉で作られた生地で<ruby>餡<rt>あん</rt></ruby>を<ruby>包<rt>つつ</rt></ruby>み、その上に色のついた<ruby>米粒<rt>こめつぶ</rt></ruby>を乗せた食べ物をいが○○という。<br>○に当てはまる食べ物を答えよ。",
        hint:"その食べ物はお<ruby>正月<rt>しょうがつ</rt></ruby>などにも食べられる、<ruby>米粉<rt>こめこ</rt></ruby>を使った<ruby>和菓子<rt>わかし</rt></ruby>の仲間です。",
        answer:["いがもち","もち"],
        story:"謎を解くと近くから<ruby>不思議<rt>ふしぎ</rt></ruby>な光が…<br>謎を解いた<ruby>証<rt>あかし</rt></ruby>として「<ruby>蒼<rt>そう</rt></ruby>の印」を手に入れた！",
      },

      {
        id:"k4", name:"翆の印", x:400, y:200,
        title:"印その四：翆",
        desc:"<ruby>魔法<rt>まほう</rt></ruby>をかけると、謎が<ruby>浮<rt>う</rt></ruby>かび上がってきた。「<ruby>伝説<rt>でんせつ</rt></ruby>の湯に必要な印」の手がかりになるかもしれない。",
        visual:"蔵王温泉で昔から親しまれている<ruby>名物料理<rt>めいぶつりょうり</rt></ruby>がある。<br>それはとあるお肉と野菜を一緒に焼き、<ruby>甘辛<rt>あまから</rt></ruby>いたれで<ruby>味<rt>あじ</rt></ruby>つけをする。<br>その名物料理はいったいなんだ？",
        hint:"「メェ～」と鳴く動物のお肉を使います。",
        answer:["じんぎすかん","ジンギスカン"],
        story:"謎を解くと近くから<ruby>不思議<rt>ふしぎ</rt></ruby>な光が…<br>謎を解いた<ruby>証<rt>あかし</rt></ruby>として「<ruby>翆<rt>すい</rt></ruby>の印」を手に入れた！",
      },

      {
        id:"k5", name:"山吹の印", x:220, y:180,
        title:"印その五：山吹",
        desc:"<ruby>魔法<rt>まほう</rt></ruby>をかけると、謎が<ruby>浮<rt>う</rt></ruby>かび上がってきた。「<ruby>伝説<rt>でんせつ</rt></ruby>の湯に必要な印」の手がかりになるかもしれない。",
        visual:"蔵王温泉は東北<ruby>随一<rt>ずいいち</rt></ruby>であり、全国でもトップクラスの○性である。<br>○に当てはまる漢字を答えよ。",
        hint:"レモンや梅干しを食べたときのような味を表す漢字です。",
        answer:["酸性","酸"],
        story:"謎を解くと近くから<ruby>不思議<rt>ふしぎ</rt></ruby>な光が…<br>謎を解いた<ruby>証<rt>あかし</rt></ruby>として「<ruby>山吹<rt>やまぶき</rt></ruby>の印」を手に入れた！",
      },
    ],
  },
};

// ストーリー：導入 → ルート選択 → (自由順序で3つのQR/謎) → 最終選択 → エンディング
const STORY = {
  intro: [
    { char: '<img src="images/navi.png" alt="ナレーション">', name:"ナレーション", text:"蔵王温泉に訪れたあなた。" },
    { char: '<img src="images/navi.png" alt="ナレーション">', name:"ナレーション", text:"着いて足湯に入っていると、隣にいた謎の怪しげな男性、に声をかけられる。" },
    { char:'<img src="images/x.png" alt="x">', name:"X", text:"いい湯でしょう..この湯よりもすごい「伝説の湯」をご存じですか" },
    { char: '<img src="images/navi.png" alt="ナレーション">', name:"ナレーション", text:"そう聞くとXは古びた巻物を取り出した。" },
    { char: '<img src="images/x.png" alt="x">', name:"X", text:"この巻物は、伝説の湯について書かれた巻物です" },
    { char: '<img src="images/navi.png" alt="ナレーション">', name:"ナレーション", text:"その巻物には、開湯の祖が遺した「伝説の湯に必要な5つの源泉の印」の存在が記されていた。" },
    { char:'<img src="images/x.png" alt="x">', name:"X", text:"私はこれを調査している者です。5つの源泉の印を集めるには、この土地に隠された謎（クイズ）を解く必要があるのですが…一人では手が足りない。" },
    { char:'<img src="images/x.png" alt="x">', name:"X", text:"そこで、私とバディを組んで、蔵王温泉の真の姿を解き明かしませんか？ " },
    { char: '<img src="images/x.png" alt="x">', name:"X", text:"ありがとうございます！では早速行きましょう！" },
    { char: '<img src="images/navi.png" alt="ナレーション">', name:"ナレーション", text:"そうして、あなたはXと共に蔵王をめぐるミステリーツアーへと踏み出す" },
  ],

  ending: [
    { char:'<img src="images/navi.png" alt="ナレーション">', name:"ナレーション", text:"あなたはいくつかの謎を解き、源泉の印を集めた。" },
    { char:'<img src="images/x.png" alt="x">', name:"X", text:"見事です！私が集めた印と合わせて源泉の印がすべてそろいました！" },
    { char:'<img src="images/x.png" alt="x">', name:"X", text:"これで「伝説の湯」の謎を解き明かすことができます。あなたと一緒に調査できて本当によかったです！" },
    { char:'<img src="images/navi.png" alt="ナレーション">', name:"ナレーション", text:"こうして、あなたとXのミステリーツアーは幕を閉じた。蔵王温泉に隠された謎を、あなたは見事に解き明かした。" },
  ],
};

const MARK_IMAGES = {
  k1: "images/mark1.png",
  k2: "images/mark2.png",
  k3: "images/mark3.png",
  k4: "images/mark4.png",
  k5: "images/mark5.png"
};
/* ---------------- 状態管理 ---------------- */

const STORAGE_KEY = "lostinthewind_save_v3";

let state = {
  route: null,             // 'yuuki' | 'yukemuri'
  solvedSpotIds: [],       // 解決済みspotのid一覧（順不同）
  activeSpotId: null,      // 現在挑戦中の謎に対応するspot id
  phase: "intro",          // intro -> map -> puzzle -> story-inline -> endingStory
  storyStep: 0,
  endingKey: null,
  textSize: "normal",
};

function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && typeof parsed === "object") return parsed;
    }
  }catch(e){}
  return null;
}
function resetState(){
  state = {
    route: null,
    solvedSpotIds: [],
    activeSpotId: null,
    phase: "intro",
    storyStep: 0,
    endingKey: null,
    textSize: "normal"
  };
  saveState();
  applyTextSize();
}

function currentRoute(){
  return ROUTES.main;
}
function findSpot(spotId){
  const route = currentRoute();
  if(!route) return null;
  return route.spots.find(s => s.id === spotId) || null;
}

/* ルートをまたいでspotIdからspotを探す（QRリンク直接アクセス用） */
function findSpotAnywhere(spotId){
  for(const key in ROUTES){
    const spot = ROUTES[key].spots.find(s => s.id === spotId);
    if(spot) return { routeKey:key, spot };
  }
  return null;
}

/* 「冒険を始める」（startAdventure）を通過済みかどうか。
   開始前にQRリンクを直接開いても謎に進めないようにするための判定に使う。 */
function isAdventureStarted(){
  return !!state.route;
}
const NOT_STARTED_MSG =
  "まだ冒険が始まっていないよ。\nトップ画面の「謎を解き明かす」からはじめて、物語を進めよう！";

/* そのspot専用のURL（QRコード生成用）を作る */
function getSpotUrl(spotId){
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("spot", spotId);
  return url.toString();
}

/* ---------------- DOM参照 ---------------- */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const views = {
  top: $("#view-top"),
  story: $("#view-story"),
  minigame: $("#view-minigame"),
  puzzle: $("#view-puzzle"),
  map: $("#view-map"),
  notebook: $("#view-notebook"),
  scan: $("#view-scan"),
};

/* 固定ヘッダー／タブバーの実際の高さをCSS変数に反映する（ミニゲーム画面の高さ計算用）。
   文字サイズ変更・端末の回転・フォント読み込みで高さが変わるので都度更新する。 */
function syncLayoutVars(){
  const header = document.querySelector(".app-header");
  const tab = document.querySelector(".tab-bar");
  const root = document.documentElement.style;
  if(header) root.setProperty("--header-h", header.offsetHeight + "px");
  if(tab) root.setProperty("--tabbar-h", tab.offsetHeight + "px");
}
window.addEventListener("resize", syncLayoutVars);
window.addEventListener("orientationchange", syncLayoutVars);
if(document.fonts && document.fonts.ready) document.fonts.ready.then(syncLayoutVars);

function showView(name){
  // スキップボタンはイントロ中だけ表示（showIntroStep で再表示する）。
  // 謎解決後・エンディングなど他のストーリー画面には出さない。
  const skipBtn = document.getElementById("storySkipBtn");
  if(skipBtn) skipBtn.style.display = "none";
  Object.values(views).forEach(v => v.classList.remove("active"));
  views[name].classList.add("active");
  syncLayoutVars();
  window.scrollTo({top:0, behavior:"instant"});
  updateTabBar(name);
  if(name !== "scan") stopQrCamera();
  if(name !== "minigame"){
    minigameOnComplete = null;
    const frame = document.getElementById("minigameFrame");
    if(frame && frame.src && frame.src !== "about:blank") frame.src = "about:blank";
  }
}

function updateTabBar(name){
  $$(".tab-btn").forEach(btn => {
    const target = btn.dataset.view;
    const map = { top:"view-top", notebook:"view-notebook", map:"view-map", scan:"view-scan" };
    btn.classList.toggle("active", target === map[name]);
  });
}

/* ---------------- 雪片背景 ---------------- */

function initSnowfall(){
  const wrap = $("#snowfall");
  const count = window.innerWidth < 500 ? 22 : 36;
  for(let i=0;i<count;i++){
    const s = document.createElement("span");
    const left = Math.random()*100;
    const dur = 8 + Math.random()*10;
    const delay = Math.random()*10;
    const size = 2 + Math.random()*3;
    s.style.left = left+"vw";
    s.style.width = size+"px";
    s.style.height = size+"px";
    s.style.animationDuration = dur+"s";
    s.style.animationDelay = "-"+delay+"s";
    wrap.appendChild(s);
  }
}

/* ---------------- トップ画面 ---------------- */

function renderTop(){
  const total = 5;
  const solved = state.solvedSpotIds.length;
  const statFeathers = $("#statFeathers");
  const statRoute = $("#statRoute");
  const statQR = $("#statQR");
  if (statFeathers) {
    statFeathers.textContent = `${solved}/${total}`;
  }
  if (statRoute) {
    statRoute.textContent =
      state.route ? ROUTES[state.route].label : "未選択";
  }
  if (statQR) {
    statQR.textContent = `${solved}/${total}`;
  }
}

$("#startBtn").addEventListener("click", () => {
  const hasSave = state.phase !== "intro" || state.route !== null;
  if(hasSave){
    resumeFromState();
  } else {
    playCinematic("♨", "伝説の湯", "5つの源泉の印を集めろ！", "あなたは蔵王温泉に訪れた。", () => {
      beginIntro();
    });
  }
});
$("#continueBtn").addEventListener("click", () => {
  resumeFromState();
});
$("#restartBtn").addEventListener("click", () => {
  if(confirm("最初からやり直しますか？ここまでの記録は消えます。")){
    resetState();
    showView("top");
    renderTop();
  }
});

function applyTextSize() {
    document.body.classList.remove("text-large", "text-xlarge");

    if (state.textSize === "large") {
        document.body.classList.add("text-large");
    } else if (state.textSize === "xlarge") {
        document.body.classList.add("text-xlarge");
    }
    syncLayoutVars();
}

const btn = $("#textSizeBtn");

btn.addEventListener("click", () => {
  if (state.textSize === "normal") {
      state.textSize = "large";
  } else if (state.textSize === "large") {
      state.textSize = "xlarge";
  } else if (state.textSize === "xlarge") {
      state.textSize = "normal";
  }

    applyTextSize();
});

/* ---------------- ストーリー進行 ---------------- */
/* ---------------- シネマティック演出 ---------------- */

function playCinematic(icon, title, subtitle, text, next){
  const cine = $("#cinematic");
  $("#cineIcon").innerHTML = icon;
  $("#cineTitle").textContent = title;
  $("#cineSubTitle").textContent = subtitle;
  $("#cineText").textContent = text;

  cine.classList.remove("hidden");
  setTimeout(() => {
    cine.classList.add("hidden");
    setTimeout(() => { if(next) next(); }, 800);
  }, 3000);
}

let typewriterTimer = null;

function typewriterText(el, text, onDone) {
  clearInterval(typewriterTimer);

  // 1. 一時的なDOM要素を作成してHTML構造を安全にパース
  const temp = document.createElement('div');
  temp.innerHTML = text;

  // 2. ノードを再帰的に走査し、タイピング対象の本文テキストのみ span.tw-char で囲む
  function prepareNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const chars = Array.from(node.textContent);
      const frag = document.createDocumentFragment();
      chars.forEach(c => {
        const span = document.createElement('span');
        span.className = 'tw-char';
        span.style.visibility = 'hidden'; // 初期状態は非表示
        span.textContent = c;
        frag.appendChild(span);
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      if (tagName === 'rt') {
        // ルビテキストはタイピングカウントから外し、初期状態を非表示にする
        node.style.visibility = 'hidden';
        return;
      }
      Array.from(node.childNodes).forEach(prepareNodes);
    }
  }

  Array.from(temp.childNodes).forEach(prepareNodes);
  el.innerHTML = temp.innerHTML;

  // 3. タイピング対象の文字（span.tw-char）を取得
  const charSpans = Array.from(el.querySelectorAll('.tw-char'));
  let index = 0;

  // 4. 順々に文字を表示するタイマー処理
  typewriterTimer = setInterval(() => {
    if (index < charSpans.length) {
      const currentSpan = charSpans[index];
      currentSpan.style.visibility = 'visible';

      // 親文字が表示されたタイミングで、その <ruby> 内のルビ（<rt>）も同時に表示
      const parentRuby = currentSpan.closest('ruby');
      if (parentRuby) {
        const rt = parentRuby.querySelector('rt');
        if (rt) rt.style.visibility = 'visible';
      }

      index++;
    } else {
      clearInterval(typewriterTimer);
      // 完了時に万が一非表示のルビが残っていれば全表示
      el.querySelectorAll('rt').forEach(rt => rt.style.visibility = 'visible');
      if (onDone) onDone();
    }
  }, 30);
}

function showStoryChoices(choices){
  const box = $("#storyChoices");
  box.innerHTML = "";
  choices.forEach(choice =>{
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.textContent = choice.text;
    btn.addEventListener("click",()=>{
      box.innerHTML = "";
      if(choice.next){
        choice.next();
      }
    });
    box.appendChild(btn);
  });
}

function renderProgressStrip(current, total){
  const strip = $("#progressStrip");
  strip.innerHTML = "";
  for(let i=0;i<total;i++){
    const d = document.createElement("div");
    d.className = "progress-dot" + (i < current ? " done" : i === current ? " current" : "");
    strip.appendChild(d);
  }
}

function beginIntro(){
  state.phase = "intro";
  state.storyStep = 0;
  saveState();
  showView("story");
  showIntroStep();
}

function skipIntroStory(){
  // タイプライターを停止
  clearInterval(typewriterTimer);

  const skipBtn = $("#storySkipBtn");
  if(skipBtn) skipBtn.style.display = "none";

  $("#storyChoices").innerHTML = "";

  $("#charEmoji").innerHTML = `<img src="images/navi.png" alt="ナレーション">`;
  $("#storyText").innerHTML = `
    <strong>これまでのあらすじ</strong>
    <br>
    蔵王温泉に訪れたあなたは、足湯に入っていると隣にいた謎
    の怪しげな男Xに声をかけられた。
    <br>
    その男から伝説の湯に必要な5つの源泉の印の存在が書かれた
    巻物を見せられた。
    <br>
    どうやらXは5つの印について調査しているようで、印を集め
    るには土地に隠された謎を解く必要があるらしい。
    <br>
    謎を解くためにX手を組み、蔵王温泉の真の姿を解き明かすこ
    とになった。
    <br>
    <strong>さあ、印を探す冒険へ！</strong>
  `;

  $("#storyNextBtn").style.display = "inline-flex";
  $("#storyNextBtn").textContent = "謎解きへ";
  $("#storyNextBtn").onclick = () => {
    startAdventure();
  };
}

function showIntroStep(){
    // スキップボタンを用意
  let skipBtn = $("#storySkipBtn");

  if(!skipBtn){
    skipBtn = document.createElement("button");
    skipBtn.id = "storySkipBtn";
    skipBtn.className = "btn";
    skipBtn.textContent = "スキップ";
    $("#storyNextBtn").parentElement.appendChild(skipBtn);

    skipBtn.addEventListener("click", skipIntroStory);
  }

  skipBtn.style.display = "inline-flex";
  const total = STORY.intro.length + 1; // +1 for route choice
  renderProgressStrip(state.storyStep, total);
  const step = STORY.intro[state.storyStep];
  $("#charEmoji").innerHTML = step.char;
  $("#charName").innerHTML = step.name;
  $("#storyChoices").innerHTML = "";
  $("#storyNextBtn").style.display = "none";
  typewriterText($("#storyText"), step.text, () => {
     if(state.storyStep === 2){
      showStoryChoices([
        {
          text:"初めて聞いた",
          next:()=>{
            state.storyStep++;
            saveState();
            showIntroStep();
          }
        },
        {
          text:"そんな湯があるの？",
          next:()=>{
            state.storyStep++;
            saveState();
            showIntroStep();
          }
        }
      ]);
      return;
    }
    if(state.storyStep === 7){
      showStoryChoices([
        {
          text:"もちろん！",
          next:()=>{
            state.storyStep++;
            saveState();
            showIntroStep();
          }
        },
        {
          text:"まあ、しょうがない",
          next:()=>{
            state.storyStep++;
            saveState();
            showIntroStep();
          }
        }
      ]);
      return;
    }
    $("#storyNextBtn").style.display = "inline-flex";

    if(state.storyStep < STORY.intro.length - 1){
        $("#storyNextBtn").textContent = "次へ";
        $("#storyNextBtn").onclick = () => {
            state.storyStep++;
            saveState();
            showIntroStep();
        };
    } else {
        $("#storyNextBtn").textContent = "冒険へ";
        $("#storyNextBtn").onclick = () => {
            startAdventure();
        };
    }
  });
}

function startAdventure(){
  state.route = "main";
  state.solvedSpotIds = [];
  state.storyStep = 0;
  state.activeSpotId = null;
  saveState();
  renderTop();
  goToMap();
}

function resumeFromState(){
  if(!state.route){
    playCinematic("♨", "伝説の湯", "源泉の印を集めろ！", "あなたは蔵王温泉に訪れた。", () => {
      beginIntro();
    });
    return;
  }
  if(state.phase === "endingStory"){
    showEndingStory();
  } else {
    // puzzle / story-inline / map いずれも、マップから再開すれば迷わない
    goToMap();
  }
}

/* ---------------- マップ／QR探索パート ----------------
   ルートを選ぶと、まずここに来る。3つのQR（×印）が最初から
   すべて見えており、好きな順にタップして読み取れる。         */

function goToMap(){
  state.phase = "map";
  state.activeSpotId = null;
  saveState();
  renderMap();
  showView("map");
}

function renderMap(){
  const route = currentRoute();
  if(!route) return;

  const solvedCount = state.solvedSpotIds.length;
  $("#mapProgressLabel").textContent = `謎を発見：${solvedCount}/${route.spots.length}（好きな順番で探索できます）`;

  const list = $("#spotList");
  list.innerHTML = "";

  route.spots.forEach((spot) => {
    const found = state.solvedSpotIds.includes(spot.id);

    const item = document.createElement("div");
    item.className = "spot-item" + (found ? " found" : "");

    const mark = document.createElement("span");
    mark.className = "spot-mark";
    mark.textContent = found ? "✓" : "？";
    item.appendChild(mark);

    const name = document.createElement("span");
    name.className = "spot-name";
    name.textContent = spot.name;
    item.appendChild(name);

    const status = document.createElement("span");
    status.className = "spot-status";
    status.textContent = found ? "解決済み" : "未発見";
    item.appendChild(status);

    list.appendChild(item);
  });
}

/* ---------------- 謎パート ----------------
   QRコードを読み取った先で、その場所固有の謎が出題される。   */

function goToPuzzle(spot){
  // どの経路から来ても、冒険開始前は謎に進ませない（最終防衛線）
  if(!isAdventureStarted()){
    alert(NOT_STARTED_MSG);
    renderTop();
    showView("top");
    return;
  }
  if(state.solvedSpotIds.includes(spot.id)){
    alert(`「${spot.name}」の謎はすでに解決済みだよ。まだ見つけていない場所を探してみよう！`);
    goToMap();
    return;
  }

  state.activeSpotId = spot.id;
  saveState();

  if(!MINIGAME_ENABLED){
    showPuzzle(spot);
    return;
  }

  runMinigame(spot, () => {
    playCinematic(
      "✨",
      "ミニゲームクリア！",
      "Something Found",
      "見事にクリアした！\nすると、近くで何かを発見した……",
      () => {
        showPuzzle(spot);
      }
    );
  });
}

/* ---------------- ミニゲーム ----------------
   謎に挑む前に挟む小さなミニゲーム。3種類をiframeで読み込み、
   スポットごとに固定で割り当てる（順番に巡回）。
   各ミニゲームは postMessage({source:"minigame", type:"clear"}) を
   親ページに送るとクリア扱いになる。                                */

const MINIGAME_ENABLED = false;
const CLEAR_COUNT = 3;

const MINIGAME_FILES = [
  "minigame-maze.html",    // 傾け迷路
  "minigame-gesture.html", // 魔法ジェスチャー
  "minigame-vault.html",   // 魔法金庫
];

// スポットIDごとに使うミニゲームを固定で割り当てる。
// （ROUTESの各spotを順番に並べ、3種類を巡回させている）
const MINIGAME_BY_SPOT = {
  k1: "minigame-gesture-shu.html",     // ← 朱の印のスポットidに置き換え
  k2: "minigame-gesture-kohaku.html",  // ← 琥珀の印のスポットidに置き換え
  k3: "minigame-gesture-sou.html",     // ← 蒼の印のスポットidに置き換え
  k4: "minigame-gesture-sui.html",     // ← 翠の印のスポットidに置き換え
  k5: "minigame-gesture-yamabuki.html"
};

let minigameOnComplete = null;

function runMinigame(spot, onComplete){
  if(!MINIGAME_ENABLED){
    onComplete();
    return;
  }

  const file = MINIGAME_BY_SPOT[spot.id] || MINIGAME_FILES[0];

  state.phase = "minigame";
  saveState();
  showView("minigame");

  minigameOnComplete = onComplete;
  $("#minigameFrame").src = file;
}

window.addEventListener("message", (event) => {
  if(!event.data || event.data.source !== "minigame" || event.data.type !== "clear") return;
  if(!minigameOnComplete) return;

  const cb = minigameOnComplete;
  minigameOnComplete = null;
  $("#minigameFrame").src = "about:blank"; // ミニゲームを止める
  cb();
});

function showPuzzle(spot){
  state.phase = "puzzle";
  saveState();

  const route = currentRoute();
  $("#puzzleRouteLabel").textContent = `${route.label} · ${spot.name}`;
  $("#puzzleTitle").textContent = spot.title;
  $("#puzzleDesc").innerHTML = spot.desc;
  $("#puzzleVisual").innerHTML = spot.visual;
  $("#hintBox").classList.remove("show");
  $("#hintBox").innerHTML = spot.hint;
  $("#hintToggle").textContent = "ヒントを見る";
  $("#answerInput").value = "";
  $("#answerFeedback").textContent = "";
  $("#answerFeedback").className = "feedback-msg";
  showView("puzzle");
  $("#answerInput").focus({preventScroll:true});
}

$("#hintToggle").addEventListener("click", () => {
  const box = $("#hintBox");
  const showing = box.classList.toggle("show");
  $("#hintToggle").textContent = showing ? "ヒントを隠す" : "ヒントを見る";
});

$("#puzzleBackBtn").addEventListener("click", () => {
  goToMap();
});

function checkAnswer(){
  const spot = findSpot(state.activeSpotId);
  if(!spot) return;
  const val = $("#answerInput").value.trim();
  if(!val) return;
  const normalized = val.replace(/\s/g,"");
  const correct = spot.answer.some(a => a.replace(/\s/g,"") === normalized);
  const fb = $("#answerFeedback");
  if(correct){
    if(!state.solvedSpotIds.includes(spot.id)){
      state.solvedSpotIds.push(spot.id);
    }
    saveState();

    const markImage = MARK_IMAGES[spot.id];

    playCinematic(
      `<img src="${markImage}" class="cine-mark">`,
      "印を見つけた",
      "Mark Found",
      "伝説の湯に必要な源泉の印だ！",
      () => {
          showFeatherStory(spot);
      }
    );
  } else {
    fb.textContent = "うーん、違うようだ。ヒントを見直してもう一度解いてみよう。";
    fb.className = "feedback-msg ng";
  }
}
$("#answerCheckBtn").addEventListener("click", checkAnswer);
$("#answerInput").addEventListener("keydown", (e) => { if(e.key === "Enter") checkAnswer(); });

/* ---------------- 羽根獲得ストーリー ---------------- */

function showFeatherStory(spot){
  continueFeatherStory();
  function continueFeatherStory(){
    state.phase = "story-inline";
    saveState();

    const route = currentRoute();
    const total = route.spots.length;

    showView("story");
    renderProgressStrip(state.solvedSpotIds.length, total);

    $("#charEmoji").innerHTML = `<img src="images/navi.png" alt="ナレーション">`;
    $("#storyChoices").innerHTML = "";
    $("#storyNextBtn").style.display = "none";

    typewriterText($("#storyText"), spot.story + "\n\n印を1つ、見つけた！", () => {
      $("#storyNextBtn").style.display = "inline-flex";

      const complete = state.solvedSpotIds.length >= CLEAR_COUNT;
      $("#storyNextBtn").textContent = complete ? "Xに集めた印を見せる" : "謎一覧へ戻る";

      $("#storyNextBtn").onclick = () => {
        if(complete){
          playCinematic("♨", "印がそろった", "Legendary Spring", "Xに集めた印を見せよう", () => {
            showEndingStory(true);
          });
        } else {
          goToMap();
        }
      };
    });
  }
}
function showEndingStory(resetStep = false){
  state.phase = "endingStory";

  if(resetStep){
    state.storyStep = 0;
  }

  saveState();
  showView("story");
  showEndingStep();
}

function showEndingStep(){
  const total = STORY.ending.length;
  const step = STORY.ending[state.storyStep];

  renderProgressStrip(state.storyStep + 1, total);
  $("#charEmoji").innerHTML = step.char;
  $("#charName").innerHTML = step.name;
  $("#storyChoices").innerHTML = "";
  $("#storyNextBtn").style.display = "none";

  typewriterText($("#storyText"), step.text, () => {
    $("#storyNextBtn").style.display = "inline-flex";

    if(state.storyStep < total - 1){
      $("#storyNextBtn").textContent = "次へ";
      $("#storyNextBtn").onclick = () => {
        state.storyStep++;
        saveState();
        showEndingStep();
      };
    } else {
      state.phase = "endingStory";
      state.endingKey = "completed";
      saveState();
      $("#storyNextBtn").textContent = "アンケートに答える";
      $("#storyNextBtn").onclick = () => {
        window.open("https://docs.google.com/forms/d/e/1FAIpQLSeX7dR5Sr9WZoaccxxggb6uv9oWOC-R_nReghmBqgH6MJShsw/viewform?usp=publish-editor", "_blank");
      };
    }
  });
}

/* ---------------- 冒険の書（ノートブック） ---------------- */

const NOTEBOOK_PAGES = [
  {
    key:"map", label:"会場マップ",
    render:() => `<div class="card"><div class="eyebrow">会場マップ</div><p class="lead">会場に隠された5つのQRコードのうち3つを、好きな順番で探し出そう。「探索」タブでは、どの謎をすでに解いたかを確認できます。</p></div>`,
  },
  {
    key:"record", label:"印の記録",
    render:() => {
      const route = currentRoute();
      const total = route ? route.spots.length : 3;
      let chips = "";
      if(route){
        route.spots.forEach(spot => {
          const has = state.solvedSpotIds.includes(spot.id);
          chips += `<span class="feather-chip${has ? "" : " empty"}">${has ? "🪶 " + spot.name : "未発見：" + spot.name}</span>`;
        });
      } else {
        chips = `<span class="feather-chip empty">まだ道を選んでいません</span>`;
      }
      return `<div class="card">
        <div class="eyebrow">羽根の記録欄</div>
        <p class="lead" style="margin-bottom:10px;">これまでに集めた印：${state.solvedSpotIds.length} / ${total}</p>
        <div class="feather-log">${chips}</div>
      </div>`;
    },
  },
];

function renderNotebook(){
  const tabsWrap = $("#notebookTabs");
  const pagesWrap = $("#notebookPages");
  tabsWrap.innerHTML = "";
  pagesWrap.innerHTML = "";

  NOTEBOOK_PAGES.forEach((page, idx) => {
    const tab = document.createElement("button");
    tab.className = "ntab" + (idx===0 ? " active" : "");
    tab.textContent = page.label;
    tab.addEventListener("click", () => {
      $$(".ntab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      $$(".notebook-page").forEach(p => p.classList.remove("active"));
      document.getElementById("np-"+page.key).classList.add("active");
    });
    tabsWrap.appendChild(tab);

    const pageEl = document.createElement("div");
    pageEl.className = "notebook-page" + (idx===0 ? " active" : "");
    pageEl.id = "np-"+page.key;
    pageEl.innerHTML = page.render();
    pagesWrap.appendChild(pageEl);
  });
}

/* ---------------- タブナビゲーション ---------------- */

$$(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.view;
    if(target === "view-top"){
      showView("top");
      renderTop();
    } else if(target === "view-notebook"){
      renderNotebook();
      showView("notebook");
    } else if(target === "view-map"){
      if(!state.route){
        alert("まだ冒険が始まっていないよ。\nトップ画面の「謎を解き明かす」からはじめて、物語を進めよう！");
        return;
      }
      renderMap();
      showView("map");
    } else if(target === "view-scan"){
      resetScanView();
      showView("scan");
    }
  });
});

/* ---------------- QRカメラスキャン ----------------
   ページ内でカメラを起動し、QRコードを直接読み取る。
   QRコードには「このゲームのURL + ?spot=スポットID」が埋め込まれている
   前提で、jsQRでデコードした文字列からspotパラメータを取り出して
   該当の謎へ遷移する。                                              */

let scanStream = null;
let scanRAF = null;

function resetScanView(){
  $("#scanIdle").style.display = "flex";
  $("#scanWrap").style.display = "none";
  $("#scanStartBtn").style.display = "inline-flex";
  $("#scanStopBtn").style.display = "none";
  $("#scanStatus").textContent = "";
}

function stopQrCamera(){
  if(scanRAF){
    cancelAnimationFrame(scanRAF);
    scanRAF = null;
  }
  if(scanStream){
    scanStream.getTracks().forEach(t => t.stop());
    scanStream = null;
  }
}

async function startQrCamera(){
  const statusEl = $("#scanStatus");
  if(typeof jsQR === "undefined"){
    statusEl.textContent = "QR読み取り機能の読み込みに失敗しました。通信環境をご確認ください。";
    return;
  }
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    statusEl.textContent = "このブラウザではカメラを利用できません。端末のカメラアプリでQRコードを読み取ってください。";
    return;
  }

  try{
    scanStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } }
    });
  } catch(err) {
    console.error("カメラ起動エラー:", err);

    let message = "カメラを起動できませんでした。";

    if (err.name === "NotAllowedError") {
      message = "カメラの使用が許可されていません。ブラウザの設定を確認してください。";
    } else if (err.name === "NotFoundError") {
      message = "カメラが見つかりませんでした。";
    } else if (err.name === "NotReadableError") {
      message = "カメラを別のアプリが使用している可能性があります。";
    } else if (err.name === "SecurityError") {
      message = "このページではカメラを使用できません。";
    } else {
      message += ` (${err.name})`;
    }

    statusEl.textContent = message;
    return;
  }
  const video = $("#scanVideo");
  video.srcObject = scanStream;
  await video.play();

  $("#scanIdle").style.display = "none";
  $("#scanWrap").style.display = "block";
  $("#scanStartBtn").style.display = "none";
  $("#scanStopBtn").style.display = "inline-flex";
  statusEl.textContent = "QRコードを枠内に収めてください。";

  const canvas = $("#scanCanvas");
  const ctx = canvas.getContext("2d");

  function tick(){
    if(!scanStream) return;
    if(video.readyState === video.HAVE_ENOUGH_DATA){
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });
      if(code && code.data){
        handleScannedText(code.data);
        return; // handleScannedText側で停止・遷移する
      }
    }
    scanRAF = requestAnimationFrame(tick);
  }
  scanRAF = requestAnimationFrame(tick);
}

function handleScannedText(text){
  let spotId = null;
  try{
    const url = new URL(text, window.location.href);
    spotId = url.searchParams.get("spot");
  } catch(err){
    spotId = null;
  }

  if(!spotId){
    $("#scanStatus").textContent = "このゲームのQRコードではないようです。もう一度読み取ってください。";
    scanRAF = requestAnimationFrame(function retry(){
      // 数フレーム待ってからスキャン継続（連続誤検知を避ける）
      const video = $("#scanVideo");
      const canvas = $("#scanCanvas");
      if(!scanStream || video.readyState !== video.HAVE_ENOUGH_DATA){
        scanRAF = requestAnimationFrame(retry);
        return;
      }
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
      if(code && code.data){
        handleScannedText(code.data);
      } else {
        scanRAF = requestAnimationFrame(retry);
      }
    });
    return;
  }

  const found = findSpotAnywhere(spotId);
  stopQrCamera();

  if(!found){
    $("#scanStatus").textContent = "対応する謎が見つかりませんでした。もう一度お試しください。";
    return;
  }

  const { routeKey, spot } = found;

  // 冒険を始める前はQRを読んでも謎に進ませない
  if(!isAdventureStarted()){
    alert(NOT_STARTED_MSG);
    resetScanView();
    renderTop();
    showView("top");
    return;
  }

  // 別ルートのQRだった場合は解かせず、選択中ルートのマップへ戻す
  if(state.route && state.route !== routeKey){
    const currentRouteLabel = ROUTES[state.route] ? ROUTES[state.route].label : "選んだ道";
    alert(`このQRコードは「${ROUTES[routeKey].label}」のものだよ。今は「${currentRouteLabel}」を探索中だから、この謎には進めないよ。`);
    resetScanView();
    renderMap();
    showView("map");
    return;
  }

  state.endingKey = null;
  saveState();
  renderTop();

  goToPuzzle(spot);
}

$("#scanStartBtn").addEventListener("click", startQrCamera);
$("#scanStopBtn").addEventListener("click", () => {
  stopQrCamera();
  resetScanView();
});

/* ---------------- URLリンク直接アクセス（QRコード用） ----------------
   各謎（spot）にQRコードを用意する予定。
   QRコードには「このゲームのURL + ?spot=スポットID」を埋め込んでおけば、
   読み取るだけでその謎が直接開く。以下はその処理と、
   リンク一覧を確認するための簡易admin画面。                          */

function showAdminLinks(){
  const wrap = document.createElement("div");
  wrap.id = "adminLinksOverlay";
  wrap.style.cssText = "position:fixed;inset:0;background:#0d232d;color:#f4f7f5;z-index:99999;overflow:auto;padding:24px;font-family:sans-serif;";

  let html = "<h1 style='margin-bottom:6px;font-size:20px;'>QRコード用リンク一覧</h1>";
  html += "<p style='font-size:13px;opacity:0.7;margin-bottom:20px;'>各URLをQRコード生成サービスに貼り付けて、対応するスポットにQRコードを設置してください。</p>";

  Object.entries(ROUTES).forEach(([key, route]) => {
    html += `<h2 style="margin:20px 0 10px;color:#e0a951;font-size:16px;">${route.label}</h2>`;
    route.spots.forEach(spot => {
      const url = getSpotUrl(spot.id);
      html += `
        <div style="margin-bottom:12px;padding:12px 14px;border:1px solid rgba(244,247,245,0.16);border-radius:8px;">
          <div style="font-weight:bold;font-size:14px;">${spot.name}（id: ${spot.id}）</div>
          <div style="word-break:break-all;font-size:12.5px;margin-top:6px;">
            <a href="${url}" style="color:#8fd4a8;">${url}</a>
          </div>
        </div>`;
    });
  });

  html += "<button id='adminCloseBtn' style='margin-top:10px;padding:10px 16px;border-radius:8px;border:none;background:#e0a951;color:#0d232d;font-weight:bold;cursor:pointer;'>閉じる</button>";
  wrap.innerHTML = html;
  document.body.appendChild(wrap);
  document.getElementById("adminCloseBtn").addEventListener("click", () => wrap.remove());
}

/* URLパラメータを見て、QRリンク経由のアクセスかどうか判定・処理する。
   処理した場合は true を返す（通常のトップ画面表示をスキップするため）。 */
function handleUrlParams(){
  const params = new URLSearchParams(window.location.search);

  if(params.get("admin") === "1"){
    showAdminLinks();
    return false; // admin画面はオーバーレイなので、裏側は通常通り表示してOK
  }

  const spotId = params.get("spot");
  if(!spotId) return false;

  const found = findSpotAnywhere(spotId);
  if(!found){
    alert("指定された謎が見つかりませんでした。QRコードをもう一度確認してください。");
    return false;
  }

  const { routeKey, spot } = found;

  // 冒険を始める前にリンクを直接開いても、謎には進ませずトップへ戻す。
  // （以前は、ここでルートを勝手に選択してしまい、導入ストーリーを飛ばして解けてしまっていた）
  if(!isAdventureStarted()){
    history.replaceState(null, "", window.location.pathname + window.location.hash);
    renderTop();
    showView("top");
    alert(NOT_STARTED_MSG);
    return true;
  }

  // すでに別ルートを選択済みで、かつQRが別ルートのものだった場合は
  // 進行させず、選んだルートのマップに戻す（誤って別ルートの問題を
  // 解いてしまうのを防ぐ）。
  if(state.route && state.route !== routeKey){
    const currentRouteLabel = ROUTES[state.route] ? ROUTES[state.route].label : "選んだ道";
    alert(`このQRコードは「${ROUTES[routeKey].label}」のものだよ。今は「${currentRouteLabel}」を探索中だから、この謎には進めないよ。`);
    history.replaceState(null, "", window.location.pathname + window.location.hash);
    if(state.phase === "intro"){
      state.phase = "map";
      saveState();
    }
    renderTop();
    if(state.route){
      renderMap();
      showView("map");
    } else {
      showView("top");
    }
    return true;
  }

  state.endingKey = null;
  saveState();
  renderTop();

  goToPuzzle(spot);

  // URLをきれいにしておく（リロードや戻るボタンでの誤動作を防ぐ）
  history.replaceState(null, "", window.location.pathname + window.location.hash);

  return true;
}

/* ---------------- 初期化 ---------------- */

function init(){
  initSnowfall();
  const saved = loadState();
  if(saved) state = Object.assign(
    { route:null, solvedSpotIds:[], activeSpotId:null, phase:"intro", storyStep:0, endingKey:null },
    saved
  );
  renderTop();

  const handledByUrl = handleUrlParams();
  applyTextSize();
  if(!handledByUrl){
    showView("top");
  }
}

init();

})();
