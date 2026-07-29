import React from 'react';
import DriverNavber from '../_components/DriverNavber';
 
 

const layout = ({children}:{children:React.ReactNode}) => {
    return (
        <div>
            <DriverNavber/>
            {children}
           
        </div>
    );
};

export default layout;