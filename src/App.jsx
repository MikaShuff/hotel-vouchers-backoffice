import { useState } from "react";
import Navigator from "./components/Navigator";
import Workspace from "./components/Workspace";
import "./App.css";
import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";

function App() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
