// Login.jsx

import { useState } from "react";
import { sendOtp } from "../services/authService";
import styles from "./Login.module.css";
import appLogo from "../assets/app.png";

function Login({ onOtpSent }) {
  const [userName, setUserName] = useState("");
  const [contactMethod, setContactMethod] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSendOtp() {
    try {
      setErrorMessage("");
      setIsSending(true);

      const emailValue =
        contactMethod === "email" ? email.trim() : null;

      const phoneValue =
        contactMethod === "phone" ? phoneNumber.trim() : null;

      await sendOtp(userName.trim(), emailValue, phoneValue);

      sessionStorage.setItem("userName", userName.trim());

      if (onOtpSent) {
        onOtpSent();
      }
    } catch (error) {
      console.error("Error sending OTP:", error);

      setErrorMessage(
        "שגיאה בשליחת קוד האימות. בדקי את הפרטים ונסי שוב."
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleContactMethodChange(method) {
    setContactMethod(method);
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
          onChange={(event) => setUserName(event.target.value)}
          disabled={isSending}
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
            disabled={isSending}
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
            disabled={isSending}
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
            onChange={(event) => setPhoneNumber(event.target.value)}
            disabled={isSending}
          />
        ) : (
          <input
            className={styles.input}
            type="email"
            placeholder="כתובת אימייל"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSending}
          />
        )}

        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

        <button
          type="button"
          className={styles.buttonSecondary}
          onClick={handleSendOtp}
          disabled={isSending}
        >
          {isSending ? "שולח קוד אימות..." : "שלח קוד אימות"}
        </button>
      </div>

           <img src={appLogo} alt="לוגו המערכת" className={styles.cornerLogo} />

    </div>
  );
}

export default Login;
