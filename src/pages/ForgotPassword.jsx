import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter otp + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your registered email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://veyid-api.info-veyid.workers.dev/send-email-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || data.error || "Unable to send OTP.");
      }

      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      console.error("VEYID send OTP error:", err);
      setError(err.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://veyid-api.info-veyid.workers.dev/forgot-password/set",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Unable to set password.");
      }

      setMessage("Password set successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      console.error("VEYID set password error:", err);
      setError(err.message || "Unable to set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          boxSizing: "border-box",
          borderRadius: "18px",
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Forgot / Set Password</h1>

        {step === 1 && (
          <>
            <p style={{ color: "#666", lineHeight: 1.6 }}>
              Enter your registered email to receive an OTP.
            </p>

            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                placeholder="Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  boxSizing: "border-box",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />

              {error && (
                <div
                  style={{
                    marginBottom: "15px",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#fff1f2",
                    color: "#b91c1c",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ color: "#666", lineHeight: 1.6 }}>
              Enter the OTP sent to {email} and your new password.
            </p>

            <form onSubmit={handleSetPassword}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  boxSizing: "border-box",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />

              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  boxSizing: "border-box",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  boxSizing: "border-box",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />

              {error && (
                <div
                  style={{
                    marginBottom: "15px",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#fff1f2",
                    color: "#b91c1c",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  style={{
                    marginBottom: "15px",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#f0fdf4",
                    color: "#166534",
                    fontSize: "14px",
                  }}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Saving..." : "Set Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
