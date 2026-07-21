'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Phone,
    MessageCircle,
    ShieldAlert,
    Star,
    MapPin,
    Navigation,
    Plus,
    Minus,
    Car,
    ChevronUp,
    Siren,
} from 'lucide-react';

// Swap with real data from the ride/socket state
const DRIVER = {
    name: 'Rafiq Islam',
    rating: 4.92,
    vehicleModel: 'Toyota Axio',
    plate: 'DHA 15-4471',
    photoInitial: 'R',
};

const ACTIVE_RIDE = {
    pickup: 'Downtown Innovation Hub',
    destination: 'Metro Central Station',
    fare: 480,
    totalDistanceKm: 9.3,
    totalDurationMin: 21,
};

export default function OnTripPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(2); // % of trip completed
    const [remainingSeconds, setRemainingSeconds] = useState(ACTIVE_RIDE.totalDurationMin * 60);
    const [sosOpen, setSosOpen] = useState(false);
    const [sheetExpanded, setSheetExpanded] = useState(false);

    // Simulated live trip progress (swap with "driverLocationBroadcast" socket data)
    useEffect(() => {
        const tick = setInterval(() => {
            setProgress((p) => (p < 100 ? p + 1.2 : 100));
            setRemainingSeconds((s) => (s > 3 ? s - 3 : 0));
        }, 700);
        return () => clearInterval(tick);
    }, []);

    // Simulated "tripCompleted" socket event
    useEffect(() => {
        if (progress < 100) return;
        const toComplete = setTimeout(() => router.push('/trip-complete'), 900);
        return () => clearTimeout(toComplete);
    }, [progress, router]);

    const remainingKm = Math.max(0, (ACTIVE_RIDE.totalDistanceKm * (1 - progress / 100))).toFixed(1);
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            {/* Ambient background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
            </div>


            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
                    {/* ---------------------------------------------------- */}
                    {/* LEFT: Trip status card (hidden on mobile — bottom sheet instead) */}
                    {/* ---------------------------------------------------- */}
                    <section
                        className="hidden lg:flex bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 flex-col animate-[fadeSlideUp_0.5s_ease-out]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        <TripStatusContent
                            progress={progress}
                            remainingKm={remainingKm}
                            mins={mins}
                            secs={secs}
                            sosOpen={sosOpen}
                            setSosOpen={setSosOpen}
                        />
                    </section>

                    {/* ---------------------------------------------------- */}
                    {/* RIGHT: Live map                                      */}
                    {/* ---------------------------------------------------- */}
                    <section
                        className="animate-[fadeSlideUp_0.5s_ease-out_0.15s]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        <TripMap progress={progress} />
                    </section>
                </div>
            </main>

            {/* Mobile bottom sheet */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20">
                <div
                    className={`bg-[#0a0f1a] border-t border-slate-800 rounded-t-3xl transition-[max-height] duration-300 ease-out overflow-hidden ${sheetExpanded ? 'max-h-[85vh]' : 'max-h-[92px]'
                        }`}
                >
                    <button
                        onClick={() => setSheetExpanded((v) => !v)}
                        className="w-full px-5 pt-3 pb-2 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 text-sm font-bold shrink-0">
                                {DRIVER.photoInitial}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold">{mins}:{String(secs).padStart(2, '0')} remaining</div>
                                <div className="text-xs text-slate-500">{remainingKm} km to {ACTIVE_RIDE.destination}</div>
                            </div>
                        </div>
                        <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform ${sheetExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="px-5 pb-6 pt-1 overflow-y-auto max-h-[calc(85vh-70px)]">
                        <TripStatusContent
                            progress={progress}
                            remainingKm={remainingKm}
                            mins={mins}
                            secs={secs}
                            sosOpen={sosOpen}
                            setSosOpen={setSosOpen}
                            compact
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes dashMove {
                    to { stroke-dashoffset: -20; }
                }
                @media (prefers-reduced-motion: reduce) {
                    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
                }
            `}</style>
        </div>
    );
}

function TripStatusContent({ progress, remainingKm, mins, secs, sosOpen, setSosOpen, compact = false }) {
    return (
        <>
            {/* Progress ring + ETA */}
            {!compact && (
                <div className="text-center mb-6">
                    <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
                        Arriving at destination in
                    </div>
                    <div className="text-3xl font-bold font-mono tabular-nums">
                        {mins}:{String(secs).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{remainingKm} km remaining</div>
                </div>
            )}

            {/* Progress bar */}
            <div className="mb-6">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-[width] duration-700 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Pickup
                    </span>
                    <span className="flex items-center gap-1">
                        Destination <span className="w-1.5 h-1.5 rounded-sm bg-emerald-500" />
                    </span>
                </div>
            </div>

            {/* Driver mini card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold shrink-0">
                    {DRIVER.photoInitial}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{DRIVER.name}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                        {DRIVER.rating} &middot; {DRIVER.vehicleModel}
                    </div>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-800/80 px-2.5 py-1 rounded-lg tracking-wide shrink-0">
                    {DRIVER.plate}
                </span>
            </div>

            {/* Destination */}
            <div className="flex items-center gap-3 mb-5 px-1">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0" />
                <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Heading to</div>
                    <div className="text-sm font-medium truncate">{ACTIVE_RIDE.destination}</div>
                </div>
                <span className="ml-auto text-sm font-bold tabular-nums shrink-0">BDT {ACTIVE_RIDE.fare.toFixed(2)}</span>
            </div>

            {/* Call / Message */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <button className="flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/[0.06] transition-all duration-200">
                    <Phone className="w-4 h-4" />
                    Call
                </button>
                <button className="flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-sky-500/50 hover:text-sky-400 hover:bg-sky-500/[0.06] transition-all duration-200">
                    <MessageCircle className="w-4 h-4" />
                    Message
                </button>
            </div>

            {/* SOS / Safety */}
            <button
                onClick={() => setSosOpen(true)}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold tracking-wide rounded-2xl py-3.5 border border-rose-500/30 text-rose-400 bg-rose-500/[0.06] hover:bg-rose-500/10 active:scale-[0.99] transition-all duration-200"
            >
                <Siren className="w-4 h-4" />
                Emergency SOS
            </button>

            {sosOpen && (
                <div className="mt-3 flex items-start gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2.5 animate-[fadeSlideUp_0.3s_ease-out]">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                        This will alert local authorities and share your live trip details.{' '}
                        <button onClick={() => setSosOpen(false)} className="underline underline-offset-2 hover:text-rose-200">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

function TripMap({ progress }:{ progress: number }) {
    const startX = 30;
    const startY = 60;
    const endX = 55;
    const endY = 40;
    const pct = Math.min(progress, 100) / 100;
    const carX = startX + (endX - startX) * pct;
    const carY = startY + (endY - startY) * pct;
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    return (
        <div className="relative bg-[#0d1420] border border-slate-800/80 rounded-3xl overflow-hidden h-[calc(100svh-260px)] min-h-[380px] lg:h-[640px] mb-24 lg:mb-0">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <pattern id="mapgrid5" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(51,65,85,0.35)" strokeWidth="0.15" />
                    </pattern>
                    <filter id="carglow2" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.2" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <rect width="100" height="100" fill="url(#mapgrid5)" />

                {/* Full planned route (faint) */}
                <path
                    d={`M ${startX},${startY} L ${endX},${startY} L ${endX},${endY}`}
                    fill="none"
                    stroke="rgba(56,189,248,0.15)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Traveled portion (bright, dashed & moving) */}
                <path
                    d={`M ${startX},${startY} L ${Math.min(carX, endX)},${carX > endX ? carY : startY} ${carX > endX ? '' : `L ${carX},${carY}`}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="2,1.5"
                    style={{ animation: 'dashMove 1s linear infinite' }}
                />

                {/* Pickup marker */}
                <circle cx={startX} cy={startY} r="1.8" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="0.5" />
                <circle cx={startX} cy={startY} r="0.7" fill="#38bdf8" />

                {/* Destination marker */}
                <circle cx={endX} cy={endY} r="2.2" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="0.5" />
                <polygon
                    points={`${endX},${endY - 1.1} ${endX - 0.9},${endY + 0.7} ${endX + 0.9},${endY + 0.7}`}
                    fill="#10b981"
                />

                {/* Moving car */}
                <g transform={`translate(${carX}, ${carY}) rotate(${angle})`} filter="url(#carglow2)">
                    <ellipse cx="0" cy="0" rx="2.8" ry="1.4" fill="rgba(56,189,248,0.35)" />
                    <rect x="-1.7" y="-1" width="3.4" height="2" rx="0.5" fill="#38bdf8" stroke="#fff" strokeWidth="0.2" />
                    <rect x="0.35" y="-0.75" width="0.75" height="1.5" fill="#0d1420" rx="0.15" />
                </g>
            </svg>

            {/* Top status card */}
            <div className="absolute top-4 left-4 right-4 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">On the way to</div>
                    <div className="text-sm font-semibold truncate">{ACTIVE_RIDE.destination}</div>
                </div>
                <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full shrink-0">
                    {Math.min(Math.round(progress), 100)}%
                </span>
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 flex flex-col bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden">
                <button className="p-2.5 hover:bg-slate-800/60 transition-colors border-b border-slate-800">
                    <Plus className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2.5 hover:bg-slate-800/60 transition-colors">
                    <Minus className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            {/* Legend — desktop only */}
            <div className="hidden lg:block absolute bottom-4 left-4 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-sky-500" /> Pickup
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-sm bg-emerald-500" /> Destination
                </div>
            </div>
        </div>
    );
}