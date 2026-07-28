import { Car, Wallet, ShieldAlert, ArrowRightLeft, UserCircle2, UserPlus } from 'lucide-react';
import Link from 'next/link';



export default function Navbar() {
    return (
        <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-40 px-4 py-3.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* Brand Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="bg-gradient-to-tr from-sky-500 to-sky-600 p-2 rounded-xl text-white shadow-lg shadow-sky-500/15">
                        <Car className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-black text-slate-100 tracking-wider">APEXRIDE</div>
                        <div className="text-[9px] font-mono font-bold tracking-widest text-sky-400 bg-sky-950 px-1.5 py-0.2 rounded mt-0.5 border border-sky-900/50">FLEET OS</div>
                    </div>
                </div>

                {/* Desktop Links (Static representation for layout) */}
                <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
                    <a href="#booking-panel" className="hover:text-slate-100 transition-colors">Book Travel</a>
                    <a href="#driver-panel" className="hover:text-slate-100 transition-colors">Drive With Us</a>
                    <a href="#features-grid" className="hover:text-slate-100 transition-colors">Global Safety</a>
                    <span className="w-[1px] h-3 bg-slate-800" />
                    <div className="flex items-center gap-2 text-[11px] bg-slate-900 px-3 py-1.5 rounded-full border border-slate-850">
                        <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-mono text-slate-300 font-bold">$0.00</span>
                        <span className="text-slate-500 text-[9px]">Credit</span>
                    </div>
                </div>

                {/* Global Perspective Mode Switcher */}
                <div className="flex items-center gap-2">

                    {/* Become a Rider CTA — replaces the old Rider/Driver toggle */}
                    <Link href='/driver/auth/sign-in'>
                        <button
                            type="button"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20 hover:from-sky-400 hover:to-sky-500 transition-all cursor-pointer active:scale-[0.97]">
                            <UserPlus className="w-3.5 h-3.5" />
                            Become a Rider
                        </button>
                    </Link>

                    {/* User Profile menu placeholder */}
                    <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-full">
                        <div className="w-6.5 h-6.5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-sky-400 font-extrabold border border-slate-700 font-mono">
                            U
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium font-mono hidden lg:inline max-w-[120px] truncate pr-1">
                            xyz.gmail.com
                        </span>
                        <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                    </div>

                </div>

            </div>
        </nav>
    );
}