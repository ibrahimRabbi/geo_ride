'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Car,
  Clock,
  User,
  Plus,
  Share2,
  Activity,
  ChevronDown,
  Wallet,
  Banknote,
  Briefcase,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import { Location } from '@/lib/types';
import { MOCK_LOCATIONS } from '@/lib/locations';
import { useRouter } from 'next/navigation';
import { useGetAllVehiclesQuery } from '@/redux/features/vehicles/vehicleApi';

interface EstimationDashboardProps {
  initialPickup: Location | null;
  initialDropoff: Location | null;
  onBackToHome: () => void;
  walletBalance: number;
}

// ✅ Payment options – MUST be defined
const paymentOptions = [
  { value: 'wallet', label: 'Wallet Balance', icon: Wallet },
  { value: 'cash', label: 'Cash', icon: Banknote },
] as const;

interface VehicleEstimateOption {
  id: string;
  name: string;
  capacity: number;
  timeAwayMin: number;
  arrivalTime: string;
  description: string;
  basePriceBDT: number;
  discountPriceBDT: number;
  badge?: string;
  graphic: string; // URL or emoji
}

// Storage key for saved locations
const RIDE_LOCATIONS_STORAGE_KEY = 'geo_ride_locations';

interface StoredRideLocationPoint {
  address: string;
  latitude: number;
  longitude: number;
}

interface StoredRideLocations {
  pickup: StoredRideLocationPoint;
  dropoff: StoredRideLocationPoint;
  savedAt: string;
}

function toLocation(point: StoredRideLocationPoint, id: string): Location {
  return {
    id,
    name: point.address,
    coords: { x: point.longitude, y: point.latitude },
  } as Location;
}

function getArrivalTime(minutesAway: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutesAway);
  return now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function EstimationDashboard({
  initialPickup,
  initialDropoff,
  onBackToHome,
  walletBalance
}: EstimationDashboardProps) {
  const [pickup, setPickup] = useState<Location | null>(initialPickup || MOCK_LOCATIONS[0]);
  const [dropoff, setDropoff] = useState<Location | null>(initialDropoff || MOCK_LOCATIONS[1]);
  const [savedLocations, setSavedLocations] = useState<StoredRideLocations | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wallet'>('wallet');
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ✅ selected from paymentOptions – now defined
  const selected = paymentOptions.find((o) => o.value === paymentMethod)!;
  const SelectedIcon = selected.icon;
  const router = useRouter();

  // Fetch vehicles from API
  const { data: vehicles, isLoading, isError } = useGetAllVehiclesQuery(null);

  // --- Distance factor ---
  const distanceFactor = useMemo(() => {
    if (!pickup || !dropoff) return 1.0;
    const dx = Math.abs(pickup.coords.x - dropoff.coords.x);
    const dy = Math.abs(pickup.coords.y - dropoff.coords.y);
    return Math.max(1.2, (dx + dy) / 20);
  }, [pickup, dropoff]);

  const estimatedDistanceKm = distanceFactor * 6.2;
  const estimatedDurationMin = distanceFactor * 14;

  // --- Build vehicle options from API data ---
  const vehicleOptions = useMemo<VehicleEstimateOption[]>(() => {
    if (!vehicles?.data || !Array.isArray(vehicles.data)) return [];

    return vehicles.data.map((v: any) => {
      const basePrice = v.baseFare + (v.perKmRate * estimatedDistanceKm) + (v.perMinRate * estimatedDurationMin);
      const discountPrice = basePrice * 0.9; // 10% promo

      let timeAwayMin = 4;
      const nameLower = (v.vehicle_name || '').toLowerCase();
      if (nameLower.includes('bike')) timeAwayMin = 5;
      else if (nameLower.includes('premier')) timeAwayMin = 3;
      else if (nameLower.includes('green') || nameLower.includes('electric')) timeAwayMin = 7;

      return {
        id: v._id,
        name: v.vehicle_name || 'Unknown',
        capacity: v.capacity || 4,
        timeAwayMin,
        arrivalTime: getArrivalTime(timeAwayMin),
        description: v.description || 'Comfortable ride',
        basePriceBDT: Math.round(basePrice),
        discountPriceBDT: Math.round(discountPrice),
        badge: v.badge || undefined,
        graphic: v.image || '🚗',
      };
    });
  }, [vehicles, estimatedDistanceKm, estimatedDurationMin]);

  // Auto-select first vehicle when data loads
  useEffect(() => {
    if (vehicleOptions.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicleOptions[0].id);
    }
  }, [vehicleOptions, selectedVehicleId]);

  // --- localStorage for saved locations ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RIDE_LOCATIONS_STORAGE_KEY);
      if (!raw) return;
      const parsed: StoredRideLocations = JSON.parse(raw);
      if (!parsed?.pickup || !parsed?.dropoff) return;
      setSavedLocations(parsed);
      if (!initialPickup) setPickup(toLocation(parsed.pickup, 'saved-pickup'));
      if (!initialDropoff) setDropoff(toLocation(parsed.dropoff, 'saved-dropoff'));
    } catch (err) {
      console.error('Failed to read saved ride locations:', err);
    }
  }, [initialPickup, initialDropoff]);

  // --- Click outside for payment dropdown ---
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // --- Handlers ---
  const handleRequestRide = () => {
    router.push('/find-driver');
  };

  // --- Pickup / Dropoff options for selects ---
  const pickupOptions: Location[] = savedLocations
    ? [toLocation(savedLocations.pickup, 'saved-pickup'), ...MOCK_LOCATIONS]
    : MOCK_LOCATIONS;

  const dropoffOptions: Location[] = savedLocations
    ? [toLocation(savedLocations.dropoff, 'saved-dropoff'), ...MOCK_LOCATIONS]
    : MOCK_LOCATIONS;

  const selectedVehicle = vehicleOptions.find(v => v.id === selectedVehicleId) || vehicleOptions[0];

  // ----- RENDER -----
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">

      {/* (Optional header – you had it commented; uncomment if needed) */}
      {/* <header> ... </header> */}

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">

        {/* ===== COLUMN 1: Get a ride ===== */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 sm:space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">Get a ride</h2>
              <p className="text-[11px] text-slate-400">Configure your pickup coordinates and request immediate matching.</p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-400">
              <span className="text-base flex-shrink-0">🏷️</span>
              <div>
                <span className="font-bold block text-emerald-300">30% off your next 5 rides</span>
                <span className="text-[10px] text-emerald-400/80 font-medium">Promo automatically added to current estimates.</span>
              </div>
            </div>

            <div className="relative space-y-3.5">
              <div className="absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-slate-800 border-dashed border-slate-700/60" />

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] shadow-sm mt-1 text-sky-400">●</div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">Pick Up Point</span>
                  <select
                    value={pickup?.id || ''}
                    onChange={(e) => {
                      const matched = pickupOptions.find((l) => l.id === e.target.value);
                      if (matched) setPickup(matched);
                    }}
                    className="w-full bg-slate-950 border border-slate-850 text-slate-100 text-xs font-semibold px-3 py-2 rounded-xl focus:border-sky-500 outline-none transition-all cursor-pointer"
                  >
                    {pickupOptions.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                  {savedLocations && pickup?.id === 'saved-pickup' && (
                    <span className="block text-[9px] font-mono text-slate-500">
                      {savedLocations.pickup.latitude.toFixed(4)}, {savedLocations.pickup.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-1 text-emerald-400">■</div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">Destination</span>
                  </div>
                  <select
                    value={dropoff?.id || ''}
                    onChange={(e) => {
                      const matched = dropoffOptions.find((l) => l.id === e.target.value);
                      if (matched) setDropoff(matched);
                    }}
                    className="w-full bg-slate-950 border border-slate-850 text-slate-100 text-xs font-semibold px-3 py-2 rounded-xl focus:border-sky-500 outline-none transition-all cursor-pointer"
                  >
                    {dropoffOptions.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                  {savedLocations && dropoff?.id === 'saved-dropoff' && (
                    <span className="block text-[9px] font-mono text-slate-500">
                      {savedLocations.dropoff.latitude.toFixed(4)}, {savedLocations.dropoff.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1.5">
              <button className="flex items-center justify-between bg-slate-950 hover:bg-slate-850 border border-slate-850 p-2.5 rounded-xl text-left text-xs text-slate-300 transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span className="font-semibold text-[11px] truncate">Pickup now</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
              <button className="flex items-center justify-between bg-slate-950 hover:bg-slate-850 border border-slate-850 p-2.5 rounded-xl text-left text-xs text-slate-300 transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 min-w-0">
                  <User className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span className="font-semibold text-[11px] truncate">For me</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850/80 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-extrabold uppercase">
                <span>Route Stats</span>
                <span className="text-sky-400 font-bold">Calculated</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Est. Distance:</span>
                <span className="font-bold text-slate-200 font-mono">{(distanceFactor * 6.2).toFixed(1)} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Est. Trip Duration:</span>
                <span className="font-bold text-slate-200 font-mono">{Math.round(distanceFactor * 14)} mins</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COLUMN 2: Choose a ride ===== */}
        <section className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl flex-1 flex flex-col justify-between gap-4 sm:gap-5 relative">

            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">Choose a ride</h2>

              {/* --- Vehicle list area with loading / error states --- */}
              {isLoading ? (
                /* 🚀 Fancy loader – shimmer skeletons */
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-slate-800/20 border border-slate-800/50 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-700/50" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-slate-700/50 rounded" />
                          <div className="h-3 w-20 bg-slate-700/50 rounded" />
                          <div className="h-3 w-32 bg-slate-700/50 rounded" />
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-4 w-16 bg-slate-700/50 rounded ml-auto" />
                        <div className="h-3 w-12 bg-slate-700/50 rounded ml-auto" />
                      </div>
                    </div>
                  ))}
                  {/* Shimmer overlay with gradient */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="shimmer-effect w-full h-full" />
                  </div>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-red-400 text-lg font-bold">⚠️ Could not load vehicles</div>
                  <p className="text-slate-400 text-sm mt-1">Please refresh or try again later.</p>
                </div>
              ) : vehicleOptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-slate-400 text-lg">No vehicles available</div>
                  <p className="text-slate-500 text-sm mt-1">Check back later.</p>
                </div>
              ) : (
                /* ✅ Vehicle list when data is ready */
                <div className="thin-scrollbar space-y-2.5 sm:space-y-3 max-h-[320px] sm:max-h-[350px] overflow-y-auto pr-2 -mr-2">
                  {vehicleOptions.map((option) => {
                    const isSelected = selectedVehicleId === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => setSelectedVehicleId(option.id)}
                        className={`relative flex items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl cursor-pointer transition-all border ${isSelected
                            ? 'bg-slate-950 border-sky-500 shadow-lg shadow-sky-500/5 ring-1 ring-sky-500/20'
                            : 'bg-slate-950/40 border-slate-850 hover:bg-slate-950/80 hover:border-slate-800'
                          }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                          <div className="w-11 h-11 sm:w-14 sm:h-14 bg-slate-950 border border-slate-850 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl shadow-inner flex-shrink-0 select-none relative">
                            {option.graphic.startsWith('http') ? (
                              <img src={option.graphic} alt={option.name} className="w-8 h-8 object-contain" />
                            ) : (
                              <span>{option.graphic}</span>
                            )}
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-black text-slate-100">{option.name}</h4>
                              <span className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-0.5">
                                👤 {option.capacity}
                              </span>
                              {option.badge && (
                                <span className="text-[7px] font-bold tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded-md uppercase">
                                  {option.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold tracking-tight">
                              {option.timeAwayMin} mins away • {option.arrivalTime}
                            </p>
                            <p className="hidden xs:block text-[10px] text-slate-400 leading-normal max-w-[160px] sm:max-w-[190px] line-clamp-1">
                              {option.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right space-y-1 shrink-0">
                          <div className="text-xs font-black text-slate-100 font-mono">
                            BDT {option.discountPriceBDT.toFixed(2)}
                          </div>
                          {option.discountPriceBDT < option.basePriceBDT && (
                            <div className="text-[10px] text-slate-500 font-mono line-through font-bold">
                              BDT {option.basePriceBDT.toFixed(2)}
                            </div>
                          )}
                          {isSelected && (
                            <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-sky-500 text-white rounded-full text-[8px] font-bold ml-auto mt-1">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* --- Bottom: Payment + Request --- */}
            <div className="border-t border-slate-800/80 pt-4 space-y-3 sm:space-y-4">
              {/* Payment method dropdown */}
              <div className="relative" ref={ref}>
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  className="w-full flex items-center justify-between bg-slate-950 p-2.5 sm:p-3 rounded-2xl border border-slate-850/80 hover:border-slate-700/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                      <SelectedIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                        Payment Method
                      </span>
                      <span className="text-slate-200 text-xs font-bold truncate block">
                        {selected.value === 'wallet'
                          ? `Wallet Balance (Est. ৳${walletBalance})`
                          : selected.label}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>

                {open && (
                  <div className="absolute z-20 mt-1.5 w-full bg-slate-950 border border-slate-850/80 rounded-2xl overflow-hidden shadow-lg shadow-black/40">
                    {paymentOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = opt.value === paymentMethod;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setPaymentMethod(opt.value);
                            setOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${isActive ? 'bg-sky-500/10' : 'hover:bg-slate-900'
                            }`}
                        >
                          <div className="p-1.5 bg-sky-500/10 rounded-lg border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-slate-200 text-xs font-bold flex-1 truncate">
                            {opt.value === 'wallet' ? `Wallet Balance (Est. ৳${walletBalance})` : opt.label}
                          </span>
                          {isActive && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={handleRequestRide}
                disabled={!selectedVehicle || isLoading}
                className={`w-full font-bold py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-[0.99] ${selectedVehicle && !isLoading
                    ? 'bg-sky-500 hover:bg-sky-400 text-[#070b14] shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)]'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
              >
                <span>
                  {isLoading
                    ? 'Loading…'
                    : selectedVehicle
                      ? `Request ${selectedVehicle.name} · BDT ${selectedVehicle.discountPriceBDT.toFixed(2)}`
                      : 'No ride available'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ===== COLUMN 3: Map ===== */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden min-h-[320px] sm:min-h-[350px]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,132,199,0.06),transparent_80%)] pointer-events-none" />
            <div className="absolute inset-0 bg-map-grid opacity-20 pointer-events-none" />

            <div className="relative z-10 space-y-2.5 sm:space-y-3">
              <div className="bg-slate-950/95 border border-slate-800 p-2.5 sm:p-3 rounded-2xl shadow-xl flex items-start gap-2.5 max-w-[280px]">
                <div className="p-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/15 rounded-lg text-xs font-bold shrink-0">📍</div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[8px] font-mono uppercase text-slate-500 font-extrabold tracking-wider block">Pickup</span>
                  <p className="text-[10px] font-bold text-slate-200 line-clamp-2 leading-relaxed">
                    {pickup?.name || 'Selecting Location...'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/95 border border-slate-800 p-2.5 sm:p-3 rounded-2xl shadow-xl flex items-start gap-2.5 max-w-[280px] ml-auto">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 rounded-lg text-xs font-bold shrink-0">🏁</div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[8px] font-mono uppercase text-slate-500 font-extrabold tracking-wider block">To Destination</span>
                  <p className="text-[10px] font-bold text-slate-200 line-clamp-2 leading-relaxed">
                    {dropoff?.name || 'Selecting Destination...'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[180px] sm:min-h-[220px] flex items-center justify-center relative my-3">
              <svg className="w-full h-full min-h-[180px] sm:min-h-[200px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="10" y1="0" x2="10" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="30" y1="0" x2="30" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="70" y1="0" x2="70" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="90" y1="0" x2="90" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="0" y1="60" x2="100" y2="60" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1 1" />

                {pickup && dropoff && (
                  <>
                    <path
                      d={`M ${pickup.coords.x} ${pickup.coords.y} Q ${(pickup.coords.x + dropoff.coords.x) / 2 - 10} ${(pickup.coords.y + dropoff.coords.y) / 2 + 10} ${dropoff.coords.x} ${dropoff.coords.y}`}
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeOpacity="0.15"
                    />
                    <path
                      d={`M ${pickup.coords.x} ${pickup.coords.y} Q ${(pickup.coords.x + dropoff.coords.x) / 2 - 10} ${(pickup.coords.y + dropoff.coords.y) / 2 + 10} ${dropoff.coords.x} ${dropoff.coords.y}`}
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      className="animate-dash"
                      strokeDasharray="4 2"
                    />
                    <circle r="2.5" fill="#f43f5e" className="animate-car-glow">
                      <animateMotion
                        dur="9s"
                        repeatCount="indefinite"
                        path={`M ${pickup.coords.x} ${pickup.coords.y} Q ${(pickup.coords.x + dropoff.coords.x) / 2 - 10} ${(pickup.coords.y + dropoff.coords.y) / 2 + 10} ${dropoff.coords.x} ${dropoff.coords.y}`}
                      />
                    </circle>
                    <g transform={`translate(${pickup.coords.x}, ${pickup.coords.y})`}>
                      <circle r="4.5" fill="#0ea5e9" fillOpacity="0.2" className="animate-ping-slow" />
                      <circle r="2.5" fill="#0ea5e9" />
                    </g>
                    <g transform={`translate(${dropoff.coords.x}, ${dropoff.coords.y})`}>
                      <rect x="-2.5" y="-2.5" width="5" height="5" fill="#10b981" />
                    </g>
                  </>
                )}
              </svg>

              <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 p-2 sm:p-2.5 rounded-xl text-[9px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-sky-500 rounded-full" /> Pickup Pin</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-md" /> Destination Target</div>
              </div>

              <div className="absolute bottom-3 right-3 flex flex-col gap-1 bg-slate-950/95 border border-slate-800 p-1 rounded-xl shadow-lg">
                <button onClick={() => setZoomLevel(prev => Math.min(18, prev + 1))} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold text-sm text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 rounded-lg transition-colors cursor-pointer">+</button>
                <div className="h-[1px] bg-slate-850" />
                <button onClick={() => setZoomLevel(prev => Math.max(10, prev - 1))} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold text-sm text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 rounded-lg transition-colors cursor-pointer">-</button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <style>{`
        .thin-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(56, 189, 248, 0.4) transparent;
        }
        .thin-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(56, 189, 248, 0.55), rgba(16, 185, 129, 0.45));
          border-radius: 999px;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(56, 189, 248, 0.8), rgba(16, 185, 129, 0.7));
        }
        /* Shimmer animation */
        .shimmer-effect {
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255,255,255,0.03) 40%,
            rgba(255,255,255,0.06) 60%,
            transparent 80%
          );
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
        .animate-dash {
          animation: dash 1s linear infinite;
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes car-glow {
          0% { filter: drop-shadow(0 0 4px #f43f5e); }
          50% { filter: drop-shadow(0 0 12px #f43f5e); }
          100% { filter: drop-shadow(0 0 4px #f43f5e); }
        }
        .animate-car-glow {
          animation: car-glow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}







// {/* 1. Header Bar with Tabs exactly mimicking screenshot */ }
// <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-4 md:px-8">
//   <div className="max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-16">

//     {/* Left: Brand logo & Back link */}
//     <div className="flex items-center gap-3 sm:gap-6 min-w-0">
//       <button
//         onClick={onBackToHome}
//         className="flex items-center gap-1.5 sm:gap-2 text-slate-400 hover:text-slate-100 transition-colors text-[11px] sm:text-xs font-bold cursor-pointer shrink-0"
//       >
//         <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//         <span className="hidden xs:inline">হোমে ফিরুন</span>
//       </button>

//       <div className="text-base sm:text-xl font-black text-slate-100 tracking-tight select-none truncate">
//         Apex<span className="text-sky-400">Ride</span>
//       </div>
//     </div>

//     {/* Middle: Ride, Rentals, Parcel tabs */}
//     <nav className="hidden md:flex items-center gap-6 lg:gap-8 h-full">
//       <button
//         onClick={() => setActiveTopTab('ride')}
//         className={`flex items-center gap-2 h-full px-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTopTab === 'ride'
//           ? 'border-sky-500 text-sky-400'
//           : 'border-transparent text-slate-400 hover:text-slate-200'
//           }`}
//       >
//         <Car className="w-4 h-4" />
//         <span>Ride</span>
//       </button>

//       <button
//         onClick={() => setActiveTopTab('rentals')}
//         className={`flex items-center gap-2 h-full px-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTopTab === 'rentals'
//           ? 'border-sky-500 text-sky-400'
//           : 'border-transparent text-slate-400 hover:text-slate-200'
//           }`}
//       >
//         <Clock className="w-4 h-4" />
//         <span>Rentals</span>
//       </button>

//       <button
//         onClick={() => setActiveTopTab('parcel')}
//         className={`flex items-center gap-2 h-full px-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTopTab === 'parcel'
//           ? 'border-sky-500 text-sky-400'
//           : 'border-transparent text-slate-400 hover:text-slate-200'
//           }`}
//       >
//         <Briefcase className="w-4 h-4" />
//         <span>Parcel</span>
//       </button>
//     </nav>

//     {/* Right: Activity button & profile options */}
//     <div className="flex items-center gap-2 sm:gap-4 shrink-0">
//       <button className="hidden sm:flex items-center gap-1 text-xs font-bold bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
//         <Activity className="w-3.5 h-3.5 text-sky-400" />
//         <span>Activity</span>
//       </button>

//       <button className="hidden sm:flex p-2 bg-slate-950 border border-slate-800 rounded-full text-slate-300 hover:text-slate-100 transition-colors cursor-pointer" title="Share Route">
//         <Share2 className="w-3.5 h-3.5" />
//       </button>

//       <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 py-1 px-2.5 rounded-full text-xs font-bold text-slate-300">
//         <div className="w-5 h-5 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center font-bold text-[10px]">
//           U
//         </div>
//         <ChevronDown className="w-3 h-3 text-slate-500" />
//       </div>
//     </div>

//   </div>
// </header>

// {/* Mobile top-navigation fallback tab bar */ }
// <div className="flex md:hidden bg-slate-900 border-b border-slate-800/80 p-1 justify-around">
//   <button
//     onClick={() => setActiveTopTab('ride')}
//     className={`flex-1 py-2.5 sm:py-3 text-center text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${activeTopTab === 'ride' ? 'text-sky-400 border-b border-sky-500' : 'text-slate-400'
//       }`}
//   >
//     <Car className="w-3.5 h-3.5" />
//     <span>Ride</span>
//   </button>
//   <button
//     onClick={() => setActiveTopTab('rentals')}
//     className={`flex-1 py-2.5 sm:py-3 text-center text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${activeTopTab === 'rentals' ? 'text-sky-400 border-b border-sky-500' : 'text-slate-400'
//       }`}
//   >
//     <Clock className="w-3.5 h-3.5" />
//     <span>Rentals</span>
//   </button>
//   <button
//     onClick={() => setActiveTopTab('parcel')}
//     className={`flex-1 py-2.5 sm:py-3 text-center text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${activeTopTab === 'parcel' ? 'text-sky-400 border-b border-sky-500' : 'text-slate-400'
//       }`}
//   >
//     <Briefcase className="w-3.5 h-3.5" />
//     <span>Parcel</span>
//   </button>
// </div>