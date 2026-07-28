'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Wallet, ShieldAlert, Megaphone, Star, XCircle } from 'lucide-react';

const NOTIFICATIONS = [
    { icon: Wallet, color: 'emerald', title: 'Payout completed', desc: '৳5,200 sent to your bKash account.', time: '2h ago' },
    { icon: Star, color: 'amber', title: 'New 5-star rating!', desc: 'Ayesha Rahman rated your trip 5 stars.', time: '5h ago' },
    { icon: Megaphone, color: 'sky', title: 'Weekend bonus active', desc: 'Complete 20 trips this weekend for a ৳500 bonus.', time: '1d ago' },
    { icon: XCircle, color: 'rose', title: 'Ride cancelled', desc: 'Rider cancelled the trip to Motijheel.', time: '1d ago' },
    { icon: ShieldAlert, color: 'amber', title: 'Document expiring soon', desc: 'Your driving license expires in 14 days.', time: '2d ago' },
];

const COLOR_MAP = {
    emerald: 'bg-emerald-500/15 text-emerald-400',
    amber: 'bg-amber-500/15 text-amber-400',
    sky: 'bg-sky-500/15 text-sky-400',
    rose: 'bg-rose-500/15 text-rose-400',
};

export default function DriverNotificationsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            <header className="border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
                    <button onClick={() => router.push('/dashboard')} className="p-2 rounded-full hover:bg-slate-800/60 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold">Notifications</span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6 space-y-2.5">
                {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${COLOR_MAP[n.color]}`}>
                            <n.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold">{n.title}</div>
                            <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                        </div>
                        <span className="text-[10px] text-slate-600 shrink-0">{n.time}</span>
                    </div>
                ))}
            </main>
        </div>
    );
}