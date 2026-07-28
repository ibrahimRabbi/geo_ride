'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Star } from 'lucide-react';

const RIDES = [
    { id: 1, rider: 'Ayesha Rahman', date: '26 Jul, 10:42 PM', from: 'Dhanmondi 27', to: 'Bashundhara City', fare: 245, rating: 5 },
    { id: 2, rider: 'Tanvir Ahmed', date: '26 Jul, 09:10 PM', from: 'Uttara Sector 7', to: 'Gulshan 2', fare: 380, rating: 4 },
    { id: 3, rider: 'Nusrat Jahan', date: '26 Jul, 07:55 PM', from: 'Mirpur 10', to: 'Farmgate', fare: 190, rating: 5 },
    { id: 4, rider: 'Kamal Hossain', date: '25 Jul, 11:20 PM', from: 'Banani', to: 'Airport', fare: 420, rating: 5 },
    { id: 5, rider: 'Sadia Islam', date: '25 Jul, 08:05 PM', from: 'Motijheel', to: 'Dhanmondi', fare: 210, rating: 3 },
];

export default function DriverRideHistoryPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            <header className="border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
                    <button onClick={() => router.push('/dashboard')} className="p-2 rounded-full hover:bg-slate-800/60 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold">Ride History</span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6 space-y-3">
                {RIDES.map((ride) => (
                    <div key={ride.id} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="text-sm font-semibold">{ride.rider}</div>
                                <div className="text-[11px] text-slate-500">{ride.date}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold font-mono text-emerald-400">৳{ride.fare}</div>
                                <div className="flex items-center gap-0.5 justify-end text-[11px] text-amber-400">
                                    <Star className="w-3 h-3" fill="currentColor" /> {ride.rating}
                                </div>
                            </div>
                        </div>
                        <div className="relative pl-1">
                            <div className="absolute left-[6px] top-[8px] bottom-[16px] w-[1.5px] bg-slate-700" />
                            <div className="flex items-center gap-2.5 mb-2">
                                <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
                                <span className="text-xs text-slate-400 truncate">{ride.from}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
                                <span className="text-xs text-slate-400 truncate">{ride.to}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}