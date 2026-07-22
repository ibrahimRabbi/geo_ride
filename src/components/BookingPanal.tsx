"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Search, ArrowRight, LocateFixed, FlagTriangleRight } from "lucide-react";
import { Location } from "@/lib/types";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";
import AddressInput from "./AddressInput";

interface BookingPanelProps {
    pickup: Location | null;
    dropoff: Location | null;
    setPickup: (loc: Location | null) => void;
    setDropoff: (loc: Location | null) => void;
    onContinue?: () => void;
}

const RIDE_LOCATIONS_STORAGE_KEY = "geoMate_ride_locations";

 
const SUGGESTED_LOCATIONS = [
    { name: "Gulshan-1", coords: { x: 90.4125, y: 23.8103 } },
    { name: "Banani", coords: { x: 90.4064, y: 23.7947 } },
    { name: "Rampura", coords: { x: 90.4283, y: 23.7565 } },
    { name: "Dhanmondi", coords: { x: 90.3825, y: 23.7453 } },
    { name: "Aftabnagar", coords: { x: 90.4358, y: 23.7684 } },
    { name: "Puran Dhaka", coords: { x: 90.3945, y: 23.7338 } },
    { name: "Uttara", coords: { x: 90.3922, y: 23.8759 } },
];

export default function BookingPanel({
    pickup,
    dropoff,
    setPickup,
    setDropoff,
    onContinue,
}: BookingPanelProps) {
    const [pickupSearch, setPickupSearch] = useState("");
    const [dropoffSearch, setDropoffSearch] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const router = useRouter();

    // Sync search inputs
    useEffect(() => {
        setPickupSearch(pickup ? pickup.address : "");
    }, [pickup]);

    useEffect(() => {
        setDropoffSearch(dropoff ? dropoff.address : "");
    }, [dropoff]);

    const saveLocationsAndProceed = () => {
        if (!pickup || !dropoff) return;

        const rideLocations = {
            pickup: {
                address: pickup.address,
                latitude: pickup.latitude,
                longitude: pickup.longitude,
            },
            dropoff: {
                address: dropoff.address,
                latitude: dropoff.latitude,
                longitude: dropoff.longitude,
            },
            savedAt: new Date().toISOString(),
        };

        try {
            localStorage.setItem(RIDE_LOCATIONS_STORAGE_KEY, JSON.stringify(rideLocations));
            router.push("/estimation");
        } catch (err) {
            console.error("Failed to save ride locations to localStorage:", err);
        }

        onContinue?.();
    };

    const handleCheckEstimation = () => {
        if (!pickup || !dropoff) return;
        setShowLoginModal(true);
    };

      
    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        saveLocationsAndProceed();
    };

    const handleSuggestionClick = (locName: string, lat: number, lng: number) => {
        const newLoc: Location = {
            address: locName,
            latitude: lat,
            longitude: lng,
        };

        if (!pickup) {
            setPickup(newLoc);
            setPickupSearch(locName);
        } else if (!dropoff) {
            setDropoff(newLoc);
            setDropoffSearch(locName);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-full justify-between gap-6 overflow-hidden">
            <div className="flex flex-col gap-5 h-full justify-between">
                <div className="space-y-4">
                    {/* হেডার */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">⚡</span>
                            Where are you heading?
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Get custom high-tier upfront fares in seconds.
                        </p>
                    </div>

                    {/* Pickup Location */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-bold">
                            <LocateFixed className="w-3.5 h-3.5 text-emerald-500" />
                            Pickup Location
                        </label>
                        <AddressInput
                            value={pickupSearch}
                            onChange={setPickupSearch}
                            onSelect={(address, lat, lng) => {
                                const newLoc: Location = {
                                    address: address,
                                    latitude: lat,
                                    longitude: lng,
                                };
                                setPickup(newLoc);
                                setPickupSearch(address);
                            }}
                            placeholder="Enter starting point..."
                            clearable={true}
                            leftIcon={
                                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 block" />
                            }
                            inputClassName="bg-slate-950 border-slate-800 focus:border-emerald-500 text-sm"
                            className="w-full"
                        />
                    </div>

                    {/* Dropoff Location */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-bold">
                            <FlagTriangleRight className="w-3.5 h-3.5 text-rose-500" />
                            Destination Point
                        </label>
                        <AddressInput
                            value={dropoffSearch}
                            onChange={setDropoffSearch}
                            onSelect={(address, lat, lng) => {
                                const newLoc: Location = {
                                    address: address,
                                    latitude: lat,
                                    longitude: lng,
                                };
                                setDropoff(newLoc);
                                setDropoffSearch(address);
                            }}
                            placeholder="Enter dropoff destination..."
                            clearable={true}
                            leftIcon={
                                <span className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 block" />
                            }
                            inputClassName="bg-slate-950 border-slate-800 focus:border-rose-500 text-sm"
                            className="w-full"
                        />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="pt-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
                            Quick Suggestions
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {SUGGESTED_LOCATIONS.map((loc) => (
                                <button
                                    key={loc.name}
                                    type="button"
                                    onClick={() =>
                                        handleSuggestionClick(loc.name, loc.coords.y, loc.coords.x)
                                    }
                                    className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 px-3 py-1.5 rounded-full text-[11px] text-slate-300 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                    <Search className="w-3 h-3 text-slate-500" />
                                    <span>{loc.name}</span>
                                </button>
                            ))}
                        </div>
                        {/* হেল্পার টেক্সট */}
                        {!pickup && (
                            <p className="text-[9px] text-slate-500 mt-1.5 italic">
                                💡 Click a suggestion to set as pickup
                            </p>
                        )}
                        {pickup && !dropoff && (
                            <p className="text-[9px] text-slate-500 mt-1.5 italic">
                                💡 Click a suggestion to set as destination
                            </p>
                        )}
                        {pickup && dropoff && (
                            <p className="text-[9px] text-slate-500 mt-1.5 italic">
                                ✅ Both locations selected – ready to go!
                            </p>
                        )}
                    </div>
                </div>

                {/* Check Ride Estimations Button */}
                <button
                    type="button"
                    disabled={!pickup || !dropoff}
                    onClick={handleCheckEstimation}
                    className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 text-sm transition-all ${pickup && dropoff
                            ? "bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white shadow-lg shadow-sky-500/25 active:scale-[0.98] cursor-pointer"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                >
                    <span>Check Ride Estimations</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />
        </div>
    );
}