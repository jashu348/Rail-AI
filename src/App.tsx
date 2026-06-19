/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Search, 
  Clock, 
  History, 
  Info, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRightLeft, 
  Calendar, 
  User, 
  Ticket, 
  HelpCircle, 
  Flame, 
  Navigation,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

import { 
  LiveTrainStatus, 
  TrainSchedule, 
  TrainBetweenStations, 
  PNRStatus 
} from './types';

export default function App() {
  const [activeTab, setActiveTab ] = useState<'status' | 'pnr' | 'schedule' | 'between'>('status');

  // Autocomplete Suggestion states
  const [showStatusSuggestions, setShowStatusSuggestions] = useState<boolean>(false);
  const [showScheduleSuggestions, setShowScheduleSuggestions] = useState<boolean>(false);

  // Popular Indian Railways trains for rapid search autocompletion
  const POPULAR_TRAINS = [
    { number: '12952', name: 'Mumbai Central Rajdhani Express' },
    { number: '12002', name: 'New Delhi Bhopal Shatabdi Express' },
    { number: '22436', name: 'New Delhi Varanasi Vande Bharat' },
    { number: '12049', name: 'Gatimaan Express (NDLS-AGRA)' },
    { number: '12925', name: 'Paschim Express (Bandra-Amritsar)' },
    { number: '12559', name: 'Shiv Ganga Express (NDLS-Banaras)' },
    { number: '12626', name: 'Kerala Express (NDLS-Trivandrum)' },
    { number: '12010', name: 'Ahmedabad Shatabdi Express' },
    { number: '12301', name: 'Howrah Rajdhani Express' },
    { number: '12860', name: 'Gitanjali Express (HWH-Mumbai)' },
    { number: '12213', name: 'Duronto Express (YPR-Delhi)' },
    { number: '22691', name: 'SBC Nizamuddin Rajdhani Exp' },
    { number: '12723', name: 'Telangana Express (HYB-NDLS)' }
  ];

  // Live Train Status state
  const [trainNumber, setTrainNumber] = useState<string>('12952');
  const [statusResult, setStatusResult] = useState<LiveTrainStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // PNR state
  const [pnrNumber, setPnrNumber] = useState<string>('9876543210');
  const [pnrResult, setPnrResult] = useState<PNRStatus | null>(null);
  const [pnrLoading, setPnrLoading] = useState<boolean>(false);
  const [pnrError, setPnrError] = useState<string | null>(null);
  const [pnrNotice, setPnrNotice] = useState<string | null>(null);

  // Train Schedule state
  const [scheduleNumber, setScheduleNumber] = useState<string>('12002');
  const [scheduleResult, setScheduleResult] = useState<TrainSchedule | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleNotice, setScheduleNotice] = useState<string | null>(null);

  // Train Between Stations state
  const [sourceCode, setSourceCode] = useState<string>('NDLS');
  const [destCode, setDestCode] = useState<string>('MMCT');
  const [betweenResult, setBetweenResult] = useState<TrainBetweenStations[] | null>(null);
  const [betweenLoading, setBetweenLoading] = useState<boolean>(false);
  const [betweenError, setBetweenError] = useState<string | null>(null);
  const [betweenNotice, setBetweenNotice] = useState<string | null>(null);

  // Filter lists based on inputs
  const autocompleteStatusTrains = trainNumber 
    ? POPULAR_TRAINS.filter(t => t.number.includes(trainNumber) || t.name.toLowerCase().includes(trainNumber.toLowerCase()))
    : POPULAR_TRAINS;

  const autocompleteScheduleTrains = scheduleNumber 
    ? POPULAR_TRAINS.filter(t => t.number.includes(scheduleNumber) || t.name.toLowerCase().includes(scheduleNumber.toLowerCase()))
    : POPULAR_TRAINS;

  // Demo presets for easy user exploration
  const PRESET_TRAINS = [
    { number: '12952', name: 'Mumbai Rajdhani Express (Premium)' },
    { number: '12002', name: 'NDLS - RKMP Shatabdi Exp (Shatabdi)' },
    { number: '22436', name: 'New Delhi-Varanasi Vande Bharat' }
  ];

  const PRESET_PNRS = [
    { pnr: '9876543210', label: 'Confirmed Booking (Demo)' },
    { pnr: '1234567890', label: 'Waiting List Booking (Demo)' }
  ];

  const PRESET_PAIRS = [
    { from: 'NDLS', to: 'MMCT', label: 'New Delhi ➔ Mumbai' },
    { from: 'NDLS', to: 'BSBS', label: 'New Delhi ➔ Varanasi' }
  ];

  // Fetch Live Status with client micro-service cache checking
  const handleFetchStatus = async (customNum?: string) => {
    const num = customNum || trainNumber;
    if (!num) return;
    
    // Check client localStorage cache for instant sub-millisecond retrieval
    const cacheKey = `status_cache_${num}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setStatusResult(parsed);
        setStatusLoading(false);
        setStatusError(null);
        setStatusNotice(null);
        return;
      } catch (err) {
        // Continue to fresh fetch in case of parse error
      }
    }

    setStatusLoading(true);
    setStatusError(null);
    setStatusNotice(null);
    try {
      const res = await fetch(`/api/train/status?trainNumber=${encodeURIComponent(num)}`);
      const data = await res.json();
      if (!res.ok) {
        setStatusError(data.error || "Failed to fetch status");
        if (data.requiresApiKey) {
          setStatusNotice(data.message);
        }
        setStatusResult(null);
      } else {
        setStatusResult(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch (e) {
      setStatusError("Could not connect to the backend server. Make sure it is running.");
    } finally {
      setStatusLoading(false);
    }
  };

  // Fetch PNR
  const handleFetchPNR = async (customPnr?: string) => {
    const p = customPnr || pnrNumber;
    if (!p || p.length !== 10) {
      setPnrError("Please enter a valid 10-digit PNR number");
      return;
    }
    setPnrLoading(true);
    setPnrError(null);
    setPnrNotice(null);
    try {
      const res = await fetch(`/api/pnr/status?pnr=${encodeURIComponent(p)}`);
      const data = await res.json();
      if (!res.ok) {
        setPnrError(data.error || "Failed to fetch PNR status");
        if (data.requiresApiKey) {
          setPnrNotice(data.message);
        }
        setPnrResult(null);
      } else {
        setPnrResult(data);
      }
    } catch (e) {
      setPnrError("Connection to backend lost.");
    } finally {
      setPnrLoading(false);
    }
  };

  // Fetch Schedule with client cache check
  const handleFetchSchedule = async (customNum?: string) => {
    const s = customNum || scheduleNumber;
    if (!s) return;

    const cacheKey = `schedule_cache_${s}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setScheduleResult(parsed);
        setScheduleLoading(false);
        setScheduleError(null);
        setScheduleNotice(null);
        return;
      } catch (err) {
        // skip
      }
    }

    setScheduleLoading(true);
    setScheduleError(null);
    setScheduleNotice(null);
    try {
      const res = await fetch(`/api/train/schedule?trainNumber=${encodeURIComponent(s)}`);
      const data = await res.json();
      if (!res.ok) {
        setScheduleError(data.error || "Failed to load schedule");
        if (data.requiresApiKey) {
          setScheduleNotice(data.message);
        }
        setScheduleResult(null);
      } else {
        setScheduleResult(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch (e) {
      setScheduleError("Failed to fetch schedule from server.");
    } finally {
      setScheduleLoading(false);
    }
  };

  // Fetch Trains Between Stations
  const handleFetchBetween = async (customFrom?: string, customTo?: string) => {
    const f = customFrom || sourceCode;
    const t = customTo || destCode;
    if (!f || !t) return;
    setBetweenLoading(true);
    setBetweenError(null);
    setBetweenNotice(null);
    try {
      const res = await fetch(`/api/train/search-between?source=${encodeURIComponent(f)}&destination=${encodeURIComponent(t)}`);
      const data = await res.json();
      if (!res.ok) {
        setBetweenError(data.error || "Failed to query travel routes");
        if (data.requiresApiKey) {
          setBetweenNotice(data.message);
        }
        setBetweenResult(null);
      } else {
        setBetweenResult(data);
      }
    } catch (e) {
      setBetweenError("Failed to fetch search results from fullstack server.");
    } finally {
      setBetweenLoading(false);
    }
  };

  // Trigger default loads on first mount
  useEffect(() => {
    handleFetchStatus('12952');
    handleFetchPNR('9876543210');
    handleFetchSchedule('12002');
    handleFetchBetween('NDLS', 'MMCT');
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden" id="rail_ai_root">
      
      {/* Sidebar Navigation - Styled according to "Professional Polish" */}
      <aside className="w-72 bg-slate-900 flex flex-col shrink-0 border-r border-slate-800" id="sidebar_nav">
        <div className="p-6 border-b border-slate-800 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-extrabold tracking-tight">Rail AI</h1>
              <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">IRCTC Smart Companion</p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('status')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-semibold tracking-wide ${
              activeTab === 'status' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Navigation className="w-5 h-5 shrink-0" />
            <span>Live Run Status</span>
          </button>

          <button
            onClick={() => setActiveTab('pnr')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-semibold tracking-wide ${
              activeTab === 'pnr' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Ticket className="w-5 h-5 shrink-0" />
            <span>PNR Status Checker</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-semibold tracking-wide ${
              activeTab === 'schedule' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Clock className="w-5 h-5 shrink-0" />
            <span>Train Timetable Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('between')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-semibold tracking-wide ${
              activeTab === 'between' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-5 h-5 shrink-0" />
            <span>Find Trains between</span>
          </button>

          {/* Quick presets helper */}
          <div className="pt-6 border-t border-slate-800 mt-6">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-3">Offline Demo Trains</p>
            <div className="space-y-1.5 px-2">
              {PRESET_TRAINS.map((t) => (
                <button
                  key={t.number}
                  onClick={() => {
                    if (activeTab === 'status') {
                      setTrainNumber(t.number);
                      handleFetchStatus(t.number);
                    } else if (activeTab === 'schedule') {
                      setScheduleNumber(t.number);
                      handleFetchSchedule(t.number);
                    } else {
                      setActiveTab('status');
                      setTrainNumber(t.number);
                      handleFetchStatus(t.number);
                    }
                  }}
                  className="w-full text-left text-xs text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg truncate block font-medium transition-colors"
                >
                  🚂 <span className="font-bold text-slate-300">{t.number}</span> - {t.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Powered by tag */}
        <div className="p-6 border-t border-slate-800 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-2 mb-1 text-slate-400">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>AI Status Synthesizer</span>
          </div>
          <p>Equipped with dual local cached lookup and live intelligence engines.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50" id="main_viewport">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0" id="top_header">
          <div>
            <h2 className="text-lg font-bold text-slate-900 capitalize tracking-tight">
              {activeTab === 'status' && "Live Running Schedule Tracker"}
              {activeTab === 'pnr' && "Indian Railways PNR Enquiry"}
              {activeTab === 'schedule' && "Official Station Timetable"}
              {activeTab === 'between' && "Train Finder & Search Between Terminals"}
            </h2>
            <p className="text-xs text-slate-500">Real-time GPS updates synced with Indian Railways systems</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">Dynamic AI active</p>
              <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Live
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm text-sm">
              IN
            </div>
          </div>
        </header>

        {/* Content Container with overflow auto */}
        <div className="flex-1 overflow-y-auto p-8" id="content_container">
          
          {/* TAB 1: LIVE STATUS TRACKER */}
          {activeTab === 'status' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left search & Status summary (Spans 2 columns on lg) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Search Bar Block */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Track Live Train Progress</h3>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 relative">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                      <input 
                        type="text" 
                        value={trainNumber}
                        onChange={(e) => {
                          setTrainNumber(e.target.value);
                          setShowStatusSuggestions(true);
                        }}
                        onFocus={() => setShowStatusSuggestions(true)}
                        onBlur={() => {
                          // Allow clicks on dropdown before hiding
                          setTimeout(() => setShowStatusSuggestions(false), 200);
                        }}
                        placeholder="Enter 5-digit Train Number or Name..."
                        className="w-full p-3 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                      />

                      {/* Dropdown matched list */}
                      {showStatusSuggestions && autocompleteStatusTrains.length > 0 && (
                        <div className="absolute left-0 right-0 top-[110%] bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                          <p className="text-[10px] text-slate-400 font-bold px-4 py-2 uppercase bg-slate-50 border-b border-slate-100">Popular Trains Suggestions</p>
                          {autocompleteStatusTrains.map((t) => (
                            <button
                              key={t.number}
                              onMouseDown={() => {
                                setTrainNumber(t.number);
                                setShowStatusSuggestions(false);
                                handleFetchStatus(t.number);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50/60 border-b border-slate-50 last:border-b-0 text-xs text-slate-700 flex items-center justify-between transition-colors"
                            >
                              <div>
                                <span className="font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[10px] mr-2.5">{t.number}</span>
                                <span className="font-bold text-slate-800">{t.name}</span>
                              </div>
                              <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                                Track 🚀
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleFetchStatus()}
                      disabled={statusLoading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 min-w-[120px]"
                    >
                      {statusLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Track Status"
                      )}
                    </button>
                  </div>

                  {/* Suggest presets row */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">⚡ Instant Demo Presets:</span>
                    {PRESET_TRAINS.map(t => (
                      <button
                        key={t.number}
                        onClick={() => {
                          setTrainNumber(t.number);
                          handleFetchStatus(t.number);
                        }}
                        className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                      >
                        📍 {t.number} ({t.name.split(' ')[0]})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner if any */}
                {statusError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-800 text-sm flex gap-3.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-1">Could not track train running status</p>
                      <p className="text-rose-700 leading-relaxed font-medium">{statusError}</p>
                      
                      {statusNotice && (
                        <div className="mt-3 p-3 bg-white/75 border border-rose-100 rounded-lg text-xs font-semibold text-slate-700 shadow-sm leading-relaxed">
                          ⚠️ {statusNotice}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Main live metrics card */}
                {statusResult && !statusLoading && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{statusResult.trainNumber} {statusResult.trainName}</h2>
                          </div>
                          <p className="text-slate-500 text-xs font-semibold mt-1">
                            Last Updated: <span className="text-slate-800">{statusResult.lastUpdated}</span>
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border ${
                          statusResult.delayMinutes > 0 
                            ? 'bg-rose-50 text-rose-700 border-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {statusResult.delayMinutes > 0 ? `🏃 DELAY: ${statusResult.delayMinutes} MINS` : '⏱️ ON TIME'}
                        </div>
                      </div>

                      {/* Current & Next Stop Panel */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3.5">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Station</p>
                            <p className="text-sm font-bold text-slate-800">{statusResult.currentStation}</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3.5">
                          <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 animate-pulse" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Next Station</p>
                            <p className="text-sm font-bold text-slate-800">{statusResult.nextStation}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl mb-4">
                        <p className="text-xs font-semibold text-blue-800 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                          {statusResult.statusMessage}
                        </p>
                      </div>

                      {/* Timeline status bar */}
                      <div className="relative pt-6 pb-2">
                        <div className="absolute top-9 left-1 right-1 h-1.5 bg-slate-100 rounded-full"></div>
                        <div 
                          className="absolute top-9 left-1 h-1.5 bg-blue-600 rounded-full transition-all duration-300" 
                          style={{ width: `${statusResult.routeProgressPercent}%` }}
                        ></div>
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex flex-col items-start">
                            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-md shadow-blue-600/20">
                              S
                            </div>
                            <span className="text-[10px] font-bold text-slate-800 mt-2">Source Terminal</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-7 h-7 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-xs font-black shadow text-blue-600">
                              {statusResult.routeProgressPercent}%
                            </div>
                            <span className="text-[10px] font-bold text-blue-600 mt-2">Progress</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="w-7 h-7 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-black">
                              D
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 mt-2">Destination</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Table station by station list */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/60 rounded-t-xl">
                        <div>
                          <h3 className="font-black text-slate-900 text-sm tracking-wide uppercase">Route Intelligence Tracker</h3>
                          <p className="text-[10px] text-slate-500 font-medium">Click on schedule station to expand metrics</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white pill border px-2 py-0.5 rounded border-slate-200">GPS Auto-Tracked</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-[11px] text-slate-500 uppercase tracking-wider bg-slate-50/50">
                            <tr>
                              <th className="px-6 py-3.5 font-bold">Station Code</th>
                              <th className="px-6 py-3.5 font-bold">Station Name</th>
                              <th className="px-6 py-3.5 font-bold">Expected Arr / Dep</th>
                              <th className="px-6 py-3.5 font-bold">Platform / Delay</th>
                              <th className="px-6 py-3.5 font-bold text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {statusResult.stations.map((sta, idx) => (
                              <tr 
                                key={idx} 
                                className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                                  sta.status === 'current' ? 'bg-blue-50/30 font-semibold' : ''
                                }`}
                              >
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-700 font-bold block w-fit border border-slate-200/55 shadow-xs">
                                    {sta.stationCode}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-bold text-slate-800">{sta.stationName}</div>
                                  <div className="text-[10px] text-slate-400 font-normal">{sta.distanceKm} km accumulated</div>
                                </td>
                                <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                                  <div>Arr: {sta.expectedArrival}</div>
                                  <div>Dep: {sta.expectedDeparture}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-xs font-bold text-slate-700">PF: {sta.platform || "Not assigned"}</div>
                                  <div className={`text-[10px] font-bold ${
                                    sta.delay > 0 ? 'text-rose-600' : 'text-emerald-600'
                                  }`}>
                                    {sta.delay > 0 ? `⚠️ ${sta.delay} mins delay` : '✓ On time'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {sta.status === 'passed' && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500 uppercase tracking-wider">
                                      Passed
                                    </span>
                                  )}
                                  {sta.status === 'current' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 uppercase tracking-widest border border-blue-200/50 animate-pulse">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                      Live Now
                                    </span>
                                  )}
                                  {sta.status === 'upcoming' && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-50 text-slate-400 border border-slate-200/40 uppercase tracking-wider">
                                      Upcoming
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar widgets */}
              <div className="space-y-6">
                
                {/* Station PNR Shortcut Box */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Ticket className="w-5 h-5 text-blue-600 text-blue-500" />
                    <h3 className="font-black text-slate-900 tracking-tight text-sm uppercase">Quick PNR Lookup</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Instantly query active train bookings using passenger 10-digit ticket codes.</p>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Enter 10-digit PNR"
                      value={pnrNumber}
                      onChange={(e) => setPnrNumber(e.target.value)}
                      className="w-full text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button 
                      onClick={() => {
                        setActiveTab('pnr');
                        handleFetchPNR();
                      }}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-slate-900/15"
                    >
                      Enquire PNR Status
                    </button>
                  </div>
                </div>

                {/* Helpful facts widget */}
                <div className="bg-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                    <Train className="w-40 h-40" />
                  </div>
                  
                  <h3 className="font-black text-base tracking-tight mb-2">Rail AI Intelligent Search</h3>
                  <p className="text-blue-100 text-xs leading-relaxed mb-4">
                    Equipped with premium natural language generation capabilities. Type any unofficial train query (e.g. "Gatimaan Exp", "Gyan Exp", or "12901") to dynamically construct schedules, track delay ratios, or approximate current operational details.
                  </p>
                  
                  <div className="bg-white/10 hover:bg-white/15 p-2 px-3 rounded-lg border border-white/15 cursor-pointer" onClick={() => {
                    setTrainNumber("22436");
                    handleFetchStatus("22436");
                  }}>
                    <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest mb-0.5">Explore flagship</p>
                    <p className="text-xs font-bold flex items-center justify-between">Vande Bharat Exp (22436) <span>➔</span></p>
                  </div>
                </div>

                {/* Catering Widget */}
                <div className="bg-slate-100 rounded-xl p-5 border-2 border-dashed border-slate-200 text-center">
                  <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-extrabold rounded uppercase tracking-widest mb-2">Food on Track</span>
                  <h4 className="font-extrabold text-xs text-slate-800 mb-1">Catering Reservation Available</h4>
                  <p className="text-[10px] text-slate-500">Order from fine-dine restaurants on upcoming stops. Call <span className="font-bold text-slate-700">1323</span> during travel.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PNR CHECKER */}
          {activeTab === 'pnr' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Input Form Box */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Ticket className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base tracking-tight">Check Passenger PNR Booking Sheet</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Check current wait-list positions, platform arrivals, and prepared reservation status</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={pnrNumber}
                      onChange={(e) => setPnrNumber(e.target.value)}
                      placeholder="Enter 10-Digit PNR Number (e.g. 9876543210)"
                      maxLength={10}
                      className="w-full text-slate-800 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button 
                    onClick={() => handleFetchPNR()}
                    disabled={pnrLoading}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 min-w-[150px]"
                  >
                    {pnrLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Check Status"
                    )}
                  </button>
                </div>

                {/* Preset suggestions */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Demo PNR:</span>
                  {PRESET_PNRS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPnrNumber(p.pnr);
                        handleFetchPNR(p.pnr);
                      }}
                      className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                    >
                      {p.pnr} ({p.label.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Error messages if any */}
              {pnrError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-800 text-sm flex gap-3.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-1">Unable to track PNR sheet</p>
                    <p className="text-rose-700 leading-relaxed font-semibold">{pnrError}</p>
                    {pnrNotice && (
                      <div className="mt-3 p-3 bg-white/75 border border-rose-100 rounded-lg text-xs font-semibold text-slate-700 shadow-sm leading-relaxed">
                        ⚠️ {pnrNotice}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PNR Details Result View */}
              {pnrResult && !pnrLoading && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  
                  {/* PNR Header Sheet */}
                  <div className="p-6 bg-slate-900 text-white border-b border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 bg-blue-500 text-xs font-extrabold rounded uppercase tracking-widest mb-2">PNR: {pnrResult.pnr}</span>
                        <h2 className="text-2xl font-black tracking-tight">{pnrResult.trainNumber} - {pnrResult.trainName}</h2>
                        <p className="text-slate-400 text-xs font-semibold mt-1">Journey Date: <span className="text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{pnrResult.journeyDate}</span></p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${
                          pnrResult.chartStatus === 'Prepared' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          Chart: {pnrResult.chartStatus}
                        </span>
                        <p className="text-xs text-slate-400 font-bold mt-2">Class: {pnrResult.travelClass} | Quota: {pnrResult.quota}</p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Details row */}
                  <div className="bg-slate-50/70 p-6 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">From Station</p>
                      <p className="text-sm font-extrabold text-slate-800">{pnrResult.fromStation}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">To Station</p>
                      <p className="text-sm font-extrabold text-slate-800">{pnrResult.toStation}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Boarding Point</p>
                      <p className="text-sm font-extrabold text-slate-800">{pnrResult.boardingPoint}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Arrival Platform</p>
                      <p className="text-sm font-extrabold text-blue-600">Platform {pnrResult.platform || "TBD"}</p>
                    </div>
                  </div>

                  {/* Passenger allocation list */}
                  <div className="p-6">
                    <h3 className="font-black text-slate-800 text-sm tracking-wide uppercase mb-4">Passenger Reservation Berth Status</h3>
                    
                    <div className="space-y-3">
                      {pnrResult.passengers.map((passenger, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 hover:bg-slate-100/55 transition-colors border border-slate-200/60 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xs text-slate-700">
                              {passenger.number}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-800">Passenger {passenger.number}</p>
                              <p className="text-[10px] text-slate-400 font-medium bg-white px-2 py-0.5 rounded border border-slate-150 w-fit mt-0.5">Booking Status: {passenger.bookingStatus}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-900">{passenger.currentStatus}</p>
                              {passenger.coach && (
                                <p className="text-[10px] text-slate-500 font-semibold uppercase">{passenger.coach} / {passenger.berthType} Berth ({passenger.berthNumber})</p>
                              )}
                            </div>
                            <span className={`p-2 rounded-xl text-xs font-black ${
                              passenger.currentStatus.includes("CNF") 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {passenger.currentStatus.includes("CNF") ? "CONFIRMED" : "WAITING"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial calculation footer */}
                  <div className="p-6 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                      <span className="text-xs text-slate-500 font-semibold">Automatic SMS Alerts registered to user account.</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-semibold mr-2">Total Transaction Fare:</span>
                      <span className="text-lg font-black text-slate-900">₹{pnrResult.totalFare}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRAIN SCHEDULE SCREEN */}
          {activeTab === 'schedule' && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Search schedule */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">View Official Route Timetables</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-3 relative">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                    <input 
                      type="text" 
                      value={scheduleNumber}
                      onChange={(e) => {
                        setScheduleNumber(e.target.value);
                        setShowScheduleSuggestions(true);
                      }}
                      onFocus={() => setShowScheduleSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => setShowScheduleSuggestions(false), 200);
                      }}
                      placeholder="Enter Train Number (e.g. 12002, 12952, 22436)"
                      className="w-full p-3 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />

                    {/* Autocomplete dropdown for Schedule */}
                    {showScheduleSuggestions && autocompleteScheduleTrains.length > 0 && (
                      <div className="absolute left-0 right-0 top-[110%] bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                        <p className="text-[10px] text-slate-400 font-bold px-4 py-2 uppercase bg-slate-50 border-b border-slate-100">Popular Trains Schedules Suggestions</p>
                        {autocompleteScheduleTrains.map((t) => (
                          <button
                            key={t.number}
                            onMouseDown={() => {
                              setScheduleNumber(t.number);
                              setShowScheduleSuggestions(false);
                              handleFetchSchedule(t.number);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50/60 border-b border-slate-50 last:border-b-0 text-xs text-slate-700 flex items-center justify-between transition-colors"
                          >
                            <div>
                              <span className="font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[10px] mr-2.5">{t.number}</span>
                              <span className="font-bold text-slate-800">{t.name}</span>
                            </div>
                            <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                              View Schedule ⏱️
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleFetchSchedule()}
                    disabled={scheduleLoading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 min-w-[150px]"
                  >
                    {scheduleLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Load Timetable"
                    )}
                  </button>
                </div>
              </div>

              {/* Error messages if any */}
              {scheduleError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-800 text-sm flex gap-3.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-1">Failed to fetch train timetable schedule</p>
                    <p className="text-rose-700 leading-relaxed font-semibold">{scheduleError}</p>
                    {scheduleNotice && (
                      <div className="mt-3 p-3 bg-white/75 border border-rose-100 rounded-lg text-xs font-semibold text-slate-700 shadow-sm leading-relaxed">
                        ⚠️ {scheduleNotice}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timetable results */}
              {scheduleResult && !scheduleLoading && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  
                  {/* Timetable header */}
                  <div className="p-6 bg-slate-900 text-white border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-blue-600 text-[10px] font-black rounded uppercase tracking-widest mb-1.5">Official Timetable</span>
                      <h2 className="text-2xl font-black tracking-tight">{scheduleResult.trainNumber} - {scheduleResult.trainName}</h2>
                      <p className="text-slate-400 text-xs font-semibold mt-1">Route terminals: <span className="text-white">{scheduleResult.fromStation}</span> to <span className="text-white">{scheduleResult.toStation}</span></p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Weekly Operating Days</p>
                      <div className="flex gap-1.5">
                        {Object.entries(scheduleResult.runsOn).map(([day, runs]) => (
                          <span 
                            key={day} 
                            className={`w-7 h-7 text-[10px] font-black rounded-lg flex items-center justify-center border transition-all ${
                              runs 
                                ? 'bg-blue-600 text-white border-blue-500 shadow-sm' 
                                : 'bg-slate-800 text-slate-600 border-slate-800'
                            }`}
                          >
                            {day.slice(0, 1).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Service attributes summary */}
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-6 text-sm font-semibold text-slate-700">
                    <div>
                      Available coaches: <span className="text-slate-900 bg-white border px-1.5 py-0.5 rounded text-xs gap-1">{scheduleResult.classes.join(', ')}</span>
                    </div>
                    <div className="text-slate-400">|</div>
                    <div>
                      Duration: <span className="text-slate-900 font-bold">{scheduleResult.duration}</span>
                    </div>
                    <div className="text-slate-400">|</div>
                    <div>
                      Total Station stops: <span className="text-slate-900 font-bold">{scheduleResult.stations.length} stops</span>
                    </div>
                  </div>

                  {/* Stops list table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase tracking-wider font-bold">
                        <tr>
                          <th className="px-6 py-3">Stop No</th>
                          <th className="px-6 py-3">Station name & code</th>
                          <th className="px-6 py-3">Arrival</th>
                          <th className="px-6 py-3">Departure</th>
                          <th className="px-6 py-3">Halt time</th>
                          <th className="px-6 py-3 text-right">Distance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduleResult.stations.map((sta, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                                {sta.stopNo}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-extrabold text-slate-900">{sta.stationName}</div>
                              <div className="text-[10px] text-slate-400 font-semibold">{sta.stationCode}</div>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                              {sta.arrivalTime === 'Source' ? (
                                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Source terminal</span>
                              ) : sta.arrivalTime}
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                              {sta.departureTime === 'Destination' ? (
                                <span className="text-blue-600 font-bold uppercase tracking-wider text-[10px]">Destination terminal</span>
                              ) : sta.departureTime}
                            </td>
                            <td className="px-6 py-4">
                              {sta.haltTimeMins === 0 ? (
                                <span className="text-slate-400 text-xs">-</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-xs font-semibold rounded border border-amber-100">
                                  {sta.haltTimeMins} mins halt
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right font-extrabold text-slate-800 text-xs">
                              {sta.distanceKm} km
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TRAIN BETWEEN STATIONS */}
          {activeTab === 'between' && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Search terminal box */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Search Passenger Trains Between Stations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  
                  {/* Source */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Origin Station Code (e.g. NDLS)</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input 
                        type="text" 
                        value={sourceCode}
                        onChange={(e) => setSourceCode(e.target.value.toUpperCase())}
                        placeholder="e.g. NDLS (New Delhi)"
                        className="w-full text-slate-850 p-3 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Swap icon */}
                  <div className="hidden md:flex justify-center mb-2">
                    <button 
                      onClick={() => {
                        const temp = sourceCode;
                        setSourceCode(destCode);
                        setDestCode(temp);
                      }}
                      type="button"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors border border-slate-250/70"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Destination */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Destination Station Code (e.g. MMCT)</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input 
                        type="text" 
                        value={destCode}
                        onChange={(e) => setDestCode(e.target.value.toUpperCase())}
                        placeholder="e.g. MMCT (Mumbai Cent)"
                        className="w-full text-slate-850 p-3 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Find Button */}
                  <div className="md:col-span-5 md:flex md:justify-end mt-4">
                    <button 
                      onClick={() => handleFetchBetween()}
                      disabled={betweenLoading}
                      className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2"
                    >
                      {betweenLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Search available trains"
                      )}
                    </button>
                  </div>

                </div>

                {/* Preset shortcuts */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Major routes:</span>
                  {PRESET_PAIRS.map((pair, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSourceCode(pair.from);
                        setDestCode(pair.to);
                        handleFetchBetween(pair.from, pair.to);
                      }}
                      className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                    >
                      {pair.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error messages if any */}
              {betweenError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-800 text-sm flex gap-3.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-1">Origin to destination query issue</p>
                    <p className="text-rose-700 leading-relaxed font-semibold">{betweenError}</p>
                    {betweenNotice && (
                      <div className="mt-3 p-3 bg-white/75 border border-rose-100 rounded-lg text-xs font-semibold text-slate-700 shadow-sm leading-relaxed">
                        ⚠️ {betweenNotice}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Available connection lists */}
              {betweenResult && !betweenLoading && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{betweenResult.length} Direct Trains Found Running</p>
                    <span className="text-[10px] text-slate-400 font-semibold">Source Terminal: {sourceCode} ➔ Destination Terminal: {destCode}</span>
                  </div>

                  {betweenResult.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                      No trains found between these stations. Try searching <span className="font-bold">NDLS to MMCT</span> or <span className="font-bold">NDLS to BSBS</span>.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {betweenResult.map((train, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-blue-300 transition-all">
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <div>
                              <span className="inline-block px-2 py-0.5 bg-slate-100 text-[10px] font-black tracking-wide text-slate-700 rounded border border-slate-200 mb-1">
                                No: {train.trainNumber}
                              </span>
                              <h3 className="font-black text-slate-900 text-sm tracking-tight leading-snug">{train.trainName}</h3>
                            </div>
                            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 shrink-0 select-none">
                              {train.duration}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 flex justify-between text-xs font-bold text-slate-700">
                            <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Departure</p>
                              <p>{train.departureTime}</p>
                              <p className="text-[9.5px] text-slate-500 font-normal truncate max-w-[130px]">{train.fromStation}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center text-slate-300 font-normal">
                              ➔
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Arrival</p>
                              <p>{train.arrivalTime}</p>
                              <p className="text-[9.5px] text-slate-500 font-normal truncate max-w-[130px]">{train.toStation}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center gap-4 text-xs font-semibold">
                            <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Coaches</p>
                              <div className="flex gap-1">
                                {train.classes.map((cls, j) => (
                                  <span key={j} className="bg-white border text-slate-700 border-slate-200 rounded px-1.5 py-0.5 text-[9.5px] font-bold">
                                    {cls}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Operating Days</p>
                              <div className="flex gap-1">
                                {train.runsOn.map((day, j) => (
                                  <span key={j} className="text-[9.5px] font-bold text-blue-600 bg-blue-50 px-1 rounded">
                                    {day}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Quick track shortcut */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                            <button
                              onClick={() => {
                                setTrainNumber(train.trainNumber);
                                setActiveTab('status');
                                handleFetchStatus(train.trainNumber);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Track Live Running <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
