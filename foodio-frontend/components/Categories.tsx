import React from 'react';

interface CategoriesProps {
    activeCategory?: string;
    onSelectCategory?: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ activeCategory = 'Starters', onSelectCategory }) => {

    // Helper to handle click - if onSelectCategory is provided, prevent default nav
    const handleCategoryClick = (category: string) => {
        if (onSelectCategory) {
            onSelectCategory(category);
        }
    };

    return (
        <section className="py-20 text-center max-w-7xl mx-auto px-8 relative z-10">
            <h2 className="text-5xl font-serif text-[#1B3B36] mb-4">Curated Categories</h2>
            <p className="text-gray-500 mb-16 text-lg font-light">Explore our diverse menu of culinary delights.</p>

            <div className="flex flex-wrap justify-center gap-12">
                {/* Starters */}
                <div
                    onClick={() => handleCategoryClick('Starters')}
                    className={`flex flex-col items-center justify-center p-12 py-10 rounded-[30px] w-64 shadow-sm cursor-pointer transition-transform hover:-translate-y-1 ${activeCategory === 'Starters' ? 'bg-[#FEF8F1]' : 'bg-white/50 hover:bg-white border border-transparent hover:border-gray-100'}`}
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 ${activeCategory === 'Starters' ? 'bg-[#1B3B36] text-white shadow-md' : 'bg-[#1B3B36] text-white'}`}>
                        N
                    </div>
                    <span className="font-semibold text-[#1B3B36] text-lg">Starters</span>
                </div>

                {/* Main Courses */}
                <div
                    onClick={() => handleCategoryClick('Main Courses')}
                    className={`flex flex-col items-center justify-center p-12 py-10 rounded-[30px] w-64 shadow-sm cursor-pointer transition-transform hover:-translate-y-1 ${activeCategory === 'Main Courses' ? 'bg-[#FEF8F1]' : 'bg-white/50 hover:bg-white border border-transparent hover:border-gray-100'}`}
                >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#1B3B36] text-white text-2xl font-bold mb-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 13.87A8 8 0 0118 10h1a4 4 0 014 4v6h-2v-2H3v2H1v-6a4 4 0 014-4h1zM6 10V4h3v6m5 0V4h3v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="font-semibold text-[#1B3B36] text-lg">Main Courses</span>
                </div>

                {/* Desserts */}
                <div
                    onClick={() => handleCategoryClick('Desserts')}
                    className={`flex flex-col items-center justify-center p-12 py-10 rounded-[30px] w-64 shadow-sm cursor-pointer transition-transform hover:-translate-y-1 ${activeCategory === 'Desserts' ? 'bg-[#FEF8F1]' : 'bg-white/50 hover:bg-white border border-transparent hover:border-gray-100'}`}
                >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#1B3B36] text-white text-2xl font-bold mb-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21a9 9 0 009-9c0-4.97-9-13-9-13S3 7.03 3 12a9 9 0 009 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="font-semibold text-[#1B3B36] text-lg">Desserts</span>
                </div>
            </div>
        </section>
    );
};

export default Categories;
