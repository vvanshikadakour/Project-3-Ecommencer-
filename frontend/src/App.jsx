import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";

// Pages
import Shop from "./components/Shop";
import ShopCategory from "./components/ShopCtaegory";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import AdminPanel from "./components/AdminPanel";

// Context
import ContextProvider from "./Context/ContextProvider";

export default function App() {
  return (
    <ContextProvider>
      <Navbar />
      <Routes>
  <Route path="/" element={<Shop />} />
  <Route path="/shop" element={<Shop />} />
  <Route path="/shop/:category" element={<ShopCategory />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<Orders />} />

  {/* 🔥 Admin route fix */}
  <Route path="/adminpanel" element={<AdminPanel />} />
</Routes>

    </ContextProvider>
  );
}
