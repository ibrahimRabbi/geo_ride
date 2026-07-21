import React from 'react';
import { Navigation, Compass, Shield } from 'lucide-react';
import { Location } from '@/lib/types';

interface CityMapProps {
    pickup: Location | null;
    dropoff: Location | null;
}

export default function CityMap({ pickup, dropoff }: CityMapProps) {
    return (
        <div className="relative w-full h-[320px] md:h-full min-h-[300px] md:min-h-[500px] rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between">
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(30, 41, 59, 0.5)" strokeWidth="0.15" />
                    </pattern>
                    <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="0.8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <rect width="100" height="100" fill="url(#grid)" />

                {/* Streets */}
                <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />
                <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />
                <line x1="0" y1="55" x2="100" y2="55" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />
                <line x1="0" y1="90" x2="100" y2="90" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />
                <line x1="15" y1="0" x2="15" y2="100" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />
                <line x1="35" y1="0" x2="35" y2="100" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />
                <line x1="55" y1="0" x2="55" y2="100" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />
                <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />
                <line x1="90" y1="0" x2="90" y2="100" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" />

                {/* Route between pickup & dropoff */}
                {pickup && dropoff && (
                    <path
                        d={`M ${pickup.coords.x},${pickup.coords.y} L ${dropoff.coords.x},${pickup.coords.y} L ${dropoff.coords.x},${dropoff.coords.y}`}
                        fill="none"
                        stroke="rgba(56, 189, 248, 0.8)"
                        strokeWidth="0.9"
                        filter="url(#route-glow)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="2, 2"
                    />
                )}

                {/* Pickup pin */}
                {pickup && (
                    <g>
                        <circle cx={pickup.coords.x} cy={pickup.coords.y} r="2.5" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="0.5" />
                        <circle cx={pickup.coords.x} cy={pickup.coords.y} r="0.8" fill="#10b981" />
                    </g>
                )}

                {/* Dropoff pin */}
                {dropoff && (
                    <g>
                        <circle cx={dropoff.coords.x} cy={dropoff.coords.y} r="2.5" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="0.5" />
                        <polygon
                            points={`${dropoff.coords.x},${dropoff.coords.y - 1.2} ${dropoff.coords.x - 1},${dropoff.coords.y + 0.8} ${dropoff.coords.x + 1},${dropoff.coords.y + 0.8}`}
                            fill="#ef4444"
                        />
                    </g>
                )}
            </svg>

            {/* Top HUD */}
            <div className="relative z-10 p-4 flex justify-between w-full pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 pointer-events-auto shadow-lg">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-mono tracking-wider text-slate-300 font-bold">GRID CITY V2.4</span>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 pointer-events-auto shadow-lg self-start">
                    <Navigation className="w-3.5 h-3.5 text-sky-400 rotate-45" />
                    <span className="text-[10px] font-mono text-slate-300">GPS ACCURATE (3m)</span>
                </div>
            </div>

            {/* Selected route info card */}
            <div className="relative z-10 p-4 w-full pointer-events-none">
                {pickup && dropoff && (
                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl pointer-events-auto shadow-xl max-w-[280px]">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                            Selected Route
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] text-white font-bold mt-1">
                                    A
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-slate-200 truncate">{pickup.name}</div>
                                    <div className="text-[10px] text-slate-500">Pickup Location</div>
                                </div>
                            </div>
                            <div className="w-[1px] h-3 bg-slate-700 ml-[5px]" />
                            <div className="flex items-start gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex items-center justify-center text-[7px] text-white font-bold mt-1">
                                    B
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-slate-200 truncate">{dropoff.name}</div>
                                    <div className="text-[10px] text-slate-500">Destination Point</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom ribbon */}
            <div className="relative z-10 px-4 py-3 bg-slate-900/70 border-t border-slate-800/50 backdrop-blur-md flex items-center gap-1.5 text-[11px] text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Trip Protected by Apex Safety Shield</span>
            </div>
        </div>
    );
}