// server.js
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Initialize Twilio client
const accountSid = "ACd491dd7d2f9fdbd1747a9b89bd0f3e6d";
const authToken = "1483b26034bb27cf4d7728c947440bc1";
const verifySid = "VA33fa9b446edff3438dc7dc8b60957f32"; // Replace 'your_verify_service_sid' with your actual Verify service SID
const client = require("twilio")(accountSid, authToken);

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Generate OTP and send SMS
app.post("/send-otp", (req, res) => {
  const { mobile } = req.body;

  client.verify.services(verifySid)
    .verifications.create({ to: `+${mobile}`, channel: 'sms' }) // Ensure mobile number is prefixed with '+'
    .then(verification => {
      console.log(`OTP sent to +${mobile}`);
      res.json({ success: true, message: "OTP sent successfully" });
    })
    .catch(error => {
      console.error("Error sending OTP:", error);
      res.status(500).json({ success: false, error: "Failed to send OTP" });
    });
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { otp, mobile } = req.body;

  client.verify.services(verifySid)
    .verificationChecks.create({ to: `+${mobile}`, code: otp }) // Ensure mobile number is prefixed with '+'
    .then(verification_check => {
      if (verification_check.status === "approved") {
        res.json({ success: true, message: "OTP verified successfully" });
      } else {
        res.status(400).json({ success: false, error: "Invalid OTP" });
      }
    })
    .catch(error => {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ success: false, error: "Failed to verify OTP" });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
