import { AstronomicalObject } from "../interfaces";
import { j2000Epoch } from "../constants/scientific";

export const sun: AstronomicalObject = {
  id: "sun",
  type: "star",
  diameter: 1391016,
  sprite: "sprites/sun.png",
  photo: {
    url: "photos/sun.png",
    attribution: {
      creator: "NASA/SDO (AIA)",
      licenseName: "Public Domain",
    },
  },
  color: "#FDB813",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0,
    semiMajorAxisRate: 0,
    eccentricity: 0,
    eccentricityRate: 0,
    inclination: 0,
    inclinationRate: 0,
    meanLongitude: 0,
    meanLongitudeRate: 0,
    longitudeOfPeriapsis: 0,
    longitudeOfPeriapsisRate: 0,
    longitudeOfAscendingNode: 0,
    longitudeOfAscendingNodeRate: 0,
  },
};

// Mercury
// --------------------------------------------------------

export const mercury: AstronomicalObject = {
  id: "mercury",
  parent: sun,
  type: "planet",
  diameter: 4879,
  sprite: "sprites/mercury.png",
  photo: {
    url: "photos/mercury.png",
    attribution: {
      creator: "NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington",
      licenseName: "Public Domain",
    },
  },
  color: "#7D7C81",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.38709843,
    semiMajorAxisRate: 0,
    eccentricity: 0.20563661,
    eccentricityRate: 0.00002123,
    inclination: 7.00559432,
    inclinationRate: -0.00590158,
    meanLongitude: 252.25166724,
    meanLongitudeRate: 149472.67486623,
    longitudeOfPeriapsis: 77.45771895,
    longitudeOfPeriapsisRate: 0.15940013,
    longitudeOfAscendingNode: 48.33961819,
    longitudeOfAscendingNodeRate: -0.12214182,
  },
};

// Venus
// --------------------------------------------------------

export const venus: AstronomicalObject = {
  id: "venus",
  parent: sun,
  type: "planet",
  diameter: 12104,
  sprite: "sprites/venus.png",
  photo: {
    url: "photos/venus.png",
    attribution: {
      creator: "NASA/JPL-Caltech",
      licenseName: "Public Domain",
    },
  },
  color: "#CAC9C7",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.72332102,
    semiMajorAxisRate: -0.00000026,
    eccentricity: 0.00676399,
    eccentricityRate: -0.00005107,
    inclination: 3.39777545,
    inclinationRate: 0.00043494,
    meanLongitude: 181.9797085,
    meanLongitudeRate: 58517.8156026,
    longitudeOfPeriapsis: 131.76755713,
    longitudeOfPeriapsisRate: 0.05679648,
    longitudeOfAscendingNode: 76.67261496,
    longitudeOfAscendingNodeRate: -0.27274174,
  },
};

// Earth
// --------------------------------------------------------

export const earth: AstronomicalObject = {
  id: "earth",
  parent: sun,
  type: "planet",
  diameter: 12742,
  sprite: "sprites/earth.png",
  photo: {
    url: "photos/earth.png",
    attribution: {
      creator: "Apollo 17",
      licenseName: "Public Domain",
    },
  },
  color: "#0066CC",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 1.00000018,
    semiMajorAxisRate: -0.00000003,
    eccentricity: 0.01673163,
    eccentricityRate: -0.00003661,
    inclination: -0.00054346,
    inclinationRate: -0.01337178,
    meanLongitude: 100.46691572,
    meanLongitudeRate: 35999.37306329,
    longitudeOfPeriapsis: 102.93005885,
    longitudeOfPeriapsisRate: 0.3179526,
    longitudeOfAscendingNode: -5.11260389,
    longitudeOfAscendingNodeRate: 0.24123856,
  },
};

export const moon: AstronomicalObject = {
  id: "moon",
  type: "moon",
  parent: earth,
  diameter: 3474,
  sprite: "sprites/moon.png",
  photo: {
    url: "photos/moon.png",
    attribution: {
      creator: "Gregory H. Revera",
      licenseName: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
  },
  color: "#787271",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.002548289534512777,
    semiMajorAxisRate: 0.000005823945400744088,
    eccentricity: 0.06476694137484437,
    eccentricityRate: -0.03465308043342892,
    inclination: 5.240010960708354,
    inclinationRate: -0.19070605241874716,
    meanLongitude: 572.8598631710847,
    meanLongitudeRate: 481256.6, // based on sidereal period (360 degrees / 27.321661 days to degrees/century)
    longitudeOfPeriapsis: 432.11960627615787,
    longitudeOfPeriapsisRate: 110.16678118691738,
    longitudeOfAscendingNode: 123.9837037681769,
    longitudeOfAscendingNodeRate: 224.43685873727298,
  },
};

// Mars
// --------------------------------------------------------

export const mars: AstronomicalObject = {
  id: "mars",
  type: "planet",
  parent: sun,
  diameter: 6779,
  sprite: "sprites/mars.png",
  photo: {
    url: "photos/mars.png",
    attribution: {
      creator: "ESA & MPS for OSIRIS Team MPS/UPD/LAM/IAA/RSSD/INTA/UPM/DASP/IDA",
      licenseName: "CC BY-SA IGO 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/igo/",
    },
  },
  color: "#E87C5A",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 1.52371243,
    semiMajorAxisRate: 0.00000097,
    eccentricity: 0.09336511,
    eccentricityRate: 0.00009149,
    inclination: 1.85181869,
    inclinationRate: -0.00724757,
    meanLongitude: -4.56813164,
    meanLongitudeRate: 19140.29934243,
    longitudeOfPeriapsis: -23.91744784,
    longitudeOfPeriapsisRate: 0.45223625,
    longitudeOfAscendingNode: 49.71320984,
    longitudeOfAscendingNodeRate: -0.26852431,
  },
};

export const phobos: AstronomicalObject = {
  id: "phobos",
  type: "moon",
  parent: mars,
  diameter: 22.5334,
  sprite: "sprites/phobos.png",
  photo: {
    url: "photos/phobos.png",
    attribution: {
      creator: "NASA / JPL-Caltech / University of Arizona",
      licenseName: "Public Domain",
    },
  },
  color: "#A29286",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.00006268997572179157,
    semiMajorAxisRate: -6.173026970639857e-10,
    eccentricity: 0.01541577713745092,
    eccentricityRate: -0.0006879517156543405,
    inclination: 26.05134469392531,
    inclinationRate: 1.3474817919771311,
    meanLongitude: 772.9975290578709,
    meanLongitudeRate: 4.123019e7,
    longitudeOfPeriapsis: 427.18716317989197,
    longitudeOfPeriapsisRate: -303.83630361652075,
    longitudeOfAscendingNode: 84.81060423679303,
    longitudeOfAscendingNodeRate: -0.2952705426118456,
  },
};

export const deimos: AstronomicalObject = {
  id: "deimos",
  type: "moon",
  parent: mars,
  diameter: 12, // approximate
  sprite: "sprites/deimos.png",
  photo: {
    url: "photos/deimos.png",
    attribution: {
      creator: "NASA / JPL-Caltech / University of Arizona",
      licenseName: "Public Domain",
    },
  },
  color: "#C4BCA3",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.000156812982683631,
    semiMajorAxisRate: 5.193697700915396e-9,
    eccentricity: 0.0002419395670375644,
    eccentricityRate: 0.0000525939663146936,
    inclination: 27.57017394063173,
    inclinationRate: -1.1344640042807583,
    meanLongitude: 518.064667766238,
    meanLongitudeRate: 10414327.960917689,
    longitudeOfPeriapsis: 273.9006515930637,
    longitudeOfPeriapsisRate: -56.00319909809886,
    longitudeOfAscendingNode: 83.6637869299841,
    longitudeOfAscendingNodeRate: 2.76435060152383,
  },
};

// Jupiter
// --------------------------------------------------------

export const jupiter: AstronomicalObject = {
  id: "jupiter",
  type: "planet",
  parent: sun,
  diameter: 139822,
  sprite: "sprites/jupiter.png",
  photo: {
    url: "photos/jupiter.png",
    attribution: {
      creator: "NASA, ESA, and A. Simon (Goddard Space Flight Center)",
      licenseName: "Public domain",
    },
  },
  color: "#C0A288",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 5.20248019,
    semiMajorAxisRate: -0.00002864,
    eccentricity: 0.0485359,
    eccentricityRate: 0.00018026,
    inclination: 1.29861416,
    inclinationRate: -0.00322699,
    meanLongitude: 34.33479152,
    meanLongitudeRate: 3034.90371757,
    longitudeOfPeriapsis: 14.27495244,
    longitudeOfPeriapsisRate: 0.18199196,
    longitudeOfAscendingNode: 100.29282654,
    longitudeOfAscendingNodeRate: 0.13024619,
    b: -0.00012452,
    c: 0.0606406,
    s: -0.35635438,
    f: 38.35125,
  },
};

export const io: AstronomicalObject = {
  id: "io",
  type: "moon",
  parent: jupiter,
  diameter: 3643.2,
  sprite: "sprites/io.png",
  photo: {
    url: "photos/io.png",
    attribution: {
      creator: "NASA / JPL / University of Arizona",
      licenseName: "Public domain",
    },
  },
  color: "#FCF590",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.002821035643390086,
    semiMajorAxisRate: 1.5866187311024127e-8,
    eccentricity: 0.003763519423862818,
    eccentricityRate: 0.0001986809274285642,
    inclination: 2.212652137532374,
    inclinationRate: -0.012493484705005997,
    meanLongitude: 636.4244467435615,
    meanLongitudeRate: 7423369.202075594,
    longitudeOfPeriapsis: 399.8086960847625,
    longitudeOfPeriapsisRate: 6.133801896882858,
    longitudeOfAscendingNode: 336.8509510943547,
    longitudeOfAscendingNodeRate: 2.043859001732528,
  },
};
export const europa: AstronomicalObject = {
  id: "europa",
  type: "moon",
  parent: jupiter,
  diameter: 3121.6,
  sprite: "sprites/europa.png",
  photo: {
    url: "photos/europa.png",
    attribution: {
      creator: "NASA/JPL/DLR",
      licenseName: "Public domain",
    },
  },
  color: "#A1976B",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.004486870762804388,
    semiMajorAxisRate: 1.0376761162139703e-8,
    eccentricity: 0.00970612065536221,
    eccentricityRate: -0.0001319468092575507,
    inclination: 1.790911124265613,
    inclinationRate: 0.4097576995410541,
    meanLongitude: 882.0144268671047,
    meanLongitudeRate: 3700784.992677322,
    longitudeOfPeriapsis: 586.9518864045856,
    longitudeOfPeriapsisRate: -11.57431653972992,
    longitudeOfAscendingNode: 332.6272961174866,
    longitudeOfAscendingNodeRate: 17.310650352972516,
  },
};
export const ganymede: AstronomicalObject = {
  id: "ganymede",
  type: "moon",
  parent: jupiter,
  diameter: 5268.2,
  sprite: "sprites/ganymede.png",
  photo: {
    url: "photos/ganymede.png",
    attribution: {
      creator: "NASA/JPL (edited by PlanetUser)",
      licenseName: "Public domain",
    },
  },
  color: "#A28E7F",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.00715740531545755,
    semiMajorAxisRate: -1.2741482097351764e-7,
    eccentricity: 0.001384943898452968,
    eccentricityRate: -0.00015438163298890618,
    inclination: 2.214130331143583,
    inclinationRate: -0.27683282954118815,
    meanLongitude: 914.8717767515656,
    meanLongitudeRate: 1836907.282456154,
    longitudeOfPeriapsis: 654.4007099402094,
    longitudeOfPeriapsisRate: -185.3687091363738,
    longitudeOfAscendingNode: 343.1729450213451,
    longitudeOfAscendingNodeRate: -5.832073260542245,
  },
};

export const callisto: AstronomicalObject = {
  id: "callisto",
  type: "moon",
  parent: jupiter,
  diameter: 4820.6,
  sprite: "sprites/callisto.png",
  photo: {
    url: "photos/callisto.png",
    attribution: {
      creator: "NASA/JPL/DLR(German Aerospace Center)",
      licenseName: "Public domain",
    },
  },
  color: "#8A9B8A",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.01258352077014205,
    semiMajorAxisRate: 0.0000070359432572594804,
    eccentricity: 0.007346727058787971,
    eccentricityRate: -0.00033256705366318737,
    inclination: 2.016916477462703,
    inclinationRate: -0.19445637903393376,
    meanLongitude: 428.41083849559135,
    meanLongitudeRate: 787975.5743564531,
    longitudeOfPeriapsis: 352.9490047316904,
    longitudeOfPeriapsisRate: 64.43107068298269,
    longitudeOfAscendingNode: 337.9430831023029,
    longitudeOfAscendingNodeRate: -3.1966557574745025,
  },
};

// Saturn
// --------------------------------------------------------

export const saturn: AstronomicalObject = {
  id: "saturn",
  type: "planet",
  parent: sun,
  diameter: 116464,
  sprite: "sprites/saturn.png",
  photo: {
    url: "photos/saturn.png",
    attribution: {
      creator: "NASA / JPL / Space Science Institute",
      licenseName: "Public domain",
    },
  },
  color: "#DFBC7C",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 9.54149883,
    semiMajorAxisRate: -0.00003065,
    eccentricity: 0.05550825,
    eccentricityRate: -0.00032044,
    inclination: 2.49424102,
    inclinationRate: 0.00451969,
    meanLongitude: 50.07571329,
    meanLongitudeRate: 1222.11494724,
    longitudeOfPeriapsis: 92.86136063,
    longitudeOfPeriapsisRate: 0.54179478,
    longitudeOfAscendingNode: 113.63998702,
    longitudeOfAscendingNodeRate: -0.25015002,
    b: 0.00025899,
    c: -0.13434469,
    s: 0.87320147,
    f: 38.35125,
  },
};
export const mimas: AstronomicalObject = {
  id: "mimas",
  type: "moon",
  parent: saturn,
  diameter: 396.4,
  sprite: "sprites/mimas.png",
  photo: {
    url: "photos/mimas.png",
    attribution: {
      creator: "NASA / JPL-Caltech / Space Science Institute",
      licenseName: "Public domain",
    },
  },
  color: "#A9A9A9",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.001243370280103714,
    semiMajorAxisRate: -1.618636910703103e-8,
    eccentricity: 0.01760778936130747,
    eccentricityRate: 0.00048499772589280163,
    inclination: 26.99187083574384,
    inclinationRate: 2.6018354940351394,
    meanLongitude: 487.1708765629167,
    meanLongitudeRate: 13881490.450897705,
    longitudeOfPeriapsis: 271.1207983040349,
    longitudeOfPeriapsisRate: 208.73699818917316,
    longitudeOfAscendingNode: 172.038418328353,
    longitudeOfAscendingNodeRate: -3.227900141006103,
  },
};
export const enceladus: AstronomicalObject = {
  id: "enceladus",
  type: "moon",
  parent: saturn,
  diameter: 504.2,
  sprite: "sprites/enceladus.png",
  photo: {
    url: "photos/enceladus.png",
    attribution: {
      creator: "NASA / JPL",
      licenseName: "Public domain",
    },
  },
  color: "#FFFFFF",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.001593657972219693,
    semiMajorAxisRate: 1.4715581988849688e-8,
    eccentricity: 0.004131700455813154,
    eccentricityRate: 0.00047765442430032067,
    inclination: 28.05206499221688,
    inclinationRate: -0.010523990988389187,
    meanLongitude: 540.5760975350925,
    meanLongitudeRate: 9566303.82055729,
    longitudeOfPeriapsis: 284.0315456206472,
    longitudeOfPeriapsisRate: 103.38679838118696,
    longitudeOfAscendingNode: 169.5066654229833,
    longitudeOfAscendingNodeRate: -0.0000768346245081375,
  },
};
export const tethys: AstronomicalObject = {
  id: "tethys",
  type: "moon",
  parent: saturn,
  diameter: 1062,
  sprite: "sprites/tethys.png",
  photo: {
    url: "photos/tethys.png",
    attribution: {
      creator: "NASA/JPL-Caltech/Space Science Institute",
      licenseName: "Public domain",
    },
  },
  color: "#CAC9C7",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.001971788601147789,
    semiMajorAxisRate: 1.286169052901534e-8,
    eccentricity: 0.0008448086607326789,
    eccentricityRate: 0.000257827864978399,
    inclination: 27.2219037928291,
    inclinationRate: -0.2295983931944896,
    meanLongitude: 221.09289282260085,
    meanLongitudeRate: 6950987.641264667,
    longitudeOfPeriapsis: 215.78366167188864,
    longitudeOfPeriapsisRate: -37.91571570241081,
    longitudeOfAscendingNode: 167.9925555751118,
    longitudeOfAscendingNodeRate: 0.955049035794616,
  },
};
export const dione: AstronomicalObject = {
  id: "dione",
  type: "moon",
  parent: saturn,
  diameter: 1122.8,
  sprite: "sprites/dione.png",
  photo: {
    url: "photos/dione.png",
    attribution: {
      creator: "NASA",
      licenseName: "Public domain",
    },
  },
  color: "#CAC9C7",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.002524410457917032,
    semiMajorAxisRate: 6.045127552397125e-8,
    eccentricity: 0.002334335089067216,
    eccentricityRate: -0.0009478002665748602,
    inclination: 28.04146894686649,
    inclinationRate: 0.028043899808928074,
    meanLongitude: 600.6919112323524,
    meanLongitudeRate: 4798409.082312997,
    longitudeOfPeriapsis: 326.2824701603978,
    longitudeOfPeriapsisRate: -141.60497837384204,
    longitudeOfAscendingNode: 169.4701673412187,
    longitudeOfAscendingNodeRate: 0.09220398712747624,
  },
};
export const rhea: AstronomicalObject = {
  id: "rhea",
  type: "moon",
  parent: saturn,
  diameter: 1527.6,
  sprite: "sprites/rhea.png",
  photo: {
    url: "photos/rhea.png",
    attribution: {
      creator: "NASA/JPL/Space Science Institute",
      licenseName: "Public domain",
    },
  },
  color: "#CAC9C7",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.003524538018215857,
    semiMajorAxisRate: -2.3830705515306624e-7,
    eccentricity: 0.0007278372192779856,
    eccentricityRate: -0.00008608127297616739,
    inclination: 28.24147688381066,
    inclinationRate: 0.07421450735742141,
    meanLongitude: 501.8265103901099,
    meanLongitudeRate: 2908602.612207992,
    longitudeOfPeriapsis: 349.6602683154281,
    longitudeOfPeriapsisRate: 28.717497601466334,
    longitudeOfAscendingNode: 168.984145124407,
    longitudeOfAscendingNodeRate: 0.7833766891293976,
  },
};
export const titan: AstronomicalObject = {
  id: "titan",
  type: "moon",
  parent: saturn,
  diameter: 5149.5,
  sprite: "sprites/titan.png",
  photo: {
    url: "photos/titan.png",
    attribution: {
      creator: "NASA",
      licenseName: "Public domain",
    },
  },
  color: "#CAC9C7",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.008168249007016033,
    semiMajorAxisRate: -4.570250696812883e-8,
    eccentricity: 0.02859115464814493,
    eccentricityRate: 0.00031445024053905826,
    inclination: 27.71834457100986,
    inclinationRate: -0.1639766357840422,
    meanLongitude: 485.796156693232,
    meanLongitudeRate: 824507.7583136847,
    longitudeOfPeriapsis: 333.6800090895506,
    longitudeOfPeriapsisRate: 51.409766858310945,
    longitudeOfAscendingNode: 169.2391482326885,
    longitudeOfAscendingNodeRate: -0.4768469927020931,
  },
};
export const hyperion: AstronomicalObject = {
  id: "hyperion",
  type: "moon",
  parent: saturn,
  diameter: 270,
  sprite: "sprites/hyperion.png",
  photo: {
    url: "photos/hyperion.png",
    attribution: {
      creator: "NASA / JPL / SSI / Gordan Ugarkovic",
      licenseName: "Public domain",
    },
  },
  color: "#CAC9C7",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.009927226066749782,
    semiMajorAxisRate: 0.000004451339793976744,
    eccentricity: 0.1267862392220397,
    eccentricityRate: -0.01891828173229408,
    inclination: 27.20915472891182,
    inclinationRate: 0.8257415296635386,
    meanLongitude: 419.17244774553444,
    meanLongitudeRate: 615311.3726280382,
    longitudeOfPeriapsis: 356.9970037696197,
    longitudeOfPeriapsisRate: -49.58872663538352,
    longitudeOfAscendingNode: 168.304780343334,
    longitudeOfAscendingNodeRate: 0.015664574693516897,
  },
};
export const iapetus: AstronomicalObject = {
  id: "iapetus",
  type: "moon",
  parent: saturn,
  diameter: 1469,
  sprite: "sprites/iapetus.png",
  photo: {
    url: "photos/iapetus.png",
    attribution: {
      creator: "NASA/JPL/Space Science Institute",
      licenseName: "Public domain",
    },
  },
  color: "#CAC9C7",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.02381116859149325,
    semiMajorAxisRate: 0.000021338930020247532,
    eccentricity: 0.02797192702416067,
    eccentricityRate: 0.0022584986843565587,
    inclination: 17.23800848729772,
    inclinationRate: -1.1116430683865381,
    meanLongitude: 575.0974571563327,
    meanLongitudeRate: 165640.46184634432,
    longitudeOfPeriapsis: 369.51597699960564,
    longitudeOfPeriapsisRate: 7.881989324271331,
    longitudeOfAscendingNode: 139.6890499714332,
    longitudeOfAscendingNodeRate: -3.3899773006264127,
  },
};
export const phoebe: AstronomicalObject = {
  id: "phoebe",
  type: "moon",
  parent: saturn,
  diameter: 213,
  sprite: "sprites/phoebe.png",
  photo: {
    url: "photos/phoebe.png",
    attribution: {
      creator: "NASA/JPL/Space Science Institute",
      licenseName: "Public domain",
    },
  },
  color: "#CAC9C7",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 0.08654795907191702,
    semiMajorAxisRate: -0.00020756741740994566,
    eccentricity: 0.1655499593364438,
    eccentricityRate: -0.0022750208038138098,
    inclination: 173.2594812899735,
    inclinationRate: -0.585597023752598,
    meanLongitude: 675.2799028569362,
    meanLongitudeRate: -23902.953384216242,
    longitudeOfPeriapsis: 617.0376001114878,
    longitudeOfPeriapsisRate: -269.64712837146766,
    longitudeOfAscendingNode: 263.2170592637282,
    longitudeOfAscendingNodeRate: 31.43512482434585,
  },
};

// Uranus
// --------------------------------------------------------

export const uranus: AstronomicalObject = {
  id: "uranus",
  type: "planet",
  parent: sun,
  diameter: 50724,
  sprite: "sprites/uranus.png",
  photo: {
    url: "photos/uranus.png",
    attribution: {
      creator: "NASA/JPL-Caltech",
      licenseName: "Public domain",
    },
  },
  color: "#B6DCDF",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 19.18797948,
    semiMajorAxisRate: -0.00020455,
    eccentricity: 0.0468574,
    eccentricityRate: -0.0000155,
    inclination: 0.77298127,
    inclinationRate: -0.00180155,
    meanLongitude: 314.20276625,
    meanLongitudeRate: 428.49512595,
    longitudeOfPeriapsis: 172.43404441,
    longitudeOfPeriapsisRate: 0.09266985,
    longitudeOfAscendingNode: 73.96250215,
    longitudeOfAscendingNodeRate: 0.05739699,
    b: 0.00058331,
    c: -0.97731848,
    s: 0.17689245,
    f: 7.67025,
  },
};

// Neptune
// --------------------------------------------------------

export const neptune: AstronomicalObject = {
  id: "neptune",
  type: "planet",
  parent: sun,
  diameter: 49244,
  sprite: "sprites/neptune.png",
  photo: {
    url: "photos/neptune.png",
    attribution: {
      creator: "Justin Cowart",
      licenseName: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    },
  },
  color: "#4264FB",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 30.06952752,
    semiMajorAxisRate: 0.00006447,
    eccentricity: 0.00895439,
    eccentricityRate: 0.00000818,
    inclination: 1.7700552,
    inclinationRate: 0.000224,
    meanLongitude: 304.22289287,
    meanLongitudeRate: 218.46515314,
    longitudeOfPeriapsis: 46.68158724,
    longitudeOfPeriapsisRate: 0.01009938,
    longitudeOfAscendingNode: 131.78635853,
    longitudeOfAscendingNodeRate: -0.00606302,
    b: -0.00041348,
    c: 0.68346318,
    s: -0.10162547,
    f: 7.67025,
  },
};

// Pluto
// --------------------------------------------------------

export const pluto: AstronomicalObject = {
  id: "pluto",
  type: "dwarf",
  parent: sun,
  diameter: 1188.3,
  sprite: "sprites/pluto.png",
  photo: {
    url: "photos/pluto.png",
    attribution: {
      creator:
        "NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute/Alex Parker",
      licenseName: "Public domain",
    },
  },
  color: "#CAC1B0",
  orbit: {
    epoch: j2000Epoch,
    semiMajorAxis: 39.48686035,
    semiMajorAxisRate: 0.00449751,
    eccentricity: 0.24885238,
    eccentricityRate: 0.00006016,
    inclination: 17.1410426,
    inclinationRate: 0.00000501,
    meanLongitude: 238.96535011,
    meanLongitudeRate: 145.18042903,
    longitudeOfPeriapsis: 224.09702598,
    longitudeOfPeriapsisRate: -0.00968827,
    longitudeOfAscendingNode: 110.30167986,
    longitudeOfAscendingNodeRate: -0.00809981,
    b: -0.01262724,
  },
};

const solarSystem = [
  sun,
  mercury,
  venus,
  earth,
  moon,
  mars,
  phobos,
  deimos,
  jupiter,
  io,
  europa,
  ganymede,
  callisto,
  saturn,
  mimas,
  enceladus,
  tethys,
  dione,
  rhea,
  titan,
  hyperion,
  iapetus,
  phoebe,
  uranus,
  neptune,
  pluto,
];
export default solarSystem;
