import React from 'react';
import DriverNavber from '../_components/DriverNavber';
import { Toaster } from 'sonner';

const layout = ({children}:{children:React.ReactNode}) => {
    return (
        <div>
            <DriverNavber/>
            {children}
            <Toaster/>
        </div>
    );
};

export default layout;