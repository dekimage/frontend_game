const mobileNavLinks = [{}];
import { Context } from "../context/store";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.scss";

const Header = () => {
  const [store] = useContext(Context);
  return (
    <div className={styles.header}>
      <div>
        {/* <img src={} /> */}
        <Link href="/">
          <div className={styles.link}>Today</div>
        </Link>
      </div>

      <Link href="/shop">
        <div className={styles.link}>Shop</div>
      </Link>
      <Link href="/learn">
        <div className={styles.link}>Learn</div>
      </Link>
      <Link href="/collection">
        <div className={styles.link}>Collection</div>
      </Link>
      <Link href="/profile">
        <div className={styles.link}>Profile</div>
      </Link>

      <div className={styles.currency}>
        <img height="12px" src="http://localhost:1337/streak.png" />
        <div>{store.user.streak}</div>
      </div>

      <div className={styles.currency}>
        <img height="12px" src="http://localhost:1337/gems.png" />
        <div>{store.user.gems}</div>
      </div>

      <div className={styles.currency}>
        <img height="12px" src="http://localhost:1337/stars.png" />
        <div>{store.user.stars}</div>
      </div>
    </div>
  );
};

export default Header;
