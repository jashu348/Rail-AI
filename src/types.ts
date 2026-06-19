/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StationStatus {
  stationName: string;
  stationCode: string;
  expectedArrival: string; // e.g. "14:30"
  expectedDeparture: string;
  actualArrival: string;
  actualDeparture: string;
  haltTime: number; // in minutes
  delay: number; // in minutes
  status: 'passed' | 'current' | 'upcoming';
  platform?: string;
  distanceKm: number;
}

export interface LiveTrainStatus {
  trainName: string;
  trainNumber: string;
  currentStation: string;
  nextStation: string;
  delayMinutes: number;
  lastUpdated: string;
  statusMessage: string;
  routeProgressPercent: number;
  stations: StationStatus[];
}

export interface ScheduleStation {
  stopNo: number;
  stationName: string;
  stationCode: string;
  arrivalTime: string;
  departureTime: string;
  haltTimeMins: number;
  distanceKm: number;
  dayNo: number;
  platform?: string;
}

export interface TrainSchedule {
  trainName: string;
  trainNumber: string;
  runsOn: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  classes: string[]; // e.g. ["1A", "2A", "3A", "SL"]
  fromStation: string;
  toStation: string;
  duration: string; // e.g. "4h 30m"
  stations: ScheduleStation[];
}

export interface TrainBetweenStations {
  trainName: string;
  trainNumber: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string[]; // e.g., ["M", "W", "F"]
  classes: string[];
}

export interface PassengerPNR {
  number: number;
  bookingStatus: string; // e.g., "W/L 12" or "CNF"
  currentStatus: string; // e.g., "CNF" or "RAC 3"
  coach?: string; // e.g. "B1"
  berthNumber?: number;
  berthType?: string; // e.g., "Lower", "Side Upper"
}

export interface PNRStatus {
  pnr: string;
  trainName: string;
  trainNumber: string;
  journeyDate: string;
  fromStation: string;
  toStation: string;
  boardingPoint: string;
  reservedUpto: string;
  travelClass: string;
  quota: string;
  chartStatus: 'Prepared' | 'Not Prepared';
  passengers: PassengerPNR[];
  platform?: string;
  totalFare: number;
}
