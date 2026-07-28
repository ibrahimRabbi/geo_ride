'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, User, Car, FileText, LogOut, ChevronRight, Star } from 'lucide-react';

const MENU_ITEMS = [
    { label: 'Personal Information', icon: User },
    { label: 'Vehicle Information', icon: Car },
    { label: 'Documents', icon: FileText },
];

export default function DriverProfilePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            <header className="border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
                    <button onClick={() => router.push('/dashboard')} className="p-2 rounded-full hover:bg-slate-800/60 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold">Profile</span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6">
                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 mb-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-sky-500/20 border-2 border-sky-500/40 flex items-center justify-center text-sky-400 text-2xl font-bold mx-auto mb-3">
                        R
                    </div>
                    <div className="text-lg font-bold">Rafiq Islam</div>
                    <div className="text-xs text-slate-500 mb-2">+880 1712-345678</div>
                    <div className="flex items-center justify-center gap-1 text-sm text-amber-400">
                        <Star className="w-3.5 h-3.5" fill="currentColor" />
                        4.92 &middot; <span className="text-slate-500">1,240 trips</span>
                    </div>
                </div>

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl overflow-hidden mb-6">
                    {MENU_ITEMS.map((item, i) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-900/60 transition-colors ${i !== MENU_ITEMS.length - 1 ? 'border-b border-slate-800' : ''}`}
                        >
                            <item.icon className="w-4 h-4 text-sky-400 shrink-0" />
                            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                    ))}
                </div>

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-5 mb-6">
                    <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-3">Vehicle</div>
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center shrink-0">
                            <Car className="w-6 h-6 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold">Toyota Axio</div>
                            <div className="text-xs text-slate-500">Pearl White</div>
                        </div>
                        <div className="text-sm font-mono font-bold bg-slate-800/80 px-3 py-1.5 rounded-lg tracking-wide shrink-0">
                            DHA 15-4471
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/login')}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold rounded-2xl py-3.5 border border-rose-500/30 text-rose-400 bg-rose-500/[0.06] hover:bg-rose-500/10 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </main>
        </div>
    );
}