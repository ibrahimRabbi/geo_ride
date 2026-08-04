'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Power, Wallet, Star, TrendingUp, HelpCircle, Navigation, MapPin, AlertTriangle, X, Check, Phone, History } from 'lucide-react';
import { useGetDriverProfileQuery, useUpdateDriverMutation } from '@/redux/features/driver/driverApi';
import { getAddressFromCoords } from '@/lib/getAddressFromCoords';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { useLocationTracker } from '@/hooks/LocationTracker';
import Link from 'next/link';

type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported' | 'error';

type RideOfferRider = {
    _id?: string;
    name?: string;
    phoneNumber?: string;
    email?: string;
    rating?: number;
} | string;

type RideOffer = {
    rideRequestId: string;
    rider?: RideOfferRider;
    pickup: string;
    dropOff: string;
    fare: number;
    totalDistanceKm: number;
};

const ADDRESS_UPDATE_THROTTLE_MS = 60000;
const RIDE_OFFER_TIMEOUT_SECONDS = 15;

function getRiderName(rider?: RideOfferRider) {
    if (!rider) return 'Rider';
    if (typeof rider === 'string') return 'Rider';
    return rider.name ?? 'Rider';
}

function getRiderRating(rider?: RideOfferRider) {
    if (!rider || typeof rider === 'string') return null;
    return typeof rider.rating === 'number' ? rider.rating : null;
}

function getRiderPhone(rider?: RideOfferRider) {
    if (!rider || typeof rider === 'string') return null;
    return rider.phoneNumber ?? null;
}

export default function DriverDashboardPage() {
    const router = useRouter();
    const { data: profile, isLoading } = useGetDriverProfileQuery({});
    const [updateActiveStatus, { isLoading: isTogglingStatus }] = useUpdateDriverMutation();

    // Context থেকে Online State এবং Live Coordinates গ্রহণ
    const { isOnline, setIsOnline, currentCoords } = useLocationTracker();

    const [address, setAddress] = useState<string | null>(null);
    const [isAddressLoading, setIsAddressLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
    const lastAddressFetchAtRef = useRef<number>(0);

    // Ride offer modal state
    const [rideOffer, setRideOffer] = useState<RideOffer | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(RIDE_OFFER_TIMEOUT_SECONDS);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchAndSetAddress = useCallback(async (latitude: number, longitude: number) => {
        setIsAddressLoading(true);
        const result = await getAddressFromCoords(latitude, longitude);
        setAddress(result);
        setIsAddressLoading(false);
    }, []);

    const clearCountdown = useCallback(() => {
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    }, []);

    const closeRideOffer = useCallback(() => {
        clearCountdown();
        setRideOffer(null);
        setSecondsLeft(RIDE_OFFER_TIMEOUT_SECONDS);
    }, [clearCountdown]);

    const handleAcceptRide = useCallback(() => {
        if (!rideOffer || !profile?.data?._id) return;

        const socket = getSocket();
        socket?.emit('ride:accept', {
            rideRequestId: rideOffer.rideRequestId,
            driverId: profile.data._id,
        });

        closeRideOffer();
        router.push(`/ride-request/${rideOffer.rideRequestId}`);
    }, [rideOffer, profile?.data?._id, closeRideOffer, router]);

    const handleDeclineRide = useCallback(() => {
        if (!rideOffer || !profile?.data?._id) return;

        const socket = getSocket();
        socket?.emit('ride:decline', {
            rideRequestId: rideOffer.rideRequestId,
            driverId: profile.data._id,
        });

        closeRideOffer();
    }, [rideOffer, profile?.data?._id, closeRideOffer]);

    // Online-Offline toggle
    const handleToggleOnline = useCallback(async () => {
        const nextStatus = !isOnline;
        const driverId = profile?.data?._id;

        try {
            await updateActiveStatus({ isActive: nextStatus }).unwrap();
            setIsOnline(nextStatus);

            if (nextStatus) {
                if (driverId) {
                    connectSocket(driverId);
                }
            } else {
                disconnectSocket();
                closeRideOffer();
            }
        } catch (err) {
            console.error('Failed to update active status:', err);
        }
    }, [isOnline, updateActiveStatus, profile?.data?._id, closeRideOffer, setIsOnline]);

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

    // ব্রাউজারের Location permission চেকিং এবং এড্রেস রিসিভ
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setLocationStatus('unsupported');
            return;
        }

        navigator.permissions?.query({ name: 'geolocation' }).then((permissionStatus) => {
            if (permissionStatus.state === 'denied') {
                setLocationStatus('denied');
            } else if (permissionStatus.state === 'granted') {
                setLocationStatus('granted');
            }
        });
    }, []);

    // Global location পরিবর্তন হলে স্থানীয় Address থ্রোটল করে আপডেট করা
    useEffect(() => {
        if (currentCoords.latitude && currentCoords.longitude) {
            setLocationStatus('granted');
            const now = Date.now();
            if (now - lastAddressFetchAtRef.current >= ADDRESS_UPDATE_THROTTLE_MS || !address) {
                fetchAndSetAddress(currentCoords.latitude, currentCoords.longitude);
                lastAddressFetchAtRef.current = now;
            }
        }
    }, [currentCoords, fetchAndSetAddress, address]);

    // Ride offer listener — ড্রাইভার অনলাইনে থাকলে সকেট দিয়ে অফার গ্রহণ করবে
    useEffect(() => {
        if (!isOnline) return;
        const socket = getSocket();
        if (!socket) return;

        const handleRideOffer = (payload: RideOffer) => {
            setRideOffer(payload);
            setSecondsLeft(RIDE_OFFER_TIMEOUT_SECONDS);

            clearCountdown();
            countdownRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearCountdown();
                        setRideOffer(null);
                        return RIDE_OFFER_TIMEOUT_SECONDS;
                    }
                    return prev - 1;
                });
            }, 1000);
        };

        socket.on('ride:offer', handleRideOffer);

        return () => {
            socket.off('ride:offer', handleRideOffer);
            clearCountdown();
        };
    }, [isOnline, clearCountdown]);

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

    const progressPct = (secondsLeft / RIDE_OFFER_TIMEOUT_SECONDS) * 100;

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
                                Give location permission from browser settings to go online.
                            </p>
                        </div>
                    </div>
                )}

                {locationStatus === 'unsupported' && (
                    <div className="mb-5 flex items-start gap-3 text-xs text-rose-400 bg-rose-500/[0.06] border border-rose-500/20 rounded-xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Unsupported location access in this browser.</p>
                    </div>
                )}

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 mb-5 text-center">
                    <button
                        onClick={handleToggleOnline}
                        disabled={isTogglingStatus}
                        className={`relative cursor-pointer w-28 h-28 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${isOnline
                                ? 'bg-emerald-500/15 border-2 border-emerald-500 shadow-[0_0_40px_-6px_rgba(52,211,153,0.6)]'
                                : 'bg-slate-900 border-2 border-slate-700'
                            } ${isTogglingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isOnline && <span className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping" />}
                        <Power className={`w-10 h-10 ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`} />
                    </button>

                    <div className="mt-4 text-lg font-bold">{isOnline ? "You're Online" : "You're Offline"}</div>
                    <p className="text-xs text-slate-500 mt-1">
                        {isTogglingStatus
                            ? 'Updating status...'
                            : isOnline
                                ? 'Looking for ride requests near you...'
                                : 'Tap the button to start receiving rides'}
                    </p>

                    {currentCoords.latitude && currentCoords.longitude && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-900/50 px-2.5 py-1.5 rounded-full max-w-full">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">
                                {isAddressLoading
                                    ? 'Detecting your address...'
                                    : address ?? `${currentCoords.latitude.toFixed(4)}, ${currentCoords.longitude.toFixed(4)}`}
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

                {isOnline && (
                    <div className="mt-5 flex items-center gap-2 text-xs text-sky-400 bg-sky-500/[0.06] border border-sky-500/20 rounded-xl px-4 py-3 animate-[fadeSlideUp_0.3s_ease-out]">
                        <Navigation className="w-3.5 h-3.5 animate-pulse" />
                        Searching for nearby ride requests...
                    </div>
                )}
            </main>

            {/* Ride Offer Modal */}
            {rideOffer && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
                    <div className="relative z-10 w-full sm:max-w-md bg-[#0d1420] border border-slate-800/80 sm:rounded-3xl rounded-t-3xl p-6 animate-[slideUp_0.35s_ease-out]">
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-5">
                            <div
                                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-[width] duration-1000 linear"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between mb-5">
                            <span className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase">
                                New Ride Request
                            </span>
                            <span className="font-mono text-lg font-bold tabular-nums">{secondsLeft}s</span>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold shrink-0">
                                <span className="text-base font-bold">{getRiderName(rideOffer.rider).charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold truncate">{getRiderName(rideOffer.rider)}</div>
                                {getRiderRating(rideOffer.rider) !== null ? (
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                                        {getRiderRating(rideOffer.rider)}
                                    </div>
                                ) : getRiderPhone(rideOffer.rider) ? (
                                    <div className="text-xs text-slate-500 truncate">{getRiderPhone(rideOffer.rider)}</div>
                                ) : null}
                            </div>
                            {getRiderPhone(rideOffer.rider) && (
                                <Link
                                    href={`tel:${getRiderPhone(rideOffer.rider)}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-9 h-9 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 hover:bg-sky-500/25 transition-colors shrink-0"
                                    aria-label="Call rider"
                                >
                                    <Phone className="w-4 h-4" />
                                </Link>
                            )}
                            <div className="text-right shrink-0">
                                <div className="text-lg font-bold font-mono text-emerald-400">৳{rideOffer.fare.toFixed(2)}</div>
                                <div className="text-[10px] text-slate-500">{rideOffer.totalDistanceKm} km trip</div>
                            </div>
                        </div>

                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-6">
                            <div className="relative pl-1">
                                <div className="absolute left-[7px] top-[10px] bottom-[26px] w-[2px] bg-gradient-to-b from-sky-500 to-emerald-500" />
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-sky-500/20 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Pickup</div>
                                        <div className="text-sm font-medium truncate">{rideOffer.pickup}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 ring-4 ring-emerald-500/20 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Destination</div>
                                        <div className="text-sm font-medium truncate">{rideOffer.dropOff}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleDeclineRide}
                                className="flex items-center justify-center gap-2 text-sm font-bold bg-rose-500/[0.06] border border-rose-500/30 text-rose-400 rounded-2xl py-3.5 hover:bg-rose-500/10 transition-all active:scale-[0.98] cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                                Decline
                            </button>
                            <button
                                onClick={handleAcceptRide}
                                className="flex items-center justify-center gap-2 text-sm font-bold bg-emerald-500 text-[#070b14] rounded-2xl py-3.5 hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(52,211,153,0.6)] cursor-pointer"
                            >
                                <Check className="w-4 h-4" />
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}