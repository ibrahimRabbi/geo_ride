'use client';
import React, { useState } from 'react';
import { X, ArrowRight, QrCode, Apple } from 'lucide-react';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { setCookie } from 'cookies-next/client';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
 
    onSuccess: () => void;
}

 
function GoogleIcon() {
    return (
        <svg viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.5 18.9 12 24 12c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.5 0-13.9 4.2-17.2 10.4z" />
            <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.9 39.7 16.4 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.3 5.3C39.9 36.7 44 31 44 24c0-1.3-.1-2.7-.4-3.5z" />
        </svg>
    );
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const [contact, setContact] = useState('');
    const [login, { isLoading }] = useLoginMutation();

    if (!isOpen) return null;

    const handleContinue = async () => {
        if (!contact.trim()) return;

        try {
            const result = await login({ identifier: contact }).unwrap();
            if (result?.success) {
                setCookie('token', result.token, {maxAge: 12 * 24 * 60 * 60});
                onSuccess();
            }

             
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                onClick={onClose}
            />

            {/* Modal card */}
            <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-[popIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="mb-6">
                    <div className="text-lg font-black text-slate-100 tracking-tight mb-1">
                        Geo<span className="text-sky-400">Made</span>
                    </div>
                    <h2 className="text-sm font-semibold text-slate-300">Log in or sign up to see your fare and estimation</h2>
                </div>

                {/* Phone / email input */}
                <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter phone number or email"
                    className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-sky-500 text-sm transition-all shadow-inner mb-3"
                />

                {/* Continue */}
                <button
                    type="button"
                    disabled={!contact.trim()}
                    onClick={handleContinue}
                    className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 text-sm transition-all mb-5 ${contact.trim()
                            ? 'bg-sky-500 hover:bg-sky-400 text-[#070b14] shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)] active:scale-[0.98] cursor-pointer'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-slate-800" />
                    <span className="text-[11px] text-slate-500">or</span>
                    <div className="flex-1 h-px bg-slate-800" />
                </div>

                {/* Social login */}
                <div className="space-y-2.5 mb-5">
                    <button
                        type="button"
                        onClick={onSuccess}
                        className="w-full flex items-center justify-center gap-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-200 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                    >
                        <GoogleIcon />
                        <span>Continue with Google</span>
                    </button>
                    <button
                        type="button"
                        onClick={onSuccess}
                        className="w-full flex items-center justify-center gap-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-200 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                    >
                        <Apple className="w-4 h-4" />
                        <span>Continue with Apple</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-slate-800" />
                    <span className="text-[11px] text-slate-500">or</span>
                    <div className="flex-1 h-px bg-slate-800" />
                </div>

                {/* QR login */}
                <button
                    type="button"
                    onClick={onSuccess}
                    className="w-full flex items-center justify-center gap-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-200 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                >
                    <QrCode className="w-4 h-4 text-sky-400" />
                    <span>Log in with QR code</span>
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popIn {
                    0% { transform: scale(0.92); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}