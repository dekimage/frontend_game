// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";

// *** COMPONENTS ***
import RewardImage from "../components/RewardImage";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import clseIcon from "../assets/close.svg";
import settingsIcon from "../assets/menu-settings-dark.svg";

// *** ACTIONS ***
import { purchaseProduct } from "../actions/action";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Profile.module.scss";

const Template = () => {
  const [store, dispatch] = useContext(Context);

  return (
    <div className="background_dark">
      {/* <Header /> */}
      <div className="section_container">
        <div className={styles.profileHeader}>
          <div className={styles.escape}>
            <img src={clseIcon} height="25px" />
          </div>
          <div className={styles.profileHeader_box}>
            <div className={styles.avatarBox}>
              <div className={styles.avatar}>img</div>
              <div className={styles.level}>25</div>
              <div className={styles.xp}>XP 230/400</div>
            </div>
          </div>
          <div className={styles.settings}>
            <img src={settingsIcon} height="25px" />
          </div>
        </div>

        <div className={styles.tabs}>
          <div className={styles.tabsButton}>Stats</div>
          <div className={styles.tabsButton}>Buddies</div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statsBox}>
          <div className={styles.statsBox_img}>img</div>
          <div className={styles.statsBox_stats}>35/100</div>
          <div className={styles.statsBox_text}>Completed Cards</div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Template;
