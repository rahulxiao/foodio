import Link from 'next/link';
import React from 'react';

interface NavbarProps {
    active?: 'Home' | 'Food Menu' | 'My Order';
    isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ active = 'Home', isLoggedIn = false }) => {
    return (
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full font-sans relative z-50">
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

            <div className="hidden md:flex items-center gap-2 text-gray-500 font-medium">
                <Link href="/" className={`${active === 'Home' ? 'text-[#1B3B36] border border-gray-200 bg-gray-50' : 'hover:text-[#1B3B36]'} px-6 py-2 rounded-full text-sm font-semibold transition-colors`}>Home</Link>
                <Link href="/menu" className={`${active === 'Food Menu' ? 'text-[#1B3B36] border border-gray-200 bg-gray-50' : 'hover:text-[#1B3B36]'} px-6 py-2 rounded-full text-sm font-semibold transition-colors`}>Food Menu</Link>
                <Link href="/orders" className={`${active === 'My Order' ? 'text-[#1B3B36] border border-gray-200 bg-gray-50' : 'hover:text-[#1B3B36]'} px-6 py-2 rounded-full text-sm font-semibold transition-colors`}>My Order</Link>
            </div>

            {isLoggedIn ? (
                <button className="w-10 h-10 bg-[#1B3B36] rounded-full flex items-center justify-center text-white hover:bg-[#152e2a] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button>
            ) : (
                <Link href="/auth" className="bg-[#1B3B36] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#152e2a] transition-colors flex items-center gap-2">
                    Sign In <span className="text-xs">→</span>
                </Link>
            )}
        </nav>
    );
};

export default Navbar;
