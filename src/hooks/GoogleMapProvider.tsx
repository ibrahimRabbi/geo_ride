'use client';
import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

// Single source of truth for the libraries array — must be a stable
// module-level reference, not recreated per-render, or the loader
// will think options changed and warn/break again.
const GOOGLE_MAPS_LIBRARIES: ('places')[] = ['places'];
const GOOGLE_MAPS_LOADER_ID = 'apexride-google-map';

interface GoogleMapsContextValue {
    isLoaded: boolean;
    loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue>({
    isLoaded: false,
    loadError: undefined,
});

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: GOOGLE_MAPS_LOADER_ID,
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    return (
        <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
            {children}
        </GoogleMapsContext.Provider>
    );
}

export function useGoogleMaps() {
    return useContext(GoogleMapsContext);
}