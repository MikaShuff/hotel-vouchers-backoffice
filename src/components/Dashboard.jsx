import { useEffect, useState } from "react";
import { getOrganization } from "../services/organizationService";
import { getBranches } from "../services/branchService";
import { getUsers } from "../services/userService";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [stats, setStats] = useState({
    organizations: { total: 0, active: 0 },
    branches: { total: 0, active: 0 },
    users: { total: 0, active: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [orgs, branches, users] = await Promise.all([
          getOrganization(),
          getBranches(),
          getUsers(),
        ]);

        setStats({
          organizations: {
            total: orgs.length,
            active: orgs.filter((o) => o.isActive).length,
          },
          branches: {
            total: branches.length,
            active: branches.filter((b) => b.isActive).length,
          },
          users: {
            total: users.length,
            active: users.filter((u) => u.isActive).length,
          },
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>ברוכים הבאים 👋</h1>{" "}
        <p className={styles.welcomeSubtitle}>סקירה כללית של המערכת</p>
      </div>

      {loading ? (
        <p className={styles.loading}>טוען נתונים...</p>
      ) : (
        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <span className={styles.cardLabel}>ארגונים</span>
            <span className={styles.cardValue}>
              {stats.organizations.total}
            </span>
            <span className={styles.cardSubtext}>
              {stats.organizations.active} פעילים
            </span>
          </div>

          <div className={styles.card}>
            <span className={styles.cardLabel}>סניפים</span>
            <span className={styles.cardValue}>{stats.branches.total}</span>
            <span className={styles.cardSubtext}>
              {stats.branches.active} פעילים
            </span>
          </div>

          <div className={styles.card}>
            <span className={styles.cardLabel}>משתמשים</span>
            <span className={styles.cardValue}>{stats.users.total}</span>
            <span className={styles.cardSubtext}>
              {stats.users.active} פעילים
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
