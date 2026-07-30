require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

const express = require("express");
const cors = require("cors");
const { db, initDB } = require("./db");
const multer = require("multer");
const path = require("path");

const app = express();

const defaultClient = SibApiV3Sdk.ApiClient.instance;

defaultClient.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "selfie") {
      cb(null, "uploads/selfies");
    } else {
      cb(null, "uploads/documents");
    }
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

initDB();

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("VEYID Backend Running 🚀");
});

// Get all verification requests
app.get("/api/verifications", async (req, res) => {
  try {
    await db.read();

    res.json({
      success: true,
      verifications: db.data.verifications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Create verification request
app.post("/api/get-verified", async (req, res) => {
  console.log("BODY:", req.body);

  try {
    await db.read();

    const verification = {
      id: Date.now(),
      ...req.body,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    db.data.verifications.push(verification);

    await db.write();

    res.json({
      success: true,
      message: "Verification request received successfully!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Approve verification
app.put("/api/verifications/:id/approve", async (req, res) => {
  try {
    await db.read();

    const verification = db.data.verifications.find(
      (v) => v.id == req.params.id
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found",
      });
    }

    verification.status = "Approved";

    await db.write();

    res.json({
      success: true,
      message: "Verification approved",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Reject verification
app.put("/api/verifications/:id/reject", async (req, res) => {
  try {
    await db.read();

    const verification = db.data.verifications.find(
      (v) => v.id == req.params.id
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found",
      });
    }

    verification.status = "Rejected";

    await db.write();

    res.json({
      success: true,
      message: "Verification rejected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.post("/api/send-email-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const emailData = {
      sender: {
        name: "VEYID",
        email: "info.veyid@gmail.com",
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "Your VEYID Verification OTP",
      htmlContent: `
        <h2>VEYID Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    };

otpStore[email] = otp;

const result = await apiInstance.sendTransacEmail(emailData);
console.log(result);

    res.json({
      success: true,
      otp,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

let otpStore = {};

app.post("/api/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  if (otpStore[email] === otp) {
    delete otpStore[email];

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  }

  return res.json({
    success: false,
    message: "Incorrect OTP",
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

