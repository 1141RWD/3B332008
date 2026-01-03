// =========================================
// === 初始化與核心邏輯 (Modified for new Loading) ===
// =========================================

let currentTrackFilter = 'all';
let currentDriverFilter = 'all'; 
let searchIndex = []; // 全域搜尋索引
let activeTrackList = []; // 當前顯示的賽道列表

// 1. Move startLoadingSequence to global scope or ensure hoisting.
// 2. Execute it immediately on DOMContentLoaded before anything else.

document.addEventListener('DOMContentLoaded', () => {
    // 優先檢查並執行 Loading Sequence
    const hero = document.getElementById('hero');
    if (hero) {
        // 確保初始狀態正確
        document.body.classList.add('site-hidden');
        startLoadingSequence();
    } else {
        // 如果沒有 hero，直接顯示內容 (Fallback)
        document.body.classList.remove('site-hidden');
        initApp();
    }

    // 延遲初始化粒子，避免搶佔資源
    setTimeout(() => initParticles(), 100);

    // Standard initializations (UI event listeners)
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');
    const dropdown = document.querySelector('.dropdown');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('open');
            navLinks.classList.toggle('active');
        });
    }

    const dropbtn = document.querySelector('.dropbtn');
    if (dropbtn && dropdown) {
        dropbtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                dropdown.classList.toggle('open');
            }
        });
    }

    document.querySelectorAll('.nav-links a:not(.dropbtn)').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (burgerMenu) burgerMenu.classList.remove('open');
        });
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // 捲動進度條邏輯
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("scroll-progress").style.width = scrolled + "%";
    });

    // 搜尋功能初始化
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        // 點擊外部關閉搜尋結果
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                document.getElementById('searchResults').style.display = 'none';
            }
        });
    }
    
    // 初始化輪胎
    selectTyre('soft');
});

// =========================================
// === New Loading Sequence Logic ===
// =========================================

function startLoadingSequence() {
    // Generate RPM bars
    const barsContainer = document.getElementById('rpmBars');
    const totalBars = 30; // 10 green, 10 red, 10 blue
    if(barsContainer) {
        barsContainer.innerHTML = ''; // Clear existing bars if any
        for(let i=0; i<totalBars; i++) {
            const bar = document.createElement('div');
            bar.className = 'rpm-bar';
            if(i < 10) bar.classList.add('green');
            else if(i < 20) bar.classList.add('red');
            else bar.classList.add('blue');
            barsContainer.appendChild(bar);
        }
    }

    // Sequence Timing
    // 0s: Start
    // 1s: 1st Light Pair
    // 2s: 2nd Light Pair
    // 3s: 3rd Light Pair
    // 4s: 4th Light Pair
    // 5s: 5th Light Pair -> Lights OUT -> Go
    
    const lights = [
        ['light-1', 'light-2'],
        ['light-3', 'light-4'],
        ['light-5', 'light-6'],
        ['light-7', 'light-8'],
        ['light-9', 'light-10']
    ];
    
    let rpmIndex = 0;
    const rpmInterval = setInterval(() => {
        const bars = document.querySelectorAll('.rpm-bar');
        if(rpmIndex < bars.length) {
            bars[rpmIndex].classList.add('active');
            rpmIndex++;
            // Update percentage text
            const pct = Math.floor((rpmIndex / totalBars) * 100);
            const percentText = document.getElementById('loadingPercent');
            if(percentText) percentText.innerText = pct + '%';
        }
    }, 150); // Fill bars over approx 4.5 seconds

    // Light Sequence
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const l1 = document.getElementById(lights[i][0]);
            const l2 = document.getElementById(lights[i][1]);
            if(l1) l1.classList.add('on');
            if(l2) l2.classList.add('on');
        }, (i + 1) * 1000);
    }

    // Lights Out (5.5s to allow full 5th light viz)
    setTimeout(() => {
        // Turn off all lights
        document.querySelectorAll('.light-bulb').forEach(l => {
            l.classList.remove('on');
            l.classList.add('go'); // Optional styling
        });
        
        clearInterval(rpmInterval);
        const percentText = document.getElementById('loadingPercent');
        if(percentText) percentText.innerText = '100%';

        // Transition out
        setTimeout(() => {
            const hero = document.getElementById('hero');
            if (hero) {
                hero.classList.add('hero-fade-out');
                
                setTimeout(() => {
                    hero.style.display = 'none';
                    document.body.classList.remove('site-hidden');
                    initApp(); 
                    initScrollReveal();
                    initTiltEffect();
                }, 800);
            }
        }, 500); // Short delay after lights out
    }, 5500);
}


function initApp() {
    renderStandings();     
    renderDriverFilters(); 
    renderDrivers();       
    renderTeamStandings(); 
    renderTeams();         
    renderTracks();    
    initGame();        
    initMemoryGame();
    buildSearchIndex(); // 建立搜尋索引
}

// =========================================
// === 視覺特效邏輯 (3D Tilt) ===
// =========================================

function initTiltEffect() {
    document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.data-card, .team-card');
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (centerY - y) / 20; 
        const rotateY = (x - centerX) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.data-card, .team-card');
        if (card) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        }
    });
}

// =========================================
// === 導覽與 UI 邏輯 ===
// =========================================

function navigateTo(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId + '-page');
    if (target) {
        target.classList.add('active');
        setTimeout(checkReveal, 100);
    }

    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(`'${pageId}'`)) {
            a.classList.add('active');
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchAboutTab(tabId) {
    document.querySelectorAll('.about-menu li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.about-tab-panel').forEach(panel => panel.classList.remove('active'));
    const targetTab = document.getElementById('tab-' + tabId);
    const targetContent = document.getElementById('content-' + tabId);
    if(targetTab) targetTab.classList.add('active');
    if(targetContent) targetContent.classList.add('active');
}

function navigateToAbout(tabId) {
    navigateTo('about-f1'); 
    switchAboutTab(tabId);            
}

let currentSlide = 0;
function moveSlide(n) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}
if(document.querySelector('.slide')) {
    setInterval(() => moveSlide(1), 5000);
}

// =========================================
// === 輪胎資料與邏輯 ===
// =========================================
const tyreData = {
    soft: { title: "Soft (軟胎)", desc: "紅色標識。抓地力最強，升溫最快，適合排位賽和正賽起跑，但磨損速度也最快，壽命最短。", class: "soft" },
    medium: { title: "Medium (中性胎)", desc: "黃色標識。在速度與耐用性之間取得平衡，是正賽中最常使用的輪胎配方。", class: "medium" },
    hard: { title: "Hard (硬胎)", desc: "白色標識。抓地力較低，升溫慢，但非常耐磨，適合長距離衝刺或高溫賽道。", class: "hard" },
    inter: { title: "Intermediate (半雨胎)", desc: "綠色標識。適用於輕微積水或賽道變乾的過渡期，胎面有淺溝槽以排水。", class: "inter" },
    wet: { title: "Wet (全雨胎)", desc: "藍色標識。適用於大雨和嚴重積水，每秒可排水數十公升，防止車輛打滑。", class: "wet" }
};

function selectTyre(type) {
    const data = tyreData[type];
    if (!data) return;

    document.querySelectorAll('.tyre-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tyre-btn.${type}`).classList.add('active');

    const model = document.getElementById('tyreModel');
    model.className = `tyre-model ${data.class}`;

    document.getElementById('tyreTitle').textContent = data.title;
    document.getElementById('tyreDesc').textContent = data.desc;
}

// =========================================
// === 數據定義 ===
// =========================================

const tracks = [
    { name: "澳洲大獎賽", location: "Melbourne", length: "5.278 km", laps: 58, record: "1:19.813", 
      url: "https://www.youtube.com/watch?v=md9-jG4RzXs&t=532s", videoId: "md9-jG4RzXs", img: "https://img.youtube.com/vi/md9-jG4RzXs/maxresdefault.jpg", 
      map: "01澳洲.jpg", tags: ["傳統", "高速"] },

    { name: "中國大獎賽", location: "Shanghai", length: "5.451 km", laps: 56, record: "1:32.238", 
      url: "https://www.youtube.com/watch?v=Hml6MaRRkn8", videoId: "Hml6MaRRkn8", img: "https://img.youtube.com/vi/Hml6MaRRkn8/maxresdefault.jpg", 
      map: "02中國.jpg", tags: ["傳統", "技術"] },

    { name: "日本大獎賽", location: "Suzuka", length: "5.807 km", laps: 53, record: "1:30.983", 
      url: "https://www.youtube.com/watch?v=or9ooNWaqKU", videoId: "or9ooNWaqKU", img: "https://img.youtube.com/vi/or9ooNWaqKU/maxresdefault.jpg", 
      map: "03日本.jpg", tags: ["傳統", "高速"] },

    { name: "巴林大獎賽", location: "Sakhir", length: "5.412 km", laps: 57, record: "1:31.447", 
      url: "https://www.youtube.com/watch?v=bFXLP487kXo&t=44s", videoId: "bFXLP487kXo", img: "https://img.youtube.com/vi/bFXLP487kXo/maxresdefault.jpg", 
      map: "04巴林.jpg", tags: ["夜戰", "傳統"] },

    { name: "沙烏地大獎賽", location: "Jeddah", length: "6.174 km", laps: 50, record: "1:30.734", 
      url: "https://www.youtube.com/watch?v=Li93iQDZQeg", videoId: "Li93iQDZQeg", img: "https://img.youtube.com/vi/Li93iQDZQeg/maxresdefault.jpg", 
      map: "05沙烏地阿拉伯.jpg", tags: ["夜戰", "街道", "高速"] },

    { name: "邁阿密大獎賽", location: "Miami", length: "5.412 km", laps: 57, record: "1:29.708", 
      url: "https://www.youtube.com/watch?v=ZI-HntdeVas&t=20s", videoId: "ZI-HntdeVas", img: "https://img.youtube.com/vi/ZI-HntdeVas/maxresdefault.jpg", 
      map: "06邁阿密.jpg", tags: ["街道", "技術"] },

    { name: "伊莫拉大獎賽", location: "Imola", length: "4.909 km", laps: 63, record: "1:15.484", 
      url: "https://www.youtube.com/watch?v=xkRXnrvFCY0", videoId: "xkRXnrvFCY0", img: "https://img.youtube.com/vi/xkRXnrvFCY0/maxresdefault.jpg", 
      map: "07伊莫拉.jpg", tags: ["傳統", "技術"] },

    { name: "摩納哥大獎賽", location: "Monte Carlo", length: "3.337 km", laps: 78, record: "1:12.909", 
      url: "https://www.youtube.com/watch?v=ajzQj7bjSWE", videoId: "ajzQj7bjSWE", img: "https://img.youtube.com/vi/ajzQj7bjSWE/maxresdefault.jpg", 
      map: "08摩納哥.jpg", tags: ["街道", "傳統"] },

    { name: "西班牙大獎賽", location: "Barcelona", length: "4.657 km", laps: 66, record: "1:18.149", 
      url: "https://www.youtube.com/watch?v=ATlMK7ln5Dc", videoId: "ATlMK7ln5Dc", img: "https://img.youtube.com/vi/ATlMK7ln5Dc/maxresdefault.jpg", 
      map: "09巴塞隆納.jpg", tags: ["傳統", "技術"] },

    { name: "加拿大大獎賽", location: "Montreal", length: "4.361 km", laps: 70, record: "1:13.078", 
      url: "https://www.youtube.com/watch?v=93ZnZF_zWds", videoId: "93ZnZF_zWds", img: "https://img.youtube.com/vi/93ZnZF_zWds/maxresdefault.jpg", 
      map: "10加拿大.jpg", tags: ["傳統", "高速"] },

    { name: "奧地利大獎賽", location: "Spielberg", length: "4.318 km", laps: 71, record: "1:05.619", 
      url: "https://www.youtube.com/watch?v=Wj6DHG0X66k&t=25s", videoId: "Wj6DHG0X66k", img: "https://img.youtube.com/vi/Wj6DHG0X66k/maxresdefault.jpg", 
      map: "11奧地利.jpg", tags: ["傳統", "高速"] },

    { name: "英國大獎賽", location: "Silverstone", length: "5.891 km", laps: 52, record: "1:27.097", 
      url: "https://www.youtube.com/watch?v=daWr9xnkKS4", videoId: "daWr9xnkKS4", img: "https://img.youtube.com/vi/daWr9xnkKS4/maxresdefault.jpg", 
      map: "12銀石賽道.jpg", tags: ["傳統", "高速"] },

    { name: "比利時大獎賽", location: "Spa", length: "7.004 km", laps: 44, record: "1:46.286", 
      url: "https://www.youtube.com/watch?v=yApM21L0GgY", videoId: "yApM21L0GgY", img: "https://img.youtube.com/vi/yApM21L0GgY/maxresdefault.jpg", 
      map: "13SPA.jpg", tags: ["傳統", "高速"] },

    { name: "匈牙利大獎賽", location: "Budapest", length: "4.381 km", laps: 70, record: "1:16.627", 
      url: "https://www.youtube.com/watch?v=hrPtK5D5yn4", videoId: "hrPtK5D5yn4", img: "https://img.youtube.com/vi/hrPtK5D5yn4/maxresdefault.jpg", 
      map: "14匈牙利.jpg", tags: ["傳統", "技術"] },

    { name: "荷蘭大獎賽", location: "Zandvoort", length: "4.259 km", laps: 72, record: "1:11.097", 
      url: "https://www.youtube.com/watch?v=JIRqdeNl2cU&t=71s", videoId: "JIRqdeNl2cU", img: "https://img.youtube.com/vi/JIRqdeNl2cU/maxresdefault.jpg", 
      map: "15荷蘭.jpg", tags: ["傳統", "技術"] },

    { name: "義大利大獎賽", location: "Monza", length: "5.793 km", laps: 53, record: "1:21.046", 
      url: "https://www.youtube.com/watch?v=kGMp1Byuwto", videoId: "kGMp1Byuwto", img: "https://img.youtube.com/vi/kGMp1Byuwto/maxresdefault.jpg", 
      map: "16Monza.jpg", tags: ["傳統", "高速"] },

    { name: "亞塞拜然大獎賽", location: "Baku", length: "6.003 km", laps: 51, record: "1:43.009", 
      url: "https://www.youtube.com/watch?v=JntKOmbMI08", videoId: "JntKOmbMI08", img: "https://img.youtube.com/vi/JntKOmbMI08/maxresdefault.jpg", 
      map: "17巴庫城市賽.jpg", tags: ["街道", "高速"] },

    { name: "新加坡大獎賽", location: "Marina Bay", length: "4.940 km", laps: 62, record: "1:35.867", 
      url: "https://www.youtube.com/watch?v=XZhXFbFCOu4", videoId: "XZhXFbFCOu4", img: "https://img.youtube.com/vi/XZhXFbFCOu4/maxresdefault.jpg", 
      map: "18濱海灣街道賽.jpg", tags: ["夜戰", "街道"] },

    { name: "美國大獎賽", location: "Austin", length: "5.513 km", laps: 56, record: "1:36.169", 
      url: "https://www.youtube.com/watch?v=CdKwc1bC44c&t=233s", videoId: "CdKwc1bC44c", img: "https://img.youtube.com/vi/CdKwc1bC44c/maxresdefault.jpg", 
      map: "19美州賽道.jpg", tags: ["傳統", "技術"] },

    { name: "墨西哥大獎賽", location: "Mexico City", length: "4.304 km", laps: 71, record: "1:17.774", 
      url: "https://www.youtube.com/watch?v=hTqxfkWRimk", videoId: "hTqxfkWRimk", img: "https://img.youtube.com/vi/hTqxfkWRimk/maxresdefault.jpg", 
      map: "20墨西哥.jpg", tags: ["傳統", "技術"] },

    { name: "巴西大獎賽", location: "Sao Paulo", length: "4.309 km", laps: 71, record: "1:10.540", 
      url: "https://www.youtube.com/watch?v=MK83clSv6-k", videoId: "MK83clSv6-k", img: "https://img.youtube.com/vi/MK83clSv6-k/maxresdefault.jpg", 
      map: "21巴西.jpg", tags: ["傳統", "技術"] },

    { name: "拉斯維加斯大獎賽", location: "Las Vegas", length: "6.201 km", laps: 50, record: "1:34.876", 
      url: "https://www.youtube.com/watch?v=uQc-pW3QLuI", videoId: "uQc-pW3QLuI", img: "https://img.youtube.com/vi/uQc-pW3QLuI/maxresdefault.jpg", 
      map: "22拉斯維加斯.jpg", tags: ["夜戰", "街道", "高速"] },

    { name: "卡達大獎賽", location: "Lusail", length: "5.419 km", laps: 57, record: "1:24.319", 
      url: "https://www.youtube.com/watch?v=BeaVJggQ2dc", videoId: "BeaVJggQ2dc", img: "https://img.youtube.com/vi/BeaVJggQ2dc/maxresdefault.jpg", 
      map: "23卡達.jpg", tags: ["夜戰", "傳統"] },

    { name: "阿布達比大獎賽", location: "Yas Marina", length: "5.281 km", laps: 58, record: "1:26.103", 
      url: "https://www.youtube.com/watch?v=S-LMSpzlnc0", videoId: "S-LMSpzlnc0", img: "https://img.youtube.com/vi/S-LMSpzlnc0/maxresdefault.jpg", 
      map: "24阿布達比.jpg", tags: ["夜戰", "傳統"] }
];

const drivers = [
    { 
        name: "Max Verstappen", team: "Red Bull Racing", number: 1, points: 421, podiums: 15, img: "MV.jpg", country: "荷蘭", flagCode: "nl", wc: 3, 
        quote: "I HATE LOSING!",
        stats: { grandsPrix: 185, highestFinish: 1, highestGrid: 1, birthPlace: "比利時 哈瑟爾特" },
        bio: "當代最強。Verstappen 以其激進的駕駛風格和無與倫比的速度統治賽道。作為 Red Bull 的核心，他總是能在關鍵時刻展現出冠軍的冷靜與霸氣。", ig: "maxverstappen1", x: "Max33Verstappen", shop: "https://www.redbullracing.com/" 
    },
    { 
        name: "Yuki Tsunoda", team: "Red Bull Racing", number: 22, points: 33, podiums: 0, img: "YT.jpg", country: "日本", flagCode: "jp", wc: 0, 
        quote: "I REALLY LIKE TO BATTLE AND I DON'T LOSE MUCH WHEN BATTLE HAPPENS.",
        stats: { grandsPrix: 66, highestFinish: 4, highestGrid: 6, birthPlace: "日本 相模原" },
        bio: "激情四射。角田裕毅以其直率的性格和日益精進的駕駛技術贏得了車迷的喜愛。升上大紅牛後，他面臨著生涯最大的挑戰與機遇。", ig: "yukitsunoda0511", x: "yukitsunoda0711", shop: "https://www.redbullracing.com/" 
    },
    { 
        name: "Lando Norris", team: "McLaren", number: 4, points: 423, podiums: 12, img: "LN.jpg", country: "英國", flagCode: "gb", wc: 0, 
        quote: "证明他們是錯的。",
        stats: { grandsPrix: 104, highestFinish: 1, highestGrid: 1, birthPlace: "英國 布里斯托" },
        bio: "麥拉倫領軍人物。Lando 不僅是場上的開心果，更是速度的化身。隨著 McLaren 賽車競爭力的提升，他已成為世界冠軍的有力爭奪者。", ig: "landonorris", x: "LandoNorris", shop: "https://www.mclarenstore.com/" 
    },
    { 
        name: "Oscar Piastri", team: "McLaren", number: 81, points: 410, podiums: 9, img: "OP.jpg", country: "澳洲", flagCode: "au", wc: 0, 
        quote: "保持冷靜，保持速度。",
        stats: { grandsPrix: 44, highestFinish: 1, highestGrid: 2, birthPlace: "澳洲 墨爾本" },
        bio: "冷靜的超級新人。Piastri 展現出了超越年齡的成熟度。他的穩定性和速度讓 McLaren 擁有了圍場內最強的車手組合之一。", ig: "oscarpiastri", x: "OscarPiastri", shop: "https://www.mclarenstore.com/" 
    },
    { 
        name: "Charles Leclerc", team: "Ferrari", number: 16, points: 242, podiums: 11, img: "CL.jpg", country: "摩納哥", flagCode: "mc", wc: 0, 
        quote: "我永遠不會放棄我的夢想。",
        stats: { grandsPrix: 125, highestFinish: 1, highestGrid: 1, birthPlace: "摩納哥 蒙地卡羅" },
        bio: "摩納哥之子。Leclerc 的單圈速度無人能敵，排位賽之王的美譽實至名歸。他肩負著帶領法拉利重返榮耀的重責大任。", ig: "charles_leclerc", x: "Charles_Leclerc", shop: "https://store.ferrari.com/" 
    },
    { 
        name: "Lewis Hamilton", team: "Ferrari", number: 44, points: 156, podiums: 197, img: "LH.jpg", country: "英國", flagCode: "gb", wc: 7, 
        quote: "我仍將升起。",
        stats: { grandsPrix: 332, highestFinish: 1, highestGrid: 1, birthPlace: "英國 斯蒂夫尼奇" },
        bio: "F1 活傳奇。轉隊法拉利震驚了世界，七屆世界冠軍 Hamilton 渴望在紅色的傳奇車隊中，奪下屬於他的第八座世界冠軍獎盃。", ig: "lewishamilton", x: "LewisHamilton", shop: "https://store.ferrari.com/" 
    },
    { 
        name: "George Russell", team: "Mercedes", number: 63, points: 319, podiums: 14, img: "GR.jpg", country: "英國", flagCode: "gb", wc: 0, 
        quote: "穩定是關鍵。",
        stats: { grandsPrix: 104, highestFinish: 1, highestGrid: 1, birthPlace: "英國 金斯林" },
        bio: "Mercedes 領袖。在 Hamilton 離隊後，Russell 正式接過了銀箭的旗幟。他精準的駕駛風格和強大的心理素質，將引領賓士重回巔峰。", ig: "georgerussell63", x: "GeorgeRussell63", shop: "https://shop.mercedesamgf1.com/" 
    },
    { 
        name: "Kimi Antonelli", team: "Mercedes", number: 12, points: 150, podiums: 0, img: "KA.jpg", country: "義大利", flagCode: "it", wc: 0, 
        quote: "速度無需翻譯。",
        stats: { grandsPrix: 0, highestFinish: "N/A", highestGrid: "N/A", birthPlace: "義大利 波隆那" },
        bio: "超級新人。被譽為天才少年的 Antonelli 直接跳級進入 F1 頂級車隊。全世界都在關注這位義大利新星能否承受住巨大的壓力。", ig: "kimi.antonelli", x: "KimiAntonelli", shop: "https://shop.mercedesamgf1.com/" 
    },
    { 
        name: "Fernando Alonso", team: "Aston Martin", number: 14, points: 56, podiums: 106, img: "FA.jpg", country: "西班牙", flagCode: "es", wc: 2, 
        quote: "我總是充滿渴望。",
        stats: { grandsPrix: 380, highestFinish: 1, highestGrid: 1, birthPlace: "西班牙 奧維耶多" },
        bio: "不老傳奇。Alonso 證明了年齡只是數字。他的比賽閱讀能力和防守技巧依然是圍場內的教科書，隨時準備抓住登上頒獎台的機會。", ig: "fernandoalo_oficial", x: "alo_oficial", shop: "https://shop.astonmartinf1.com/" 
    },
    { 
        name: "Lance Stroll", team: "Aston Martin", number: 18, points: 33, podiums: 3, img: "LS.jpg", country: "加拿大", flagCode: "ca", wc: 0, 
        quote: "埋頭苦幹，全力以赴。",
        stats: { grandsPrix: 143, highestFinish: 3, highestGrid: 1, birthPlace: "加拿大 蒙特婁" },
        bio: "穩定的得分手。儘管備受爭議，Stroll 在雨戰和起跑圈的表現往往令人驚艷。他需要更穩定的表現來證明自己的實力。", ig: "lance_stroll", x: "lance_stroll", shop: "https://shop.astonmartinf1.com/" 
    },
    { 
        name: "Carlos Sainz", team: "Williams", number: 55, points: 64, podiums: 25, img: "CS.jpg", country: "西班牙", flagCode: "es", wc: 0, 
        quote: "平穩的操作者。",
        stats: { grandsPrix: 185, highestFinish: 1, highestGrid: 1, birthPlace: "西班牙 馬德里" },
        bio: "經驗豐富。來到 Williams 的 Sainz 帶來了冠軍車隊的經驗。他的策略頭腦和穩定的速度，將是威廉斯復興計畫的關鍵拼圖。", ig: "carlossainz55", x: "Carlossainz55", shop: "https://www.williamsf1.com/store" 
    },
    { 
        name: "Alexander Albon", team: "Williams", number: 23, points: 73, podiums: 2, img: "AA.jpg", country: "泰國", flagCode: "th", wc: 0, 
        quote: "永不放棄。",
        stats: { grandsPrix: 83, highestFinish: 3, highestGrid: 4, birthPlace: "英國 倫敦" },
        bio: "核心車手。Albon 已完全重生，成為 Williams 的絕對領袖。他經常能駕駛著性能較差的賽車創造奇蹟，榨取每一分積分。", ig: "alex_albon", x: "alex_albon", shop: "https://www.williamsf1.com/store" 
    },
    { 
        name: "Pierre Gasly", team: "Alpine", number: 10, points: 22, podiums: 4, img: "PG.jpg", country: "法國", flagCode: "fr", wc: 0, 
        quote: "全速前進。",
        stats: { grandsPrix: 132, highestFinish: 1, highestGrid: 2, birthPlace: "法國 魯昂" },
        bio: "法國支柱。Gasly 在 Alpine 承擔著巨大的期望。這位曾經的分站冠軍渴望擁有一輛能讓他重返頒獎台前列的賽車。", ig: "pierregasly", x: "PierreGASLY", shop: "https://boutique.alpinecars.com/" 
    },
    { 
        name: "Franco Colapinto", team: "Alpine", number: 43, points: 0, podiums: 0, img: "FC.jpg", country: "阿根廷", flagCode: "ar", wc: 0, 
        quote: "I'm here to stay.",
        stats: { grandsPrix: 9, highestFinish: 8, highestGrid: 9, birthPlace: "阿根廷 Pilar" },
        bio: "阿根廷的驕傲。在 2024 年震撼登場後，Colapinto 憑藉其無所畏懼的駕駛風格贏得了席位。他是威廉斯未來的關鍵人物。", ig: "francolapinto", x: "FranColapinto", shop: "https://www.williamsf1.com/store" 
    },
    { 
        name: "Esteban Ocon", team: "Haas", number: 31, points: 38, podiums: 3, img: "EO.jpg", country: "法國", flagCode: "fr", wc: 0, 
        quote: "為每一寸土地而戰。",
        stats: { grandsPrix: 133, highestFinish: 1, highestGrid: 3, birthPlace: "法國 埃夫勒" },
        bio: "強硬防守。Ocon 以其強硬的防守風格聞名。加入 Haas 後，他將與新秀 Bearman 搭檔，利用豐富的經驗帶領車隊前進。", ig: "estebanocon", x: "OconEsteban", shop: "https://haasf1team.store/" 
    },
    { 
        name: "Oliver Bearman", team: "Haas", number: 87, points: 41, podiums: 0, img: "OB.jpg", country: "英國", flagCode: "gb", wc: 0, 
        quote: "夢想遠大。",
        stats: { grandsPrix: 1, highestFinish: 7, highestGrid: 11, birthPlace: "英國 切姆斯福德" },
        bio: "一戰成名。當年臨危受命代打法拉利一戰成名，如今正式獲得全職席位。Bearman 是 F1 圍場內最受矚目的年輕天才之一。", ig: "olliebearman", x: "OllieBearman", shop: "https://haasf1team.store/" 
    },
    { 
        name: "Liam Lawson", team: "RB", number: 30, points: 38, podiums: 2, img: "LL.jpg", country: "紐西蘭", flagCode: "nz", wc: 0, 
        quote: "最大化一切。",
        stats: { grandsPrix: 5, highestFinish: 9, highestGrid: 10, birthPlace: "紐西蘭 哈斯廷斯" },
        bio: "紐西蘭新星。Lawson 在有限的代打機會中展現了驚人的速度。如今坐穩 RB 席位，他的目標是晉升大紅牛車隊。", ig: "liamlawson30", x: "LiamLawson30", shop: "https://f1store.formula1.com/" 
    },
    { 
        name: "Isack Hadjar", team: "RB", number: 6, points: 51, podiums: 0, img: "IH.jpg", country: "法國", flagCode: "fr", wc: 0, 
        quote: "挑戰極限。",
        stats: { grandsPrix: 0, highestFinish: "N/A", highestGrid: "N/A", birthPlace: "法國 巴黎" },
        bio: "青訓希望。紅牛青訓體系最新的畢業生。Hadjar 風格激進，他需要在殘酷的 F1 環境中快速學習並存活下來。", ig: "isackhadjar", x: "IsackHadjar", shop: "https://f1store.formula1.com/" 
    },
    { 
        name: "Nico Hülkenberg", team: "Stake F1 Team", number: 27, points: 51, podiums: 0, img: "NH.jpg", country: "德國", flagCode: "de", wc: 0, 
        quote: "浩克歸來。",
        stats: { grandsPrix: 206, highestFinish: 4, highestGrid: 1, birthPlace: "德國 埃梅里希" },
        bio: "排位大師。經驗極其豐富的老將，加入即將轉型為奧迪的車隊。Hülkenberg 的開發能力對於車隊未來的轉型至關重要。", ig: "hulkhulkenberg", x: "HulkHulkenberg", shop: "https://www.sauber-group.com/" 
    },
    { 
        name: "Gabriel Bortoleto", team: "Stake F1 Team", number: 5, points: 19, podiums: 0, img: "GB.jpg", country: "巴西", flagCode: "br", wc: 0, 
        quote: "全速衝刺。",
        stats: { grandsPrix: 0, highestFinish: "N/A", highestGrid: "N/A", birthPlace: "巴西 聖保羅" },
        bio: "巴西新星。F2 冠軍強勢加盟，承載著巴西車迷的希望。Bortoleto 將在老大哥 Hülkenberg 的指導下開啟他的 F1 生涯。", ig: "gabrielbortoleto", x: "G_Bortoleto", shop: "https://www.sauber-group.com/" 
    }
];

const teams = [
    { name: "McLaren", points: 803, logo: "M.jpg", color: "#FF8700", bio: "麥拉倫車隊是 F1 歷史上最成功的車隊之一，2025 年展現了強大的競爭力。", url: "https://www.mclaren.com/racing/" },
    { name: "Red Bull Racing", points: 520, logo: "R.jpg", color: "#3671C6", bio: "紅牛車隊以其激進的策略和頂尖的空氣動力學設計聞名。", url: "https://www.redbullracing.com/" },
    { name: "Ferrari", points: 650, logo: "F.jpg", color: "#E10600", bio: "法拉利是 F1 的象徵，擁有最龐大的車迷群體 Tifosi。", url: "https://www.ferrari.com/en-EN/formula1" },
    { name: "Mercedes", points: 330, logo: "B.jpg", color: "#27F4D2", bio: "賓士車隊在混合動力時代統治了多年，目前正致力於重返巔峰。", url: "https://www.mercedesamgf1.com/" },
    { name: "Aston Martin", points: 280, logo: "A.jpg", color: "#229971", bio: "奧斯頓馬丁車隊近年投入巨大，目標是挑戰領頭羊。", url: "https://www.astonmartinf1.com/" },
    { name: "Williams", points: 240, logo: "W.jpg", color: "#64C4FF", bio: "威廉斯車隊正在經歷復興，展現出老牌強隊的底蘊。", url: "https://www.williamsf1.com/" },
    { name: "Alpine", points: 110, logo: "Ap.jpg", color: "#0093CC", bio: "代表法國的 Alpine 車隊，持續在競爭激烈的中游奮戰。", url: "https://www.alpinecars.com/en/racing/" },
    { name: "Haas", points: 100, logo: "H.jpg", color: "#B6BABD", bio: "來自美國的哈斯車隊，以高效的運作模式立足 F1。", url: "https://www.haasf1team.com/" },
    { name: "RB", points: 55, logo: "Rb.jpg", color: "#6692FF", bio: "紅牛二隊，旨在培養未來的冠軍車手。", url: "https://www.visacashapprb.com/" },
    { name: "Stake F1 Team", points: 30, logo: "K.jpg", color: "#52E252", bio: "索伯車隊正處於轉型期，為未來奧迪的加入做準備。", url: "https://www.sauber-group.com/" }
];

// =========================================
// === 渲染邏輯 ===
// =========================================

function renderStandings() {
    const sorted = [...drivers].sort((a, b) => b.points - a.points);
    const top3 = sorted.slice(0, 3);
    const rest = sorted.slice(3, 10);
    const more = sorted.slice(10);

    const p1 = document.getElementById('podium-1');
    const p2 = document.getElementById('podium-2');
    const p3 = document.getElementById('podium-3');

    if(p1) p1.innerHTML = createPodiumHTML(top3[0], 1);
    if(p2) p2.innerHTML = createPodiumHTML(top3[1], 2);
    if(p3) p3.innerHTML = createPodiumHTML(top3[2], 3);

    const body = document.getElementById('standingsListBody');
    const moreBody = document.getElementById('standingsMoreBody');
    if(body) body.innerHTML = rest.map((d, i) => createTableRow(d, i + 4)).join('');
    if(moreBody) moreBody.innerHTML = more.map((d, i) => createTableRow(d, i + 11)).join('');
    
    setTimeout(animatePoints, 500);
}

function createPodiumHTML(d, rank) {
    if(!d) return '';
    const clickAttr = rank === 1 ? 'onclick="celebrateWinner()"' : '';
    const styleAttr = rank === 1 ? 'style="cursor:pointer"' : '';
    return `
        <span class="p-rank">${rank}</span>
        <div class="podium-driver" ${clickAttr} ${styleAttr}>
            <img src="${d.img}" alt="${d.name}">
        </div>
        <div class="podium-info">
            <span class="p-name">${d.name}</span>
            <span class="p-points"><span class="animate-num" data-val="${d.points}">0</span> PTS</span>
        </div>
    `;
}

function createTableRow(d, rank) {
    // 國旗 URL
    const flagUrl = `https://flagcdn.com/24x18/${d.flagCode}.png`;
    return `
        <tr>
            <td>${rank}</td>
            <td style="font-weight:bold;">${d.name}</td>
            <td><img src="${flagUrl}" style="vertical-align:middle; margin-right:5px; border-radius:2px;"> ${d.country}</td>
            <td>${d.team}</td>
            <td style="text-align:right; font-weight:900; color:var(--f1-red);"><span class="animate-num" data-val="${d.points}">0</span></td>
        </tr>
    `;
}

function toggleStandings() {
    const more = document.getElementById('standingsMoreBody');
    const btn = document.getElementById('toggleStandingsBtn');
    if(more.classList.contains('hidden')) {
        more.classList.remove('hidden');
        btn.innerHTML = '<span>顯示較少</span> <i class="fas fa-chevron-up"></i>';
        animatePoints();
    } else {
        more.classList.add('hidden');
        btn.innerHTML = '<span>顯示更多</span> <i class="fas fa-chevron-down"></i>';
    }
}

function getTeamColor(teamName) {
    const team = teams.find(t => teamName.includes(t.name) || t.name.includes(teamName));
    return team ? team.color : '#e10600'; 
}

function renderDriverFilters() {
    const container = document.getElementById('driverFilterContainer');
    if(!container) return;

    const allTeams = ['全部', ...teams.map(t => t.name)];
    
    container.innerHTML = allTeams.map(teamName => {
        const isActive = (currentDriverFilter === 'all' && teamName === '全部') || currentDriverFilter === teamName;
        const filterVal = teamName === '全部' ? 'all' : teamName;
        
        // 獲取車隊顏色，如果是"全部"則使用預設紅色
        const teamColor = teamName === '全部' ? '#e10600' : getTeamColor(teamName);
        
        return `
            <div class="filter-tag ${isActive ? 'active' : ''}" 
                 style="--filter-color: ${teamColor}"
                 onclick="filterDrivers('${filterVal}', this)">
                 ${teamName}
            </div>
        `;
    }).join('');
}

function filterDrivers(teamName, el) {
    currentDriverFilter = teamName;
    document.querySelectorAll('#driverFilterContainer .filter-tag').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderDrivers();
}

function renderDrivers(data = drivers) {
    const container = document.getElementById('driverGridContainer');
    if(!container) return;

    let filteredData = data;
    if (currentDriverFilter !== 'all') {
        filteredData = data.filter(d => d.team === currentDriverFilter);
    }

    container.innerHTML = filteredData.map(d => {
        const teamColor = getTeamColor(d.team);
        // 使用 Flag CDN
        const flagUrl = `https://flagcdn.com/w80/${d.flagCode}.png`;
        
        return `
            <div class="data-card reveal-item" onclick="openModal('${d.name}', 'driver')" style="--team-color: ${teamColor};">
                <div class="card-header">
                    <div class="flag-circle">
                        <img src="${flagUrl}" alt="${d.country}">
                    </div>
                    <img src="${d.img}" alt="${d.name}">
                </div>
                <div class="card-content">
                    <h3>${d.name}</h3>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">${d.team}</p>
                    <div style="display:flex; justify-content:space-around; border-top:1px solid var(--border-color); padding-top:10px;">
                        <div><span class="stat-number">${d.points}</span><br><small>積分</small></div>
                        <div><span class="stat-number">${d.podiums}</span><br><small>頒獎台</small></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    checkReveal();
}

function renderTeamStandings() {
    const sorted = [...teams].sort((a, b) => b.points - a.points);
    const top3 = sorted.slice(0, 3);
    const rest = sorted.slice(3);

    const podium = document.getElementById('teamPodium');
    if(podium) {
        // 第一名車隊加入慶祝屬性
        podium.innerHTML = `
            <div class="podium-item rank-2 reveal-item">
                <span class="p-rank">2</span>
                <div class="podium-team-logo"><img src="${top3[1].logo}"></div>
                <div class="podium-info">
                    <span class="p-name">${top3[1].name}</span>
                    <span class="p-points"><span class="animate-num" data-val="${top3[1].points}">0</span> PTS</span>
                </div>
            </div>
            <div class="podium-item rank-1 reveal-item" style="cursor:pointer" onclick="celebrateWinner()" title="點擊這裡慶祝！">
                <span class="p-rank">1</span>
                <div class="podium-team-logo"><img src="${top3[0].logo}"></div>
                <div class="podium-info">
                    <span class="p-name">${top3[0].name}</span>
                    <span class="p-points"><span class="animate-num" data-val="${top3[0].points}">0</span> PTS</span>
                </div>
            </div>
            <div class="podium-item rank-3 reveal-item">
                <span class="p-rank">3</span>
                <div class="podium-team-logo"><img src="${top3[2].logo}"></div>
                <div class="podium-info">
                    <span class="p-name">${top3[2].name}</span>
                    <span class="p-points"><span class="animate-num" data-val="${top3[2].points}">0</span> PTS</span>
                </div>
            </div>
        `;
    }

    const body = document.getElementById('teamStandingsBody');
    if(body) body.innerHTML = rest.map((t, i) => `
        <tr>
            <td>${i + 4}</td>
            <td style="font-weight:bold;">${t.name}</td>
            <td style="text-align:right; font-weight:900; color:var(--f1-red);"><span class="animate-num" data-val="${t.points}">0</span></td>
        </tr>
    `).join('');
}

function renderTeams() {
    const container = document.getElementById('teamsGridContainer');
    if(!container) return;
    container.innerHTML = teams.map(t => `
        <div class="team-card reveal-item" onclick="openModal('${t.name}', 'team')" style="--team-color: ${t.color};">
            <div class="team-logo-bg"><img src="${t.logo}" alt="${t.name}"></div>
            <div class="team-info">
                <h3><span class="team-color-indicator" style="background:${t.color}"></span>${t.name}</h3>
                <p class="team-bio">${t.bio}</p>
            </div>
        </div>
    `).join('');
    checkReveal();
}

function renderTracks() {
    const tabs = document.getElementById('trackTabs');
    const contents = document.getElementById('trackContents');
    if(!tabs || !contents) return;

    if (!document.querySelector('.track-filter-container')) {
        // ... (保持原樣，或使用預設 HTML)
    }

    // 1. 根據當前 filter 篩選出需要的賽道清單
    // 將這個狀態保存為全域變數，以便 switchTrack 使用
    activeTrackList = tracks.filter(t => 
        currentTrackFilter === 'all' || t.tags.includes(currentTrackFilter)
    );

    // 2. 重新生成上方的按鈕 (1, 2, 3...)
    // 這裡的 index (i) 是在 filtered list 中的 index
    tabs.innerHTML = activeTrackList.map((t, i) => {
        return `
            <button class="track-tab-btn ${i===0?'active':''}" 
                    onclick="switchTrack(${i})">${i+1}</button>
        `;
    }).join('');

    // 3. 重新生成下方的內容面板 (只生成過濾後的)
    contents.innerHTML = activeTrackList.map((t, i) => `
        <div class="track-panel ${i===0?'active':''}" id="track-panel-${i}">
            <div class="track-detail-grid">
                <div class="track-info-text">
                    <div style="margin-bottom: 10px;">
                        ${t.tags.map(tag => `<span class="track-tag">${tag}</span>`).join('')}
                    </div>
                    <h2>${t.name}</h2>
                    <p><i class="fas fa-map-marker-alt"></i> <strong>地點：</strong> ${t.location}</p>
                    <p><i class="fas fa-ruler-horizontal"></i> <strong>單圈長度：</strong> ${t.length}</p>
                    <p><i class="fas fa-redo"></i> <strong>比賽圈數：</strong> ${t.laps} 圈</p>
                    <p><i class="fas fa-stopwatch"></i> <strong>單圈紀錄：</strong> ${t.record}</p>
                    <div style="margin-top: 30px; padding: 20px; background: var(--bg-card-hover); border-radius: 10px; border-left: 4px solid var(--text-main);">
                        <small style="color: var(--text-muted); font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">賽道配置</small>
                        <p style="margin-top: 5px; font-size: 0.95rem; line-height: 1.5; color: var(--text-muted);">
                            上方大圖可觀看 ${t.name} 的賽事精華影片。右側為賽道佈局圖，點擊可放大查看。
                        </p>
                    </div>
                </div>
                
                <div class="track-image map-container" style="background: var(--bg-card-hover); border:none;">
                    <img src="${t.map}" alt="${t.name} Track Map" 
                         style="width:100%; height:100%; object-fit: contain; padding: 20px; cursor: zoom-in;"
                         onclick="openImageModal(this.src)">
                </div>

            </div>
        </div>
    `).join('');
    
    // 初始化顯示第一個
    switchTrack(0);
}

function filterTracks(tag, el) {
    currentTrackFilter = tag;
    document.querySelectorAll('.track-filter-container .filter-tag').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderTracks();
}

function switchTrack(index) {
    // 這裡的 index 是 activeTrackList 中的 index
    const t = activeTrackList[index];
    if (!t) return;

    document.querySelectorAll('.track-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.track-panel').forEach(p => p.classList.remove('active'));
    
    const btns = document.querySelectorAll('.track-tab-btn');
    if(btns[index]) btns[index].classList.add('active');
    
    const panel = document.getElementById(`track-panel-${index}`);
    if(panel) panel.classList.add('active');
    
    // Update Hero Video/Image based on the selected track
    const heroContainer = document.getElementById('trackHeroContainer');
    
    if(heroContainer) {
        heroContainer.innerHTML = `
            <div class="track-video-link" title="點擊觀看 ${t.name} 精華">
                <a href="${t.url}" target="_blank" style="display:block; width:100%; height:100%;">
                    <img src="${t.img}" alt="${t.name} Highlights" style="width:100%; height:100%; object-fit: cover;">
                    <div class="play-overlay">
                        <div class="play-icon-circle"><i class="fas fa-play"></i></div>
                        <span class="play-text">點擊前往 YouTube 觀看</span>
                    </div>
                </a>
                
                <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 60px 30px 20px; background: linear-gradient(to top, rgba(0,0,0,0.95), transparent); pointer-events: none; z-index: 2;">
                    <h3 style="color: white; font-size: 3rem; margin: 0; font-style: italic; text-transform: uppercase; text-shadow: 0 5px 15px rgba(0,0,0,0.8);">${t.name}</h3>
                    <p style="color: var(--f1-red); font-weight: bold; margin-top: 5px; text-shadow: 0 2px 5px rgba(0,0,0,0.8);"><i class="fas fa-play-circle"></i> 觀看賽事精華</p>
                </div>
            </div>
        `;
    }
}

// 圖片燈箱功能
function openImageModal(src) {
    const modal = document.getElementById('imageLightbox');
    const img = document.getElementById('lightboxImage');
    img.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageLightbox');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// =========================================
// === 搜尋功能與索引建立 ===
// =========================================

function buildSearchIndex() {
    searchIndex = [];
    
    // 1. 車手 (Drivers)
    drivers.forEach(d => {
        // 主要索引：姓名、車號
        searchIndex.push({
            type: 'driver',
            category: '車手',
            name: d.name,
            detail: d.team, // 顯示用
            keywords: [d.number.toString(), d.country, d.flagCode], // 車號、國家
            icon: 'fas fa-user-helmet-safety',
            id: d.name
        });
    });

    // 2. 車隊 (Teams)
    teams.forEach(t => {
        searchIndex.push({
            type: 'team',
            category: '車隊',
            name: t.name,
            detail: 'F1 Team',
            keywords: [],
            icon: 'fas fa-users-viewfinder',
            id: t.name
        });
    });

    // 3. 賽道 (Tracks)
    tracks.forEach((t, i) => {
        searchIndex.push({
            type: 'track',
            category: '賽道',
            name: t.name,
            detail: t.location,
            keywords: t.tags, // 街道, 高速 等
            icon: 'fas fa-route',
            id: i
        });
    });

    // 4. 頁面章節 (Sections & Keywords)
    const sections = [
        { 
            name: "F1 歷史", 
            id: "about-f1", tab: "history", 
            category: "關於 F1", 
            keywords: ["歷史", "history", "起源", "發展", "年代"], 
            icon: "fas fa-history" 
        },
        { 
            name: "賽車技術", 
            id: "about-f1", tab: "tech", 
            category: "關於 F1", 
            keywords: ["技術", "動力", "引擎", "Power Unit", "Aerodynamics", "DRS", "下壓力", "空氣動力", "tech"], 
            icon: "fas fa-microchip" 
        },
        { 
            name: "輪胎介紹", 
            id: "about-f1", tab: "tyres", 
            category: "關於 F1", 
            keywords: ["輪胎", "tyre", "tire", "soft", "medium", "hard", "wet", "inter", "軟胎", "硬胎", "雨胎"], 
            icon: "fas fa-circle-notch" 
        },
        { 
            name: "比賽結構", 
            id: "about-f1", tab: "structure", 
            category: "關於 F1", 
            keywords: ["規則", "排位", "練習賽", "正賽", "積分", "Qualifying", "Practice", "Race", "points"], 
            icon: "fas fa-sitemap" 
        },
        { 
            name: "命名由來", 
            id: "about-f1", tab: "naming", 
            category: "關於 F1", 
            keywords: ["名稱", "由來", "Formula", "One", "定義"], 
            icon: "fas fa-tag" 
        },
        { 
            name: "車手積分排行", 
            id: "drivers", 
            category: "排行", 
            keywords: ["車手榜", "排名", "第一名", "冠軍", "standings"], 
            icon: "fas fa-trophy" 
        },
        { 
            name: "車隊積分排行", 
            id: "teams", 
            category: "排行", 
            keywords: ["車隊榜", "製造商", "constructors"], 
            icon: "fas fa-users-cog" 
        },
        { 
            name: "反應測試遊戲", 
            id: "game", 
            category: "遊戲", 
            keywords: ["反應", "game", "燈滅", "起跑", "玩", "記憶"], 
            icon: "fas fa-gamepad" 
        }
    ];

    sections.forEach(s => {
        searchIndex.push({
            type: 'section',
            category: s.category,
            name: s.name,
            detail: '頁面跳轉',
            keywords: s.keywords,
            icon: s.icon,
            id: s.id,
            tab: s.tab
        });
    });
}

function handleSearchInput(e) {
    const query = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (query.length < 1) {
        resultsContainer.style.display = 'none';
        return;
    }

    // 搜尋邏輯優化：使用 startsWith
    const filtered = searchIndex.filter(item => {
        // 1. 檢查 Name (最優先) - 開頭匹配
        if (item.name.toLowerCase().startsWith(query)) return true;

        // 2. 檢查 Keywords (次優先) - 關鍵字中是否有開頭匹配
        if (item.keywords && item.keywords.some(k => k.toLowerCase().startsWith(query))) return true;

        // 3. 檢查 Detail (但對於車手，我們避免只匹配 Team Name 就顯示車手，除非是極度模糊搜尋)
        // 這裡我們做一個特例：如果 type 是 driver，不檢查 detail (Team Name)
        // 這樣搜尋 "M" (McLaren) 不會跑出所有 McLaren 車手，除非車手名字有 M
        if (item.type !== 'driver' && item.detail && item.detail.toLowerCase().startsWith(query)) {
            return true;
        }

        return false;
    }); // 不在這裡截斷，改用 CSS 控制顯示高度

    if (filtered.length > 0) {
        resultsContainer.innerHTML = filtered.map(item => `
            <li onclick="executeSearch('${item.type}', '${item.id}', '${item.tab || ''}', '${item.name}')">
                <i class="${item.icon}"></i>
                <div class="search-info">
                    <span class="search-name">${item.name}</span>
                    <span class="search-cat">${item.category} ${item.detail && item.type !== 'section' ? '- ' + item.detail : ''}</span>
                </div>
            </li>
        `).join('');
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.innerHTML = '<li class="no-result">沒有找到相關結果</li>';
        resultsContainer.style.display = 'block';
    }
}

function executeSearch(type, id, tab, name) {
    const resultsContainer = document.getElementById('searchResults');
    const searchInput = document.getElementById('globalSearch');
    
    resultsContainer.style.display = 'none';
    searchInput.value = ''; // 清空搜尋欄

    if (type === 'driver') {
        navigateTo('drivers');
        // 稍微延遲以確保頁面切換完成
        setTimeout(() => openModal(id, 'driver'), 300);
    } else if (type === 'team') {
        navigateTo('teams');
        setTimeout(() => openModal(id, 'team'), 300);
    } else if (type === 'track') {
        navigateTo('tracks');
        // 切換到該賽道
        setTimeout(() => {
            // 如果該賽道被目前的過濾器隱藏，則重置過濾器
            const track = tracks[id];
            if (currentTrackFilter !== 'all' && !track.tags.includes(currentTrackFilter)) {
                filterTracks('all', document.querySelector('.track-filter-container .filter-tag:first-child'));
            }
            // 這裡需要注意的是，id 是原始陣列的 index
            // 我們需要找到他在 activeTrackList 中的位置來呼叫 switchTrack
            // 或者直接用原始 index 切換，但要確保 renderTracks 邏輯支援
            // 由於我們改寫了 renderTracks，現在 switchTrack 接受 activeList 的 index
            // 因此最簡單的方法是重置為 'all' filter，然後切換到對應的原始 index
            filterTracks('all', document.querySelector('.track-filter-container .filter-tag:first-child'));
            switchTrack(parseInt(id)); // 在 'all' 模式下，activeList index === original index
            
            // 滾動到賽道區域
            document.getElementById('tracks-page').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    } else if (type === 'section') {
        if (id === 'about-f1') {
            navigateToAbout(tab);
        } else {
            navigateTo(id);
        }
    }
}

// =========================================
// === 互動功能 (Modal) ===
// =========================================

function openModal(name, type) {
    const modal = document.getElementById('infoModal');
    const social = document.getElementById('modalSocial');
    const statsGrid = document.getElementById('modalStatsGrid');
    social.innerHTML = '';
    statsGrid.innerHTML = '';

    const visualStatsContainer = document.createElement('div');
    visualStatsContainer.className = 'driver-visual-stats';

    const existingVisual = document.querySelector('.driver-visual-stats');
    if(existingVisual) existingVisual.remove();

    if (type === 'driver') {
        const d = drivers.find(x => x.name === name);
        if(!d) return;

        document.getElementById('modalImg').src = d.img;
        document.getElementById('modalName').textContent = d.name;
        document.getElementById('modalNumber').textContent = d.number;
        document.getElementById('modalTeam').textContent = d.team;
        
        const quoteEl = document.getElementById('modalQuote');
        if (quoteEl) {
            quoteEl.innerHTML = d.quote || "No quote available.";
            quoteEl.style.display = 'inline-block';
            document.querySelector('.quote-container').style.display = 'block';
        }

        document.getElementById('modalBio').textContent = d.bio;

        const maxPoints = 600;
        const maxPodiums = 24;
        const pointsPct = Math.min((d.points / maxPoints) * 100, 100);
        const podiumsPct = Math.min((d.podiums / maxPodiums) * 100, 100);

        let wcHtml = '<span style="color:var(--text-muted)">尚未獲得</span>';
        if (d.wc > 0) {
            wcHtml = '<div class="wc-container">';
            for(let i=0; i<d.wc; i++) {
                wcHtml += `<i class="fas fa-trophy trophy-icon" style="animation-delay: ${i*0.1}s"></i>`;
            }
            wcHtml += `</div>`;
        }

        // Modal 內的標籤中文化
        visualStatsContainer.innerHTML = `
            <div class="visual-stat-row">
                <span class="visual-label">賽季積分</span>
                <div class="visual-bar-container">
                    <div class="progress-track"></div>
                    <div class="progress-fill" style="width: 0%" data-width="${pointsPct}%"></div>
                </div>
                <span class="visual-value">${d.points}</span>
            </div>
            <div class="visual-stat-row">
                <span class="visual-label">頒獎台</span>
                <div class="visual-bar-container">
                    <div class="progress-track"></div>
                    <div class="progress-fill" style="width: 0%" data-width="${podiumsPct}%"></div>
                </div>
                <span class="visual-value">${d.podiums}</span>
            </div>
            <div class="visual-stat-row">
                <span class="visual-label">世界冠軍</span>
                <div style="flex-grow:1; margin:0 20px;">
                   ${wcHtml}
                </div>
                <span class="visual-value" style="color:gold;">${d.wc > 0 ? d.wc : ''}</span>
            </div>
        `;

        statsGrid.parentNode.insertBefore(visualStatsContainer, statsGrid);

        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 100);

        // 文字詳細數據中文化
        const stats = [
            { label: '所屬車隊', value: d.team },
            { label: '國籍', value: d.country },
            { label: '參賽場次', value: d.stats.grandsPrix },
            { label: '最高完賽排名', value: d.stats.highestFinish },
            { label: '最高起跑排位', value: d.stats.highestGrid },
            { label: '出生地', value: d.stats.birthPlace },
        ];

        statsGrid.innerHTML = stats.map(s => `
            <div class="stat-box">
                <span class="stat-label">${s.label}</span>
                <span class="stat-value">${s.value}</span>
            </div>
        `).join('');

        social.innerHTML = `
            <a href="https://instagram.com/${d.ig}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="https://twitter.com/${d.x}" target="_blank" title="X (Twitter)"><i class="fab fa-x-twitter"></i></a>
            <a href="${d.shop}" target="_blank" title="Merchandise Shop"><i class="fas fa-shopping-cart"></i></a>
        `;

    } else {
        // 車隊 Modal 邏輯 - 修改: 顯示車手圖片
        const t = teams.find(x => x.name === name);
        if(!t) return;
        document.getElementById('modalImg').src = t.logo;
        document.getElementById('modalName').textContent = t.name;
        document.getElementById('modalNumber').textContent = '';
        document.getElementById('modalTeam').textContent = 'Constructor';
        document.getElementById('modalBio').textContent = t.bio;
        document.getElementById('modalQuote').textContent = ''; 
        document.querySelector('.quote-container').style.display = 'none';

        const maxTeamPoints = 1000;
        const ptsPct = Math.min((t.points / maxTeamPoints) * 100, 100);
        
        visualStatsContainer.innerHTML = `
             <div class="visual-stat-row">
                <span class="visual-label">車隊積分</span>
                <div class="visual-bar-container">
                    <div class="progress-track"></div>
                    <div class="progress-fill" style="width: 0%" data-width="${ptsPct}%"></div>
                </div>
                <span class="visual-value">${t.points}</span>
            </div>
        `;
        statsGrid.parentNode.insertBefore(visualStatsContainer, statsGrid);
        
        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 100);

        // 找出該車隊的車手
        const teamDrivers = drivers.filter(d => d.team === t.name);
        let driversHtml = '<div class="modal-team-drivers">';
        teamDrivers.forEach(td => {
             driversHtml += `
                <div class="team-driver-item" onclick="openModal('${td.name}', 'driver')" style="cursor:pointer">
                    <img src="${td.img}" alt="${td.name}">
                    <span>${td.name}</span>
                </div>
             `;
        });
        driversHtml += '</div>';

        // 替換原本的統計 grid 為包含車手列表的內容
        statsGrid.innerHTML = `
            <div class="stat-box"><span class="stat-label">當前排名</span><span class="stat-value">${teams.indexOf(t)+1}</span></div>
            <div class="stat-box" style="grid-column: span 2;">
                <span class="stat-label">車手</span>
                ${driversHtml}
            </div>
        `;

        social.innerHTML = `
            <a href="${t.url}" target="_blank" style="font-size: 1rem; background: var(--f1-red); color:white; padding: 5px 15px; border-radius: 20px; text-decoration: none; opacity: 1;">
                <i class="fas fa-external-link-alt"></i> 官方網站
            </a>
        `;
    }
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(e) {
    if(e.target.id === 'infoModal' || e.target.className === 'modal-overlay' || e.target.className === 'close-modal-btn') {
        document.getElementById('infoModal').classList.remove('show');
        document.body.style.overflow = 'auto';
        
        const v = document.querySelector('.driver-visual-stats');
        if(v) v.remove();
    }
}

function initMouseGlow() {
    const glow = document.querySelector('.mouse-glow');
    if(!glow) return;
    window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

function initParticles() {
    if(typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#e10600" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#e10600", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }
}

function animatePoints() {
    const nums = document.querySelectorAll('.animate-num');
    nums.forEach(el => {
        const target = parseInt(el.getAttribute('data-val'));
        const current = parseInt(el.innerText);
        if (current === target) return;
        
        el.classList.add('count-up-highlight');
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const val = Math.floor(progress * target);
            el.innerText = val;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.classList.remove('count-up-highlight');
            }
        }
        requestAnimationFrame(update);
    });
}

function celebrateWinner() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e10600', '#ffffff', '#ffcc00']
        });
    }
}

function initScrollReveal() {
    const sections = document.querySelectorAll('section, .standings-container, .news-grid, .home-intro-box, .home-media-layout');
    sections.forEach(s => s.classList.add('reveal-item'));
    window.addEventListener('scroll', checkReveal);
    checkReveal();
}

function checkReveal() {
    const items = document.querySelectorAll('.reveal-item');
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            item.classList.add('revealed');
        }
    });
}

function handleSearch(query) {
    if (!query) {
        renderDrivers();
        return;
    }
    const q = query.toLowerCase();
    const filtered = drivers.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.team.toLowerCase().includes(q) || 
        d.country.toLowerCase().includes(q)
    );
    
    const driversPage = document.getElementById('drivers-page');
    if (!driversPage.classList.contains('active')) {
        navigateTo('drivers');
    }
    
    renderDrivers(filtered);
}

// =========================================
// === 1. 反應測試遊戲 ===
// =========================================
let isGameRunning = false;
let isLightsOut = false;
let startTime = 0;
let gameTimeout; 
let gameInterval; 

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
    const btn = document.getElementById('gameButton');
    if(btn) {
        btn.textContent = '開始測試';
        btn.onclick = startGameSequence;
    }
}

function startGameSequence() {
    if (isGameRunning) return;
    isGameRunning = true;
    isLightsOut = false; 
    
    const btn = document.getElementById('gameButton');
    const status = document.getElementById('gameStatus');
    const timer = document.getElementById('timerDisplay');
    
    btn.textContent = '燈滅起跑！(點擊此處反應)';
    btn.onclick = handleGameClick; 
    status.innerHTML = '<i class="fas fa-flag-checkered"></i> 準備起跑...';
    timer.textContent = '0.000 秒';
    
    document.querySelectorAll('.light').forEach(l => l.classList.remove('on'));
    
    let count = 0;
    gameInterval = setInterval(() => {
        if (count < 5) {
            document.getElementById(`light-${count}`).classList.add('on');
            count++;
        } else {
            clearInterval(gameInterval);
            const delay = Math.random() * 3000 + 1000;
            gameTimeout = setTimeout(() => {
                document.querySelectorAll('.light').forEach(l => l.classList.remove('on'));
                isLightsOut = true; 
                startTime = performance.now(); 
                status.innerHTML = '<i class="fas fa-bolt" style="color:#ffcc00"></i> GO GO GO!';
            }, delay);
        }
    }, 800);
}

function handleGameClick() {
    if (!isLightsOut) {
        clearInterval(gameInterval);
        clearTimeout(gameTimeout);
        isGameRunning = false;
        isLightsOut = false;
        
        const status = document.getElementById('gameStatus');
        status.innerHTML = '<i class="fas fa-times-circle" style="color:var(--f1-red)"></i> 搶跑違規！(Jump Start)';
        
        const btn = document.getElementById('gameButton');
        btn.textContent = '重新開始';
        btn.onclick = startGameSequence;
        
        document.querySelectorAll('.light').forEach(l => l.classList.remove('on'));
        return;
    }

    const reactionTime = (performance.now() - startTime) / 1000;
    isGameRunning = false;
    isLightsOut = false;
    
    document.getElementById('gameStatus').textContent = '你的反應時間：';
    document.getElementById('timerDisplay').textContent = reactionTime.toFixed(3) + ' 秒';
    
    const btn = document.getElementById('gameButton');
    btn.textContent = '再試一次';
    btn.onclick = startGameSequence;
    
    if (reactionTime < 0.2) celebrateWinner();
}

// =========================================
// === 2. 記憶力大挑戰 ===
// =========================================
let memoryCards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let isPreviewing = false; 
let isGameStarted = false; 

function initMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;
    
    moves = 0;
    matches = 0;
    flippedCards = [];
    isPreviewing = false;
    isGameStarted = false;

    document.getElementById('moveCount').textContent = moves;
    document.getElementById('matchCount').textContent = matches;
    
    const statusLabel = document.getElementById('memoryStatusLabel');
    if (statusLabel) statusLabel.innerHTML = '配對相同的車隊 Logo';

    const teamLogos = teams.slice(0, 6).map(t => t.logo);
    const cardValues = [...teamLogos, ...teamLogos];
    cardValues.sort(() => Math.random() - 0.5);
    
    grid.innerHTML = cardValues.map((logo) => `
        <div class="memory-card" data-logo="${logo}" onclick="flipCard(this)">
            <div class="memory-card-back"><i class="fas fa-question"></i></div>
            <div class="memory-card-front"><img src="${logo}"></div>
        </div>
    `).join('');
}

function startMemoryChallenge() {
    if (isPreviewing) return; 

    initMemoryGame(); 
    isGameStarted = true;
    isPreviewing = true;
    
    const allCards = document.querySelectorAll('.memory-card');
    const statusLabel = document.getElementById('memoryStatusLabel');
    
    allCards.forEach(card => card.classList.add('flipped'));

    let timeLeft = 5;
    if (statusLabel) statusLabel.innerHTML = `<i class="fas fa-eye"></i> 記住位置：${timeLeft}s`;

    const countdown = setInterval(() => {
        timeLeft--;
        if (statusLabel) statusLabel.innerHTML = `<i class="fas fa-eye"></i> 記住位置：${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            allCards.forEach(card => card.classList.remove('flipped'));
            isPreviewing = false;
            if (statusLabel) statusLabel.innerHTML = `<i class="fas fa-play"></i> 挑戰開始！`;
        }
    }, 1000);
}

function flipCard(card) {
    if (!isGameStarted || isPreviewing || flippedCards.length === 2 || 
        card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moveCount').textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.logo === card2.dataset.logo;
    
    if (isMatch) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matches++;
        document.getElementById('matchCount').textContent = matches;
        flippedCards = [];
        if (matches === 6) {
            setTimeout(() => {
                celebrateWinner();
                alert(`恭喜完成！總共花了 ${moves} 步。`);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}