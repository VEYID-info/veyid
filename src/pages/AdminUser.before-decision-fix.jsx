import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`https://veyid-api.info-veyid.workers.dev/admin/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserDetails(data);
        } else {
          setError(data.message || "User details not found");
        }
      })
      .catch(() => {
        setError("Unable to load user details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.centerBox}>Loading user details...</div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div style={styles.page}>
        <div style={styles.centerBox}>
          <h2>Unable to load user</h2>
          <p style={{ color: "#888" }}>{error}</p>
          <button
            style={styles.backButton}
            onClick={() => navigate("/admin")}
          >
            ← Back to Admin
          </button>
        </div>
      </div>
    );
  }

  const { user, documents = [] } = userDetails;

  const handleDecision = async (decision) => {
    setDecisionError("");
    setDecisionMessage("");

    if (decision === "rejected") {
      const reason = window.prompt(
        "Enter the reason for rejecting this user:"
      );

      if (reason === null) return;

      if (!reason.trim()) {
        setDecisionError("Rejection reason is required.");
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to reject this user?"
      );

      if (!confirmed) return;

      await submitDecision(decision, reason.trim());
      return;
    }

    const label =
      decision === "approved"
        ? "approve"
        : "keep this user pending";

    const confirmed = window.confirm(
      `Are you sure you want to ${label}?`
    );

    if (!confirmed) return;

    await submitDecision(decision, null);
  };

  const submitDecision = async (decision, reason) => {
    setDecisionLoading(true);
    setDecisionError("");
    setDecisionMessage("");

    try {
      const response = await fetch(
        `https://veyid-api.info-veyid.workers.dev/admin/user/${id}/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            decision,
            reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to update verification status."
        );
      }

      setUserDetails((current) => ({
        ...current,
        user: {
          ...current.user,
          verification_status: data.user.verification_status,
          rejection_reason: data.user.rejection_reason,
        },
      }));

      setDecisionMessage(
        decision === "approved"
          ? "User approved successfully."
          : decision === "rejected"
          ? "User rejected successfully."
          : "User kept pending successfully."
      );
    } catch (err) {
      console.error("Decision error:", err);
      setDecisionError(
        err.message || "Failed to update verification status."
      );
    } finally {
      setDecisionLoading(false);
    }
  };

  return (
    <>

      <div style={styles.page}>
      <div style={styles.container}>

        {/* Top navigation */}
        <div style={styles.topBar}>
          <button
            style={styles.backButton}
            onClick={() => navigate("/admin")}
          >
            ← Back to Users
          </button>

          <div style={styles.statusBadge}>
            {user.verification_status || "pending"}
          </div>
        </div>

        {/* User heading */}
        <header style={styles.header}>
          <div>
            <div style={styles.brand}>VEYID ADMIN</div>

            <h1 style={styles.title}>
              {user.full_name}
            </h1>

            <p style={styles.subtitle}>
              User #{user.id}
              <span style={styles.dot}>•</span>
              {user.veyid}
            </p>
          </div>
        </header>

        {/* Main review area */}
        <div style={styles.reviewGrid}>

          {/* Identity */}
          <section style={styles.card}>
            <div style={styles.sectionHeading}>
              <div>
                <div style={styles.eyebrow}>IDENTITY</div>
                <h2 style={styles.cardTitle}>User Information</h2>
              </div>

              <div style={styles.userMiniBadge}>
                {user.kyc_type || "basic"} KYC
              </div>
            </div>

            <div style={styles.infoGrid}>
              <Info label="Full Name" value={user.full_name} />
              <Info label="VEYID" value={user.veyid} />
              <Info
                label="Temporary Reference"
                value={user.temporary_ref}
              />
              <Info label="Email" value={user.email} />
              <Info label="Phone" value={user.phone} />
              <Info label="Country Code" value={user.country_code} />
              <Info label="Nationality" value={user.nationality} />
              <Info label="Date of Birth" value={user.date_of_birth} />
              <Info label="KYC Type" value={user.kyc_type} />
              <Info label="Badge" value={user.badge_type} />
              <Info label="Trust Score" value={user.trust_score} />
              <Info label="Created At" value={user.created_at} />
            </div>
          </section>

          {/* Verification decision */}
          <section style={styles.decisionCard}>
            <div style={styles.eyebrow}>VERIFICATION</div>

            <h2 style={styles.cardTitle}>
              Review Decision
            </h2>

            <p style={styles.decisionDescription}>
              Review the submitted identity information and choose
              the appropriate verification status.
            </p>

            <div style={styles.currentStatus}>
              <span style={styles.currentStatusLabel}>
                Current Status
              </span>

              <strong>
                {user.verification_status || "pending"}
              </strong>
            </div>

            <div style={styles.actionGrid}>
              <button
                type="button"
                style={{
                  ...styles.approveButton,
                  opacity: decisionLoading ? 0.6 : 1,
                }}
                disabled={decisionLoading}
                onClick={() => handleDecision("approved")}
              >
                {decisionLoading ? "Processing..." : "✓ Approve"}
              </button>

              <button
                type="button"
                style={{
                  ...styles.pendingButton,
                  opacity: decisionLoading ? 0.6 : 1,
                }}
                disabled={decisionLoading}
                onClick={() => handleDecision("pending")}
              >
                ⏳ Keep Pending
              </button>

              <button
                type="button"
                style={{
                  ...styles.rejectButton,
                  opacity: decisionLoading ? 0.6 : 1,
                }}
                disabled={decisionLoading}
                onClick={() => handleDecision("rejected")}
              >
                ✕ Reject
              </button>
            </div>

            <div style={styles.reviewHint}>
              Decision actions will be connected to the verification
              workflow next.
            </div>
          </section>
        </div>

        {/* Documents */}
        <section style={styles.card}>
          <div style={styles.sectionHeading}>
            <div>
              <div style={styles.eyebrow}>KYC DOCUMENTS</div>

              <h2 style={styles.cardTitle}>
                Verification Documents
              </h2>
            </div>

            <div style={styles.documentCount}>
              {documents.length}{" "}
              {documents.length === 1 ? "Document" : "Documents"}
            </div>
          </div>

          {documents.length === 0 ? (
            <div style={styles.empty}>
              No documents uploaded.
            </div>
          ) : (
            <div style={styles.documents}>
              {documents.map((document) => (
                <div
                  key={document.id}
                  style={styles.documentCard}
                >
                  <div className="veyid-document-info" style={styles.documentInfo}>
                    <div style={styles.documentIcon}>
                      {document.document_type === "selfie"
                        ? "◉"
                        : "▣"}
                    </div>

                    <div className="veyid-document-text" style={styles.documentText}>
                      <div style={styles.documentType}>
                        {document.document_type}
                      </div>

                      <div style={styles.fileName}>
                        {document.file_name}
                      </div>

                      <div style={styles.originalName}>
                        Original: {document.original_name}
                      </div>

                      <div style={styles.uploadedAt}>
                        Uploaded: {document.uploaded_at || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="veyid-document-actions" style={styles.documentActions}>
                    <button style={styles.secondaryButton}>
                      View
                    </button>

                    <button style={styles.secondaryButton}>
                      Download
                    </button>

                    <button style={styles.dangerOutline}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoLabel}>
        {label}
      </div>

      <div style={styles.infoValue}>
        {value || "—"}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#fff",
    fontFamily: "Inter, Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "22px",
  },

  backButton: {
    background: "#151515",
    color: "#fff",
    border: "1px solid #2b2b2b",
    borderRadius: "9px",
    padding: "9px 14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  statusBadge: {
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#2a2100",
    color: "#facc15",
    border: "1px solid #4a3b00",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  header: {
    marginBottom: "20px",
  },

  brand: {
    color: "#ef4444",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2.5px",
    marginBottom: "5px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    lineHeight: "1.15",
    fontWeight: "850",
  },

  subtitle: {
    color: "#777",
    margin: "7px 0 0",
    fontSize: "13px",
  },

  dot: {
    margin: "0 8px",
    color: "#444",
  },

  reviewGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
    gap: "16px",
    alignItems: "start",
    marginBottom: "16px",
  },

  card: {
    background: "#101010",
    border: "1px solid #242424",
    borderRadius: "14px",
    padding: "20px",
    boxSizing: "border-box",
    minWidth: 0,
    marginBottom: "16px",
  },

  decisionCard: {
    background: "#101010",
    border: "1px solid #242424",
    borderRadius: "14px",
    padding: "20px",
    boxSizing: "border-box",
    minWidth: 0,
  },

  sectionHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "16px",
  },

  eyebrow: {
    color: "#777",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.7px",
    marginBottom: "5px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "19px",
    lineHeight: "1.2",
  },

  userMiniBadge: {
    padding: "5px 9px",
    border: "1px solid #303030",
    borderRadius: "7px",
    color: "#aaa",
    background: "#151515",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
    gap: "10px",
    width: "100%",
    minWidth: 0,
  },

  infoItem: {
    background: "#0b0b0b",
    border: "1px solid #1f1f1f",
    borderRadius: "9px",
    padding: "11px",
    minWidth: 0,
    boxSizing: "border-box",
  },

  infoLabel: {
    color: "#666",
    fontSize: "9px",
    textTransform: "uppercase",
    letterSpacing: "0.9px",
    marginBottom: "5px",
    fontWeight: "700",
  },

  infoValue: {
    color: "#eee",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: "1.35",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    wordBreak: "normal",
    overflowWrap: "normal",
    minWidth: 0,
    width: "100%",
    display: "block",
  },

  decisionDescription: {
    color: "#777",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "0 0 14px",
  },

  currentStatus: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    padding: "11px 12px",
    marginBottom: "12px",
    background: "#0b0b0b",
    border: "1px solid #222",
    borderRadius: "9px",
    fontSize: "12px",
    textTransform: "capitalize",
  },

  currentStatusLabel: {
    color: "#666",
    textTransform: "uppercase",
    fontSize: "9px",
    letterSpacing: "1px",
  },

  actionGrid: {
    display: "grid",
    gap: "8px",
  },

  approveButton: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#15803d",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "12px",
  },

  pendingButton: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #3b3b3b",
    borderRadius: "8px",
    background: "#171717",
    color: "#ddd",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "12px",
  },

  rejectButton: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#b91c1c",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "12px",
  },

  successMessage: {
    marginTop: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#0b2415",
    border: "1px solid #14532d",
    color: "#86efac",
    fontSize: "12px",
    fontWeight: "700",
  },

  errorMessage: {
    marginTop: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#2a0d0d",
    border: "1px solid #7f1d1d",
    color: "#fca5a5",
    fontSize: "12px",
    fontWeight: "700",
  },

  reviewHint: {
    marginTop: "12px",
    paddingTop: "10px",
    borderTop: "1px solid #202020",
    color: "#555",
    fontSize: "10px",
    lineHeight: "1.45",
  },

  documentCount: {
    color: "#777",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  documents: {
    display: "grid",
    gap: "10px",
    width: "100%",
  },

  documentCard: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
    padding: "14px",
    background: "#0b0b0b",
    border: "1px solid #222",
    borderRadius: "10px",
    boxSizing: "border-box",
  },

  documentInfo: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    minWidth: 0,
    width: "100%",
  },

  documentIcon: {
    width: "34px",
    height: "34px",
    flex: "0 0 34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#171717",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#aaa",
    fontWeight: "800",
  },

  documentText: {
    minWidth: 0,
    width: "100%",
    flex: "1",
  },

  documentType: {
    fontWeight: "800",
    fontSize: "13px",
    marginBottom: "3px",
    textTransform: "capitalize",
  },

  fileName: {
    color: "#ccc",
    fontSize: "11px",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },

  originalName: {
    color: "#666",
    fontSize: "10px",
    marginTop: "3px",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },

  uploadedAt: {
    color: "#555",
    fontSize: "9px",
    marginTop: "3px",
  },

  documentActions: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    width: "100%",
  },

  secondaryButton: {
    padding: "7px 10px",
    border: "1px solid #333",
    borderRadius: "7px",
    background: "#161616",
    color: "#ddd",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "11px",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  },

  dangerOutline: {
    padding: "7px 10px",
    border: "1px solid #7f1d1d",
    borderRadius: "7px",
    background: "#1a0b0b",
    color: "#f87171",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "11px",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  },

  empty: {
    padding: "26px",
    textAlign: "center",
    color: "#666",
    border: "1px dashed #333",
    borderRadius: "9px",
    fontSize: "12px",
  },

  centerBox: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "28px",
    textAlign: "center",
    background: "#111",
    border: "1px solid #242424",
    borderRadius: "14px",
  },
};

