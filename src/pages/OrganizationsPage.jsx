import { useEffect, useState } from "react";
import {
  getOrganization,
  updateOrganization,
  activateOrganization,
  deactivateOrganization,
} from "../services/organizationService";
import CreateOrganizationForm from "../forms/CreateOrganizationForm";
import BranchesPage from "./BranchesPage";
import UsersPage from "./UsersPage";

function OrganizationsPage() {
  const [organization, setOrganization] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOrganizationId, setEditingOrganizationId] = useState(null);
  const [selectedOrganizationForBranches, setSelectedOrganizationForBranches] = useState(null);
  const [selectedOrganizationForUsers, setSelectedOrganizationForUsers] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    commission: "",
    allowCancel: false,
    updateMaxWithdrawAmount: false,
    maxWithdrawAmount: "",
  });

  async function fetchOrganization() {
    try {
      const data = await getOrganization();
      setOrganization(data);
    } catch (error) {
      console.error("Error fetching organization:", error);
    }
  }

  useEffect(() => {
    fetchOrganization();
  }, []);

  function handleEdit(org) {
    setEditingOrganizationId(org.id);
    setEditForm({
      name: org.name,
      commission: org.commission ?? "",
      allowCancel: org.allowCancel,
      updateMaxWithdrawAmount: false,
      maxWithdrawAmount: org.maxWithdrawAmount ?? "",
    });
  }

  function handleCancelEdit() {
    setEditingOrganizationId(null);
    setEditForm({
      name: "",
      commission: "",
      allowCancel: false,
      updateMaxWithdrawAmount: false,
      maxWithdrawAmount: "",
    });
  }

  async function handleUpdateOrganization(id) {
    try {
      await updateOrganization(
        id,
        editForm.name,
        Number(editForm.commission),
        editForm.allowCancel,
        editForm.updateMaxWithdrawAmount,
        editForm.maxWithdrawAmount === "" ? null : Number(editForm.maxWithdrawAmount),
      );

      await fetchOrganization();
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating organization:", error);
      alert("שגיאה בעדכון הארגון");
    }
  }

  async function handleToggleOrganizationStatus(org) {
    try {
      if (org.isActive) {
        await deactivateOrganization(org.id);
      } else {
        await activateOrganization(org.id);
      }
      await fetchOrganization();
    } catch (error) {
      console.error("Error changing organization status:", error);
      alert("שגיאה בשינוי סטטוס הארגון");
    }
  }

  if (selectedOrganizationForUsers) {
    return (
      <UsersPage
        organization={selectedOrganizationForUsers}
        onBack={() => setSelectedOrganizationForUsers(null)}
      />
    );
  }

  if (selectedOrganizationForBranches) {
    return (
      <BranchesPage
        organization={selectedOrganizationForBranches}
        onBack={() => setSelectedOrganizationForBranches(null)}
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">ניהול ארגונים</h2>
        <button
          className="btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          + הוסף ארגון
        </button>
      </div>

      {showCreateForm && (
        <CreateOrganizationForm
          onCreated={() => {
            fetchOrganization();
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>מזהה</th>
            <th>שם לקוח</th>
            <th>עמלה</th>
            <th>אפשר ביטול</th>
            <th>סכום משיכה מקסימלי</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>

        <tbody>
          {organization.map((org) => (
            <tr key={org.id}>
              <td>{org.id}</td>

              <td>
                {editingOrganizationId === org.id ? (
                  <input
                    className="inline-input"
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                ) : (
                  org.name
                )}
              </td>

              <td>
                {editingOrganizationId === org.id ? (
                  <input
                    className="inline-input"
                    type="number"
                    value={editForm.commission}
                    onChange={(e) =>
                      setEditForm({ ...editForm, commission: e.target.value })
                    }
                  />
                ) : (
                  org.commission
                )}
              </td>

              <td>
                {editingOrganizationId === org.id ? (
                  <input
                    type="checkbox"
                    checked={editForm.allowCancel}
                    onChange={(e) =>
                      setEditForm({ ...editForm, allowCancel: e.target.checked })
                    }
                  />
                ) : org.allowCancel ? (
                  "כן"
                ) : (
                  "לא"
                )}
              </td>

              <td>
                {editingOrganizationId === org.id ? (
                  <input
                    className="inline-input"
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
                  org.maxWithdrawAmount ?? "-"
                )}
              </td>

              <td>
                {org.isActive ? (
                  <span className="badge-active">פעיל</span>
                ) : (
                  <span className="badge-inactive">לא פעיל</span>
                )}
              </td>

              <td>
                <div className="action-buttons">
                  {editingOrganizationId === org.id ? (
                    <>
                      <button
                        className="btn-save"
                        onClick={() => handleUpdateOrganization(org.id)}
                      >
                        שמור
                      </button>
                      <button className="btn-secondary" onClick={handleCancelEdit}>
                        ביטול
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(org)}
                      >
                        ערוך
                      </button>

                      {org.isActive ? (
                        <button
                          className="btn-danger"
                          onClick={() => handleToggleOrganizationStatus(org)}
                        >
                          השבת
                        </button>
                      ) : (
                        <button
                          className="btn-success"
                          onClick={() => handleToggleOrganizationStatus(org)}
                        >
                          הפעל
                        </button>
                      )}

                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedOrganizationForBranches(org)}
                      >
                        סניפים
                      </button>

                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedOrganizationForUsers(org)}
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

export default OrganizationsPage;