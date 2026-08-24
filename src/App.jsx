import { useEffect, useState } from "react";
import { refreshToken, logout } from "./services/authService";
import Navigator from "./components/Navigator";
import Workspace from "./components/Workspace";
import Login from "./components/Login";
import Otp from "./components/Otp";
import styles from "./App.module.css";
import headerLogo from "./assets/logo-zahavt.png";

function App() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginStep, setLoginStep] = useState("login");

  useEffect(() => {
    async function validateSession() {
      const savedRefreshToken = localStorage.getItem("refreshToken");

      if (!savedRefreshToken) {
        return;
      }

      try {
        const response = await refreshToken();

        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Session validation failed:", error);
        localStorage.clear();
        sessionStorage.clear();
        setIsAuthenticated(false);
        setLoginStep("login");
      }
    }

    validateSession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await refreshToken();

        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        console.log("Token refreshed");
      } catch (error) {
        console.error("Token refresh failed:", error);

        localStorage.clear();
        sessionStorage.clear();
        setIsAuthenticated(false);
        setLoginStep("login");
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  function handleLoginSuccess() {
    sessionStorage.clear();
    setIsAuthenticated(true);
    setLoginStep("login");
  }

  function handleBackToLogin() {
    sessionStorage.clear();
    setLoginStep("login");
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setIsAuthenticated(false);
      setLoginStep("login");
      setSelectedPage("Dashboard");
    }
  }

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.headerRight}>
          <img src={headerLogo} alt="לוגו המערכת" className={styles.headerLogo} />

          <span>ממשק ניהול תו הזהב למלונות</span>
        </div>

        {isAuthenticated && (
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            התנתקות
          </button>
        )}
      </header>

      <div className={styles.mainContent}>
        {isAuthenticated ? (
          <>
            <Navigator
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />

            <Workspace selectedPage={selectedPage} />
          </>
        ) : (
          <>
            {loginStep === "login" && (
              <Login onOtpSent={() => setLoginStep("otp")} />
            )}

            {loginStep === "otp" && (
              <Otp
                onLoginSuccess={handleLoginSuccess}
                onBackToLogin={handleBackToLogin}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;