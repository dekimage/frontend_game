// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import Link from "next/link";
import router from "next/router";

// *** COMPONENTS ***
import ProgressBar from "../components/ProgressBar";

// *** ACTIONS ***
import { followBuddy } from "../actions/action";

import settingsIcon from "../assets/menu-settings-dark.svg";

// *** STYLES ***
import styles from "../styles/Profile.module.scss";
import cx from "classnames";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const Stat = ({ img, number, text, isPercent = false }) => {
  return (
    <div className={styles.statsBox}>
      <div className={styles.statsBox_img}>
        <img src={img} />
      </div>
      <div className={styles.statsBox_number}>
        {number}
        {isPercent && "%"}
      </div>
      <div className={styles.statsBox_text}>{text}</div>
    </div>
  );
};

export const Activity = ({ img, link, text, notification = 0 }) => {
  return (
    <Link href={link}>
      <div className={styles.activityBox}>
        {notification !== 0 && (
          <div className={styles.activityBox_notification}>{notification}</div>
        )}
        <div className={styles.activityBox_img}>
          <img src={img} height="25px" />
        </div>

        <div className={styles.activityBox_text}>{text}</div>
      </div>
    </Link>
  );
};

export const Buddy = ({ img, link, name, level }) => {
  return (
    <Link href={link}>
      <div className={styles.buddyBox}>
        <div className={styles.buddyAvatar}>
          <img
            // src={`${baseUrl}/${store.user.image.url}`

            src={`${baseUrl}/avatar-test.png`}
          />
        </div>
        <div className={styles.buddyBox_name}>{name}</div>

        <div className={styles.buddyBox_level}>{level} Lvl</div>
        <div className={styles.arrowRight}>
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </div>
      </div>
    </Link>
  );
};

export const ProfileHeader = () => {
  const [store, dispatch] = useContext(Context);
  return (
    <div className={styles.profileHeader}>
      <div className={styles.escape} onClick={() => router.back()}>
        {/* <img src={iconBack} height="25px" /> */}
        <ion-icon name="chevron-back-outline"></ion-icon>
      </div>
      <div className={styles.profileHeader_box}>
        <div className={styles.avatarBox}>
          <div className={styles.avatar}>
            <img
              // src={`${baseUrl}/${store.user.image.url}`
              src={`${baseUrl}/avatar-test.png`}
              height="66px"
            />
          </div>
          <div className={styles.level}>{store.user.level}</div>
          <div className={styles.username}>{store.user.username}</div>
          <ProgressBar progress={store.user.xp} max={50} />

          <div className={styles.xp}>XP {store.user.xp}/50</div>
          {/* <div className="btn btn-action" onClick={() => followBuddy()}>
            Follow
          </div> */}
        </div>
      </div>
      <Link href="/settings">
        <div className={styles.settings}>
          <img src={settingsIcon} height="25px" />
        </div>
      </Link>
    </div>
  );
};

export const Tabs = ({ tabState, setTab, tabs }) => {
  const Tab = ({ tabState, setTab, tab, link }) => {
    return (
      <a
        href={`#${link ? link : ""}`}
        className={cx(
          styles.tabsButton,
          tabState === tab.label && styles.active
        )}
      >
        <div onClick={() => setTab(tab.label)}>
          {tab.label}
          {tab.count !== -1 && (
            <div className={styles.tabCounter}>{tab.count ? tab.count : 0}</div>
          )}
        </div>
      </a>
    );
  };
  return (
    <div className={styles.tabs}>
      {tabs.map((t, i) => {
        return (
          <Tab
            key={i}
            tabState={tabState}
            setTab={setTab}
            tab={t}
            link={t.link}
          />
        );
      })}
    </div>
  );
};
