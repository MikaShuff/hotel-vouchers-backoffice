import { useEffect, useState } from "react";
import {
  getBranches,
  updateBranch,
  activateBranch,
  deactivateBranch,
} from "../services/branchService";
import CreateBranchForm from "../forms/CreateBranchForm";
import UsersPage from "./UsersPage";

function BranchesPage({ organization, onBack }) {
  const [branches, setBranches] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [selectedBranchForUsers, setSelectedBranchForUsers] = useState(null);
  const [editErrorMessage, setEditErrorMessage] = useState("");

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

  function handleEdit(branch) {
    setEditErrorMessage("");

    setEditingBranchId(branch.id);

    setEditForm({
      name: branch.name,
      terminalUniqueIdentifier: branch.terminalUniqueIdentifier ?? "",
      updateMaxWithdrawAmount: false,
      maxWithdrawAmount: branch.maxWithdrawAmount ?? "",
    });
  }

  function handleCancelEdit() {
    setEditErrorMessage("");

    setEditingBranchId(null);

    setEditForm({
      name: "",
      terminalUniqueIdentifier: "",
      updateMaxWithdrawAmount: false,
      maxWithdrawAmount: "",
    });
  }

  async function handleUpdateBranch(id) {
    setEditErrorMessage("");

    const maxWithdrawAmountNumber =
      editForm.maxWithdrawAmount === ""
        ? null
        : Number(editForm.maxWithdrawAmount);

    if (
      maxWithdrawAmountNumber !== null &&
      (Number.isNaN(maxWithdrawAmountNumber) || maxWithdrawAmountNumber < 0)
    ) {
      setEditErrorMessage("סכום המשיכה המקסימלי לא יכול להיות קטן מ-0.");
      return;
    }

    try {
      await updateBranch(
        id,
        editForm.name,
        editForm.terminalUniqueIdentifier,
        editForm.updateMaxWithdrawAmount,
        maxWithdrawAmountNumber,
      );

      await fetchBranches();
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating branch:", error);
      setEditErrorMessage("שגיאה בעדכון הסניף");
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
        <span>/</span>
        <span>{organization.name}</span>
        <span>/</span>
        <span>סניפים</span>
      </div>

      <div className="page-header">
        <h2 className="page-title">סניפי {organization.name}</h2>
        <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
          + הוסף סניף
        </button>
      </div>

      {showCreateForm && (
        <CreateBranchForm
          organization={organization}
          onCreated={() => {
            fetchBranches();
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editErrorMessage && (
        <div className="form-error-message">{editErrorMessage}</div>
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
                    className="inline-input"
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                ) : (
                  branch.name
                )}
              </td>

              <td>
                {editingBranchId === branch.id ? (
                  <input
                    className="inline-input"
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
                    className="inline-input"
                    type="number"
                    min="0"
                    step="0.01"
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

              <td>
                {branch.isActive ? (
                  <span className="badge-active">פעיל</span>
                ) : (
                  <span className="badge-inactive">לא פעיל</span>
                )}
              </td>

              <td>
                <div className="action-buttons">
                  {editingBranchId === branch.id ? (
                    <>
                      <button
                        className="btn-save"
                        onClick={() => handleUpdateBranch(branch.id)}
                      >
                        שמור
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        ביטול
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(branch)}
                      >
                        ערוך
                      </button>

                      {branch.isActive ? (
                        <button
                          className="btn-danger"
                          onClick={() => handleToggleBranchStatus(branch)}
                        >
                          השבת
                        </button>
                      ) : (
                        <button
                          className="btn-success"
                          onClick={() => handleToggleBranchStatus(branch)}
                        >
                          הפעל
                        </button>
                      )}

                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedBranchForUsers(branch)}
                      >
                        משתמשים
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BranchesPage;
