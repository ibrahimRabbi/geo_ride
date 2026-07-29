'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Power,
    Wallet,
    Star,
    TrendingUp,
    Bell,
    User,
    History,
    HelpCircle,
    Navigation,
} from 'lucide-react';
import { useGetDriverProfileQuery } from '@/redux/features/driver/driverApi';

export default function DriverDashboardPage() {
    const router = useRouter();
    const [online, setOnline] = useState(false);
    const { data: profile, isLoading } = useGetDriverProfileQuery({});

    // Auth + status guard
    useEffect(() => {
        if (isLoading) return;

        if (!profile?.data) {
            router.push('/driver/auth/sign-in');
            return;
        }

        if (profile.data?.status === 'pending') {
            router.push('/driver/auth/verification-pending');
            return;
        }
    }, [isLoading, profile, router]);

    // Simulate an incoming ride request 4s after going online
    useEffect(() => {
        if (!online) return;
        const t = setTimeout(() => router.push('/ride-request'), 4000);
        return () => clearTimeout(t);
    }, [online, router]);

  
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center relative overflow-hidden">
                {/* Ambient glow background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                    {/* Spinner */}
                    <div className="relative w-24 h-24">
                        {/* Outer rotating ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-sky-400 animate-spin" />

                        {/* Middle rotating ring (reverse) */}
                        <div
                            className="absolute inset-2 rounded-full border-2 border-transparent border-b-emerald-400 border-l-emerald-400"
                            style={{ animation: 'spin 1.4s linear infinite reverse' }}
                        />

                        {/* Pulsing glow core */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="absolute w-10 h-10 rounded-full bg-sky-500/20 animate-ping" />
                            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/30 flex items-center justify-center backdrop-blur-sm">
                                <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col items-center gap-1.5">
                        <p className="text-sm font-semibold bg-gradient-to-r from-sky-400 via-slate-100 to-emerald-400 bg-clip-text text-transparent tracking-wide animate-[shimmer_2s_ease-in-out_infinite]">
                            Loading your dashboard
                        </p>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes shimmer {
                        0%, 100% { opacity: 0.7; }
                        50% { opacity: 1; }
                    }
                `}</style>
            </div>
        );
    }

    if (!profile?.data || profile.data?.status === 'pending') {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-20">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-4 py-6">
                {/* Online/Offline toggle */}
                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 mb-5 text-center">
                    <button
                        onClick={() => setOnline((o) => !o)}
                        className={`relative w-28 h-28 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${online
                            ? 'bg-emerald-500/15 border-2 border-emerald-500 shadow-[0_0_40px_-6px_rgba(52,211,153,0.6)]'
                            : 'bg-slate-900 border-2 border-slate-700'
                            }`}
                    >
                        {online && <span className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping" />}
                        <Power className={`w-10 h-10 ${online ? 'text-emerald-400' : 'text-slate-500'}`} />
                    </button>
                    <div className="mt-4 text-lg font-bold">{online ? "You're Online" : "You're Offline"}</div>
                    <p className="text-xs text-slate-500 mt-1">
                        {online ? 'Looking for ride requests near you...' : 'Tap the button to start receiving rides'}
                    </p>
                </div>

                {/* Earnings summary */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4">
                        <Wallet className="w-4 h-4 text-sky-400 mb-2" />
                        <div className="text-lg font-bold font-mono">৳1,240</div>
                        <div className="text-[10px] text-slate-500">Today</div>
                    </div>
                    <div className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4">
                        <TrendingUp className="w-4 h-4 text-emerald-400 mb-2" />
                        <div className="text-lg font-bold font-mono">14</div>
                        <div className="text-[10px] text-slate-500">Trips today</div>
                    </div>
                    <div className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4">
                        <Star className="w-4 h-4 text-amber-400 mb-2" fill="currentColor" />
                        <div className="text-lg font-bold font-mono">4.92</div>
                        <div className="text-[10px] text-slate-500">Rating</div>
                    </div>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button onClick={() => router.push('/earnings')} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-slate-700 transition-colors">
                        <Wallet className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold">Earnings</span>
                    </button>
                    <button onClick={() => router.push('/ride-history')} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-slate-700 transition-colors">
                        <History className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold">Ride History</span>
                    </button>
                    <button onClick={() => router.push('/ratings')} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-slate-700 transition-colors">
                        <Star className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold">Ratings</span>
                    </button>
                    <button onClick={() => router.push('/support')} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-slate-700 transition-colors">
                        <HelpCircle className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold">Support</span>
                    </button>
                </div>

                {online && (
                    <div className="mt-5 flex items-center gap-2 text-xs text-sky-400 bg-sky-500/[0.06] border border-sky-500/20 rounded-xl px-4 py-3 animate-[fadeSlideUp_0.3s_ease-out]">
                        <Navigation className="w-3.5 h-3.5 animate-pulse" />
                        Searching for nearby ride requests...
                    </div>
                )}
            </main>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}