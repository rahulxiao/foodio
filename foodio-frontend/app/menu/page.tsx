'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import FoodCard from "../../components/FoodCard";
import OrderModal from '@/components/OrderModal';
import { API_ENDPOINTS, getImageUrl } from "../../lib/api";
import Footer from "../../components/Footer";
import { showSuccessToast } from "../../lib/notifications";


export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));

        setLoading(true);
        fetch(`${API_ENDPOINTS.MENU.GET_ALL}?category=${activeCategory}`)
            .then(res => res.json())
            .then(data => {
                setMenuItems(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Menu fetch failed", err);
                setLoading(false);
            });
    }, [activeCategory]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleOrderClick = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleConfirmOrder = async (quantity: number) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Please sign in to order.");
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    address: user?.address || "Address needed",
                    total: parseFloat(selectedItem?.price || '0') * quantity,
                    items: [
                        {
                            menuItemId: selectedItem?.id,
                            quantity: quantity,
                            price: parseFloat(selectedItem?.price || '0')
                        }
                    ]
                })
            });

            if (response.ok) {
                showSuccessToast(selectedItem?.title || 'Item');
                setIsModalOpen(false);
            } else {
                alert("Failed to place order.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar active="Food Menu" isLoggedIn={isLoggedIn} />

            {/* Header Section */}
            <section className="text-center pt-20 pb-12 px-4">
                <h1 className="text-5xl font-serif text-[#1B3B36] mb-4">Our Menu</h1>
                <p className="text-black text-lg max-w-2xl mx-auto font-light">
                    Discover our selection of premium dishes, crafted with passion.
                </p>
            </section>

            {/* Filter Buttons */}
            <section className="flex justify-center gap-4 mb-16 px-4 flex-wrap">
                {['All', 'Starters', 'Main Courses', 'Desserts'].map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-8 py-2 rounded-full text-sm font-semibold transition-colors border ${activeCategory === category
                            ? 'bg-[#1B3B36] text-white border-[#1B3B36]'
                            : 'text-gray-500 bg-white border-gray-200 hover:border-[#1B3B36] hover:text-[#1B3B36]'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </section>

            {/* Menu Grid */}
            <section className="max-w-[1600px] mx-auto px-4 lg:px-12 pb-40">
                {loading ? (
                    <div className="text-center py-20 text-[#1B3B36]">Loading our delicious menu...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-24 gap-y-40">
                        {menuItems.map((item, index) => (
                            <div key={index} className="w-full">
                                <FoodCard
                                    title={item.title}
                                    description={item.description}
                                    price={`$${parseFloat(item.price).toFixed(2)}`}
                                    imageUrl={getImageUrl(item.imageUrl)}
                                    onAddToOrder={() => handleOrderClick(item)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmOrder}
                itemTitle={selectedItem?.title || ''}
            />

            <Footer />
        </div>
    );
}
