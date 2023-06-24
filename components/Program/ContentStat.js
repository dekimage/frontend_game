import styles from "@/styles/Course.module.scss";

export const ContentStat = ({ icon, amount, label }) => {
  return (
    <div className={styles.contentStat}>
      <div className={styles.contentStatAmount}>
        <img src={icon} height="12px" alt="" />
      </div>
      <div className={styles.contentStatAmount}>
        {amount} {label}
      </div>
    </div>
  );
};
