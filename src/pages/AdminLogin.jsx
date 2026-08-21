import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminToken } from "../utils/adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://veyid-api.info-veyid.workers.dev/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStep("otp");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Unable to log in. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://veyid-api.info-veyid.workers.dev/admin/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (data.success && data.token) {
        setAdminToken(data.token);
        navigate("/admin");
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setError("Unable to verify OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#0d0d0d",
    color: "#fff",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#4f8cff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#090909",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <form
        onSubmit={step === "password" ? handlePasswordSubmit : handleOtpSubmit}
        style={{
          background: "#151515",
          padding: "40px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "360px",
        }}
      >
        <h2 style={{ marginBottom: "24px", textAlign: "center" }}>
          {step === "password" ? "Admin Login" : "Enter OTP"}
        </h2>

        {step === "password" && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </>
        )}

        {step === "otp" && (
          <>
            <p style={{ marginBottom: "14px", fontSize: "14px", color: "#aaa" }}>
              A 6-digit code was sent to {email}
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={inputStyle}
            />
          </>
        )}

        {error && (
          <p style={{ color: "#ff5c5c", marginBottom: "14px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading
            ? "Please wait..."
            : step === "password"
            ? "Continue"
            : "Verify & Login"}
        </button>
      </form>
    </div>
  );
}
