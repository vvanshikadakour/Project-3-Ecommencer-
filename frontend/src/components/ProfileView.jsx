import { FaUser } from "react-icons/fa";
import { MdCameraEnhance } from "react-icons/md";

export default function ProfileView({ loggedInUser, handleLogout, navigate, setEditMode }) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col items-center space-y-6">
      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition"
        >
          My Orders
        </button>
        <button
          onClick={() => navigate("/cart")}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold transition"
        >
          My Cart
        </button>
        <button
          onClick={() => setEditMode(true)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Picture */}
      <div className="relative w-32 h-32">
        {loggedInUser?.picture ? (
          <img
            src={loggedInUser.picture}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-2 border-gray-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-400">
            <FaUser />
          </div>
        )}
        {/* Edit icon overlay */}
        <button
          onClick={() => setEditMode(true)}
          className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
        >
          <MdCameraEnhance className="text-gray-600" size={20} />
        </button>
      </div>

      {/* Welcome Text */}
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Welcome {loggedInUser?.firstName} {loggedInUser?.lastName}
      </h2>
      <p className="text-gray-500 text-sm">Username: {loggedInUser?.userName}</p>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition"
      >
        Logout
      </button>
    </div>
  );
}
