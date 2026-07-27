import { useState } from "react";
import { createUser } from "../services/userService";
import styles from "./CreateOrganizationForm.module.css";

function CreateUserForm({ organization, branch, existingUsers = [], onCreated, onCancel }) {
  const [userName, setUserName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const phoneRegex = /^05\d{8}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ----- בדיקת שדה בודד -----
  // ----- בדיקת שדה בודד -----
  function validateField(field, value) {
    let message = "";

    if (field === "userName") {
      if (!value.trim()) {
        message = "שם משתמש הוא שדה חובה";
      } else {
        const exists = existingUsers.some(
          (u) =>
            (u.userName ?? "").trim().toLowerCase() ===
            value.trim().toLowerCase(),
        );
        if (exists) {
          message = "שם המשתמש כבר קיים במערכת";
        }
      }
    }

    if (field === "roleId") {
      if (value === "") {
        message = "יש לבחור תפקיד";
      }
    }

    if (field === "phone") {
      if (value.trim()) {
        if (!phoneRegex.test(value.trim())) {
          message = "מספר טלפון לא תקין (05XXXXXXXX)";
        } else {
          const exists = existingUsers.some(
            (u) => (u.phone ?? "").trim() === value.trim(),
          );
          if (exists) {
            message = "מספר הטלפון כבר קיים במערכת";
          }
        }
      }
    }

    if (field === "email") {
      if (value.trim()) {
        if (!emailRegex.test(value.trim())) {
          message = "כתובת אימייל לא תקינה";
        } else {
          const exists = existingUsers.some(
            (u) =>
              (u.email ?? "").trim().toLowerCase() ===
              value.trim().toLowerCase(),
          );
          if (exists) {
            message = "כתובת האימייל כבר קיימת במערכת";
          }
        }
      }
    }

    return message;
  }
  // ----- מופעל כשיוצאים מהשדה -----
function handleBlur(field, value) {
  setTouched((prev) => ({ ...prev, [field]: true }));
  setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
}

  // ----- מופעל בזמן הקלדה: מעדכן ערך, ומנקה שגיאה רק אם השדה כבר "נגעו" בו ותוקן -----
  function handleChange(field, value, setter) {
    setter(value);

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  }

  // ----- ולידציה מלאה לפני שמירה -----
  function validateAll() {
    const newErrors = {
      userName: validateField("userName", userName),
      roleId: validateField("roleId", roleId),
      phone: validateField("phone", phone),
      email: validateField("email", email),
    };

    if (!phone.trim() && !email.trim()) {
      newErrors.contact = "יש להזין טלפון או אימייל";
    }

    // מסמנים את כל השדות כ"נגעו" כדי שכל השגיאות יופיעו
    setTouched({
      userName: true,
      roleId: true,
      phone: true,
      email: true,
    });

    setErrors(newErrors);

    return !Object.values(newErrors).some((e) => e);
  }

  async function handleSave() {
    setServerError("");
    setSuccessMessage("");

    if (!validateAll()) {
      return;
    }

    try {
      setSaving(true);

      await createUser(
        userName.trim(),
        Number(roleId),
        branch ? branch.id : null,
        organization ? organization.id : null,
        phone.trim(),
        email.trim(),
      );

      setSuccessMessage("המשתמש נוצר בהצלחה ✓");

      setTimeout(() => {
        if (onCreated) {
          onCreated();
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message ??
        "שגיאה ביצירת המשתמש. ייתכן שהטלפון או האימייל כבר קיימים במערכת.";
      setServerError(message);
    } finally {
      setSaving(false);
    }
  }

  function contextLabel() {
    if (branch) return ` ל-${branch.name}`;
    if (organization) return ` ל-${organization.name}`;
    return "";
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.form} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>הוספת משתמש{contextLabel()}</h3>
          <button className={styles.closeButton} onClick={onCancel} type="button">
            ×
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>שם משתמש *</label>
          <input
            className={styles.input}
            type="text"
            placeholder="לדוגמה: mika"
            value={userName}
            onChange={(e) => handleChange("userName", e.target.value, setUserName)}
            onBlur={(e) => handleBlur("userName", e.target.value)}
          />
          {touched.userName && errors.userName && (
            <span className={styles.fieldError}>{errors.userName}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>תפקיד (Role ID) *</label>
          <input
            className={styles.input}
            type="number"
            placeholder="לדוגמה: 2"
            value={roleId}
            onChange={(e) => handleChange("roleId", e.target.value, setRoleId)}
            onBlur={(e) => handleBlur("roleId", e.target.value)}
          />
          {touched.roleId && errors.roleId && (
            <span className={styles.fieldError}>{errors.roleId}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>טלפון</label>
          <input
            className={styles.input}
            type="tel"
            placeholder="לדוגמה: 0501234567"
            value={phone}
            onChange={(e) => handleChange("phone", e.target.value, setPhone)}
            onBlur={(e) => handleBlur("phone", e.target.value)}
          />
          {touched.phone && errors.phone && (
            <span className={styles.fieldError}>{errors.phone}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>אימייל</label>
          <input
            className={styles.input}
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => handleChange("email", e.target.value, setEmail)}
            onBlur={(e) => handleBlur("email", e.target.value)}
          />
          {touched.email && errors.email && (
            <span className={styles.fieldError}>{errors.email}</span>
          )}
        </div>

        {errors.contact && (
          <div className={styles.errorBanner}>{errors.contact}</div>
        )}

        {serverError && <div className={styles.errorBanner}>{serverError}</div>}

        {successMessage && (
          <div className={styles.successBanner}>{successMessage}</div>
        )}

        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "שומר..." : "שמור"}
          </button>
          <button className={styles.cancelButton} onClick={onCancel} type="button">
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateUserForm;