import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, selectedAddress } = location.state || {};

  const [paymentMode, setPaymentMode] = useState("");
  const [loading, setLoading] = useState(false);

  const customerNumber = Math.floor(Math.random() * 1000000000);

  if (!cart || !selectedAddress) {
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">
        ⚠️ Error: Missing cart or address data.
      </p>
    );
  }

  const handlePlaceOrder = async () => {
    if (!paymentMode) return alert("Please select a payment mode.");

    setLoading(true);

    try {
      const products = cart.products.map((p) => ({
        productId: p.item._id,
        quantity: p.qty,
        price: p.price,
      }));

      const res = await fetch(
        "https://project-3-ecommencer-1.onrender.com/order/addOrder",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products,
            totalAmount: cart.totalPrice + cart.totalShipping,
            deliveryAddress: selectedAddress,
            paymentMode,
            customerNumber: customerNumber.toString(),
          }),
        }
      );

      const data = await res.json();

      dispatch({ type: "productAdd", payload: { isAdding: true } });

      if (res.ok) {
        alert(`✅ Order placed! Customer Number: ${customerNumber}`);
        dispatch({
          type: "set-cart",
          payload: { products: [], totalPrice: 0, totalShipping: 0 },
        });
        navigate("/orders");
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while placing order!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">🛒 Checkout</h2>

      {/* Delivery Address */}
      <section className="p-4 border rounded-lg bg-gray-50 space-y-2">
        <h3 className="text-xl font-semibold mb-2">Delivery Address</h3>
        <p className="font-medium">{selectedAddress.fullName}</p>
        <p>{selectedAddress.phone}</p>
        <p>
          {selectedAddress.addressLine1}
          {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}
        </p>
        <p>
          {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}
        </p>
      </section>

      {/* Order Summary */}
      <section className="p-4 border rounded-lg bg-gray-50 space-y-3">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        {cart.products.map((p, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{p.item.productName} (x{p.qty})</span>
            <span>₹{p.price}</span>
          </div>
        ))}
        <div className="pt-2 space-y-1">
          <p className="flex justify-between font-medium">
            <span>Total:</span> <span>₹{cart.totalPrice}</span>
          </p>
          <p className="flex justify-between font-medium">
            <span>Shipping:</span> <span>₹{cart.totalShipping}</span>
          </p>
          <p className="flex justify-between text-lg font-bold">
            <span>Grand Total:</span> <span>₹{cart.totalPrice + cart.totalShipping}</span>
          </p>
        </div>
      </section>

      {/* Payment Mode */}
      <section className="p-4 border rounded-lg bg-gray-50 space-y-2">
        <h3 className="text-xl font-semibold mb-2">Payment Mode</h3>
        <label className="flex items-center gap-3">
          <input
            type="radio"
            value="cod"
            checked={paymentMode === "cod"}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="accent-green-500"
          />
          Cash on Delivery (COD)
        </label>
        <label className="flex items-center gap-3">
          <input
            type="radio"
            value="online"
            checked={paymentMode === "online"}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="accent-blue-500"
            disabled
          />
          Online Payment (Coming Soon)
        </label>
      </section>

      {/* Terms & Customer Number */}
      <section className="p-4 border rounded-lg bg-gray-50 space-y-2">
        <h3 className="text-xl font-semibold mb-2">Terms & Conditions</h3>
        <p>Beyond 7 days you can't exchange and no return possible.</p>
        <p>
          Your Customer Number: <strong>{customerNumber}</strong>
        </p>
      </section>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-colors ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
