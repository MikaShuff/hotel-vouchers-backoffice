import { useState } from "react";
import { sendOtp, verifyOtp } from "../services/authService";
import styles from "./Login.module.css";

function Login({ onLoginSuccess }) {
  const [userName, setUserName] = useState("");
  const [contactMethod, setContactMethod] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

async function handleSendOtp() {
  try {
    setErrorMessage("");

    const emailValue = contactMethod === "email" ? email : null;
    const phoneValue = contactMethod === "phone" ? phoneNumber : null;

    await sendOtp(userName, emailValue, phoneValue);
    setOtpSent(true);
  } catch (error) {
    console.error("Error sending OTP:", error);
    setOtpSent(false);
    setErrorMessage("שגיאה בשליחת קוד האימות. בדקי את הפרטים ונסי שוב.");
  }
}

  async function handleVerifyOtp() {
    try {
      setErrorMessage("");
      const response = await verifyOtp(userName, otpCode);

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage("קוד האימות שגוי. נסי שוב.");
    }
  }

  function handleContactMethodChange(method) {
    setContactMethod(method);
    setOtpSent(false);
    setErrorMessage("");
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <h2 className={styles.title}>כניסה למערכת</h2>


        <input
          className={styles.input}
          type="text"
          placeholder="שם משתמש"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <div className={styles.toggleGroup}>
          <button
            type="button"
            className={
              contactMethod === "phone"
                ? `${styles.toggleButton} ${styles.toggleButtonActive}`
                : styles.toggleButton
            }
            onClick={() => handleContactMethodChange("phone")}
          >
            טלפון
          </button>
          <button
            type="button"
            className={
              contactMethod === "email"
                ? `${styles.toggleButton} ${styles.toggleButtonActive}`
                : styles.toggleButton
            }
            onClick={() => handleContactMethodChange("email")}
          >
            אימייל
          </button>
        </div>

        {contactMethod === "phone" ? (
          <input
            className={styles.input}
            type="tel"
            placeholder="מספר טלפון"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        ) : (
          <input
            className={styles.input}
            type="email"
            placeholder="כתובת אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <button className={styles.buttonSecondary} onClick={handleSendOtp}>
          {otpSent ? "שלח קוד אימות מחדש" : "שלח קוד אימות"}
        </button>

        {otpSent && (
          <div className={styles.successMessage}>
            ✓ קוד אימות נשלח בהצלחה
            {contactMethod === "phone" ? " למספר הטלפון" : " לכתובת האימייל"}
          </div>
        )}

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <div className={styles.divider}></div>

        <input
          className={styles.input}
          type="text"
          placeholder="קוד אימות"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
        />

        <button className={styles.button} onClick={handleVerifyOtp}>
          כניסה
        </button>
      </div>
    </div>
  );
}

export default Login;