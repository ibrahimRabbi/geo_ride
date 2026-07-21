import React from 'react';

const layout = ({ children, hero, cards }: { children: React.ReactNode; hero: React.ReactNode; cards: React.ReactNode }) => {
    return (
        <div className="w-[80%] mx-auto my-20">
            {hero}
            {cards}
            {children}
        </div>
    );
};

export default layout;