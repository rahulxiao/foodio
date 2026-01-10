import Image from 'next/image';
import React from 'react';

const Hero = () => {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden lg:overflow-visible">

            {/* Text Content */}
            <div className="space-y-8 z-10 pt-10 lg:pt-0">
                <span className="inline-block px-4 py-1.5 bg-[#FEF8F1] text-[#D4A373] text-xs font-bold rounded-md tracking-wider uppercase border border-[#FBEAD2]">
                    Full Food Delivery Service
                </span>
                <h1 className="text-5xl md:text-7xl font-serif text-[#1B3B36] leading-[1.1] tracking-tight">
                    Where Great Food <br /> Meets <span className="font-serif italic font-light">Great Taste.</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-md leading-relaxed font-light">
                    Experience a symphony of flavors crafted with passion. Premium ingredients, exquisite recipes, delivered to your door.
                </p>
                <div className="flex items-center gap-4 pt-4">
                    <a href="/menu" className="bg-[#1B3B36] text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-[#152e2a] transition-colors flex items-center gap-2 shadow-lg shadow-[#1B3B36]/20">
                        Order Now <span className="text-lg leading-none">→</span>
                    </a>
                    <a href="/menu" className="bg-white border border-gray-300 text-[#1B3B36] px-8 py-4 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                        View Menu
                    </a>
                </div>
            </div>

            {/* Image Content */}
            <div className="relative h-[600px] w-full flex items-center justify-center lg:justify-end">
                {/* Background Shape - Beige Curve */}
                <div className="absolute top-[-10%] right-[-50%] lg:right-[-40%] w-[150%] h-[120%] bg-[#FEF8F1] rounded-l-full -z-10 rotate-[-5deg] scale-110" />

                {/* Main Image */}
                <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px]">
                    <img
                        src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2070&auto=format&fit=crop"
                        alt="Delicious Pasta"
                        className="object-cover rounded-full shadow-2xl z-10 w-full h-full"
                    />
                    {/* Decorative elements could be added here */}
                </div>
            </div>
        </section>
    );
};

export default Hero;
