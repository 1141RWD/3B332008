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
            
            // Toggle body scrolling to prevent background scroll when menu is open
            if(navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
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
            if (navLinks) {
                navLinks.classList.remove('active');
                // Restore scrolling when link is clicked
                document.body.style.overflow = '';
            }
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
    buildSearchIndex(); // 建立搜尋索引
    initCustomCursor(); // 初始化游標 (已移除音效)
    initSparks(); // 初始化火花特效
}

// =========================================
// === 視覺特效邏輯 (3D Tilt) ===
// =========================================

function initTiltEffect() {
    // 手機版禁用 Tilt 效果以節省效能與避免操作怪異
    if (window.innerWidth <= 900) return;

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
// === 數據定義 (完整資料) ===
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
        bio: "Max Verstappen 17 歲即登陸 F1，是史上最年輕的出賽者。這位擁有「獅子心」的荷蘭車手以本能般的直覺駕駛紅牛賽車，打破無數紀錄。他不僅是史上最年輕的分站冠軍，更憑藉硬派的防守與無畏的超車風格成為焦點。歷經早期的青澀磨練，Verstappen 展現出驚人的成熟度，並在 2021 至 2024 年間達成四連霸壯舉。出身賽車世家的他，雖然在場上直言不諱，私下卻保有靦腆的一面。作為新世代的領軍人物，他正持續改寫 F1 的歷史極限。", ig: "maxverstappen1", x: "Max33Verstappen", shop: "https://www.redbullracing.com/" 
    },
    { 
        name: "Yuki Tsunoda", team: "Red Bull Racing", number: 22, points: 33, podiums: 0, img: "YT.jpg", country: "日本", flagCode: "jp", wc: 0, 
        quote: "I REALLY LIKE TO BATTLE AND I DON'T LOSE MUCH WHEN BATTLE HAPPENS.",
        stats: { grandsPrix: 66, highestFinish: 4, highestGrid: 6, birthPlace: "日本 相模原" },
        bio: "角田裕毅在短短三年內從日本 F4 躍升至 F1，展現驚人天賦。儘管初入歐洲時對賽道陌生，他仍憑藉 F2 殿軍的強悍實力闖入最高殿堂。歷經四個賽季的磨練，他從起步的青澀轉向穩定成熟，並於 2025 年初正式入主紅牛（Red Bull）車隊。作為日本史上最接近分站冠軍的車手，Red Bull 對他寄予厚望，看好他能打破日本車手零勝的紀錄，書寫歷史新篇章。", ig: "yukitsunoda0511", x: "yukitsunoda0711", shop: "https://www.redbullracing.com/" 
    },
    { 
        name: "Lando Norris", team: "McLaren", number: 4, points: 423, podiums: 12, img: "LN.jpg", country: "英國", flagCode: "gb", wc: 0, 
        quote: "'M READY TO BRING THE FIGHT TO EVERYONE.",
        stats: { grandsPrix: 104, highestFinish: 1, highestGrid: 1, birthPlace: "英國 布里斯托" },
        bio: "2025 年世界冠軍 Lando Norris 以華麗車技與鬥志著稱。自 2019 年加入 McLaren 以來，他展現出超越資深隊友的排位速度。2024 年他奪下首勝，助車隊重返榮耀；2025 年更憑藉單季 7 勝，在季末逆轉 34 分分差，擊敗 Verstappen 封王。場外他熱衷設計，性格謙遜卻野心勃勃。隨著 2026 新規到來，身為車隊核心的他將引領 McLaren 續寫輝煌。", ig: "landonorris", x: "LandoNorris", shop: "https://www.mclarenstore.com/" 
    },
    { 
        name: "Oscar Piastri", team: "McLaren", number: 81, points: 410, podiums: 9, img: "OP.jpg", country: "澳洲", flagCode: "au", wc: 0, 
        quote: "I LIKE CARS, I LIKE RACING, BUT I THINK THE COMPETITION SIDE OF THINGS IS PROBABLY THE NUMBER ONE THING.",
        stats: { grandsPrix: 44, highestFinish: 1, highestGrid: 2, birthPlace: "澳洲 墨爾本" },
        bio: "Oscar Piastri 展現了史上最強的晉升履歷，連續奪下 F3 與 F2 冠軍後，引發兩大車隊爭奪。2023 年加入 McLaren 首季即登頒獎台，2024 年更以兩座分站冠軍助車隊奪回車隊總冠軍。2025 年，僅是第三年參賽的他展現爭冠實力，單季豪取 7 勝並長期領跑積分榜，最終在收官戰激鬥後獲得年度季軍。其冷靜與天賦讓眾人深信，他成為世界冠軍只是時間問題。", ig: "oscarpiastri", x: "OscarPiastri", shop: "https://www.mclarenstore.com/" 
    },
    { 
        name: "Charles Leclerc", team: "Ferrari", number: 16, points: 242, podiums: 11, img: "CL.jpg", country: "摩納哥", flagCode: "mc", wc: 0, 
        quote: "WHATEVER THE POSITION IS AT STAKE, YOU'VE GOT TO DO YOUR ABSOLUTE BEST AS A DRIVER WHETHER YOU'RE FIGHTING FOR THE FIFTH, FOURTH OR FIRST POSITION.",
        stats: { grandsPrix: 125, highestFinish: 1, highestGrid: 1, birthPlace: "摩納哥 蒙地卡羅" },
        bio: "出身摩納哥的 Leclerc 以 GP3 與 F2 雙冠王氣勢登陸 F1。2019 年入主 Ferrari 後，他憑藉強悍實力擊敗隊友 Vettel，並在蒙札主場奪冠，成為 Tifosi 的新英雄。2022 年他展現爭冠實力，是唯一能威脅 Verstappen 的對手。場外的他謙遜體貼，承載著已故父親與恩師 Jules Bianchi 的夢想前行。儘管車隊近年陷入苦戰，他卓越的排位速度與鬥志，仍證明自己是 F1 最閃耀的巨星之一。", ig: "charles_leclerc", x: "Charles_Leclerc", shop: "https://store.ferrari.com/" 
    },
    { 
        name: "Lewis Hamilton", team: "Ferrari", number: 44, points: 156, podiums: 197, img: "LH.jpg", country: "英國", flagCode: "gb", wc: 7, 
        quote: "DRIVING A SCUDERIA FERRARI HP CAR FOR THE FIRST TIME WAS ONE OF THE BEST FEELINGS OF MY LIFE.",
        stats: { grandsPrix: 332, highestFinish: 1, highestGrid: 1, birthPlace: "英國 斯蒂夫尼奇" },
        bio: "「Still I Rise」是 Lewis Hamilton 的座右銘。這位七屆世界冠軍締造了 F1 史上最多的桿位與勝場紀錄，實力足以與洗拿、舒馬赫並肩。他以獨特的個人風格打破傳統框架，贏得所有對手的敬重。儘管 2025 年轉投 Ferrari 的首賽季面臨極大挑戰，生涯首度未能站上頒獎台，但這位受封爵位的傳奇車手依然鬥志昂揚。當「Hammertime」降臨，全球車迷都在期待他如何在歷史扉頁寫下新篇章。", ig: "lewishamilton", x: "LewisHamilton", shop: "https://store.ferrari.com/" 
    },
    { 
        name: "George Russell", team: "Mercedes", number: 63, points: 319, podiums: 14, img: "GR.jpg", country: "英國", flagCode: "gb", wc: 0, 
        quote: "ON GEORGE, YOU CAN RELY ON HIM WHEN IT COMES TO LAP TIMES AND RACING, SO SPIRITS ARE HIGH.",
        stats: { grandsPrix: 104, highestFinish: 1, highestGrid: 1, birthPlace: "英國 金斯林" },
        bio: "秉持「猶豫就全速衝刺」的座右銘，George Russell 憑藉 GP3 與 F2 冠軍頭銜強勢登陸 F1。在 Williams 時期他便展現驚人速度，2022 年入主 Mercedes 首季即奪分站冠軍。隨著 Hamilton 於 2025 年轉投 Ferrari，Russell 正式接棒領導車隊，在 McLaren 統治性的賽季中仍強勢奪下兩勝。面對 2026 年新規挑戰，這位兼具鬥志與速度的英國車手，已準備好帶領銀箭車隊衝擊世界冠軍。", ig: "georgerussell63", x: "GeorgeRussell63", shop: "https://shop.mercedesamgf1.com/" 
    },
    { 
        name: "Kimi Antonelli", team: "Mercedes", number: 12, points: 150, podiums: 0, img: "KA.jpg", country: "義大利", flagCode: "it", wc: 0, 
        quote: "RACING FOR MERCEDES IS A BIG RESPONSIBILITY, BUT AT THE SAME TIME IT’S A GREAT OPPORTUNITY AND A PRIVILEGE.",
        stats: { grandsPrix: 0, highestFinish: "N/A", highestGrid: "N/A", birthPlace: "義大利 波隆那" },
        bio: "Antonelli 的崛起堪稱神速，他在卡丁車與 F4 橫掃冠軍後，被 Mercedes 提拔跳級至 F2。儘管承擔著接替 Hamilton 的巨大壓力，他仍以銀石與匈牙利站的勝場證明實力，尤其在比利時站的勇敢超車更令人驚豔。2025 年，這位剛滿 18 歲的義大利新秀正式入主 Mercedes，並在新人球季奪下 150 積分與 3 座頒獎台。雖然偶有波折，但他非凡的天賦已證明自己正是銀箭軍團未來的希望。", ig: "kimi.antonelli", x: "KimiAntonelli", shop: "https://shop.mercedesamgf1.com/" 
    },
    { 
        name: "Fernando Alonso", team: "Aston Martin", number: 14, points: 56, podiums: 106, img: "FA.jpg", country: "西班牙", flagCode: "es", wc: 2, 
        quote: "I NEVER REGRET ANYTHING.",
        stats: { grandsPrix: 380, highestFinish: 1, highestGrid: 1, birthPlace: "西班牙 奧維耶多" },
        bio: "Fernando Alonso 是終結舒馬赫王朝的傳奇，曾刷新 F1 最年輕冠軍等多項紀錄。他擁有頂尖速度與戰略頭腦，自評全方位能力達 9/10。即便生涯中期待的第三冠遲未到來，他在重返 F1 後仍於 Alpine 與 Aston Martin 屢創佳績。現年逾 40 歲的他已創下史上首次 400 場參賽紀錄，並隨著技術大師 Adrian Newey 的加盟，這位老將正蓄勢待發，準備在綠色賽車中完成他未竟的奪冠大業。", ig: "fernandoalo_oficial", x: "alo_oficial", shop: "https://shop.astonmartinf1.com/" 
    },
    { 
        name: "Lance Stroll", team: "Aston Martin", number: 18, points: 33, podiums: 3, img: "LS.jpg", country: "加拿大", flagCode: "ca", wc: 0, 
        quote: "WE’VE GROWN SO MUCH AS A TEAM AND THERE’S STILL SO MUCH MORE TO LOOK FORWARD TO.",
        stats: { grandsPrix: 143, highestFinish: 3, highestGrid: 1, birthPlace: "加拿大 蒙特婁" },
        bio: "Lance Stroll 18 歲即加盟 Williams 登陸 F1，並在首季於巴庫站站上頒獎台，創下最年輕新秀領獎紀錄。身為企業家 Lawrence Stroll 之子，他不僅擁有優渥背景，更在蒙札與土耳其站的豪雨中證明了卓越的雨戰天賦。隨著車隊轉型為 Aston Martin，並迎來傳奇設計師 Adrian Newey 與老將 Alonso 加盟，這位擅長在起跑首圈搶位的加拿大車手，正準備在頂尖競爭中持續發光發熱。", ig: "lance_stroll", x: "lance_stroll", shop: "https://shop.astonmartinf1.com/" 
    },
    { 
        name: "Carlos Sainz", team: "Williams", number: 55, points: 64, podiums: 25, img: "CS.jpg", country: "西班牙", flagCode: "es", wc: 0, 
        quote: "I ALWAYS PERFORM AT MY BEST WHEN I JUST DON’T CARE ABOUT THE SITUATION AND HAVE A SINGLE MENTALITY THAT IT’S JUST GO FOR IT.",
        stats: { grandsPrix: 185, highestFinish: 1, highestGrid: 1, birthPlace: "西班牙 馬德里" },
        bio: "綽號「Chilli」的 Sainz 出身賽車世家，繼承了拉力傳奇父親的細膩車感與抗壓性。他在賽場上以直覺與智慧並重，能精準策劃比賽奪取積分。Sainz 職業生涯接連承接 Alonso 與 Vettel 等巨星的席位，壓力之下仍為 Ferrari 奪得四座分站冠軍。2025 年轉投 Williams 後，他迅速助車隊重返頒獎台。這位不畏挑戰的西班牙名將，正以實力走出屬於自己的輝煌道路。", ig: "carlossainz55", x: "Carlossainz55", shop: "https://www.williamsf1.com/store" 
    },
    { 
        name: "Alexander Albon", team: "Williams", number: 23, points: 73, podiums: 2, img: "AA.jpg", country: "泰國", flagCode: "th", wc: 0, 
        quote: "I’M READY TO WIN RACES, TO FIGHT FOR A CHAMPIONSHIP.",
        stats: { grandsPrix: 83, highestFinish: 3, highestGrid: 4, birthPlace: "英國 倫敦" },
        bio: "Alex Albon 出生於倫敦，代表泰國出賽。他在 2019 年以優異表現迅速從 Toro Rosso 晉升至紅牛車隊，雖在與 Verstappen 搭檔期間遭遇低潮並一度失去席次，但他憑藉測試車手的穩定表現於 2022 年成功重返圍場加盟 Williams。Albon 以超車冷靜、排位賽速度快且性格親和著稱，在 2024 與 2025 賽季不僅確立了車隊領袖地位，更以成熟的技術抓住這珍貴的第二次機會，成為圍場內最受敬重的車手之一。", ig: "alex_albon", x: "alex_albon", shop: "https://www.williamsf1.com/store" 
    },
    { 
        name: "Pierre Gasly", team: "Alpine", number: 10, points: 22, podiums: 4, img: "PG.jpg", country: "法國", flagCode: "fr", wc: 0, 
        quote: "THE MOMENT I LOVE THE MOST IS WHENEVER I GET IN THAT CAR, FIGHTING THE BEST 19 DRIVERS IN THE WORLD, AND THIS EXERCISE OF BEATING THEM.",
        stats: { grandsPrix: 132, highestFinish: 1, highestGrid: 2, birthPlace: "法國 魯昂" },
        bio: "Pierre Gasly 的 F1 生涯宛如雲霄飛車。2019 年晉升紅牛車隊後，因表現不敵隊友 Verstappen 而遭降編回 Toro Rosso。但他展現驚人韌性，於 2020 年在蒙札奪下激動人心的首勝。Gasly 隨後成為車隊核心，2021 年更單人貢獻全隊近八成積分。2023 年轉投法國車隊 Alpine 後，他持續站上頒獎台並尋求再次突破。這位「永不言棄」的車手正用實力證明，他具備立足頂尖戰區的絕對速度。", ig: "pierregasly", x: "PierreGASLY", shop: "https://boutique.alpinecars.com/" 
    },
    { 
        name: "Franco Colapinto", team: "Alpine", number: 43, points: 0, podiums: 0, img: "FC.jpg", country: "阿根廷", flagCode: "ar", wc: 0, 
        quote: "I WILL GIVE IT MY ALL TO DELIVER THE BEST POSSIBLE RESULTS.",
        stats: { grandsPrix: 9, highestFinish: 8, highestGrid: 9, birthPlace: "阿根廷 Pilar" },
        bio: "Franco Colapinto 的 F1 生涯充滿戲劇性。2024 年中，他受 Williams 提拔接替 Sargeant，成為 23 年來首位阿根廷 F1 車手，隨即展現出不遜於老將的驚人速度。雖然 2025 年初因 Sainz 加盟而轉任 Alpine 儲備車手，但他很快再次獲得徵召，於第七站起取代新秀 Doohan 重返正賽，並憑藉優異表現成功鎖定 2026 年的正賽席次。這位實力派新星正以強悍的競技狀態，掀起一場阿根廷賽車旋風。", ig: "francolapinto", x: "FranColapinto", shop: "https://www.williamsf1.com/store" 
    },
    { 
        name: "Esteban Ocon", team: "Haas", number: 31, points: 38, podiums: 3, img: "EO.jpg", country: "法國", flagCode: "fr", wc: 0, 
        quote: "TOUGH RACING IS ALWAYS COOL TO ME. RACING SIDE-BY-SIDE, BEING VERY CLOSE, THAT’S WHAT RACING IS ALL ABOUT.",
        stats: { grandsPrix: 133, highestFinish: 1, highestGrid: 3, birthPlace: "法國 埃夫勒" },
        bio: "Esteban Ocon 的賽車生涯始於父母賣屋支持的「犧牲」。他曾擊敗 Verstappen 奪下 F3 冠軍，並於 2016 年踏入 F1。儘管曾因車隊資金問題在 2019 年被迫退居幕後，他仍憑藉信念於 2020 年回歸 Renault（現 Alpine），並在 2021 年匈牙利站奪得生涯首勝。2025 年轉投 Haas 車隊開啟新篇章。這位歷經起伏的車手證明了只要具備堅定的鬥志與才華，即便出身平凡也能在頂尖殿堂站穩腳步。", ig: "estebanocon", x: "OconEsteban", shop: "https://haasf1team.store/" 
    },
    { 
        name: "Oliver Bearman", team: "Haas", number: 87, points: 41, podiums: 0, img: "OB.jpg", country: "英國", flagCode: "gb", wc: 0, 
        quote: "I’M A COMPETITIVE GUY, I LIKE TO BE GOOD AT EVERYTHING I DO.",
        stats: { grandsPrix: 1, highestFinish: 7, highestGrid: 11, birthPlace: "英國 切姆斯福德" },
        bio: "Oliver Bearman 在 2024 年沙烏地站替補受傷的 Sainz 出賽，首秀即奪第七名驚豔圍場。憑藉這份過人天賦，他成功鎖定 2025 年 Haas 車隊的正賽席次。在新人球季中，他展現出超越年齡的成熟，不僅在墨西哥站奪得車隊年度最佳的第四名，積分更超越了經驗豐富的隊友 Ocon。身為 Ferrari 儲備體系的核心，這位強勢崛起的新星正以表現證明，他絕對是未來入主躍馬車隊的頭號人選。", ig: "olliebearman", x: "OllieBearman", shop: "https://haasf1team.store/" 
    },
    { 
        name: "Liam Lawson", team: "RB", number: 30, points: 38, podiums: 2, img: "LL.jpg", country: "紐西蘭", flagCode: "nz", wc: 0, 
        quote: "I'M NOT HERE TO MAKE FRIENDS. I'M HERE TO WIN - THAT'S WHAT I'M FOCUSED ON DOING.",
        stats: { grandsPrix: 5, highestFinish: 9, highestGrid: 10, birthPlace: "紐西蘭 哈斯廷斯" },
        bio: "Liam Lawson 在 2023 年頂替受傷的 Ricciardo 出賽，於新加坡站擊敗 Verstappen 闖入 Q3 並奪分，一戰成名。他在 2024 年底重返賽場，並於 2025 年獲得晉升紅牛一隊的黃金機會。儘管在經歷兩場艱難賽事後被調回 Racing Bulls（原 AlphaTauri），這位受《汽車總動員》啟發的紐西蘭人並未氣餒，反而迅速重建聲望，以穩健表現證明自己是圍場中不可或缺的實力派成員。", ig: "liamlawson30", x: "LiamLawson30", shop: "https://f1store.formula1.com/" 
    },
    { 
        name: "Isack Hadjar", team: "RB", number: 6, points: 51, podiums: 0, img: "IH.jpg", country: "法國", flagCode: "fr", wc: 0, 
        quote: "I’M SOMEONE WHO FOUGHT HIS WAY TO F1 THE HARD WAY.",
        stats: { grandsPrix: 0, highestFinish: "N/A", highestGrid: "N/A", birthPlace: "法國 巴黎" },
        bio: "巴黎出生的 Hadjar 經歷 F2 時期的低潮後，憑藉 2024 年奪得年度亞軍的強悍實力，於 2025 年加入 Racing Bulls 登陸 F1。儘管開幕戰失利，但他迅速展現天賦，在賽季後半段頻繁闖入 Q3，並在荷蘭站奪得生涯首座頒獎台。最終他以年度 51 分超越隊友 Lawson，卓越表現使他獲得紅牛高層青睞，宣布將於 2026 年晉升紅牛一隊，正式與 Max Verstappen 搭檔，完成生涯的華麗跳躍。", ig: "isackhadjar", x: "IsackHadjar", shop: "https://f1store.formula1.com/" 
    },
    { 
        name: "Nico Hülkenberg", team: "Stake F1 Team", number: 27, points: 51, podiums: 0, img: "NH.jpg", country: "德國", flagCode: "de", wc: 0, 
        quote: "YOU’VE GOT TO BE THERE WHEN THE OPPORTUNITY PRESENTS ITSELF, BECAUSE THE RACE IS NOT OVER UNTIL IT’S OVER.",
        stats: { grandsPrix: 206, highestFinish: 4, highestGrid: 1, birthPlace: "德國 埃梅里希" },
        bio: "自 2010 年出道以來，Hulkenberg 以強大的穩定性與雨戰天賦著稱，甚至曾於新人之姿奪下桿位並贏得利曼 24 小時耐力賽冠軍。儘管長期保有「史上最多出賽卻未登領獎台」的尷尬紀錄，他仍憑藉幽默與實力重返 Haas 並轉戰 Kick Sauber。2025 年，他終於在該隊奪得生涯首座 F1 頒獎台。隨著車隊即將在 2026 年轉為 Audi 廠隊，這位經驗豐富的德國老將已準備好在職業生涯末期再創巔峰。", ig: "hulkhulkenberg", x: "HulkHulkenberg", shop: "https://www.sauber-group.com/" 
    },
    { 
        name: "Gabriel Bortoleto", team: "Stake F1 Team", number: 5, points: 19, podiums: 0, img: "GB.jpg", country: "巴西", flagCode: "br", wc: 0, 
        quote: "I WANT TO BE ABLE TO FIGHT FOR THINGS AND TO MAKE MY COUNTRY PROUD OF EVERYTHING I CAN ACHIEVE.",
        stats: { grandsPrix: 0, highestFinish: "N/A", highestGrid: "N/A", birthPlace: "巴西 聖保羅" },
        bio: "身為 Senna 的崇拜者，Bortoleto 在 Alonso 經紀公司的助力下，連續奪得 2023 年 F3 與 2024 年 F2 年度總冠軍，其中在蒙札站從墊底追至第一的表現更是驚豔全球。2025 年他加盟 Kick Sauber 開啟 F1 生涯，成為自 2017 年後首位巴西全職車手。儘管家鄉賽事遭遇波折，但他憑藉 5 次前十名的穩定積分表現，成功贏得奧迪（Audi）高層認可，鎖定了 2026 年 Audi 廠隊的首賽季席次。", ig: "gabrielbortoleto", x: "G_Bortoleto", shop: "https://www.sauber-group.com/" 
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
                    <div style="display:flex; justify-content:space-around; border-top:1px solid var(--card-border); padding-top:10px;">
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
                <div class="podium-driver"><img src="${top3[1].logo}"></div>
                <div class="podium-info">
                    <span class="p-name">${top3[1].name}</span>
                    <span class="p-points"><span class="animate-num" data-val="${top3[1].points}">0</span> PTS</span>
                </div>
            </div>
            <div class="podium-item rank-1 reveal-item" style="cursor:pointer" onclick="celebrateWinner()" title="點擊這裡慶祝！">
                <span class="p-rank">1</span>
                <div class="podium-driver"><img src="${top3[0].logo}"></div>
                <div class="podium-info">
                    <span class="p-name">${top3[0].name}</span>
                    <span class="p-points"><span class="animate-num" data-val="${top3[0].points}">0</span> PTS</span>
                </div>
            </div>
            <div class="podium-item rank-3 reveal-item">
                <span class="p-rank">3</span>
                <div class="podium-driver"><img src="${top3[2].logo}"></div>
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
                        ${t.tags.map(tag => `<span class="filter-tag" style="display:inline-block; margin-right:5px; font-size:0.8rem; padding: 5px 10px;">${tag}</span>`).join('')}
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
            keywords: ["反應", "game", "燈滅", "起跑", "玩"], 
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
// === 1. 反應測試遊戲 (F1 Gantry Style) ===
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
    
    // 建立 5 個燈柱，每個燈柱有 2 個燈
    for(let i=0; i<5; i++) {
        let col = document.createElement('div');
        col.className = 'gantry-column';
        col.id = `gantry-col-${i}`;
        
        // 上燈
        let topLight = document.createElement('div');
        topLight.className = 'gantry-light';
        
        // 下燈
        let botLight = document.createElement('div');
        botLight.className = 'gantry-light';
        
        col.appendChild(topLight);
        col.appendChild(botLight);
        container.appendChild(col);
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
    
    // 重置所有燈號 (移除 .on)
    document.querySelectorAll('.gantry-light').forEach(l => l.classList.remove('on'));
    
    let count = 0;
    
    // 立即亮起第一組 (count = 0)
    activateColumn(0);
    count++;

    gameInterval = setInterval(() => {
        if (count < 5) {
            activateColumn(count);
            count++;
        } else {
            clearInterval(gameInterval);
            const delay = Math.random() * 3000 + 1000;
            gameTimeout = setTimeout(() => {
                // LIGHTS OUT
                document.querySelectorAll('.gantry-light').forEach(l => l.classList.remove('on'));
                isLightsOut = true; 
                startTime = performance.now(); 
                status.innerHTML = '<i class="fas fa-bolt" style="color:#ffcc00"></i> GO GO GO!';
            }, delay);
        }
    }, 1000); // F1 燈號間隔大約一秒
}

function activateColumn(colIndex) {
    const col = document.getElementById(`gantry-col-${colIndex}`);
    if(col) {
        const lights = col.querySelectorAll('.gantry-light');
        lights.forEach(l => l.classList.add('on'));
    }
}

function handleGameClick() {
    // 點擊後必須清除計時器，防止後續燈號邏輯繼續跑
    clearInterval(gameInterval);
    clearTimeout(gameTimeout);
    
    // 若遊戲未開始且未等待起跑 (e.g. 已經結束)，則重置
    if (!isGameRunning && !isLightsOut) {
        startGameSequence();
        return;
    }

    if (!isLightsOut) {
        // 偷跑 (Jump Start)
        isGameRunning = false;
        
        const status = document.getElementById('gameStatus');
        status.innerHTML = '<i class="fas fa-times-circle" style="color:var(--f1-red)"></i> 搶跑違規！(Jump Start)';
        
        const btn = document.getElementById('gameButton');
        btn.textContent = '重新開始';
        btn.onclick = startGameSequence;
        
        // 保持當前燈號狀態，或全滅
        document.querySelectorAll('.gantry-light').forEach(l => l.classList.remove('on'));
        return;
    }

    // 成功起跑
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
// === Custom Cursor (Sound Removed) ===
// =========================================

function initCustomCursor() {
    // 1. 建立游標元素
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const outline = document.createElement('div');
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    // 2. 游標移動邏輯
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // 核心點直接移動
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // 外圈稍微延遲 (使用 animate 達到平滑效果)
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // 3. 互動元素偵測 (Hover Effect)
    // 監聽更多元素，包括導航按鈕、圖片、表格行等
    const interactables = document.querySelectorAll('a, button, .data-card, .team-card, .podium-item, .tyre-btn, .filter-tag, tr, .track-video-link');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
}

// =========================================
// === F1 Titanium Sparks Effect ===
// =========================================

function initSparks() {
    const canvas = document.getElementById('sparksCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // 調整畫布大小
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 火花粒子類別
    class Particle {
        constructor(x, y, velocityX, velocityY) {
            this.x = x;
            this.y = y;
            // 模擬物理噴濺：加上隨機擴散
            this.vx = velocityX * 0.5 + (Math.random() - 0.5) * 4; 
            this.vy = velocityY * 0.5 + (Math.random() - 0.5) * 4;
            this.life = 1; // 生命週期 (100%)
            this.decay = Math.random() * 0.03 + 0.02; // 衰減速度
            this.size = Math.random() * 3 + 1;
            // F1 火花顏色：金黃色到紅色漸層
            this.color = Math.random() > 0.5 ? '#ffcc00' : '#ff4d00'; 
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2; // 重力效果 (火花會稍微下墜)
            this.vx *= 0.95; // 空氣阻力
            this.vy *= 0.95;
            this.life -= this.decay;
        }

        draw() {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 追蹤滑鼠速度
    let lastX = 0;
    let lastY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
        currentX = e.clientX;
        currentY = e.clientY;
        
        // 計算滑鼠移動速度
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        // 只有移動速度夠快時才產生火花 (模擬摩擦力)
        if (speed > 5) {
            const count = Math.floor(speed / 3); // 速度越快火花越多
            for (let i = 0; i < count; i++) {
                // 讓火花從游標的相反方向噴出
                particles.push(new Particle(currentX, currentY, -dx * 0.1, -dy * 0.1));
            }
        }

        lastX = currentX;
        lastY = currentY;
    });

    // 動畫迴圈
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // 使用倒序迴圈以便移除粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    animate();
}