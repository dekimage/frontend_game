import { Context } from "../context/store";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { NavBarItem } from "./NavBar";
import styles from "../styles/Header.module.scss";

import iconToday from "../assets/menu-today-dark.svg";
import iconShop from "../assets/menu-shop-dark.svg";
import iconLearn from "../assets/menu-learn-dark.svg";
import iconCollection from "../assets/menu-collection-dark.svg";
import iconProfile from "../assets/menu-profile-dark.svg";

import iconTodayActive from "../assets/menu-today-active.svg";
import iconShopActive from "../assets/menu-shop-active.svg";
import iconLearnActive from "../assets/menu-learn-active.svg";
import iconCollectionActive from "../assets/menu-collection-active.svg";
import iconProfileActive from "../assets/menu-profile-active.svg";

import iconSearch from "../assets/menu-search-dark.svg";
import iconSearchActive from "../assets/menu-search-active.svg";

import iconLogo from "../assets/menu-logo-dark.svg";

const mobileNavLinks = [
  {
    icon: iconToday,
    activeIcon: iconTodayActive,
    text: "Today",
    link: "/",
  },
  {
    icon: iconShop,
    activeIcon: iconShopActive,
    text: "Shop",
    link: "/shop",
  },
  {
    icon: iconLearn,
    activeIcon: iconLearnActive,
    text: "Learn",
    link: "/learn",
  },
  {
    icon: iconCollection,
    activeIcon: iconCollectionActive,
    text: "Collection",
    link: "/collection",
  },
  {
    icon: iconProfile,
    activeIcon: iconProfileActive,
    text: "Profile",
    link: "/profile",
  },
];

const searchLink = {
  icon: iconSearch,
  activeIcon: iconSearchActive,
  text: "Search",
  link: "/search",
};

const Header = () => {
  const [store] = useContext(Context);
  const router = useRouter();
  return (
    <>
      <div className={styles.header}>
        <Link href="/home">
          <div className={styles.logo}>
            <img height="20px" src={iconLogo} />
            <div>Actionise</div>
          </div>
        </Link>
        <div className={styles.header_mainLinks}>
          {mobileNavLinks.map((link, i) => {
            const active = router.pathname == link.link;
            return (
              <NavBarItem
                icon={link.icon}
                activeIcon={link.activeIcon}
                text={link.text}
                link={link.link}
                key={i}
                active={active}
                small={true}
              />
            );
          })}
        </div>
        <div className={styles.header_currenciesBox}>
          <Link href="/shop">
            <div className={styles.currency}>
              <img height="12px" src="http://localhost:1337/energy.png" />
              <div>{store.user.energy}</div>
            </div>
          </Link>
          <Link href="/streak">
            <div className={styles.currency}>
              <img height="12px" src="http://localhost:1337/streak.png" />
              <div>{store.user.streak}</div>
            </div>
          </Link>
          <Link href="/shop">
            <div className={styles.currency}>
              <img height="12px" src="http://localhost:1337/gems.png" />
              <div>{store.user.gems}</div>
            </div>
          </Link>
          <Link href="/shop">
            <div className={styles.currency}>
              <img height="12px" src="http://localhost:1337/star.png" />
              <div>{store.user.stars}</div>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.headerMobile}>
        <NavBarItem
          icon={searchLink.icon}
          activeIcon={searchLink.activeIcon}
          text={searchLink.text}
          link={searchLink.link}
          active={false}
        />
        <div className={styles.headerMobile_currenciesBox}>
          <Link href="/shop">
            <div className={styles.currency}>
              <img height="12px" src="http://localhost:1337/energy.png" />
              <div>{store.user.energy}</div>
            </div>
          </Link>
          <Link href="/streak">
            <div className={styles.currency}>
              <img height="12px" src="http://localhost:1337/streak.png" />
              <div>{store.user.streak}</div>
            </div>
          </Link>
          <Link href="/shop">
            <div className={styles.currency}>
              <img height="12px" src="http://localhost:1337/gems.png" />
              <div>{store.user.gems}</div>
            </div>
          </Link>
          <Link href="/shop">
            <div className={styles.currency}>
              <img height="12px" src="http://localhost:1337/star.png" />
              <div>{store.user.stars}</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
