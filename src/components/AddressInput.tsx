"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useGoogleMaps } from "@/hooks/GoogleMapProvider";

interface AddressInputProps {
    value?: string;
    onChange?: (value: string) => void;
    onSelect: (address: string, lat: number, lng: number) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    clearable?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const libraries: ("places")[] = ["places"];

export default function AddressInput({
    value: externalValue = "",
    onChange: externalOnChange,
    onSelect,
    placeholder = "Search for a location...",
    label,
    disabled = false,
    className = "",
    inputClassName = "",
    clearable = true,
    leftIcon,
    rightIcon,
}: AddressInputProps) {
    const [inputValue, setInputValue] = useState(externalValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const { isLoaded, loadError } = useGoogleMaps();

    // Sync external value
    useEffect(() => {
        if (externalValue !== inputValue) {
            setInputValue(externalValue);
        }
    }, [externalValue]);

    const handlePlaceChanged = () => {
        if (!autocompleteRef.current) return;
        const place = autocompleteRef.current.getPlace();
        if (!place || !place.geometry || !place.geometry.location) return;

        const address = place.formatted_address || place.name || "";
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setInputValue(address);
        if (externalOnChange) externalOnChange(address);
        onSelect(address, lat, lng);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        if (externalOnChange) externalOnChange(val);
    };

    const handleClear = () => {
        setInputValue("");
        if (externalOnChange) externalOnChange("");
        if (inputRef.current) inputRef.current.focus();
    };

    // Loading / error states
    if (loadError) {
        return (
            <div className="text-red-400 text-xs p-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                ⚠️ Failed to load Google Maps. Please refresh.
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="relative w-full">
                {label && (
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold block mb-1">
                        {label}
                    </span>
                )}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-xl text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span>Loading Google Maps...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative w-full ${className}`}>
            {label && (
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold block mb-1">
                    {label}
                </span>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                        {leftIcon}
                    </div>
                )}

                <Autocomplete
                    onLoad={(autocomplete) => { autocompleteRef.current = autocomplete; }}
                    onPlaceChanged={handlePlaceChanged}
                    options={{
                        types: ["geocode", "establishment"],
                        fields: ["address_components", "formatted_address", "geometry", "name"],
                        componentRestrictions: { country: "bd" },
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={`w-full bg-slate-950 border text-xs font-semibold rounded-xl outline-none transition-all ${disabled
                            ? "border-slate-700 text-slate-400 cursor-not-allowed"
                            : "border-slate-850 text-slate-100 focus:border-sky-500 hover:border-slate-700"
                            } ${leftIcon ? "pl-9" : "pl-3"} ${clearable || rightIcon ? "pr-10" : "pr-3"
                            } py-2.5 ${inputClassName}`}
                    />
                </Autocomplete>

                {/* ডান পাশের আইকন */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {rightIcon}

                    {clearable && inputValue && !rightIcon && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}

                    {!rightIcon && (
                        <div className="w-6 h-6 flex items-center justify-center">
                            {inputValue ? (
                                <Search className="w-4 h-4 text-sky-400" />
                            ) : (
                                <Search className="w-4 h-4 text-slate-600" />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}