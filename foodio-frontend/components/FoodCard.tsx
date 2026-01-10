import Image from 'next/image';
import React from 'react';

interface FoodCardProps {
    title?: string;
    description?: string;
    price?: string;
    imageUrl?: string;
    onAddToOrder?: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
    title = "Pan-Seared Scallops",
    description = "Jumbo scallops with cauliflower purée and truffle oil.",
    price = "$15.00",
    imageUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop", // Placeholder food image
    onAddToOrder,
}) => {
    return (
        <div className="relative mt-20 w-full h-full">
            {/* Card Container */}
            <div className="w-full h-full bg-[#FEF8F1] rounded-[30px] md:rounded-[40px] p-8 pt-32 shadow-xl relative mx-auto group hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between">
                {/* Floating Image */}
                <div className="absolute -top-20 left-1 w-48 h-48 rounded-full shadow-xl overflow-hidden border-4 border-white/20">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        {description}
                    </p>
                    <div className="text-3xl font-bold text-[#1B3B36] mt-2">
                        {price}
                    </div>
                </div>

                {/* Add to Order Button */}
                <button
                    onClick={onAddToOrder}
                    className="absolute -bottom-6 -right-0 bg-[#1B3B36] text-white px-6 py-3 rounded-l-full rounded-r-none rounded-br-[40px] flex items-center gap-2 shadow-lg hover:bg-[#152e2a] transition-colors"
                    style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '40px' }}
                >
                    <span className="font-medium text-sm">Order Now</span>
                    <span className="text-lg">+</span>
                </button>
            </div>
        </div>
    );
};

export default FoodCard;
