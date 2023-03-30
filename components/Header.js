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
import baseUrl from "../utils/settings";

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
    icon: iconCollection,
    activeIcon: iconCollectionActive,
    text: "Explore",
    link: "/learn",
  },
  {
    icon: iconLearn,
    activeIcon: iconLearnActive,
    text: "Problems",
    link: "/problems",
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

const currencies = [
  {
    link: "shop",
    currency: "energy",
    img: "energy.png",
  },
  {
    link: "streak",
    currency: "streak",
    img: "streak.png",
  },
  {
    link: "shop",
    currency: "stars",
    img: "stars.png",
  },
];

const NavLink = ({ link, img, currency }) => {
  const [store] = useContext(Context);
  return (
    <Link href={`/${link}`}>
      <div className={styles.currency}>
        <img height="12px" src={`${baseUrl}/${img}`} />
        {currency !== "energy" && <div>{store.user[currency]}</div>}
        {currency === "energy" && (
          <div>
            {store.user.is_subscribed ? (
              <div>&#8734;</div>
            ) : (
              <div>
                {store.user[currency]} / {store.user.max_energy}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
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
          {currencies.map((c, i) => (
            <NavLink key={i} link={c.link} currency={c.currency} img={c.img} />
          ))}
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
          {currencies.map((c, i) => (
            <NavLink key={i} link={c.link} currency={c.currency} img={c.img} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
