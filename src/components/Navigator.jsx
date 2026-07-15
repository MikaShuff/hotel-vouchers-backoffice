function Navigator({ selectedPage, setSelectedPage }) {

const menuItems = [
  "Dashboard",
  "ארגונים",
  "משתמשי מערכת",
  "תמיכה"
];

  return (
    <div className="navigator">
      <h3>ניווט</h3>

      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item}
            className={selectedPage === item ? "active-menu" : ""}
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