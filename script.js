// =========================================
// === 數據定義 (Data Definitions) ===
// =========================================

// 原始數據已優化並移至此處
const drivers = [
    { name: "Max Verstappen", team: "Red Bull Racing", number: 1, country: "荷蘭", podiums: 98, wc: 4, points: "2586.5", bio: "F1 的新一代霸主。Verstappen 以其激進的駕駛風格和無情的速度聞名。做為 Red Bull 體系培養出的最成功車手，他在 2025 年力求衛冕，繼續挑戰歷史紀錄。", img: "https://media.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png" },
    { name: "Sergio Pérez", team: "Red Bull Racing", number: 11, country: "墨西哥", podiums: 35, wc: 0, points: "1489", bio: "被稱為「輪胎管理大師」的 Checo。他是墨西哥的民族英雄，擁有豐富的經驗和在混亂局面中穩定拿分的能力，是 Red Bull 車隊不可或缺的拼圖。", img: "https://media.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png" },
    { name: "Lewis Hamilton", team: "Ferrari", number: 44, country: "英國", podiums: 197, wc: 7, points: "4639.5", bio: "2025 年最震撼的轉會！七屆世界冠軍 Hamilton 穿上了傳奇的法拉利紅袍。作為 F1 歷史上最成功的車手，他尋求在職業生涯晚期帶領躍馬重返榮耀，挑戰第八冠。", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png" },
    { name: "Charles Leclerc", team: "Ferrari", number: 16, country: "摩納哥", podiums: 30, wc: 0, points: "1074", bio: "法拉利的「天選之子」。擁有無與倫比的單圈排位速度。Leclerc 在 2025 年將面臨與傳奇隊友 Hamilton 的內部競爭，這將是他證明自己具備冠軍相的關鍵一年。", img: "https://media.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png" },
    { name: "Lando Norris", team: "McLaren", number: 4, country: "英國", podiums: 13, wc: 0, points: "633", bio: "McLaren 的當家車手，年輕一代中最具天賦的明星之一。Norris 以其幽默的性格和賽道上冷靜的表現深受車迷喜愛，隨著車隊競爭力回升，他正瞄準生涯首座世界冠軍。", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png" },
    { name: "Oscar Piastri", team: "McLaren", number: 81, country: "澳洲", podiums: 2, wc: 0, points: "97", bio: "冷靜得可怕的「冰人二代」。Piastri 在新秀賽季就展現了驚人的成熟度。2025 年，他不再是菜鳥，而是有能力挑戰頒獎台最高位置的強大競爭者。", img: "https://media.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/2col/image.png" },
    { name: "George Russell", team: "Mercedes", number: 63, country: "英國", podiums: 11, wc: 0, points: "469", bio: "隨著 Hamilton 的離去，Russell 正式成為銀箭的一號車手。他精準、穩定的駕駛風格完美契合 Mercedes 的工程哲學，現在是他帶領車隊重返巔峰的時刻。", img: "https://media.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png" },
    { name: "Kimi Antonelli", team: "Mercedes", number: 12, country: "義大利", podiums: 0, wc: 0, points: "0", bio: "備受矚目的超級天才新秀。跳級進入 F1 的 Antonelli 承載著巨大的期望。他的速度在低級別賽事中無人能敵，2025 年全世界都在看他能否適應 F1 的壓力。", img: "https://media.formula1.com/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png.transform/2col/image.png" },
    { name: "Fernando Alonso", team: "Aston Martin", number: 14, country: "西班牙", podiums: 106, wc: 2, points: "2267", bio: "越老越妖的「魔頭」。Alonso 證明了年齡只是一個數字。他擁有賽場上最敏銳的戰術頭腦和起跑反應，繼續駕駛綠色賽車挑戰那些比他年輕 20 歲的對手。", img: "https://media.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png" },
    { name: "Lance Stroll", team: "Aston Martin", number: 18, country: "加拿大", podiums: 3, wc: 0, points: "268", bio: "在世界冠軍隊友身邊，Stroll 持續證明自己的速度。雖然表現偶有起伏，但在濕地和起跑混戰中，他往往能展現出驚人的判斷力。", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/2col/image.png" },
    { name: "Pierre Gasly", team: "Alpine", number: 10, country: "法國", podiums: 4, wc: 0, points: "394", bio: "Alpine 的法國領袖。Gasly 經歷過被下放的低谷並重新證明了自己（Monza 2020 冠軍）。他帶領著這支全法國陣容的車隊，試圖在中游集團突圍。", img: "https://media.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/2col/image.png" },
    { name: "Jack Doohan", team: "Alpine", number: 7, country: "澳洲", podiums: 0, wc: 0, points: "0", bio: "摩托車傳奇之子，Alpine 自家青訓的驕傲。Doohan 在模擬器上的長時間耕耘終於換來了正賽席位，他準備好在 2025 賽季展現他的速度。", img: "https://media.formula1.com/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png.transform/2col/image.png" },
    { name: "Nico Hülkenberg", team: "Kick Sauber", number: 27, country: "德國", podiums: 0, wc: 0, points: "530", bio: "經驗豐富的排位賽專家。Hülkenberg 加盟 Sauber 是為了幫助車隊過渡到 2026 年的 Audi 時代。他的開發反饋對車隊至關重要。", img: "https://media.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/2col/image.png" },
    { name: "Gabriel Bortoleto", team: "Kick Sauber", number: 5, country: "巴西", podiums: 0, wc: 0, points: "0", bio: "巴西賽車的新希望。作為 F3 冠軍，Bortoleto 展現了驚人的穩定性。Sauber 選擇相信這位年輕人的潛力，期待他能帶來森巴軍團的熱情與速度。", img: "https://media.formula1.com/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabor01.png.transform/2col/image.png" },
    { name: "Yuki Tsunoda", team: "VCARB", number: 22, country: "日本", podiums: 0, wc: 0, points: "61", bio: "速度與激情的化身。Tsunoda 的無線電通話總是充滿娛樂性，但他的速度不容小覷。在 VCARB，他已經成長為一名能夠穩定輸出圈速的成熟車手。", img: "https://media.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/2col/image.png" },
    { name: "Liam Lawson", team: "VCARB", number: 30, country: "紐西蘭", podiums: 0, wc: 0, points: "2", bio: "在 2023 年代班期間一鳴驚人。Lawson 終於在 2025 年獲得了全職席位。他冷靜、兇悍的超車風格讓他被視為 Red Bull 未來潛在的一號車手人選。", img: "https://media.formula1.com/content/dam/fom-website/drivers/L/LIAMLA01_Liam_Lawson/liamla01.png.transform/2col/image.png" },
    { name: "Oliver Bearman", team: "Haas", number: 87, country: "英國", podiums: 0, wc: 0, points: "6", bio: "2024 年法拉利代班一戰成名。Bearman 以其在吉達賽道的沈穩表現贏得了 Haas 的席位。他是 Ferrari 體系的未來之星，在 Haas 累積經驗是他的首要任務。", img: "https://media.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/2col/image.png" },
    { name: "Esteban Ocon", team: "Haas", number: 31, country: "法國", podiums: 3, wc: 0, points: "422", bio: "離開 Alpine 後，Ocon 在 Haas 找到了新家。作為一名分站冠軍得主，他帶來了 Haas 迫切需要的經驗和穩定的拿分能力，是一位極其強硬的賽道鬥士。", img: "https://media.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/2col/image.png" },
    { name: "Alexander Albon", team: "Williams", number: 23, country: "泰國", podiums: 2, wc: 0, points: "228", bio: "Williams 的復興基石。Albon 憑藉驚人的保胎能力和排位賽表現，單槍匹馬將車隊拉回中游競爭行列。他是當今 F1 評價最高的車手之一。", img: "https://media.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/2col/image.png" },
    { name: "Carlos Sainz", team: "Williams", number: 55, country: "西班牙", podiums: 18, wc: 0, points: "982.5", bio: "「平滑操作員」Sainz。離開 Ferrari 後，他選擇了帶領 Williams 重返榮耀。以工程思維和戰術智慧聞名的他，將是 Williams 邁向新時代的關鍵領袖。", img: "https://media.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png" }
];

const teams = [
    { name: "Red Bull Racing", base: "Milton Keynes, UK", powerUnit: "Honda RBPT", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png.transform/2col/image.png" },
    { name: "Mercedes-AMG", base: "Brackley, UK", powerUnit: "Mercedes", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes.png.transform/2col/image.png" },
    { name: "Scuderia Ferrari", base: "Maranello, Italy", powerUnit: "Ferrari", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari.png.transform/2col/image.png" },
    { name: "McLaren F1 Team", base: "Woking, UK", powerUnit: "Mercedes", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png.transform/2col/image.png" },
    { name: "Aston Martin", base: "Silverstone, UK", powerUnit: "Mercedes", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png.transform/2col/image.png" },
    { name: "Alpine F1 Team", base: "Enstone, UK", powerUnit: "Renault", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/alpine.png.transform/2col/image.png" },
    { name: "Williams Racing", base: "Grove, UK", powerUnit: "Mercedes", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/williams.png.transform/2col/image.png" },
    { name: "VCARB Team", base: "Faenza, Italy", powerUnit: "Honda RBPT", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/vcarb.png.transform/2col/image.png" },
    { name: "Kick Sauber", base: "Hinwil, Switzerland", powerUnit: "Ferrari", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber.png.transform/2col/image.png" },
    { name: "Haas F1 Team", base: "Kannapolis, USA", powerUnit: "Ferrari", img: "https://media.formula1.com/content/dam/fom-website/teams/2024/haas.png.transform/2col/image.png" }
];

// 擴充後的 24 條賽道數據
const TRACKS_DATA = [
    { name: "澳洲", id: "australia", mapPos: { top: 78, left: 88 }, imageURL: "01澳洲.jpg", flag: "🇦🇺", length: "5.303 km", firstGP: 1996, laps: 58, fastestLap: "1:20.260", distance: "307.574 km", about: "賽季開幕戰熱門地點，混合了街道與公園賽道特性，Albert Park 總是充滿戲劇性。" },
    { name: "中國", id: "china", mapPos: { top: 40, left: 80 }, imageURL: "02中國.jpg", flag: "🇨🇳", length: "5.451 km", firstGP: 2004, laps: 56, fastestLap: "1:32.238", distance: "305.066 km", about: "獨特的「上」字形賽道，長直道和高速彎的組合，對輪胎管理和空氣動力學要求極高。" },
    { name: "日本", id: "japan", mapPos: { top: 40, left: 86 }, imageURL: "03日本.jpg", flag: "🇯🇵", length: "5.807 km", firstGP: 1987, laps: 53, fastestLap: "1:30.983", distance: "307.471 km", about: "唯一的「8」字形立體交叉賽道，S 型彎道對車手的節奏感要求極高，深受車手喜愛。" },
    { name: "巴林", id: "bahrain", mapPos: { top: 48, left: 58 }, imageURL: "04巴林.jpg", flag: "🇧🇭", length: "5.412 km", firstGP: 2004, laps: 57, fastestLap: "1:31.447", distance: "308.238 km", about: "沙漠之中的夜賽，多條直道與髮夾彎，對後輪牽引力和煞車穩定性考驗巨大。" },
    { name: "沙烏地阿拉伯", id: "saudi-arabia", mapPos: { top: 50, left: 60 }, imageURL: "05沙烏地阿拉伯.jpg", flag: "🇸🇦", length: "6.174 km", firstGP: 2021, laps: 50, fastestLap: "1:30.734", distance: "308.450 km", about: "世界上最快、最長的街道賽道之一，擁有大量高速盲彎，對車手膽識是極大挑戰。" },
    { name: "邁阿密", id: "miami", mapPos: { top: 40, left: 20 }, imageURL: "06邁阿密.jpg", flag: "🇺🇸", length: "5.412 km", firstGP: 2022, laps: 57, fastestLap: "1:29.708", distance: "308.326 km", about: "圍繞 Hard Rock 體育場建造的半永久性賽道，充滿了美國式的娛樂氛圍和高速彎道。" },
    { name: "艾米利亞-羅馬涅", id: "imola", mapPos: { top: 30, left: 48 }, imageURL: "07伊莫拉.jpg", flag: "🇮🇹", length: "4.909 km", firstGP: 1980, laps: 63, fastestLap: "1:15.484", distance: "309.049 km", about: "經典的逆時針賽道，狹窄且充滿挑戰性的彎道，考驗車手的精準度。" },
    { name: "摩納哥", id: "monaco", mapPos: { top: 32, left: 47 }, imageURL: "08摩納哥.jpg", flag: "🇲🇨", length: "3.337 km", firstGP: 1950, laps: 78, fastestLap: "1:12.909", distance: "260.286 km", about: "F1 皇冠上的明珠。狹窄、蜿蜒，毫無犯錯空間。排位賽即決戰。" },
    { name: "西班牙", id: "spain", mapPos: { top: 35, left: 45 }, imageURL: "09巴塞隆納.jpg", flag: "🇪🇸", length: "4.657 km", firstGP: 1991, laps: 66, fastestLap: "1:16.330", distance: "307.236 km", about: "傳統的測試場地，擁有高速彎和技術性路段，是衡量賽車性能的絕佳標準。" },
    { name: "加拿大", id: "canada", mapPos: { top: 30, left: 25 }, imageURL: "10加拿大.jpg", flag: "🇨🇦", length: "4.361 km", firstGP: 1978, laps: 70, fastestLap: "1:13.622", distance: "305.270 km", about: "位於聖羅倫斯河中的人工島上，以「冠軍牆」聞名，是一條需要精準煞車的半街道賽道。" },
    { name: "奧地利", id: "austria", mapPos: { top: 30, left: 50 }, imageURL: "11奧地利.jpg", flag: "🇦🇹", length: "4.318 km", firstGP: 1970, laps: 71, fastestLap: "1:05.619", distance: "306.452 km", about: "紅牛環賽道，短小精悍，擁有巨大的海拔落差和高速直道，超車機會多。" },
    { name: "英國", id: "britain", mapPos: { top: 25, left: 44 }, imageURL: "12銀石賽道.jpg", flag: "🇬🇧", length: "5.891 km", firstGP: 1950, laps: 52, fastestLap: "1:27.097", distance: "306.198 km", about: "F1 發源地。Maggots 和 Becketts 高速組合彎展示了 F1 賽車驚人的過彎 G 力。" },
    { name: "比利時", id: "belgium", mapPos: { top: 28, left: 46 }, imageURL: "13SPA.jpg", flag: "🇧🇪", length: "7.004 km", firstGP: 1950, laps: 44, fastestLap: "1:46.286", distance: "308.052 km", about: "F1 最長的賽道，以 Eau Rouge 和 Raidillon 的高速爬坡彎道聞名，天氣變化莫測。" },
    { name: "匈牙利", id: "hungary", mapPos: { top: 30, left: 52 }, imageURL: "14匈牙利.jpg", flag: "🇭🇺", length: "4.381 km", firstGP: 1986, laps: 70, fastestLap: "1:16.627", distance: "306.670 km", about: "被稱為「沒有直道的摩納哥」，賽道狹窄多彎，超車極為困難，考驗車手體能。" },
    { name: "荷蘭", id: "netherlands", mapPos: { top: 25, left: 46 }, imageURL: "15荷蘭.jpg", flag: "🇳🇱", length: "4.259 km", firstGP: 1952, laps: 72, fastestLap: "1:11.097", distance: "306.648 km", about: "充滿沙丘地形的賽道，擁有獨特的傾斜彎角，為超車帶來更多可能性。" },
    { name: "義大利", id: "italy", mapPos: { top: 32, left: 49 }, imageURL: "16Monza.jpg", flag: "🇮🇹", length: "5.793 km", firstGP: 1950, laps: 53, fastestLap: "1:21.046", distance: "306.720 km", about: "「速度殿堂」，F1 賽季中最快的賽道，以極低阻力設定和高速直道聞名。" },
    { name: "亞塞拜然", id: "azerbaijan", mapPos: { top: 40, left: 55 }, imageURL: "17巴庫城市賽.jpg", flag: "🇦🇿", length: "6.003 km", firstGP: 2016, laps: 51, fastestLap: "1:43.009", distance: "306.049 km", about: "巴庫城市賽道，擁有 F1 最長的直道和狹窄的舊城區路段，經常出現混亂的比賽。" },
    { name: "新加坡", id: "singapore", mapPos: { top: 60, left: 75 }, imageURL: "18濱海灣街道賽.jpg", flag: "🇸🇬", length: "4.940 km", firstGP: 2008, laps: 62, fastestLap: "1:44.400", distance: "306.584 km", about: "F1 史上第一個夜間大獎賽，高溫高濕，對車手體能是極限考驗。" },
    { name: "美國", id: "usa", mapPos: { top: 45, left: 20 }, imageURL: "19美州賽道.jpg", flag: "🇺🇸", length: "5.513 km", firstGP: 2012, laps: 56, fastestLap: "1:36.169", distance: "308.405 km", about: "美洲賽道，以其巨大的爬坡起點和模仿歐洲經典賽道的彎角設計而聞名。" },
    { name: "墨西哥", id: "mexico", mapPos: { top: 50, left: 25 }, imageURL: "20墨西哥.jpg", flag: "🇲🇽", length: "4.304 km", firstGP: 1963, laps: 71, fastestLap: "1:17.774", distance: "305.354 km", about: "高海拔賽道，稀薄的空氣對引擎和空氣動力學都是巨大挑戰，最後穿過體育場的設計是亮點。" },
    { name: "巴西", id: "brazil", mapPos: { top: 75, left: 32 }, imageURL: "21巴西.jpg", flag: "🇧🇷", length: "4.309 km", firstGP: 1973, laps: 71, fastestLap: "1:10.540", distance: "305.909 km", about: "逆時針賽道，高海拔起伏。Senna S 彎和最後爬坡衝線段落總是帶來經典超車。" },
    { name: "拉斯維加斯", id: "las-vegas", mapPos: { top: 40, left: 15 }, imageURL: "22拉斯維加斯.jpg", flag: "🇺🇸", length: "6.201 km", firstGP: 2023, laps: 50, fastestLap: "1:33.365", distance: "310.050 km", about: "全新的街道夜賽，賽道穿過著名的拉斯維加斯大道，以超長直道和高速著稱。" },
    { name: "卡達", id: "qatar", mapPos: { top: 50, left: 60 }, imageURL: "23卡達.jpg", flag: "🇶🇦", length: "5.380 km", firstGP: 2021, laps: 57, fastestLap: "1:24.319", distance: "306.660 km", about: "羅賽爾國際賽道，擁有大量中高速彎角，對輪胎和頸部肌肉是極大考驗。" },
    { name: "阿布達比", id: "abu-dhabi", mapPos: { top: 52, left: 62 }, imageURL: "24阿布達比.jpg", flag: "🇦🇪", length: "5.281 km", firstGP: 2009, laps: 58, fastestLap: "1:26.103", distance: "306.299 km", about: "賽季收官戰。黃昏起跑，夜間完賽。場邊豪華遊艇與飯店構成了獨特景觀。" }
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
    if (t.includes('vcarb')) return '#6692FF';
    if (t.includes('sauber')) return '#52E252';
    if (t.includes('haas')) return '#B6BABD';
    return '#FFFFFF'; // 預設顏色
}

// =========================================
// === DOM 元素與初始化 (DOM Elements & Init) ===
// =========================================

const driverGridContainer = document.getElementById('driverGridContainer'); // 新增車手網格容器
const teamGridContainer = document.getElementById('teamGridContainer');
const mapContainer = document.getElementById('mapContainer');
const trackTabsContainer = document.getElementById('trackTabs');
const trackContentsContainer = document.getElementById('trackContents');
const modalOverlay = document.getElementById('infoModal'); // 統一的 Modal
const modalContent = document.getElementById('modalContent');
const modalLeft = document.getElementById('modalLeft');
const modalRight = document.getElementById('modalRight');
const mainHeader = document.getElementById('mainHeader');
const navLinks = document.getElementById('navLinks');
const burgerMenu = document.getElementById('burgerMenu');

// 遊戲相關 DOM
const lightsContainer = document.getElementById('lightsContainer');
const gameStatus = document.getElementById('gameStatus');
const timerDisplay = document.getElementById('timerDisplay');
const gameButton = document.getElementById('gameButton');
const nameModal = document.getElementById('nameModal');
const finalTimeDisplay = document.getElementById('finalTimeDisplay');
const playerNameInput = document.getElementById('playerName');
const submitScoreButton = document.getElementById('submitScoreButton');
const reactionLeaderboard = document.getElementById('reactionLeaderboard');

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
    // 隱藏所有頁面
    Object.values(pages).forEach(page => {
        if (page) page.classList.remove('active');
    });

    // 顯示目標頁面
    const targetPage = pages[pageId];
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 更新導覽列 active 狀態
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });

    // 關閉手機版選單
    navLinks.classList.remove('active');

    // 確保每次切換到 Tracks 頁面時重新渲染 Tab
    if (pageId === 'tracks') {
        renderTrackTabs();
    }
}

// 導覽列點擊事件
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');
        if (pageId) {
            navigateTo(pageId);
        }
    });
});

// 漢堡選單切換
burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 初始載入時導航到 'home'
document.addEventListener('DOMContentLoaded', () => {
    const initialPage = window.location.hash.substring(1) || 'home';
    navigateTo(initialPage);
});


// =========================================
// === 渲染函數 (Rendering Functions) ===
// =========================================

// 1. 渲染車手卡片 (改為網格佈局)
function renderDriverCards() {
    driverGridContainer.innerHTML = '';
    drivers.forEach(driver => {
        const teamColor = getTeamColor(driver.team);
        const card = document.createElement('div');
        card.className = 'data-card'; // 移除 driver-card-slide
        card.style.borderTopColor = teamColor;
        card.setAttribute('data-driver-name', driver.name);
        card.onclick = () => showDriverModal(driver); // 點擊顯示 Modal

        card.innerHTML = `
            <div class="card-header">
                <span class="card-tag" style="background-color: ${teamColor};">${driver.team}</span>
                <img src="${driver.img || 'https://via.placeholder.com/320x220?text=Driver+Image'}" alt="${driver.name}">
            </div>
            <div class="card-content">
                <h3 style="color: ${teamColor};">${driver.name}</h3>
                <p>車號: #${driver.number} | 國籍: ${driver.country}</p>
                <p>世界冠軍: ${driver.wc} 次</p>
            </div>
        `;
        driverGridContainer.appendChild(card);
    });
}

// 2. 渲染車隊卡片 (點擊改為 Modal)
function renderTeamCards() {
    teamGridContainer.innerHTML = '';
    teams.forEach(team => {
        const teamColor = getTeamColor(team.name);
        const card = document.createElement('div');
        card.className = 'data-card';
        card.style.borderTopColor = teamColor;
        card.onclick = () => showTeamModal(team); // 點擊顯示 Team Modal

        card.innerHTML = `
            <div class="card-header">
                <span class="card-tag" style="background-color: ${teamColor};">${team.powerUnit}</span>
                <img src="${team.img || 'https://via.placeholder.com/320x220?text=Team+Image'}" alt="${team.name}" style="object-fit: contain; background-color: #000; height: 150px;">
            </div>
            <div class="card-content">
                <h3 style="color: ${teamColor};">${team.name}</h3>
                <p>基地: ${team.base}</p>
            </div>
        `;
        teamGridContainer.appendChild(card);
    });
}

// 3. 渲染賽道熱點 (用於首頁地圖)
function renderTrackHotspots() {
    mapContainer.innerHTML = '';
    TRACKS_DATA.forEach(track => {
        const hotspot = document.createElement('div');
        hotspot.className = 'track-hotspot';
        hotspot.style.top = `${track.mapPos.top}%`;
        hotspot.style.left = `${track.mapPos.left}%`;
        hotspot.setAttribute('data-track-id', track.id);
        hotspot.onclick = () => {
            navigateTo('tracks');
            // TODO: 點擊熱點後切換到對應的賽道 Tab
        };

        hotspot.innerHTML = `<span class="hotspot-label">${track.flag} ${track.name}</span>`;
        mapContainer.appendChild(hotspot);
    });
}

// 4. 渲染賽道 Tab (用於賽道頁面)
function renderTrackTabs() {
    trackTabsContainer.innerHTML = '';
    trackContentsContainer.innerHTML = '';

    TRACKS_DATA.forEach((track, index) => {
        // Tab Button
        const button = document.createElement('button');
        button.className = `track-tab-button${index === 0 ? ' active' : ''}`;
        button.textContent = `${track.flag} ${track.name}`;
        button.setAttribute('data-track-id', track.id);
        button.onclick = () => switchTrackTab(track.id);
        trackTabsContainer.appendChild(button);

        // Tab Content
        const content = document.createElement('div');
        content.className = `track-content-item${index === 0 ? ' active' : ''}`;
        content.id = `track-content-${track.id}`;
        
        content.innerHTML = `
            <div class="track-info">
                <h3>${track.flag} ${track.name} 大獎賽</h3>
                <p>${track.about}</p>
                <div class="track-stats">
                    <div class="track-stat-item"><h4>賽道長度</h4><span>${track.length}</span></div>
                    <div class="track-stat-item"><h4>比賽圈數</h4><span>${track.laps} 圈</span></div>
                    <div class="track-stat-item"><h4>比賽距離</h4><span>${track.distance}</span></div>
                    <div class="track-stat-item"><h4>首次舉辦</h4><span>${track.firstGP}</span></div>
                    <div class="track-stat-item"><h4>最快單圈</h4><span>${track.fastestLap}</span></div>
                </div>
            </div>
            <div class="track-map">
                <img src="${track.imageURL}" alt="${track.name} 賽道圖" class="track-map-image">
            </div>
        `;
        trackContentsContainer.appendChild(content);
    });

    // 確保在渲染完成後，如果頁面是 tracks，則切換到第一個 tab
    if (TRACKS_DATA.length > 0) {
        switchTrackTab(TRACKS_DATA[0].id);
    }
}

function switchTrackTab(trackId) {
    // 切換按鈕 active 狀態
    document.querySelectorAll('.track-tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-track-id') === trackId) {
            btn.classList.add('active');
        }
    });

    // 切換內容 active 狀態
    document.querySelectorAll('.track-content-item').forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = document.getElementById(`track-content-${trackId}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// =========================================
// === 互動邏輯 (Interaction Logic) ===
// =========================================

// 1. 滾動導覽列效果
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        mainHeader.classList.add('scrolled-header');
    } else {
        mainHeader.classList.remove('scrolled-header');
    }
});

// 2. 統一的彈跳視窗邏輯
function closeInfoModal() {
    modalOverlay.classList.remove('show');
}

// 顯示車手 Modal
function showDriverModal(driver) {
    const teamColor = getTeamColor(driver.team);

    // 左側圖片
    modalLeft.innerHTML = `
        <img src="${driver.img || 'https://via.placeholder.com/320x220?text=Driver+Image'}" alt="${driver.name}" class="modal-driver-img">
    `;

    // 右側內容
    modalRight.innerHTML = `
        <span class="modal-driver-number">${driver.number}</span>
        <h2 class="modal-driver-name">${driver.name}</h2>
        <span class="modal-driver-team" style="background-color: ${teamColor};">${driver.team}</span>
        
        <div class="modal-stats">
            <div class="stat-item"><h4>國籍</h4><span>${driver.country}</span></div>
            <div class="stat-item"><h4>頒獎台</h4><span>${driver.podiums}</span></div>
            <div class="stat-item"><h4>世界冠軍</h4><span>${driver.wc}</span></div>
            <div class="stat-item"><h4>生涯積分</h4><span>${driver.points}</span></div>
        </div>

        <div class="modal-bio">
            <p>${driver.bio}</p>
        </div>
    `;

    // 更新 Modal 樣式
    modalContent.style.borderLeftColor = teamColor;

    // 顯示 Modal
    modalOverlay.classList.add('show');
}

// 顯示車隊 Modal
function showTeamModal(team) {
    const teamColor = getTeamColor(team.name);

    // 左側圖片 (使用 Logo)
    modalLeft.innerHTML = `
        <img src="${team.img || 'https://via.placeholder.com/320x220?text=Team+Logo'}" alt="${team.name} Logo" class="modal-team-logo" style="object-fit: contain; padding: 20px;">
    `;

    // 右側內容
    modalRight.innerHTML = `
        <h2 class="modal-driver-name" style="color: ${teamColor};">${team.name}</h2>
        <span class="modal-driver-team" style="background-color: ${teamColor};">${team.powerUnit} 動力單元</span>
        
        <div class="modal-stats">
            <div class="stat-item"><h4>基地</h4><span>${team.base}</span></div>
            <div class="stat-item"><h4>車手 1</h4><span>${drivers.find(d => d.team === team.name)?.name || '待定'}</span></div>
            <div class="stat-item"><h4>車手 2</h4><span>${drivers.filter(d => d.team === team.name)[1]?.name || '待定'}</span></div>
            <div class="stat-item"><h4>冠軍次數</h4><span>未知</span></div>
        </div>

        <div class="modal-bio">
            <p>車隊簡介：${team.name} 是一支以 ${team.base} 為基地的 F1 車隊，使用 ${team.powerUnit} 動力單元。點擊卡片可查看更多資訊。</p>
        </div>
    `;

    // 更新 Modal 樣式
    modalContent.style.borderLeftColor = teamColor;

    // 顯示 Modal
    modalOverlay.classList.add('show');
}

// 點擊 Modal 外部關閉
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeInfoModal();
    }
});


// =========================================
// === 燈滅起跑小遊戲邏輯 (Lights Out Game) ===
// =========================================

let lightsOutTimer;
let startTime = 0;
let isGameRunning = false;
let lightCount = 5;
let currentLight = 0;
let lightInterval;

function renderLights() {
    lightsContainer.innerHTML = '';
    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = 'light';
        light.id = `light-${i}`;
        lightsContainer.appendChild(light);
    }
}

function updateTimerDisplay(time) {
    timerDisplay.textContent = `${time.toFixed(3)} 秒`;
}

function saveScore(name, time) {
    const scores = JSON.parse(localStorage.getItem('reactionScores') || '[]');
    scores.push({ name, time });
    scores.sort((a, b) => a.time - b.time); // 升序排列 (越快越好)
    localStorage.setItem('reactionScores', JSON.stringify(scores.slice(0, 10))); // 只保留前 10 名
    renderLeaderboard();
}

function renderLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('reactionScores') || '[]');
    reactionLeaderboard.innerHTML = '';
    if (scores.length === 0) {
        reactionLeaderboard.innerHTML = '<li>目前沒有成績。</li>';
        return;
    }

    scores.forEach((score, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="pos">${index + 1}.</span>
            <span class="name">${score.name}</span>
            <span class="time">${score.time.toFixed(3)} s</span>
        `;
        reactionLeaderboard.appendChild(listItem);
    });
}

function startGameSequence() {
    if (isGameRunning) return;
    isGameRunning = true;
    gameButton.disabled = true;
    gameButton.textContent = '等待燈號...';
    gameStatus.textContent = '紅燈亮起中...';
    currentLight = 0;
    updateTimerDisplay(0);
    
    // 確保所有燈號都關閉
    document.querySelectorAll('.light').forEach(light => light.classList.remove('on'));

    // 依序亮燈
    lightInterval = setInterval(() => {
        if (currentLight < lightCount) {
            document.getElementById(`light-${currentLight}`).classList.add('on');
            currentLight++;
        } else {
            // 隨機延遲 2-5 秒後燈滅
            clearInterval(lightInterval);
            const delay = Math.random() * 3000 + 2000; // 2000ms - 5000ms
            
            setTimeout(lightsOut, delay);
        }
    }, 900); // 每 0.9 秒亮一盞燈
}

function lightsOut() {
    // 燈滅
    document.querySelectorAll('.light').forEach(light => light.classList.remove('on'));
    gameStatus.textContent = 'GO! GO! GO!';
    
    // 開始計時
    startTime = performance.now();
    
    // 重新啟用按鈕，並綁定停止計時的事件
    gameButton.disabled = false;
    gameButton.textContent = '起跑！';
    gameButton.onclick = stopGame;
}

function stopGame() {
    if (!isGameRunning) return;
    
    const endTime = performance.now();
    const reactionTime = (endTime - startTime) / 1000; // 轉換為秒

    // 停止計時
    isGameRunning = false;
    gameButton.disabled = true;
    gameButton.textContent = '遊戲結束';
    gameStatus.textContent = '🏁 您的反應時間：';
    updateTimerDisplay(reactionTime);

    // 彈出輸入名字的 Modal
    finalTimeDisplay.textContent = reactionTime.toFixed(3) + ' 秒';
    nameModal.classList.add('show');
    
    // 重設按鈕為開始遊戲
    gameButton.onclick = startGameSequence;
    gameButton.textContent = '準備';
    gameButton.disabled = false;
}

// 處理玩家在燈滅前按下的情況 (搶跑)
gameButton.addEventListener('click', () => {
    if (isGameRunning && gameButton.textContent === '等待燈號...') {
        // 搶跑
        clearInterval(lightInterval);
        isGameRunning = false;
        gameStatus.textContent = '❌ 搶跑！(在燈滅前起跑)';
        updateTimerDisplay(0);
        gameButton.textContent = '準備';
        gameButton.disabled = false;
        gameButton.onclick = startGameSequence;
        
        // 關閉所有燈
        document.querySelectorAll('.light').forEach(light => light.classList.remove('on'));
    }
});

// 提交成績邏輯
submitScoreButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim() || '匿名車手';
    const timeText = finalTimeDisplay.textContent;
    const time = parseFloat(timeText.replace(' 秒', ''));
    
    if (time > 0) {
        saveScore(name, time);
    }
    
    // 關閉 Modal 並重置輸入框
    nameModal.classList.remove('show');
    playerNameInput.value = '';
});

// 點擊 Modal 外部關閉 (遊戲結果)
nameModal.addEventListener('click', (e) => {
    if (e.target === nameModal) {
        nameModal.classList.remove('show');
    }
});


// =========================================
// === 應用程式啟動 (App Initialization) ===
// =========================================

function initApp() {
    renderDriverCards();
    renderTeamCards();
    renderTrackHotspots();
    renderLights(); // 初始化燈號
    renderLeaderboard(); // 初始化排行榜
}

// 確保 DOM 載入後執行
document.addEventListener('DOMContentLoaded', initApp);

// 初始按鈕事件綁定
gameButton.onclick = startGameSequence;
