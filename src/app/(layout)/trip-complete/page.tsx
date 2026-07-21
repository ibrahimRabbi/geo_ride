'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Check,
    MapPin,
    Navigation,
    Clock,
    Route,
    Wallet,
    Receipt,
    Star,
} from 'lucide-react';

// Swap with real data returned once the ride reaches status "completed"
const DRIVER = {
    name: 'Rafiq Islam',
    photoInitial: 'R',
    vehicleModel: 'Toyota Axio',
};

const TRIP = {
    pickup: 'Downtown Innovation Hub',
    destination: 'Metro Central Station',
    distanceKm: 9.3,
    durationMin: 22,
    baseFare: 40,
    distanceFare: 380,
    timeFare: 44,
    promoDiscount: 90,
};

const total = TRIP.baseFare + TRIP.distanceFare + TRIP.timeFare - TRIP.promoDiscount;

export default function TripCompletePage() {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [paying, setPaying] = useState(false);
    const [paid, setPaid] = useState(false);

    const handlePay = () => {
        setPaying(true);
        // POST /api/payment/checkout would fire here
        setTimeout(() => {
            setPaying(false);
            setPaid(true);
            setTimeout(() => router.push('/rating'), 1100);
        }, 1600);
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            {/* Ambient background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px]" />
            </div>

          
            <main className="relative z-10 max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Success headline */}
                <div className="text-center mb-8 animate-[fadeSlideUp_0.5s_ease-out]" style={{ animationFillMode: 'backwards' }}>
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
                            <Check className="w-8 h-8 text-emerald-400" strokeWidth={3} />
                        </div>
                        <span className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-[radarPing_1.6s_ease-out_infinite]" />
                    </div>
                    <h1 className="text-2xl font-bold mb-1.5">You&apos;ve arrived!</h1>
                    <p className="text-sm text-slate-500">
                        Trip with {DRIVER.name} &middot; {DRIVER.vehicleModel}
                    </p>
                </div>

                {/* Route summary card */}
                <div
                    className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 mb-4 animate-[fadeSlideUp_0.5s_ease-out_0.08s]"
                    style={{ animationFillMode: 'backwards' }}
                >
                    <div className="relative pl-1 mb-5">
                        <div className="absolute left-[7px] top-[10px] bottom-[26px] w-[2px] bg-gradient-to-b from-sky-500 to-emerald-500" />
                        <div className="flex items-start gap-3 mb-4">
                            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-sky-500/20 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Pickup</div>
                                <div className="text-sm font-medium truncate">{TRIP.pickup}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 ring-4 ring-emerald-500/20 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Destination</div>
                                <div className="text-sm font-medium truncate">{TRIP.destination}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-2.5 bg-slate-900/40 rounded-xl px-3.5 py-3">
                            <Route className="w-4 h-4 text-sky-400 shrink-0" />
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Distance</div>
                                <div className="text-sm font-bold font-mono">{TRIP.distanceKm} km</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 bg-slate-900/40 rounded-xl px-3.5 py-3">
                            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Duration</div>
                                <div className="text-sm font-bold font-mono">{TRIP.durationMin} mins</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fare breakdown */}
                <div
                    className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 mb-4 animate-[fadeSlideUp_0.5s_ease-out_0.14s]"
                    style={{ animationFillMode: 'backwards' }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Receipt className="w-4 h-4 text-slate-500" />
                        <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">Fare breakdown</h2>
                    </div>

                    <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between text-slate-400">
                            <span>Base fare</span>
                            <span className="font-mono tabular-nums">BDT {TRIP.baseFare.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Distance ({TRIP.distanceKm} km)</span>
                            <span className="font-mono tabular-nums">BDT {TRIP.distanceFare.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Time ({TRIP.durationMin} mins)</span>
                            <span className="font-mono tabular-nums">BDT {TRIP.timeFare.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-400">
                            <span>Promo discount</span>
                            <span className="font-mono tabular-nums">&minus; BDT {TRIP.promoDiscount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                        <span className="text-base font-bold">Total</span>
                        <span className="text-xl font-bold font-mono tabular-nums">BDT {total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment method — locked in, since it was committed at ride request time */}
                <div
                    className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 mb-6 animate-[fadeSlideUp_0.5s_ease-out_0.2s]"
                    style={{ animationFillMode: 'backwards' }}
                >
                    <label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-2 block">
                        Paid with
                    </label>
                    <div className="w-full flex items-center justify-between bg-slate-900/60 border border-slate-700/60 rounded-xl px-3.5 py-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-sky-500/15 flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-sky-400" />
                            </div>
                            <span className="text-sm font-medium">
                                {paymentMethod === 'wallet' ? 'Wallet balance' : 'Card ending 4471'}
                            </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            Selected at request
                        </span>
                    </div>
                </div>

                {/* Pay button */}
                <button
                    onClick={handlePay}
                    disabled={paying || paid}
                    className={`w-full rounded-2xl py-4 text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${paid
                            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 cursor-default'
                            : 'bg-sky-500 text-[#070b14] hover:bg-sky-400 active:scale-[0.99] shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)] disabled:opacity-70'
                        }`}
                >
                    {paid ? (
                        <>
                            <Check className="w-4 h-4" strokeWidth={3} />
                            Payment successful
                        </>
                    ) : paying ? (
                        <>
                            <span className="w-4 h-4 border-2 border-[#070b14]/30 border-t-[#070b14] rounded-full animate-spin" />
                            Processing payment...
                        </>
                    ) : (
                        `Pay BDT ${total.toFixed(2)}`
                    )}
                </button>

                {paid && (
                    <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5 animate-[fadeSlideUp_0.3s_ease-out]">
                        <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                        Taking you to rate your trip...
                    </p>
                )}
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