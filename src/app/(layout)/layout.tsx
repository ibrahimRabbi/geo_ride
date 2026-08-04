import Footer from '@/components/Footer';
import Navbar from '@/components/Navber';
import { GoogleMapsProvider } from '@/hooks/GoogleMapProvider';
import React from 'react';
import { Toaster } from 'react-hot-toast';

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            <GoogleMapsProvider>
                {children}
            </GoogleMapsProvider>
            <Footer />
            <Toaster />
        </div>
    );
};

export default layout;