import React from 'react';
import Image from 'next/image';

const TopUI: React.FC = () => {
    return (
        <div className="absolute top-0 right-0 w-200 h-190 z-50 overflow-hidden">
            <div
                className="
                    relative w-full h-full bg-[#FEF8F1] shadow-x0 overflow-hidden
                    rounded-tr-[0px]
                    rounded-tl-[0px]
                    rounded-br-[0px]
                    rounded-bl-[250px]
                "
            >
                {/* Small image in bottom-left corner */}
                <div className="absolute bottom-1 left-1 w-140 h-140">
                    <Image
                        src="/images/hero-pasta.png"
                        alt="Top UI"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default TopUI;
