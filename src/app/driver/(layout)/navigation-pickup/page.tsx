'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, Navigation, MapPin, Star, User } from 'lucide-react';

const RIDE = {
    riderName: 'Ayesha Rahman',
    rating: 4.8,
    pickup: 'Dhanmondi 27, Dhaka',
};

export default function NavigateToPickupPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(4);
    const [etaSeconds, setEtaSeconds] = useState(3 * 60);

    useEffect(() => {
        const t = setInterval(() => {
            setProgress((p) => (p < 100 ? p + 2 : 100));
            setEtaSeconds((s) => (s > 2 ? s - 2 : 0));
        }, 500);
        return () => clearInterval(t);
    }, []);

    const arrived = progress >= 100;
    const mins = Math.floor(etaSeconds / 60);
    const secs = etaSeconds % 60;

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-10 border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <span className="text-lg font-bold">
                        Apex<span className="text-sky-400">Drive</span>
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
                        Heading to pickup
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-2xl mx-auto px-4 py-6">
                {/* Fake map placeholder */}
                <div className="relative bg-[#0d1420] border border-slate-800/80 rounded-3xl overflow-hidden h-[320px] mb-5">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(51,65,85,0.35)" strokeWidth="0.15" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                        <path d="M 25,75 Q 40,55 55,45" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,1.5" strokeLinecap="round" />
                        <circle cx={25 + (55 - 25) * (progress / 100)} cy={75 + (45 - 75) * (progress / 100)} r="2.6" fill="#38bdf8" />
                        <circle cx="55" cy="45" r="2" fill="#10b981" />
                    </svg>
                    <div className="absolute top-4 left-4 right-4 bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                        <Navigation className="w-4 h-4 text-sky-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Arriving in</div>
                            <div className="text-sm font-semibold font-mono">{mins}:{String(secs).padStart(2, '0')}</div>
                        </div>
                    </div>
                </div>

                {/* Rider card */}
                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-5 mb-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{RIDE.riderName}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                                {RIDE.rating}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5 mb-4">
                        <MapPin className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                        <div className="text-sm text-slate-300">{RIDE.pickup}</div>
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

                <button
                    onClick={() => router.push('/on-trip')}
                    disabled={!arrived}
                    className={`w-full rounded-2xl py-4 text-sm font-bold tracking-wide transition-all duration-300 ${arrived
                            ? 'bg-emerald-500 text-[#070b14] hover:bg-emerald-400 active:scale-[0.99] shadow-[0_8px_24px_-8px_rgba(52,211,153,0.6)]'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {arrived ? "I've Arrived — Start Trip" : 'Heading to pickup...'}
                </button>
            </main>
        </div>
    );
}