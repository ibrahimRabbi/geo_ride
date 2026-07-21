'use client'
import React, { useState } from 'react';
import {
    Bike,
    Car,
    MapPin,
    Calendar,
    Clock,
    Package,
    Plane,
    PlaneTakeoff,
    Crown,
    Navigation,
    ExternalLink,
    DollarSign,
    X,
    Compass,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

interface ServiceCard {
    id: string;
    title: string;
    description: string;
    badge?: string;
    imageUrl?: string;
    icon: React.ReactNode;
    category: 'ride' | 'flight';
    color: string;
    details: {
        tagline: string;
        points: string[];
        priceEstimate: string;
        speed: string;
    };
}

export default function WaysToRide() {
    const [activeTab, setActiveTab] = useState<'all' | 'ride' | 'flight'>('all');
    const [selectedService, setSelectedService] = useState<ServiceCard | null>(null);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'success'>('idle');

    const services: ServiceCard[] = [
        // Ride Services (Exact ones from image)
        {
            id: 'bike',
            title: 'Bike',
            description: 'Get affordable motorbike rides in minutes at your doorstep.',
            icon: <Bike className="w-8 h-8 text-amber-400" />,
            category: 'ride',
            color: 'from-amber-500/10 to-amber-600/5 border-amber-500/20',
            details: {
                tagline: 'Skip gridlock completely with lightning fast motorbike dispatches.',
                points: [
                    'Solo passenger express transit',
                    'Premium helmets provided and sanitized after every ride',
                    'Eco-friendly low-emission urban vehicles'
                ],
                priceEstimate: '$2.50 base + $0.45/mile',
                speed: 'Avg. pickup < 3 minutes'
            }
        },
        {
            id: 'intercity',
            title: 'Intercity',
            description: 'Get convenient, affordable outstation cabs anytime at your door.',
            icon: <Navigation className="w-8 h-8 text-sky-400" />,
            category: 'ride',
            color: 'from-sky-500/10 to-sky-600/5 border-sky-500/20',
            badge: 'POPULAR',
            details: {
                tagline: 'Cross city borders with high-grade sedans and top certified captains.',
                points: [
                    'Highway toll clearance pre-paid & bundled in price',
                    'Spacious trunk room for multi-day bags',
                    'Custom refreshment coolers & climate preferences'
                ],
                priceEstimate: '$18.00 base + $1.10/mile',
                speed: 'Door-to-door highway travel'
            }
        },
        {
            id: 'rentals',
            title: 'Rentals',
            description: 'Request a trip for a block of time and make multiple stops.',
            icon: <Clock className="w-8 h-8 text-purple-400" />,
            category: 'ride',
            color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
            details: {
                tagline: 'Secure a vehicle & premium chauffeur by the hour for complete freedom.',
                points: [
                    'Modify stops dynamically directly inside your map',
                    'Chauffeur waits on-call at all locations',
                    'Available in blocks from 1 to 12 hours'
                ],
                priceEstimate: '$22.00 / Hour flat charge',
                speed: 'Unlimited stopovers'
            }
        },
        {
            id: 'reserve',
            title: 'Reserve',
            description: 'Reserve your ride in advance so you can relax on the day of your trip.',
            icon: <Calendar className="w-8 h-8 text-rose-400" />,
            category: 'ride',
            color: 'from-rose-500/10 to-rose-600/5 border-rose-500/20',
            badge: 'RECOMMENDED',
            details: {
                tagline: 'Scheduled travel protection with a 100% on-time driver match guarantee.',
                points: [
                    'Book from 30 minutes up to 90 days in advance',
                    'Driver assigned & on-route 15 minutes ahead',
                    'Free cancellation up to 1 hour before scheduled time'
                ],
                priceEstimate: '$10.00 reservation lock + standard rate',
                speed: 'Guaranteed dispatch'
            }
        },
        {
            id: 'ride',
            title: 'Ride',
            description: 'Go anywhere with Apex. Request a ride, hop in, and go.',
            icon: <Car className="w-8 h-8 text-blue-400" />,
            category: 'ride',
            color: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
            details: {
                tagline: 'Our flagship everyday on-demand sedan service with instant pickup matching.',
                points: [
                    'Upfront pricing with immediate driver lock',
                    'Real-time safety tracking sharing with loved ones',
                    '24/7 client dispatch hotline support'
                ],
                priceEstimate: '$6.00 base + $0.80/mile',
                speed: 'Avg. pickup 2-4 minutes'
            }
        },

        // Flight Services (Additional Premium Air-travel cards requested)
        {
            id: 'domestic-flights',
            title: 'Domestic Flights',
            description: 'Lock prices & secure low-frequency city connections instantly.',
            icon: <PlaneTakeoff className="w-8 h-8 text-sky-400" />,
            category: 'flight',
            color: 'from-sky-500/10 to-sky-600/5 border-sky-500/20',
            badge: 'AIR EXCLUSIVE',
            details: {
                tagline: 'Integrated commercial domestic travel connecting metropolises.',
                points: [
                    'Pre-cleared biometric security routing at airport terminals',
                    'Complimentary high-tier lounge passes included with every ticket',
                    'Carbon-offset contributions calculated & offset on flight completion'
                ],
                priceEstimate: 'Fares starting at $89.00',
                speed: 'Regional high-speed air link'
            }
        },
        {
            id: 'private-charters',
            title: 'Private Charters',
            description: 'Bypass commercial queues. Reserve custom high-tier private jets.',
            icon: <Crown className="w-8 h-8 text-amber-400" />,
            category: 'flight',
            color: 'from-amber-500/10 to-amber-600/5 border-amber-500/20',
            badge: 'APEX ULTRA',
            details: {
                tagline: 'The ultimate bespoke private jet travel service.',
                points: [
                    'Board via private FBO suites with zero security wait times',
                    'Custom dynamic dining & premium cabin specs',
                    'Fly instantly on your exact personal time schedule'
                ],
                priceEstimate: 'From $1,400.00 / Flight hour',
                speed: 'Bespoke direct air corridors'
            }
        },
        {
            id: 'global-inter',
            title: 'Global Inter',
            description: 'Long-range luxury routes with integrated express customs routing.',
            icon: <Plane className="w-8 h-8 text-purple-400" />,
            category: 'flight',
            color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
            details: {
                tagline: 'Cross-continental premium business class connections.',
                points: [
                    'Flat-bed seating pods with ultimate workspace privacy',
                    'Express border customs clearances in partner countries',
                    'Complimentary limousine chauffeur transfers to/from the airport'
                ],
                priceEstimate: 'Fares starting at $450.00',
                speed: 'Intercontinental express routes'
            }
        },
        {
            id: 'heli-shuttle',
            title: 'Urban Heliport Shuttle',
            description: 'Skip terminal highways with immediate helicopter rooftop transfers.',
            icon: <Compass className="w-8 h-8 text-rose-400 animate-spin-slow" />,
            category: 'flight',
            color: 'from-rose-500/10 to-rose-600/5 border-rose-500/20',
            badge: 'FAST TRANSIT',
            details: {
                tagline: 'Heli-shuttle bypasses highway traffic between downtown and airports.',
                points: [
                    '8-minute transfer from downtown rooftop pads directly to airport gates',
                    'Strict weight & safety lock checks with elite twin-engine aircraft',
                    'Direct baggage pre-routing to your commercial carrier'
                ],
                priceEstimate: '$195.00 flat fare / passenger seat',
                speed: '8 minute airport bypass'
            }
        },
    ];

    const filteredServices = activeTab === 'all'
        ? services
        : services.filter(s => s.category === activeTab);

    const handleBookService = () => {
        setBookingStatus('success');
        setTimeout(() => {
            setBookingStatus('idle');
            setSelectedService(null);
        }, 3500);
    };

    return (
        <div className="space-y-8">
            {/* Category Tabs & Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-5">
                <div>
                    <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
                        <span className="text-sky-400">❖</span>
                        Ways to ride and more
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Explore all land-based and premium airline dispatch services.</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800 self-start">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'all' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/15' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        All Services ({services.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('ride')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'ride' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/15' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Ground Rides ({services.filter(s => s.category === 'ride').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('flight')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'flight' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/15' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Flights & Air ({services.filter(s => s.category === 'flight').length})
                    </button>
                </div>
            </div>

            {/* Main Grid Layout - Exact layout as image */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                    <div
                        key={service.id}
                        className={`bg-gradient-to-br ${service.color} border p-6 rounded-3xl flex flex-col justify-between gap-5 relative hover:border-slate-600 hover:-translate-y-1 transition-all duration-300 shadow-xl`}
                    >
                        {/* Badge Indicator */}
                        {service.badge && (
                            <span className="absolute top-4 right-4 text-[8px] font-bold tracking-widest bg-sky-500/20 text-sky-300 border border-sky-400/25 px-2.5 py-1 rounded-full uppercase">
                                {service.badge}
                            </span>
                        )}

                        {/* Header Content */}
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-950/60 rounded-2xl w-14 h-14 flex items-center justify-center border border-slate-800 shadow-inner">
                                {service.icon}
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-base font-extrabold text-slate-100 tracking-tight">{service.title}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">
                                    {service.description}
                                </p>
                            </div>
                        </div>

                        {/* Action Button Area */}
                        <div className="pt-2 border-t border-slate-900/50 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                                {service.category === 'ride' ? 'Ground Option' : 'Airline Tier'}
                            </span>
                            <button
                                onClick={() => {
                                    setBookingStatus('idle');
                                    setSelectedService(service);
                                }}
                                className="bg-slate-100 hover:bg-white text-slate-950 px-4.5 py-2 rounded-full text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                            >
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* DETAILED BOTTOM SHEET MODAL OVERLAY */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop blurring click-out */}
                    <div
                        onClick={() => setSelectedService(null)}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                    />

                    {/* Modal Container */}
                    <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 animate-scale-up z-10">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                                    {selectedService.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-100">{selectedService.title}</h3>
                                    <span className="text-[10px] font-mono uppercase text-sky-400 font-bold tracking-wider">
                                        {selectedService.category === 'ride' ? 'Core Ground Dispatch' : 'Aero Fleet Hub'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedService(null)}
                                className="p-1.5 rounded-full bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-100 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body Info */}
                        <div className="space-y-4">
                            <p className="text-xs text-slate-300 leading-relaxed italic font-medium">
                                "{selectedService.details.tagline}"
                            </p>

                            {/* Grid Specs */}
                            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850/80">
                                <div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Rate Estimate</span>
                                    <span className="text-xs font-bold text-emerald-400 font-mono block mt-1">
                                        {selectedService.details.priceEstimate}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Transit Speed</span>
                                    <span className="text-xs font-bold text-sky-400 block mt-1">
                                        {selectedService.details.speed}
                                    </span>
                                </div>
                            </div>

                            {/* Service Highlights list */}
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-extrabold block">What is included</span>
                                <div className="space-y-2">
                                    {selectedService.details.points.map((pt, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>{pt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Custom Interactive Action */}
                        {bookingStatus === 'success' ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-400 animate-fade-in">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                                <div className="text-xs">
                                    <span className="font-bold block">Service Locked & Selected!</span>
                                    Your preference has been successfully updated on your active ride session.
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="bg-slate-950 border border-slate-800 hover:bg-slate-900 py-3 rounded-2xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer text-center"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleBookService}
                                    className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer text-center shadow-lg shadow-sky-500/10"
                                >
                                    Select this option
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}
