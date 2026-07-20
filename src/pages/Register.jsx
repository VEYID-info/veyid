import { useState } from "react";


export default function Register() {
  const [step, setStep] = useState(1);
  const [verificationType, setVerificationType] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

const [selfie, setSelfie] = useState(null);
const [document, setDocument] = useState(null);
const [documentType, setDocumentType] = useState("");

  const handleGetVerified = async () => {
    try {
      console.log({
        fullName,
        email,
        mobile,
        verificationType,
      });

alert(JSON.stringify({
  fullName,
  email,
  mobile,
  verificationType,
}));
const response = await fetch("http://127.0.0.1:3000/api/get-verified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          mobile,
          verificationType,
        }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "12px",
      }}
    >
      {step === 1 && (
        <>
          <h1>Get Verified</h1>

          <p>Select Verification Type</p>

          <label>
            <input
              type="radio"
              name="type"
              value="basic"
              checked={verificationType === "basic"}
              onChange={() => setVerificationType("basic")}
            />
            {" "}Basic Verification
          </label>

          <br />
          <br />

          <label>
            <input
              type="radio"
              name="type"
              value="full"
              checked={verificationType === "full"}
              onChange={() => setVerificationType("full")}
            />
            {" "}Full KYC Verification
          </label>

          <br />
          <br />

          <button
            type="button"
            disabled={!verificationType}
            onClick={() => setStep(2)}
            style={{
              width: "100%",
              padding: "12px",
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h1>
            {verificationType === "basic"
              ? "Basic Verification"
              : "Full KYC Verification"}
          </h1>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <button
            type="button"
            style={{
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            Send Email OTP
          </button>

          <input
            type="text"
            placeholder="Enter Email OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <label>Upload Selfie</label>
          <br />

<input
  type="file"
  accept="image/*"
  onChange={(e) => setSelfie(e.target.files[0])}
  style={{
    marginBottom: "20px",
  }}
/>
          {verificationType === "full" && (
            <>
<select
  value={documentType}
  onChange={(e) => setDocumentType(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
  }}
>
                <option value="">Select Document</option>
                <option>Aadhaar Card</option>
                <option>PAN Card</option>
                <option>Passport</option>
                <option>Voter ID</option>
                <option>Driving Licence</option>
                <option>School ID Card</option>
                <option>College ID Card</option>
                <option>Government ID Card</option>
              </select>

              <label>Upload Document</label>
              <br />

<input
  type="file"
  accept=".jpg,.jpeg,.png,.pdf"
  onChange={(e) => setDocument(e.target.files[0])}
  style={{
    marginBottom: "20px",
  }}
/>
            </>
          )}

          <button
            type="button"
            onClick={handleGetVerified}
            style={{
              width: "100%",
              padding: "12px",
              cursor: "pointer",
              backgroundColor: "#06b6d4",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Get Verified
          </button>
        </>
      )}
    </div>
  );
}
