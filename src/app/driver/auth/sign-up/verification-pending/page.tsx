'use client';

import React from 'react';
import { Clock, FileCheck, ShieldCheck, Mail, RefreshCw } from 'lucide-react';

const CHECKLIST = [
    { label: 'Personal information', done: true },
    { label: 'Vehicle information', done: true },
    { label: 'Document verification', done: false },
    { label: 'Background check', done: false },
];

export default function VerificationPendingPage() {
    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex items-center justify-center px-4">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center">
                        <Clock className="w-9 h-9 text-amber-400" />
                    </div>
                    <span className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping" />
                </div>

                <h1 className="text-xl font-bold mb-2">Your application is under review</h1>
                <p className="text-sm text-slate-500 mb-8">
                    This usually takes 24–48 hours. We'll notify you by SMS and email once approved.
                </p>

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 text-left mb-6">
                    <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-4">
                        Review Checklist
                    </div>
                    <div className="space-y-3">
                        {CHECKLIST.map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                {item.done ? (
                                    <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-700 shrink-0" />
                                )}
                                <span className={`text-sm ${item.done ? 'text-slate-300' : 'text-slate-500'}`}>{item.label}</span>
                                {item.done && <span className="ml-auto text-[10px] text-emerald-400 font-semibold">Done</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 justify-center mb-6">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Your documents are encrypted and reviewed securely
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-slate-600 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Check Status
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-slate-600 transition-colors">
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}