import { useEffect, useState } from "react";
import {
  getUsers,
  updateUser,
  activateUser,
  deactivateUser,
  blockUser,
  unblockUser,
} from "../services/userService";
import { getOrganization } from "../services/organizationService";
import { getBranches } from "../services/branchService";

function UsersPage({ organization, branch, onBack }) {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    userName: "",
    roleId: "",
    branchId: "",
    organizationId: "",
    phone: "",
    email: "",
  });
  const [organizations, setOrganizations] = useState([]);
  const [branches, setBranches] = useState([]);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      let filtered = data;

      if (branch) {
        filtered = filtered.filter((user) => user.branchId === branch.id);
      } else if (organization) {
        filtered = filtered.filter(
          (user) => user.organizationId === organization.id,
        );
      }

      setUsers(filtered);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    async function loadAll() {
      try {
        const [usersData, orgsData, branchesData] = await Promise.all([
          getUsers(),
          getOrganization(),
          getBranches(),
        ]);

        let filteredUsers = usersData;

        if (branch) {
          filteredUsers = filteredUsers.filter(
            (user) => user.branchId === branch.id,
          );
        } else if (organization) {
          filteredUsers = filteredUsers.filter(
            (user) => user.organizationId === organization.id,
          );
        }

        setUsers(filteredUsers);
        setOrganizations(orgsData);
        setBranches(branchesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadAll();
  }, [organization?.id, branch?.id]);

  function getOrganizationName(organizationId) {
    if (!organizationId) return "-";
    const org = organizations.find((o) => o.id === organizationId);
    return org ? org.name : `#${organizationId}`;
  }

  function getBranchName(branchId) {
    if (!branchId) return "-";
    const br = branches.find((b) => b.id === branchId);
    return br ? br.name : `#${branchId}`;
  }

  function handleEdit(user) {
    setEditingUserId(user.id);
    setEditForm({
      userName: user.userName ?? "",
      roleId: user.roleId ?? "",
      branchId: user.branchId ?? "",
      organizationId: user.organizationId ?? "",
      phone: user.phone ?? "",
      email: user.email ?? "",
    });
  }

  function handleCancelEdit() {
    setEditingUserId(null);
    setEditForm({
      userName: "",
      roleId: "",
      branchId: "",
      organizationId: "",
      phone: "",
      email: "",
    });
  }

  async function handleUpdateUser(id) {
    try {
      await updateUser(
        id,
        editForm.userName,
        editForm.roleId === "" ? null : Number(editForm.roleId),
        editForm.branchId === "" ? null : Number(editForm.branchId),
        editForm.organizationId === "" ? null : Number(editForm.organizationId),
        editForm.phone,
        editForm.email,
      );
      await fetchUsers();
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("שגיאה בעדכון המשתמש");
    }
  }

  async function handleToggleUserStatus(user) {
    try {
      if (user.isActive) {
        await deactivateUser(user.id);
      } else {
        await activateUser(user.id);
      }
      await fetchUsers();
    } catch (error) {
      console.error("Error changing user status:", error);
      alert("שגיאה בשינוי סטטוס המשתמש");
    }
  }

  async function handleToggleUserBlock(user) {
    try {
      if (user.lockedUntil) {
        await unblockUser(user.id);
      } else {
        const oneHourLater = new Date();
        oneHourLater.setHours(oneHourLater.getHours() + 1);
        await blockUser(user.id, oneHourLater.toISOString());
      }
      await fetchUsers();
    } catch (error) {
      console.error("Error changing user block:", error);
      alert("שגיאה בשינוי חסימת המשתמש");
    }
  }

  function renderBreadcrumb() {
    if (branch && organization) {
      return (
        <div className="breadcrumb">
          <button onClick={onBack} className="link-button">
            ← סניפים
          </button>
          <span>/</span>
          <span>{organization.name}</span>
          <span>/</span>
          <span>{branch.name}</span>
          <span>/</span>
          <span>משתמשים</span>
        </div>
      );
    }

    if (organization) {
      return (
        <div className="breadcrumb">
          <button onClick={onBack} className="link-button">
            ← ארגונים
          </button>
          <span>/</span>
          <span>{organization.name}</span>
          <span>/</span>
          <span>משתמשים</span>
        </div>
      );
    }

    return null;
  }

  function renderTitle() {
    if (branch) return `משתמשי ${branch.name}`;
    if (organization) return `משתמשי ${organization.name}`;
    return "משתמשי מערכת";
  }

  return (
    <div>
      {renderBreadcrumb()}

      <h2>{renderTitle()}</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>מזהה</th>
            <th>שם משתמש</th>
            <th>תפקיד</th>
            <th>ארגון</th>
            <th>סניף</th>
            <th>טלפון</th>
            <th>אימייל</th>
            <th>סטטוס</th>
            <th>חסימה</th>
            <th>פעולות</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>

              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editForm.userName}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        userName: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.userName
                )}
              </td>

              <td>
                {editingUserId === user.id ? (
                  <input
                    type="number"
                    value={editForm.roleId}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        roleId: e.target.value,
                      })
                    }
                  />
                ) : (
                  (user.role ?? user.roleId ?? "-")
                )}
              </td>

              <td>
                {editingUserId === user.id ? (
                  <input
                    type="number"
                    value={editForm.organizationId}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        organizationId: e.target.value,
                      })
                    }
                  />
                ) : (
                  getOrganizationName(user.organizationId)
                )}
              </td>

              <td>
                {editingUserId === user.id ? (
                  <input
                    type="number"
                    value={editForm.branchId}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        branchId: e.target.value,
                      })
                    }
                  />
                ) : (
                  getBranchName(user.branchId)
                )}
              </td>

              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phone: e.target.value,
                      })
                    }
                  />
                ) : (
                  (user.phone ?? "-")
                )}
              </td>

              <td>
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  (user.email ?? "-")
                )}
              </td>

              <td>{user.isActive ? "פעיל" : "לא פעיל"}</td>

              <td>{user.lockedUntil ? "חסום" : "-"}</td>

              <td>
                {editingUserId === user.id ? (
                  <>
                    <button onClick={() => handleUpdateUser(user.id)}>
                      שמור
                    </button>
                    <button onClick={handleCancelEdit}>ביטול</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>ערוך</button>

                    {user.isActive ? (
                      <button onClick={() => handleToggleUserStatus(user)}>
                        השבת
                      </button>
                    ) : (
                      <button onClick={() => handleToggleUserStatus(user)}>
                        הפעל
                      </button>
                    )}

                    {user.lockedUntil ? (
                      <button onClick={() => handleToggleUserBlock(user)}>
                        שחרר חסימה
                      </button>
                    ) : (
                      <button onClick={() => handleToggleUserBlock(user)}>
                        חסום שעה
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;
