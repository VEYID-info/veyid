import { useEffect, useState } from "react";

export default function Admin() {
  const [verifications, setVerifications] = useState([]);

  const loadVerifications = () => {
    fetch("/api/verifications")
      .then((res) => res.json())
      .then((data) => {
        setVerifications(data.verifications || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  const approveVerification = async (id) => {
    await fetch(`/api/verifications/${id}/approve`, {
      method: "PUT",
    });

    loadVerifications();
  };

  const rejectVerification = async (id) => {
    await fetch(`/api/verifications/${id}/reject`, {
      method: "PUT",
    });

    loadVerifications();
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px" }}>
      <h1>VEYID Admin Panel</h1>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {verifications.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.fullName}</td>
              <td>{item.email}</td>
              <td>{item.mobile}</td>
              <td>{item.verificationType}</td>
              <td>{item.status}</td>

              <td>
                <button
                  onClick={() => approveVerification(item.id)}
                  style={{
                    marginRight: "10px",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => rejectVerification(item.id)}
                  style={{
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  ❌ Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
