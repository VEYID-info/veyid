import { useState } from "react";


export default function Register() {
  const [step, setStep] = useState(1);
  const [verificationType, setVerificationType] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
const [countryCode, setCountryCode] = useState("+91");
const [nationality, setNationality] = useState("India");
const [dateOfBirth, setDateOfBirth] = useState("");

  const [emailOtp, setEmailOtp] = useState("");
const [emailVerified, setEmailVerified] = useState(false);
const [sendingOtp, setSendingOtp] = useState(false);

const [verifyingOtp, setVerifyingOtp] = useState(false);
const [otpError, setOtpError] = useState("");

const [selfie, setSelfie] = useState(null);
const [document, setDocument] = useState(null);
const [documentType, setDocumentType] = useState("");

const handleSendOtp = async () => {
  if (!email) {
    alert("Please enter your email");
    return;
  }

  setSendingOtp(true);

  try {
    const response = await fetch("https://veyid-api.info-veyid.workers.dev/send-email-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

const data = await response.json();

alert(JSON.stringify(data));

setOtpError("");
setEmailVerified(false);

alert(data.message);
 } catch (error) {
    console.error(error);
    alert(error.message);
  }

  setSendingOtp(false);
};

const handleVerifyOtp = async () => {
  if (!emailOtp) {
    alert("Enter OTP");
    return;
  }

  setVerifyingOtp(true);

  try {
    const response = await fetch(
      "https://veyid-api.info-veyid.workers.dev/verify-email-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: emailOtp,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setEmailVerified(true);
      setOtpError("");
      alert("Email Verified");
    } else {
      setEmailVerified(false);
      setOtpError("Incorrect OTP");
      alert(data.message);
    }
} catch (err) {
  setOtpError("Verification failed. Please try again.");
  alert("Verification failed");
}

  setVerifyingOtp(false);
};

  const handleGetVerified = async () => {
    try {

if (!fullName.trim()) {
  alert("Please enter your full name.");
  return;
}

if (!email.trim()) {
  alert("Please enter your email.");
  return;
}

if (!emailVerified) {
  alert("Please verify your email first.");
  return;
}

if (!dateOfBirth) {
  alert("Please select your date of birth.");
  return;
}

if (!nationality) {
  alert("Please select your nationality.");
  return;
}

if (!mobile.trim()) {
  alert("Please enter your mobile number.");
  return;
}

if (!selfie) {
  alert("Please upload your selfie.");
  return;
}

if (verificationType === "full") {
  if (!documentType) {
    alert("Please select a document type.");
    return;
  }

  if (!document) {
    alert("Please upload your document.");
    return;
  }
}

console.log({
  fullName,
  email,
  dateOfBirth,
  nationality,
  countryCode,
  mobile,
  verificationType,
});

alert(JSON.stringify({
  fullName,
  email,
  dateOfBirth,
  nationality,
  countryCode,
  mobile,
  verificationType,
}));
const response = await fetch("https://veyid-api.info-veyid.workers.dev/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
body: JSON.stringify({
  full_name: fullName,
  email,
  date_of_birth: dateOfBirth,
  nationality,
  country_code: countryCode,
  phone: mobile,
  verification_type: verificationType,
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

<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  disabled={emailVerified}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

<button
  type="button"
  onClick={handleSendOtp}
  disabled={sendingOtp || emailVerified}
style={{
  padding: "6px 10px",
  minWidth: "72px",
  height: "52px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  lineHeight: "1.2",
}}

>
  {emailVerified
    ? "Email Sent"
    : sendingOtp
    ? "Sending..."
    : "Send OTP"}
</button>

</div>

<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
  }}
>
  <input
    type="text"
    placeholder="Enter Email OTP"
    value={emailOtp}
    onChange={(e) => setEmailOtp(e.target.value)}
    disabled={emailVerified}
    style={{
      flex: 1,
      padding: "10px",
    }}
  />

  <button
    type="button"
    onClick={handleVerifyOtp}
    disabled={emailVerified || verifyingOtp}
    style={{
      padding: "10px 16px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#2563eb",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      whiteSpace: "nowrap",
    }}
  >
    {emailVerified
      ? "Verified"
      : verifyingOtp
      ? "Checking..."
      : "Verify"}
  </button>
</div>

{otpError && (

<p
  style={{
    color: "#dc2626",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 12px",
    marginBottom: "15px",
    fontSize: "14px",
    fontWeight: "500",
  }}
>
  ❌ {otpError}
</p>

)}

{emailVerified && (
  <p style={{ color: "green", marginBottom: "15px", fontWeight: "bold" }}>
    ✅ Email Verified
  </p>
)}

<label
  style={{
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
  }}
>
  Date of Birth
</label>

<input
  type="text"
  placeholder="DD / MM / YYYY"
  value={dateOfBirth}
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => {
    if (!e.target.value) e.target.type = "text";
  }}
  onChange={(e) => setDateOfBirth(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxSizing: "border-box",
  }}
/>

<label
  style={{
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
  }}
>
  Nationality
</label>

<select
  value={nationality}
  onChange={(e) => setNationality(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
  }}
>

<option>India</option>
  <option>Nepal</option>
  <option>Sri Lanka</option>
  <option>Bangladesh</option>
  <option>Pakistan</option>
  <option>United States</option>
  <option>United Kingdom</option>
  <option>Australia</option>
  <option>United Arab Emirates</option>
</select>

        
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  }}
>
  <select
    value={countryCode}
    onChange={(e) => setCountryCode(e.target.value)}
    style={{
      width: "110px",
      padding: "10px",
    }}
  >
    <option value="+91">🇮🇳 +91</option>
    <option value="+1">🇺🇸 +1</option>
    <option value="+44">🇬🇧 +44</option>
    <option value="+61">🇦🇺 +61</option>
    <option value="+971">🇦🇪 +971</option>
    <option value="+94">🇱🇰 +94</option>
    <option value="+977">🇳🇵 +977</option>
  </select>

  <input
    type="text"
    placeholder="Mobile Number"
    value={mobile}
    onChange={(e) => setMobile(e.target.value)}
    style={{
      flex: 1,
      padding: "10px",
    }}
  />
</div>


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
