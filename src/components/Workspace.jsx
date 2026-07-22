import Dashboard from "./Dashboard";
import OrganizationsPage from "../pages/OrganizationsPage";
import UsersPage from "../pages/UsersPage";

function Workspace({ selectedPage }) {
  if (selectedPage === "Dashboard") {
    return (
      <div className="workspace">
        <Dashboard />
      </div>
    );
  }

  if (selectedPage === "ארגונים") {
    return (
      <div className="workspace">
        <OrganizationsPage />
      </div>
    );
  }

  if (selectedPage === "משתמשי מערכת") {
    return (
      <div className="workspace">
        <UsersPage />
      </div>
    );
  }

  return (
    <div className="workspace">
      <h2>{selectedPage}</h2>
      <p>זה מסך {selectedPage}</p>
    </div>
  );
}

export default Workspace;