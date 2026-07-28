'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, Navigation, Siren } from 'lucide-react';

const RIDE = {
    riderName: 'Ayesha Rahman',
    destination: 'Bashundhara City, Dhaka',
    fare: 245,
};

export default function DriverOnTripPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(2);
    const [remainingSeconds, setRemainingSeconds] = useState(14 * 60);

    useEffect(() => {
        const t = setInterval(() => {
            setProgress((p) => (p < 100 ? p + 1.5 : 100));
            setRemainingSeconds((s) => (s > 3 ? s - 3 : 0));
        }, 500);
        return () => clearInterval(t);
    }, []);

    const complete = progress >= 100;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-10 border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <span className="text-lg font-bold">
                        Apex<span className="text-sky-400">Drive</span>
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Trip in progress
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-2xl mx-auto px-4 py-6">
                <div className="relative bg-[#0d1420] border border-slate-800/80 rounded-3xl overflow-hidden h-[320px] mb-5">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid2" width="8" height="8" patternUnits="userSpaceOnUse">
                                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(51,65,85,0.35)" strokeWidth="0.15" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid2)" />
                        <path d="M 22,80 Q 45,60 78,22" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,1.5" strokeLinecap="round" />
                        <circle cx={22 + (78 - 22) * (progress / 100)} cy={80 + (22 - 80) * (progress / 100)} r="2.6" fill="#38bdf8" />
                        <polygon points="78,20.5 77.2,23 78.8,23" fill="#10b981" />
                    </svg>
                    <div className="absolute top-4 left-4 right-4 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                        <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">On the way to</div>
                            <div className="text-sm font-semibold truncate">{RIDE.destination}</div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                            {Math.min(Math.round(progress), 100)}%
                        </span>
                    </div>
                </div>

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-5 mb-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">ETA to destination</div>
                            <div className="text-lg font-bold font-mono">{mins}:{String(secs).padStart(2, '0')}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Fare</div>
                            <div className="text-lg font-bold font-mono text-emerald-400">৳{RIDE.fare}</div>
                        </div>
                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-[width] duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
                            <Phone className="w-4 h-4" />
                            Call
                        </button>
                        <button className="flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-sky-500/50 hover:text-sky-400 transition-all">
                            <MessageCircle className="w-4 h-4" />
                            Message
                        </button>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 text-sm font-bold rounded-2xl py-3.5 border border-rose-500/30 text-rose-400 bg-rose-500/[0.06] hover:bg-rose-500/10 transition-all mb-3">
                    <Siren className="w-4 h-4" />
                    Emergency SOS
                </button>

                <button
                    onClick={() => router.push('/trip-summary')}
                    disabled={!complete}
                    className={`w-full rounded-2xl py-4 text-sm font-bold tracking-wide transition-all duration-300 ${complete
                            ? 'bg-emerald-500 text-[#070b14] hover:bg-emerald-400 active:scale-[0.99] shadow-[0_8px_24px_-8px_rgba(52,211,153,0.6)]'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {complete ? 'Complete Trip' : 'Driving to destination...'}
                </button>
            </main>
        </div>
    );
}