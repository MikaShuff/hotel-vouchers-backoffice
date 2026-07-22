import Dashboard from "./Dashboard";
import OrganizationsPage from "../pages/OrganizationsPage";
import UsersPage from "../pages/UsersPage";
import styles from "./Workspace.module.css";

function Workspace({ selectedPage }) {
  if (selectedPage === "Dashboard") {
    return (
      <div className={styles.workspace}>
        <Dashboard />
      </div>
    );
  }

  if (selectedPage === "ארגונים") {
    return (
      <div className={styles.workspace}>
        <OrganizationsPage />
      </div>
    );
  }

  if (selectedPage === "משתמשי מערכת") {
    return (
      <div className={styles.workspace}>
        <UsersPage />
      </div>
    );
  }

  return (
    <div className={styles.workspace}>
      <h2>{selectedPage}</h2>
      <p className={styles.placeholder}>זה מסך {selectedPage}</p>
    </div>
  );
}

export default Workspace;