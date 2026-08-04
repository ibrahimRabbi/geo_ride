'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { AlertTriangle } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/GoogleMapProvider';

interface LiveDriverTrackingProps {
    pickup: { latitude: number; langitude: number; address?: string };
    driverLocation: { lat: number; lng: number };
}

const BANGLADESH_BOUNDS = {
    north: 26.75,
    south: 20.5,
    west: 88.0,
    east: 92.75,
};

const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
    { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
    { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1a2e' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
];

const mapContainerStyle = { width: '100%', height: '100%' };

export default function LiveDriverTrackingMap({ pickup, driverLocation }: LiveDriverTrackingProps) {
    const { isLoaded, loadError } = useGoogleMaps();
    const mapRef = useRef<google.maps.Map | null>(null);
    const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);

    const pickupLatLng = useMemo(
        () => ({ lat: pickup.latitude, lng: pickup.langitude }),
        [pickup.latitude, pickup.langitude]
    );

    const handleMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    // Calculate Route between Driver Location -> Pickup Location
    useEffect(() => {
        if (!isLoaded || !pickupLatLng.lat || !driverLocation.lat) return;

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: driverLocation,
                destination: pickupLatLng,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK' && result) {
                    setDirections(result);
                }
            }
        );
    }, [isLoaded, driverLocation.lat, driverLocation.lng, pickupLatLng.lat, pickupLatLng.lng]);

    const mapOptions: google.maps.MapOptions = useMemo(
        () => ({
            styles: DARK_MAP_STYLE,
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'greedy',
            restriction: {
                latLngBounds: BANGLADESH_BOUNDS,
                strictBounds: false,
            },
            minZoom: 6,
        }),
        []
    );

    return (
        <div className="relative w-full h-[320px] md:h-full min-h-[300px] md:min-h-[500px] rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
            {loadError && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-6">
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                    <p className="text-xs text-slate-400">Failed to load Google Maps.</p>
                </div>
            )}

            {!loadError && !isLoaded && (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-slate-700 border-t-sky-400 rounded-full animate-spin" />
                </div>
            )}

            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={driverLocation}
                    zoom={15}
                    options={mapOptions}
                    onLoad={handleMapLoad}
                >
                    {/* Driver Marker */}
                    <Marker
                        position={driverLocation}
                        title="Driver Location"
                        icon={{
                            url: 'https://cdn-icons-png.flaticon.com/512/3202/3202021.png',
                            scaledSize: new google.maps.Size(40, 40),
                        }}
                        zIndex={10}
                    />

                    {/* Pickup Location Marker*/}
                    <Marker
                        position={pickupLatLng}
                        title="Pickup Location"
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#3b82f6',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 3,
                        }}
                        zIndex={5}
                    />

                    {/* Route line between Driver & Pickup */}
                    {directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                suppressMarkers: true,
                                polylineOptions: {
                                    strokeColor: '#38bdf8', // Sky-400 theme
                                    strokeWeight: 5,
                                    strokeOpacity: 0.9,
                                },
                            }}
                        />
                    )}
                </GoogleMap>
            )}
        </div>
    );
}