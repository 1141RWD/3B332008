function enterSite() {
    const hero = document.getElementById('hero');
    hero.classList.add('hero-fade-out');
    
    setTimeout(() => {
        hero.style.display = 'none';
        document.body.classList.remove('site-hidden');
        initApp(); 
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('site-hidden');
    initParticles();
    initMouseGlow();
    
    // 漢堡選單與下拉選單邏輯
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');
    const dropdown = document.querySelector('.dropdown');

    if (burgerMenu) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('open');
            navLinks.classList.toggle('active');
        });
    }

    // 手機版下拉點擊 (點擊 "關於 F1" 展開子選單)
    const dropbtn = document.querySelector('.dropbtn');
    if (dropbtn) {
        dropbtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                dropdown.classList.toggle('open');
            }
        });
    }

    // 點擊連結後自動關閉菜單 (手機版)
    document.querySelectorAll('.nav-links a:not(.dropbtn)').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (burgerMenu) burgerMenu.classList.remove('open');
        });
    });
});

function initApp() {
    renderStandings(); // 渲染積分榜與領獎台
    renderDrivers();   // 渲染車手卡片
    renderTeams();     // 渲染車隊卡片
    renderTracks();    // 渲染賽道資訊
    initGame();        // 初始化反應遊戲
}

// =========================================
// === 導覽邏輯 (頁面切換) ===
// =========================================

function navigateTo(pageId) {
    // 隱藏所有頁面
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    
    // 顯示目標頁面 (對應 id 為 pageId + "-page")
    const target = document.getElementById(pageId + '-page');
    if (target) {
        target.classList.add('active');
    }

    // 更新導覽列 Active 狀態
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(`'${pageId}'`)) {
            a.classList.add('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 切換「關於 F1」內部的標籤頁
function switchAboutTab(tabId) {
    document.querySelectorAll('.about-menu li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.about-tab-panel').forEach(panel => panel.classList.remove('active'));
    
    const targetTab = document.getElementById('tab-' + tabId);
    const targetContent = document.getElementById('content-' + tabId);
    if(targetTab) targetTab.classList.add('active');
    if(targetContent) targetContent.classList.add('active');
}

// 跳轉到「關於 F1」大頁面並切換標籤
function navigateToAbout(tabId) {
    navigateTo('about-f1'); 
    switchAboutTab(tabId);            
}

// =========================================
// === 首頁圖片輪播邏輯 ===
// =========================================

let currentSlide = 0;
function moveSlide(n) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(() => {
    moveSlide(1);
}, 5000);

// =========================================
// === 數據定義 ===
// =========================================

const tracks = [
    { name: "第一輪：澳洲", location: "Melbourne", length: "5.278 km", laps: 58, record: "1:19.813", layout: "01澳洲.jpg" },
    { name: "第二輪：中國", location: "Shanghai", length: "5.451 km", laps: 56, record: "1:32.238", layout: "02中國.jpg" },
    { name: "第三輪：日本", location: "Suzuka", length: "5.807 km", laps: 53, record: "1:30.983", layout: "03日本.jpg" },
    { name: "第四輪：巴林", location: "Sakhir", length: "5.412 km", laps: 57, record: "1:31.447", layout: "04巴林.jpg" },
    { name: "第五輪：沙烏地阿拉伯", location: "Jeddah", length: "6.174 km", laps: 50, record: "1:30.734", layout: "05沙烏地阿拉伯.jpg" },
    { name: "第六輪：邁阿密", location: "Miami", length: "5.412 km", laps: 57, record: "1:29.708", layout: "06邁阿密.jpg" },
    { name: "第七輪：義大利", location: "Imola", length: "4.909 km", laps: 63, record: "1:15.484", layout: "07伊莫拉.jpg" },
    { name: "第八輪：摩納哥", location: "Monte Carlo", length: "3.337 km", laps: 78, record: "1:12.909", layout: "08摩納哥.jpg" },
    { name: "第九輪：西班牙", location: "Barcelona", length: "4.657 km", laps: 66, record: "1:18.149", layout: "09巴塞隆納.jpg" },
    { name: "第十輪：加拿大", location: "Montreal", length: "4.361 km", laps: 70, record: "1:13.078", layout: "10加拿大.jpg" },
    { name: "第十一輪：奧地利", location: "Spielberg", length: "4.318 km", laps: 71, record: "1:05.619", layout: "11奧地利.jpg" },
    { name: "第十二輪：英國", location: "Silverstone", length: "5.891 km", laps: 52, record: "1:27.097", layout: "12銀石賽道.jpg" },
    { name: "第十三輪：比利時", location: "Spa", length: "7.004 km", laps: 44, record: "1:46.286", layout: "13SPA.jpg" },
    { name: "第十四輪：匈牙利", location: "Budapest", length: "4.381 km", laps: 70, record: "1:16.627", layout: "14匈牙利.jpg" },
    { name: "第十五輪：荷蘭", location: "Zandvoort", length: "4.259 km", laps: 72, record: "1:11.097", layout: "15荷蘭.jpg" },
    { name: "第十六輪：義大利", location: "Monza", length: "5.793 km", laps: 53, record: "1:21.046", layout: "16Monza.jpg" },
    { name: "第十七輪：亞塞拜然", location: "Baku", length: "6.003 km", laps: 51, record: "1:43.009", layout: "17巴庫城市賽.jpg" },
    { name: "第十八輪：新加坡", location: "Marina Bay", length: "4.940 km", laps: 62, record: "1:35.867", layout: "18濱海灣街道賽.jpg" },
    { name: "第十九輪：美國", location: "Austin", length: "5.513 km", laps: 56, record: "1:36.169", layout: "19美州賽道.jpg" },
    { name: "第二十輪：墨西哥", location: "Mexico City", length: "4.304 km", laps: 71, record: "1:17.774", layout: "20墨西哥.jpg" },
    { name: "第二十一輪：巴西", location: "Sao Paulo", length: "4.309 km", laps: 71, record: "1:10.540", layout: "21巴西.jpg" },
    { name: "第二十二輪：拉斯維加斯", location: "Las Vegas", length: "6.201 km", laps: 50, record: "1:34.876", layout: "22拉斯維加斯.jpg" },
    { name: "第二十三輪：卡達", location: "Lusail", length: "5.419 km", laps: 57, record: "1:24.319", layout: "23卡達.jpg" },
    { name: "第二十四輪：阿布達比", location: "Yas Marina", length: "5.281 km", laps: 58, record: "1:26.103", layout: "24阿布達比.jpg" }
];

const drivers = [
    // Red Bull
    { name: "Max Verstappen", team: "Red Bull", number: 1, country: "荷蘭", flag: "🇳🇱", podiums: 107, wc: 3, points: 400, bio: "當代最強車手，開啟了紅牛王朝。他是狂熱的模擬賽車手。", fun: "曾在F1比賽周凌晨參加電競耐力賽並奪冠。", ig: "maxverstappen1", x: "Max33Verstappen", img: "https://media.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png" },
    { name: "Liam Lawson", team: "Red Bull", number: 30, country: "紐西蘭", flag: "🇳🇿", podiums: 0, wc: 0, points: 120, bio: "紐西蘭新星，經歷多年代打與磨練後終於升上大隊。", fun: "是自布蘭登哈特利以來第一位紐西蘭F1車手。", ig: "liamlawson30", x: "LiamLawson30", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png" },
    // Ferrari
    { name: "Charles Leclerc", team: "Ferrari", number: 16, country: "摩納哥", flag: "🇲🇨", podiums: 39, wc: 0, points: 350, bio: "摩納哥之子，法拉利的希望。擁有極致的排位賽速度。", fun: "他是一位才華橫溢的鋼琴家，發行過多首單曲。", ig: "charles_leclerc", x: "Charles_Leclerc", img: "https://media.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png" },
    { name: "Lewis Hamilton", team: "Ferrari", number: 44, country: "英國", flag: "🇬🇧", podiums: 201, wc: 7, points: 300, bio: "F1傳奇，2025年震撼轉投法拉利，挑戰生涯第八冠。", fun: "他擁有一隻名叫 Roscoe 的名氣鬥牛犬。", ig: "lewishamilton", x: "LewisHamilton", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png" },
    // McLaren
    { name: "Lando Norris", team: "McLaren", number: 4, country: "英國", flag: "🇬🇧", podiums: 25, wc: 0, points: 423, bio: "邁凱倫領軍人物，2024年起正式跨入世界冠軍爭奪者行列。", fun: "他是電競戰隊 Quadrant 的創辦人。", ig: "landonorris", x: "LandoNorris", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png" },
    { name: "Oscar Piastri", team: "McLaren", number: 81, country: "澳洲", flag: "🇦🇺", podiums: 9, wc: 0, points: 380, bio: "冷靜沉著的天才，被譽為「機器人」。", fun: "他在F3、F2、F1都是第一年就展現驚人實力。", ig: "oscarpiastri", x: "OscarPiastri", img: "https://media.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png" },
    // Mercedes
    { name: "George Russell", team: "Mercedes", number: 63, country: "英國", flag: "🇬🇧", podiums: 14, wc: 0, points: 280, bio: "梅賽德斯的新核心，以穩定性著稱。", fun: "他是車手協會(GPDA)的理事。", ig: "georgerussell63", x: "GeorgeRussell63", img: "https://media.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png" },
    { name: "Kimi Antonelli", team: "Mercedes", number: 12, country: "義大利", flag: "🇮🇹", podiums: 0, wc: 0, points: 50, bio: "18歲直升F1的超級新人，被視為下一個天才。", fun: "他的名字是為了致敬 Kimi Raikkonen。", ig: "kimi.antonelli", x: "", img: "https://media.formula1.com/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png" },
    // Aston Martin
    { name: "Fernando Alonso", team: "Aston Martin", number: 14, country: "西班牙", flag: "🇪🇸", podiums: 106, wc: 2, points: 200, bio: "圍場不老傳奇，43歲依然保持巔峰狀態。", fun: "他擁有自己的個人品牌 Kimoa。", ig: "fernandoalo_oficial", x: "alo_oficial", img: "https://media.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png" },
    { name: "Lance Stroll", team: "Aston Martin", number: 18, country: "加拿大", flag: "🇨🇦", podiums: 3, wc: 0, points: 80, bio: "雖然背負壓力，但在雨戰中極具天賦。", fun: "他的父親是阿斯頓馬丁車隊的老闆。", ig: "lance_stroll", x: "lance_stroll", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png" },
    // Williams
    { name: "Alexander Albon", team: "Williams", number: 23, country: "泰國", flag: "🇹🇭", podiums: 2, wc: 0, points: 60, bio: "泰國之光，成功帶領威廉姆斯復興。", fun: "他有一大群寵物，自稱是農場主人。", ig: "alex_albon", x: "alex_albon", img: "https://media.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png" },
    { name: "Carlos Sainz", team: "Williams", number: 55, country: "西班牙", flag: "🇪🇸", podiums: 25, wc: 0, points: 180, bio: "智商型車手，2025年轉會威廉姆斯。", fun: "外號 Smooth Operator，愛在電台唱歌。", ig: "carlossainz55", x: "Carlossainz55", img: "https://media.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png" },
    // Alpine
    { name: "Pierre Gasly", team: "Alpine", number: 10, country: "法國", flag: "🇫🇷", podiums: 4, wc: 0, points: 90, bio: "阿爾派的法國大將，曾獲一場分站冠軍。", fun: "他與勒克萊爾是兒時玩伴。", ig: "pierregasly", x: "PierreGASLY", img: "https://media.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png" },
    { name: "Jack Doohan", team: "Alpine", number: 7, country: "澳洲", flag: "🇦🇺", podiums: 0, wc: 0, points: 20, bio: "MotoGP傳奇之子，2025迎來首個完整賽季。", fun: "其父是五屆MotoGP世界冠軍。", ig: "jackdoohan", x: "jackdoohan33", img: "https://media.formula1.com/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png" },
    // RB
    { name: "Yuki Tsunoda", team: "RB", number: 22, country: "日本", flag: "🇯🇵", podiums: 0, wc: 0, points: 45, bio: "火爆日本車手，速度逐年進化。", fun: "他在義大利隊工作最大的愛好是意麵。", ig: "yukitsunoda0511", x: "yukitsunoda0511", img: "https://media.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png" },
    { name: "Isack Hadjar", team: "RB", number: 6, country: "法國", flag: "🇫🇷", podiums: 0, wc: 0, points: 10, bio: "紅牛青訓最新的攻擊型車手。", fun: "他在F2時期以瘋狂超車著稱。", ig: "isackhadjar", x: "", img: "https://media.formula1.com/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png" },
    // Haas
    { name: "Esteban Ocon", team: "Haas", number: 31, country: "法國", flag: "🇫🇷", podiums: 3, wc: 0, points: 70, bio: "硬派防守大師，2025年加盟哈斯。", fun: "小時候全家住在露營車供他賽車。", ig: "estebanocon", x: "OconEsteban", img: "https://media.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png" },
    { name: "Oliver Bearman", team: "Haas", number: 87, country: "英國", flag: "🇬🇧", podiums: 0, wc: 0, points: 30, bio: "2024一代名將，2025正式出道。", fun: "他在代打法拉利時甚至還在請病假。", ig: "olliebearman", x: "OllieBearman", img: "https://media.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png" },
    // Sauber
    { name: "Nico Hulkenberg", team: "Sauber", number: 27, country: "德國", flag: "🇩🇪", podiums: 0, wc: 0, points: 25, bio: "排位賽專家，為奧迪進駐做準備。", fun: "他是2015年勒芒冠軍。", ig: "hulkhulkenberg", x: "HulkHulkenberg", img: "https://media.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png" },
    { name: "Gabriel Bortoleto", team: "Sauber", number: 5, country: "巴西", flag: "🇧🇷", podiums: 0, wc: 0, points: 5, bio: "巴西新生代希望，2025最新面孔。", fun: "經紀人是阿隆索。", ig: "gabrielbortoleto_", x: "", img: "https://media.formula1.com/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png" }
];

const teams = [
    { name: "McLaren", base: "Woking, UK", chief: "Andrea Stella", engine: "Mercedes", wc: 8, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/mclaren-logo.png" },
    { name: "Ferrari", base: "Maranello, Italy", chief: "Fred Vasseur", engine: "Ferrari", wc: 16, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/ferrari-logo.png" },
    { name: "Red Bull Racing", base: "Milton Keynes, UK", chief: "Christian Horner", engine: "Honda RBPT", wc: 6, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/red-bull-racing-logo.png" },
    { name: "Mercedes", base: "Brackley, UK", chief: "Toto Wolff", engine: "Mercedes", wc: 8, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/mercedes-logo.png" },
    { name: "Aston Martin", base: "Silverstone, UK", chief: "Mike Krack", engine: "Mercedes", wc: 0, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/aston-martin-logo.png" },
    { name: "Alpine", base: "Enstone, UK", chief: "Oliver Oakes", engine: "Renault", wc: 2, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/alpine-logo.png" },
    { name: "Williams", base: "Grove, UK", chief: "James Vowles", engine: "Mercedes", wc: 9, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/williams-logo.png" },
    { name: "RB", base: "Faenza, Italy", chief: "Laurent Mekies", engine: "Honda RBPT", wc: 0, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/rb-logo.png" },
    { name: "Stake F1 Team", base: "Hinwil, Switzerland", chief: "Mattia Binotto", engine: "Ferrari", wc: 0, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/kick-sauber-logo.png" },
    { name: "Haas", base: "Kannapolis, USA", chief: "Ayao Komatsu", engine: "Ferrari", wc: 0, img: "https://media.formula1.com/content/dam/fom-website/teams/2025/haas-f1-team-logo.png" }
];

// =========================================
// === 渲染功能 ===
// =========================================

// --- 積分榜與領獎台 ---
function renderStandings() {
    const sorted = [...drivers].sort((a, b) => b.points - a.points);
    const top3 = sorted.slice(0, 3);
    const mainBody = document.getElementById('standingsListBody');
    const moreBody = document.getElementById('standingsMoreBody');

    // 渲染領獎台 (2-1-3 順序)
    const podiumMap = [
        { id: 'podium-2', data: top3[1] },
        { id: 'podium-1', data: top3[0] },
        { id: 'podium-3', data: top3[2] }
    ];

    podiumMap.forEach(p => {
        const el = document.getElementById(p.id);
        if (el && p.data) {
            el.innerHTML = `
                <div class="podium-driver">
                    <img src="${p.data.img}" alt="${p.data.name}">
                    <div class="podium-info">
                        <span class="p-rank">${p.id.split('-')[1]}</span>
                        <span class="p-name">${p.data.name}</span>
                        <span class="p-points">${p.data.points} PTS</span>
                    </div>
                </div>
            `;
        }
    });

    // 渲染表格
    mainBody.innerHTML = '';
    moreBody.innerHTML = '';
    sorted.forEach((d, i) => {
        const row = `<tr><td>${i+1}</td><td>${d.name}</td><td>${d.team}</td><td style="text-align:right;">${d.points}</td></tr>`;
        if (i < 5) mainBody.innerHTML += row;
        else moreBody.innerHTML += row;
    });
}

function toggleStandings() {
    const more = document.getElementById('standingsMoreBody');
    const btn = document.getElementById('toggleStandingsBtn');
    more.classList.toggle('hidden');
    btn.innerHTML = more.classList.contains('hidden') ? 
        '<span>顯示更多</span> <i class="fas fa-chevron-down"></i>' : 
        '<span>收合內容</span> <i class="fas fa-chevron-up"></i>';
}

// --- 車手卡片 ---
function renderDrivers(filterText = '') {
    const container = document.getElementById('driverGridContainer');
    if (!container) return;
    container.innerHTML = '';
    
    drivers.forEach(driver => {
        if (driver.name.toLowerCase().includes(filterText.toLowerCase()) || 
            driver.team.toLowerCase().includes(filterText.toLowerCase())) {
            
            const card = document.createElement('div');
            card.className = 'data-card';
            card.innerHTML = `
                <div class="card-header">
                    <img src="${driver.img}" alt="${driver.name}">
                    <div class="flag-circle">${driver.flag}</div>
                </div>
                <div class="card-content">
                    <h3>${driver.name}</h3>
                    <p>${driver.team} #${driver.number}</p>
                    <p>積分: <span class="stat-number">${driver.points}</span></p>
                </div>
            `;
            card.onclick = () => showModal(driver);
            container.appendChild(card);
        }
    });
}

// --- 車隊卡片 ---
function renderTeams() {
    const container = document.getElementById('teamGridContainer');
    if (!container) return;
    container.innerHTML = '';
    teams.forEach(team => {
        const card = document.createElement('div');
        card.className = 'data-card';
        card.innerHTML = `
            <div class="card-header" style="background: white; padding: 20px;">
                <img src="${team.img}" alt="${team.name}" style="object-fit: contain;">
            </div>
            <div class="card-content">
                <h3>${team.name}</h3>
                <p>領隊: ${team.chief}</p>
                <p>引擎: ${team.engine}</p>
                <p>世界冠軍: <span class="stat-number">${team.wc}</span></p>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 賽道渲染 ---
function renderTracks() {
    const tabsContainer = document.getElementById('trackTabs');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';
    tracks.forEach((track, index) => {
        const btn = document.createElement('button');
        btn.className = `track-tab-button ${index === 0 ? 'active' : ''}`;
        btn.textContent = track.name;
        btn.onclick = () => switchTrack(index);
        tabsContainer.appendChild(btn);
    });
    updateTrackContent(0);
}

function switchTrack(index) {
    document.querySelectorAll('.track-tab-button').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    updateTrackContent(index);
}

function updateTrackContent(index) {
    const track = tracks[index];
    const container = document.getElementById('trackContents');
    container.innerHTML = `
        <div class="track-content-item neon-flow">
            <div class="track-info">
                <h3 style="font-size: 2.5rem; margin-bottom: 20px;">${track.name}</h3>
                <p style="color: #aaa; margin-bottom: 30px; font-size: 1.2rem;">
                    <i class="fas fa-map-marker-alt" style="color: var(--f1-red);"></i> ${track.location}
                </p>
                <div class="track-stats">
                    <div class="track-stat-item"><h4>長度</h4><span class="stat-number">${track.length}</span></div>
                    <div class="track-stat-item"><h4>圈數</h4><span class="stat-number">${track.laps}</span></div>
                    <div class="track-stat-item"><h4>紀錄</h4><span style="color:white; font-size: 0.9rem;">${track.record}</span></div>
                </div>
            </div>
            <div class="track-map">
                <img src="${track.layout}" class="track-map-image" alt="Layout">
            </div>
        </div>
    `;
}

// =========================================
// === 其他功能 (搜尋, Modal, 粒子, 遊戲) ===
// =========================================

function handleSearch() {
    const query = document.getElementById('globalSearch').value;
    navigateTo('drivers');
    renderDrivers(query);
}

function showModal(driver) {
    const modal = document.getElementById('infoModal');
    document.getElementById('modalImg').src = driver.img;
    document.getElementById('modalName').textContent = driver.name;
    document.getElementById('modalTeam').textContent = `${driver.team} #${driver.number}`;
    
    document.getElementById('modalStats').innerHTML = `
        <div class="track-stat-item"><h4>冠軍</h4><span class="stat-number">${driver.wc}</span></div>
        <div class="track-stat-item"><h4>積分</h4><span class="stat-number">${driver.points}</span></div>
        <div class="track-stat-item"><h4>頒獎台</h4><span class="stat-number">${driver.podiums}</span></div>
    `;

    // 組合 Bio 與 Fun Fact
    const fullBio = `
        <p>${driver.bio}</p>
        <hr style="margin: 15px 0; border-color: #333;">
        <p><strong>💡 冷知識：</strong>${driver.fun}</p>
        <div class="social-links" style="margin-top: 20px;">
            ${driver.ig ? `<a href="https://instagram.com/${driver.ig}" target="_blank" style="color: #E1306C; margin-right: 15px; font-size: 1.5rem;"><i class="fab fa-instagram"></i></a>` : ''}
            ${driver.x ? `<a href="https://twitter.com/${driver.x}" target="_blank" style="color: #1DA1F2; font-size: 1.5rem;"><i class="fab fa-twitter"></i></a>` : ''}
        </div>
    `;
    document.getElementById('modalBio').innerHTML = fullBio;
    modal.classList.add('show');
}

function closeModal(e) {
    if (e.target.classList.contains('modal-overlay')) {
        document.getElementById('infoModal').classList.remove('show');
    }
}

// === 修改後的動態紅色粒子系統 ===
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": { 
                    "value": 90,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": "#e10600" }, // 修改回 F1 紅色
                "shape": { "type": "circle" },
                "opacity": { "value": 0.6, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { 
                    "enable": true, 
                    "distance": 150, 
                    "color": "#e10600", // 連線也改為紅色
                    "opacity": 0.4, 
                    "width": 1 
                },
                "move": { 
                    "enable": true, 
                    "speed": 4, // 稍微加快速度感
                    "direction": "none", 
                    "random": false, 
                    "straight": false, 
                    "out_mode": "out", 
                    "bounce": false 
                }
            },
            "interactivity": { 
                "detect_on": "canvas",
                "events": { 
                    "onhover": { "enable": true, "mode": "grab" }, // 游標經過會吸附
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 200, "line_linked": { "opacity": 0.8 } }
                }
            },
            "retina_detect": true
        });
    }
}

function initMouseGlow() {
    const glow = document.querySelector('.mouse-glow');
    if (glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }
}

// --- 遊戲邏輯 ---
let isGameRunning = false;
let startTime = 0;

function initGame() {
    const container = document.getElementById('lightsContainer');
    if(!container) return;
    container.innerHTML = '';
    for(let i=0; i<5; i++) {
        let light = document.createElement('div');
        light.className = 'light';
        light.id = `light-${i}`;
        container.appendChild(light);
    }
    document.getElementById('gameButton').onclick = startGameSequence;
}

function startGameSequence() {
    if (isGameRunning) return;
    isGameRunning = true;
    const btn = document.getElementById('gameButton');
    const status = document.getElementById('gameStatus');
    btn.textContent = '等待燈滅...';
    status.textContent = '準備起跑';
    document.querySelectorAll('.light').forEach(l => l.classList.remove('on'));
    
    let count = 0;
    const interval = setInterval(() => {
        if (count < 5) {
            document.getElementById(`light-${count}`).classList.add('on');
            count++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                document.querySelectorAll('.light').forEach(l => l.classList.remove('on'));
                status.textContent = 'GO!';
                startTime = performance.now();
                btn.textContent = '現在！';
                btn.onclick = stopGame;
            }, Math.random() * 3000 + 1000);
        }
    }, 800);
}

function stopGame() {
    const reactionTime = (performance.now() - startTime) / 1000;
    isGameRunning = false;
    document.getElementById('gameStatus').textContent = '你的反應時間：';
    document.getElementById('timerDisplay').textContent = reactionTime.toFixed(3) + ' 秒';
    const btn = document.getElementById('gameButton');
    btn.textContent = '再試一次';
    btn.onclick = startGameSequence;
}