import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Productcontext from "../Context/context";
import { useDispatch, useSelector } from "react-redux";

export default function ShopCategory() {
  const dispatch = useDispatch();
  const { category } = useParams();
  const { values } = useContext(Productcontext);

  const reduxUser = useSelector((state) => state.user);
  const [user, setUser] = useState(reduxUser);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/user/getProfile",
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (res.ok && data.user) {
          const userData = {
            id: data.user._id,
            name: data.user.firstName + " " + data.user.lastName,
            userName: data.user.userName,
          };
          setUser(userData);
          dispatch({ type: "set-user", payload: userData });
        } else setUser(null);
      } catch (err) {
        console.error("Failed to check login:", err);
        setUser(null);
      }
    };
    checkLogin();
  }, [dispatch]);

  const filteredProducts = values.filter(
    (product) => product.productCategory.toLowerCase() === category.toLowerCase()
  );

  const addToCart = async (product) => {
    if (!user?.id) return alert("Please login to add items to the cart!");
    if (product.productCount <= 0) return alert("This product is out of stock!");

    const shippingCost = product.productPrice >= 1000 ? 0 : 50;

    try {
      const res = await fetch("http://localhost:3000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          productId: product._id,
          price: product.productPrice,
          shipping: shippingCost,
        }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.error || "Failed to add to cart!");

      dispatch({
        type: "product-add",
        payload: { item: product, price: product.productPrice, shipping: shippingCost, userId: user.id },
      });
      dispatch({ type: "productAdd", payload: { isAdding: true } });

      alert("✅ Item added to cart successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while adding to cart!");
    }
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Shop for: <span className="text-green-600">{category}</span>
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg shadow-sm p-4 hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{p.productName}</h3>
                <p className="text-gray-700 mb-1">Price: ₹{p.productPrice}</p>
                <p className="text-gray-600 mb-2">{p.description}</p>

                {Array.isArray(p.productImage) &&
                  p.productImage.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={p.productName}
                      className="w-full h-40 object-cover mb-2 rounded"
                    />
                  ))}
              </div>

              <button
                onClick={() => addToCart(p)}
                className="mt-2 w-full py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No products found in this category.</p>
      )}
    </div>
  );
}
