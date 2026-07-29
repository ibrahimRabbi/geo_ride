'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Power,
    Wallet,
    Star,
    TrendingUp,
    Bell,
    User,
    History,
    HelpCircle,
    Navigation,
    MapPin,
    AlertTriangle,
} from 'lucide-react';
import { useGetDriverProfileQuery, useUpdateLocationMutation } from '@/redux/features/driver/driverApi';
import { getAddressFromCoords } from '@/lib/getAddressFromCoords';
 

type LocationState = {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
};

type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported' | 'error';

const LOCATION_UPDATE_THROTTLE_MS = 10000;
const ADDRESS_UPDATE_THROTTLE_MS = 30000;



export default function DriverDashboardPage() {

    const router = useRouter();
    const [online, setOnline] = useState(false);
    const { data: profile, isLoading } = useGetDriverProfileQuery({});
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
    });
    const [address, setAddress] = useState<string | null>(null);
    const [isAddressLoading, setIsAddressLoading] = useState(false);

    const [updateLocation] = useUpdateLocationMutation();
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
    const watchIdRef = useRef<number | null>(null);
    const lastSentAtRef = useRef<number>(0);
    const lastAddressFetchAtRef = useRef<number>(0);
    const isApproved = !isLoading && !!profile?.data && profile.data?.status !== 'pending';


    const sendLocationToBackend = useCallback(
        (latitude: number, longitude: number) => {
            updateLocation({
                coordinates: [longitude, latitude],
            })
                .unwrap()
                .catch((err) => {
                    console.error('Failed to update location on server:', err);
                });
        },
        [updateLocation]
    );

    const fetchAndSetAddress = useCallback(async (latitude: number, longitude: number) => {
        setIsAddressLoading(true);
        const result = await getAddressFromCoords(latitude, longitude);
        setAddress(result);
        setIsAddressLoading(false);
    }, []);

    // Auth + status guard
    useEffect(() => {
        if (isLoading) return;

        if (!profile?.data) {
            router.push('/driver/auth/sign-in');
            return;
        }

        if (profile.data?.status === 'pending') {
            router.push('/driver/auth/verification-pending');
            return;
        }
    }, [isLoading, profile, router]);

    // Location access
    useEffect(() => {
        if (!isApproved) return;

        if (!('geolocation' in navigator)) {
            setLocationStatus('unsupported');
            return;
        }

        setLocationStatus('requesting');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setLocation({ latitude, longitude, accuracy });
                setLocationStatus('granted');

                sendLocationToBackend(latitude, longitude);
                lastSentAtRef.current = Date.now();

                fetchAndSetAddress(latitude, longitude);
                lastAddressFetchAtRef.current = Date.now();
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationStatus('denied');
                } else {
                    setLocationStatus('error');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setLocation({ latitude, longitude, accuracy });
                setLocationStatus('granted');

                const now = Date.now();

                if (now - lastSentAtRef.current >= LOCATION_UPDATE_THROTTLE_MS) {
                    sendLocationToBackend(latitude, longitude);
                    lastSentAtRef.current = now;
                }

                if (now - lastAddressFetchAtRef.current >= ADDRESS_UPDATE_THROTTLE_MS) {
                    fetchAndSetAddress(latitude, longitude);
                    lastAddressFetchAtRef.current = now;
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationStatus('denied');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000,
            }
        );

        watchIdRef.current = watchId;

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [isApproved, sendLocationToBackend, fetchAndSetAddress]);

    useEffect(() => {
        if (!online) return;
        const t = setTimeout(() => router.push('/ride-request'), 4000);
        return () => clearTimeout(t);
    }, [online, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-sky-400 animate-spin" />
                        <div
                            className="absolute inset-2 rounded-full border-2 border-transparent border-b-emerald-400 border-l-emerald-400"
                            style={{ animation: 'spin 1.4s linear infinite reverse' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="absolute w-10 h-10 rounded-full bg-sky-500/20 animate-ping" />
                            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/30 flex items-center justify-center backdrop-blur-sm">
                                <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                        <p className="text-sm font-semibold bg-gradient-to-r from-sky-400 via-slate-100 to-emerald-400 bg-clip-text text-transparent tracking-wide animate-[shimmer_2s_ease-in-out_infinite]">
                            Loading your dashboard
                        </p>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes shimmer {
                        0%, 100% { opacity: 0.7; }
                        50% { opacity: 1; }
                    }
                `}</style>
            </div>
        );
    }

    if (!profile?.data || profile.data?.status === 'pending') {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-20">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-4 py-6">
                {locationStatus === 'denied' && (
                    <div className="mb-5 flex items-start gap-3 text-xs text-amber-400 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold mb-0.5">Location access needed</p>
                            <p className="text-amber-400/70">
                                give a location permission from browser settings
                            </p>
                        </div>
                    </div>
                )}

                {locationStatus === 'unsupported' && (
                    <div className="mb-5 flex items-start gap-3 text-xs text-rose-400 bg-rose-500/[0.06] border border-rose-500/20 rounded-xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>unsupported location access</p>
                    </div>
                )}

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 mb-5 text-center">
                    <button
                        onClick={() => setOnline((o) => !o)}
                        disabled={locationStatus !== 'granted'}
                        className={`relative cursor-pointer w-28 h-28 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${online
                            ? 'bg-emerald-500/15 border-2 border-emerald-500 shadow-[0_0_40px_-6px_rgba(52,211,153,0.6)]'
                            : 'bg-slate-900 border-2 border-slate-700'
                            } ${locationStatus !== 'granted' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {online && <span className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping" />}
                        <Power className={`w-10 h-10 ${online ? 'text-emerald-400' : 'text-slate-500'}`} />
                    </button>
                    <div className="mt-4 text-lg font-bold">{online ? "You're Online" : "You're Offline"}</div>
                    <p className="text-xs text-slate-500 mt-1">
                        {locationStatus === 'requesting'
                            ? 'Getting your location...'
                            : online
                                ? 'Looking for ride requests near you...'
                                : 'Tap the button to start receiving rides'}
                    </p>

                    {/* এখানে lat/lng এর বদলে human-readable address দেখানো হচ্ছে */}
                    {locationStatus === 'granted' && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-900/50 px-2.5 py-1.5 rounded-full max-w-full">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">
                                {isAddressLoading
                                    ? 'Detecting your address...'
                                    : address ?? `${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}`}
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4">
                        <Wallet className="w-4 h-4 text-sky-400 mb-2" />
                        <div className="text-lg font-bold font-mono">৳1,240</div>
                        <div className="text-[10px] text-slate-500">Today</div>
                    </div>
                    <div className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4">
                        <TrendingUp className="w-4 h-4 text-emerald-400 mb-2" />
                        <div className="text-lg font-bold font-mono">14</div>
                        <div className="text-[10px] text-slate-500">Trips today</div>
                    </div>
                    <div className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4">
                        <Star className="w-4 h-4 text-amber-400 mb-2" fill="currentColor" />
                        <div className="text-lg font-bold font-mono">4.92</div>
                        <div className="text-[10px] text-slate-500">Rating</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button onClick={() => router.push('/earnings')} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-slate-700 transition-colors">
                        <Wallet className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold">Earnings</span>
                    </button>
                    <button onClick={() => router.push('/ride-history')} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-slate-700 transition-colors">
                        <History className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold">Ride History</span>
                    </button>
                    <button onClick={() => router.push('/ratings')} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-slate-700 transition-colors">
                        <Star className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold">Ratings</span>
                    </button>
                    <button onClick={() => router.push('/support')} className="bg-[#0d1420] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-slate-700 transition-colors">
                        <HelpCircle className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold">Support</span>
                    </button>
                </div>

                {online && (
                    <div className="mt-5 flex items-center gap-2 text-xs text-sky-400 bg-sky-500/[0.06] border border-sky-500/20 rounded-xl px-4 py-3 animate-[fadeSlideUp_0.3s_ease-out]">
                        <Navigation className="w-3.5 h-3.5 animate-pulse" />
                        Searching for nearby ride requests...
                    </div>
                )}
            </main>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}