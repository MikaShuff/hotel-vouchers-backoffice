import styles from "./Navigator.module.css";

function Navigator({ selectedPage, setSelectedPage }) {
  const menuItems = ["Dashboard", "ארגונים", "משתמשי מערכת", "תמיכה"];

  return (
    <div className={styles.navigator}>
      <h3 className={styles.title}>ניווט</h3>

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
    </div>
  );
}

export default Navigator;