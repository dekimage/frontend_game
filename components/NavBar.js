import Link from "next/link";
import { Context } from "@/context/store";
import { useContext } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Header.module.scss";
import cx from "classnames";
import iconToday from "@/assets/menu-today-dark.svg";
import iconShop from "@/assets/menu-shop-dark.svg";
import iconLearn from "@/assets/menu-learn-dark.svg";
import iconCollection from "@/assets/menu-collection-dark.svg";
import iconProfile from "@/assets/menu-profile-dark.svg";

import iconTodayActive from "@/assets/menu-today-active.svg";
import iconShopActive from "@/assets/menu-shop-active.svg";
import iconLearnActive from "@/assets/menu-learn-active.svg";
import iconCollectionActive from "@/assets/menu-collection-active.svg";
import iconProfileActive from "@/assets/menu-profile-active.svg";

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

export const NavBarItem = ({
  icon,
  activeIcon,
  text,
  link,
  active,
  small = false,
}) => {
  return (
    <Link as={link} href={link}>
      <div
        className={cx(
          styles.navBarItem,
          { [styles.active]: active },
          { [styles.small]: small }
        )}
      >
        <img height="25px" src={active ? activeIcon : icon} />
        <div className={cx(styles.navBarItem_name, { [styles.small]: small })}>
          {text}
        </div>
      </div>
    </Link>
  );
};

const NavBar = () => {
  const [store] = useContext(Context);
  const router = useRouter();
  return (
    <div className={styles.navBar}>
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
          />
        );
      })}
    </div>
  );
};

export default NavBar;
