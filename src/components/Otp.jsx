// Otp.jsx

import { createElement, useState } from "react";
import { verifyOtp } from "../services/authService";
import styles from "./Login.module.css";
import appLogo from "../assets/app.png";

function Otp({ onLoginSuccess, onBackToLogin }) {
  const [otpCode, setOtpCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  async function handleVerifyOtp() {
    const userName = sessionStorage.getItem("userName");
    const trimmedOtpCode = otpCode.trim();

    setErrorMessage("");

    if (!userName) {
      setErrorMessage(
        "שם המשתמש לא נמצא. חזרי למסך הכניסה ושלחי קוד אימות חדש.",
      );
      return;
    }

    if (!trimmedOtpCode) {
      setErrorMessage("יש להזין קוד אימות.");
      return;
    }

    try {
      setIsVerifying(true);

      const response = await verifyOtp(userName, trimmedOtpCode);

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      sessionStorage.removeItem("userName");

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      setErrorMessage("קוד האימות שגוי או שפג תוקפו. נסי שוב.");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleBackToLogin() {
    sessionStorage.removeItem("userName");

    if (onBackToLogin) {
      onBackToLogin();
    }
  }

  const logoImage = createElement("img", {
    src: appLogo,
    alt: "לוגו המערכת",
    className: styles.cornerLogo,
  });

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <h2 className={styles.title}>הזנת קוד אימות</h2>

        <p className={styles.subtitle}>הזיני את קוד האימות שנשלח אלייך</p>

        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="קוד אימות"
          value={otpCode}
          onChange={(event) => setOtpCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !isVerifying) {
              handleVerifyOtp();
            }
          }}
          disabled={isVerifying}
          autoFocus
        />

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <button
          type="button"
          className={styles.button}
          onClick={handleVerifyOtp}
          disabled={isVerifying}
        >
          {isVerifying ? "מאמת קוד..." : "כניסה"}
        </button>

        <button
          type="button"
          className={styles.buttonSecondary}
          onClick={handleBackToLogin}
          disabled={isVerifying}
        >
          חזרה למסך הכניסה
        </button>
      </div>

      <img src={appLogo} alt="לוגו המערכת" className={styles.cornerLogo} />
    </div>
  );
}

export default Otp;
