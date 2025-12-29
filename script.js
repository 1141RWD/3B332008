// =========================================
// === 初始化與核心邏輯 ===
// =========================================

let favorites = JSON.parse(localStorage.getItem('f1_favorites')) || [];
let currentTrackFilter = 'all';

function enterSite() {
    const hero = document.getElementById('hero');
    if (hero) {
        hero.classList.add('hero-fade-out');
        
        setTimeout(() => {
            hero.style.display = 'none';
            document.body.classList.remove('site-hidden');
            initApp(); 
            initScrollReveal();
        }, 800);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('site-hidden');
    initParticles();
    initMouseGlow();
    
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
    });

    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    }
});

function initApp() {
    renderStandings();     
    renderDrivers();       
    renderTeamStandings(); 
    renderTeams();         
    renderTracks();    
    initGame();        
    initMemoryGame();
    renderFavorites();
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
// === 數據定義 ===
// =========================================

const tracks = [
    { name: "澳洲大獎賽", location: "Melbourne", length: "5.278 km", laps: 58, record: "1:19.813", img: "01澳洲.jpg", tags: ["傳統", "高速"] },
    { name: "中國大獎賽", location: "Shanghai", length: "5.451 km", laps: 56, record: "1:32.238", img: "02中國.jpg", tags: ["傳統", "技術"] },
    { name: "日本大獎賽", location: "Suzuka", length: "5.807 km", laps: 53, record: "1:30.983", img: "03日本.jpg", tags: ["傳統", "高速"] },
    { name: "巴林大獎賽", location: "Sakhir", length: "5.412 km", laps: 57, record: "1:31.447", img: "04巴林.jpg", tags: ["夜戰", "傳統"] },
    { name: "沙烏地大獎賽", location: "Jeddah", length: "6.174 km", laps: 50, record: "1:30.734", img: "05沙烏地阿拉伯.jpg", tags: ["夜戰", "街道", "高速"] },
    { name: "邁阿密大獎賽", location: "Miami", length: "5.412 km", laps: 57, record: "1:29.708", img: "06邁阿密.jpg", tags: ["街道", "技術"] },
    { name: "伊莫拉大獎賽", location: "Imola", length: "4.909 km", laps: 63, record: "1:15.484", img: "07伊莫拉.jpg", tags: ["傳統", "技術"] },
    { name: "摩納哥大獎賽", location: "Monte Carlo", length: "3.337 km", laps: 78, record: "1:12.909", img: "08摩納哥.jpg", tags: ["街道", "傳統"] },
    { name: "西班牙大獎賽", location: "Barcelona", length: "4.657 km", laps: 66, record: "1:18.149", img: "09巴塞隆納.jpg", tags: ["傳統", "技術"] },
    { name: "加拿大大獎賽", location: "Montreal", length: "4.361 km", laps: 70, record: "1:13.078", img: "10加拿大.jpg", tags: ["傳統", "高速"] },
    { name: "奧地利大獎賽", location: "Spielberg", length: "4.318 km", laps: 71, record: "1:05.619", img: "11奧地利.jpg", tags: ["傳統", "高速"] },
    { name: "英國大獎賽", location: "Silverstone", length: "5.891 km", laps: 52, record: "1:27.097", img: "12銀石賽道.jpg", tags: ["傳統", "高速"] },
    { name: "比利時大獎賽", location: "Spa", length: "7.004 km", laps: 44, record: "1:46.286", img: "13SPA.jpg", tags: ["傳統", "高速"] },
    { name: "匈牙利大獎賽", location: "Budapest", length: "4.381 km", laps: 70, record: "1:16.627", img: "14匈牙利.jpg", tags: ["傳統", "技術"] },
    { name: "荷蘭大獎賽", location: "Zandvoort", length: "4.259 km", laps: 72, record: "1:11.097", img: "15荷蘭.jpg", tags: ["傳統", "技術"] },
    { name: "義大利大獎賽", location: "Monza", length: "5.793 km", laps: 53, record: "1:21.046", img: "16Monza.jpg", tags: ["傳統", "高速"] },
    { name: "亞塞拜然大獎賽", location: "Baku", length: "6.003 km", laps: 51, record: "1:43.009", img: "17巴庫城市賽.jpg", tags: ["街道", "高速"] },
    { name: "新加坡大獎賽", location: "Marina Bay", length: "4.940 km", laps: 62, record: "1:35.867", img: "18濱海灣街道賽.jpg", tags: ["夜戰", "街道"] },
    { name: "美國大獎賽", location: "Austin", length: "5.513 km", laps: 56, record: "1:36.169", img: "19美州賽道.jpg", tags: ["傳統", "技術"] },
    { name: "墨西哥大獎賽", location: "Mexico City", length: "4.304 km", laps: 71, record: "1:17.774", img: "20墨西哥.jpg", tags: ["傳統", "技術"] },
    { name: "巴西大獎賽", location: "Sao Paulo", length: "4.309 km", laps: 71, record: "1:10.540", img: "21巴西.jpg", tags: ["傳統", "技術"] },
    { name: "拉斯維加斯大獎賽", location: "Las Vegas", length: "6.201 km", laps: 50, record: "1:34.876", img: "22拉斯維加斯.jpg", tags: ["夜戰", "街道", "高速"] },
    { name: "卡達大獎賽", location: "Lusail", length: "5.419 km", laps: 57, record: "1:24.319", img: "23卡達.jpg", tags: ["夜戰", "傳統"] },
    { name: "阿布達比大獎賽", location: "Yas Marina", length: "5.281 km", laps: 58, record: "1:26.103", img: "24阿布達比.jpg", tags: ["夜戰", "傳統"] }
];

const drivers = [
    { name: "Max Verstappen", team: "Red Bull Racing", number: 1, points: 400, podiums: 15, img: "https://media.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png", country: "荷蘭", flag: "🇳🇱", wc: 3, bio: "當代最強。", ig: "maxverstappen1", x: "Max33Verstappen" },
    { name: "Liam Lawson", team: "Red Bull Racing", number: 30, points: 120, podiums: 2, img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png", country: "紐西蘭", flag: "🇳🇿", wc: 0, bio: "紐西蘭新星。", ig: "liamlawson30", x: "LiamLawson30" },
    { name: "Lando Norris", team: "McLaren", number: 4, points: 423, podiums: 12, img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png", country: "英國", flag: "🇬🇧", wc: 0, bio: "麥拉倫領軍人物。", ig: "landonorris", x: "LandoNorris" },
    { name: "Oscar Piastri", team: "McLaren", number: 81, points: 380, podiums: 9, img: "https://media.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png", country: "澳洲", flag: "🇦🇺", wc: 0, bio: "冷靜的超級新人。", ig: "oscarpiastri", x: "OscarPiastri" },
    { name: "Charles Leclerc", team: "Ferrari", number: 16, points: 350, podiums: 11, img: "https://media.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png", country: "摩納哥", flag: "🇲🇨", wc: 0, bio: "摩納哥之子。", ig: "charles_leclerc", x: "Charles_Leclerc" },
    { name: "Lewis Hamilton", team: "Ferrari", number: 44, points: 300, podiums: 197, img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png", country: "英國", flag: "🇬🇧", wc: 7, bio: "F1 活傳奇。", ig: "lewishamilton", x: "LewisHamilton" },
    { name: "George Russell", team: "Mercedes", number: 63, points: 280, podiums: 14, img: "https://media.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png", country: "英國", flag: "🇬🇧", wc: 0, bio: "Mercedes 領袖。", ig: "georgerussell63", x: "GeorgeRussell63" },
    { name: "Kimi Antonelli", team: "Mercedes", number: 12, points: 50, podiums: 0, img: "https://media.formula1.com/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png", country: "義大利", flag: "🇮🇹", wc: 0, bio: "超級新人。", ig: "kimi.antonelli", x: "KimiAntonelli" },
    { name: "Fernando Alonso", team: "Aston Martin", number: 14, points: 200, podiums: 106, img: "https://media.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png", country: "西班牙", flag: "🇪🇸", wc: 2, bio: "不老傳奇。", ig: "fernandoalo_oficial", x: "alo_oficial" },
    { name: "Lance Stroll", team: "Aston Martin", number: 18, points: 80, podiums: 3, img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png", country: "加拿大", flag: "🇨🇦", wc: 0, bio: "穩定的得分手。", ig: "lance_stroll", x: "lance_stroll" },
    { name: "Carlos Sainz", team: "Williams", number: 55, points: 180, podiums: 25, img: "https://media.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png", country: "西班牙", flag: "🇪🇸", wc: 0, bio: "經驗豐富。", ig: "carlossainz55", x: "Carlossainz55" },
    { name: "Alexander Albon", team: "Williams", number: 23, points: 60, podiums: 2, img: "https://media.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png", country: "泰國", flag: "🇹🇭", wc: 0, bio: "核心車手。", ig: "alex_albon", x: "alex_albon" },
    { name: "Pierre Gasly", team: "Alpine", number: 10, points: 90, podiums: 4, img: "https://media.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png", country: "法國", flag: "🇫🇷", wc: 0, bio: "法國支柱。", ig: "pierregasly", x: "PierreGASLY" },
    { name: "Jack Doohan", team: "Alpine", number: 7, points: 20, podiums: 0, img: "https://media.formula1.com/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png", country: "澳洲", flag: "🇦🇺", wc: 0, bio: "澳洲新血。", ig: "jackdoohan", x: "jackdoohan33" },
    { name: "Esteban Ocon", team: "Haas", number: 31, points: 70, podiums: 3, img: "https://media.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png", country: "法國", flag: "🇫🇷", wc: 0, bio: "強硬防守。", ig: "estebanocon", x: "OconEsteban" },
    { name: "Oliver Bearman", team: "Haas", number: 87, points: 30, podiums: 0, img: "https://media.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png", country: "英國", flag: "🇬🇧", wc: 0, bio: "一戰成名。", ig: "olliebearman", x: "OllieBearman" },
    { name: "Yuki Tsunoda", team: "RB", number: 22, points: 45, podiums: 0, img: "https://media.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png", country: "日本", flag: "🇯🇵", wc: 0, bio: "激情四射。", ig: "yukitsunoda0511", x: "yukitsunoda0711" },
    { name: "Isack Hadjar", team: "RB", number: 6, points: 10, podiums: 0, img: "https://media.formula1.com/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png", country: "法國", flag: "🇫🇷", wc: 0, bio: "青訓希望。", ig: "isackhadjar", x: "IsackHadjar" },
    { name: "Nico Hülkenberg", team: "Stake F1 Team", number: 27, points: 25, podiums: 0, img: "https://media.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png", country: "德國", flag: "🇩🇪", wc: 0, bio: "排位大師。", ig: "hulkhulkenberg", x: "HulkHulkenberg" },
    { name: "Gabriel Bortoleto", team: "Stake F1 Team", number: 5, points: 5, podiums: 0, img: "https://media.formula1.com/content/dam/fom-website/drivers/G/GABBORT01_Gabriel_Bortoleto/gabbort01.png", country: "巴西", flag: "🇧🇷", wc: 0, bio: "巴西新星。", ig: "gabrielbortoleto", x: "G_Bortoleto" }
];

const teams = [
    { name: "McLaren", points: 803, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren-logo.png", color: "#FF8700", bio: "麥拉倫車隊是 F1 歷史上最成功的車隊之一，2025 年展現了強大的競爭力。", url: "https://www.mclaren.com/racing/" },
    { name: "Red Bull Racing", points: 520, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing-logo.png", color: "#3671C6", bio: "紅牛車隊以其激進的策略和頂尖的空氣動力學設計聞名。", url: "https://www.redbullracing.com/" },
    { name: "Ferrari", points: 650, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari-logo.png", color: "#E10600", bio: "法拉利是 F1 的象徵，擁有最龐大的車迷群體 Tifosi。", url: "https://www.ferrari.com/en-EN/formula1" },
    { name: "Mercedes", points: 330, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes-logo.png", color: "#27F4D2", bio: "賓士車隊在混合動力時代統治了多年，目前正致力於重返巔峰。", url: "https://www.mercedesamgf1.com/" },
    { name: "Aston Martin", points: 280, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin-logo.png", color: "#229971", bio: "奧斯頓馬丁車隊近年投入巨大，目標是挑戰領頭羊。", url: "https://www.astonmartinf1.com/" },
    { name: "Williams", points: 240, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/williams-logo.png", color: "#64C4FF", bio: "威廉斯車隊正在經歷復興，展現出老牌強隊的底蘊。", url: "https://www.williamsf1.com/" },
    { name: "Alpine", points: 110, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/alpine-logo.png", color: "#0093CC", bio: "代表法國的 Alpine 車隊，持續在競爭激烈的中游奮戰。", url: "https://www.alpinecars.com/en/racing/" },
    { name: "Haas", points: 100, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/haas-f1-team-logo.png", color: "#B6BABD", bio: "來自美國的哈斯車隊，以高效的運作模式立足 F1。", url: "https://www.haasf1team.com/" },
    { name: "RB", points: 55, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/rb-logo.png", color: "#6692FF", bio: "紅牛二隊，旨在培養未來的冠軍車手。", url: "https://www.visacashapprb.com/" },
    { name: "Stake F1 Team", points: 30, logo: "https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber-logo.png", color: "#52E252", bio: "索伯車隊正處於轉型期，為未來奧迪的加入做準備。", url: "https://www.sauber-group.com/" }
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
    return `
        <tr>
            <td>${rank}</td>
            <td style="font-weight:bold;">${d.name}</td>
            <td>${d.flag} ${d.country}</td>
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

function renderDrivers(filterData = drivers) {
    const container = document.getElementById('driverGridContainer');
    if(!container) return;
    container.innerHTML = filterData.map(d => {
        const isFav = favorites.includes(d.name);
        return `
            <div class="data-card reveal-item" onclick="openModal('${d.name}', 'driver')">
                <button class="fav-btn ${isFav?'active':''}" onclick="toggleFavorite(event, '${d.name}')">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="card-header">
                    <div class="flag-circle">${d.flag}</div>
                    <img src="${d.img}" alt="${d.name}">
                </div>
                <div class="card-content">
                    <h3>${d.name}</h3>
                    <p style="font-size:0.8rem; color:#888; margin-bottom:10px;">${d.team}</p>
                    <div style="display:flex; justify-content:space-around; border-top:1px solid #333; pt:10px;">
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
        podium.innerHTML = `
            <div class="podium-item rank-2 reveal-item">
                <span class="p-rank">2</span>
                <div class="podium-team-logo"><img src="${top3[1].logo}"></div>
                <div class="podium-info">
                    <span class="p-name">${top3[1].name}</span>
                    <span class="p-points"><span class="animate-num" data-val="${top3[1].points}">0</span> PTS</span>
                </div>
            </div>
            <div class="podium-item rank-1 reveal-item" style="cursor:pointer" onclick="celebrateWinner()">
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
        <div class="team-card reveal-item" onclick="openModal('${t.name}', 'team')">
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

    // 渲染分類過濾器
    if (!document.querySelector('.track-filter-container')) {
        const filterHtml = `
            <div class="track-filter-container reveal-item">
                <div class="filter-tag active" onclick="filterTracks('all', this)">全部</div>
                <div class="filter-tag" onclick="filterTracks('傳統', this)">傳統賽道</div>
                <div class="filter-tag" onclick="filterTracks('街道', this)">街道賽</div>
                <div class="filter-tag" onclick="filterTracks('夜戰', this)">夜間賽事</div>
                <div class="filter-tag" onclick="filterTracks('高速', this)">高速賽道</div>
            </div>
        `;
        tabs.parentElement.insertBefore(document.createRange().createContextualFragment(filterHtml), tabs);
    }

    tabs.innerHTML = tracks.map((t, i) => {
        const isVisible = currentTrackFilter === 'all' || t.tags.includes(currentTrackFilter);
        return `
            <button class="track-tab-btn ${i===0?'active':''} ${isVisible?'':'hidden'}" 
                    style="${isVisible?'':'display:none'}"
                    onclick="switchTrack(${i})">${i+1}</button>
        `;
    }).join('');

    contents.innerHTML = tracks.map((t, i) => `
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
                    <div style="margin-top: 30px; padding: 20px; background: rgba(225, 6, 0, 0.05); border-radius: 10px; border-left: 4px solid var(--f1-red);">
                        <small style="color: var(--f1-red); font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Track Insight</small>
                        <p style="margin-top: 5px; font-size: 0.95rem; line-height: 1.5; color: #aaa;">這是 2025 賽季中極具挑戰性的賽道之一，考驗著車手的極限與車隊的策略佈署。</p>
                    </div>
                </div>
                <div class="track-image">
                    <img src="${t.img}" alt="${t.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="track-placeholder" style="display:none;">
                        <i class="fas fa-map-marked-alt fa-4x" style="color: var(--f1-red); margin-bottom: 20px;"></i>
                        <h3 style="color: white; font-style: italic;">CIRCUIT LAYOUT</h3>
                        <p style="color: #666; margin-top: 10px;">${t.name} 賽道圖配置</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    switchTrack(0);
}

function filterTracks(tag, el) {
    currentTrackFilter = tag;
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderTracks();
}

function switchTrack(index) {
    document.querySelectorAll('.track-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.track-panel').forEach(p => p.classList.remove('active'));
    
    const btn = document.querySelectorAll('.track-tab-btn')[index];
    if(btn) btn.classList.add('active');
    
    const panel = document.getElementById(`track-panel-${index}`);
    if(panel) panel.classList.add('active');
    
    const heroImg = document.getElementById('currentTrackHeroImg');
    const heroName = document.getElementById('currentTrackHeroName');
    if(heroImg && heroName) {
        heroImg.src = tracks[index].img;
        heroName.textContent = tracks[index].name;
    }
}

// =========================================
// === 互動功能 (Modal) ===
// =========================================

function openModal(name, type) {
    const modal = document.getElementById('infoModal');
    const social = document.getElementById('modalSocial');
    social.innerHTML = '';

    if (type === 'driver') {
        const d = drivers.find(x => x.name === name);
        if(!d) return;
        document.getElementById('modalImg').src = d.img;
        document.getElementById('modalName').textContent = d.name;
        document.getElementById('modalTeam').textContent = d.team;
        document.getElementById('modalBio').textContent = d.bio;
        document.getElementById('modalStats').innerHTML = `
            <div style="text-align:center; flex:1; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px;"><strong>${d.points}</strong><br><small>積分</small></div>
            <div style="text-align:center; flex:1; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px;"><strong>${d.podiums}</strong><br><small>頒獎台</small></div>
            <div style="text-align:center; flex:1; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px;"><strong>${d.wc}</strong><br><small>世界冠軍</small></div>
        `;
        social.innerHTML = `
            <a href="https://instagram.com/${d.ig}" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://twitter.com/${d.x}" target="_blank"><i class="fab fa-x-twitter"></i></a>
        `;
    } else {
        const t = teams.find(x => x.name === name);
        if(!t) return;
        document.getElementById('modalImg').src = t.logo;
        document.getElementById('modalName').textContent = t.name;
        document.getElementById('modalTeam').textContent = 'Constructor';
        document.getElementById('modalBio').textContent = t.bio;
        document.getElementById('modalStats').innerHTML = `
            <div style="text-align:center; flex:1; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px;"><strong>${t.points}</strong><br><small>積分</small></div>
            <div style="text-align:center; flex:1; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px;"><strong>${teams.indexOf(t)+1}</strong><br><small>排名</small></div>
        `;
        social.innerHTML = `
            <a href="${t.url}" target="_blank" style="font-size: 1rem; background: var(--f1-red); padding: 5px 15px; border-radius: 20px; text-decoration: none; opacity: 1;">
                <i class="fas fa-external-link-alt"></i> 官方網站
            </a>
        `;
    }
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(e) {
    if(e.target.id === 'infoModal' || e.target.className === 'modal-overlay') {
        document.getElementById('infoModal').classList.remove('show');
        document.body.style.overflow = 'auto';
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

// =========================================
// === 裝飾性增強邏輯 ===
// =========================================

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
    const sections = document.querySelectorAll('section, .standings-container, .news-ticker-v2, .home-intro-box, .home-media-layout');
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

// =========================================
// === 搜尋與書籤功能 ===
// =========================================

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

function toggleFavorite(event, name) {
    event.stopPropagation();
    const index = favorites.indexOf(name);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(name);
        celebrateWinner();
    }
    localStorage.setItem('f1_favorites', JSON.stringify(favorites));
    renderDrivers();
    renderFavorites();
}

function renderFavorites() {
    const section = document.getElementById('favoritesSection');
    const favGrid = document.getElementById('favoritesContainer');
    if (!section || !favGrid) return;
    
    if (favorites.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    const favDrivers = drivers.filter(d => favorites.includes(d.name));
    favGrid.innerHTML = favDrivers.map(d => `
        <div class="data-card" onclick="openModal('${d.name}', 'driver')" style="border-top: 4px solid #ffcc00;">
            <button class="fav-btn active" onclick="toggleFavorite(event, '${d.name}')">
                <i class="fas fa-heart"></i>
            </button>
            <div class="card-header" style="height: 120px;">
                <img src="${d.img}" alt="${d.name}">
            </div>
            <div class="card-content" style="padding: 10px;">
                <h4 style="margin:0;">${d.name}</h4>
                <small style="color: #888;">${d.team}</small>
            </div>
        </div>
    `).join('');
}

// =========================================
// === 反應測試遊戲 (修復版) ===
// =========================================
let isGameRunning = false;
let isLightsOut = false;
let startTime = 0;
let gameTimeout;

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
    const container = document.querySelector('.lights-out-game-container');
    
    btn.textContent = '燈滅起跑！(點擊此處反應)';
    btn.onclick = handleGameClick; 
    status.innerHTML = '<i class="fas fa-flag-checkered"></i> 準備起跑...';
    timer.textContent = '0.000 秒';
    document.querySelectorAll('.light').forEach(l => l.classList.remove('on'));
    if(container) container.classList.remove('game-shake');
    
    let count = 0;
    const interval = setInterval(() => {
        if (count < 5) {
            document.getElementById(`light-${count}`).classList.add('on');
            count++;
        } else {
            clearInterval(interval);
            gameTimeout = setTimeout(() => {
                document.querySelectorAll('.light').forEach(l => l.classList.remove('on'));
                isLightsOut = true;
                startTime = performance.now();
                if(container) container.classList.add('game-shake');
                status.innerHTML = '<i class="fas fa-bolt" style="color:#ffcc00"></i> GO GO GO!';
            }, Math.random() * 3000 + 1000);
        }
    }, 800);
}

function handleGameClick() {
    if (!isGameRunning) return;

    if (!isLightsOut) {
        clearTimeout(gameTimeout);
        isGameRunning = false;
        const status = document.getElementById('gameStatus');
        status.innerHTML = '<i class="fas fa-times-circle" style="color:var(--f1-red)"></i> 偷跑失敗！請重新開始';
        const btn = document.getElementById('gameButton');
        btn.textContent = '重新開始';
        btn.onclick = startGameSequence;
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
// === 記憶力大挑戰遊戲 ===
// =========================================
let memoryCards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;

function initMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;
    
    const teamLogos = teams.slice(0, 6).map(t => t.logo);
    const cardValues = [...teamLogos, ...teamLogos];
    cardValues.sort(() => Math.random() - 0.5);
    
    moves = 0;
    matches = 0;
    flippedCards = [];
    document.getElementById('moveCount').textContent = moves;
    document.getElementById('matchCount').textContent = matches;
    
    grid.innerHTML = cardValues.map((logo, index) => `
        <div class="memory-card" data-logo="${logo}" onclick="flipCard(this)">
            <div class="memory-card-back"><i class="fas fa-question"></i></div>
            <div class="memory-card-front"><img src="${logo}"></div>
        </div>
    `).join('');
}

function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
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
