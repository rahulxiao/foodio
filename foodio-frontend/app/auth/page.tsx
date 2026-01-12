'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from "../../lib/api";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Ignore shortcut if user is typing in an input field
            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            if (event.key.toLowerCase() === 'a') {
                window.location.href = '/admin';
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const url = isLogin ? API_ENDPOINTS.AUTH.LOGIN : API_ENDPOINTS.AUTH.REGISTER;
            const body = isLogin ? { email, password } : { email, password, name, address };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Role-based redirection
                    if (data.user?.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/orders';
                    }
                } else {
                    alert("Registration successful! Please sign in.");
                    setIsLogin(true);
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col justify-between">
            <header className="px-8 py-6">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-[#1B3B36] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-[#1B3B36]">Foodio.</span>
                </Link>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1B3B36] text-sm font-medium transition-colors mb-6 group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
                    </Link>
                    <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-12 border border-gray-50 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-[#1B3B36] rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-[#1B3B36]">Foodio.</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-8">Premium flavors, delivered.</p>

                        <div className="bg-[#FEF8F1] rounded-full p-1.5 flex mb-8">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all ${isLogin ? 'bg-white shadow-sm text-[#1B3B36]' : 'text-gray-500'}`}
                            > Sign In </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all ${!isLogin ? 'bg-white shadow-sm text-[#1B3B36]' : 'text-gray-500'}`}
                            > Register </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            {!isLogin && (
                                <>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#1B3B36] text-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                                        <input
                                            type="text"
                                            required
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#1B3B36] text-black"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#1B3B36] text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#1B3B36] text-black"
                                />
                            </div>

                            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

                            <button
                                disabled={loading}
                                className="w-full bg-[#1B3B36] text-white font-semibold py-4 rounded-full shadow-lg hover:bg-[#152e2a] transition-colors mt-6 disabled:opacity-50"
                            >
                                {loading ? 'Wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </button>
                        </form>
                    </div>

                    <div className="text-center mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
                        <span className="border border-gray-300 w-4 h-4 rounded flex items-center justify-center font-bold text-gray-500">i</span>
                        <span>For accessing Admin Panel press A from your keyboard.</span>
                    </div>
                </div>
            </main>

            <footer className="border-t border-gray-50 py-8 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-300 text-xs">
                    <div className="font-bold text-[#1B3B36] mb-4 md:mb-0">Foodio. <span className="text-gray-300 font-normal">© 2026 Foodio Inc.</span></div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-[#1B3B36]">Privacy</a>
                        <a href="#" className="hover:text-[#1B3B36]">Terms</a>
                        <a href="#" className="hover:text-[#1B3B36]">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
