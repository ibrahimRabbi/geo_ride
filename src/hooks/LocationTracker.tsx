'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useGetDriverProfileQuery, useUpdateLocationMutation } from '@/redux/features/driver/driverApi';

const LOCATION_UPDATE_THROTTLE_MS = 10000;

interface LocationContextType {
    isOnline: boolean;
    setIsOnline: (status: boolean) => void;
    currentCoords: { latitude: number | null; longitude: number | null };
}

const LocationContext = createContext<LocationContextType>({
    isOnline: false,
    setIsOnline: () => { },
    currentCoords: { latitude: null, longitude: null },
});

export const LocationTrackerProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOnline, setIsOnline] = useState(false);
    const [currentCoords, setCurrentCoords] = useState<{ latitude: number | null; longitude: number | null }>({
        latitude: null,
        longitude: null,
    });

    const { data: profile } = useGetDriverProfileQuery({});
    const [updateLocation] = useUpdateLocationMutation();

    const watchIdRef = useRef<number | null>(null);
    const lastSentAtRef = useRef<number>(0);

    const isApproved = profile?.data && profile.data?.status !== 'pending';

    const sendLocationToBackend = useCallback(
        (latitude: number, longitude: number) => {
            updateLocation({ coordinates: [longitude, latitude] })
                .unwrap()
                .catch((err) => console.error('Failed background location update:', err));
        },
        [updateLocation]
    );

    useEffect(() => {
        // ড্রাইভার অনুমোদিত (Approved) এবং অনলাইন না থাকলে ট্র্যাকিং শুরু হবে না
        if (!isApproved || !isOnline) {
            if (watchIdRef.current !== null && 'geolocation' in navigator) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            return;
        }

        if (!('geolocation' in navigator)) return;

        // Geolocation Watcher — ড্রাইভার অনলাইনে থাকলে যেকোনো পেজেই এই লুপ চলতে থাকবে
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentCoords({ latitude, longitude });

                const now = Date.now();
                if (now - lastSentAtRef.current >= LOCATION_UPDATE_THROTTLE_MS) {
                    sendLocationToBackend(latitude, longitude);
                    lastSentAtRef.current = now;
                }
            },
            (error) => {
                console.error('Location watch error:', error);
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
    }, [isApproved, isOnline, sendLocationToBackend]);

    return (
        <LocationContext.Provider value={{ isOnline, setIsOnline, currentCoords }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationTracker = () => useContext(LocationContext);