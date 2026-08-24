import { useState } from "react";
import { createBranch } from "../services/branchService";
import styles from "./CreateOrganizationForm.module.css";

function CreateBranchForm({ organization, onCreated, onCancel }) {
  const [name, setName] = useState("");
  const [terminalUniqueIdentifier, setTerminalUniqueIdentifier] = useState("");
  const [maxWithdrawAmount, setMaxWithdrawAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSave() {
    setErrorMessage("");

    const maxWithdrawAmountNumber =
      maxWithdrawAmount === "" ? null : Number(maxWithdrawAmount);

    if (
      maxWithdrawAmountNumber !== null &&
      (Number.isNaN(maxWithdrawAmountNumber) || maxWithdrawAmountNumber < 0)
    ) {
      setErrorMessage("סכום המשיכה המקסימלי לא יכול להיות קטן מ-0.");
      return;
    }

    try {
      await createBranch(
        name,
        organization.id,
        terminalUniqueIdentifier,
        maxWithdrawAmountNumber,
      );

      if (onCreated) {
        onCreated();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("שגיאה ביצירת הסניף");
    }
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.form} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>הוספת סניף ל-{organization.name}</h3>
          <button
            className={styles.closeButton}
            onClick={onCancel}
            type="button"
          >
            ×
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>שם סניף</label>
          <input
            className={styles.input}
            type="text"
            placeholder="לדוגמה: אילת"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>מזהה מסוף</label>
          <input
            className={styles.input}
            type="text"
            placeholder="מזהה ייחודי של המסוף"
            value={terminalUniqueIdentifier}
            onChange={(e) => setTerminalUniqueIdentifier(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>סכום משיכה מקסימלי</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            placeholder="ניתן להשאיר ריק"
            value={maxWithdrawAmount}
            onChange={(e) => setMaxWithdrawAmount(e.target.value)}
          />
        </div>
        {errorMessage && (
          <div className="form-error-message">{errorMessage}</div>
        )}
        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSave}>
            שמור
          </button>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            type="button"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateBranchForm;
