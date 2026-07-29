'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { setCookie } from 'cookies-next/client';
 
import { useDriverSignMutation, useRegisterDriverMutation } from '@/redux/features/driver/driverApi';
import { toast } from 'sonner';
 

export default function DriverLoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [contact, setContact] = useState('');

    const [signIn, { isLoading: isSigningIn }] = useDriverSignMutation();
    const [registerDriver, { isLoading: isRegistering }] = useRegisterDriverMutation();

    const isSubmitting = isSigningIn || isRegistering;

    const handleSubmit = async () => {
        if (!contact.trim()) return;

        try {
            if (mode === 'login') {
                // Sign In Handling
                const result = await signIn({ identifier: contact }).unwrap();

                if (result?.success && result?.token) {
                    setCookie('token', result.token, { maxAge: 12 * 24 * 60 * 60 });
                    toast.success(result?.message || 'Signed in successfully!');
                    router.push('/driver');
                } else if (result && !result.isExist) {
                    toast.error('Driver account does not exist. Please register.');
                    setMode('register');
                }
            } else {
                const result = await registerDriver({ identifier: contact }).unwrap();
                if (result?.success) {
                    localStorage.setItem('pending_driver_onboarding', JSON.stringify(result?.data));
                    toast.success(result?.message);
                    router.push('/driver/auth/sign-up');
                }
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong. Please try again.');
        }
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
                            type="button"
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-sky-500 text-[#070b14]' : 'text-slate-400'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-sky-500 text-[#070b14]' : 'text-slate-400'
                                }`}
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
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="+880 1XXX-XXXXXX or email@domain.com"
                            className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 pl-10 pr-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-sky-500 text-sm transition-all"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!contact.trim() || isSubmitting}
                        className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${contact.trim() && !isSubmitting
                                ? 'bg-sky-500 hover:bg-sky-400 text-[#070b14] shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)] active:scale-[0.98]'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <span>{mode === 'login' ? 'Continue' : 'Create Driver Account'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <p className="text-[11px] text-slate-500 text-center mt-5">
                        {mode === 'login' ? 'New driver?' : 'Already registered?'}{' '}
                        <button
                            type="button"
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