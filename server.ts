/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { 
  getLocalLiveStatus, 
  getLocalSchedule, 
  searchLocalBetweenStations, 
  getLocalPNR 
} from "./server/localData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY" && API_KEY.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY provided. Running in high-fidelity offline mode.");
}

// 1. Live Train Status
app.get("/api/train/status", async (req, res) => {
  const trainNumber = String(req.query.trainNumber).trim();
  if (!trainNumber) {
    return res.status(400).json({ error: "Train number is required" });
  }

  // Check local offline database first
  const offlineStatus = getLocalLiveStatus(trainNumber);
  if (offlineStatus) {
    return res.json(offlineStatus);
  }

  // If local check failed and Gemini is not configured, send error/notice
  if (!ai) {
    return res.status(404).json({
      error: "Train not found in offline demo database.",
      requiresApiKey: true,
      message: "To search other Indian Railway trains, please set up your GEMINI_API_KEY in Settings > Secrets. You can instantly try demo trains: 12002, 12952, or 22436."
    });
  }

  try {
    const prompt = `
      You are an expert Indian Railways status engine. Return highly realistic live running status for train number: "${trainNumber}".
      Include correct train name if known, current station, next station, delay in minutes (numeric, can be 0 or dynamic Delay), last updated time (approx current local time is 2026-06-19), status message, and routeProgressPercent (0 to 100).
      
      Also generate a list of 5-10 stations along the route with expected and actual arrival/departure times, platform numbers, halt time in minutes, delay, distance in km, and statuses ('passed', 'current', 'upcoming'). Make sure one station is marked as 'current' or 'passed' and the rest corresponding to it.
      
      Response MUST be in strict JSON format matching this schema:
      {
        "trainName": "string (e.g. Paschim Express)",
        "trainNumber": "string",
        "currentStation": "string (name of the system's selected current station)",
        "nextStation": "string (name of next immediate station)",
        "delayMinutes": number,
        "lastUpdated": "string",
        "statusMessage": "string describing modern running status",
        "routeProgressPercent": number (0 to 100),
        "stations": [
          {
            "stationName": "string",
            "stationCode": "string (e.g. NDLS)",
            "expectedArrival": "string (e.g. 14:15 or 'Source')",
            "expectedDeparture": "string (e.g. 14:20 or 'Destination')",
            "actualArrival": "string",
            "actualDeparture": "string",
            "haltTime": number (e.g. 5),
            "delay": number,
            "status": "passed" | "current" | "upcoming",
            "platform": "string (e.g. 1)",
            "distanceKm": number
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const dataText = response.text;
    if (!dataText) {
      throw new Error("No response text from Gemini");
    }

    const cleanedJson = JSON.parse(dataText.trim());
    return res.json(cleanedJson);
  } catch (err: any) {
    console.error("Gemini Live Status generation error:", err);
    return res.status(500).json({ 
      error: "Failed to generate running status", 
      details: err.message,
      offlineFallbackAvailable: true 
    });
  }
});

// 2. Train Schedule
app.get("/api/train/schedule", async (req, res) => {
  const trainNumber = String(req.query.trainNumber).trim();
  if (!trainNumber) {
    return res.status(400).json({ error: "Train number or name is required" });
  }

  // Check offline schedules
  const offlineSchedule = getLocalSchedule(trainNumber);
  if (offlineSchedule) {
    return res.json(offlineSchedule);
  }

  if (!ai) {
    return res.status(404).json({
      error: "Train schedule not found offline.",
      requiresApiKey: true,
      message: "Please add your GEMINI_API_KEY in secrets to fetch other schedules dynamically, or try demo trains: 12002, 12952, or 22436."
    });
  }

  try {
    const prompt = `
      You are an expert Indian Railways timetable generator. Return the complete or major stations' timetable schedule for train number/name: "${trainNumber}".
      Include list of operating days (runsOn: e.g. mon: true...), class list (classes: ["1A", "2A", "3A", "SL"]), source/destination stations, total duration, and a list of stations on the route.
      
      Response MUST be in strict JSON matching this schema:
      {
        "trainName": "string",
        "trainNumber": "string",
        "runsOn": {
          "mon": boolean,
          "tue": boolean,
          "wed": boolean,
          "thu": boolean,
          "fri": boolean,
          "sat": boolean,
          "sun": boolean
        },
        "classes": ["string"],
        "fromStation": "string",
        "toStation": "string",
        "duration": "string",
        "stations": [
          {
            "stopNo": number,
            "stationName": "string",
            "stationCode": "string",
            "arrivalTime": "string (e.g. 05:20 or 'Source')",
            "departureTime": "string (e.g. 05:30 or 'Destination')",
            "haltTimeMins": number,
            "distanceKm": number,
            "dayNo": number,
            "platform": "string"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const dataText = response.text;
    if (!dataText) {
      throw new Error("Empty response from model");
    }

    const cleanedJson = JSON.parse(dataText.trim());
    return res.json(cleanedJson);
  } catch (err: any) {
    console.error("Gemini schedule generation error:", err);
    return res.status(500).json({ error: "Failed to fetch schedule", details: err.message });
  }
});

// 3. Train Between Stations
app.get("/api/train/search-between", async (req, res) => {
  const source = String(req.query.source).trim();
  const destination = String(req.query.destination).trim();

  if (!source || !destination) {
    return res.status(400).json({ error: "Source and destination are required" });
  }

  // Check offline
  const offlineResults = searchLocalBetweenStations(source, destination);
  if (offlineResults.length > 0) {
    return res.json(offlineResults);
  }

  if (!ai) {
    return res.status(404).json({
      error: "Routes not cached in offline mode.",
      requiresApiKey: true,
      message: "Please insert your GEMINI_API_KEY in Secrets panel to unlock open search across India, or try searching with Source: 'NDLS' and Destination: 'MMCT' or 'BSBS'."
    });
  }

  try {
    const prompt = `
      You are an expert Indian Railways route and connection provider. Find 2-4 realistic trains running between these stations: Source "${source}", Destination "${destination}".
      Generate train lists with actual names and numbers if possible, timings, travel duration, running days (e.g. ["M", "W", "F"]), and travel classes.
      
      Response MUST be in strict JSON matching this schema:
      [
        {
          "trainName": "string",
          "trainNumber": "string",
          "fromStation": "string",
          "toStation": "string",
          "departureTime": "string",
          "arrivalTime": "string",
          "duration": "string (e.g. 14h 20m)",
          "runsOn": ["string"],
          "classes": ["string"]
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const dataText = response.text;
    if (!dataText) {
      throw new Error("Empty response from AI");
    }

    const cleanedJson = JSON.parse(dataText.trim());
    return res.json(cleanedJson);
  } catch (err: any) {
    console.error("Gemini search between stations error:", err);
    return res.status(500).json({ error: "Failed to query trains", details: err.message });
  }
});

// 4. PNR Status Checker
app.get("/api/pnr/status", async (req, res) => {
  const pnr = String(req.query.pnr).trim();
  if (!pnr || pnr.length !== 10) {
    return res.status(400).json({ error: "Valid 10-digit PNR is required" });
  }

  // Check offline PNR dataset
  const offlinePNR = getLocalPNR(pnr);
  if (offlinePNR) {
    return res.json(offlinePNR);
  }

  if (!ai) {
    return res.status(404).json({
      error: "PNR search offline bounds hit.",
      requiresApiKey: true,
      message: "To search any dynamic PNR, please set your GEMINI_API_KEY in Secrets. You can query any random 10-digit number right now as a demo, and we will generate a high-fidelity mock PNR!"
    });
  }

  try {
    const prompt = `
      You are an Indian Railways PNR tracker. Generate a highly realistic detailed PNR booking status sheet for PNR: "${pnr}".
      Include train name, train number, travel date, boarding/to stations, travel class (e.g. 2A, 3A, SL), quota (GN, TQ), chart preparation status ('Prepared' or 'Not Prepared'), lists of passengers with booking status and current status, platform number, and total fare.
      
      Response MUST be in strict JSON matching this schema:
      {
        "pnr": "string (exactly 10 digits matches the requested)",
        "trainName": "string",
        "trainNumber": "string",
        "journeyDate": "string (YYYY-MM-DD)",
        "fromStation": "string",
        "toStation": "string",
        "boardingPoint": "string",
        "reservedUpto": "string",
        "travelClass": "string",
        "quota": "string",
        "chartStatus": "Prepared" | "Not Prepared",
        "passengers": [
          {
            "number": number,
            "bookingStatus": "string (e.g. W/L 34 or CNF)",
            "currentStatus": "string (e.g. W/L 4 or CNF/B2/Berth 12)",
            "coach": "string (optional)",
            "berthNumber": number (optional),
            "berthType": "string (optional e.g. Upper, Middle, Lower, Side Lower, Side Upper)"
          }
        ],
        "platform": "string",
        "totalFare": number
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const dataText = response.text;
    if (!dataText) {
      throw new Error("Unable to read model payload");
    }

    const cleanedJson = JSON.parse(dataText.trim());
    return res.json(cleanedJson);
  } catch (err: any) {
    console.error("Gemini PNR mock checker error:", err);
    return res.status(500).json({ error: "Failed to parse PNR details", details: err.message });
  }
});


// 5. Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite developer middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rail AI Fullstack server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
