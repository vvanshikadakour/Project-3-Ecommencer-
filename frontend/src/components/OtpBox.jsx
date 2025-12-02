import React, { useState } from "react";

export default function OtpBox({
  newAddress,
  setNewAddress,
  otpSent,
  setOtpSent,
  otpVerified,
  setOtpVerified,
}) {
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const handleSendOtp = async () => {
    if (!newAddress.phone || newAddress.phone.length !== 10)
      return alert("Enter valid 10-digit phone");

    setSendingOtp(true);
    try {
      const res = await fetch("https://e-commerce-1-km7j.onrender.com/otp/send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: newAddress.phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        alert(`OTP: ${data.devOtp} (for testing)`);
      } else alert(data.message || "Failed to send OTP");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return alert("Enter valid 6-digit OTP");
    setVerifyingOtp(true);

    try {
      const res = await fetch("https://e-commerce-1-km7j.onrender.com/otp/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: newAddress.phone, otp }),
      });
      if (res.ok) {
        setOtpVerified(true);
        alert("Phone verified!");
      } else alert("Invalid OTP");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="flex gap-2 items-center mb-2">
      <input
        type="text"
        placeholder="Phone *"
        value={newAddress.phone}
        onChange={(e) => {
          setNewAddress({ ...newAddress, phone: e.target.value });
          setOtpSent(false);
          setOtpVerified(false);
          setOtp("");
        }}
        disabled={otpVerified}
        className={`p-2 border rounded flex-1 ${
          otpVerified ? "bg-green-100" : "bg-white"
        }`}
      />
      {!otpVerified && (
        <button
          onClick={handleSendOtp}
          disabled={sendingOtp || !newAddress.phone || newAddress.phone.length !== 10}
          className={`px-4 py-2 text-white rounded ${
            otpSent ? "bg-orange-500" : "bg-blue-600"
          } hover:opacity-90`}
        >
          {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
        </button>
      )}
      {otpVerified && <span className="text-green-600 font-bold">✓ Verified</span>}

      {otpSent && !otpVerified && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={verifyingOtp || !otp || otp.length !== 6}
            className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-90"
          >
            {verifyingOtp ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
}
