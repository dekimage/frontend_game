import { useState } from "react";
import styles from "../styles/Expandable.module.scss";
const ExpandableComponent = ({
  name,
  icon,
  tag,
  children,
  isCompOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(isCompOpen);
  return (
    <div className={styles.expandable}>
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.image}>{icon && <img src={icon} />}</div>
        <div className={styles.name}>{name}</div>
        {tag && <div className={styles.tag}>{tag}</div>}
        {isOpen ? (
          <ion-icon name="chevron-up-outline"></ion-icon>
        ) : (
          <ion-icon name="chevron-down-outline"></ion-icon>
        )}
      </div>
      {isOpen && <div className={styles.body}>{children}</div>}
    </div>
  );
};

export default ExpandableComponent;
