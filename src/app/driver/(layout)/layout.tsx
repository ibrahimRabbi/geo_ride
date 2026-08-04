import React from 'react';
import DriverNavber from '../_components/DriverNavber';
import { LocationTrackerProvider } from '@/hooks/LocationTracker';



const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <LocationTrackerProvider>
                <DriverNavber />
                {children}
            </LocationTrackerProvider>
        </div>
    );
};

export default layout;