'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Phone, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useDriverSignMutation, useRegisterDriverMutation } from '@/redux/features/driver/driverApi';

export default function DriverLoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);
    const [signIn, { isLoading }] = useDriverSignMutation()
    const [registerDriver, {isLoading:registerLoader}] = useRegisterDriverMutation()

    const handleSubmit = () => {
        if (!contact.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push(mode === 'login' ? '/dashboard' : '/onboarding');
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex items-center justify-center px-4">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center mx-auto mb-4">
                        <Car className="w-7 h-7 text-sky-400" />
                    </div>
                    <div className="text-xl font-black tracking-tight">
                        Apex<span className="text-sky-400">Drive</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1.5">Drive. Earn. Grow with us.</p>
                </div>

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 animate-[fadeSlideUp_0.5s_ease-out]">
                    <div className="flex bg-slate-900/60 rounded-xl p-1 mb-5">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-sky-500 text-[#070b14]' : 'text-slate-400'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-sky-500 text-[#070b14]' : 'text-slate-400'}`}
                        >
                            Register
                        </button>
                    </div>

                    <label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5 block">
                        Phone or Email
                    </label>
                    <div className="relative mb-4">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="+880 1XXX-XXXXXX"
                            className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 pl-10 pr-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-sky-500 text-sm transition-all"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!contact.trim() || loading}
                        className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${contact.trim() && !loading
                                ? 'bg-sky-500 hover:bg-sky-400 text-[#070b14] shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)] active:scale-[0.98]'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <span>{mode === 'login' ? 'Continue' : 'Create Driver Account'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <p className="text-[11px] text-slate-500 text-center mt-5">
                        {mode === 'login' ? "New driver?" : 'Already registered?'}{' '}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-sky-400 font-semibold hover:underline"
                        >
                            {mode === 'login' ? 'Register here' : 'Login here'}
                        </button>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}