// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useRouter } from "next/router";
import Link from "next/link";
import router from "next/router";

// *** COMPONENTS ***

import clseIcon from "../assets/close.svg";

// *** ACTIONS ***
import { followBuddy } from "../actions/action";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Settings.module.scss";

const settings = [
  {
    label: "Account",
    link: "account",
  },
  {
    label: "Notifications",
    link: "notifications",
  },
  {
    label: "Subscription",
    link: "subscription",
  },
  {
    label: "Purchases",
    link: "purchases",
  },
  {
    label: "FAQ",
    link: "faq",
  },
  {
    label: "Support",
    link: "support",
  },
  {
    label: "My Data",
    link: "data",
  },
  {
    label: "Terms & Conditions",
    link: "terms",
  },
  {
    label: "Privacy Policy",
    link: "privacy",
  },
];

const Setting = ({ settings }) => {
  return (
    <div
      className={styles.settingsItem}
      // onClick={() => setActiveSettings(settings.link)}
    >
      {settings.label}
    </div>
  );
};

const Settings = () => {
  const [store, dispatch] = useContext(Context);
  const router = useRouter();

  return (
    <div className="background_dark">
      <div className="section_container">
        <div className={styles.header}>
          <Link href="/profile">
            <div className={styles.back}>
              <ion-icon name="chevron-back-outline"></ion-icon>
            </div>
          </Link>
          <div className={styles.title}>Settings</div>
        </div>
        {settings.map((set, i) => {
          return <Setting settings={set} key={i} />;
        })}
      </div>
      <div className={styles.footer}>
        <div>Logged in as: {store.user.email}</div>
        <div>Version 1.0.0.4 (2210)</div>
        <div className="btn btn-primary btn-stretch mt1">Log Out</div>
      </div>
    </div>
  );
};

export default Settings;
