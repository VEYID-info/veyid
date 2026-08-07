
import { useState, useRef } from "react";

const spinStyle = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;


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

const [otpSuccess, setOtpSuccess] = useState("");

const [selfie, setSelfie] = useState(null);
const [document, setDocument] = useState(null);
const [documentType, setDocumentType] = useState("");

const selfieInputRef = useRef(null);
const documentInputRef = useRef(null);

const [submitting, setSubmitting] = useState(false);
const [errors, setErrors] = useState({});

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


setOtpError("");
setEmailVerified(false);
setOtpSuccess(data.message);
} catch (error) {
  console.error(error);

  setOtpSuccess("");
  setEmailVerified(false);
  setOtpError("Unable to send OTP. Please try again.");
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
      setOtpSuccess("Email Verified");
   } else {
      setEmailVerified(false);
      setOtpSuccess("");
      setOtpError(data.message);
   }

} catch (err) {
  setOtpSuccess("");
  setOtpError("Verification failed. Please try again.");
}

  setVerifyingOtp(false);
};

  const handleGetVerified = async () => {
    try {

if (submitting) {
  return;
}

setSubmitting(true);

setErrors({});

const newErrors = {};

if (!fullName.trim()) {
  newErrors.fullName = "Please enter your full name.";
}

if (!email.trim()) {
  newErrors.email = "Please enter your email.";
}

if (!emailVerified) {
  newErrors.emailVerified = "Please verify your email first.";
}

if (!dateOfBirth) {
  newErrors.dateOfBirth = "Please select your date of birth.";
}

if (!nationality) {
  newErrors.nationality = "Please select your nationality.";
}

if (!mobile.trim()) {
  newErrors.mobile = "Please enter your mobile number.";
}

if (!selfie) {
  newErrors.selfie = "Please upload your selfie.";
}

if (verificationType === "full") {
if (!documentType) {
  newErrors.documentType = "Please select a document type.";
}
 
if (!document) {
  newErrors.document = "Please upload your document.";
}

if (Object.keys(newErrors).length > 0) {
  setErrors(newErrors);
  setSubmitting(false);
  return;
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

      console.log("Register Status:", response.status);

      console.log("Register Response:", data);

if (!data.success) {
  if (data.message === "Email already registered") {
    alert("This email is already registered. Please log in or use a different email address.");
    return;
  }

  alert(data.message);
  return;
}


if (data.success) {
  const formData = new FormData();

  formData.append("user_id", data.user.id);
  formData.append("document_type", "selfie");
  formData.append("file", selfie);

  await fetch(
    "https://veyid-api.info-veyid.workers.dev/upload-document",
    {
      method: "POST",
      body: formData,
    }
  );

setFullName("");
setEmail("");
setMobile("");
setCountryCode("+91");
setNationality("India");
setDateOfBirth("");

setEmailOtp("");
setEmailVerified(false);
setOtpError("");

setSelfie(null);
setDocument(null);
setDocumentType("");

if (selfieInputRef.current) selfieInputRef.current.value = "";
if (documentInputRef.current) documentInputRef.current.value = "";


setVerificationType("");
setStep(1);

alert("Verification request submitted successfully.");

}

} catch (error) {
  console.error(error);

  alert(
    "Something went wrong. Please check your internet connection and try again."
  );
} finally {
  setSubmitting(false);
}
  };

  return (

<>
  <style>{spinStyle}</style>

    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "12px",
      }}
    >

{submitting && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(255,255,255,0.35)",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      pointerEvents: "all",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "42px",
          height: "42px",
          border: "4px solid #d1d5db",
          borderTop: "4px solid #2563eb",
          borderRadius: "50%",
          margin: "0 auto 12px",
          animation: "spin 1s linear infinite",
 }}
      />
      Loading...
    </div>
  </div>
)}

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
  onChange={(e) => {
    setFullName(e.target.value);

    setErrors((prev) => ({
      ...prev,
      fullName: "",
    }));
  }}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
  }}
/>

{errors.fullName && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "-10px",
      marginBottom: "15px",
    }}
  >
    {errors.fullName}
  </p>
)}

<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

<input
  type="email"
  placeholder="Email"
  value={email}
onChange={(e) => {
  setEmail(e.target.value);

  setErrors((prev) => ({
    ...prev,
    email: "",
    emailVerified: "",
  }));
}}
  disabled={emailVerified}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

{errors.email && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "-10px",
      marginBottom: "15px",
    }}
  >
    {errors.email}
  </p>
)}

{errors.emailVerified && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "-10px",
      marginBottom: "15px",
    }}
  >
    {errors.emailVerified}
  </p>
)}

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

{otpSuccess && (
  <p
    style={{
      color: "#166534",
      background: "#dcfce7",
      border: "1px solid #86efac",
      borderRadius: "8px",
      padding: "10px 12px",
      marginBottom: "15px",
      fontSize: "14px",
      fontWeight: "500",
    }}
  >
    ✅ {otpSuccess}
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
onChange={(e) => {
  setDateOfBirth(e.target.value);

  setErrors((prev) => ({
    ...prev,
    dateOfBirth: "",
  }));
}}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxSizing: "border-box",
  }}
/>

{errors.dateOfBirth && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "-10px",
      marginBottom: "15px",
    }}
  >
    {errors.dateOfBirth}
  </p>
)}

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
onChange={(e) => {
  setNationality(e.target.value);

  setErrors((prev) => ({
    ...prev,
    nationality: "",
  }));
}}
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


{errors.nationality && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "-10px",
      marginBottom: "15px",
    }}
  >
    {errors.nationality}
  </p>
)}
        
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
onChange={(e) => {
  setMobile(e.target.value);

  setErrors((prev) => ({
    ...prev,
    mobile: "",
  }));
}}
    style={{
      flex: 1,
      padding: "10px",
    }}
  />
</div>

{errors.mobile && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "-10px",
      marginBottom: "15px",
    }}
  >
    {errors.mobile}
  </p>
)}


          <label>Upload Selfie</label>
          <br />

<input
  type="file"
  ref={selfieInputRef}  
  accept="image/*"
onChange={(e) => {
  setSelfie(e.target.files[0]);

  setErrors((prev) => ({
    ...prev,
    selfie: "",
  }));
}}
  style={{
    marginBottom: "20px",
  }}
/>
  
{errors.selfie && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "-10px",
      marginBottom: "15px",
    }}
  >
    {errors.selfie}
  </p>
)}
  
      {verificationType === "full" && (
            <>
<select
  value={documentType}
onChange={(e) => {
  setDocumentType(e.target.value);

  setErrors((prev) => ({
    ...prev,
    documentType: "",
  }));
}}
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

{errors.documentType && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "-10px",
      marginBottom: "15px",
    }}
  >
    {errors.documentType}
  </p>
)}

  
            <label>Upload Document</label>
              <br />

<input
  type="file"
  ref={documentInputRef}  
  accept=".jpg,.jpeg,.png,.pdf"
onChange={(e) => {
  setDocument(e.target.files[0]);

  setErrors((prev) => ({
    ...prev,
    document: "",
  }));
}}
  style={{
    marginBottom: "20px",
  }}
/>

{errors.document && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "-10px",
      marginBottom: "15px",
    }}
  >
    {errors.document}
  </p>
)}


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
  </>
);
}
