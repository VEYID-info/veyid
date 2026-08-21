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
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState("");

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

  useEffect(() => {
    if (activeTab !== "pending") return;

    setPendingLoading(true);
    setPendingError("");

    fetch("https://veyid-api.info-veyid.workers.dev/admin/pending-users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPendingUsers(data.users || []);
        } else {
          setPendingError(data.error || "Failed to load pending users.");
        }
      })
      .catch((err) => {
        console.error("Pending users error:", err);
        setPendingError("Unable to load pending users.");
      })
      .finally(() => {
        setPendingLoading(false);
      });
  }, [activeTab]);

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
          {activeTab === "pending" ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2 style={{ margin: 0 }}>Pending Verification</h2>
                  <p style={{ color: "#777", margin: "6px 0 0" }}>
                    Users waiting for identity verification review
                  </p>
                </div>

                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "#1a1a1a",
                    color: "#aaa",
                    fontSize: "13px",
                  }}
                >
                  {pendingUsers.length} pending
                </div>
              </div>

              {pendingLoading ? (
                <div
                  style={{
                    padding: "50px 20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  Loading pending users...
                </div>
              ) : pendingError ? (
                <div
                  style={{
                    padding: "30px",
                    border: "1px solid #552222",
                    borderRadius: "12px",
                    color: "#f87171",
                  }}
                >
                  {pendingError}
                </div>
              ) : pendingUsers.length === 0 ? (
                <div
                  style={{
                    border: "1px dashed #333",
                    borderRadius: "12px",
                    padding: "60px 20px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "42px", marginBottom: "15px" }}>
                    ⏳
                  </div>

                  <h2 style={{ margin: "0 0 8px" }}>
                    No Pending Users
                  </h2>

                  <p style={{ color: "#777", margin: 0 }}>
                    There are no users waiting for verification.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {pendingUsers.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        border: "1px solid #292929",
                        borderRadius: "12px",
                        padding: "18px",
                        background: "#0d0d0d",
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr)",
                        gap: "14px",
                        width: "100%",
                        boxSizing: "border-box",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "17px",
                            fontWeight: "800",
                            marginBottom: "5px",
                          }}
                        >
                          {user.full_name}
                        </div>

                        <div
                          style={{
                            color: "#888",
                            fontSize: "13px",
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                          }}
                        >
                          {user.email}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            color: "#777",
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            marginBottom: "5px",
                          }}
                        >
                          Temporary Reference
                        </div>

                        <div
                          style={{
                            fontWeight: "700",
                            fontSize: "13px",
                          }}
                        >
                          {user.temporary_ref || "—"}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            color: "#777",
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            marginBottom: "5px",
                          }}
                        >
                          KYC
                        </div>

                        <div
                          style={{
                            fontWeight: "700",
                            textTransform: "capitalize",
                          }}
                        >
                          {user.kyc_type || "—"}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          alert(
                            "User Details coming next for " +
                              user.full_name
                          )
                        }
                        style={{
                          padding: "10px 15px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#dc2626",
                          color: "#fff",
                          fontWeight: "700",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                border: "1px dashed #333",
                borderRadius: "12px",
                padding: "60px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "42px", marginBottom: "15px" }}>
                {activeTab === "approved"
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
          )}
        </div>
      </div>
    </div>
  );
}
