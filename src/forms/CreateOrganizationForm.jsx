// CreateOrganizationForm.jsx

import { useState } from "react";
import { createOrganization } from "../services/organizationService";
import styles from "./CreateOrganizationForm.module.css";

function CreateOrganizationForm({ onCreated, onCancel }) {
  const [name, setName] = useState("");
  const [commission, setCommission] = useState("");
  const [maxWithdrawAmount, setMaxWithdrawAmount] = useState("");
  const [allowCancel, setAllowCancel] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setErrorMessage("");

    const commissionNumber = Number(commission);

    const maxWithdrawAmountNumber =
      maxWithdrawAmount === "" ? null : Number(maxWithdrawAmount);

    if (commission === "") {
      setErrorMessage("יש להזין עמלה.");
      return;
    }

    if (
      Number.isNaN(commissionNumber) ||
      commissionNumber < 0 ||
      commissionNumber > 100
    ) {
      setErrorMessage("העמלה חייבת להיות בין 0 ל-100.");
      return;
    }

    if (
      maxWithdrawAmountNumber !== null &&
      (Number.isNaN(maxWithdrawAmountNumber) ||
        maxWithdrawAmountNumber < 0)
    ) {
      setErrorMessage("סכום המשיכה המקסימלי לא יכול להיות קטן מ-0.");
      return;
    }

    try {
      setIsSaving(true);

      await createOrganization(
        name,
        commissionNumber,
        allowCancel,
        maxWithdrawAmountNumber
      );

      if (onCreated) {
        onCreated();
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      setErrorMessage("שגיאה ביצירת ארגון.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div
        className={styles.form}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>הוספת ארגון</h3>

          <button
            className={styles.closeButton}
            onClick={onCancel}
            type="button"
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>שם ארגון</label>

          <input
            className={styles.input}
            type="text"
            placeholder="לדוגמה: Isrotel"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>עמלה (%)</label>

          <input
            className={styles.input}
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="לדוגמה: 12.5"
            value={commission}
            onChange={(event) => setCommission(event.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            סכום משיכה מקסימלי
          </label>

          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            placeholder="ניתן להשאיר ריק"
            value={maxWithdrawAmount}
            onChange={(event) =>
              setMaxWithdrawAmount(event.target.value)
            }
            disabled={isSaving}
          />
        </div>

        <div className={styles.checkboxField}>
          <input
            className={styles.checkbox}
            type="checkbox"
            id="allowCancel"
            checked={allowCancel}
            onChange={(event) =>
              setAllowCancel(event.target.checked)
            }
            disabled={isSaving}
          />

          <label
            htmlFor="allowCancel"
            className={styles.checkboxLabel}
          >
            אפשר ביטול
          </label>
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            type="button"
            disabled={isSaving}
          >
            {isSaving ? "שומר..." : "שמור"}
          </button>

          <button
            className={styles.cancelButton}
            onClick={onCancel}
            type="button"
            disabled={isSaving}
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateOrganizationForm;