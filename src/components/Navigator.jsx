import styles from "./Navigator.module.css";
import appLogo from "../assets/app.png";

function Navigator({ selectedPage, setSelectedPage }) {
  const menuItems = ["Dashboard", "ארגונים", "משתמשי מערכת", "תמיכה"];

  return (
    <div className={styles.navigator}>

      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item}
            className={
              selectedPage === item
                ? `${styles.menuItem} ${styles.menuItemActive}`
                : styles.menuItem
            }
            onClick={() => setSelectedPage(item)}
          >
            {item}
          </li>
        ))}
      </ul>

      <div className={styles.logoContainer}>
        <img src={appLogo} alt="לוגו המערכת" className={styles.logo} />
      </div>
    </div>
  );
}

export default Navigator;