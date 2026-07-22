import { useEffect, useState } from "react";
import {
  getBranches,
  createBranch,
  updateBranch,
  activateBranch,
  deactivateBranch,
} from "../services/branchService";
import UsersPage from "./UsersPage";

function BranchesPage({ organization, onBack }) {
  const [branches, setBranches] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [selectedBranchForUsers, setSelectedBranchForUsers] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    terminalUniqueIdentifier: "",
    maxWithdrawAmount: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    terminalUniqueIdentifier: "",
    updateMaxWithdrawAmount: false,
    maxWithdrawAmount: "",
  });

  async function fetchBranches() {
    try {
      const data = await getBranches();

      const filtered = data.filter(
        (branch) => branch.organizationId === organization.id,
      );

      setBranches(filtered);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  }

  useEffect(() => {
    fetchBranches();
  }, [organization.id]);

  async function handleCreateBranch() {
    try {
      await createBranch(
        createForm.name,
        organization.id,
        createForm.terminalUniqueIdentifier,
        createForm.maxWithdrawAmount === ""
          ? null
          : Number(createForm.maxWithdrawAmount),
      );

      await fetchBranches();

      setShowCreateForm(false);

      setCreateForm({
        name: "",
        terminalUniqueIdentifier: "",
        maxWithdrawAmount: "",
      });
    } catch (error) {
      console.error("Error creating branch:", error);
      alert("שגיאה ביצירת הסניף");
    }
  }

  function handleEdit(branch) {
    setEditingBranchId(branch.id);

    setEditForm({
      name: branch.name,
      terminalUniqueIdentifier: branch.terminalUniqueIdentifier ?? "",
      updateMaxWithdrawAmount: false,
      maxWithdrawAmount: branch.maxWithdrawAmount ?? "",
    });
  }

  function handleCancelEdit() {
    setEditingBranchId(null);

    setEditForm({
      name: "",
      terminalUniqueIdentifier: "",
      updateMaxWithdrawAmount: false,
      maxWithdrawAmount: "",
    });
  }

  async function handleUpdateBranch(id) {
    try {
      await updateBranch(
        id,
        editForm.name,
        editForm.terminalUniqueIdentifier,
        editForm.updateMaxWithdrawAmount,
        editForm.maxWithdrawAmount === ""
          ? null
          : Number(editForm.maxWithdrawAmount),
      );

      await fetchBranches();
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating branch:", error);
      alert("שגיאה בעדכון הסניף");
    }
  }

  async function handleToggleBranchStatus(branch) {
    try {
      if (branch.isActive) {
        await deactivateBranch(branch.id);
      } else {
        await activateBranch(branch.id);
      }

      await fetchBranches();
    } catch (error) {
      console.error("Error changing branch status:", error);
      alert("שגיאה בשינוי סטטוס הסניף");
    }
  }

  if (selectedBranchForUsers) {
    return (
      <UsersPage
        organization={organization}
        branch={selectedBranchForUsers}
        onBack={() => setSelectedBranchForUsers(null)}
      />
    );
  }

  return (
    <div>
      <div className="breadcrumb">
        <button onClick={onBack} className="link-button">
          ← ארגונים
        </button>
        <span> / </span>
        <span>{organization.name}</span>
        <span> / סניפים</span>
      </div>

      <h2>סניפי {organization.name}</h2>

      <button onClick={() => setShowCreateForm(true)}>הוסף סניף</button>

      {showCreateForm && (
        <div className="create-branch-form">
          <h3>הוספת סניף</h3>

          <input
            type="text"
            placeholder="שם סניף"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                name: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="מזהה מסוף"
            value={createForm.terminalUniqueIdentifier}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                terminalUniqueIdentifier: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="סכום משיכה מקסימלי"
            value={createForm.maxWithdrawAmount}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                maxWithdrawAmount: e.target.value,
              })
            }
          />

          <button onClick={handleCreateBranch}>שמור</button>

          <button
            onClick={() => {
              setShowCreateForm(false);
              setCreateForm({
                name: "",
                terminalUniqueIdentifier: "",
                maxWithdrawAmount: "",
              });
            }}
          >
            ביטול
          </button>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>מזהה</th>
            <th>שם סניף</th>
            <th>מזהה מסוף</th>
            <th>סכום משיכה מקסימלי</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>

        <tbody>
          {branches.map((branch) => (
            <tr key={branch.id}>
              <td>{branch.id}</td>

              <td>
                {editingBranchId === branch.id ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  branch.name
                )}
              </td>

              <td>
                {editingBranchId === branch.id ? (
                  <input
                    type="text"
                    value={editForm.terminalUniqueIdentifier}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        terminalUniqueIdentifier: e.target.value,
                      })
                    }
                  />
                ) : (
                  (branch.terminalUniqueIdentifier ?? "-")
                )}
              </td>

              <td>
                {editingBranchId === branch.id ? (
                  <input
                    type="number"
                    value={editForm.maxWithdrawAmount}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        maxWithdrawAmount: e.target.value,
                        updateMaxWithdrawAmount: true,
                      })
                    }
                  />
                ) : (
                  (branch.maxWithdrawAmount ?? "-")
                )}
              </td>

              <td>{branch.isActive ? "פעיל" : "לא פעיל"}</td>

              <td>
                {editingBranchId === branch.id ? (
                  <>
                    <button onClick={() => handleUpdateBranch(branch.id)}>
                      שמור
                    </button>

                    <button onClick={handleCancelEdit}>ביטול</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(branch)}>ערוך</button>

                    {branch.isActive ? (
                      <button onClick={() => handleToggleBranchStatus(branch)}>
                        השבת
                      </button>
                    ) : (
                      <button onClick={() => handleToggleBranchStatus(branch)}>
                        הפעל
                      </button>
                    )}
                  </>
                )}

                <button onClick={() => setSelectedBranchForUsers(branch)}>
                  משתמשים
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BranchesPage;
