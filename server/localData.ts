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
