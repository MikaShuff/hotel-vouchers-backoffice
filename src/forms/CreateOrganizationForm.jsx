import { useState } from "react";
import { createOrganization } from "../services/organizationService";

function CreateOrganizationForm({onCreated}) {
  const [name, setName] = useState("");
  const [commission, setCommission] = useState("");
  const [maxWithdrawAmount, setMaxWithdrawAmount] = useState("");
  const [allowCancel, setAllowCancel] = useState(false);

  async function handleSave() {
    try {
      await createOrganization(
        name,
        Number(commission),
        allowCancel,
        Number(maxWithdrawAmount),
      );

      if (onCreated) {
        onCreated();
      }

      alert("ארגון נוצר בהצלחה");
    } catch (error) {
      console.error(error);
      alert("שגיאה ביצירת ארגון");
    }
  }

  return (
    <div className="create-organization-form">
      <h3>הוספת ארגון</h3>

      <input
        type="text"
        placeholder="שם ארגון"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="עמלה"
        value={commission}
        onChange={(e) => setCommission(e.target.value)}
      />

      <input
        type="number"
        placeholder="סכום משיכה מקסימלי"
        value={maxWithdrawAmount}
        onChange={(e) => setMaxWithdrawAmount(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={allowCancel}
          onChange={(e) => setAllowCancel(e.target.checked)}
        />
        אפשר ביטול
      </label>

      
      <button onClick={handleSave}>שמור</button>
    </div>
  );
}

export default CreateOrganizationForm;
