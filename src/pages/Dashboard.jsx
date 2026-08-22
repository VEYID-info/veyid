import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function getTier(kycType) {
  if (kycType === "full") {
    return {
      label: "Gold Verified",
      chipBg: "linear-gradient(135deg, #f5c453, #d99a1b)",
      chipColor: "#5a3d00",
    };
  }
  if (kycType === "basic") {
    return {
      label: "Bronze Verified",
      chipBg: "linear-gradient(135deg, #d7b19b, #a9714f)",
      chipColor: "#3f2413",
    };
  }
  return {
    label: "Verified",
    chipBg: "linear-gradient(135deg, #c7d2fe, #93c5fd)",
    chipColor: "#1e3a8a",
  };
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

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
            headers: { Authorization: "Bearer " + token },
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

  const handleAvatarPick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Preview only for now — actual upload endpoint not built yet.
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result);
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading your dashboard...
      </div>
    );
  }

  if (!user) return null;

  const isVerified = user.veyid && !String(user.veyid).startsWith("PENDING-");
  const tier = getTier(user.kyc_type);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #eef1f7 100%)",
        boxSizing: "border-box",
      }}
    >
      {/* Top nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "0.5px",
            background: "linear-gradient(135deg, #4338ca, #0ea5e9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          VEYID
        </span>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          style={{
            background: "none",
            border: "none",
            fontSize: "22px",
            cursor: "pointer",
            padding: "4px 8px",
            color: "#1f2937",
          }}
        >
          ☰
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "56px",
              right: "16px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
              overflow: "hidden",
              minWidth: "190px",
              zIndex: 10,
            }}
          >
            <div style={menuItemStyle}>🏅 Badges & Awards</div>
            <div style={menuItemStyle}>✉️ Contact Support</div>
            <div
              style={{ ...menuItemStyle, color: "#b91c1c" }}
              onClick={handleLogout}
            >
              ⎋ Logout
            </div>
          </div>
        )}
      </div>

      {/* Profile section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 20px 8px",
        }}
      >
        <div
          onClick={isVerified ? handleAvatarPick : undefined}
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "50%",
            background: avatarUrl
              ? `url(${avatarUrl}) center/cover no-repeat`
              : "linear-gradient(135deg, #4338ca, #0ea5e9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: 700,
            cursor: isVerified ? "pointer" : "default",
            border: "3px solid #ffffff",
            boxShadow: "0 6px 18px rgba(15,23,42,0.15)",
          }}
          title={
            isVerified
              ? "Tap to change profile photo"
              : "Available after verification"
          }
        >
          {!avatarUrl && getInitials(user.full_name)}
        </div>

        {isVerified && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        )}

        <div style={{ marginTop: "12px", fontSize: "18px", fontWeight: 700 }}>
          {user.full_name}
        </div>

        {isVerified ? (
          <>
            <div
              style={{
                marginTop: "8px",
                padding: "5px 14px",
                borderRadius: "999px",
                fontSize: "12.5px",
                fontWeight: 700,
                background: tier.chipBg,
                color: tier.chipColor,
              }}
            >
              {tier.label}
            </div>
            <div
              style={{
                marginTop: "10px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#4338ca",
                letterSpacing: "0.5px",
              }}
            >
              {user.veyid}
            </div>
          </>
        ) : (
          <div
            style={{
              marginTop: "8px",
              padding: "5px 14px",
              borderRadius: "999px",
              fontSize: "12.5px",
              fontWeight: 700,
              background: "#fef3c7",
              color: "#92400e",
            }}
          >
            {user.verification_status || "Pending"}
          </div>
        )}
      </div>

      {/* Info card */}
      <div style={{ padding: "12px 20px 32px", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            padding: "20px",
            boxSizing: "border-box",
            boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
          }}
        >
          {!isVerified && (
            <div style={{ marginBottom: "14px", fontSize: "14px", color: "#6b7280" }}>
              Temporary Reference: <strong>{user.temporary_ref}</strong>
            </div>
          )}

          {user.verification_status === "rejected" && (
            <div
              style={{
                padding: "14px",
                borderRadius: "10px",
                marginBottom: "16px",
                background: "#fff1f2",
                color: "#b91c1c",
                fontSize: "14px",
              }}
            >
              <strong>Application Rejected</strong>
              {user.rejection_reason && (
                <div style={{ marginTop: "6px" }}>{user.rejection_reason}</div>
              )}
            </div>
          )}

          <InfoRow label="Email" value={user.email} />
          <InfoRow
            label="KYC Status"
            value={isVerified ? tier.label : "Not yet verified"}
            last
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: last ? "none" : "1px solid #f1f5f9",
        fontSize: "14.5px",
      }}
    >
      <span style={{ color: "#6b7280" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "#1f2937" }}>{value}</span>
    </div>
  );
}

const menuItemStyle = {
  padding: "13px 16px",
  fontSize: "14.5px",
  cursor: "pointer",
  borderBottom: "1px solid #f1f5f9",
};

export default Dashboard;
