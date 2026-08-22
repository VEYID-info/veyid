import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!identifier.trim() || !password) {
      setError("Please enter your VEYID, email or phone number and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://veyid-api.info-veyid.workers.dev/user-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: identifier.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Login failed."
        );
      }

      if (data.user) {
        localStorage.setItem(
          "veyid_user",
          JSON.stringify(data.user)
        );
      }

      if (data.token) {
        localStorage.setItem("veyid_token", data.token);
      }

      setMessage("Login successful. Opening your dashboard...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error("VEYID login error:", err);
      setError(
        err.message || "Unable to connect to VEYID."
      );
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
        <h1 style={{ marginTop: 0 }}>
          Login to VEYID
        </h1>

        <p style={{ color: "#666", lineHeight: 1.6 }}>
          Welcome back! Sign in to access your VEYID account.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email, Phone Number or VEYID"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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

          <div
            style={{
              textAlign: "right",
              marginBottom: "20px",
            }}
          >
            <a href="/forgot-password">
              Forgot / Set Password?
            </a>
          </div>

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
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "24px" }}>
          <p>
            <a href="/get-verified">Get Verified</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
