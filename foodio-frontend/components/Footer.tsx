import React from 'react';

const Footer = () => {
    return (
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
    );
};

export default Footer;
