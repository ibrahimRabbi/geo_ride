'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Phone,
    MessageCircle,
    X,
    Star,
    ShieldCheck,
    Car,
    Navigation,
    ChevronUp,
} from 'lucide-react';
import { useGetNearDriversQuery, useGetRideRequestQuery } from '@/redux/features/ride/rideApi';
import LiveDriverTrackingMap from '@/components/LiveDriverTrackingMap';

type PopulatedRider = {
    _id: string;
    name: string;
    email?: string;
    phoneNumber?: string | null;
    profileImage?: string;
};

type VehicleInfo = {
    vehicleType?: string;
    model?: string;
    numberPlate?: string;
    manufacturingYear?: string;
};

type PopulatedDriver = {
    _id: string;
    fullName: string;
    email?: string;
    vehicleInfo?: VehicleInfo;
    currentLocation?: { coordinates: [number, number]; type: string };
    status?: string;
    rating?: number;
    trips?: number;
    phoneNumber?: string;
};

type RideLocation = {
    address: string;
    latitude: number;
    langitude: number; // NOTE: backend sends misspelled key
};

type RideVehicleType = {
    _id: string;
    vehicle_name: string;
    baseFare?: number;
    perKmRate?: number;
    image?: string;
};

type RideRequestData = {
    _id: string;
    userId: PopulatedRider;
    pickup: RideLocation;
    dropOff: RideLocation;
    totalDistanceKm: number;
    paymentType: string;
    paymentStatus: string;
    fare: number;
    status: string;
    driverId?: PopulatedDriver;
    vehicle?: RideVehicleType;
    otp?: string;
};

export default function DriverAssignedPage() {
    const router = useRouter();
    const [cancelling, setCancelling] = useState(false);
    const [sheetExpanded, setSheetExpanded] = useState(false);

    const params = useSearchParams();
    const rideReqId = params.get('rideReqId') || 'rideReqId';

    const { data: nearDrivers, isLoading: isLoadingNearDrivers } = useGetNearDriversQuery(rideReqId);
    const { data: updatedRideRequestData, refetch } = useGetRideRequestQuery(rideReqId, {
        pollingInterval: 10000, // 👈 ১০ সেকেন্ড পর পর ড্রাইভারের আপডেট নিয়ে আসবে
    });

    const rideData = updatedRideRequestData?.data as RideRequestData | undefined;
    const driver = rideData?.driverId;
    const isDriverAssigned = rideData?.status === 'accepted' && !!driver;
    const isFindingDriver = isLoadingNearDrivers || !isDriverAssigned;

    useEffect(() => {
        if (nearDrivers?.data) {
            refetch();
        }
    }, [nearDrivers, refetch]);

    if (isFindingDriver || !rideData || !driver) {
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
                            Finding your driver
                        </p>
                        <p className="text-xs text-slate-500">Matching you with the nearest available driver...</p>
                        <div className="flex items-center gap-1 mt-1">
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

    // ---- Derived display values ----
    const driverName = driver.fullName ?? 'Your driver';
    const driverInitial = driverName.charAt(0).toUpperCase();
    const vehicleModel = driver.vehicleInfo?.model ?? rideData.vehicle?.vehicle_name ?? '—';
    const vehiclePlate = driver.vehicleInfo?.numberPlate ?? '—';
    const vehicleSubtext = [driver.vehicleInfo?.vehicleType, driver.vehicleInfo?.manufacturingYear]
        .filter(Boolean)
        .join(' · ');

    // 👈 GeoJSON coordinates [longitude, latitude] -> Google Maps object { lat, lng }
    const driverCoords = driver.currentLocation?.coordinates;
    const driverLocation = driverCoords
        ? { lat: driverCoords[1], lng: driverCoords[0] }
        : null;

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-10 border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-full hover:bg-slate-800/60 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-lg font-bold tracking-tight">
                            Apex<span className="text-sky-400">Ride</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Trip confirmed
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5">
                    {/* LEFT: Driver card */}
                    <section
                        className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 flex flex-col animate-[fadeSlideUp_0.5s_ease-out]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        <div className="bg-gradient-to-br from-sky-500/15 to-sky-500/5 border border-sky-500/25 rounded-2xl p-4 mb-5 text-center">
                            <div className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase mb-1">
                                Driver is on the way
                            </div>
                            <div className="text-sm text-slate-300 mt-1">to {rideData.pickup.address}</div>
                        </div>

                        <div className="flex items-center gap-4 mb-5">
                            <div className="relative shrink-0">
                                <div className="w-16 h-16 rounded-full bg-sky-500/20 border-2 border-sky-500/40 flex items-center justify-center text-sky-400 text-2xl font-bold">
                                    {driverInitial}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0d1420] flex items-center justify-center">
                                    <ShieldCheck className="w-3 h-3 text-[#0d1420]" />
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-lg font-bold truncate">{driverName}</div>
                                {typeof driver.rating === 'number' ? (
                                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                                        <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                                        <span className="font-semibold text-slate-200">{driver.rating}</span>
                                        {typeof driver.trips === 'number' && (
                                            <>
                                                <span className="text-slate-600">&middot;</span>
                                                <span>{driver.trips.toLocaleString()} trips</span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500">New on ApexRide</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-5 flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center shrink-0">
                                <Car className="w-6 h-6 text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold">{vehicleModel}</div>
                                {vehicleSubtext && <div className="text-xs text-slate-500">{vehicleSubtext}</div>}
                            </div>
                            <div className="text-sm font-mono font-bold bg-slate-800/80 px-3 py-1.5 rounded-lg tracking-wide shrink-0">
                                {vehiclePlate}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <a
                                href={driver.phoneNumber ? `tel:${driver.phoneNumber}` : undefined}
                                className="flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/[0.06] transition-all duration-200"
                            >
                                <Phone className="w-4 h-4" />
                                Call
                            </a>
                            <button className="flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900/60 border border-slate-700/60 rounded-2xl py-3 hover:border-sky-500/50 hover:text-sky-400 hover:bg-sky-500/[0.06] transition-all duration-200">
                                <MessageCircle className="w-4 h-4" />
                                Message
                            </button>
                        </div>

                        <div className="border-t border-slate-800 pt-4 mb-5">
                            <div className="relative pl-1">
                                <div className="absolute left-[7px] top-[10px] bottom-[26px] w-[2px] bg-gradient-to-b from-sky-500 to-emerald-500" />
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-sky-500/20 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Pickup</div>
                                        <div className="text-sm font-medium truncate">{rideData.pickup.address}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 ring-4 ring-emerald-500/20 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Destination</div>
                                        <div className="text-sm font-medium truncate">{rideData.dropOff.address}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/70 text-sm">
                                <span className="text-slate-500">
                                    {rideData.vehicle?.vehicle_name ?? 'Ride'} &middot; {rideData.paymentType}
                                </span>
                                <span className="font-bold tabular-nums">BDT {rideData.fare.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setCancelling(true)}
                            className="mt-auto w-full rounded-2xl py-3.5 text-sm font-bold tracking-wide border border-rose-500/30 text-rose-400 bg-rose-500/[0.06] hover:bg-rose-500/10 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel ride
                        </button>

                        {cancelling && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2 animate-[fadeSlideUp_0.3s_ease-out]">
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                A small cancellation fee may apply since your driver is already on the way.
                            </div>
                        )}
                    </section>

                    {/* RIGHT: Live tracking map */}
                    <section
                        className="animate-[fadeSlideUp_0.5s_ease-out_0.15s]"
                        style={{ animationFillMode: 'backwards' }}
                    >
                        {/* 👈 Convert করে সঠিকভাবে Data Pass করা হচ্ছে */}
                        {driverLocation ? (
                            <LiveDriverTrackingMap
                                pickup={rideData.pickup}
                                driverLocation={driverLocation}
                            />
                        ) : (
                            <div className="w-full h-full min-h-[400px] bg-[#0d1420] rounded-3xl border border-slate-800 flex items-center justify-center text-slate-500 text-sm">
                                Waiting for driver location...
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {rideData.otp && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20">
                    <button
                        onClick={() => setSheetExpanded((v) => !v)}
                        className="w-full bg-[#0a0f1a] border-t border-slate-800 rounded-t-3xl px-5 py-3 flex items-center justify-between"
                    >
                        <span className="text-xs text-slate-500">Share OTP with driver on arrival</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sky-400 tracking-widest">{rideData.otp}</span>
                            <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform ${sheetExpanded ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                </div>
            )}

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
                }
            `}</style>
        </div>
    );
}