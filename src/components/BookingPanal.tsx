'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Search, ArrowRight, X, LocateFixed, FlagTriangleRight } from 'lucide-react';
import { Location } from '@/lib/types';
import { MOCK_LOCATIONS } from '@/lib/locations';
import { useRouter } from 'next/navigation';

interface BookingPanelProps {
    pickup: Location | null;
    dropoff: Location | null;
    setPickup: (loc: Location | null) => void;
    setDropoff: (loc: Location | null) => void;
    onContinue?: () => void;
}

// Key used to persist the selected trip locations across the booking flow
const RIDE_LOCATIONS_STORAGE_KEY = 'geoMate_ride_locations';

export default function BookingPanel({
    pickup,
    dropoff,
    setPickup,
    setDropoff,
    onContinue,
}: BookingPanelProps) {
    const [pickupSearch, setPickupSearch] = useState('');
    const [dropoffSearch, setDropoffSearch] = useState('');
    const [showPickupList, setShowPickupList] = useState(false);
    const [showDropoffList, setShowDropoffList] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setPickupSearch(pickup ? pickup.name : '');
    }, [pickup]);

    useEffect(() => {
        setDropoffSearch(dropoff ? dropoff.name : '');
    }, [dropoff]);

    // Formats the selected pickup/dropoff into a clean lat/lng + address payload
    // and persists it to localStorage so later steps (estimation, request) can read it.
    const handleCheckEstimation = () => {
        if (!pickup || !dropoff) return;

        const rideLocations = {
            pickup: {
                address: pickup.name,
                latitude: pickup.coords.y,
                longitude: pickup.coords.x,
            },
            dropoff: {
                address: dropoff.name,
                latitude: dropoff.coords.y,
                longitude: dropoff.coords.x,
            },
            savedAt: new Date().toISOString(),
        };

        try {
            localStorage.setItem(RIDE_LOCATIONS_STORAGE_KEY, JSON.stringify(rideLocations));
            router.push('/estimation');
        } catch (err) {
            console.error('Failed to save ride locations to localStorage:', err);
        }

        onContinue?.();
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-full justify-between gap-6 overflow-hidden">
            <div className="flex flex-col gap-5 h-full justify-between">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">⚡</span>
                            Where are you heading?
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Get custom high-tier upfront fares in seconds.</p>
                    </div>

                    {/* Pickup */}
                    <div className="relative">
                        <label className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-bold">
                            <LocateFixed className="w-3.5 h-3.5 text-emerald-500" />
                            Pickup Location
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                            <input
                                type="text"
                                placeholder="Enter starting point..."
                                value={pickupSearch}
                                onChange={(e) => {
                                    setPickupSearch(e.target.value);
                                    setShowPickupList(true);
                                }}
                                onFocus={() => setShowPickupList(true)}
                                className="w-full bg-slate-950 text-slate-200 pl-9 pr-10 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-emerald-500 text-sm transition-all shadow-inner"
                            />
                            {pickup && (
                                <button
                                    type="button"
                                    onClick={() => setPickup(null)}
                                    className="absolute right-3 text-slate-500 hover:text-slate-300"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {showPickupList && (
                            <div className="absolute left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-30 overflow-hidden max-h-[180px] overflow-y-auto">
                                {MOCK_LOCATIONS.filter((loc) =>
                                    loc.name.toLowerCase().includes(pickupSearch.toLowerCase())
                                ).map((loc) => (
                                    <button
                                        key={loc.id}
                                        type="button"
                                        onClick={() => {
                                            setPickup(loc);
                                            setShowPickupList(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-900 border-b border-slate-900/60 flex items-center gap-2.5 transition-colors"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                        <span className="truncate">{loc.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dropoff */}
                    <div className="relative">
                        <label className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-bold">
                            <FlagTriangleRight className="w-3.5 h-3.5 text-rose-500" />
                            Destination Point
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3.5 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
                            <input
                                type="text"
                                placeholder="Enter dropoff destination..."
                                value={dropoffSearch}
                                onChange={(e) => {
                                    setDropoffSearch(e.target.value);
                                    setShowDropoffList(true);
                                }}
                                onFocus={() => setShowDropoffList(true)}
                                className="w-full bg-slate-950 text-slate-200 pl-9 pr-10 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-rose-500 text-sm transition-all shadow-inner"
                            />
                            {dropoff && (
                                <button
                                    type="button"
                                    onClick={() => setDropoff(null)}
                                    className="absolute right-3 text-slate-500 hover:text-slate-300"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {showDropoffList && (
                            <div className="absolute left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-30 overflow-hidden max-h-[180px] overflow-y-auto">
                                {MOCK_LOCATIONS.filter((loc) =>
                                    loc.name.toLowerCase().includes(dropoffSearch.toLowerCase())
                                ).map((loc) => (
                                    <button
                                        key={loc.id}
                                        type="button"
                                        onClick={() => {
                                            setDropoff(loc);
                                            setShowDropoffList(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-900 border-b border-slate-900/60 flex items-center gap-2.5 transition-colors"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                                        <span className="truncate">{loc.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recommended destinations */}
                    <div className="pt-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
                            Recommended Destinations
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {MOCK_LOCATIONS.slice(0, 4).map((loc) => (
                                <button
                                    key={loc.id}
                                    type="button"
                                    onClick={() => {
                                        if (!pickup) setPickup(loc);
                                        else setDropoff(loc);
                                    }}
                                    className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 px-3 py-1.5 rounded-full text-[11px] text-slate-300 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                    <Search className="w-3 h-3 text-slate-500" />
                                    <span>{loc.name.split(' (')[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    disabled={!pickup || !dropoff}
                    onClick={handleCheckEstimation}
                    className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 text-sm transition-all ${pickup && dropoff
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white shadow-lg shadow-sky-500/25 active:scale-[0.98] cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    <span>Check Ride Estimations</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}