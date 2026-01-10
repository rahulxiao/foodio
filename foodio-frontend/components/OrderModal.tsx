'use client';

import React, { useState } from 'react';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (quantity: number) => void;
    itemTitle: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onConfirm, itemTitle }) => {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen) return null;

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg p-8 relative scale-100 animate-in zoom-in-95 duration-200">

                {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-[#1B3B36] mb-8 font-serif">Are you sure want to buy?</h2>

                {/* Item Details */}
                <div className="mb-8">
                    <p className="text-gray-400 text-sm mb-2">Items</p>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-[#1B3B36]">{itemTitle}</span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDecrement}
                                className="w-8 h-8 rounded-full border border-[#1B3B36] text-[#1B3B36] flex items-center justify-center hover:bg-[#1B3B36] hover:text-white transition-colors text-lg leading-none pb-1"
                            >
                                −
                            </button>
                            <div className="w-12 h-10 border border-[#E5E7EB] rounded-lg flex items-center justify-center text-[#1B3B36] font-semibold bg-[#FDFDFC]">
                                {quantity}
                            </div>
                            <button
                                onClick={handleIncrement}
                                className="w-8 h-8 rounded-full border border-[#1B3B36] text-[#1B3B36] flex items-center justify-center hover:bg-[#1B3B36] hover:text-white transition-colors text-lg leading-none pb-1"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 pt-4 border-t border-transparent">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-full border border-[#1B3B36] text-[#1B3B36] font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(quantity)}
                        className="flex-1 py-3.5 rounded-full bg-[#1B3B36] text-white font-semibold hover:bg-[#152e2a] transition-colors shadow-lg shadow-[#1B3B36]/20"
                    >
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
