import React from "react";

export default function AddressList({
  addresses,
  selectedAddress,
  setSelectedAddress,
  showAddressForm,
  setShowAddressForm,
  newAddress,
  setNewAddress,
  setAddresses,
}) {
  const deleteAddress = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/address/delete/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a._id !== id));
        if (selectedAddress?._id === id) setSelectedAddress(null);
      } else alert("Failed to delete address");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-4 border rounded-md mb-6 bg-gray-50">
      <h3 className="text-xl font-semibold mb-2">📍 Delivery Address</h3>

      {addresses.length ? (
        <>
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`p-3 mb-2 rounded border cursor-pointer ${
                selectedAddress?._id === addr._id
                  ? "border-green-500 bg-green-100"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedAddress(addr)}
            >
              <div className="flex justify-between items-center">
                <strong>{addr.fullName}</strong>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress(addr._id);
                  }}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
              <p>{addr.phone}</p>
              <p>
                {addr.addressLine1}
                {addr.addressLine2 && `, ${addr.addressLine2}`}
              </p>
              <p>
                {addr.city}, {addr.state} - {addr.zipCode}
              </p>
              {addr.isDefault && (
                <span className="text-green-600 text-sm">(Default)</span>
              )}
            </div>
          ))}

          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showAddressForm ? "Cancel" : "+ Add New Address"}
          </button>
        </>
      ) : (
        <div>
          <p>No saved addresses. Please add one.</p>
          <button
            onClick={() => setShowAddressForm(true)}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Address
          </button>
        </div>
      )}
    </div>
  );
}
