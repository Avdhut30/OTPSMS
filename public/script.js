document.addEventListener('DOMContentLoaded', () => {
  const otpForm = document.getElementById('otpForm');
  const verifyOtpForm = document.getElementById('verifyOtpForm');
  const verificationStatus = document.getElementById('verificationStatus');

  otpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(otpForm);
    const mobile = formData.get('mobile');

    try {
      const response = await fetch('/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobile })
      });

      if (response.ok) {
        otpForm.style.display = 'none'; // Hide OTP request form
        document.getElementById('otpVerification').style.display = 'block'; // Show OTP verification form
        verificationStatus.textContent = ''; // Clear any previous verification status messages
        document.getElementById('mobileVerify').value = mobile; // Set mobile number in hidden input
      } else {
        throw new Error('Failed to request OTP');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
    }
  });

  verifyOtpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(verifyOtpForm);
    const otp = formData.get('otp');
    const mobile = formData.get('mobile'); // Retrieve mobile number from hidden input

    try {
      const response = await fetch('/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otp, mobile }) // Include mobile number in request body
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          verificationStatus.textContent = data.message;
        } else {
          verificationStatus.textContent = "Incorrect OTP. Please try again.";
        }
      } else {
        throw new Error('Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  });
});
