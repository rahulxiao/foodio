'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS, getImageUrl } from "../../lib/api";

export default function AdminDashboard() {
    const [activeView, setActiveView] = useState<'menu' | 'orders'>('menu');
    const [menuTab, setMenuTab] = useState<'items' | 'categories'>('items');
    const [showModal, setShowModal] = useState<'addItem' | 'addCategory' | 'editItem' | null>(null);
    const [loading, setLoading] = useState(true);

    // Backend Data
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);

    // Form State for new item
    const [newItem, setNewItem] = useState({
        title: '',
        price: '',
        category: 'Starters',
        description: '',
        isAvailable: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/auth';
            return;
        }

        fetchData();
    }, [activeView]);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            if (activeView === 'menu') {
                const res = await fetch(API_ENDPOINTS.MENU.GET_ALL);
                const data = await res.json();
                setMenuItems(Array.isArray(data) ? data : []);
            } else {
                const res = await fetch(API_ENDPOINTS.ORDERS.GET_MY, { // Admin should have GET /orders actually
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', newItem.title);
        formData.append('price', newItem.price);
        formData.append('category', newItem.category);
        formData.append('description', newItem.description);
        formData.append('isAvailable', String(newItem.isAvailable));
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await fetch(API_ENDPOINTS.MENU.CREATE, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert("Item added!");
                setShowModal(null);
                fetchData();
            } else {
                alert("Failed to add item");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteItem = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(API_ENDPOINTS.MENU.DELETE(id), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateAvailability = async (itemId: number, isAvailable: boolean) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(API_ENDPOINTS.MENU.UPDATE(itemId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isAvailable })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (orderId: number, status: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFC] flex font-sans text-[#1B3B36]">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[#EEEEEE] flex flex-col fixed h-full z-10">
                <div className="p-8 pb-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1B3B36] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold font-serif text-[#1B3B36]">Foodio.</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveView('menu')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'menu' ? 'bg-[#1B3B36] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Menu Items
                    </button>
                    <button
                        onClick={() => setActiveView('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'orders' ? 'bg-[#1B3B36] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Orders
                    </button>
                </nav>

                <div className="p-4">
                    <button onClick={() => { localStorage.clear(); window.location.href = '/auth'; }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">

                {/* Menu View */}
                {activeView === 'menu' && (
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Header with Tabs and Button */}
                        <div className="flex justify-between items-center">
                            {/* Tabs */}
                            <div className="flex bg-[#F3F4F6] p-1.5 rounded-[14px] items-center">
                                <button
                                    onClick={() => setMenuTab('items')}
                                    className={`px-6 py-2 rounded-[10px] text-sm font-semibold transition-all ${menuTab === 'items' ? 'bg-white shadow-sm text-[#1B3B36]' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Menu Items
                                </button>
                            </div>

                            {/* Add Item Button */}
                            <button
                                onClick={() => setShowModal('addItem')}
                                className="bg-[#1B3B36] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#152e2a] transition-colors flex items-center gap-2"
                            >
                                <span className="text-lg leading-none mb-0.5">+</span>
                                Add Item
                            </button>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#E5E7EB] bg-[#FCFCFD]">
                                        <th className="py-4 pl-6 text-left text-sm font-semibold text-[#1B3B36]">Image</th>
                                        <th className="py-4 text-left text-sm font-semibold text-[#1B3B36]">Name</th>
                                        <th className="py-4 text-left text-sm font-semibold text-[#1B3B36]">Category</th>
                                        <th className="py-4 text-left text-sm font-semibold text-[#1B3B36]">Price</th>
                                        <th className="py-4 text-center text-sm font-semibold text-[#1B3B36]">Status</th>
                                        <th className="py-4 pr-6 text-right text-sm font-semibold text-[#1B3B36]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]">
                                    {loading ? (
                                        <tr><td colSpan={6} className="py-20 text-center text-gray-400">Loading menu...</td></tr>
                                    ) : menuItems.length === 0 ? (
                                        <tr><td colSpan={6} className="py-20 text-center text-gray-400">No items found.</td></tr>
                                    ) : (
                                        menuItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5 pl-6">
                                                    <img src={getImageUrl(item.imageUrl)} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                </td>
                                                <td className="py-5 text-sm font-medium text-[#1B3B36]">{item.title}</td>
                                                <td className="py-5 text-sm text-[#1B3B36]">{item.category}</td>
                                                <td className="py-5 text-sm text-[#1B3B36]">${parseFloat(item.price).toFixed(2)}</td>
                                                <td className="py-5 text-center">
                                                    <select
                                                        value={item.isAvailable ? 'true' : 'false'}
                                                        onChange={(e) => handleUpdateAvailability(item.id, e.target.value === 'true')}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium appearance-none cursor-pointer outline-none ${item.isAvailable ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-red-100 text-red-600'}`}
                                                    >
                                                        <option value="true">Available</option>
                                                        <option value="false">Sold Out</option>
                                                    </select>
                                                </td>
                                                <td className="py-5 pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button onClick={() => handleDeleteItem(item.id)} className="text-[#EF4444] hover:text-red-700 transition-colors">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders View */}
                {activeView === 'orders' && (
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-serif text-[#1B3B36]">Order Management</h1>
                        </div>

                        <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#E5E7EB] bg-[#FCFCFD]">
                                            <th className="py-4 pl-6 text-left text-sm font-semibold text-[#1B3B36]">Order ID</th>
                                            <th className="py-4 text-left text-sm font-semibold text-[#1B3B36]">Date</th>
                                            <th className="py-4 text-left text-sm font-semibold text-[#1B3B36]">Customer</th>
                                            <th className="py-4 text-left text-sm font-semibold text-[#1B3B36]">Total</th>
                                            <th className="py-4 text-center text-sm font-semibold text-[#1B3B36]">Status</th>
                                            <th className="py-4 pr-6 text-right text-sm font-semibold text-[#1B3B36]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E7EB]">
                                        {loading ? (
                                            <tr><td colSpan={6} className="py-20 text-center text-gray-400">Loading orders...</td></tr>
                                        ) : orders.length === 0 ? (
                                            <tr><td colSpan={6} className="py-20 text-center text-gray-400">No orders found.</td></tr>
                                        ) : (
                                            orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-5 pl-6 text-sm font-medium text-[#1B3B36]">#{order.id}</td>
                                                    <td className="py-5 text-sm text-[#1B3B36]">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-5 text-sm text-[#1B3B36]">{order.user?.name || 'Guest'}</td>
                                                    <td className="py-5 text-sm text-[#1B3B36]">${parseFloat(order.total).toFixed(2)}</td>
                                                    <td className="py-5 text-center">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium appearance-none cursor-pointer outline-none ${order.status === 'Completed' ? 'bg-[#DCFCE7] text-[#166534]' :
                                                                order.status === 'Preparing' ? 'bg-[#DBEAFE] text-[#1E40AF]' :
                                                                    order.status === 'Ready' ? 'bg-[#F3E8FF] text-[#6B21A8]' :
                                                                        'bg-[#FEF3C7] text-[#92400E]'
                                                                }`}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Preparing">Preparing</option>
                                                            <option value="Ready">Ready</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-5 pr-6 text-right text-xs text-gray-400">
                                                        {order.address === 'Address needed' ? (order.user?.address || 'No address') : order.address}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Item Modal */}
            {showModal === 'addItem' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <form onSubmit={handleAddItem} className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-50">
                            <h3 className="text-lg font-bold text-[#1B3B36]">Add New Item</h3>
                            <button type="button" onClick={() => setShowModal(null)} className="text-gray-400 hover:text-gray-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 ml-1">Name</label>
                                    <input required type="text" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#1B3B36]" />
                                </div>
                                <div className="w-1/3 space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 ml-1">Price</label>
                                    <input required type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#1B3B36]" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 ml-1">Category</label>
                                <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#1B3B36] text-gray-600">
                                    <option>Starters</option>
                                    <option>Main Courses</option>
                                    <option>Desserts</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 ml-1">Description</label>
                                <textarea required rows={3} value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#1B3B36] resize-none"></textarea>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 ml-1">Image</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#1B3B36] transition-colors mb-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                        <p className="text-xs text-gray-500">{imageFile ? imageFile.name : 'Drag or click to upload'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 pt-2 flex justify-end">
                            <button type="submit" className="bg-[#1B3B36] text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[#152e2a] transition-colors">
                                Add Item
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
