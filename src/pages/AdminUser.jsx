import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminFetch, getAdminToken } from "../utils/adminAuth";

async function openOrDownloadDocument(fileName, download) {
  const response = await adminFetch(
    `https://veyid-api.info-veyid.workers.dev/admin/document?file=${encodeURIComponent(fileName)}`
  );

  if (!response.ok) {
    alert("Unable to load document.");
    return;
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  if (download) {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } else {
    window.open(blobUrl, "_blank");
  }

  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}

export default function AdminUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login");
    }
  }, []);

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [decisionLoading, setDecisionLoading] = useState(false);
  const [decisionError, setDecisionError] = useState("");
  const [decisionMessage, setDecisionMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    adminFetch(`https://veyid-api.info-veyid.workers.dev/admin/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserDetails(data);
        } else {
          setError(data.error || data.message || "User details not found");
        }
      })
      .catch((err) => {
        console.error("User details error:", err);
        setError("Unable to load user details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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
      const response = await adminFetch(
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

  if (loading) {
    return (
      <div className="veyid-admin-page">
        <div className="veyid-center-box">
          Loading user details...
        </div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="veyid-admin-page">
        <div className="veyid-center-box">
          <h2>Unable to load user</h2>
          <p>{error}</p>

          <button
            className="veyid-back-button"
            onClick={() => navigate("/admin")}
          >
            ← Back to Admin
          </button>
        </div>
      </div>
    );
  }

  const { user, documents = [] } = userDetails;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .veyid-admin-page {
          min-height: 100vh;
          width: 100%;
          background: #080808;
          color: #ffffff;
          font-family: Inter, Arial, sans-serif;
          padding: 24px;
          overflow-x: hidden;
        }

        .veyid-admin-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .veyid-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .veyid-back-button {
          border: 1px solid #2b2b2b;
          background: #151515;
          color: #ffffff;
          border-radius: 9px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .veyid-back-button:hover {
          background: #1d1d1d;
        }

        .veyid-status {
          padding: 7px 13px;
          border-radius: 999px;
          background: #2a2100;
          color: #facc15;
          border: 1px solid #4a3b00;
          font-size: 12px;
          font-weight: 800;
          text-transform: capitalize;
        }

        .veyid-header {
          margin-bottom: 22px;
        }

        .veyid-brand {
          color: #ef4444;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
          margin-bottom: 6px;
        }

        .veyid-title {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 850;
          overflow-wrap: anywhere;
        }

        .veyid-subtitle {
          margin: 7px 0 0;
          color: #777777;
          font-size: 13px;
        }

        .veyid-dot {
          margin: 0 8px;
          color: #444444;
        }

        .veyid-review-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 16px;
          align-items: start;
        }

        .veyid-card {
          width: 100%;
          min-width: 0;
          background: #101010;
          border: 1px solid #242424;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .veyid-section-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .veyid-eyebrow {
          color: #777777;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
          margin-bottom: 5px;
        }

        .veyid-card-title {
          margin: 0;
          font-size: 19px;
          line-height: 1.25;
        }

        .veyid-mini-badge {
          flex: 0 0 auto;
          padding: 5px 9px;
          border: 1px solid #303030;
          border-radius: 7px;
          color: #aaaaaa;
          background: #151515;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* IMPORTANT:
           Identity information stays compact in 3 columns.
           Long values are allowed to wrap normally,
           but the card itself never becomes a one-letter column.
        */
        .veyid-info-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          width: 100%;
        }

        .veyid-info-item {
          min-width: 0;
          width: 100%;
          background: #0b0b0b;
          border: 1px solid #1f1f1f;
          border-radius: 9px;
          padding: 11px;
        }

        .veyid-info-label {
          color: #666666;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.9px;
          margin-bottom: 5px;
          font-weight: 700;
        }

        .veyid-info-value {
          width: 100%;
          min-width: 0;
          color: #eeeeee;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.35;

          /* Never force normal words into one-letter columns */
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: normal;
        }

        .veyid-decision-card {
          width: 100%;
          min-width: 0;
          background: #101010;
          border: 1px solid #242424;
          border-radius: 14px;
          padding: 20px;
        }

        .veyid-decision-description {
          color: #777777;
          font-size: 12px;
          line-height: 1.5;
          margin: 0 0 14px;
        }

        .veyid-current-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 11px 12px;
          margin-bottom: 12px;
          background: #0b0b0b;
          border: 1px solid #222222;
          border-radius: 9px;
          font-size: 12px;
          text-transform: capitalize;
        }

        .veyid-current-label {
          color: #666666;
          text-transform: uppercase;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .veyid-action-grid {
          display: grid;
          gap: 8px;
        }

        .veyid-action-button {
          width: 100%;
          min-height: 40px;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.1s ease;
        }

        .veyid-action-button:active {
          transform: translateY(1px);
        }

        .veyid-action-button:disabled {
          cursor: not-allowed;
        }

        .veyid-approve {
          border: none;
          background: #15803d;
          color: #ffffff;
        }

        .veyid-pending {
          border: 1px solid #3b3b3b;
          background: #171717;
          color: #dddddd;
        }

        .veyid-reject {
          border: none;
          background: #b91c1c;
          color: #ffffff;
        }

        .veyid-message {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          background: #0b160e;
          border: 1px solid #174d29;
          color: #72d88d;
          font-size: 11px;
          line-height: 1.4;
        }

        .veyid-error {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          background: #1a0b0b;
          border: 1px solid #5b2020;
          color: #f87171;
          font-size: 11px;
          line-height: 1.4;
        }

        .veyid-review-hint {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid #202020;
          color: #555555;
          font-size: 10px;
          line-height: 1.45;
        }

        .veyid-document-count {
          flex: 0 0 auto;
          color: #777777;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .veyid-documents {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        /*
          DOCUMENT CARD:
          Left = document information
          Right = buttons

          The critical fix is:
          - document-info has flex: 1 1 auto
          - document-text has min-width: 0
          - document-actions has flex: 0 0 auto
          - document-name uses normal word breaking
          
          Therefore SCREENSHOT stays horizontal instead of
          becoming S / C / R / E / E / N / S...
        */
        .veyid-document-card {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          width: 100%;
          min-width: 0;
          padding: 13px 14px;
          background: #0b0b0b;
          border: 1px solid #222222;
          border-radius: 10px;
        }

        .veyid-document-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 11px;
          flex: 1 1 auto;
          min-width: 0;
          width: auto;
        }

        .veyid-document-icon {
          width: 34px;
          height: 34px;
          min-width: 34px;
          flex: 0 0 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #171717;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #aaaaaa;
          font-weight: 800;
        }

        .veyid-document-text {
          display: block;
          flex: 1 1 auto;
          min-width: 0;
          width: auto;
        }

        .veyid-document-type {
          display: block;
          width: 100%;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 3px;
          text-transform: capitalize;
          white-space: normal;
        }

        .veyid-file-name {
          display: block;
          width: 100%;
          color: #cccccc;
          font-size: 11px;
          line-height: 1.35;

          /* Keep words readable */
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: normal;
        }

        .veyid-original-name {
          display: block;
          width: 100%;
          color: #666666;
          font-size: 10px;
          line-height: 1.35;
          margin-top: 3px;
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: normal;
        }

        .veyid-uploaded-at {
          color: #555555;
          font-size: 9px;
          line-height: 1.35;
          margin-top: 3px;
          white-space: normal;
        }

        .veyid-document-actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          flex: 0 0 auto;
          min-width: max-content;
        }

        .veyid-secondary-button,
        .veyid-danger-button {
          flex: 0 0 auto;
          min-width: max-content;
          padding: 7px 10px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
        }

        .veyid-secondary-button {
          border: 1px solid #333333;
          background: #161616;
          color: #dddddd;
        }

        .veyid-danger-button {
          border: 1px solid #7f1d1d;
          background: #1a0b0b;
          color: #f87171;
        }

        .veyid-empty {
          padding: 28px;
          text-align: center;
          color: #666666;
          border: 1px dashed #333333;
          border-radius: 10px;
        }

        .veyid-center-box {
          width: min(600px, 100%);
          margin: 120px auto;
          padding: 30px;
          text-align: center;
          background: #111111;
          border: 1px solid #242424;
          border-radius: 16px;
        }

        /*
          Tablet:
          Keep the identity grid compact, but move the
          decision card below when the screen is narrower.
        */
        @media (max-width: 900px) {
          .veyid-review-grid {
            grid-template-columns: 1fr;
          }

          .veyid-decision-card {
            width: 100%;
          }
        }

        /*
          Mobile:
          Information becomes 2 columns where possible.
          Document card stays horizontal first, and only
          stacks the buttons if the screen is genuinely too narrow.
        */
        @media (max-width: 640px) {
          .veyid-admin-page {
            padding: 14px;
          }

          .veyid-info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .veyid-document-card {
            gap: 10px;
          }

          .veyid-document-actions {
            gap: 5px;
          }

          .veyid-secondary-button,
          .veyid-danger-button {
            padding: 7px 8px;
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .veyid-title {
            font-size: 24px;
          }

          .veyid-info-grid {
            grid-template-columns: 1fr 1fr;
          }

          .veyid-document-card {
            flex-direction: column;
            align-items: stretch;
          }

          .veyid-document-info {
            width: 100%;
          }

          .veyid-document-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .veyid-secondary-button,
          .veyid-danger-button {
            flex: 1 1 0;
          }
        }
      `}</style>

      <div className="veyid-admin-page">
        <div className="veyid-admin-container">

          <div className="veyid-topbar">
            <button
              type="button"
              className="veyid-back-button"
              onClick={() => navigate("/admin")}
            >
              ← Back to Users
            </button>

            <div className="veyid-status">
              {user.verification_status || "pending"}
            </div>
          </div>

          <header className="veyid-header">
            <div className="veyid-brand">VEYID ADMIN</div>

            <h1 className="veyid-title">
              {user.full_name}
            </h1>

            <p className="veyid-subtitle">
              User #{user.id}
              <span className="veyid-dot">•</span>
              {user.veyid || "No VEYID assigned"}
            </p>
          </header>

          <div className="veyid-review-grid">

            {/* USER INFORMATION */}
            <section className="veyid-card">
              <div className="veyid-section-heading">
                <div>
                  <div className="veyid-eyebrow">
                    IDENTITY
                  </div>

                  <h2 className="veyid-card-title">
                    User Information
                  </h2>
                </div>

                <div className="veyid-mini-badge">
                  {user.kyc_type || "basic"} KYC
                </div>
              </div>

              <div className="veyid-info-grid">
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

            {/* VERIFICATION DECISION */}
            <section className="veyid-decision-card">
              <div className="veyid-eyebrow">
                VERIFICATION
              </div>

              <h2 className="veyid-card-title">
                Review Decision
              </h2>

              <p className="veyid-decision-description">
                Review the submitted identity information and
                choose the appropriate verification status.
              </p>

              <div className="veyid-current-status">
                <span className="veyid-current-label">
                  Current Status
                </span>

                <strong>
                  {user.verification_status || "pending"}
                </strong>
              </div>

              <div className="veyid-action-grid">

                <button
                  type="button"
                  className="veyid-action-button veyid-approve"
                  disabled={decisionLoading}
                  onClick={() => handleDecision("approved")}
                  style={{
                    opacity: decisionLoading ? 0.6 : 1,
                  }}
                >
                  {decisionLoading
                    ? "Processing..."
                    : "✓ Approve"}
                </button>

                <button
                  type="button"
                  className="veyid-action-button veyid-pending"
                  disabled={decisionLoading}
                  onClick={() => handleDecision("pending")}
                  style={{
                    opacity: decisionLoading ? 0.6 : 1,
                  }}
                >
                  ⏳ Keep Pending
                </button>

                <button
                  type="button"
                  className="veyid-action-button veyid-reject"
                  disabled={decisionLoading}
                  onClick={() => handleDecision("rejected")}
                  style={{
                    opacity: decisionLoading ? 0.6 : 1,
                  }}
                >
                  ✕ Reject
                </button>

              </div>

              {decisionMessage && (
                <div className="veyid-message">
                  {decisionMessage}
                </div>
              )}

              {decisionError && (
                <div className="veyid-error">
                  {decisionError}
                </div>
              )}

              <div className="veyid-review-hint">
                Approval and rejection decisions are saved to
                the verification workflow.
              </div>
            </section>
          </div>

          {/* DOCUMENTS */}
          <section className="veyid-card">

            <div className="veyid-section-heading">
              <div>
                <div className="veyid-eyebrow">
                  KYC DOCUMENTS
                </div>

                <h2 className="veyid-card-title">
                  Verification Documents
                </h2>
              </div>

              <div className="veyid-document-count">
                {documents.length}{" "}
                {documents.length === 1
                  ? "Document"
                  : "Documents"}
              </div>
            </div>

            {documents.length === 0 ? (
              <div className="veyid-empty">
                No documents uploaded.
              </div>
            ) : (
              <div className="veyid-documents">

                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="veyid-document-card"
                  >

                    {/* LEFT: DOCUMENT DETAILS */}
                    <div className="veyid-document-info">

                      <div className="veyid-document-icon">
                        {document.document_type === "selfie"
                          ? "◉"
                          : "▣"}
                      </div>

                      <div className="veyid-document-text">

                        <div className="veyid-document-type">
                          {document.document_type || "Document"}
                        </div>

                        <div className="veyid-file-name">
                          {document.file_name || "File name unavailable"}
                        </div>

                        <div className="veyid-original-name">
                          Original:{" "}
                          {document.original_name || "—"}
                        </div>

                        <div className="veyid-uploaded-at">
                          Uploaded:{" "}
                          {document.uploaded_at || "—"}
                        </div>

                      </div>
                    </div>

                    {/* RIGHT: ACTIONS */}
                    <div className="veyid-document-actions">

                      <button
                        type="button"
                        className="veyid-secondary-button"
                        onClick={() => openOrDownloadDocument(document.file_name, false)}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className="veyid-secondary-button"
                        onClick={() => openOrDownloadDocument(document.file_name, true)}
                      >
                        Download
                      </button>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: "none" }}
                        id={`replace-input-${document.id}`}
                        onChange={async (e) => {
                          const newFile = e.target.files[0];
                          if (!newFile) return;

                          const newLabel = window.prompt(
                            "Document name/type (edit if needed):",
                            document.document_type
                          );
                          if (newLabel === null) {
                            e.target.value = "";
                            return;
                          }

                          const finalLabel = newLabel.trim() || document.document_type;

                          const confirmed = window.confirm(
                            `Replace "${document.original_name || document.file_name}" with "${newFile.name}" (labeled "${finalLabel}")?`
                          );
                          if (!confirmed) {
                            e.target.value = "";
                            return;
                          }

                          try {
                            const fd = new FormData();
                            fd.append("file", newFile);
                            fd.append("user_id", id);
                            fd.append("document_type", finalLabel);
                            fd.append("document_id", document.id);

                            const response = await adminFetch(
                              "https://veyid-api.info-veyid.workers.dev/admin/document/replace",
                              { method: "POST", body: fd }
                            );
                            const data = await response.json();

                            if (data.success) {
                              setUserDetails((prev) => ({
                                ...prev,
                                documents: prev.documents.map((d) =>
                                  d.id === document.id
                                    ? { ...d, document_type: finalLabel, file_name: data.fileName, original_name: newFile.name }
                                    : d
                                ),
                              }));
                            } else {
                              alert(data.error || "Failed to replace document.");
                            }
                          } catch (err) {
                            console.error("Replace document error:", err);
                            alert("Unable to replace document.");
                          } finally {
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="veyid-danger-button"
                        onClick={() =>
                          window.document.getElementById(`replace-input-${document.id}`).click()
                        }
                      >
                        Replace
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
    <div className="veyid-info-item">
      <div className="veyid-info-label">
        {label}
      </div>

      <div className="veyid-info-value">
        {value || "—"}
      </div>
    </div>
  );
}
