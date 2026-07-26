'use client';
import BookingPanel from '@/components/BookingPanal';
import CityMap from '@/components/CityMap';

 
import { Location } from '@/lib/types';
import React, { useState } from 'react';

export default function Page() {
    const [pickup, setPickup] = useState<Location | null>(null);
    const [dropoff, setDropoff] = useState<Location | null>(null);

    return (
        <section className="mx-auto my-20 px-4">
            <h1 className="text-white text-3xl sm:text-5xl text-center uppercase">
                Get Your First Trip With Us
            </h1>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full mt-10">
                    <div className="w-full lg:w-[55%]">
                        <CityMap pickup={pickup} dropoff={dropoff} />
                    </div>
                    <div className="w-full lg:w-[45%]">
                        <BookingPanel
                            pickup={pickup}
                            dropoff={dropoff}
                            setPickup={setPickup}
                            setDropoff={setDropoff}
                        />
                    </div>
                </div>
        </section>
    );
}