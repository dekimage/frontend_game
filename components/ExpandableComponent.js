import styles from "@/styles/Expandable.module.scss";

const ExpandableComponent = ({ name, icon, children }) => {
  return (
    <div className={styles.expandable}>
      <div className={styles.header}>
        <div className={styles.image}>{icon && <img src={icon} />}</div>
        <div className={styles.name}>{name}</div>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default ExpandableComponent;
