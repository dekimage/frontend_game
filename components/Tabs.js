import styles from "../styles/Tabs.module.scss";
import Link from "next/link";
import { useState } from "react";
import cx from "classnames";
export const Tabs = ({ links }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={styles.tabs}>
      {links.map((link, i) => (
        <Link href={link.href} key={i}>
          <div
            className={cx(styles.link, isActive == link.label && styles.active)}
            onClick={() => {
              setIsActive(link.label);
            }}
          >
            {link.label}
          </div>
        </Link>
      ))}
    </div>
  );
};
