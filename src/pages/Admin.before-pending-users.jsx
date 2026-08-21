import { useEffect, useState } from "react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("pending");

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    appeals: 0,
    reportedUsers: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch("https://veyid-api.info-veyid.workers.dev/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        console.error("Admin stats error:", err);
      })
      .finally(() => {
        setStatsLoading(false);
      });
  }, []);

  const statsCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥" },
    { label: "Pending Verification", value: stats.pendingUsers, icon: "⏳" },
    { label: "Approved", value: stats.approvedUsers, icon: "✅" },
    { label: "Rejected", value: stats.rejectedUsers, icon: "❌" },
    { label: "Appeals", value: stats.appeals, icon: "⚖️" },
    { label: "Reported Users", value: stats.reportedUsers, icon: "🚨" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#090909",
        color: "#fff",
        padding: "30px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              color: "#ef4444",
              fontWeight: "700",
              letterSpacing: "2px",
            }}
          >
            VEYID
          </div>

          <h1
            style={{
              margin: "6px 0",
              fontSize: "32px",
              fontWeight: "800",
            }}
          >
            Admin Panel
          </h1>

          <p style={{ margin: 0, color: "#888" }}>
            Identity verification & trust management
          </p>
        </div>

        <div
          style={{
            padding: "10px 16px",
            border: "1px solid #252525",
            borderRadius: "10px",
            background: "#111",
            color: "#aaa",
            fontSize: "14px",
          }}
        >
          ● Admin Mode
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "16px",
        }}
      >
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#111",
              border: "1px solid #242424",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>
              {stat.icon}
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: "800",
                marginBottom: "5px",
              }}
            >
              {stat.value}
            </div>

            <div style={{ color: "#888", fontSize: "13px" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          background: "#111",
          border: "1px solid #242424",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "12px",
            borderBottom: "1px solid #242424",
            overflowX: "auto",
          }}
        >
          {[
            ["pending", "Pending"],
            ["approved", "Approved"],
            ["rejected", "Rejected"],
            ["appeals", "Appeals"],
            ["reported", "Reported"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background:
                  activeTab === key ? "#dc2626" : "transparent",
                color: activeTab === key ? "#fff" : "#888",
                fontWeight: "700",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "28px" }}>
          <div
            style={{
              border: "1px dashed #333",
              borderRadius: "12px",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "42px", marginBottom: "15px" }}>
              {activeTab === "pending"
                ? "⏳"
                : activeTab === "approved"
                ? "✅"
                : activeTab === "rejected"
                ? "❌"
                : activeTab === "appeals"
                ? "⚖️"
                : "🚨"}
            </div>

            <h2 style={{ margin: "0 0 8px" }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>

            <p style={{ color: "#777", margin: 0 }}>
              No records available yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
