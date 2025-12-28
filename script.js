function enterSite() {
    const hero = document.getElementById('hero');
    hero.classList.add('hero-fade-out');
    
    setTimeout(() => {
        hero.style.display = 'none';
        document.body.classList.remove('site-hidden');
        initApp(); 
        typeWriter();
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('site-hidden');
    initParticles();
    initMouseGlow();
});

// =========================================
// === 完整數據定義 (包含紀錄保持人) ===
// =========================================

const drivers = [
    { name: "Lando Norris", team: "McLaren", number: 4, country: "英國", flag: "🇬🇧", podiums: 18, wc: 1, points: 423, bio: "2025 年世界冠軍。Norris 以其驚人的穩定性和速度，在賽季末逆轉奪冠。他與 Piastri 組成的年輕陣容是 F1 最具活力的組合。", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png" },
    { name: "Oscar Piastri", team: "McLaren", number: 81, country: "澳洲", flag: "🇦🇺", podiums: 16, wc: 0, points: 410, bio: "Piastri 在 2025 賽季表現出色，與 Norris 共同為 McLaren 帶來了巨大的成功。他冷靜的風格和出色的輪胎管理能力令人印象深刻。", img: "https://media.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/2col/image.png" },
    { name: "Max Verstappen", team: "Red Bull Racing", number: 1, country: "荷蘭", flag: "🇳🇱", podiums: 15, wc: 4, points: 421, bio: "四屆世界冠軍。Verstappen 依然是 F1 的標竿，儘管在 2025 年惜敗，但他無疑仍是賽道上最快的車手之一。", img: "https://media.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png" },
    { name: "Yuki Tsunoda", team: "Red Bull Racing", number: 22, country: "日本", flag: "🇯🇵", podiums: 0, wc: 0, points: 19, bio: "Tsunoda 在 2025 年重返 Red Bull Racing，與 Verstappen 搭檔。他以其激進的駕駛風格和速度著稱。", img: "https://media.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/2col/image.png" },
    { name: "George Russell", team: "Mercedes", number: 63, country: "英國", flag: "🇬🇧", podiums: 9, wc: 0, points: 319, bio: "Hamilton 離隊後，Russell 成為 Mercedes 的領軍人物。他穩定的表現和技術反饋是銀箭重返巔峰的關鍵。", img: "https://media.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png" },
    { name: "Kimi Antonelli", team: "Mercedes", number: 12, country: "義大利", flag: "🇮🇹", podiums: 3, wc: 0, points: 150, bio: "備受期待的超級新秀。Antonelli 跳級進入 F1，被視為 Mercedes 的未來。他在賽季中展現了驚人的學習速度。", img: "https://media.formula1.com/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png.transform/2col/image.png" },
    { name: "Charles Leclerc", team: "Ferrari", number: 16, country: "摩納哥", flag: "🇲🇨", podiums: 7, wc: 0, points: 242, bio: "Leclerc 在 2025 年與 Hamilton 搭檔，展現了強大的排位賽速度。他渴望為法拉利贏得世界冠軍。", img: "https://media.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png" },
    { name: "Lewis Hamilton", team: "Ferrari", number: 44, country: "英國", flag: "🇬🇧", podiums: 4, wc: 7, points: 156, bio: "七屆世界冠軍轉投法拉利，這是 F1 歷史上最受矚目的轉會之一。他豐富的經驗將為躍馬帶來巨大價值。", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png" },
    { name: "Alexander Albon", team: "Williams", number: 23, country: "泰國", flag: "🇹🇭", podiums: 0, wc: 0, points: 73, bio: "Williams 的領袖。Albon 憑藉出色的表現，為車隊爭取到了寶貴的積分，是中游集團中最受尊敬的車手之一。", img: "https://media.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/2col/image.png" },
    { name: "Carlos Sainz", team: "Williams", number: 55, country: "西班牙", flag: "🇪🇸", podiums: 2, wc: 0, points: 64, bio: "Sainz 轉投 Williams，尋求新的挑戰。他穩定的表現和技術分析能力將是 Williams 復興的關鍵。", img: "https://media.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png" },
    { name: "Fernando Alonso", team: "Aston Martin", number: 14, country: "西班牙", flag: "🇪🇸", podiums: 0, wc: 2, points: 51, bio: "兩屆世界冠軍，經驗豐富的老將。Alonso 繼續在 Aston Martin 展現他的戰鬥精神和對細節的追求。", img: "https://media.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png" },
    { name: "Lance Stroll", team: "Aston Martin", number: 18, country: "加拿大", flag: "🇨🇦", podiums: 0, wc: 0, points: 22, bio: "Stroll 在 Aston Martin 繼續他的 F1 生涯。他偶爾能展現出驚人的速度，但穩定性仍有待提高。", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/2col/image.png" },
    { name: "Nico Hülkenberg", team: "Kick Sauber", number: 27, country: "德國", flag: "🇩🇪", podiums: 1, wc: 0, points: 51, bio: "Hülkenberg 在 2025 年重返頒獎台，證明了他的速度 and 經驗。他為 Kick Sauber 帶來了寶貴的開發方向。", img: "https://media.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/2col/image.png" },
    { name: "Gabriel Bortoleto", team: "Kick Sauber", number: 5, country: "巴西", flag: "🇧🇷", podiums: 0, wc: 0, points: 0, bio: "巴西新秀，被視為 F1 的未來之星。他在 Kick Sauber 開始他的 F1 旅程。", img: "https://media.formula1.com/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabor01.png.transform/2col/image.png" },
    { name: "Isack Hadjar", team: "Racing Bulls", number: 40, country: "法國", flag: "🇫🇷", podiums: 0, wc: 0, points: 41, bio: "Red Bull 青訓的新星。Hadjar 在 Racing Bulls 展現了潛力，是 F1 賽場上的新面孔。", img: "https://media.formula1.com/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/2col/image.png" },
    { name: "Liam Lawson", team: "Racing Bulls", number: 30, country: "紐西蘭", flag: "🇳🇿", podiums: 0, wc: 0, points: 38, bio: "Lawson 在代班期間表現出色，終於獲得全職席位。他被視為 Red Bull 體系中最有前途的車手之一。", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LIAMLA01_Liam_Lawson/liamla01.png.transform/2col/image.png" },
    { name: "Oliver Bearman", team: "Haas F1 Team", number: 87, country: "英國", flag: "🇬🇧", podiums: 0, wc: 0, points: 38, bio: "Bearman 在 2025 年獲得全職席位，他的速度和潛力被廣泛看好。他將是 Haas 的未來希望。", img: "https://media.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/2col/image.png" },
    { name: "Esteban Ocon", team: "Haas F1 Team", number: 31, country: "法國", flag: "🇫🇷", podiums: 0, wc: 0, points: 33, bio: "Ocon 轉投 Haas，帶來了豐富的經驗和穩定的表現。他是一位強硬的賽道鬥士。", img: "https://media.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/2col/image.png" },
    { name: "Pierre Gasly", team: "Alpine", number: 10, country: "法國", flag: "🇫🇷", podiums: 0, wc: 0, points: 0, bio: "Gasly 繼續在 Alpine 擔任領導角色。他是一位分站冠軍得主，正努力帶領車隊重返中游集團前列。", img: "https://media.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/2col/image.png" },
    { name: "Franco Colapinto", team: "Alpine", number: 6, country: "阿根廷", flag: "🇦🇷", podiums: 0, wc: 0, points: 0, bio: "阿根廷車手，Alpine 青訓體系的一員。他在 2025 年獲得了全職席位。", img: "https://media.formula1.com/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/2col/image.png" },
];

const teams = [
    { name: "Red Bull Racing", base: "Milton Keynes, UK", powerUnit: "Honda RBPT", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png.transform/2col/image.png", achievements: { titles: 7, wins: 120, firstGP: 1997 } },
    { name: "Mercedes-AMG", base: "Brackley, UK", powerUnit: "Mercedes", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes.png.transform/2col/image.png", achievements: { titles: 8, wins: 125, firstGP: 1970 } },
    { name: "Scuderia Ferrari", base: "Maranello, Italy", powerUnit: "Ferrari", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari.png.transform/2col/image.png", achievements: { titles: 16, wins: 244, firstGP: 1950 } },
    { name: "McLaren F1 Team", base: "Woking, UK", powerUnit: "Mercedes", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png.transform/2col/image.png", achievements: { titles: 8, wins: 183, firstGP: 1966 } },
    { name: "Aston Martin", base: "Silverstone, UK", powerUnit: "Mercedes", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png.transform/2col/image.png", achievements: { titles: 0, wins: 0, firstGP: 2021 } },
    { name: "Alpine F1 Team", base: "Enstone, UK", powerUnit: "Renault", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/alpine.png.transform/2col/image.png", achievements: { titles: 2, wins: 21, firstGP: 2021 } },
    { name: "Williams Racing", base: "Grove, UK", powerUnit: "Mercedes", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/williams.png.transform/2col/image.png", achievements: { titles: 9, wins: 114, firstGP: 1977 } },
    { name: "Racing Bulls", base: "Faenza, Italy", powerUnit: "Honda RBPT", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/vcarb.png.transform/2col/image.png", achievements: { titles: 0, wins: 2, firstGP: 2006 } },
    { name: "Kick Sauber", base: "Hinwil, Switzerland", powerUnit: "Ferrari", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber.png.transform/2col/image.png", achievements: { titles: 0, wins: 1, firstGP: 1993 } },
    { name: "Haas F1 Team", base: "Kannapolis, USA", powerUnit: "Ferrari", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/haas.png.transform/2col/image.png", achievements: { titles: 0, wins: 0, firstGP: 2016 } }
];

const TRACKS_DATA = [
    { name: "澳洲", id: "australia", imageURL: "01澳洲.jpg", flag: "🇦🇺", length: "5.303 km", firstGP: 1996, laps: 58, fastestLap: "1:20.260", distance: "307.574 km", about: "賽季開幕戰熱門地點。", holder: "Charles Leclerc", holderYear: 2022, googleMapsLink: "https://maps.app.goo.gl/9y5Q8z5F7G8H2J3K9" },
    { name: "中國", id: "china", imageURL: "02中國.jpg", flag: "🇨🇳", length: "5.451 km", firstGP: 2004, laps: 56, fastestLap: "1:32.238", distance: "305.066 km", about: "獨特的「上」字形賽道。", holder: "Michael Schumacher", holderYear: 2004, googleMapsLink: "https://maps.app.goo.gl/8X7W6V5U4T3S2R1Q0" },
    { name: "日本", id: "japan", imageURL: "03日本.jpg", flag: "🇯🇵", length: "5.807 km", firstGP: 1987, laps: 53, fastestLap: "1:30.983", distance: "307.471 km", about: "唯一的「8」字形立體交叉賽道。", holder: "Lewis Hamilton", holderYear: 2019, googleMapsLink: "https://maps.app.goo.gl/7A6B5C4D3E2F1G0H9" },
    { name: "巴林", id: "bahrain", imageURL: "04巴林.jpg", flag: "🇧🇭", length: "5.412 km", firstGP: 2004, laps: 57, fastestLap: "1:31.447", distance: "308.238 km", about: "沙漠之中的夜賽。", holder: "Pedro de la Rosa", holderYear: 2005, googleMapsLink: "https://maps.app.goo.gl/6K5L4M3N2O1P0Q9R8" },
    { name: "沙烏地阿拉伯", id: "saudi-arabia", imageURL: "05沙烏地阿拉伯.jpg", flag: "🇸🇦", length: "6.174 km", firstGP: 2021, laps: 50, fastestLap: "1:30.734", distance: "308.450 km", about: "世界上最快、最長的街道賽道之一。", holder: "Lewis Hamilton", holderYear: 2021, googleMapsLink: "https://maps.app.goo.gl/5J4I3H2G1F0E9D8C7" },
    { name: "邁阿密", id: "miami", imageURL: "06邁阿密.jpg", flag: "🇺🇸", length: "5.412 km", firstGP: 2022, laps: 57, fastestLap: "1:29.708", distance: "308.326 km", about: "圍繞 Hard Rock 體育場建造。", holder: "Max Verstappen", holderYear: 2023, googleMapsLink: "https://maps.app.goo.gl/4B3A2Z1Y0X9W8V7U6" },
    { name: "艾米利亞-羅馬涅", id: "imola", imageURL: "07伊莫拉.jpg", flag: "🇮🇹", length: "4.909 km", firstGP: 1980, laps: 63, fastestLap: "1:15.484", distance: "309.049 km", about: "經典的逆時針賽道。", holder: "Lewis Hamilton", holderYear: 2020, googleMapsLink: "https://maps.app.goo.gl/3S2R1Q0P9O8N7M6L5" },
    { name: "摩納哥", id: "monaco", imageURL: "08摩納哥.jpg", flag: "🇲🇨", length: "3.337 km", firstGP: 1950, laps: 78, fastestLap: "1:12.909", distance: "260.286 km", about: "F1 皇冠上的明珠。", holder: "Lewis Hamilton", holderYear: 2021, googleMapsLink: "https://maps.app.goo.gl/2T1U0V9W8X7Y6Z5A4" },
    { name: "西班牙", id: "spain", imageURL: "09巴塞隆納.jpg", flag: "🇪🇸", length: "4.657 km", firstGP: 1991, laps: 66, fastestLap: "1:16.330", distance: "307.236 km", about: "傳統的測試場地。", holder: "Max Verstappen", holderYear: 2023, googleMapsLink: "https://maps.app.goo.gl/1Q0P9O8N7M6L5K4J3" },
    { name: "加拿大", id: "canada", imageURL: "10加拿大.jpg", flag: "🇨🇦", length: "4.361 km", firstGP: 1978, laps: 70, fastestLap: "1:13.622", distance: "305.270 km", about: "以「冠軍牆」聞名。", holder: "Valtteri Bottas", holderYear: 2019, googleMapsLink: "https://maps.app.goo.gl/0Z9Y8X7W6V5U4T3S2" },
    { name: "奧地利", id: "austria", imageURL: "11奧地利.jpg", flag: "🇦🇹", length: "4.318 km", firstGP: 1970, laps: 71, fastestLap: "1:05.619", distance: "306.452 km", about: "紅牛環賽道。", holder: "Carlos Sainz", holderYear: 2020, googleMapsLink: "https://maps.app.goo.gl/9V8U7T6S5R4Q3P2O1" },
    { name: "英國", id: "britain", imageURL: "12銀石賽道.jpg", flag: "🇬🇧", length: "5.891 km", firstGP: 1950, laps: 52, fastestLap: "1:27.097", distance: "306.198 km", about: "F1 發源地。", holder: "Max Verstappen", holderYear: 2020, googleMapsLink: "https://maps.app.goo.gl/8T7S6R5Q4P3O2N1M0" },
    { name: "比利時", id: "belgium", imageURL: "13SPA.jpg", flag: "🇧🇪", length: "7.004 km", firstGP: 1950, laps: 44, fastestLap: "1:46.286", distance: "308.052 km", about: "F1 最長的賽道。", holder: "Valtteri Bottas", holderYear: 2018, googleMapsLink: "https://maps.app.goo.gl/7R6Q5P4O3N2M1L0K9" },
    { name: "匈牙利", id: "hungary", imageURL: "14匈牙利.jpg", flag: "🇭🇺", length: "4.381 km", firstGP: 1986, laps: 70, fastestLap: "1:16.627", distance: "306.670 km", about: "被稱為「沒有直道的摩納哥」。", holder: "Lewis Hamilton", holderYear: 2020, googleMapsLink: "https://maps.app.goo.gl/6Q5P4O3N2M1L0K9J8" },
    { name: "荷蘭", id: "netherlands", imageURL: "15荷蘭.jpg", flag: "🇳🇱", length: "4.259 km", firstGP: 1952, laps: 72, fastestLap: "1:11.097", distance: "306.648 km", about: "充滿沙丘地形的賽道。", holder: "Lewis Hamilton", holderYear: 2021, googleMapsLink: "https://maps.app.goo.gl/5P4O3N2M1L0K9J8I7" },
    { name: "義大利", id: "italy", imageURL: "16Monza.jpg", flag: "🇮🇹", length: "5.793 km", firstGP: 1950, laps: 53, fastestLap: "1:21.046", distance: "306.720 km", about: "「速度殿堂」。", holder: "Rubens Barrichello", holderYear: 2004, googleMapsLink: "https://maps.app.goo.gl/4O3N2M1L0K9J8I7H6" },
    { name: "亞塞拜然", id: "azerbaijan", imageURL: "17巴庫城市賽.jpg", flag: "🇦🇿", length: "6.003 km", firstGP: 2016, laps: 51, fastestLap: "1:43.009", distance: "306.049 km", about: "巴庫城市賽道。", holder: "Charles Leclerc", holderYear: 2019, googleMapsLink: "https://maps.app.goo.gl/3N2M1L0K9J8I7H6G5" },
    { name: "新加坡", id: "singapore", imageURL: "18濱海灣街道賽.jpg", flag: "🇸🇬", length: "4.940 km", firstGP: 2008, laps: 62, fastestLap: "1:44.400", distance: "306.584 km", about: "F1 史上第一個夜間大獎賽。", holder: "Lewis Hamilton", holderYear: 2023, googleMapsLink: "https://maps.app.goo.gl/2M1L0K9J8I7H6G5F4" },
    { name: "美國", id: "usa", imageURL: "19美州賽道.jpg", flag: "🇺🇸", length: "5.513 km", firstGP: 2012, laps: 56, fastestLap: "1:36.169", distance: "308.405 km", about: "美洲賽道。", holder: "Charles Leclerc", holderYear: 2019, googleMapsLink: "https://maps.app.goo.gl/1L0K9J8I7H6G5F4E3" },
    { name: "墨西哥", id: "mexico", imageURL: "20墨西哥.jpg", flag: "🇲🇽", length: "4.304 km", firstGP: 1963, laps: 71, fastestLap: "1:17.774", distance: "305.354 km", about: "高海拔賽道。", holder: "Valtteri Bottas", holderYear: 2021, googleMapsLink: "https://maps.app.goo.gl/0K9J8I7H6G5F4E3D2" },
    { name: "巴西", id: "brazil", imageURL: "21巴西.jpg", flag: "🇧🇷", length: "4.309 km", firstGP: 1973, laps: 71, fastestLap: "1:10.540", distance: "305.909 km", about: "逆時針賽道。", holder: "Valtteri Bottas", holderYear: 2018, googleMapsLink: "https://maps.app.goo.gl/9J8I7H6G5F4E3D2C1" },
    { name: "拉斯維加斯", id: "las-vegas", imageURL: "22拉斯維加斯.jpg", flag: "🇺🇸", length: "6.201 km", firstGP: 2023, laps: 50, fastestLap: "1:33.365", distance: "310.050 km", about: "全新的街道夜賽。", holder: "Oscar Piastri", holderYear: 2023, googleMapsLink: "https://maps.app.goo.gl/8I7H6G5F4E3D2C1B0" },
    { name: "卡達", id: "qatar", imageURL: "23卡達.jpg", flag: "🇶🇦", length: "5.380 km", firstGP: 2021, laps: 57, fastestLap: "1:24.319", distance: "306.660 km", about: "羅賽爾國際賽道。", holder: "Max Verstappen", holderYear: 2023, googleMapsLink: "https://maps.app.goo.gl/7H6G5F4E3D2C1B0A9" },
    { name: "阿布達比", id: "abu-dhabi", imageURL: "24阿布達比.jpg", flag: "🇦🇪", length: "5.281 km", firstGP: 2009, laps: 58, fastestLap: "1:26.103", distance: "306.299 km", about: "賽季收官戰。", holder: "Max Verstappen", holderYear: 2021, googleMapsLink: "https://maps.app.goo.gl/6G5F4E3D2C1B0A9Z8" }
];

function getTeamColor(team) {
    const t = team.toLowerCase();
    if (t.includes('red bull')) return '#3671C6';
    if (t.includes('mercedes')) return '#00D2BE';
    if (t.includes('ferrari')) return '#E10600';
    if (t.includes('mclaren')) return '#FF8700';
    if (t.includes('aston')) return '#006F62';
    if (t.includes('alpine')) return '#0090FF';
    if (t.includes('williams')) return '#005AFF';
    if (t.includes('racing bulls')) return '#6692FF';
    if (t.includes('kick sauber')) return '#52E252';
    if (t.includes('haas')) return '#B6BABD';
    return '#FFFFFF';
}

// =========================================
// === DOM 元素與初始化 ===
// =========================================

const driverGridContainer = document.getElementById('driverGridContainer');
const teamGridContainer = document.getElementById('teamGridContainer');
const trackTabsContainer = document.getElementById('trackTabs');
const trackContentsContainer = document.getElementById('trackContents');
const modalOverlay = document.getElementById('infoModal');
const modalContent = document.getElementById('modalContent');
const modalLeft = document.getElementById('modalLeft');
const modalRight = document.getElementById('modalRight');
const burgerMenu = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');
const globalSearch = document.getElementById('globalSearch');

const lightsContainer = document.getElementById('lightsContainer');
const gameStatus = document.getElementById('gameStatus');
const timerDisplay = document.getElementById('timerDisplay');
const gameButton = document.getElementById('gameButton');

// =========================================
// === 單頁應用程式 (SPA) 導覽邏輯 ===
// =========================================

const pages = {
    'home': document.getElementById('home-page'),
    'drivers': document.getElementById('drivers-page'),
    'teams': document.getElementById('teams-page'),
    'tracks': document.getElementById('tracks-page'),
    'game': document.getElementById('game-page'),
};

function navigateTo(pageId) {
    Object.values(pages).forEach(page => {
        if (page) {
            page.classList.remove('active');
            page.style.display = 'none';
        }
    });

    const targetPage = pages[pageId];
    if (targetPage) {
        targetPage.style.display = 'block';
        setTimeout(() => {
            targetPage.classList.add('active');
            initScrollReveal();
        }, 50);
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) link.classList.add('active');
    });

    navLinks.classList.remove('active');

    if (pageId === 'tracks') renderTrackTabs();
    if (pageId === 'drivers') renderDriverCards();
    if (pageId === 'teams') renderTeamCards();
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');
        if (pageId) navigateTo(pageId);
    });
});

burgerMenu.addEventListener('click', () => navLinks.classList.toggle('active'));

// =========================================
// === 搜尋功能 ===
// =========================================

globalSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query === '') {
        renderDriverCards();
        renderTeamCards();
        renderTrackTabs();
        return;
    }

    const filteredDrivers = drivers.filter(d => d.name.toLowerCase().includes(query) || d.team.toLowerCase().includes(query));
    renderDriverCards(filteredDrivers);

    const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(query));
    renderTeamCards(filteredTeams);

    const filteredTracks = TRACKS_DATA.filter(tr => tr.name.toLowerCase().includes(query));
    renderTrackTabs(filteredTracks);
});

// =========================================
// === 渲染函數 ===
// =========================================

function renderDriverCards(data = drivers) {
    if (!driverGridContainer) return;
    driverGridContainer.innerHTML = '';
    if (data.length === 0) {
        driverGridContainer.innerHTML = '<div class="no-results">找不到相關車手。</div>';
        return;
    }
    data.forEach((driver, index) => {
        const card = document.createElement('div');
        card.className = 'data-card reveal';
        card.style.transitionDelay = `${index * 0.05}s`;
        const teamColor = getTeamColor(driver.team);
        card.style.borderTopColor = teamColor;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="flag-circle">${driver.flag}</div>
                <img src="${driver.img}" alt="${driver.name}">
            </div>
            <div class="card-content">
                <h3>#${driver.number} ${driver.name}</h3>
                <p>${driver.team}</p>
                <p>積分: <span class="stat-number" data-target="${driver.points}">0</span></p>
            </div>
        `;
        card.onclick = () => showDriverModal(driver);
        driverGridContainer.appendChild(card);
    });
    initTiltEffect();
    initCounters(driverGridContainer);
}

function renderTeamCards(data = teams) {
    if (!teamGridContainer) return;
    teamGridContainer.innerHTML = '';
    data.forEach((team, index) => {
        const card = document.createElement('div');
        card.className = 'data-card reveal';
        card.style.transitionDelay = `${index * 0.1}s`;
        const teamColor = getTeamColor(team.name);
        card.style.borderTopColor = teamColor;

        card.innerHTML = `
            <div class="card-header" style="background: #111; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <img src="${team.img}" alt="${team.name}" style="object-fit: contain; height: 80px;">
            </div>
            <div class="card-content">
                <h3>${team.name}</h3>
                <p>勝場: <span class="stat-number" data-target="${team.achievements.wins}">0</span></p>
            </div>
        `;
        card.onclick = () => showTeamModal(team);
        teamGridContainer.appendChild(card);
    });
    initTiltEffect();
    initCounters(teamGridContainer);
}

function renderTrackTabs(data = TRACKS_DATA) {
    if (!trackTabsContainer || !trackContentsContainer) return;
    trackTabsContainer.innerHTML = '';
    trackContentsContainer.innerHTML = '';

    data.forEach((track, index) => {
        const button = document.createElement('button');
        button.className = `track-tab-button${index === 0 ? ' active' : ''}`;
        button.textContent = `${track.flag} ${track.name}`;
        button.onclick = () => switchTrackTab(track.id);
        trackTabsContainer.appendChild(button);

        if (index === 0) {
            renderSingleTrack(track);
        }
    });
}

function renderSingleTrack(track) {
    trackContentsContainer.innerHTML = `
        <div class="track-content-item active reveal neon-flow" id="track-content-${track.id}">
            <div class="track-info">
                <h3>${track.flag} ${track.name} 大獎賽</h3>
                <p>${track.about}</p>
                <div class="track-stats">
                    <div class="track-stat-item"><h4>賽道長度</h4><span class="stat-number" data-target="${parseFloat(track.length)}">0</span> km</div>
                    <div class="track-stat-item"><h4>比賽圈數</h4><span class="stat-number" data-target="${track.laps}">0</span> 圈</div>
                    <div class="track-stat-item"><h4>首次舉辦</h4><span class="stat-number" data-target="${track.firstGP}">0</span> 年</div>
                </div>
                
                <!-- 新增紀錄保持人區塊 -->
                <div class="record-holder-card reveal" style="margin-top: 25px; background: rgba(225, 6, 0, 0.1); padding: 20px; border-radius: 15px; border: 1px solid var(--f1-red);">
                    <h4 style="color: var(--f1-red); text-transform: uppercase; font-size: 0.8rem; margin-bottom: 10px;">🏆 賽道歷史最快單圈紀錄保持人</h4>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 1.4rem; font-weight: 900; font-style: italic;">${track.holder}</div>
                            <div style="color: #aaa; font-size: 0.9rem;">紀錄年份：${track.holderYear} 年</div>
                        </div>
                        <div style="font-size: 1.6rem; font-weight: 900; color: var(--f1-red);">${track.fastestLap}</div>
                    </div>
                </div>

                <a href="${track.googleMapsLink}" target="_blank" class="cta-button neon-btn" style="margin-top: 25px; background: #4285F4;">🗺️ Google 地圖</a>
            </div>
            <div class="track-map">
                <img src="${track.imageURL}" alt="${track.name}" class="track-map-image">
            </div>
        </div>
    `;
    initCounters(trackContentsContainer);
}

function switchTrackTab(trackId) {
    const track = TRACKS_DATA.find(t => t.id === trackId);
    if (!track) return;

    document.querySelectorAll('.track-tab-button').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(track.name));
    });

    renderSingleTrack(track);
}

// =========================================
// === 特效與動畫 ===
// =========================================

function initParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('particles-js');
    if (!container) return;
    container.appendChild(canvas);
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();
    class Particle {
        constructor() { this.reset(); }
        reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.vx = (Math.random() - 0.5) * 2; this.vy = (Math.random() - 0.5) * 2; this.size = Math.random() * 2; this.alpha = Math.random(); }
        update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset(); }
        draw() { ctx.fillStyle = `rgba(225, 6, 0, ${this.alpha})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    for (let i = 0; i < 100; i++) particles.push(new Particle());
    function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
    animate();
}

function initMouseGlow() {
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    document.body.appendChild(glow);
    window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

function initCounters(parent = document) {
    const counters = parent.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let current = 0;
        const duration = 1500;
        const step = target / (duration / 16);
        const update = () => {
            current += step;
            if (current < target) {
                counter.innerText = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.innerText = target;
            }
        };
        update();
    });
}

function typeWriter() {
    const title = document.querySelector('.map-title');
    if (!title) return;
    const text = title.textContent; title.textContent = '';
    let i = 0;
    function type() { if (i < text.length) { title.textContent += text.charAt(i); i++; setTimeout(type, 100); } }
    type();
}

function initTiltEffect() {
    document.querySelectorAll('.data-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateX(${-y * 20}deg) rotateY(${x * 20}deg) scale(1.05)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`);
    });
}

function initScrollReveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) el.classList.add('active');
    });
}
window.addEventListener('scroll', initScrollReveal);

// =========================================
// === Modal 邏輯 ===
// =========================================

function closeInfoModal() { modalOverlay.classList.remove('show'); }

function showDriverModal(driver) {
    const teamColor = getTeamColor(driver.team);
    modalLeft.innerHTML = `<img src="${driver.img}" alt="${driver.name}" class="modal-driver-img">`;
    modalRight.innerHTML = `
        <h2 class="modal-driver-name">${driver.name} ${driver.flag}</h2>
        <span class="modal-driver-team" style="background: ${teamColor}">${driver.team}</span>
        <div class="modal-stats">
            <div class="stat-item"><h4>積分</h4><span class="stat-number" data-target="${driver.points}">0</span></div>
            <div class="stat-item"><h4>頒獎台</h4><span class="stat-number" data-target="${driver.podiums}">0</span></div>
            <div class="stat-item"><h4>世界冠軍</h4><span class="stat-number" data-target="${driver.wc}">0</span></div>
        </div>
        <p class="modal-bio">${driver.bio}</p>
    `;
    modalContent.style.borderLeftColor = teamColor;
    modalOverlay.classList.add('show');
    initCounters(modalRight);
}

function showTeamModal(team) {
    const teamColor = getTeamColor(team.name);
    modalLeft.innerHTML = `<img src="${team.img}" alt="${team.name}" style="object-fit: contain; width: 80%; padding: 20px;">`;
    modalRight.innerHTML = `
        <h2 class="modal-driver-name" style="color: ${teamColor}">${team.name}</h2>
        <div class="modal-stats">
            <div class="stat-item"><h4>基地</h4><span>${team.base}</span></div>
            <div class="stat-item"><h4>動力單元</h4><span>${team.powerUnit}</span></div>
            <div class="stat-item"><h4>冠軍</h4><span class="stat-number" data-target="${team.achievements.titles}">0</span></div>
            <div class="stat-item"><h4>勝場</h4><span class="stat-number" data-target="${team.achievements.wins}">0</span></div>
        </div>
    `;
    modalContent.style.borderLeftColor = teamColor;
    modalOverlay.classList.add('show');
    initCounters(modalRight);
}

modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeInfoModal(); });

// =========================================
// === 遊戲邏輯 ===
// =========================================

function renderLights() {
    if (!lightsContainer) return;
    lightsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const light = document.createElement('div');
        light.className = 'light';
        light.id = `light-${i}`;
        lightsContainer.appendChild(light);
    }
}

let isGameRunning = false;
let startTime = 0;
function startGameSequence() {
    if (isGameRunning) return;
    isGameRunning = true;
    gameButton.textContent = '等待燈號...';
    gameStatus.textContent = '紅燈亮起中...';
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
                gameStatus.textContent = 'GO!';
                startTime = performance.now();
                gameButton.textContent = '起跑！';
                gameButton.onclick = stopGame;
            }, Math.random() * 3000 + 1000);
        }
    }, 800);
}

function stopGame() {
    const reactionTime = (performance.now() - startTime) / 1000;
    isGameRunning = false;
    gameStatus.textContent = '反應時間：';
    timerDisplay.textContent = reactionTime.toFixed(3) + ' 秒';
    gameButton.textContent = '再試一次';
    gameButton.onclick = startGameSequence;
}

function initApp() {
    renderDriverCards();
    renderTeamCards();
    renderLights();
    initScrollReveal();
}

document.addEventListener('DOMContentLoaded', initApp);
if (gameButton) gameButton.onclick = startGameSequence;
