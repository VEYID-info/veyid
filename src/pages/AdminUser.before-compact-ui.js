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
          <p>{error}</p>
          <button style={styles.backButton} onClick={() => navigate("/admin")}>
            ← Back to Admin
          </button>
        </div>
      </div>
    );
  }

  const { user, documents = [] } = userDetails;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

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

        <div style={styles.header}>
          <div>
            <div style={styles.brand}>VEYID</div>
            <h1 style={styles.title}>{user.full_name}</h1>
            <p style={styles.subtitle}>
              User ID #{user.id} · {user.veyid}
            </p>
          </div>
        </div>

        <div style={styles.grid}>

          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.eyebrow}>IDENTITY</div>
                <h2 style={styles.cardTitle}>User Information</h2>
              </div>
            </div>

            <div style={styles.infoGrid}>
              <Info label="Full Name" value={user.full_name} />
              <Info label="VEYID" value={user.veyid} />
              <Info label="Temporary Reference" value={user.temporary_ref} />
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

          <section style={styles.card}>
            <div style={styles.eyebrow}>VERIFICATION</div>
            <h2 style={styles.cardTitle}>Verification Decision</h2>

            <div style={styles.actionGrid}>
              <button style={styles.approveButton}>
                ✓ Approve
              </button>

              <button style={styles.pendingButton}>
                ⏳ Keep Pending
              </button>

              <button style={styles.rejectButton}>
                ✕ Reject
              </button>
            </div>

            <div style={styles.noteBox}>
              <strong>Admin decision</strong>
              <p>
                Decision controls will be connected to the backend next.
              </p>
            </div>
          </section>

        </div>

        <section style={styles.card}>
          <div style={styles.eyebrow}>DOCUMENTS</div>
          <h2 style={styles.cardTitle}>Verification Documents</h2>

          {documents.length === 0 ? (
            <div style={styles.empty}>
              No documents uploaded.
            </div>
          ) : (
            <div style={styles.documents}>
              {documents.map((document) => (
                <div key={document.id} style={styles.documentCard}>
                  <div>
                    <div style={styles.documentType}>
                      {document.document_type}
                    </div>

                    <div style={styles.fileName}>
                      {document.file_name}
                    </div>

                    <div style={styles.originalName}>
                      Original: {document.original_name}
                    </div>
                  </div>

                  <div style={styles.documentActions}>
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
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value || "—"}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#fff",
    fontFamily: "Inter, Arial, sans-serif",
    padding: "24px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
  },

  backButton: {
    background: "#151515",
    color: "#fff",
    border: "1px solid #2b2b2b",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "700",
  },

  statusBadge: {
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#2a2100",
    color: "#facc15",
    border: "1px solid #4a3b00",
    fontSize: "13px",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  header: {
    marginBottom: "28px",
  },

  brand: {
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "3px",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "850",
  },

  subtitle: {
    color: "#777",
    marginTop: "8px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(300px, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#101010",
    border: "1px solid #242424",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    boxSizing: "border-box",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
  },

  eyebrow: {
    color: "#777",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    marginBottom: "7px",
  },

  cardTitle: {
    margin: "0 0 22px",
    fontSize: "21px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "14px",
  },

  infoItem: {
    background: "#0b0b0b",
    border: "1px solid #1f1f1f",
    borderRadius: "10px",
    padding: "14px",
    minWidth: 0,
  },

  infoLabel: {
    color: "#666",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "6px",
  },

  infoValue: {
    color: "#eee",
    fontSize: "14px",
    fontWeight: "700",
    overflowWrap: "anywhere",
  },

  actionGrid: {
    display: "grid",
    gap: "10px",
  },

  approveButton: {
    padding: "13px",
    border: "none",
    borderRadius: "9px",
    background: "#15803d",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
  },

  pendingButton: {
    padding: "13px",
    border: "1px solid #3b3b3b",
    borderRadius: "9px",
    background: "#171717",
    color: "#ddd",
    fontWeight: "800",
    cursor: "pointer",
  },

  rejectButton: {
    padding: "13px",
    border: "none",
    borderRadius: "9px",
    background: "#b91c1c",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
  },

  noteBox: {
    marginTop: "18px",
    padding: "14px",
    borderRadius: "10px",
    background: "#0b0b0b",
    border: "1px solid #222",
    color: "#999",
    fontSize: "13px",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#666",
    border: "1px dashed #333",
    borderRadius: "10px",
  },

  documents: {
    display: "grid",
    gap: "12px",
  },

  documentCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    padding: "16px",
    background: "#0b0b0b",
    border: "1px solid #222",
    borderRadius: "12px",
  },

  documentType: {
    fontWeight: "800",
    marginBottom: "5px",
  },

  fileName: {
    color: "#ddd",
    fontSize: "13px",
    overflowWrap: "anywhere",
  },

  originalName: {
    color: "#666",
    fontSize: "12px",
    marginTop: "5px",
  },

  documentActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  secondaryButton: {
    padding: "8px 12px",
    border: "1px solid #333",
    borderRadius: "8px",
    background: "#161616",
    color: "#ddd",
    cursor: "pointer",
    fontWeight: "700",
  },

  dangerOutline: {
    padding: "8px 12px",
    border: "1px solid #7f1d1d",
    borderRadius: "8px",
    background: "#1a0b0b",
    color: "#f87171",
    cursor: "pointer",
    fontWeight: "700",
  },

  centerBox: {
    maxWidth: "600px",
    margin: "120px auto",
    padding: "30px",
    textAlign: "center",
    background: "#111",
    border: "1px solid #242424",
    borderRadius: "16px",
  },
};
