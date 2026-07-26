'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  User,
  ChevronDown,
  Wallet,
  Banknote,
  ChevronRight,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetRequestWithVehiclesQuery } from '@/redux/features/ride/rideApi';
import CityMap from '@/components/CityMap'; // the real Google Maps component built earlier

interface EstimationDashboardProps {
  walletBalance: number;
}

const paymentOptions = [
  { value: 'wallet', label: 'Wallet Balance', icon: Wallet },
  { value: 'cash', label: 'Cash', icon: Banknote },
] as const;

interface VehicleEstimateOption {
  id: string;
  name: string;
  capacity: number;
  durationMin: number;
  arrivalTime: string;
  description: string;
  fareBDT: number;
  badge?: string;
  image: string;
}

function getArrivalTime(minutesAway: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutesAway);
  return now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function EstimationDashboard({ walletBalance }: EstimationDashboardProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wallet'>('wallet');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: requestWithVehicles, isLoading, isError } = useGetRequestWithVehiclesQuery({});

  const rideRequest = requestWithVehicles?.data?.rideRequest;
  const vehicles = requestWithVehicles?.data?.vehicles ?? [];

  const selected = paymentOptions.find((o) => o.value === paymentMethod)!;
  const SelectedIcon = selected.icon;

  // Backend already returns fare + duration per vehicle (calculated from
  // rideRequest.totalDistanceKm + each vehicle's own rate/speed) — no client-side
  // distance/fare math needed here anymore, just map the shape for display.
  const vehicleOptions = useMemo<VehicleEstimateOption[]>(() => {
    return vehicles.map((v: any) => ({
      id: v._id,
      name: v.vehicle_name,
      capacity: v.capacity,
      durationMin: v.duration,
      arrivalTime: getArrivalTime(v.duration),
      description: v.description,
      fareBDT: v.fare,
      badge: v.badge,
      image: v.image,
    }));
  }, [vehicles]);

  // Auto-select the first vehicle once the list loads
  useEffect(() => {
    if (vehicleOptions.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicleOptions[0].id);
    }
  }, [vehicleOptions, selectedVehicleId]);

  // Close payment dropdown on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selectedVehicle = vehicleOptions.find((v) => v.id === selectedVehicleId) || vehicleOptions[0];

  const handleRequestRide = () => {
    router.push('/find-driver');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">

        {/* ===== COLUMN 1: Trip summary (from rideRequest) ===== */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 sm:space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">Your ride</h2>
              <p className="text-[11px] text-slate-400">Locked in from your request — pick a vehicle to continue.</p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-400">
              <span className="text-base flex-shrink-0">🏷️</span>
              <div>
                <span className="font-bold block text-emerald-300">30% off your next 5 rides</span>
                <span className="text-[10px] text-emerald-400/80 font-medium">Promo automatically added to current estimates.</span>
              </div>
            </div>

            {/* Pickup / Dropoff — read-only, this trip was already requested */}
            <div className="relative space-y-3.5">
              <div className="absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-slate-800 border-dashed border-slate-700/60" />

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] shadow-sm mt-1 text-sky-400">●</div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">Pick Up Point</span>
                  <p className="text-xs font-semibold text-slate-200 leading-snug">
                    {rideRequest?.pickup?.address ?? (isLoading ? 'Loading…' : '—')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-1 text-emerald-400">■</div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">Destination</span>
                  <p className="text-xs font-semibold text-slate-200 leading-snug">
                    {rideRequest?.dropOff?.address ?? (isLoading ? 'Loading…' : '—')}
                  </p>
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

            {/* Route stats — straight from rideRequest, no client-side estimation */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850/80 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-extrabold uppercase">
                <span>Route Stats</span>
                <span className="text-sky-400 font-bold">Calculated</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Distance:</span>
                <span className="font-bold text-slate-200 font-mono">
                  {rideRequest?.totalDistanceKm != null ? `${rideRequest.totalDistanceKm} km` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Est. Duration (selected ride):</span>
                <span className="font-bold text-slate-200 font-mono">
                  {selectedVehicle ? `${selectedVehicle.durationMin} mins` : '—'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COLUMN 2: Choose a ride ===== */}
        <section className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl flex-1 flex flex-col justify-between gap-4 sm:gap-5 relative">

            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">Choose a ride</h2>

              {isLoading ? (
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
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-1.5">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <div className="text-rose-400 text-sm font-bold">Could not load vehicles</div>
                  <p className="text-slate-500 text-xs">Please refresh or try again later.</p>
                </div>
              ) : vehicleOptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-slate-400 text-sm">No vehicles available</div>
                  <p className="text-slate-500 text-xs mt-1">Check back later.</p>
                </div>
              ) : (
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
                          <div className="w-11 h-11 sm:w-14 sm:h-14 bg-slate-950 border border-slate-850 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 select-none relative overflow-hidden">
                            {option.image ? (
                              <img src={option.image} alt={option.name} className="w-9 h-9 object-contain" />
                            ) : (
                              <span className="text-xl sm:text-3xl">🚗</span>
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
                              {option.durationMin} mins away • {option.arrivalTime}
                            </p>
                            <p className="hidden xs:block text-[10px] text-slate-400 leading-normal max-w-[160px] sm:max-w-[190px] line-clamp-1">
                              {option.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right space-y-1 shrink-0">
                          <div className="text-xs font-black text-slate-100 font-mono">
                            BDT {option.fareBDT.toFixed(2)}
                          </div>
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
                      ? `Request ${selectedVehicle.name} · BDT ${selectedVehicle.fareBDT.toFixed(2)}`
                      : 'No ride available'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ===== COLUMN 3: Real map (Google Maps, driven by rideRequest coords) ===== */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <CityMap pickup={rideRequest?.pickup} dropoff={rideRequest?.dropOff} />
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
      `}</style>
    </div>
  );
}