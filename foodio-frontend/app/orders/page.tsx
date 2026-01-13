'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import { API_ENDPOINTS } from "../../lib/api";
import Footer from "../../components/Footer";


export default function MyOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/auth');
            return;
        }
        setIsLoggedIn(true);

        const fetchOrders = () => {
            fetch(API_ENDPOINTS.ORDERS.GET_MY, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setOrders(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Orders fetch failed", err);
                    setLoading(false);
                });
        };

        // Initial fetch
        fetchOrders();

        // Dynamic polling: update every 10 seconds
        const intervalId = setInterval(fetchOrders, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'Pending': return 0;
            case 'Preparing': return 1;
            case 'Ready': return 2;
            case 'Completed': return 3;
            default: return 0;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar active="My Order" isLoggedIn={isLoggedIn} />

            {/* Header */}
            <header className="px-8 pt-10 pb-10 max-w-7xl mx-auto flex justify-between items-end">
                <h1 className="text-4xl font-serif text-[#1B3B36]">My Orders</h1>
                <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors border-b border-red-500 pb-0.5"
                >
                    SIGN OUT
                </button>
            </header>

            {/* Orders List */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 pb-32 space-y-8">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading your orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                        <p className="text-gray-400 mb-4">No orders placed yet.</p>
                        <a href="/" className="text-[#1B3B36] font-bold border-b-2 border-[#1B3B36]">Order something delicious!</a>
                    </div>
                ) : (
                    orders.map((order) => {
                        const currentStep = getStatusStep(order.status);
                        const formattedDate = new Date(order.createdAt).toLocaleString();

                        return (
                            <div key={order.id} className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm">
                                {/* Top Row: ID, Date, Total, Status Badge */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#1B3B36] mb-1">Order #{order.id}</h3>
                                        <p className="text-gray-400 text-sm">Placed on {formattedDate}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-bold text-[#1B3B36]">${parseFloat(order.total).toFixed(2)}</span>
                                        <span className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-[#FEF3C7] text-amber-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div className="mb-8">
                                    <p className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-4">ITEMS</p>
                                    <div className="space-y-3">
                                        {order.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="text-[#1B3B36] font-medium">{item.quantity}x <span className="ml-1">{item.menuItem?.title || 'Unknown Item'}</span></span>
                                                <span className="text-gray-400">${parseFloat(item.price).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-gray-100 mb-8" />

                                {/* Delivery Address */}
                                <div className="mb-12">
                                    <p className="text-gray-400 text-sm mb-1">Delivering to: <span className="text-[#1B3B36] font-medium">{order.address}</span></p>
                                </div>

                                {/* Progress Bar */}
                                {/* Enhanced Progress Bar */}
                                <div className="mt-12 relative">
                                    {/* Line Background */}
                                    <div className="absolute top-[18px] left-[5%] right-[5%] h-[4px] bg-gray-100 rounded-full" />

                                    {/* Active Line Fill */}
                                    <div
                                        className="absolute top-[18px] left-[5%] h-[4px] bg-[#1B3B36] rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(currentStep / 3) * 90}%` }}
                                    />

                                    <div className="flex justify-between relative z-10">
                                        {[
                                            { label: 'PENDING', icon: '🕒' },
                                            { label: 'PREPARING', icon: '👨‍🍳' },
                                            { label: 'READY', icon: '✅' },
                                            { label: 'COMPLETED', icon: '🎁' }
                                        ].map((step, index) => {
                                            const isCompleted = index <= currentStep;
                                            const isCurrent = index === currentStep;

                                            return (
                                                <div key={step.label} className="flex flex-col items-center group">
                                                    {/* Circle with Icon */}
                                                    <div className={`
                                                        w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-500 border-4 bg-white
                                                        ${isCompleted ? 'border-[#1B3B36] text-[#1B3B36] scale-110 shadow-lg' : 'border-gray-100 text-gray-300'}
                                                        ${isCurrent ? 'ring-4 ring-[#1B3B36]/10 animate-pulse' : ''}
                                                    `}>
                                                        {isCompleted ? step.icon : index + 1}
                                                    </div>

                                                    {/* Label */}
                                                    <span className={`
                                                        mt-4 text-[10px] font-black tracking-[0.2em] transition-colors duration-500
                                                        ${isCompleted ? 'text-[#1B3B36]' : 'text-gray-300'}
                                                    `}>
                                                        {step.label}
                                                    </span>

                                                    {/* Status Pulse for Current Step */}
                                                    {isCurrent && (
                                                        <span className="mt-1.5 flex h-1.5 w-1.5 rounded-full bg-[#1B3B36] animate-bounce" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </main>

            <Footer />
        </div>
    );
}
