import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("veyid_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await fetch(
          "https://veyid-api.info-veyid.workers.dev/user/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || data.error || "Session expired.");
        }

        setUser(data.user || data);
      } catch (err) {
        console.error("VEYID dashboard error:", err);
        localStorage.removeItem("veyid_token");
        localStorage.removeItem("veyid_user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("veyid_token");
    localStorage.removeItem("veyid_user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading your dashboard...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isVerified = user.veyid && !String(user.veyid).startsWith("PENDING-");

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "32px",
          boxSizing: "border-box",
          borderRadius: "18px",
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Your VEYID Dashboard</h1>

        <div
          style={{
            padding: "16px",
            borderRadius: "10px",
            marginBottom: "20px",
            background: isVerified ? "#f0fdf4" : "#fffbeb",
            color: isVerified ? "#166534" : "#92400e",
          }}
        >
          {isVerified ? (
            <>
              <strong>Verified ✓</strong>
              <div style={{ marginTop: "6px", fontSize: "18px" }}>
                {user.veyid}
              </div>
            </>
          ) : (
            <>
              <strong>Status: {user.verification_status || "Pending"}</strong>
              <div style={{ marginTop: "6px" }}>
                Temporary Reference: {user.temporary_ref}
              </div>
            </>
          )}
        </div>

        {user.verification_status === "rejected" && (
          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              marginBottom: "20px",
              background: "#fff1f2",
              color: "#b91c1c",
            }}
          >
            <strong>Application Rejected</strong>
            {user.rejection_reason && (
              <div style={{ marginTop: "6px" }}>{user.rejection_reason}</div>
            )}
          </div>
        )}

        <div style={{ marginBottom: "8px" }}>
          <strong>Name:</strong> {user.full_name}
        </div>
        <div style={{ marginBottom: "8px" }}>
          <strong>Email:</strong> {user.email}
        </div>
        {user.kyc_type && (
          <div style={{ marginBottom: "8px" }}>
            <strong>KYC Type:</strong> {user.kyc_type}
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "12px",
            cursor: "pointer",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
