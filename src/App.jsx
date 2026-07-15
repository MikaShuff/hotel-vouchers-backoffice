import Navigator from "./components/Navigator";
import Workspace from "./components/Workspace";
import "./App.css";

function App() {
  return (
    <div className="app-container">

      <header className="header">
        ממשק ניהול תו הזהב למלונות
      </header>

      <div className="main-content">
        <Navigator />
        <Workspace />
      </div>

    </div>
  );
}

export default App;