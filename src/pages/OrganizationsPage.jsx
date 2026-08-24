//OrganizationsPage.jsx

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
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [selectedOrganizationForBranches, setSelectedOrganizationForBranches] =
    useState(null);
  const [selectedOrganizationForUsers, setSelectedOrganizationForUsers] =
    useState(null);

  // ----- Filters -----
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [allowCancelFilter, setAllowCancelFilter] = useState("all");

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
    setEditErrorMessage("");
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
    setEditErrorMessage("");
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
    setEditErrorMessage("");

    const commissionNumber = Number(editForm.commission);

    const maxWithdrawAmountNumber =
      editForm.maxWithdrawAmount === ""
        ? null
        : Number(editForm.maxWithdrawAmount);

    if (editForm.commission === "") {
      setEditErrorMessage("יש להזין עמלה.");
      return;
    }

    if (
      Number.isNaN(commissionNumber) ||
      commissionNumber < 0 ||
      commissionNumber > 100
    ) {
      setEditErrorMessage("העמלה חייבת להיות בין 0 ל-100.");
      return;
    }

    if (
      maxWithdrawAmountNumber !== null &&
      (Number.isNaN(maxWithdrawAmountNumber) || maxWithdrawAmountNumber < 0)
    ) {
      setEditErrorMessage("סכום המשיכה המקסימלי לא יכול להיות קטן מ-0.");
      return;
    }

    try {
      await updateOrganization(
        id,
        editForm.name,
        commissionNumber,
        editForm.allowCancel,
        editForm.updateMaxWithdrawAmount,
        maxWithdrawAmountNumber,
      );

      await fetchOrganization();
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating organization:", error);
      setEditErrorMessage("שגיאה בעדכון הארגון.");
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

  function handleResetFilters() {
    setSearchText("");
    setStatusFilter("all");
    setAllowCancelFilter("all");
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

  // ----- Apply filters -----
  const filteredOrganizations = organization.filter((org) => {
    if (searchText.trim()) {
      const search = searchText.trim().toLowerCase();
      if (!(org.name ?? "").toLowerCase().includes(search)) return false;
    }

    if (statusFilter === "active" && !org.isActive) return false;
    if (statusFilter === "inactive" && org.isActive) return false;

    if (allowCancelFilter === "yes" && !org.allowCancel) return false;
    if (allowCancelFilter === "no" && org.allowCancel) return false;

    return true;
  });

  const hasActiveFilters =
    searchText.trim() !== "" ||
    statusFilter !== "all" ||
    allowCancelFilter !== "all";

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">ניהול ארגונים</h2>
        <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
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

      <div className="filter-bar">
        <input
          className="filter-input"
          type="text"
          placeholder="🔍 חיפוש לפי שם ארגון..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">כל הסטטוסים</option>
          <option value="active">פעילים</option>
          <option value="inactive">לא פעילים</option>
        </select>

        <select
          className="filter-select"
          value={allowCancelFilter}
          onChange={(e) => setAllowCancelFilter(e.target.value)}
        >
          <option value="all">ביטול: הכל</option>
          <option value="yes">מאפשר ביטול</option>
          <option value="no">לא מאפשר ביטול</option>
        </select>

        {hasActiveFilters && (
          <button className="btn-secondary" onClick={handleResetFilters}>
            נקה סינון
          </button>
        )}

        <span className="filter-count">
          {filteredOrganizations.length} מתוך {organization.length}
        </span>
      </div>

      {editErrorMessage && (
        <div className="form-error-message">{editErrorMessage}</div>
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
          {filteredOrganizations.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-state">
                {hasActiveFilters
                  ? "לא נמצאו ארגונים התואמים לסינון"
                  : "אין ארגונים להצגה"}
              </td>
            </tr>
          ) : (
            filteredOrganizations.map((org) => (
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
                      min="0"
                      max="100"
                      step="0.01"
                      value={editForm.commission}
                      onChange={(event) => {
                        setEditForm({
                          ...editForm,
                          commission: event.target.value,
                        });

                        setEditErrorMessage("");
                      }}
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
                        setEditForm({
                          ...editForm,
                          allowCancel: e.target.checked,
                        })
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
                      min="0"
                      step="0.01"
                      value={editForm.maxWithdrawAmount}
                      onChange={(event) => {
                        setEditForm({
                          ...editForm,
                          maxWithdrawAmount: event.target.value,
                          updateMaxWithdrawAmount: true,
                        });

                        setEditErrorMessage("");
                      }}
                    />
                  ) : (
                    (org.maxWithdrawAmount ?? "-")
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
                          onClick={() =>
                            setSelectedOrganizationForBranches(org)
                          }
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrganizationsPage;
