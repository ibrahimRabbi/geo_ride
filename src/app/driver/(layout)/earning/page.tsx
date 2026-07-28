'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Wallet, TrendingUp, Calendar, ArrowDownToLine, Clock } from 'lucide-react';

const PERIODS = ['Today', 'This Week', 'This Month'];

const EARNINGS_BY_PERIOD = {
    Today: { total: 1240, trips: 14 },
    'This Week': { total: 8420, trips: 92 },
    'This Month': { total: 34500, trips: 380 },
};

const RECENT_PAYOUTS = [
    { date: '20 Jul, 2026', amount: 5200, status: 'Completed' },
    { date: '13 Jul, 2026', amount: 4980, status: 'Completed' },
    { date: '06 Jul, 2026', amount: 5150, status: 'Completed' },
];

export default function DriverEarningsPage() {
    const router = useRouter();
    const [period, setPeriod] = useState('Today');
    const data = EARNINGS_BY_PERIOD[period];

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            <header className="border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
                    <button onClick={() => router.push('/dashboard')} className="p-2 rounded-full hover:bg-slate-800/60 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold">Earnings</span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                <div className="flex bg-slate-900/60 rounded-xl p-1 mb-5">
                    {PERIODS.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${period === p ? 'bg-sky-500 text-[#070b14]' : 'text-slate-400'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-sky-500/15 to-emerald-500/5 border border-sky-500/25 rounded-3xl p-6 mb-5 text-center">
                    <Wallet className="w-6 h-6 text-sky-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold font-mono">৳{data.total.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">{data.trips} trips completed</div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-bold py-3.5 rounded-2xl text-sm mb-6 transition-all active:scale-[0.99] shadow-[0_8px_24px_-8px_rgba(52,211,153,0.6)]">
                    <ArrowDownToLine className="w-4 h-4" />
                    Withdraw to bKash
                </button>

                <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-3">Recent Payouts</div>
                <div className="space-y-2.5">
                    {RECENT_PAYOUTS.map((p, i) => (
                        <div key={i} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">৳{p.amount.toLocaleString()}</div>
                                    <div className="text-[11px] text-slate-500">{p.date}</div>
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                {p.status}
                            </span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}