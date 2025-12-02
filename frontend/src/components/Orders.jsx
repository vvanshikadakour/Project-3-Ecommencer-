import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch("https://project-3-ecommencer-1.onrender.com/order/getOrder", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (res.status === 500) {
          alert(data.message || "Failed to fetch orders");
          return;
        }

        setOrders(data.orders || []);
        console.log("Orders---------", data.orders);
      } catch (err) {
        console.error(err);
        alert("Something went wrong while fetching orders!");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 Your Orders</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
              <p>
                <strong>Payment Mode:</strong> {order.paymentMode.toUpperCase()}
              </p>
              <div className="mt-2">
                <strong>Products:</strong>
                <ul className="list-disc list-inside mt-1">
                  {order.products.map((p, i) => (
                    <li key={i}>
                      {p.quantity} × {p.productId.productName} - ₹{p.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
