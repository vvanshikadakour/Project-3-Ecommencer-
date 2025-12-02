import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import CartItem from "./CartItem";
import AddressList from "./AddressList";
import AddAddressForm from "./AddAddressForm";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // New address state
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:3000/cart/get",
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (data.cart) dispatch({ type: "set-cart", payload: data.cart });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/address/get",
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (data.addresses) {
          setAddresses(data.addresses);
          const defaultAddr = data.addresses.find((addr) => addr.isDefault);
          if (defaultAddr) setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
    fetchAddresses();
  }, [dispatch]);

  const proceedToCheckout = () => {
    if (!cart.products.length) return alert("Your cart is empty!");
    if (!selectedAddress) return alert("Please select a delivery address!");
    navigate("/checkout", { state: { cart, selectedAddress } });
  };

  const totalPrice = cart.totalPrice || 0;
  const totalShipping = cart.totalShipping || 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {/* Address Section */}
      <AddressList
        addresses={addresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        showAddressForm={showAddressForm}
        setShowAddressForm={setShowAddressForm}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        setAddresses={setAddresses}
      />

      {/* Cart Items */}
      <div className="mt-6">
        {loading ? (
          <p>Loading cart...</p>
        ) : cart.products.length ? (
          cart.products.map((item) => (
            <CartItem key={item.item._id} item={item} />
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {/* Cart Summary */}
      {cart.products.length > 0 && (
        <div className="mt-6 border-t pt-4 space-y-2">
          <p className="text-lg font-semibold">Total Price: ₹{totalPrice}</p>
          <p className="text-lg font-semibold">Total Shipping: ₹{totalShipping}</p>
          <h2 className="text-xl font-bold">
            Grand Total: ₹{totalPrice + totalShipping}
          </h2>
          <button
            onClick={proceedToCheckout}
            className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700"
          >
            Proceed to Checkout 🛒
          </button>
        </div>
      )}

      {/* Add Address Form */}
      {showAddressForm && (
        <AddAddressForm
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          setShowAddressForm={setShowAddressForm}
          setAddresses={setAddresses}
        />
      )}
    </div>
  );
}
