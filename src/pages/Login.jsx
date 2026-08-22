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
        throw new Error(data.message || data.error || "Login failed.");
      }

      if (data.user) {
        localStorage.setItem("veyid_user", JSON.stringify(data.user));
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
      setError(err.message || "Unable to connect to VEYID.");
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
        background: "linear-gradient(135deg, #f5f7fa 0%, #eef1f7 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "36px 32px",
          boxSizing: "border-box",
          borderRadius: "20px",
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "0.5px",
              background: "linear-gradient(135deg, #4338ca, #0ea5e9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            VEYID
          </span>
        </div>

        <h1
          style={{
            marginTop: "4px",
            marginBottom: "6px",
            fontSize: "22px",
            textAlign: "center",
          }}
        >
          Welcome back
        </h1>

        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.6,
            textAlign: "center",
            marginBottom: "28px",
            fontSize: "14px",
          }}
        >
          Sign in to access your VEYID account.
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
              padding: "13px 14px",
              marginBottom: "12px",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
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
              padding: "13px 14px",
              marginBottom: "18px",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              fontSize: "15px",
            }}
          />

          {error && (
            <div
              style={{
                marginBottom: "14px",
                padding: "12px",
                borderRadius: "10px",
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
                marginBottom: "14px",
                padding: "12px",
                borderRadius: "10px",
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
              padding: "13px",
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#ffffff",
              background: "linear-gradient(135deg, #4338ca, #0ea5e9)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div style={{ textAlign: "center", marginTop: "14px" }}>
            <a
              href="/forgot-password"
              style={{ fontSize: "13.5px", color: "#4338ca" }}
            >
              Forgot / Set Password?
            </a>
          </div>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "26px 0 18px",
            gap: "10px",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
        </div>

        <a
          href="/get-verified"
          style={{
            display: "block",
            width: "100%",
            padding: "13px",
            boxSizing: "border-box",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 600,
            color: "#4338ca",
            border: "1.5px solid #4338ca",
          }}
        >
          New here? Get Verified
        </a>
      </div>
    </div>
  );
}

export default Login;
