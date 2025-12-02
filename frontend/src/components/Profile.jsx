// Profile.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";
import ProfileView from "./ProfileView.jsx";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    picture: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [editMode, setEditMode] = useState(false);

  // =========================
  // FETCH PROFILE ON LOAD
  // =========================
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("https://e-commerce-1-km7j.onrender.com/user/Profile", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          setIsLoggedIn(false);
          return;
        }
        const data = await res.json();
        if (data.user) {
          setIsLoggedIn(true);
          setLoggedInUser(data.user);

          // Agar already logged in user admin hai → redirect
          if (data.user.isAdmin) {
            navigate("/adminpanel");
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    fetchProfile();
  }, [dispatch, navigate]);

  // =========================
  // LOGIN FUNCTION
  // =========================
  const handleLogin = async () => {
    try {
      const res = await fetch("https://e-commerce-1-km7j.onrender.com/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userName: form.userName, password: form.password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsLoggedIn(true);
        setLoggedInUser(data.user);
        setForm({ ...form, password: "" });
        alert("Login successful!");

        if (data.isAdmin) {
          navigate("/adminpanel"); // Admin login → admin panel
        } else {
          navigate("/profile"); // Normal user → profile
        }
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong. Try again.");
    }
  };

  // =========================
  // SIGNUP FUNCTION
  // =========================
  const handleSignup = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("userName", form.userName);
      formData.append("password", form.password);
      if (form.picture) formData.append("picture", form.picture);

      const res = await fetch("https://e-commerce-1-km7j.onrender.com/user/signup", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Please login.");
        setForm({ firstName: "", lastName: "", userName: "", password: "", picture: null });
        setShowLogin(true); // show login after signup
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Something went wrong. Try again.");
    }
  };

  // =========================
  // LOGOUT FUNCTION
  // =========================
  const handleLogout = async () => {
    try {
      const res = await fetch("https://e-commerce-1-km7j.onrender.com/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setIsLoggedIn(false);
        setLoggedInUser(null);
        dispatch({
          type: "set-cart",
          payload: { products: [], totalPrice: 0, totalShipping: 0 },
        });
        navigate("/");
      } else {
        console.error("Logout failed:", res.status);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // =========================
  // RENDER
  // =========================
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          {!showLogin ? (
            <>
              <Signup
                form={form}
                setForm={setForm}
                handleSignup={handleSignup}
                passwordError={passwordError}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <p className="text-center mt-4">
                Already have an account?{" "}
                <button
                  className="text-blue-500 font-semibold hover:underline"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <Login
                form={form}
                setForm={setForm}
                handleLogin={handleLogin}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <p className="text-center mt-4">
                Don't have an account?{" "}
                <button
                  className="text-blue-500 font-semibold hover:underline"
                  onClick={() => setShowLogin(false)}
                >
                  Signup
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <ProfileView
          loggedInUser={loggedInUser}
          handleLogout={handleLogout}
          navigate={navigate}
          setEditMode={setEditMode}
        />
        {editMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
              <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
              <button
                onClick={() => setEditMode(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="file"
                  onChange={(e) => setForm({ ...form, picture: e.target.files[0] })}
                  className="w-full"
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
