/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LiveTrainStatus, TrainSchedule, TrainBetweenStations, PNRStatus } from "../src/types";

// Famous trains matching Indian Railways
export const MOCK_TRAINS = {
  "12002": {
    trainName: "NDLS - RKMP Shatabdi Express",
    trainNumber: "12002",
    runsOn: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true },
    classes: ["CC", "EC"],
    fromStation: "New Delhi (NDLS)",
    toStation: "Rani Kamalapati (RKMP)",
    duration: "8h 30m"
  },
  "12952": {
    trainName: "Mumbai Rajdhani Express",
    trainNumber: "12952",
    runsOn: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true },
    classes: ["1A", "2A", "3A"],
    fromStation: "New Delhi (NDLS)",
    toStation: "Mumbai Central (MMCT)",
    duration: "15h 50m"
  },
  "22436": {
    trainName: "Vande Bharat Express",
    trainNumber: "22436",
    runsOn: { mon: true, tue: true, wed: false, thu: true, fri: true, sat: true, sun: true },
    classes: ["CC", "EC"],
    fromStation: "New Delhi (NDLS)",
    toStation: "Varanasi Jn (BSBS)",
    duration: "8h 00m"
  }
};

export function getLocalLiveStatus(trainNumber: string): LiveTrainStatus | null {
  const cleanNum = trainNumber.trim();
  if (cleanNum === "12002") {
    return {
      trainName: "NDLS - RKMP Shatabdi Express",
      trainNumber: "12002",
      currentStation: "Jhansi Jn (VGLJ)",
      nextStation: "Lalitpur Jn (LAR)",
      delayMinutes: 12,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + " (Just now)",
      statusMessage: "Departed Jhansi Jn 12 mins behind schedule. Heading to Lalitpur.",
      routeProgressPercent: 65,
      stations: [
        { stationName: "New Delhi", stationCode: "NDLS", expectedArrival: "Source", expectedDeparture: "06:00", actualArrival: "Source", actualDeparture: "06:00", haltTime: 0, delay: 0, status: "passed", platform: "1", distanceKm: 0 },
        { stationName: "Mathura Jn", stationCode: "MTJ", expectedArrival: "07:19", expectedDeparture: "07:20", actualArrival: "07:19", actualDeparture: "07:20", haltTime: 1, delay: 0, status: "passed", platform: "1", distanceKm: 141 },
        { stationName: "Agra Cantt", stationCode: "AGC", expectedArrival: "07:50", expectedDeparture: "07:55", actualArrival: "07:52", actualDeparture: "07:57", haltTime: 5, delay: 2, status: "passed", platform: "1", distanceKm: 195 },
        { stationName: "Gwalior Jn", stationCode: "GWL", expectedArrival: "09:23", expectedDeparture: "09:28", actualArrival: "09:28", actualDeparture: "09:32", haltTime: 5, delay: 5, status: "passed", platform: "2", distanceKm: 313 },
        { stationName: "Jhansi Jn", stationCode: "VGLJ", expectedArrival: "10:43", expectedDeparture: "10:51", actualArrival: "10:55", actualDeparture: "11:03", haltTime: 8, delay: 12, status: "passed", platform: "3", distanceKm: 411 },
        { stationName: "Lalitpur Jn", stationCode: "LAR", expectedArrival: "11:42", expectedDeparture: "11:43", actualArrival: "11:55", actualDeparture: "11:56", haltTime: 1, delay: 13, status: "upcoming", platform: "2", distanceKm: 501 },
        { stationName: "Bhopal Jn", stationCode: "BPL", expectedArrival: "14:07", expectedDeparture: "14:10", actualArrival: "14:20", actualDeparture: "14:23", haltTime: 3, delay: 13, status: "upcoming", platform: "1", distanceKm: 701 },
        { stationName: "Rani Kamalapati", stationCode: "RKMP", expectedArrival: "14:40", expectedDeparture: "Destination", actualArrival: "14:50", actualDeparture: "Destination", haltTime: 0, delay: 10, status: "upcoming", platform: "1", distanceKm: 707 }
      ]
    };
  } else if (cleanNum === "12952") {
    return {
      trainName: "Mumbai Rajdhani Express",
      trainNumber: "12952",
      currentStation: "Kota Jn (KOTA)",
      nextStation: "Ratlam Jn (RTM)",
      delayMinutes: 0,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + " (Just now)",
      statusMessage: "On time. Approaching Ratlam division.",
      routeProgressPercent: 45,
      stations: [
        { stationName: "New Delhi", stationCode: "NDLS", expectedArrival: "Source", expectedDeparture: "16:55", actualArrival: "Source", actualDeparture: "16:55", haltTime: 0, delay: 0, status: "passed", platform: "3", distanceKm: 0 },
        { stationName: "Kota Jn", stationCode: "KOTA", expectedArrival: "21:30", expectedDeparture: "21:40", actualArrival: "21:30", actualDeparture: "21:40", haltTime: 10, delay: 0, status: "passed", platform: "1", distanceKm: 466 },
        { stationName: "Ratlam Jn", stationCode: "RTM", expectedArrival: "00:42", expectedDeparture: "00:45", actualArrival: "00:42", actualDeparture: "00:45", haltTime: 3, delay: 0, status: "upcoming", platform: "4", distanceKm: 732 },
        { stationName: "Vadodara Jn", stationCode: "BRC", expectedArrival: "03:40", expectedDeparture: "03:50", actualArrival: "03:40", actualDeparture: "03:50", haltTime: 10, delay: 0, status: "upcoming", platform: "2", distanceKm: 993 },
        { stationName: "Surat", stationCode: "ST", expectedArrival: "05:13", expectedDeparture: "05:18", actualArrival: "05:13", actualDeparture: "05:18", haltTime: 5, delay: 0, status: "upcoming", platform: "1", distanceKm: 1123 },
        { stationName: "Borivali", stationCode: "BVI", expectedArrival: "07:40", expectedDeparture: "07:42", actualArrival: "07:40", actualDeparture: "07:42", haltTime: 2, delay: 0, status: "upcoming", platform: "7", distanceKm: 1360 },
        { stationName: "Mumbai Central", stationCode: "MMCT", expectedArrival: "08:35", expectedDeparture: "Destination", actualArrival: "08:35", actualDeparture: "Destination", haltTime: 0, delay: 0, status: "upcoming", platform: "5", distanceKm: 1390 }
      ]
    };
  } else if (cleanNum === "22436") {
    return {
      trainName: "Vande Bharat Express",
      trainNumber: "22436",
      currentStation: "Prayagraj Jn (PRYJ)",
      nextStation: "Varanasi Jn (BSBS)",
      delayMinutes: 5,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + " (Just now)",
      statusMessage: "Departed Prayagraj Jn 5 mins late. Running smoothly at 130 km/h.",
      routeProgressPercent: 88,
      stations: [
        { stationName: "New Delhi", stationCode: "NDLS", expectedArrival: "Source", expectedDeparture: "06:00", actualArrival: "Source", actualDeparture: "06:00", haltTime: 0, delay: 0, status: "passed", platform: "11", distanceKm: 0 },
        { stationName: "Kanpur Central", stationCode: "CNB", expectedArrival: "10:08", expectedDeparture: "10:10", actualArrival: "10:10", actualDeparture: "10:12", haltTime: 2, delay: 2, status: "passed", platform: "9", distanceKm: 440 },
        { stationName: "Prayagraj Jn", stationCode: "PRYJ", expectedArrival: "12:08", expectedDeparture: "12:10", actualArrival: "12:12", actualDeparture: "12:15", haltTime: 2, delay: 5, status: "passed", platform: "6", distanceKm: 635 },
        { stationName: "Varanasi Jn", stationCode: "BSBS", expectedArrival: "14:00", expectedDeparture: "Destination", actualArrival: "14:05", actualDeparture: "Destination", haltTime: 0, delay: 5, status: "upcoming", platform: "1", distanceKm: 755 }
      ]
    };
  }
  return null;
}

export function getDeterministicLiveStatus(trainNumber: string): LiveTrainStatus {
  const cleanNum = trainNumber.trim();
  
  // Fallback if it is empty
  if (!cleanNum) {
    return {
      trainName: "Indian Railways Express",
      trainNumber: "00000",
      currentStation: "New Delhi (NDLS)",
      nextStation: "Mathura Jn (MTJ)",
      delayMinutes: 0,
      lastUpdated: "Just now",
      statusMessage: "Train initialized.",
      routeProgressPercent: 0,
      stations: []
    };
  }

  // Hash function to get a consistent number (seed) from train number string
  let hash = 0;
  for (let i = 0; i < cleanNum.length; i++) {
    hash = cleanNum.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  // Train Types based on train number
  const trainTypes = [
    "Express", "Superfast", "Mail Express", "Humsafar Express", 
    "Duronto Express", "Jan Shatabdi", "Garib Rath", "Double Decker",
    "SF Express", "Special Fare Special"
  ];
  const type = trainTypes[absHash % trainTypes.length];

  // Pick realistic stations
  const majorStations = [
    { code: "NDLS", name: "New Delhi" },
    { code: "MMCT", name: "Mumbai Central" },
    { code: "HWH", name: "Howrah Jn" },
    { code: "MAS", name: "MGR Chennai Central" },
    { code: "SBC", name: "KSR Bengaluru City" },
    { code: "PNBE", name: "Patna Jn" },
    { code: "ADI", name: "Ahmedabad Jn" },
    { code: "HYB", name: "Hyderabad Deccan" },
    { code: "CNB", name: "Kanpur Central" },
    { code: "BSBS", name: "Varanasi Jn" },
    { code: "KOTA", name: "Kota Jn" },
    { code: "RTM", name: "Ratlam Jn" },
    { code: "GWL", name: "Gwalior Jn" },
    { code: "VGLJ", name: "Jhansi Jn" },
    { code: "BPL", name: "Bhopal Jn" },
    { code: "AGC", name: "Agra Cantt" },
    { code: "MTJ", name: "Mathura Jn" },
    { code: "LKO", name: "Lucknow Charbagh" },
    { code: "DDU", name: "Pt. Deen Dayal Upadhyaya Jn" },
    { code: "GKP", name: "Gorakhpur Jn" }
  ];

  // Select source, destination and route based on hash
  const sourceIndex = absHash % majorStations.length;
  let destIndex = (absHash + 3) % majorStations.length;
  if (sourceIndex === destIndex) {
    destIndex = (destIndex + 1) % majorStations.length;
  }
  const source = majorStations[sourceIndex];
  const dest = majorStations[destIndex];

  // Train name
  const trainNames = [
    `${source.name.split(' ')[0]} - ${dest.name.split(' ')[0]} ${type}`,
    `${dest.name.split(' ')[0]} Bound ${type}`,
    `${source.name.split(' ')[0]} Tri-weekly ${type}`,
    `Bharat Spark ${type}`
  ];
  const trainName = trainNames[absHash % trainNames.length];

  // Pick intermediate stations (3 to 6)
  const routeStations: typeof majorStations = [source];
  const numIntermediates = 3 + (absHash % 4); // 3 to 6 intermediaters
  for (let i = 1; i <= numIntermediates; i++) {
    const interIdx = (sourceIndex + i * 2) % majorStations.length;
    if (interIdx !== sourceIndex && interIdx !== destIndex) {
      if (!routeStations.some(s => s.code === majorStations[interIdx].code)) {
        routeStations.push(majorStations[interIdx]);
      }
    }
  }
  routeStations.push(dest);

  // Status and delays
  const baseDelay = absHash % 5 === 0 ? 0 : (absHash % 35); // delays of 0, 5, 10, etc.
  const currentStationIdx = Math.max(1, absHash % (routeStations.length - 1));
  const currentSta = routeStations[currentStationIdx];
  const nextSta = routeStations[Math.min(routeStations.length - 1, currentStationIdx + 1)];
  const routeProgressPercent = Math.round((currentStationIdx / (routeStations.length - 1)) * 100);

  // Generate station-by-station operational log
  const stationsList = routeStations.map((sta, idx) => {
    const isSource = idx === 0;
    const isDest = idx === routeStations.length - 1;

    let expectedArr = "Source";
    let expectedDep = "Destination";

    // Set mock times based on station index
    if (!isSource) {
      const hour = (6 + idx * 3) % 24;
      const min = (15 + idx * 7) % 60;
      expectedArr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }
    if (!isDest) {
      const hour = (6 + idx * 3) % 24;
      const min = (25 + idx * 7) % 60;
      expectedDep = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }

    const delay = idx <= currentStationIdx ? baseDelay : Math.max(0, baseDelay + (idx - currentStationIdx) * 2);
    
    let status: 'passed' | 'current' | 'upcoming' = 'upcoming';
    if (idx < currentStationIdx) {
      status = 'passed';
    } else if (idx === currentStationIdx) {
      status = 'current';
    }

    // platform
    const platform = String(1 + ((absHash + idx) % 8));

    return {
      stationName: sta.name,
      stationCode: sta.code,
      expectedArrival: expectedArr,
      expectedDeparture: expectedDep,
      actualArrival: expectedArr === "Source" ? "Source" : addMinutes(expectedArr, delay),
      actualDeparture: expectedDep === "Destination" ? "Destination" : addMinutes(expectedDep, delay),
      haltTime: isSource || isDest ? 0 : (2 + (absHash % 8)),
      delay: delay,
      status: status,
      platform: platform,
      distanceKm: idx * 115 + (absHash % 30)
    };
  });

  return {
    trainName: trainName,
    trainNumber: cleanNum,
    currentStation: `${currentSta.name} (${currentSta.code})`,
    nextStation: `${nextSta.name} (${nextSta.code})`,
    delayMinutes: baseDelay,
    lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + " (Live Auto Sync)",
    statusMessage: baseDelay > 0 
      ? `Departed ${currentSta.name} ${baseDelay} mins late. Reaching ${nextSta.name} shortly.`
      : `Running perfectly on schedule. Currently at ${currentSta.name}.`,
    routeProgressPercent: routeProgressPercent,
    stations: stationsList
  };
}

export function getDeterministicSchedule(trainNumber: string): TrainSchedule {
  const status = getDeterministicLiveStatus(trainNumber);
  
  return {
    trainName: status.trainName,
    trainNumber: status.trainNumber,
    runsOn: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true },
    classes: ["1A", "2A", "3A", "SL"],
    fromStation: status.stations[0]?.stationName || "Source",
    toStation: status.stations[status.stations.length - 1]?.stationName || "Destination",
    duration: `${Math.round(status.stations.length * 2.2)}h 15m`,
    stations: status.stations.map((sta, idx) => ({
      stopNo: idx + 1,
      stationName: sta.stationName,
      stationCode: sta.stationCode,
      arrivalTime: sta.expectedArrival,
      departureTime: sta.expectedDeparture,
      haltTimeMins: sta.haltTime,
      distanceKm: sta.distanceKm,
      dayNo: 1 + Math.floor(idx / 5),
      platform: sta.platform
    }))
  };
}

function addMinutes(timeStr: string, mins: number): string {
  if (!timeStr || timeStr === "Source" || timeStr === "Destination") return timeStr;
  const parts = timeStr.split(":");
  if (parts.length !== 2) return timeStr;
  let hr = parseInt(parts[0], 10);
  let mn = parseInt(parts[1], 10) + mins;
  hr = (hr + Math.floor(mn / 60)) % 24;
  mn = mn % 60;
  return `${String(hr).padStart(2, '0')}:${String(mn).padStart(2, '0')}`;
}

export function getLocalSchedule(trainNumber: string): TrainSchedule | null {
  const cleanNum = trainNumber.trim();
  if (cleanNum === "12002") {
    return {
      trainName: "NDLS - RKMP Shatabdi Express",
      trainNumber: "12002",
      runsOn: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true },
      classes: ["CC", "EC"],
      fromStation: "New Delhi (NDLS)",
      toStation: "Rani Kamalapati (RKMP)",
      duration: "8h 30m",
      stations: [
        { stopNo: 1, stationName: "New Delhi", stationCode: "NDLS", arrivalTime: "Source", departureTime: "06:00", haltTimeMins: 0, distanceKm: 0, dayNo: 1, platform: "1" },
        { stopNo: 2, stationName: "Mathura Jn", stationCode: "MTJ", arrivalTime: "07:19", departureTime: "07:20", haltTimeMins: 1, distanceKm: 141, dayNo: 1, platform: "1" },
        { stopNo: 3, stationName: "Agra Cantt", stationCode: "AGC", arrivalTime: "07:50", departureTime: "07:55", haltTimeMins: 5, distanceKm: 195, dayNo: 1, platform: "1" },
        { stopNo: 4, stationName: "Morena", stationCode: "MRA", arrivalTime: "08:39", departureTime: "08:40", haltTimeMins: 1, distanceKm: 275, dayNo: 1, platform: "1" },
        { stopNo: 5, stationName: "Gwalior Jn", stationCode: "GWL", arrivalTime: "09:23", departureTime: "09:28", haltTimeMins: 5, distanceKm: 313, dayNo: 1, platform: "2" },
        { stopNo: 6, stationName: "Jhansi Jn", stationCode: "VGLJ", arrivalTime: "10:43", departureTime: "10:51", haltTimeMins: 8, distanceKm: 411, dayNo: 1, platform: "3" },
        { stopNo: 7, stationName: "Lalitpur Jn", stationCode: "LAR", arrivalTime: "11:42", departureTime: "11:43", haltTimeMins: 1, distanceKm: 501, dayNo: 1, platform: "2" },
        { stopNo: 8, stationName: "Bina Jn", stationCode: "BINA", arrivalTime: "12:40", departureTime: "12:42", haltTimeMins: 2, distanceKm: 564, dayNo: 1, platform: "3" },
        { stopNo: 9, stationName: "Bhopal Jn", stationCode: "BPL", arrivalTime: "14:07", departureTime: "14:10", haltTimeMins: 3, distanceKm: 701, dayNo: 1, platform: "1" },
        { stopNo: 10, stationName: "Rani Kamalapati", stationCode: "RKMP", arrivalTime: "14:40", departureTime: "Destination", haltTimeMins: 0, distanceKm: 707, dayNo: 1, platform: "1" }
      ]
    };
  } else if (cleanNum === "12952") {
    return {
      trainName: "Mumbai Rajdhani Express",
      trainNumber: "12952",
      runsOn: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true },
      classes: ["1A", "2A", "3A"],
      fromStation: "New Delhi (NDLS)",
      toStation: "Mumbai Central (MMCT)",
      duration: "15h 50m",
      stations: [
        { stopNo: 1, stationName: "New Delhi", stationCode: "NDLS", arrivalTime: "Source", departureTime: "16:55", haltTimeMins: 0, distanceKm: 0, dayNo: 1, platform: "3" },
        { stopNo: 2, stationName: "Kota Jn", stationCode: "KOTA", arrivalTime: "21:30", departureTime: "21:40", haltTimeMins: 10, distanceKm: 466, dayNo: 1, platform: "1" },
        { stopNo: 3, stationName: "Ratlam Jn", stationCode: "RTM", arrivalTime: "00:42", departureTime: "00:45", haltTimeMins: 3, distanceKm: 732, dayNo: 2, platform: "4" },
        { stopNo: 4, stationName: "Vadodara Jn", stationCode: "BRC", arrivalTime: "03:40", departureTime: "03:50", haltTimeMins: 10, distanceKm: 993, dayNo: 2, platform: "2" },
        { stopNo: 5, stationName: "Surat", stationCode: "ST", arrivalTime: "05:13", departureTime: "05:18", haltTimeMins: 5, distanceKm: 1123, dayNo: 2, platform: "1" },
        { stopNo: 6, stationName: "Borivali", stationCode: "BVI", arrivalTime: "07:40", departureTime: "07:42", haltTimeMins: 2, distanceKm: 1360, dayNo: 2, platform: "7" },
        { stopNo: 7, stationName: "Mumbai Central", stationCode: "MMCT", arrivalTime: "08:35", departureTime: "Destination", haltTimeMins: 0, distanceKm: 1390, dayNo: 2, platform: "5" }
      ]
    };
  } else if (cleanNum === "22436") {
    return {
      trainName: "Vande Bharat Express",
      trainNumber: "22436",
      runsOn: { mon: true, tue: true, wed: false, thu: true, fri: true, sat: true, sun: true },
      classes: ["CC", "EC"],
      fromStation: "New Delhi (NDLS)",
      toStation: "Varanasi Jn (BSBS)",
      duration: "8h 00m",
      stations: [
        { stopNo: 1, stationName: "New Delhi", stationCode: "NDLS", arrivalTime: "Source", departureTime: "06:00", haltTimeMins: 0, distanceKm: 0, dayNo: 1, platform: "11" },
        { stopNo: 2, stationName: "Kanpur Central", stationCode: "CNB", arrivalTime: "10:08", departureTime: "10:10", haltTimeMins: 2, distanceKm: 440, dayNo: 1, platform: "9" },
        { stopNo: 3, stationName: "Prayagraj Jn", stationCode: "PRYJ", arrivalTime: "12:08", departureTime: "12:10", haltTimeMins: 2, distanceKm: 635, dayNo: 1, platform: "6" },
        { stopNo: 4, stationName: "Varanasi Jn", stationCode: "BSBS", arrivalTime: "14:00", departureTime: "Destination", haltTimeMins: 0, distanceKm: 755, dayNo: 1, platform: "1" }
      ]
    };
  }
  return null;
}

export function searchLocalBetweenStations(fromCode: string, toCode: string): TrainBetweenStations[] {
  const source = fromCode.trim().toUpperCase();
  const dest = toCode.trim().toUpperCase();

  const results: TrainBetweenStations[] = [];

  // Match NDLS -> MMCT / BCT
  if ((source === "NDLS" || source === "DELHI") && (dest === "MMCT" || dest === "BCT" || dest === "MUMBAI")) {
    results.push({
      trainName: "Mumbai Rajdhani Express",
      trainNumber: "12952",
      fromStation: "New Delhi (NDLS)",
      toStation: "Mumbai Central (MMCT)",
      departureTime: "16:55",
      arrivalTime: "08:35",
      duration: "15h 50m",
      runsOn: ["M", "T", "W", "T", "F", "S", "S"],
      classes: ["1A", "2A", "3A"]
    });
    results.push({
      trainName: "Paschim Express",
      trainNumber: "12926",
      fromStation: "New Delhi (NDLS)",
      toStation: "Bandra Terminus (BDTS)",
      departureTime: "16:35",
      arrivalTime: "14:55",
      duration: "22h 20m",
      runsOn: ["M", "T", "W", "T", "F", "S", "S"],
      classes: ["2A", "3A", "SL"]
    });
  }

  // Match NDLS -> PRYJ / BSBS / VARANASI
  if ((source === "NDLS" || source === "DELHI") && (dest === "BSBS" || dest === "PRYJ" || dest === "BSB" || dest === "VARANASI")) {
    results.push({
      trainName: "New Delhi - Varanasi Vande Bharat Express",
      trainNumber: "22436",
      fromStation: "New Delhi (NDLS)",
      toStation: "Varanasi Jn (BSBS)",
      departureTime: "06:00",
      arrivalTime: "14:00",
      duration: "8h 00m",
      runsOn: ["M", "T", "T", "F", "S", "S"],
      classes: ["CC", "EC"]
    });
    results.push({
      trainName: "Shiv Ganga Express",
      trainNumber: "12560",
      fromStation: "New Delhi (NDLS)",
      toStation: "Banaras (BSBS)",
      departureTime: "20:05",
      arrivalTime: "06:10",
      duration: "10h 05m",
      runsOn: ["M", "T", "W", "T", "F", "S", "S"],
      classes: ["1A", "2A", "3A", "SL"]
    });
  }

  return results;
}

export function getLocalPNR(pnr: string): PNRStatus | null {
  const cleanPnr = pnr.trim().replace(/-/g, "");
  if (cleanPnr === "9876543210" || cleanPnr === "1234567890" || cleanPnr.length === 10) {
    const isConfirmed = cleanPnr.endsWith("0") || cleanPnr.endsWith("5");
    return {
      pnr: cleanPnr,
      trainName: "Mumbai Rajdhani Express",
      trainNumber: "12952",
      journeyDate: "2026-06-25",
      fromStation: "New Delhi (NDLS)",
      toStation: "Mumbai Central (MMCT)",
      boardingPoint: "New Delhi (NDLS)",
      reservedUpto: "Mumbai Central (MMCT)",
      travelClass: "3A",
      quota: "GN (General)",
      chartStatus: isConfirmed ? "Prepared" : "Not Prepared",
      totalFare: 2155,
      platform: "3",
      passengers: [
        {
          number: 1,
          bookingStatus: isConfirmed ? "CNF" : "WL/14",
          currentStatus: isConfirmed ? "CNF (B1, Berth 35)" : "WL/2",
          coach: isConfirmed ? "B1" : undefined,
          berthNumber: isConfirmed ? 35 : undefined,
          berthType: isConfirmed ? "Lower" : undefined
        },
        {
          number: 2,
          bookingStatus: isConfirmed ? "CNF" : "WL/15",
          currentStatus: isConfirmed ? "CNF (B1, Berth 36)" : "WL/3",
          coach: isConfirmed ? "B1" : undefined,
          berthNumber: isConfirmed ? 36 : undefined,
          berthType: isConfirmed ? "Middle" : undefined
        }
      ]
    };
  }
  return null;
}
