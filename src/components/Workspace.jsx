import { useEffect, useState } from "react";
import { getOrganization } from "../services/organizationService";
import { getUsers } from "../services/userService";
import Dashboard from "./Dashboard";

function Workspace({ selectedPage }) {
  const [organization, setOrganization] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchOrganization() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrganization();
      console.log("API RESPONSE:", data);
      setOrganization(data);
    } catch (error) {
      console.error("Error fetching organization:", error);
      setError("שגיאה בטעינת נתוני הארגון מהשרת");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    const data = await getUsers();
    console.log("USERS:", data);

    setUsers(data);
  }

  useEffect(() => {
    
    if (selectedPage === "ארגונים") {
      fetchOrganization();
    }

    if (selectedPage === "משתמשי מערכת") {
      fetchUsers();
    }
  }, [selectedPage]);

  if (selectedPage === "Dashboard") {
    return (
      <div className="workspace">
        <Dashboard />
      </div>
    );
  }

  if (selectedPage === "משתמשי מערכת") {
    return (
      <div className="workspace">
        <h2>משתמשי מערכת</h2>

        {loading && <p>טוען נתונים...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>מזהה</th>
                <th>שם משתמש</th>
                <th>תפקיד</th>
                <th>ארגון</th>
                <th>סניף</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.userName}</td>
                  <td>{user.role}</td>
                  <td>{user.organizationId ?? "-"}</td>
                  <td>{user.branchId ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  if (selectedPage != "ארגונים") {
    return (
      <div className="workspace">
        <h2>{selectedPage}</h2>
        <p>זה מסך {selectedPage}</p>
      </div>
    );
  }

  return (
    <div className="workspace">
      <h2>ארגונים</h2>
      {loading && <p>טוען נתונים...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <table className="data-table">
          <thead>
            <tr>
              <th>מזהה</th>
              <th>שם לקוח</th>
              <th>סטטוס</th>
            </tr>
          </thead>

          <tbody>
            {organization.map((organization) => (
              <tr key={organization.id}>
                <td>{organization.id}</td>
                <td>{organization.name}</td>
                <td>{organization.isActive ? "פעיל" : "לא פעיל"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Workspace;
