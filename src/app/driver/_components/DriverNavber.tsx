'use client'
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DriverNavber = () => {

    const router = useRouter()


    return (

        <nav className="relative z-10 text-white border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                <span className="text-lg font-bold ">
                    Apex<span className="text-sky-400">Drive</span>
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => router.push('/notifications')} className="p-2 rounded-full hover:bg-slate-800/60 transition-colors relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                    </button>
                    <button onClick={() => router.push('/profile')} className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 text-sm font-bold">
                        R
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default DriverNavber;