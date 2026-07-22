'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { GoogleMap, Marker, OverlayView, Polyline, DirectionsService, useJsApiLoader } from '@react-google-maps/api';
import { Navigation, Compass, Shield, AlertTriangle, ChevronRight } from 'lucide-react';
import { Location } from '@/lib/types';

interface CityMapProps {
    pickup: Location | null;
    dropoff: Location | null;
}

// --- Bangladesh-only map configuration -------------------------------------------------
// Roughly covers the whole country; used both to center the map and to hard-restrict panning.
const BANGLADESH_CENTER = { lat: 23.6850, lng: 90.3563 };
const BANGLADESH_BOUNDS = {
    north: 26.75,
    south: 20.5,
    west: 88.0,
    east: 92.75,
};

// Dark map style so it matches the app's slate/sky theme instead of Google's default look
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

// Floating "From ..." / "To ..." pill shown next to a marker, styled after the reference
// screenshot but kept in the app's dark theme instead of Google's default white card.
function LocationTag({
    label,
    address,
    anchor,
}: {
    label: 'From' | 'To';
    address: string;
    anchor: 'bottom-left' | 'top-left';
}) {
    const offsetClass = anchor === 'bottom-left' ? 'top-3 left-3' : '-top-3 left-3 -translate-y-full';
    return (
        <div className={`absolute ${offsetClass} pointer-events-none`}>
            <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl pl-3 pr-2 py-2 shadow-xl max-w-[200px] whitespace-nowrap">
                <div className="min-w-0">
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{label}</div>
                    <div className="text-xs font-semibold text-slate-200 truncate max-w-[150px]">{address}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </div>
        </div>
    );
}

export default function CityMap({ pickup, dropoff }: CityMapProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'apexride-google-map',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    });

    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [directionsError, setDirectionsError] = useState<string | null>(null);
    const mapRef = React.useRef<google.maps.Map | null>(null);

    const pickupLatLng = pickup ? { lat: pickup.latitude, lng: pickup.longitude } : null;
    const dropoffLatLng = dropoff ? { lat: dropoff.latitude, lng: dropoff.longitude } : null;

    // Only re-request directions when the actual coordinates change
    const directionsKey = pickupLatLng && dropoffLatLng
        ? `${pickupLatLng.lat},${pickupLatLng.lng}-${dropoffLatLng.lat},${dropoffLatLng.lng}`
        : null;

    const handleMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    // Whenever pickup and/or dropoff change, re-frame the map so both (or the one)
    // point(s) are actually visible instead of relying on a fixed center/zoom.
    React.useEffect(() => {
        const map = mapRef.current;
        if (!map || typeof google === 'undefined') return;

        if (pickupLatLng && dropoffLatLng) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(pickupLatLng);
            bounds.extend(dropoffLatLng);
            map.fitBounds(bounds, 80); // 80px padding so markers/HUD don't overlap edges
        } else if (pickupLatLng) {
            map.panTo(pickupLatLng);
            map.setZoom(14);
        } else if (dropoffLatLng) {
            map.panTo(dropoffLatLng);
            map.setZoom(14);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickupLatLng?.lat, pickupLatLng?.lng, dropoffLatLng?.lat, dropoffLatLng?.lng]);

    const handleDirectionsCallback = useCallback(
        (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
            if (status === 'OK' && result) {
                setDirections(result);
                setDirectionsError(null);
            } else if (status !== 'OK') {
                setDirectionsError('Could not calculate a route between these two points.');
            }
        },
        []
    );

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

    const leg = directions?.routes?.[0]?.legs?.[0];

    return (
        <div className="relative w-full h-[320px] md:h-full min-h-[300px] md:min-h-[500px] rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Map layer */}
            <div className="absolute inset-0 z-0">
                {loadError && (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-6">
                        <AlertTriangle className="w-6 h-6 text-rose-400" />
                        <p className="text-xs text-slate-400">
                            Failed to load Google Maps. Check your API key and network access.
                        </p>
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
                        center={BANGLADESH_CENTER}
                        zoom={11}
                        options={mapOptions}
                        onLoad={handleMapLoad}
                    >
                        {pickup && dropoff && directionsKey && (
                            <DirectionsService
                                options={{
                                    origin: pickupLatLng!,
                                    destination: dropoffLatLng!,
                                    travelMode: google.maps.TravelMode.DRIVING,
                                }}
                                callback={handleDirectionsCallback}
                            />
                        )}

                        {/* Manually-drawn route: a dark casing under a bright core line, so it
                            stays visible regardless of the basemap color underneath it (a plain
                            black line, like the reference screenshot, would disappear into our
                            dark map — this two-layer approach keeps the same bold look but visible) */}
                        {pickup && dropoff && directions && (
                            <>
                                <Polyline
                                    path={directions.routes[0]?.overview_path ?? []}
                                    options={{
                                        strokeColor: '#0f172a',
                                        strokeWeight: 8,
                                        strokeOpacity: 0.9,
                                        zIndex: 4,
                                    }}
                                />
                                <Polyline
                                    path={directions.routes[0]?.overview_path ?? []}
                                    options={{
                                        strokeColor: '#f8fafc',
                                        strokeWeight: 4,
                                        strokeOpacity: 1,
                                        zIndex: 5,
                                    }}
                                />
                            </>
                        )}

                        {/* Pickup point — a Google "current location" style blue dot, appears the moment `pickup` is set */}
                        {pickup && (
                            <>
                                <Marker
                                    position={pickupLatLng!}
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        scale: 14,
                                        fillColor: '#38bdf8',
                                        fillOpacity: 0.18,
                                        strokeWeight: 0,
                                    }}
                                    zIndex={1}
                                />
                                <Marker
                                    position={pickupLatLng!}
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        scale: 7,
                                        fillColor: '#3b82f6',
                                        fillOpacity: 1,
                                        strokeColor: '#ffffff',
                                        strokeWeight: 3,
                                    }}
                                    zIndex={2}
                                />
                                <OverlayView position={pickupLatLng!} mapPaneName={OverlayView.FLOAT_PANE}>
                                    <LocationTag label="From" address={pickup.address} anchor="bottom-left" />
                                </OverlayView>
                            </>
                        )}

                        {/* Dropoff point — a black flag/square pin, appears the moment `dropoff` (lat/lng) is set */}
                        {dropoff && (
                            <>
                                <Marker
                                    position={dropoffLatLng!}
                                    icon={{
                                        // Rounded square "flag" pin, matches the dark square marker in the reference screenshot
                                        path: 'M -8,-8 L 8,-8 L 8,8 L 0,8 L -3,14 L -3,8 L -8,8 Z',
                                        scale: 1,
                                        fillColor: '#0f172a',
                                        fillOpacity: 1,
                                        strokeColor: '#ffffff',
                                        strokeWeight: 1.5,
                                        anchor: new google.maps.Point(0, 14),
                                    }}
                                    zIndex={2}
                                />
                                <OverlayView position={dropoffLatLng!} mapPaneName={OverlayView.FLOAT_PANE}>
                                    <LocationTag label="To" address={dropoff.address} anchor="top-left" />
                                </OverlayView>
                            </>
                        )}
                    </GoogleMap>
                )}
            </div>

            
        </div>
    );
}