// Navbar.jsx
import { TiShoppingCart } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.isProductAdd);

  const [userName, setUserName] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    dispatch({ type: "productAdd", payload: { isAdding: false } });

    const fetchUser = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/user/getProfile",
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();

        if (res.ok && data.user) {
          const name = `${data.user.firstName} ${data.user.lastName}`;
          setUserName(name);
          setCartCount(data.user.Cartvalue || 0);

          dispatch({
            type: "set-user",
            payload: { id: data.user._id, name, email: data.user.email },
          });
        } else {
          setUserName("");
          setCartCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUserName("");
        setCartCount(0);
      }
    };

    fetchUser();
  }, [status, dispatch]);

  const navButtonClasses = (path) =>
    `px-4 py-2 rounded-md transition-colors duration-200 ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 h-16">
        {/* LEFT */}
        <div className="text-2xl font-bold text-blue-600">Shop Here</div>

        {/* CENTER */}
        <div className="hidden md:flex space-x-4">
          <Link to="/shop">
            <button className={navButtonClasses("/shop")}>Shop</button>
          </Link>
          <Link to="/shop/men">
            <button className={navButtonClasses("/shop/men")}>Men</button>
          </Link>
          <Link to="/shop/women">
            <button className={navButtonClasses("/shop/women")}>Women</button>
          </Link>
          <Link to="/shop/kids">
            <button className={navButtonClasses("/shop/kids")}>Kids</button>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <button
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                location.pathname === "/cart"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <TiShoppingCart className="text-xl" />
              <span className="ml-1 font-semibold">{cartCount}</span>
            </button>
          </Link>

          <Link to="/profile">
            <button
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                location.pathname === "/profile"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <CgProfile className="text-xl" />
              {userName && <span className="font-medium">Hi, {userName}</span>}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
