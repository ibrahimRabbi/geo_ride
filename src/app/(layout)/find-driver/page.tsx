'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    MapPin,
    Navigation,
    X,
    Zap,
    Car,
    Search,
    ShieldCheck,
    Plus,
    Minus,
    CheckCircle2,
} from 'lucide-react';

// Swap with the real ride returned by POST /api/rides/request
const ACTIVE_RIDE = {
    vehicle: 'ApexX',
    fare: 480,
    pickup: 'Downtown Innovation Hub',
    destination: 'Metro Central Station',
};

// Swap with the driver payload delivered over the "rideAccepted" socket event
const FAKE_DRIVER = {
    name: 'Rafiq Islam',
    rating: 4.92,
    trips: 3120,
    vehicleModel: 'Toyota Axio',
    plate: 'DHA 15-4471',
    etaMins: 4,
    photoInitial: 'R',
};

const SEARCH_MESSAGES = [
    'Scanning nearby drivers...',
    'Matching ApexX vehicles...',
    'Checking driver ratings...',
    'Almost there...',
];

export default function FindingDriverPage() {
    const router = useRouter();
    const [elapsed, setElapsed] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);
    const [cancelling, setCancelling] = useState(false);
    const [driverFound, setDriverFound] = useState(false);

    useEffect(() => {
        const tick = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(tick);
    }, []);

    useEffect(() => {
        const cycle = setInterval(() => {
            setMessageIndex((i) => (i + 1) % SEARCH_MESSAGES.length);
        }, 2600);
        return () => clearInterval(cycle);
    }, []);

    // Simulate backend finding + assigning a driver after 3s
    // (In production this fires when the "rideAccepted" socket event arrives)
    useEffect(() => {
        const found = setTimeout(() => setDriverFound(true), 3000);
        return () => clearTimeout(found);
    }, []);

    // Give the success state a beat on screen, then move to the next page
    useEffect(() => {
        if (!driverFound) return;
        const redirect = setTimeout(() => {
            router.push('/driver-assigned');
        }, 50000);
        return () => clearTimeout(redirect);
    }, [driverFound, router]);

    useEffect(() => {
        const cycle = setInterval(() => {
            setMessageIndex((i) => (i + 1) % SEARCH_MESSAGES.length);
        }, 2600);
        return () => clearInterval(cycle);
    }, []);

    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            {/* Ambient background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Top Nav */}
            <header className="relative z-10 border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-full hover:bg-slate-800/60 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-lg font-bold tracking-tight">
                            Apex<span className="text-sky-400">Ride</span>
                        </span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a className="text-sky-400 border-b-2 border-sky-400 pb-5 -mb-5">Ride</a>
                        <a className="hover:text-slate-200 transition-colors">Rentals</a>
                        <a className="hover:text-slate-200 transition-colors">Parcel</a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <button className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-full hover:border-slate-600 transition-colors">
                            Activity
                        </button>
                        <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 text-sm font-bold">
                            U
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5">
                    {/* ---------------------------------------------------- */}
                    {/* LEFT: Status card                                    */}
                    {/* ---------------------------------------------------- */}
                    <section
                        className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 flex flex-col animate-[fadeSlideUp_0.5s_ease-out]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        {/* Radar (searching) OR success check (driver found) */}
                        <div className="relative w-full aspect-square max-w-[220px] mx-auto mb-6">
                            {!driverFound ? (
                                <>
                                    <div className="absolute inset-0 rounded-full border border-sky-500/20" />
                                    <div className="absolute inset-[12%] rounded-full border border-sky-500/25 animate-[radarPing_2.4s_ease-out_infinite]" />
                                    <div className="absolute inset-[12%] rounded-full border border-sky-500/25 animate-[radarPing_2.4s_ease-out_infinite]" style={{ animationDelay: '0.8s' }} />
                                    <div className="absolute inset-[12%] rounded-full border border-sky-500/25 animate-[radarPing_2.4s_ease-out_infinite]" style={{ animationDelay: '1.6s' }} />

                                    {/* Sweep */}
                                    <div
                                        className="absolute inset-0 rounded-full overflow-hidden"
                                        style={{ animation: 'spin 2.8s linear infinite' }}
                                    >
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'conic-gradient(from 0deg, rgba(56,189,248,0.35), transparent 35%)',
                                            }}
                                        />
                                    </div>

                                    {/* Center vehicle icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-500/40 flex items-center justify-center shadow-[0_0_30px_-4px_rgba(56,189,248,0.6)]">
                                            <Car className="w-8 h-8 text-sky-400" />
                                        </div>
                                    </div>

                                    {/* Orbiting dots representing nearby drivers */}
                                    {[0, 120, 240].map((deg, i) => (
                                        <div
                                            key={deg}
                                            className="absolute inset-0"
                                            style={{ animation: `orbit ${5 + i}s linear infinite`, animationDelay: `${i * 0.4}s` }}
                                        >
                                            <span
                                                className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                                                style={{ top: '6%', left: '50%', transform: 'translateX(-50%)' }}
                                            />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
                                    <div className="relative w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_40px_-6px_rgba(52,211,153,0.7)]">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                        <span className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-[radarPing_1.2s_ease-out_1]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-center mb-6">
                            <h1 className="text-xl font-bold mb-1.5 transition-all duration-300">
                                {driverFound ? 'Driver found!' : 'Finding your driver'}
                            </h1>
                            {!driverFound ? (
                                <p className="text-sm text-slate-500 transition-all duration-300 min-h-[20px]">
                                    {SEARCH_MESSAGES[messageIndex]}
                                </p>
                            ) : (
                                <p className="text-sm text-emerald-400 min-h-[20px] animate-[fadeSlideUp_0.3s_ease-out]">
                                    {FAKE_DRIVER.name} accepted your ride
                                </p>
                            )}
                        </div>

                        {/* Driver mini-card, appears once matched */}
                        {driverFound && (
                            <div className="bg-emerald-500/[0.06] border border-emerald-500/25 rounded-2xl p-4 mb-5 flex items-center gap-3 animate-[fadeSlideUp_0.4s_ease-out]">
                                <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                                    {FAKE_DRIVER.photoInitial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold">{FAKE_DRIVER.name}</div>
                                    <div className="text-xs text-slate-500 truncate">
                                        {FAKE_DRIVER.vehicleModel} &middot; {FAKE_DRIVER.plate}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-xs font-semibold text-amber-400">★ {FAKE_DRIVER.rating}</div>
                                    <div className="text-[10px] text-slate-500">{FAKE_DRIVER.etaMins} mins away</div>
                                </div>
                            </div>
                        )}


                        {/* Timer + trip summary */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                                    {driverFound ? 'Matched in' : 'Searching'}
                                </span>
                                <span className={`font-mono text-sm font-bold tabular-nums ${driverFound ? 'text-emerald-400' : 'text-sky-400'}`}>
                                    {mm}:{ss}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                                <div className="w-10 h-10 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center shrink-0">
                                    <Car className="w-5 h-5 text-orange-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold">{ACTIVE_RIDE.vehicle}</div>
                                    <div className="text-xs text-slate-500 truncate">
                                        {ACTIVE_RIDE.pickup} → {ACTIVE_RIDE.destination}
                                    </div>
                                </div>
                                <div className="text-sm font-bold tabular-nums shrink-0">
                                    BDT {ACTIVE_RIDE.fare.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 justify-center">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            {driverFound ? 'Taking you to your trip details' : "You won't be charged until a driver accepts"}
                        </div>

                        {!driverFound ? (
                            <button
                                onClick={() => setCancelling(true)}
                                className="mt-auto w-full rounded-2xl py-3.5 text-sm font-bold tracking-wide border border-rose-500/30 text-rose-400 bg-rose-500/[0.06] hover:bg-rose-500/10 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel request
                            </button>
                        ) : (
                            <div className="mt-auto w-full rounded-2xl py-3.5 text-sm font-bold tracking-wide border border-emerald-500/30 text-emerald-400 bg-emerald-500/[0.06] flex items-center justify-center gap-2 animate-[fadeSlideUp_0.3s_ease-out]">
                                <span className="w-3.5 h-3.5 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                                Connecting you with {FAKE_DRIVER.name.split(' ')[0]}...
                            </div>
                        )}

                        {cancelling && !driverFound && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 justify-center animate-[fadeSlideUp_0.3s_ease-out]">
                                <span className="w-3 h-3 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
                                Cancelling your request...
                            </div>
                        )}
                    </section>

                    {/* ---------------------------------------------------- */}
                    {/* RIGHT: Map with search radius                        */}
                    {/* ---------------------------------------------------- */}
                    <section
                        className="animate-[fadeSlideUp_0.5s_ease-out_0.15s]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        <SearchingMap driverFound={driverFound} />
                    </section>
                </div>
            </main>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes radarPing {
                    0% { transform: scale(0.3); opacity: 0.9; }
                    100% { transform: scale(2.4); opacity: 0; }
                }
                @keyframes popIn {
                    0% { transform: scale(0.4); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
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

function SearchingMap({ driverFound }:{ driverFound: boolean }) {
    return (
        <div className="relative bg-[#0d1420] border border-slate-800/80 rounded-3xl overflow-hidden h-[420px] lg:h-[640px]">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <pattern id="mapgrid2" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(51,65,85,0.35)" strokeWidth="0.15" />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#mapgrid2)" />

                {/* Search radius rings — only animate while actively searching */}
                {!driverFound && (
                    <>
                        <circle cx="50" cy="50" r="10" fill="none" stroke="#38bdf8" strokeWidth="0.3" opacity="0.5">
                            <animate attributeName="r" values="6;28" dur="2.6s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0" dur="2.6s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="50" cy="50" r="10" fill="none" stroke="#38bdf8" strokeWidth="0.3" opacity="0.5">
                            <animate attributeName="r" values="6;28" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
                        </circle>
                    </>
                )}

                {/* Pickup pin */}
                <circle cx="50" cy="50" r="2.2" fill="#38bdf8" />
                <circle cx="50" cy="50" r="1" fill="#0a0f1a" />

                {/* Nearby driver dots — one locks in green once matched, rest fade out */}
                {[
                    { x: 30, y: 35, matched: true },
                    { x: 68, y: 28, matched: false },
                    { x: 25, y: 65, matched: false },
                    { x: 72, y: 62, matched: false },
                    { x: 45, y: 20, matched: false },
                ].map((d, i) => (
                    <circle
                        key={i}
                        cx={d.x}
                        cy={d.y}
                        r={driverFound && d.matched ? '1.6' : '1.1'}
                        fill={driverFound && d.matched ? '#34d399' : '#fbbf24'}
                        opacity={driverFound && !d.matched ? 0.15 : 1}
                        style={{ transition: 'all 0.4s ease' }}
                    >
                        {!driverFound && (
                            <animate
                                attributeName="opacity"
                                values="0.4;1;0.4"
                                dur={`${2 + i * 0.3}s`}
                                repeatCount="indefinite"
                            />
                        )}
                    </circle>
                ))}

                {/* Route line to matched driver */}
                {driverFound && (
                    <path
                        d="M 30,35 Q 40,42 50,50"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeDasharray="2,1.5"
                        style={{ animation: 'dashMove 1s linear infinite' }}
                    />
                )}
            </svg>

            {/* Top pickup card */}
            <div className="absolute top-4 left-4 right-4 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${driverFound ? 'bg-emerald-500/15' : 'bg-sky-500/15'}`}>
                    <MapPin className={`w-4 h-4 transition-colors duration-300 ${driverFound ? 'text-emerald-400' : 'text-sky-400'}`} />
                </div>
                <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {driverFound ? 'Driver en route to' : 'Searching around'}
                    </div>
                    <div className="text-sm font-semibold truncate">{ACTIVE_RIDE.pickup}</div>
                </div>
                <div
                    className={`ml-auto flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 transition-colors duration-300 ${
                        driverFound ? 'text-emerald-400 bg-emerald-500/10' : 'text-sky-400 bg-sky-500/10'
                    }`}
                >
                    <Search className="w-3 h-3" />
                    {driverFound ? 'Matched' : 'Live'}
                </div>
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-16 right-4 flex flex-col bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden">
                <button className="p-2.5 hover:bg-slate-800/60 transition-colors border-b border-slate-800">
                    <Plus className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2.5 hover:bg-slate-800/60 transition-colors">
                    <Minus className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-sky-500" /> Your pickup point
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Nearby drivers
                </div>
            </div>
        </div>
    );
}