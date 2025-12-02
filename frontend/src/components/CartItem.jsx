import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const [updatingId, setUpdatingId] = useState(null);

  const updateQuantity = async (productId, action) => {
    if (updatingId) return;
    setUpdatingId(productId);

    try {
      const res = await fetch(
        "http://localhost:3000/cart/update",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, action }),
        }
      );
      const data = await res.json();
      if (data.cart) dispatch({ type: "set-cart", payload: data.cart });
      else if (data.error) alert(data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="border p-4 rounded-md mb-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-semibold text-lg">{item.item.productName}</h3>
        <p>Price: ₹{item.price}</p>
        <p>Subtotal: ₹{item.price * (item.qty || 1)}</p>
      </div>

      <div className="flex items-center gap-4 mt-2 md:mt-0">
        <button
          onClick={() => updateQuantity(item.item._id, "inc")}
          disabled={updatingId === item.item._id || item.item.productCount <= 0}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          +
        </button>
        <span className="font-semibold">Qty: {item.qty}</span>
        <button
          onClick={() => updateQuantity(item.item._id, "dec")}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          -
        </button>
        <span>Available: {item.item.productCount}</span>
      </div>
    </div>
  );
}
