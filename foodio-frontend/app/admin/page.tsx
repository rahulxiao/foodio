'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS, getImageUrl } from "../../lib/api";
import Footer from "../../components/Footer";


export default function AdminDashboard() {
    const [activeView, setActiveView] = useState<'menu' | 'orders'>('menu');
    const [menuTab, setMenuTab] = useState<'items' | 'categories'>('items');
    const [showModal, setShowModal] = useState<'addItem' | 'addCategory' | 'editItem' | 'orderDetails' | null>(null);
    const [loading, setLoading] = useState(true);

    // Backend Data
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);

    const [categories, setCategories] = useState<string[]>(['Starters', 'Main Courses', 'Desserts']);
    const [newItem, setNewItem] = useState({
        title: '',
        price: '',
        category: 'Starters',
        description: '',
        isAvailable: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ index: number, name: string } | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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
                const res = await fetch(API_ENDPOINTS.ORDERS.GET_MY, {
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

    const handleOpenAddModal = () => {
        if (menuTab === 'items') {
            setNewItem({
                title: '',
                price: '',
                category: categories[0] || 'Starters',
                description: '',
                isAvailable: true
            });
            setImageFile(null);
            setEditingItem(null);
            setShowModal('addItem');
        } else {
            setNewCategory('');
            setEditingCategory(null);
            setShowModal('addCategory');
        }
    };

    const handleEditItemClick = (item: any) => {
        setEditingItem(item);
        setNewItem({
            title: item.title,
            price: item.price,
            category: item.category,
            description: item.description,
            isAvailable: item.isAvailable
        });
        setImageFile(null);
        setShowModal('editItem');
    };

    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', newItem.title);
        formData.append('price', String(newItem.price));
        formData.append('category', newItem.category);
        formData.append('description', newItem.description);
        formData.append('isAvailable', String(newItem.isAvailable));
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await fetch(API_ENDPOINTS.MENU.UPDATE(editingItem.id), {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert("Item updated!");
                setShowModal(null);
                setEditingItem(null);
                fetchData();
            } else {
                alert("Failed to update item");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim()) {
            if (editingCategory !== null) {
                const updated = [...categories];
                updated[editingCategory.index] = newCategory.trim();
                setCategories(updated);
                setEditingCategory(null);
            } else {
                setCategories([...categories, newCategory.trim()]);
            }
            setNewCategory('');
            setShowModal(null);
        }
    };

    const handleDeleteCategory = (index: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setCategories(categories.filter((_, i) => i !== index));
        }
    };

    const handleEditCategory = (index: number) => {
        setNewCategory(categories[index]);
        setEditingCategory({ index, name: categories[index] });
        setShowModal('addCategory');
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

    const handleUpdateStatus = async (orderId: string, status: string) => {
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

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setShowModal('orderDetails');
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
            <main className="flex-1 ml-64 bg-[#FDFDFC]">
                <div className="flex flex-col min-h-screen">
                    <div className="flex-1 p-12">
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
                                        <button
                                            onClick={() => setMenuTab('categories')}
                                            className={`px-6 py-2 rounded-[10px] text-sm font-semibold transition-all ${menuTab === 'categories' ? 'bg-white shadow-sm text-[#1B3B36]' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Categories
                                        </button>
                                    </div>

                                    {/* Add Button */}
                                    <button
                                        onClick={handleOpenAddModal}
                                        className="bg-[#1B3B36] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#152e2a] transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-lg leading-none mb-0.5">+</span>
                                        {menuTab === 'items' ? 'Add Item' : 'Add Category'}
                                    </button>
                                </div>

                                {/* Items View */}
                                {menuTab === 'items' && (
                                    <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-[#E5E7EB] bg-[#FCFCFD]">
                                                    <th className="py-5 pl-10 text-left text-[13px] font-semibold text-gray-500">Image</th>
                                                    <th className="py-5 px-6 text-left text-[13px] font-semibold text-gray-500">Name</th>
                                                    <th className="py-5 px-6 text-left text-[13px] font-semibold text-gray-500">Category</th>
                                                    <th className="py-5 px-6 text-left text-[13px] font-semibold text-gray-500">Price</th>
                                                    <th className="py-5 px-6 text-left text-[13px] font-semibold text-gray-500">Status</th>
                                                    <th className="py-5 pr-10 text-right text-[13px] font-semibold text-gray-500">Actions</th>
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
                                                            <td className="py-6 pl-10">
                                                                <img src={getImageUrl(item.imageUrl)} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                                                            </td>
                                                            <td className="py-6 px-6 text-sm font-semibold text-[#1B3B36]">{item.title}</td>
                                                            <td className="py-6 px-6 text-sm text-gray-500">{item.category}</td>
                                                            <td className="py-6 px-6 text-sm font-bold text-[#1B3B36]">${parseFloat(item.price).toFixed(2)}</td>
                                                            <td className="py-6 px-6">
                                                                <div className="relative inline-block w-32">
                                                                    <select
                                                                        value={item.isAvailable ? 'true' : 'false'}
                                                                        onChange={(e) => handleUpdateAvailability(item.id, e.target.value === 'true')}
                                                                        className={`w-full px-4 py-1.5 rounded-lg text-xs font-semibold appearance-none cursor-pointer outline-none border border-gray-100 transition-colors ${item.isAvailable ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-red-100 text-red-600'}`}
                                                                    >
                                                                        <option value="true">Available</option>
                                                                        <option value="false">Sold Out</option>
                                                                    </select>
                                                                    <div className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${item.isAvailable ? 'text-[#166534]' : 'text-red-600'}`}>
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-5 pr-8 text-right">
                                                                <div className="flex items-center justify-end gap-3">
                                                                    <button
                                                                        onClick={() => handleEditItemClick(item)}
                                                                        className="text-gray-400 hover:text-[#1B3B36] transition-colors p-2"
                                                                    >
                                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                        </svg>
                                                                    </button>
                                                                    <button onClick={() => handleDeleteItem(item.id)} className="text-[#EF4444]/60 hover:text-[#EF4444] transition-colors">
                                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
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
                                )}

                                {/* Categories View */}
                                {menuTab === 'categories' && (
                                    <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-[#E5E7EB] bg-[#FCFCFD]">
                                                    <th className="py-4 pl-8 text-left text-[13px] font-semibold text-gray-500">Name</th>
                                                    <th className="py-4 pr-8 text-right text-[13px] font-semibold text-gray-500">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#E5E7EB]">
                                                {categories.map((cat, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-5 pl-8 text-sm font-medium text-[#1B3B36]">{cat}</td>
                                                        <td className="py-5 pr-8 text-right">
                                                            <div className="flex items-center justify-end gap-4">
                                                                <button
                                                                    onClick={() => handleEditCategory(idx)}
                                                                    className="text-gray-400 hover:text-[#1B3B36] transition-colors"
                                                                >
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCategory(idx)}
                                                                    className="text-[#EF4444]/60 hover:text-[#EF4444] transition-colors"
                                                                >
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
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
                                                    <th className="py-5 pl-10 text-left text-[13px] font-semibold text-gray-500">Order ID</th>
                                                    <th className="py-5 px-8 text-left text-[13px] font-semibold text-gray-500">Date</th>
                                                    <th className="py-5 px-8 text-left text-[13px] font-semibold text-gray-500">Customer</th>
                                                    <th className="py-5 px-8 text-left text-[13px] font-semibold text-gray-500">Total</th>
                                                    <th className="py-5 px-8 text-left text-[13px] font-semibold text-gray-500">Status</th>
                                                    <th className="py-5 pr-10 text-right text-[13px] font-semibold text-gray-500">Actions</th>
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
                                                            <td className="py-6 pl-10 text-sm font-bold text-[#1B3B36]">
                                                                {order.id.length > 10 ? `${order.id.substring(0, 8)}...` : order.id}
                                                            </td>
                                                            <td className="py-6 px-8 text-sm text-gray-500">
                                                                {new Intl.DateTimeFormat('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric',
                                                                    hour12: true
                                                                }).format(new Date(order.createdAt))}
                                                            </td>
                                                            <td className="py-6 px-8 text-sm font-semibold text-[#1B3B36]">{order.user?.name || 'Guest'}</td>
                                                            <td className="py-6 px-8 text-sm font-bold text-[#1B3B36]">${parseFloat(order.total).toFixed(2)}</td>
                                                            <td className="py-6 px-8">
                                                                <div className="relative inline-block w-40">
                                                                    <select
                                                                        value={order.status}
                                                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                                        className={`w-full px-4 py-2 rounded-xl text-[13px] font-semibold appearance-none cursor-pointer outline-none border transition-all ${order.status === 'Completed' ? 'bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]' :
                                                                            order.status === 'Preparing' ? 'bg-[#EFF6FF] text-[#1E40AF] border-[#DBEAFE]' :
                                                                                order.status === 'Ready' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]' :
                                                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                                            }`}
                                                                    >
                                                                        <option value="Pending">Pending</option>
                                                                        <option value="Preparing">Preparing</option>
                                                                        <option value="Ready">Ready</option>
                                                                        <option value="Completed">Completed</option>
                                                                    </select>
                                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-6 pr-10 text-right">
                                                                <button
                                                                    onClick={() => handleViewDetails(order)}
                                                                    className="px-5 py-2 bg-white text-[#1B3B36] rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all border border-[#EEEEEE] shadow-sm active:scale-95"
                                                                >
                                                                    Details
                                                                </button>
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
                    </div>
                    <div className="px-12 py-8 mt-auto">
                        <Footer />
                    </div>
                </div>
            </main>

            {/* Add Item Modal */}
            {
                showModal === 'addItem' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <form onSubmit={handleAddItem} className="bg-white rounded-[24px] shadow-2xl w-full max-w-[600px] overflow-hidden p-10 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-[26px] font-bold text-[#1B3B36]">Add New Item</h3>
                                <button type="button" onClick={() => setShowModal(null)} className="text-gray-300 hover:text-gray-500 transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-6">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-semibold text-[#1B3B36] ml-1">Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Pan-Seared Scallops"
                                            value={newItem.title}
                                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-xl bg-white border border-[#E6E2DA] text-[16px] focus:outline-none focus:border-[#1B3B36] transition-colors"
                                        />
                                    </div>
                                    <div className="w-1/3 space-y-2">
                                        <label className="text-sm font-semibold text-[#1B3B36] ml-1">Price</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                placeholder="24"
                                                value={newItem.price}
                                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                                className="w-full pl-10 pr-5 py-3.5 rounded-xl bg-white border border-[#E6E2DA] text-[16px] focus:outline-none focus:border-[#1B3B36] transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#1B3B36] ml-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={newItem.category}
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-xl bg-white border border-[#E6E2DA] text-[16px] focus:outline-none focus:border-[#1B3B36] appearance-none cursor-pointer transition-colors"
                                        >
                                            {categories.map((cat, idx) => (
                                                <option key={idx} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#1B3B36] ml-1">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Enter item description..."
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-xl bg-white border border-[#E6E2DA] text-[16px] focus:outline-none focus:border-[#1B3B36] resize-none transition-colors"
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#1B3B36] ml-1">Image</label>
                                    <div className="space-y-3">
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="border-2 border-dashed border-[#E6E2DA] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group-hover:border-[#1B3B36]">
                                                <div className="w-12 h-12 mb-3 text-gray-400 group-hover:text-[#1B3B36] transition-colors">
                                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                                    </svg>
                                                </div>
                                                <p className="text-[15px] text-gray-600">
                                                    Drag or click <span className="font-bold text-[#1B3B36] underline cursor-pointer">here</span> to upload
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">Size must be maximum 2mb. Supported formats : PNG & JPEG</p>
                                            </div>
                                        </div>

                                        {imageFile && (
                                            <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-white border border-[#E6E2DA] animate-in fade-in slide-in-from-top-1 duration-200">
                                                <span className="text-[14px] text-gray-600 truncate mr-4">
                                                    1. {imageFile?.name}
                                                </span>
                                                <button type="button" onClick={() => setImageFile(null)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewItem({ ...newItem, isAvailable: !newItem.isAvailable })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${newItem.isAvailable ? 'bg-[#1B3B36]' : 'bg-gray-200'}`}
                                    >
                                        <span
                                            className={`${newItem.isAvailable ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                        />
                                    </button>
                                    <span className="text-[17px] font-medium text-[#1B3B36]">Available for Order</span>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="bg-[#1B3B36] text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-[#152e2a] transition-all shadow-lg active:scale-95">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )
            }
            {/* Add Category Modal */}
            {
                showModal === 'addCategory' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <form onSubmit={handleAddCategory} className="bg-white rounded-[24px] shadow-2xl w-full max-w-[600px] overflow-hidden p-10 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[28px] font-bold text-[#1B3B36]">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                                <button type="button" onClick={() => { setShowModal(null); setEditingCategory(null); setNewCategory(''); }} className="text-gray-300 hover:text-gray-500 transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[17px] font-medium text-[#1B3B36] ml-1">Name</label>
                                    <input
                                        required
                                        type="text"
                                        autoFocus
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="w-full px-5 py-4 rounded-[12px] bg-white border border-[#E6E2DA] text-lg focus:outline-none focus:border-[#1B3B36] transition-colors"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="bg-[#1B3B36] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[#152e2a] transition-all shadow-lg active:scale-95">
                                        {editingCategory ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )
            }
            {/* Edit Item Modal */}
            {
                showModal === 'editItem' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <form onSubmit={handleUpdateItem} className="bg-white rounded-[24px] shadow-2xl w-full max-w-[700px] overflow-hidden p-10 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-[26px] font-bold text-[#1B3B36]">Edit Item</h3>
                                <button type="button" onClick={() => { setShowModal(null); setEditingItem(null); }} className="text-gray-300 hover:text-gray-500 transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-6">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-semibold text-[#1B3B36] ml-1">Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newItem.title}
                                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-xl bg-white border border-[#E6E2DA] text-[16px] focus:outline-none focus:border-[#1B3B36] transition-colors"
                                        />
                                    </div>
                                    <div className="w-1/3 space-y-2">
                                        <label className="text-sm font-semibold text-[#1B3B36] ml-1">Price</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                value={newItem.price}
                                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                                className="w-full pl-10 pr-5 py-3.5 rounded-xl bg-white border border-[#E6E2DA] text-[16px] focus:outline-none focus:border-[#1B3B36] transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#1B3B36] ml-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={newItem.category}
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-xl bg-white border border-[#E6E2DA] text-[16px] focus:outline-none focus:border-[#1B3B36] appearance-none cursor-pointer transition-colors"
                                        >
                                            {categories.map((cat, idx) => (
                                                <option key={idx} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#1B3B36] ml-1">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-xl bg-white border border-[#E6E2DA] text-[16px] focus:outline-none focus:border-[#1B3B36] resize-none transition-colors"
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#1B3B36] ml-1">Image</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-white border border-[#E6E2DA] group-hover:border-[#1B3B36] transition-colors">
                                            <span className="text-[16px] text-gray-600 truncate mr-4">
                                                {imageFile ? imageFile.name : (editingItem?.imageUrl ? editingItem.imageUrl.split('/').pop() : 'Choose a file...')}
                                            </span>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null); }} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewItem({ ...newItem, isAvailable: !newItem.isAvailable })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${newItem.isAvailable ? 'bg-[#1B3B36]' : 'bg-gray-200'}`}
                                    >
                                        <span
                                            className={`${newItem.isAvailable ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                        />
                                    </button>
                                    <span className="text-[17px] font-medium text-[#1B3B36]">Available for Order</span>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="bg-[#1B3B36] text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-[#152e2a] transition-all shadow-lg active:scale-95">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )
            }
            {/* Order Details Modal */}
            {
                showModal === 'orderDetails' && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[800px] overflow-hidden animate-in fade-in zoom-in duration-200">
                            {/* Header */}
                            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-[#FDFDFC]">
                                <div>
                                    <h3 className="text-[24px] font-bold text-[#1B3B36]">Order Details</h3>
                                    <p className="text-sm text-gray-500 mt-1">Order ID: #{selectedOrder.id}</p>
                                </div>
                                <button type="button" onClick={() => setShowModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-10 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-10 mb-10">
                                    {/* Customer Info */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Customer Information</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#1B3B36] rounded-full flex items-center justify-center text-white font-bold">
                                                {selectedOrder.user?.name?.charAt(0) || 'G'}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-[#1B3B36]">{selectedOrder.user?.name || 'Guest'}</p>
                                                <p className="text-sm text-gray-500">{selectedOrder.user?.email || 'No email provided'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivery Address</h4>
                                        <p className="text-sm leading-relaxed text-[#1B3B36]">
                                            {selectedOrder.address || '123 Main St, Springfield, IL 62704'}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Items</h4>
                                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Item</th>
                                                    <th className="py-4 px-6 text-center font-semibold text-gray-600">Qty</th>
                                                    <th className="py-4 px-6 text-right font-semibold text-gray-600">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {selectedOrder.items?.map((item: any, idx: number) => (
                                                    <tr key={idx}>
                                                        <td className="py-4 px-6">
                                                            <p className="font-semibold text-[#1B3B36]">{item.title || item.menuItem?.title}</p>
                                                        </td>
                                                        <td className="py-4 px-6 text-center text-gray-600">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="py-4 px-6 text-right font-medium text-[#1B3B36]">
                                                            ${(parseFloat(item.price || item.menuItem?.price) * item.quantity).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                )) || (
                                                        <tr>
                                                            <td colSpan={3} className="py-10 text-center text-gray-400 italic">No item details available</td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="mt-8 flex justify-end">
                                    <div className="w-full max-w-[300px] space-y-3">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Subtotal</span>
                                            <span>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Delivery Fee</span>
                                            <span>$0.00</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-[#1B3B36] pt-3 border-t border-gray-100">
                                            <span>Total</span>
                                            <span>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-10 py-8 border-t border-gray-100 flex justify-between items-center bg-[#FDFDFC]">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-500">Update Status:</span>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => {
                                            handleUpdateStatus(selectedOrder.id, e.target.value);
                                            setSelectedOrder({ ...selectedOrder, status: e.target.value });
                                        }}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-[#1B3B36] outline-none hover:border-[#1B3B36] transition-colors"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Ready">Ready</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => setShowModal(null)}
                                    className="px-8 py-3 bg-[#1B3B36] text-white rounded-full text-sm font-bold hover:bg-[#152e2a] transition-all shadow-lg active:scale-95"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
