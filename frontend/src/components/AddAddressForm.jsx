import React, { useState } from "react";
import OtpBox from "./OtpBox";

export default function AddAddressForm({
  newAddress,
  setNewAddress,
  setShowAddressForm,
  setAddresses,
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleAddAddress = async () => {
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zipCode
    )
      return alert("Please fill all required fields");

    if (!otpVerified) return alert("Please verify phone first");

    try {
      const res = await fetch(
        "https://e-commerce-1-km7j.onrender.com/address/add",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAddress),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setAddresses((prev) => [...prev, data.address]);
        alert("Address added!");
        setShowAddressForm(false);
        setNewAddress({
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
        setOtpVerified(false);
        setOtpSent(false);
      } else alert("Failed to add address");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white mt-4 space-y-3">
      <h4 className="font-semibold text-lg">Add New Address</h4>

      <input
        type="text"
        placeholder="Full Name *"
        value={newAddress.fullName}
        onChange={(e) =>
          setNewAddress({ ...newAddress, fullName: e.target.value })
        }
        className="w-full p-2 border rounded"
      />

      <OtpBox
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        otpSent={otpSent}
        setOtpSent={setOtpSent}
        otpVerified={otpVerified}
        setOtpVerified={setOtpVerified}
      />

      <input
        type="text"
        placeholder="Address Line 1 *"
        value={newAddress.addressLine1}
        onChange={(e) =>
          setNewAddress({ ...newAddress, addressLine1: e.target.value })
        }
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Address Line 2 (Optional)"
        value={newAddress.addressLine2}
        onChange={(e) =>
          setNewAddress({ ...newAddress, addressLine2: e.target.value })
        }
        className="w-full p-2 border rounded"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="City *"
          value={newAddress.city}
          onChange={(e) =>
            setNewAddress({ ...newAddress, city: e.target.value })
          }
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="State *"
          value={newAddress.state}
          onChange={(e) =>
            setNewAddress({ ...newAddress, state: e.target.value })
          }
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Zip Code *"
          value={newAddress.zipCode}
          onChange={(e) =>
            setNewAddress({ ...newAddress, zipCode: e.target.value })
          }
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Country"
          value={newAddress.country}
          onChange={(e) =>
            setNewAddress({ ...newAddress, country: e.target.value })
          }
          className="p-2 border rounded"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={newAddress.isDefault}
          onChange={(e) =>
            setNewAddress({ ...newAddress, isDefault: e.target.checked })
          }
        />
        Set as default address
      </label>

      <button
        onClick={handleAddAddress}
        className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700"
      >
        Save Address
      </button>
    </div>
  );
}
