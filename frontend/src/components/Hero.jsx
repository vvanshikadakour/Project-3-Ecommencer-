import React from "react";
import hero from "../assets/hero.png";
import { IoIosArrowRoundForward } from "react-icons/io";

export default function Hero() {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-12 md:py-24 gap-8">
      
      {/* Left Content */}
      <div className="flex-1 space-y-4 md:space-y-6">
        <h3 className="text-sm text-gray-500 tracking-widest">NEW ARRIVALS</h3>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          NEW COLLECTIONS
        </h1>
        <button className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300">
          Visit
          <IoIosArrowRoundForward size={24} />
        </button>
      </div>

      {/* Right Image */}
      <div className="flex-1">
        <img
          src={hero}
          alt="Hero Banner"
          className="w-full h-auto rounded-xl shadow-lg"
        />
      </div>

    </section>
  );
}
