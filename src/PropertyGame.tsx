import { useState, useMemo, useEffect } from "react";
import { RotateCcw } from "lucide-react";

// ── Property Catalog ──────────────────────────────────────────────────────────
// Each entry: six [purchasePrice, annualCashflow] pairs.
// Option 1 (index 0) is always the full market value.

const PROPERTY_CATALOG: Record<number, [number, number][]> = {
  1:  [[1589900,-10140],[1583540,-9715],[1558102,-8561],[1526304,-7138],[1494506,-5715],[1470157,-4646]],
  2:  [[655000,-104],[652380,76],[641900,371],[628800,721],[615700,1071],[605375,1343]],
  3:  [[609575,-520],[607140,-411],[597384,-145],[585192,163],[573001,472],[563802,716]],
  4:  [[1075000,-16561],[1070700,-16274],[1053500,-15481],[1032000,-14476],[1010500,-13472],[993875,-12698]],
  5:  [[1193000,-11024],[1188228,-10698],[1169140,-9694],[1145280,-8271],[1121420,-6847],[1103505,-5778]],
  6:  [[949000,-4824],[945204,-4570],[930020,-3723],[911040,-2682],[892060,-1641],[878075,-849]],
  7:  [[1160000,-12604],[1155360,-12287],[1136800,-11304],[1113600,-9871],[1090400,-8438],[1073000,-7354]],
  8:  [[893093,-5715],[889510,-5475],[875231,-4764],[857369,-3799],[839507,-2834],[825551,-2087]],
  9:  [[975000,-1404],[971100,-1141],[955500,-294],[936000,711],[916500,1716],[901875,2490]],
  10: [[659000,-6876],[656364,-6700],[645820,-6206],[632640,-5500],[619460,-4793],[609075,-4250]],
  11: [[959000,-6876],[955176,-6612],[939880,-5701],[920640,-4557],[901400,-3413],[887208,-2538]],
  12: [[800000,-4304],[796800,-4094],[784000,-3334],[768000,-2324],[752000,-1314],[740000,-549]],
  13: [[985000,-5583],[981060,-5316],[965300,-4405],[945600,-3261],[925900,-2117],[910825,-1242]],
  14: [[780000,-6066],[776880,-5849],[764400,-5170],[748800,-4124],[733200,-3077],[721500,-2238]],
  15: [[530000,208],[527880,350],[519400,760],[508800,1170],[498200,1580],[490225,1894]],
  16: [[1245000,-5858],[1239980,-5518],[1220100,-4374],[1195200,-2951],[1170300,-1527],[1150650,-459]],
  17: [[769800,-7633],[766721,-7422],[754404,-6739],[739008,-5798],[723612,-4857],[711815,-4146]],
  18: [[649000,-5980],[646404,-5800],[635902,-5286],[622094,-4482],[608286,-3677],[597833,-3059]],
  19: [[695000,-2912],[692220,-2683],[681100,-2019],[667200,-1196],[653300,-373],[642875,266]],
  20: [[775000,312],[771900,522],[759500,1193],[744000,2049],[728500,2906],[717125,3576]],
  21: [[839900,-7655],[836540,-7429],[823122,-6734],[806304,-5712],[789486,-4690],[776707,-3897]],
  22: [[780000,-8892],[776880,-8675],[764400,-7996],[748800,-6950],[733200,-5903],[721500,-5064]],
  23: [[560000,-6989],[557776,-6840],[548880,-6375],[537600,-5699],[526320,-5022],[517800,-4495]],
  24: [[670000,-8705],[667320,-8527],[656600,-7975],[643200,-7171],[629800,-6367],[619550,-5739]],
  25: [[695000,-4992],[692220,-4763],[681100,-4099],[667200,-3276],[653300,-2453],[642875,-1814]],
  26: [[765000,-8995],[761940,-8790],[749700,-8169],[734400,-7219],[719100,-6268],[707625,-5520]],
  27: [[849000,-9900],[845604,-9673],[832020,-8981],[815040,-7960],[798060,-6938],[785075,-6155]],
  28: [[734900,-8126],[731950,-7931],[720202,-7333],[705504,-6499],[690806,-5665],[679757,-5018]],
  29: [[615000,1615],[612540,1780],[602700,2290],[590400,2800],[578100,3310],[568875,3702]],
  30: [[680000,-5266],[677280,-5082],[666400,-4528],[652800,-3724],[639200,-2920],[628400,-2298]],
  31: [[495000,-3224],[493020,-3109],[485100,-2752],[475200,-2297],[465300,-1842],[457875,-1496]],
  32: [[597500,-5229],[595110,-5068],[585550,-4582],[573600,-3975],[561650,-3368],[552688,-2900]],
  33: [[727000,-8376],[724092,-8179],[712460,-7574],[698120,-6739],[683780,-5904],[672495,-5257]],
  34: [[617500,-3353],[615030,-3186],[605150,-2685],[592800,-2045],[580450,-1406],[571188,-920]],
  35: [[565000,-2149],[562740,-1993],[553700,-1529],[542400,-985],[531100,-441],[522625,-11]],
  36: [[504000,-1015],[501984,-877],[493920,-464],[483840,-2],[473760,460],[466200,819]],
  37: [[422000,1668],[420312,1782],[413560,2120],[405120,2530],[396680,2940],[390350,3253]],
  38: [[709000,1446],[706176,1638],[694820,2234],[680640,3057],[666460,3881],[655835,4528]],
  39: [[676000,522],[673304,703],[662440,1267],[648960,2028],[635480,2789],[625300,3371]],
  40: [[585000,-2144],[582660,-1992],[573300,-1528],[561600,-984],[549900,-440],[540525,32]],
  41: [[736000,-3002],[733054,-2793],[721280,-2156],[706560,-1273],[691840,-390],[680840,302]],
  42: [[550000,-11111],[547525,-10944],[538175,-10313],[528825,-9680],[519299,-9032],[511500,-8512]],
  43: [[775000,-1467],[771900,-1257],[759500,-586],[744000,169],[728500,925],[717125,1555]],
  44: [[755000,-11523],[751980,-11317],[739900,-10670],[724800,-9729],[709700,-8788],[698825,-8061]],
  45: [[629000,-10363],[626484,-10189],[616440,-9663],[603840,-8930],[591240,-8198],[581885,-7639]],
  46: [[250000,2776],[249000,2844],[245000,3114],[240000,3452],[235000,3790],[231250,4057]],
  47: [[350000,498],[348600,593],[343000,835],[336000,1300],[329000,1765],[323750,2129]],
  48: [[1075000,-16561],[1070700,-16274],[1053500,-15481],[1032000,-14476],[1010500,-13472],[993875,-12698]],
  49: [[584800,-3432],[582461,-3279],[573104,-2816],[561408,-2176],[549712,-1536],[540372,-1036]],
  50: [[599900,-5076],[597400,-4912],[587902,-4432],[575904,-3803],[563906,-3174],[554907,-2683]],
  51: [[705000,-1040],[702180,-849],[690900,-260],[676800,530],[662700,1320],[651675,1939]],
  52: [[609575,-6240],[607140,-6131],[597384,-5865],[585192,-5357],[573001,-4848],[563802,-4460]],
  53: [[779000,-7423],[775884,-7214],[763442,-6565],[747840,-5579],[732238,-4593],[720473,-3842]],
  54: [[2685000,-53560],[2674260,-52836],[2631300,-50317],[2577600,-47159],[2523900,-44000],[2483625,-41566]],
  55: [[691641,-4790],[688874,-4596],[677808,-4006],[663975,-3205],[650142,-2404],[639768,-1791]],
  56: [[523035,4244],[520931,4385],[512574,4821],[502114,5358],[491653,5896],[483757,6306]],
  57: [[855000,-3868],[851580,-3637],[837900,-2903],[820800,-1927],[803700,-950],[790875,-198]],
  58: [[810000,-4316],[806760,-4103],[793800,-3425],[777600,-2504],[761400,-1583],[749250,-879]],
  59: [[698650,-7915],[695865,-7722],[684677,-7137],[670704,-6339],[656731,-5541],[646246,-4929]],
  60: [[802000,-8563],[798792,-8350],[785960,-7673],[769920,-6753],[753880,-5833],[741850,-5130]],
  61: [[761074,-9027],[758038,-8824],[745853,-8212],[730631,-7276],[715409,-6340],[703983,-5618]],
  62: [[718000,-2726],[715128,-2532],[703640,-1939],[689280,-1105],[674920,-271],[663650,361]],
  63: [[844900,-10192],[841510,-9969],[828002,-9283],[811104,-8297],[794206,-7311],[781257,-6554]],
  64: [[624900,-2912],[622400,-2743],[612402,-2246],[599904,-1585],[587406,-923],[578033,-425]],
  65: [[664500,-10088],[661842,-9905],[651210,-9334],[637920,-8500],[624630,-7566],[614662,-7025]],
  66: [[280000,5000],[278880,5076],[274400,5357],[268800,5738],[263200,6119],[259000,6412]],
  67: [[340000,2300],[338640,2392],[333200,2662],[326400,3056],[319600,3450],[314500,3758]],
  68: [[370000,2500],[368520,2600],[362600,2902],[355200,3311],[347800,3720],[342250,4037]],
  69: [[250000,2800],[249000,2868],[245000,3138],[240000,3476],[235000,3814],[231250,4081]],
  70: [[980000,100],[976080,363],[960400,1210],[940800,2215],[921200,3220],[906500,3987]],
  71: [[670000,2394],[667320,2572],[656600,3124],[643200,3928],[629800,4732],[619550,5360]],
  72: [[110000,1508],[109560,1537],[107800,1677],[105600,1908],[103400,2139],[101750,2312]],
  73: [[235000,1971],[234065,2034],[230300,2274],[225600,2593],[220900,2912],[217375,3161]],
  74: [[280000,3074],[278880,3150],[274400,3431],[268800,3812],[263200,4193],[259000,4486]],
  75: [[285000,8276],[283860,8351],[279300,8629],[273600,9010],[267900,9391],[263625,9687]],
  76: [[280000,5075],[278880,5151],[274400,5432],[268800,5813],[263200,6194],[259000,6487]],
  77: [[239000,1340],[238044,1404],[234220,1652],[229440,1988],[224660,2325],[221075,2587]],
  78: [[220000,2414],[219120,2473],[215600,2704],[211200,3015],[206800,3326],[203500,3564]],
  79: [[635400,-4998],[632866,-4825],[622692,-4300],[610032,-3588],[597372,-2876],[587895,-2324]],
  80: [[485000,-771],[483060,-668],[475300,-365],[465600,29],[455900,423],[448875,729]],
  81: [[1075200,-11109],[1070900,-10822],[1053696,-10028],[1032192,-9023],[1010688,-8018],[994068,-7244]],
  82: [[805900,-1556],[802684,-1348],[790582,-713],[773664,154],[756746,1021],[743433,1701]],
  83: [[546000,-3745],[543816,-3598],[535080,-3153],[524160,-2572],[513240,-1991],[505050,-1544]],
  84: [[1320000,-7809],[1314720,-7453],[1293600,-6358],[1267200,-4935],[1240800,-3512],[1221000,-2437]],
  85: [[686000,-9034],[683256,-8844],[672280,-8266],[658560,-7454],[644840,-6641],[634510,-6018]],
  86: [[350000,104],[348600,200],[343000,442],[336000,806],[329000,1170],[323750,1483]],
  87: [[442139,1235],[440370,1354],[433296,1719],[424453,2217],[415611,2716],[408983,3098]],
  88: [[509000,-539],[506964,-402],[498820,10],[488640,473],[478460,935],[470835,1299]],
  89: [[610000,-1185],[607560,-1019],[597800,-514],[585600,24],[573400,570],[564250,945]],
  90: [[735000,-6709],[732060,-6513],[720300,-5910],[705600,-5076],[690900,-4242],[679875,-3594]],
  91: [[970950,-8590],[967066,-8329],[951531,-7485],[931892,-6377],[912253,-5269],[897424,-4409]],
  92: [[959000,-6512],[955176,-6248],[939880,-5337],[920640,-4193],[901400,-3049],[887208,-2174]],
  93: [[95000,1128],[94620,1154],[93100,1257],[91200,1405],[89300,1554],[87875,1668]],
  94: [[215000,1995],[214140,2052],[210700,2279],[206400,2583],[202100,2887],[198875,3124]],
  95: [[350000,4498],[348600,4593],[343000,4835],[336000,5200],[329000,5565],[323750,5929]],
  96: [[180000,1995],[179280,2043],[176400,2229],[172800,2499],[169200,2769],[166500,2980]],
  97: [[190000,2012],[189240,2063],[186200,2268],[182400,2548],[178600,2829],[175750,3046]],
  98: [[235000,1970],[234065,2033],[230300,2273],[225600,2592],[220900,2911],[217375,3160]],
  99: [[100000,1500],[99600,1527],[98000,1635],[96000,1830],[94000,2025],[92500,2175]],
  100: [[125000,1900],[124500,1934],[122500,2070],[120000,2308],[117500,2546],[115625,2729]],
  101: [[120000,2050],[119520,2082],[117600,2234],[115200,2472],[112800,2711],[111000,2889]],
  102: [[390000,2839],[388440,2946],[382200,3289],[374400,3755],[366600,4221],[360750,4585]],
  103: [[340000,1971],[338640,2063],[333200,2333],[326400,2727],[319600,3121],[314500,3429]],
  104: [[180000,1074],[179280,1122],[176400,1308],[172800,1578],[169200,1848],[166500,2059]],
  105: [[300000,1300],[298800,1381],[294000,1651],[288000,2032],[282000,2413],[277500,2706]],
  106: [[720000,-52],[717120,132],[705600,603],[691200,1283],[676800,1963],[666000,2490]],
  107: [[650000,-1154],[647400,-984],[637000,-479],[624000,272],[611000,1023],[601250,1619]],
  108: [[519000,-750],[516924,-612],[508620,-199],[498240,327],[487860,853],[480075,1256]],
  109: [[585000,-751],[582660,-599],[573300,-135],[561600,409],[549900,953],[540525,1384]],
  110: [[476000,-4124],[474096,-3995],[466480,-3607],[456960,-3071],[447440,-2534],[440300,-2109]],
  111: [[819000,-7423],[815736,-7208],[802620,-6536],[786240,-5584],[769860,-4631],[757515,-3892]],
  112: [[849000,-6339],[845604,-6112],[832020,-5420],[815040,-4399],[798060,-3377],[785075,-2594]],
  113: [[794000,-3957],[790824,-3745],[778120,-3088],[762240,-2176],[746360,-1265],[734450,-572]],
  114: [[749000,-1417],[746004,-1217],[734020,-606],[719040,86],[704060,778],[692808,1349]],
  115: [[1204000,-11678],[1199184,-11350],[1179920,-10341],[1155840,-8918],[1131760,-7495],[1113700,-6423]],
  116: [[1529000,-7052],[1522884,-6634],[1498420,-5316],[1467840,-3678],[1437260,-2040],[1414315,-761]],
  117: [[609000,-7294],[606564,-7185],[596820,-6919],[584540,-6410],[572260,-5901],[563085,-5513]],
  118: [[1530000,-18126],[1523880,-17708],[1499400,-16391],[1468800,-14755],[1438200,-13119],[1415250,-11840]],
  119: [[791930,-14716],[788762,-14506],[776091,-13858],[760253,-12946],[744414,-12034],[732535,-11332]],
  120: [[726190,-6515],[723286,-6319],[711666,-5714],[697334,-4881],[683002,-4047],[671776,-3398]],
  121: [[655980,-6848],[653356,-6671],[642860,-6177],[629741,-5471],[616621,-4765],[606281,-4222]],
  122: [[584800,-3770],[582461,-3617],[573104,-3154],[561408,-2514],[549712,-1874],[540372,-1374]],
  123: [[970950,-8895],[967066,-8634],[951531,-7790],[931892,-6682],[912253,-5574],[897424,-4714]],
  124: [[780000,-6966],[776880,-6749],[764400,-6070],[748800,-5024],[733200,-3977],[721500,-3138]],
  125: [[1319000,-23530],[1313724,-23174],[1292520,-22080],[1266140,-20657],[1239760,-19233],[1219958,-18159]],
  126: [[764000,-10131],[760944,-9927],[748720,-9308],[733440,-8358],[718160,-7408],[706700,-6660]],
  127: [[2095000,-30888],[2086620,-30323],[2053100,-28527],[2011200,-26170],[1969300,-23814],[1937375,-22034]],
  128: [[2000000,-40410],[1992000,-39870],[1960000,-38160],[1920000,-35595],[1880000,-33030],[1850000,-31012]],
  129: [[879900,-10556],[876380,-10320],[862302,-9606],[844704,-8600],[827106,-7594],[813633,-6818]],
  130: [[400000,1936],[398400,2044],[392000,2384],[384000,2870],[376000,3356],[370000,3737]],
  131: [[745000,10602],[742020,10802],[730100,11405],[715200,12207],[700300,13009],[689625,13635]],
  132: [[895000,5022],[891420,5263],[877100,5964],[859200,6970],[841300,7975],[827462,8758]],
  133: [[260000,981],[258960,1050],[254800,1288],[249600,1638],[244400,1988],[240500,2263]],
  134: [[825000,3000],[821700,3216],[808500,3903],[792000,4875],[775500,5846],[763125,6608]],
  135: [[350000,4789],[348600,4884],[343000,5126],[336000,5491],[329000,5856],[323750,6220]],
  136: [[290000,980],[288840,1058],[284200,1327],[278400,1714],[272600,2101],[268250,2404]],
  137: [[927000,-9969],[922865,-9679],[906510,-8565],[890700,-7472],[875130,-6401],[859455,-5322]],
  138: [[1457000,-12834],[1450155,-12374],[1427070,-11819],[1399750,-9024],[1372580,-7239],[1345225,-5365]],
  139: [[998000,-15080],[993010,-14741],[978060,-13674],[960180,-12478],[942480,-11329],[924630,-10132]],
  140: [[765000,-7325],[761325,-7078],[750150,-6340],[736200,-5417],[722385,-4510],[708375,-3595]],
  141: [[766500,-8088],[762818,-7840],[751665,-7100],[737610,-6175],[723690,-5264],[709568,-4342]],
  142: [[911500,-7858],[907193,-7569],[895215,-6778],[879045,-5715],[863005,-4660],[846738,-3591]],
  143: [[839500,-10556],[835303,-10277],[823215,-9531],[808020,-8516],[792975,-7511],[777633,-6490]],
  144: [[1750000,-32605],[1741250,-32013],[1715000,-30285],[1682500,-28110],[1650000,-25935],[1618750,-23804]],
  145: [[1149000,-4008],[1143255,-3623],[1126020,-2453],[1104720,-1030],[1083510,386],[1061865,1834]],
  146: [[1200000,-10400],[1194000,-10002],[1176000,-8858],[1152000,-7388],[1128000,-5918],[1104000,-4448]],
  147: [[980000,-7668],[975100,-7336],[960400,-6400],[942400,-5179],[924600,-3971],[906500,-2769]],
  148: [[599000,-3224],[596005,-3025],[587020,-2437],[575040,-1633],[563145,-835],[550920,-18]],
  149: [[614000,2805],[610930,3009],[601660,3612],[589440,4412],[577320,5203],[564950,6030]],
  150: [[678650,-4763],[675257,-4535],[664571,-3813],[651696,-2935],[638944,-2065],[625943,-1171]],
};

// ── Types ─────────────────────────────────────────────────────────────────────

type PropType = "A" | "B" | "C" | "";

interface PropertyEntry {
  propertyNum: string;
  optionIdx: number;
  type: PropType;
  marketValue: string;
  purchasePrice: string;
  cashflowAfterTax: string;
  valueAdd: boolean;
}

interface RoundInput {
  properties: PropertyEntry[];
  aGrowthRate: string;
  bGrowthRate: string;
  cGrowthRate: string;
  incomeGrowth: string;
}

interface OfferRowCalc {
  buyingPower: number;
  loanAmount: number;
  equityRequired: number;
  remainingEquity: number;
  status: "OK" | "ERROR" | "";
}

interface OfferCalc {
  startEquity: number;
  rows: OfferRowCalc[];
}

interface PortfolioSection {
  carryoverLabel: string;
  carryoverMV: number;
  carryoverLoan: number;
  carryoverCF: number;
  newProps: Array<{ label: string; mv: number; loan: number; cf: number }>;
  subTotalMV: number;
  subTotalLoan: number;
  subTotalCF: number;
  growthRate: number;
  incomeGrowthRate: number;
  postGrowthMV: number;
  postGrowthCF: number;
}

interface RoundResult {
  A: PortfolioSection;
  B: PortfolioSection;
  C: PortfolioSection;
  totalMV: number;
  totalMV80: number;
  totalLoan: number;
  totalCashflow: number;
  availableEquity: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const HOME_MV = 1_000_000;
const HOME_LOAN = 350_000;
const INITIAL_EQUITY = HOME_MV * 0.8 - HOME_LOAN; // 450,000

function emptyProp(): PropertyEntry {
  return { propertyNum: "", optionIdx: 0, type: "", marketValue: "", purchasePrice: "", cashflowAfterTax: "", valueAdd: false };
}

function isRowFilled(p: PropertyEntry): boolean {
  return !!(p.propertyNum || p.type || p.marketValue || p.purchasePrice || p.cashflowAfterTax || p.valueAdd);
}

function emptyRound(): RoundInput {
  return {
    properties: Array.from({ length: 8 }, emptyProp),
    aGrowthRate: "",
    bGrowthRate: "",
    cGrowthRate: "",
    incomeGrowth: "4",
  };
}

// ── Calculations ──────────────────────────────────────────────────────────────

function n(s: string): number {
  const v = parseFloat(s);
  return isNaN(v) ? 0 : v;
}

function calcOffer(props: PropertyEntry[], startEquity: number): OfferCalc {
  const rows: OfferRowCalc[] = [];
  let equity = startEquity;
  for (const prop of props) {
    const pp = n(prop.purchasePrice);
    const va = prop.valueAdd;
    const eRatio = va ? 0.3 : 0.25;
    const lRatio = va ? 1.1 : 1.05;
    const buyingPower = equity / eRatio;
    const loanAmount = pp > 0 ? pp * lRatio : 0;
    const equityRequired = pp > 0 ? pp * eRatio : 0;
    const remainingEquity = loanAmount > 0 ? equity - equityRequired : equity;
    const status: "OK" | "ERROR" | "" = pp === 0 ? "" : buyingPower >= pp ? "OK" : "ERROR";
    rows.push({ buyingPower, loanAmount, equityRequired, remainingEquity, status });
    if (loanAmount > 0) equity = remainingEquity;
  }
  return { startEquity, rows };
}

type Carry = Record<"A" | "B" | "C", { mv: number; loan: number; cf: number }>;

function calcRound(input: RoundInput, carry: Carry, roundIdx: number): RoundResult {
  const gA = n(input.aGrowthRate) / 100;
  const gB = n(input.bGrowthRate) / 100;
  const gC = n(input.cGrowthRate) / 100;
  const gI = n(input.incomeGrowth) / 100;

  const newByType: Record<"A" | "B" | "C", Array<{ label: string; mv: number; loan: number; cf: number }>> = { A: [], B: [], C: [] };
  input.properties.forEach((prop, i) => {
    const pp = n(prop.purchasePrice);
    if (!prop.type || pp === 0) return;
    const t = prop.type as "A" | "B" | "C";
    const mv = n(prop.marketValue);
    const cf = n(prop.cashflowAfterTax);
    const va = prop.valueAdd;
    const label = prop.propertyNum ? `P${prop.propertyNum}` : `Property ${i + 1}`;
    newByType[t].push({
      label,
      mv: va ? mv * 1.1 : mv,
      loan: pp * (va ? 1.1 : 1.05),
      cf: cf + (va ? Math.abs(cf) * 0.1 : 0),
    });
  });

  function section(type: "A" | "B" | "C", g: number): PortfolioSection {
    const c = carry[type];
    const np = newByType[type];
    const subMV = c.mv + np.reduce((s, p) => s + p.mv, 0);
    const subLoan = c.loan + np.reduce((s, p) => s + p.loan, 0);
    const subCF = c.cf + np.reduce((s, p) => s + p.cf, 0);
    const postMV = subMV * (1 + g);
    const postCF = subCF + Math.abs(subCF) * gI;
    const carryoverLabel =
      roundIdx === 0
        ? type === "A" ? "Home" : "—"
        : `Round ${roundIdx}`;
    return {
      carryoverLabel,
      carryoverMV: c.mv,
      carryoverLoan: c.loan,
      carryoverCF: c.cf,
      newProps: np,
      subTotalMV: subMV,
      subTotalLoan: subLoan,
      subTotalCF: subCF,
      growthRate: g,
      incomeGrowthRate: gI,
      postGrowthMV: postMV,
      postGrowthCF: postCF,
    };
  }

  const sA = section("A", gA);
  const sB = section("B", gB);
  const sC = section("C", gC);
  const totalMV = sA.postGrowthMV + sB.postGrowthMV + sC.postGrowthMV;
  const totalMV80 = totalMV * 0.8;
  const totalLoan = sA.subTotalLoan + sB.subTotalLoan + sC.subTotalLoan;
  const totalCF = sA.postGrowthCF + sB.postGrowthCF + sC.postGrowthCF;
  const avail = totalMV80 - totalLoan + totalCF;
  return { A: sA, B: sB, C: sC, totalMV, totalMV80, totalLoan, totalCashflow: totalCF, availableEquity: avail };
}

function calcAll(rounds: RoundInput[]) {
  const offers: OfferCalc[] = [];
  const results: RoundResult[] = [];
  let equity = INITIAL_EQUITY;
  let carry: Carry = {
    A: { mv: HOME_MV, loan: HOME_LOAN, cf: 0 },
    B: { mv: 0, loan: 0, cf: 0 },
    C: { mv: 0, loan: 0, cf: 0 },
  };
  for (let r = 0; r < 5; r++) {
    offers.push(calcOffer(rounds[r].properties, equity));
    const res = calcRound(rounds[r], carry, r);
    results.push(res);
    equity = res.availableEquity;
    carry = {
      A: { mv: res.A.postGrowthMV, loan: res.A.subTotalLoan, cf: res.A.postGrowthCF },
      B: { mv: res.B.postGrowthMV, loan: res.B.subTotalLoan, cf: res.B.postGrowthCF },
      C: { mv: res.C.postGrowthMV, loan: res.C.subTotalLoan, cf: res.C.postGrowthCF },
    };
  }
  return { offers, results };
}

// ── Formatters ────────────────────────────────────────────────────────────────

const AUD = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fc = (v: number) => AUD.format(Math.round(v));
const fp = (v: number) => v === 0 ? "0%" : `${(v * 100).toFixed(1)}%`;

// ── Small UI helpers ──────────────────────────────────────────────────────────

function NumInput({ value, onChange, className = "" }: { value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="0"
      className={`w-full rounded border border-input bg-white px-2 py-2.5 text-right text-sm text-charcoal focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${className}`}
    />
  );
}

function Computed({ value }: { value: string }) {
  return (
    <div className="whitespace-nowrap rounded bg-muted px-2 py-1.5 text-right text-sm tabular-nums text-charcoal/70 select-none">
      {value}
    </div>
  );
}

function StatusBadge({ status }: { status: "OK" | "ERROR" | "" }) {
  if (!status) return <div className="text-center text-sm text-muted-foreground">—</div>;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status === "OK" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {status}
    </span>
  );
}

// ── Offer Section (one round's input block) ───────────────────────────────────

function OfferSection({
  roundIdx, input, calc,
  onUpdateProp, onUpdateSetting, onSelectProperty,
}: {
  roundIdx: number;
  input: RoundInput;
  calc: OfferCalc;
  onUpdateProp: (i: number, field: keyof PropertyEntry, val: any) => void;
  onUpdateSetting: (field: keyof Omit<RoundInput, "properties">, val: string) => void;
  onSelectProperty: (pi: number, propertyNum: string, optionIdx: number) => void;
}) {
  return (
    <div className="mb-8">
      {/* Round header + settings */}
      <div className="rounded-t-xl border border-b-0 border-border bg-charcoal px-4 py-3">
        <div className="mb-3 flex flex-wrap items-baseline gap-2">
          <span className="font-display text-base font-semibold text-white">Round {roundIdx + 1}</span>
          <span className="text-sm text-white/60">
            Starting equity: <span className="font-semibold text-primary">{fc(calc.startEquity)}</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {(["aGrowthRate", "bGrowthRate", "cGrowthRate", "incomeGrowth"] as const).map((field, fi) => {
            const labels = ["A Growth %", "B Growth %", "C Growth %", "Income %"];
            return (
              <label key={field} className="flex items-center gap-1.5">
                <span className="text-white/60 whitespace-nowrap text-xs sm:text-sm">{labels[fi]}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={input[field]}
                  onChange={e => onUpdateSetting(field, e.target.value)}
                  placeholder="0"
                  className="w-12 rounded border border-white/20 bg-white/10 px-2 py-2 text-right text-sm text-white focus:border-primary focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Property table */}
      <p className="mb-1 text-right text-xs text-muted-foreground sm:hidden">← scroll to see all columns</p>
      <div className="overflow-x-auto rounded-b-xl border border-border">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-muted-foreground">
              <th className="px-3 py-2.5 text-left text-xs uppercase tracking-wide">Prop</th>
              <th className="px-3 py-2.5 text-left text-xs uppercase tracking-wide">Type</th>
              <th className="px-3 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">Market Value</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal">Asking price</div>
              </th>
              <th className="px-3 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">MAX Offer</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal whitespace-nowrap">Equity ÷ 25% / ÷ 30% value-add</div>
              </th>
              <th className="px-3 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">Purchase Price</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal">Actual offer</div>
              </th>
              <th className="px-3 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">Cashflow p.a.</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal">After tax</div>
              </th>
              <th className="px-3 py-2.5 text-center text-xs uppercase tracking-wide">Value Add</th>
              <th className="px-3 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">Loan Amt</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal whitespace-nowrap">PP × 105% / × 110% value-add</div>
              </th>
              <th className="px-3 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">Equity Req.</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal whitespace-nowrap">PP × 25% / × 30% value-add</div>
              </th>
              <th className="px-3 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">Avail. Equity</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal whitespace-nowrap">Equity − equity required</div>
              </th>
              <th className="px-3 py-2.5 text-center text-xs uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const lastFilled = input.properties.reduce((last, p, i) => isRowFilled(p) ? i : last, -1);
              const visible = input.properties.slice(0, Math.min(lastFilled + 2, input.properties.length));
              return visible.map((prop, i) => {
                const row = calc.rows[i];
                const catalogEntry = PROPERTY_CATALOG[parseInt(prop.propertyNum)];
                return (
                  <tr key={i} className="border-b border-border last:border-0 even:bg-secondary/20">
                    {/* Prop # + option selector */}
                    <td className="px-3 py-2">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                        <input
                          type="number"
                          value={prop.propertyNum}
                          onChange={e => {
                            const v = e.target.value;
                            onSelectProperty(i, v, 0);
                          }}
                          placeholder="P#"
                          min={1}
                          max={150}
                          aria-label={`Row ${i + 1} property number`}
                          className="w-14 rounded border border-input bg-white px-1.5 py-1.5 text-center text-xs text-charcoal focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        {catalogEntry && (
                          <select
                            value={prop.optionIdx}
                            onChange={e => onSelectProperty(i, prop.propertyNum, parseInt(e.target.value))}
                            aria-label={`Row ${i + 1} price option`}
                            className="w-28 rounded border border-input bg-white px-1.5 py-1 text-xs text-charcoal focus:border-primary focus:outline-none"
                          >
                            {catalogEntry.map((opt, oi) => (
                              <option key={oi} value={oi}>
                                {oi === 0 ? `${fc(opt[0])} ★` : fc(opt[0])}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={prop.type}
                        onChange={e => onUpdateProp(i, "type", e.target.value)}
                        aria-label={`Row ${i + 1} property type`}
                        className="rounded border border-input bg-white px-2 py-1.5 text-sm text-charcoal focus:border-primary focus:outline-none"
                      >
                        <option value="">—</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <NumInput value={prop.marketValue} onChange={v => onUpdateProp(i, "marketValue", v)} />
                    </td>
                    <td className="px-3 py-2">
                      <Computed value={fc(row.buyingPower)} />
                    </td>
                    <td className="px-3 py-2">
                      <NumInput value={prop.purchasePrice} onChange={v => onUpdateProp(i, "purchasePrice", v)} />
                    </td>
                    <td className="px-3 py-2">
                      <NumInput value={prop.cashflowAfterTax} onChange={v => onUpdateProp(i, "cashflowAfterTax", v)} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={prop.valueAdd}
                        onChange={e => onUpdateProp(i, "valueAdd", e.target.checked)}
                        aria-label={`Row ${i + 1} value add`}
                        className="h-4 w-4 accent-primary"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Computed value={row.loanAmount > 0 ? fc(row.loanAmount) : "—"} />
                    </td>
                    <td className="px-3 py-2">
                      <Computed value={row.equityRequired > 0 ? fc(row.equityRequired) : "—"} />
                    </td>
                    <td className="px-3 py-2">
                      <Computed value={fc(row.remainingEquity)} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Round Tab ─────────────────────────────────────────────────────────────────

const SECTION_COLORS: Record<"A" | "B" | "C", string> = {
  A: "bg-blue-50 text-blue-900",
  B: "bg-purple-50 text-purple-900",
  C: "bg-amber-50 text-amber-900",
};

function SectionView({ type, section }: { type: "A" | "B" | "C"; section: PortfolioSection }) {
  const showCarryover = section.carryoverLabel !== "—";
  const hasProps = section.newProps.length > 0 || showCarryover;

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-border">
      <div className={`flex items-center gap-2 border-b border-border px-4 py-2.5 ${SECTION_COLORS[type]}`}>
        <span className="font-display text-sm font-semibold">{type} Properties</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-muted-foreground">
              <th className="px-4 py-2.5 text-left text-xs uppercase tracking-wide">Label</th>
              <th className="px-4 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">Market Value</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal whitespace-nowrap">PP or PP × 110% (value-add)</div>
              </th>
              <th className="px-4 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">Loan Amount</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal whitespace-nowrap">PP × 105% or × 110% (value-add)</div>
              </th>
              <th className="px-4 py-2.5 text-right">
                <div className="text-xs uppercase tracking-wide">Cashflow p.a.</div>
                <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal whitespace-nowrap">After tax / +10% with value-add</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {showCarryover && (
              <tr className="border-b border-border bg-secondary/20">
                <td className="px-4 py-2 font-medium text-charcoal">{section.carryoverLabel}</td>
                <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">{section.carryoverMV > 0 ? fc(section.carryoverMV) : "—"}</td>
                <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">{section.carryoverLoan > 0 ? fc(section.carryoverLoan) : "—"}</td>
                <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">{section.carryoverCF !== 0 ? fc(section.carryoverCF) : "—"}</td>
              </tr>
            )}
            {section.newProps.map((p, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="px-4 py-2 text-charcoal">{p.label}</td>
                <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">{p.mv > 0 ? fc(p.mv) : "—"}</td>
                <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">{p.loan > 0 ? fc(p.loan) : "—"}</td>
                <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">{p.cf !== 0 ? fc(p.cf) : "—"}</td>
              </tr>
            ))}
            {!hasProps && (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center text-sm text-muted-foreground">No properties this round</td>
              </tr>
            )}
          </tbody>
          <tfoot className="border-t border-border">
            <tr className="bg-secondary/50 font-semibold">
              <td className="px-4 py-2 text-charcoal">Sub-Total</td>
              <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">{fc(section.subTotalMV)}</td>
              <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">{fc(section.subTotalLoan)}</td>
              <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap">{section.subTotalCF !== 0 ? fc(section.subTotalCF) : "—"}</td>
            </tr>
            <tr className="border-t border-border/50">
              <td className="px-4 py-2 text-muted-foreground text-xs">Capital Growth ({fp(section.growthRate)})</td>
              <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap font-semibold text-primary">{fc(section.postGrowthMV)}</td>
              <td className="px-4 py-2" />
              <td className="px-4 py-2" />
            </tr>
            <tr className="border-t border-border/50">
              <td className="px-4 py-2 text-muted-foreground text-xs">Rental Growth ({fp(section.incomeGrowthRate)})</td>
              <td className="px-4 py-2" />
              <td className="px-4 py-2" />
              <td className="px-4 py-2 text-right tabular-nums whitespace-nowrap font-semibold text-primary">{section.postGrowthCF !== 0 ? fc(section.postGrowthCF) : "—"}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function RoundView({ roundIdx, result }: { roundIdx: number; result: RoundResult }) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-5">
        {(["A", "B", "C"] as const).map(t => (
          <SectionView key={t} type={t} section={result[t]} />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="border-b border-border bg-charcoal px-4 py-3">
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Round {roundIdx + 1} Summary
          </span>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: "Total Market Value", value: fc(result.totalMV) },
            { label: "80% of Market Value", value: fc(result.totalMV80) },
            { label: "Total Loan Amount", value: fc(result.totalLoan), neg: true },
            { label: "Total Cashflow p.a.", value: fc(result.totalCashflow) },
          ].map(({ label, value, neg }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className={`tabular-nums font-medium ${neg ? "text-red-600" : "text-charcoal"}`}>{value}</span>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-primary/5 px-5 py-4">
            <div>
              <div className="font-semibold text-charcoal">Available Equity</div>
              {roundIdx < 4 && <div className="text-xs text-muted-foreground">→ Round {roundIdx + 2} starting equity</div>}
            </div>
            <span className="font-display text-xl font-bold tabular-nums text-primary">{fc(result.availableEquity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const TABS = ["Offer", "Round 1", "Round 2", "Round 3", "Round 4", "Round 5"] as const;
type TabName = (typeof TABS)[number];

export function PropertyGame() {
  const [rounds, setRounds] = useState<RoundInput[]>(() => {
    if (typeof window === "undefined") return Array.from({ length: 5 }, emptyRound);
    try {
      const saved = localStorage.getItem("property-game");
      if (saved) {
        const parsed = JSON.parse(saved) as any[];
        return parsed.map(r => ({
          ...emptyRound(),
          ...r,
          properties: r.properties?.map((p: any) => ({ ...emptyProp(), ...p })) ?? Array.from({ length: 8 }, emptyProp),
        }));
      }
    } catch {}
    return Array.from({ length: 5 }, emptyRound);
  });

  useEffect(() => {
    localStorage.setItem("property-game", JSON.stringify(rounds));
  }, [rounds]);
  const [activeTab, setActiveTab] = useState<TabName>("Offer");

  const { offers, results } = useMemo(() => calcAll(rounds), [rounds]);

  function updateProp(ri: number, pi: number, field: keyof PropertyEntry, val: any) {
    setRounds(prev =>
      prev.map((r, i) =>
        i !== ri ? r : { ...r, properties: r.properties.map((p, j) => (j !== pi ? p : { ...p, [field]: val })) }
      )
    );
  }

  function selectProperty(ri: number, pi: number, propertyNum: string, optionIdx: number) {
    const num = parseInt(propertyNum);
    const entry = PROPERTY_CATALOG[num];
    setRounds(prev =>
      prev.map((r, i) =>
        i !== ri ? r : {
          ...r,
          properties: r.properties.map((p, j) =>
            j !== pi ? p : {
              ...p,
              propertyNum,
              optionIdx,
              ...(entry && {
                marketValue: String(entry[0][0]),
                purchasePrice: String(entry[optionIdx]?.[0] ?? entry[0][0]),
                cashflowAfterTax: String(entry[optionIdx]?.[1] ?? entry[0][1]),
              }),
            }
          ),
        }
      )
    );
  }

  function updateSetting(ri: number, field: keyof Omit<RoundInput, "properties">, val: string) {
    setRounds(prev => prev.map((r, i) => (i !== ri ? r : { ...r, [field]: val })));
  }

  function reset() {
    localStorage.removeItem("property-game");
    setRounds(Array.from({ length: 5 }, emptyRound));
    setActiveTab("Offer");
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="sticky top-0 z-40 -mx-4 mb-6 border-b border-border bg-background px-4 py-3 shadow-sm lg:-mx-6 lg:px-6">
        <div className="flex items-center justify-between gap-4">
        <div className="flex overflow-x-auto gap-1 rounded-xl border border-border bg-secondary/50 p-1">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-charcoal text-white shadow-sm"
                  : "text-muted-foreground hover:text-charcoal"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={reset}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <RotateCcw size={14} />
          Reset
        </button>
        </div>
      </div>

      {/* Offer tab */}
      {activeTab === "Offer" && (
        <div>
          <div className="mb-6 rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm">
            <strong className="text-charcoal">Starting position:</strong>{" "}
            <span className="text-muted-foreground">
              Home — Market Value {fc(HOME_MV)} · Loan {fc(HOME_LOAN)} · Available Equity{" "}
            </span>
            <strong className="text-primary">{fc(INITIAL_EQUITY)}</strong>
          </div>
          {rounds.map((round, i) => (
            <OfferSection
              key={i}
              roundIdx={i}
              input={round}
              calc={offers[i]}
              onUpdateProp={(pi, field, val) => updateProp(i, pi, field, val)}
              onUpdateSetting={(field, val) => updateSetting(i, field, val)}
              onSelectProperty={(pi, propertyNum, optionIdx) => selectProperty(i, pi, propertyNum, optionIdx)}
            />
          ))}
        </div>
      )}

      {/* Round tabs */}
      {TABS.slice(1).map((tab, i) =>
        activeTab === tab ? (
          <RoundView key={tab} roundIdx={i} result={results[i]} />
        ) : null
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Created by Jason Whitton of{" "}
        <span className="font-medium text-charcoal">Positive Real Estate</span>
      </p>
    </div>
  );
}
