const mobileNavLinks = [
  {
    icon: icon,
    text: "Today",
    link: "/",
  },
  {
    icon: icon,
    text: "Shop",
    link: "/shop",
  },
  {
    icon: icon,
    text: "Learn",
    link: "/learn",
  },
  {
    icon: icon,
    text: "Collection",
    link: "/collection",
  },
  {
    icon: icon,
    text: "Profile",
    link: "/profile",
  },
];
import Link from "next/link";
import { Context } from "../context/store";
import { useContext, useEffect, useState } from "react";
import styles from "../styles/Header.module.scss";
import cx from "classnames";
import icon from "../assets/profile-black.svg";
import link from "next/link";

const NavBarItem = ({ icon, text, link }) => {
  return (
    <Link as={link} href={link}>
      <div className={cx(styles.navBarItem, { active: true })}>
        <img height="25px" src={icon} />
        <div>{text}</div>
      </div>
    </Link>
  );
};

const NavBar = () => {
  const [store] = useContext(Context);
  return (
    <div className={styles.navBar}>
      {mobileNavLinks.map((link, i) => {
        return (
          <NavBarItem
            icon={link.icon}
            text={link.text}
            link={link.link}
            key={i}
          />
        );
      })}
    </div>
  );
};

export default NavBar;
