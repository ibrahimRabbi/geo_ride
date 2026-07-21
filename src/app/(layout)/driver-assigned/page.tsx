'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Phone,
    MessageCircle,
    X,
    Star,
    ShieldCheck,
    Car,
    MapPin,
    Navigation,
    Plus,
    Minus,
    ChevronUp,
} from 'lucide-react';

// Swap with the driver payload delivered over the "rideAccepted" socket event
const DRIVER = {
    name: 'Rafiq Islam',
    rating: 4.92,
    trips: 3120,
    vehicleModel: 'Toyota Axio',
    vehicleColor: 'Pearl White',
    plate: 'DHA 15-4471',
    photoInitial: 'R',
};

const ACTIVE_RIDE = {
    vehicle: 'ApexX',
    fare: 480,
    pickup: 'Downtown Innovation Hub',
    destination: 'Metro Central Station',
    otp: '4821',
};

export default function DriverAssignedPage() {
    const router = useRouter();
    const [etaSeconds, setEtaSeconds] = useState(4 * 60 + 20); // demo countdown from ~4m20s
    const [driverProgress, setDriverProgress] = useState(6); // % along the route toward pickup
    const [cancelling, setCancelling] = useState(false);
    const [sheetExpanded, setSheetExpanded] = useState(false);

    // Simulated live ETA + map progress (swap with "driverLocationBroadcast" socket data)
    useEffect(() => {
        const tick = setInterval(() => {
            setEtaSeconds((s) => (s > 5 ? s - 5 : 0));
            setDriverProgress((p) => (p < 96 ? p + 2 : p));
        }, 1000);
        return () => clearInterval(tick);
    }, []);

    // Simulated "driverArrived" socket event
    useEffect(() => {
        if (etaSeconds !== 0) return;
        const toArrived = setTimeout(() => router.push('/driver-arrived'), 900);
        return () => clearTimeout(toArrived);
    }, [etaSeconds, router]);

    const mins = Math.floor(etaSeconds / 60);
    const secs = etaSeconds % 60;

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            {/* Ambient background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
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
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Trip confirmed
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5">
                    {/* ---------------------------------------------------- */}
                    {/* LEFT: Driver card                                    */}
                    {/* ---------------------------------------------------- */}
                    <section
                        className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 flex flex-col animate-[fadeSlideUp_0.5s_ease-out]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        {/* ETA banner */}
                        <div className="bg-gradient-to-br from-sky-500/15 to-sky-500/5 border border-sky-500/25 rounded-2xl p-4 mb-5 text-center">
                            <div className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase mb-1">
                                Arriving in
                            </div>
                            <div className="text-3xl font-bold font-mono tabular-nums">
                                {mins}:{String(secs).padStart(2, '0')}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">to {ACTIVE_RIDE.pickup}</div>
                        </div>

                        {/* Driver profile */}
                        <div className="flex items-center gap-4 mb-5">
                            <div className="relative shrink-0">
                                <div className="w-16 h-16 rounded-full bg-sky-500/20 border-2 border-sky-500/40 flex items-center justify-center text-sky-400 text-2xl font-bold">
                                    {DRIVER.photoInitial}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0d1420] flex items-center justify-center">
                                    <ShieldCheck className="w-3 h-3 text-[#0d1420]" />
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-lg font-bold truncate">{DRIVER.name}</div>
                                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                                    <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                                    <span className="font-semibold text-slate-200">{DRIVER.rating}</span>
                                    <span className="text-slate-600">&middot;</span>
                                    <span>{DRIVER.trips.toLocaleString()} trips</span>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle info */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-5 flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center shrink-0">
                                <Car className="w-6 h-6 text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold">{DRIVER.vehicleModel}</div>
                                <div className="text-xs text-slate-500">{DRIVER.vehicleColor}</div>
                            </div>
                            <div className="text-sm font-mono font-bold bg-slate-800/80 px-3 py-1.5 rounded-lg tracking-wide shrink-0">
                                {DRIVER.plate}
                            </div>
                        </div>

                        {/* Call / Message */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <button className="flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/[0.06] transition-all duration-200">
                                <Phone className="w-4 h-4" />
                                Call
                            </button>
                            <button className="flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-sky-500/50 hover:text-sky-400 hover:bg-sky-500/[0.06] transition-all duration-200">
                                <MessageCircle className="w-4 h-4" />
                                Message
                            </button>
                        </div>

                        {/* Trip summary */}
                        <div className="border-t border-slate-800 pt-4 mb-5">
                            <div className="relative pl-1">
                                <div className="absolute left-[7px] top-[10px] bottom-[26px] w-[2px] bg-gradient-to-b from-sky-500 to-emerald-500" />
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-sky-500/20 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Pickup</div>
                                        <div className="text-sm font-medium truncate">{ACTIVE_RIDE.pickup}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 ring-4 ring-emerald-500/20 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Destination</div>
                                        <div className="text-sm font-medium truncate">{ACTIVE_RIDE.destination}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/70 text-sm">
                                <span className="text-slate-500">{ACTIVE_RIDE.vehicle} &middot; Wallet</span>
                                <span className="font-bold tabular-nums">BDT {ACTIVE_RIDE.fare.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setCancelling(true)}
                            className="mt-auto w-full rounded-2xl py-3.5 text-sm font-bold tracking-wide border border-rose-500/30 text-rose-400 bg-rose-500/[0.06] hover:bg-rose-500/10 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel ride
                        </button>

                        {cancelling && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2 animate-[fadeSlideUp_0.3s_ease-out]">
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                A small cancellation fee may apply since your driver is already on the way.
                            </div>
                        )}
                    </section>

                    {/* ---------------------------------------------------- */}
                    {/* RIGHT: Live tracking map                             */}
                    {/* ---------------------------------------------------- */}
                    <section
                        className="animate-[fadeSlideUp_0.5s_ease-out_0.15s]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        <LiveTrackingMap progress={driverProgress} />
                    </section>
                </div>
            </main>

            {/* Mobile bottom sheet peek — OTP quick access */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20">
                <button
                    onClick={() => setSheetExpanded((v) => !v)}
                    className="w-full bg-[#0a0f1a] border-t border-slate-800 rounded-t-3xl px-5 py-3 flex items-center justify-between"
                >
                    <span className="text-xs text-slate-500">Share OTP with driver on arrival</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-400 tracking-widest">{ACTIVE_RIDE.otp}</span>
                        <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform ${sheetExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </button>
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

function LiveTrackingMap({ progress }: { progress: number }) {
    // Driver starts off-route and travels toward the pickup pin as `progress` increases
    const startX = 78;
    const startY = 22;
    const endX = 50;
    const endY = 50;
    const pct = progress / 100;
    const carX = startX + (endX - startX) * pct;
    const carY = startY + (endY - startY) * pct;
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    return (
        <div className="relative bg-[#0d1420] border border-slate-800/80 rounded-3xl overflow-hidden h-[420px] lg:h-[640px] mb-16 lg:mb-0">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <pattern id="mapgrid3" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(51,65,85,0.35)" strokeWidth="0.15" />
                    </pattern>
                    <filter id="carglow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.2" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <rect width="100" height="100" fill="url(#mapgrid3)" />

                {/* Route from driver's current position to pickup */}
                <path
                    d={`M ${startX},${startY} L ${endX},${endY}`}
                    fill="none"
                    stroke="rgba(56,189,248,0.25)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                />
                <path
                    d={`M ${startX},${startY} L ${carX},${carY}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeDasharray="2,1.5"
                    style={{ animation: 'dashMove 1s linear infinite' }}
                />

                {/* Pickup pin */}
                <circle cx={endX} cy={endY} r="2.4" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="0.5" />
                <circle cx={endX} cy={endY} r="0.9" fill="#10b981" />
                <circle cx={endX} cy={endY} r="4" fill="none" stroke="#10b981" strokeWidth="0.3" opacity="0.5">
                    <animate attributeName="r" values="2;6" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0" dur="1.8s" repeatCount="indefinite" />
                </circle>

                {/* Moving driver car */}
                <g transform={`translate(${carX}, ${carY}) rotate(${angle})`} filter="url(#carglow)">
                    <ellipse cx="0" cy="0" rx="2.6" ry="1.3" fill="rgba(56,189,248,0.3)" />
                    <rect x="-1.6" y="-0.9" width="3.2" height="1.8" rx="0.45" fill="#38bdf8" stroke="#fff" strokeWidth="0.2" />
                    <rect x="0.3" y="-0.7" width="0.7" height="1.4" fill="#0d1420" rx="0.15" />
                </g>
            </svg>

            {/* Top status card */}
            <div className="absolute top-4 left-4 right-4 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4 text-sky-400" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Driver en route</div>
                    <div className="text-sm font-semibold truncate">{DRIVER.name} is {progress}% of the way</div>
                </div>
            </div>

            {/* OTP card — desktop only, mobile uses bottom sheet */}
            <div className="hidden lg:flex absolute bottom-4 left-4 items-center gap-3 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Share with driver</div>
                    <div className="font-mono font-bold text-sky-400 tracking-[0.3em] text-sm">{ACTIVE_RIDE.otp}</div>
                </div>
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
        </div>
    );
}