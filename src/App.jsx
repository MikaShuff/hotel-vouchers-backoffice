import { useState, useEffect } from "react";
import { refreshToken, logout } from "./services/authService";
import Navigator from "./components/Navigator";
import Workspace from "./components/Workspace";
import styles from "./App.module.css";
import Login from "./components/Login";

function App() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      } catch {
        localStorage.clear();
        setIsAuthenticated(false);
      }
    }

    validateSession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const interval = setInterval(
      async () => {
        try {
          const response = await refreshToken();
          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("refreshToken", response.refreshToken);
          console.log("Token refreshed");
        } catch {
          localStorage.clear();
          setIsAuthenticated(false);
        }
      },
      14 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.clear();
      setIsAuthenticated(false);
    }
  }

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <span>ממשק ניהול תו הזהב למלונות</span>

        {isAuthenticated && (
          <button onClick={handleLogout} className={styles.logoutButton}>
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
          <Login onLoginSuccess={() => setIsAuthenticated(true)} />
        )}
      </div>
    </div>
  );
}

export default App;