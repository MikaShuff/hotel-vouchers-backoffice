import { useState, useEffect } from "react";
import { refreshToken } from "./services/authService";
import Navigator from "./components/Navigator";
import Workspace from "./components/Workspace";
import "./App.css";
import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";

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

  return (
    <div className="app-container">
      <header className="header">ממשק ניהול תו הזהב למלונות</header>

      <div className="main-content">
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
