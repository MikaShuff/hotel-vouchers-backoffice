import { useState } from "react";
import { sendOtp, verifyOtp } from "../services/authService";

function Login({ onLoginSuccess }) {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");

  async function handleSendOtp() {

    await sendOtp(userName, phoneNumber);
  }

  async function handleVerifyOtp() {
    const response = await verifyOtp(userName, otpCode);

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  }

  return (
    <div className="login-container">
      <h2>כניסה למערכת</h2>

      <input
        type="text"
        placeholder="שם משתמש"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <input
        type="text"
        placeholder="טלפון"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <button onClick={handleSendOtp}>שלח קוד אימות</button>
      <input
        type="text"
        placeholder="קוד אימות"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
      />

      <button onClick={handleVerifyOtp}>אמת קוד אימות</button>
    </div>
  );
}

export default Login;
