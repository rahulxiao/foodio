'use client';

import React, { useState } from 'react';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (quantity: number) => void;
    itemTitle: string;
}

const OrderModal: React.FC<OrderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemTitle,
}) => {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen) return null;

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-[#FDFDFC] w-full max-w-lg rounded-[28px] shadow-2xl p-8 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-[26px] font-semibold text-[#1B3B36] mb-8">
                    Are you sure want to buy?
                </h2>

                {/* Item Section */}
                <div className="mb-10">
                    <p className="text-gray-400 text-sm mb-3">Items</p>

                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-[#1B3B36]">
                            {itemTitle}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDecrement}
                                className="w-8 h-8 rounded-full border border-[#1B3B36] text-[#1B3B36] flex items-center justify-center text-lg pb-0.5"
                            >
                                −
                            </button>

                            <div className="w-14 h-9 border border-[#E6E2DA] rounded-lg flex items-center justify-center text-[#1B3B36] font-semibold">
                                {quantity}
                            </div>

                            <button
                                onClick={handleIncrement}
                                className="w-8 h-8 rounded-full border border-[#1B3B36] text-[#1B3B36] flex items-center justify-center text-lg pb-0.5"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-10 py-3 rounded-full border border-[#1B3B36] text-[#1B3B36] font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onConfirm(quantity)}
                        className="px-10 py-3 rounded-full bg-[#1B3B36] text-white font-medium hover:bg-[#152e2a] transition-colors"
                    >
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
