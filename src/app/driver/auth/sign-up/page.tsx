'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle2, User, Car, FileText, ArrowRight, ChevronLeft } from 'lucide-react';
import { useCreateDriverMutation, useUploadImageMutation } from '@/redux/features/driver/driverApi';

const STEPS = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'vehicle', label: 'Vehicle Info', icon: Car },
    { id: 'documents', label: 'Documents', icon: FileText },
];

function UploadBox({ label, uploaded, onUpload }) {
    return (
        <button
            onClick={onUpload}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${uploaded
                    ? 'bg-emerald-500/[0.06] border-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${uploaded ? 'bg-emerald-500/15' : 'bg-slate-900'}`}>
                {uploaded ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <UploadCloud className="w-5 h-5 text-slate-500" />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-200">{label}</div>
                <div className="text-xs text-slate-500">{uploaded ? 'Uploaded' : 'Tap to upload (JPG/PNG/PDF)'}</div>
            </div>
        </button>
    );
}

export default function DriverOnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [docs, setDocs] = useState({});
    const [uploadingImge, { isLoading }] = useUploadImageMutation()
    const [creatingUser,{isLoading:driverLoader}] = useCreateDriverMutation()

    const toggleDoc = (key:any) => setDocs((d) => ({ ...d, [key]: true }));

    const isLastStep = step === STEPS.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            router.push('/verification-pending');
        } else {
            setStep((s) => s + 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
            <header className="border-b border-slate-800/80 bg-[#0a0f1a]/80 backdrop-blur-xl">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
                    <button onClick={() => step > 0 && setStep(step - 1)} className="p-2 rounded-full hover:bg-slate-800/60 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold">
                        Apex<span className="text-sky-400">Drive</span> Onboarding
                    </span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className={`flex items-center gap-2 ${i <= step ? 'text-sky-400' : 'text-slate-600'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${i <= step ? 'border-sky-500 bg-sky-500/15' : 'border-slate-800'}`}>
                                    <s.icon className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-semibold hidden sm:inline">{s.label}</span>
                            </div>
                            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-sky-500' : 'bg-slate-800'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6">
                    {step === 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold mb-1">Personal Information</h2>
                            <input placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500" />
                            <input placeholder="National ID (NID) Number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500" />
                            <input placeholder="Date of Birth" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500" />
                            <input placeholder="Home Address" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500" />
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold mb-1">Vehicle Information</h2>
                            <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500">
                                <option>Select Vehicle Type</option>
                                <option>Car</option>
                                <option>Bike</option>
                                <option>Auto/CNG</option>
                            </select>
                            <input placeholder="Vehicle Model (e.g. Toyota Axio)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500" />
                            <input placeholder="Number Plate" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500" />
                            <input placeholder="Manufacturing Year" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500" />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-3">
                            <h2 className="text-lg font-bold mb-1">Upload Documents</h2>
                            <p className="text-xs text-slate-500 mb-4">Clear photos, all corners visible.</p>
                            <UploadBox label="Driving License (Front)" uploaded={docs.licenseFront} onUpload={() => toggleDoc('licenseFront')} />
                            <UploadBox label="Driving License (Back)" uploaded={docs.licenseBack} onUpload={() => toggleDoc('licenseBack')} />
                            <UploadBox label="National ID Card" uploaded={docs.nid} onUpload={() => toggleDoc('nid')} />
                            <UploadBox label="Vehicle Registration Paper" uploaded={docs.regPaper} onUpload={() => toggleDoc('regPaper')} />
                            <UploadBox label="Vehicle Photo" uploaded={docs.vehiclePhoto} onUpload={() => toggleDoc('vehiclePhoto')} />
                            <UploadBox label="Your Selfie" uploaded={docs.selfie} onUpload={() => toggleDoc('selfie')} />
                        </div>
                    )}

                    <button
                        onClick={handleNext}
                        className="mt-6 w-full bg-sky-500 hover:bg-sky-400 text-[#070b14] font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)]"
                    >
                        <span>{isLastStep ? 'Submit for Review' : 'Continue'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </main>
        </div>
    );
}