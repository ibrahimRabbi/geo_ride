'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Phone,
    MessageCircle,
    X,
    ShieldCheck,
    Car,
    Copy,
    Check,
    Clock,
    MapPin,
} from 'lucide-react';

// Swap with the driver payload delivered over the "rideAccepted" socket event
const DRIVER = {
    name: 'Rafiq Islam',
    rating: 4.92,
    vehicleModel: 'Toyota Axio',
    vehicleColor: 'Pearl White',
    plate: 'DHA 15-4471',
    photoInitial: 'R',
};

const ACTIVE_RIDE = {
    pickup: 'Downtown Innovation Hub',
    otp: '4821',
};

const FREE_WAIT_SECONDS = 3 * 60; // 3 minutes free waiting time

export default function DriverArrivedPage() {
    const router = useRouter();
    const [waitSeconds, setWaitSeconds] = useState(0);
    const [copied, setCopied] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const tick = setInterval(() => setWaitSeconds((s) => s + 1), 1000);
        return () => clearInterval(tick);
    }, []);

    // Simulated "tripStarted" socket event once OTP is verified on the driver's side
    useEffect(() => {
        const started = setTimeout(() => router.push('/on-trip'), 3000);
        return () => clearTimeout(started);
    }, [router]);

    const mins = Math.floor(waitSeconds / 60);
    const secs = waitSeconds % 60;
    const overFreeWait = waitSeconds > FREE_WAIT_SECONDS;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(ACTIVE_RIDE.otp);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            // clipboard unavailable — silently ignore
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            {/* Ambient background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Top Nav */}
            <header className="relative z-10 border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <span className="text-lg font-bold tracking-tight">
                        Apex<span className="text-sky-400">Ride</span>
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Driver arrived
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5">
                    {/* ---------------------------------------------------- */}
                    {/* LEFT: Arrival + OTP + driver info                    */}
                    {/* ---------------------------------------------------- */}
                    <section
                        className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 flex flex-col animate-[fadeSlideUp_0.5s_ease-out]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        {/* Arrival headline */}
                        <div className="text-center mb-6">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <div className="absolute inset-0 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
                                    <Check className="w-8 h-8 text-emerald-400" strokeWidth={3} />
                                </div>
                                <span className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-[radarPing_1.6s_ease-out_infinite]" />
                            </div>
                            <h1 className="text-xl font-bold mb-1">Your driver has arrived</h1>
                            <p className="text-sm text-slate-500">{DRIVER.name} is waiting at {ACTIVE_RIDE.pickup}</p>
                        </div>

                        {/* OTP — prominent */}
                        <div className="bg-gradient-to-br from-sky-500/10 to-sky-500/[0.02] border border-sky-500/25 rounded-2xl p-5 mb-5">
                            <div className="text-center text-[10px] font-semibold tracking-wider text-sky-400 uppercase mb-3">
                                Share this code with your driver
                            </div>
                            <div className="flex items-center justify-center gap-2.5 mb-3">
                                {ACTIVE_RIDE.otp.split('').map((digit, i) => (
                                    <div
                                        key={i}
                                        className="w-12 h-14 rounded-xl bg-slate-950/70 border border-sky-500/30 flex items-center justify-center text-2xl font-bold font-mono text-sky-300 animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
                                        style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
                                    >
                                        {digit}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400 py-2 rounded-lg hover:bg-sky-500/[0.06] transition-colors duration-200"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        Copy code
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Driver + vehicle confirm card */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-4 flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold shrink-0">
                                {DRIVER.photoInitial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold truncate">{DRIVER.name}</div>
                                <div className="text-xs text-slate-500 truncate">{DRIVER.vehicleModel} &middot; {DRIVER.vehicleColor}</div>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                                <span className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Look for</span>
                                <span className="text-sm font-mono font-bold bg-slate-800/80 px-2.5 py-1 rounded-lg tracking-wide">
                                    {DRIVER.plate}
                                </span>
                            </div>
                        </div>

                        {/* Wait timer */}
                        <div
                            className={`flex items-center gap-3 rounded-2xl px-4 py-3 mb-5 border transition-colors duration-300 ${overFreeWait
                                    ? 'bg-amber-500/[0.06] border-amber-500/25'
                                    : 'bg-slate-900/40 border-slate-800'
                                }`}
                        >
                            <Clock className={`w-4 h-4 shrink-0 ${overFreeWait ? 'text-amber-400' : 'text-slate-500'}`} />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-slate-500">
                                    {overFreeWait ? 'Free waiting time used' : 'Driver waiting'}
                                </div>
                            </div>
                            <span className={`font-mono font-bold text-sm tabular-nums ${overFreeWait ? 'text-amber-400' : 'text-slate-200'}`}>
                                {mins}:{String(secs).padStart(2, '0')}
                            </span>
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

                        <button
                            onClick={() => setCancelling(true)}
                            className="mt-auto w-full rounded-2xl py-3.5 text-sm font-bold tracking-wide border border-rose-500/30 text-rose-400 bg-rose-500/[0.06] hover:bg-rose-500/10 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel ride
                        </button>

                        {cancelling && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 animate-[fadeSlideUp_0.3s_ease-out]">
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                Your driver is already here — a full cancellation fee will apply.
                            </div>
                        )}
                    </section>

                    {/* ---------------------------------------------------- */}
                    {/* RIGHT: Static close-up map                           */}
                    {/* ---------------------------------------------------- */}
                    <section
                        className="animate-[fadeSlideUp_0.5s_ease-out_0.15s]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        <ArrivedMap />
                    </section>
                </div>
            </main>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    0% { transform: scale(0.4); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes radarPing {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
                @media (prefers-reduced-motion: reduce) {
                    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
                }
            `}</style>
        </div>
    );
}

function ArrivedMap() {
    return (
        <div className="relative bg-[#0d1420] border border-slate-800/80 rounded-3xl overflow-hidden h-[420px] lg:h-[600px]">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <pattern id="mapgrid4" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(51,65,85,0.35)" strokeWidth="0.15" />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#mapgrid4)" />

                {/* Rider pin */}
                <circle cx="46" cy="52" r="2" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="0.5" />
                <circle cx="46" cy="52" r="0.8" fill="#38bdf8" />

                {/* Driver car, stationary right beside pickup */}
                <g transform="translate(54, 48) rotate(-20)">
                    <ellipse cx="0" cy="0" rx="2.6" ry="1.3" fill="rgba(52,211,153,0.3)" />
                    <rect x="-1.6" y="-0.9" width="3.2" height="1.8" rx="0.45" fill="#34d399" stroke="#fff" strokeWidth="0.2" />
                    <rect x="0.3" y="-0.7" width="0.7" height="1.4" fill="#0d1420" rx="0.15" />
                </g>
                <circle cx="54" cy="48" r="5" fill="none" stroke="#34d399" strokeWidth="0.3" opacity="0.5">
                    <animate attributeName="r" values="3;7" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
            </svg>

            <div className="absolute top-4 left-4 right-4 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Pickup point</div>
                    <div className="text-sm font-semibold truncate">{ACTIVE_RIDE.pickup}</div>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-sky-500" /> Your location
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Driver&apos;s car
                </div>
            </div>
        </div>
    );
}