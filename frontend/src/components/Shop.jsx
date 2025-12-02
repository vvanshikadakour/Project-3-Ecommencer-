import React from "react";
import Hero from "./Hero.jsx";

export default function Shop() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Future sections: Featured Products, Categories, etc. */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Featured Products
        </h2>
        {/* Product Grid Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Map products here */}
          <p className="text-gray-500 col-span-full text-center">
            Products will appear here...
          </p>
        </div>
      </section>
    </div>
  );
}
