'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FoodCard from "../components/FoodCard";
import OrderModal from "../components/OrderModal";
import { API_ENDPOINTS, getImageUrl } from "../lib/api";
import TopUI from '@/components/TopUI';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Starters');
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_ENDPOINTS.MENU.GET_ALL}?category=${activeCategory}`)
      .then(res => res.json())
      .then(data => {
        setFoodItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch menu", err);
        setLoading(false);
      });
  }, [activeCategory]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: number, title: string, price: string } | null>(null);

  const handleOrderClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async (quantity: number) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token');

      if (!token) {
        alert("Please sign in to order.");
        return;
      }

      const response = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          address: user?.address || "Default Address",
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
        alert("Order placed successfully!");
        setIsModalOpen(false);
      } else {
        alert("Failed to place order.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans relative">
      <TopUI />
      <Navbar />
      <Hero />


      {/* Categories with interactive selection */}
      <Categories
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Food Menu Grid */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-12 py-20 pb-40">
        {loading ? (
          <div className="text-center py-20 text-[#1B3B36] font-medium">Loading items...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {foodItems.map((item, index) => (
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
        {!loading && foodItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">No items found in this category.</div>
        )}
      </section>

      {/* Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
        itemTitle={selectedItem?.title || ''}
      />

      {/* Footer Simple Placeholder */}
      <footer className="border-t border-gray-100 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="font-bold text-[#1B3B36] mb-4 md:mb-0">Foodio. © 2026 Foodio Inc.</div>
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
