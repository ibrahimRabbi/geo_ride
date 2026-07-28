'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation, X, Check, User, Star } from 'lucide-react';

const INCOMING_RIDE = {
    riderName: 'Ayesha Rahman',
    rating: 4.8,
    pickup: 'Dhanmondi 27, Dhaka',
    destination: 'Bashundhara City, Dhaka',
    distanceToPickup: '1.4 km',
    fare: 245,
    tripDistance: '6.8 km',
};

const COUNTDOWN_START = 15;

export default function RideRequestPage() {
    const router = useRouter();
    const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_START);

    useEffect(() => {
        if (secondsLeft <= 0) {
            router.push('/dashboard'); // auto-decline / request expired
            return;
        }
        const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [secondsLeft, router]);

    const progressPct = (secondsLeft / COUNTDOWN_START) * 100;

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full sm:max-w-md bg-[#0d1420] border border-slate-800/80 sm:rounded-3xl rounded-t-3xl p-6 animate-[slideUp_0.35s_ease-out]">
                {/* Countdown bar */}
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-5">
                    <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-[width] duration-1000 linear"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>

                <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase">New Ride Request</span>
                    <span className="font-mono text-lg font-bold tabular-nums">{secondsLeft}s</span>
                </div>

                {/* Rider info */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold shrink-0">
                        <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{INCOMING_RIDE.riderName}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                            {INCOMING_RIDE.rating}
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-lg font-bold font-mono text-emerald-400">৳{INCOMING_RIDE.fare}</div>
                        <div className="text-[10px] text-slate-500">{INCOMING_RIDE.tripDistance} trip</div>
                    </div>
                </div>

                {/* Route */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-6">
                    <div className="relative pl-1">
                        <div className="absolute left-[7px] top-[10px] bottom-[26px] w-[2px] bg-gradient-to-b from-sky-500 to-emerald-500" />
                        <div className="flex items-start gap-3 mb-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-sky-500/20 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                                    Pickup &middot; {INCOMING_RIDE.distanceToPickup} away
                                </div>
                                <div className="text-sm font-medium truncate">{INCOMING_RIDE.pickup}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 ring-4 ring-emerald-500/20 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Destination</div>
                                <div className="text-sm font-medium truncate">{INCOMING_RIDE.destination}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center justify-center gap-2 text-sm font-bold bg-rose-500/[0.06] border border-rose-500/30 text-rose-400 rounded-2xl py-3.5 hover:bg-rose-500/10 transition-all active:scale-[0.98]"
                    >
                        <X className="w-4 h-4" />
                        Decline
                    </button>
                    <button
                        onClick={() => router.push('/navigate-pickup')}
                        className="flex items-center justify-center gap-2 text-sm font-bold bg-emerald-500 text-[#070b14] rounded-2xl py-3.5 hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(52,211,153,0.6)]"
                    >
                        <Check className="w-4 h-4" />
                        Accept
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}