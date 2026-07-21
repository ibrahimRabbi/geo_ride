import { Info } from 'lucide-react';
import React from 'react';

const Footer = () => {
    return (
        
            <footer className="bg-slate-900/40 border-t border-slate-900 py-5 sm:py-6 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-1.5 text-center sm:text-left">
                        <Info className="w-4 h-4 text-sky-500/80 shrink-0" />
                        <span>This is an interactive design preview generated strictly in standard Next.js & Tailwind CSS.</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-600">APEX MOBILITY PROTOCOL • 2026</span>
                </div>
            </footer>

         
    );
};

export default Footer;