'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, Wallet, Star, ArrowRight } from 'lucide-react';

const TRIP = {
    riderName: 'Ayesha Rahman',
    fare: 245,
    commissionPct: 15,
    distanceKm: 6.8,
    durationMin: 16,
    paymentMethod: 'Cash',
};

export default function DriverTripSummaryPage() {
    const router = useRouter();
    const commission = Math.round(TRIP.fare * (TRIP.commissionPct / 100));
    const netEarning = TRIP.fare - commission;

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex items-center justify-center px-4 py-10">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-emerald-400" strokeWidth={3} />
                    </div>
                    <h1 className="text-xl font-bold mb-1">Trip Completed!</h1>
                    <p className="text-sm text-slate-500">with {TRIP.riderName}</p>
                </div>

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 mb-4">
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-800">
                        <div className="bg-slate-900/40 rounded-xl px-3.5 py-3">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Distance</div>
                            <div className="text-sm font-bold font-mono">{TRIP.distanceKm} km</div>
                        </div>
                        <div className="bg-slate-900/40 rounded-xl px-3.5 py-3">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Duration</div>
                            <div className="text-sm font-bold font-mono">{TRIP.durationMin} mins</div>
                        </div>
                    </div>

                    <div className="space-y-2.5 text-sm mb-4">
                        <div className="flex justify-between text-slate-400">
                            <span>Trip fare</span>
                            <span className="font-mono">৳{TRIP.fare.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-rose-400">
                            <span>Platform commission ({TRIP.commissionPct}%)</span>
                            <span className="font-mono">&minus; ৳{commission.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <span className="text-base font-bold">You earned</span>
                        <span className="text-xl font-bold font-mono text-emerald-400">৳{netEarning.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                        <Wallet className="w-3.5 h-3.5" />
                        Paid via {TRIP.paymentMethod} — added to your daily earnings
                    </div>
                </div>

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-5 mb-6 text-center">
                    <p className="text-xs text-slate-500 mb-2">Rate your rider</p>
                    <div className="flex items-center justify-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-6 h-6 text-slate-700 hover:text-amber-400 cursor-pointer transition-colors" />
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-sky-500 hover:bg-sky-400 text-[#070b14] font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)]"
                >
                    <span>Back to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}