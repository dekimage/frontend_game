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

// *** ACTIONS ***
import { levelUp } from "../actions/action";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Profile.module.scss";

const Template = () => {
  const [store, dispatch] = useContext(Context);

  return (
    <div className="section">
      <Header />
      <div>stats</div>
      <div>62% completed cards</div>
      <div>92% discovered cards</div>
      <div>FREE member</div>
      <div>LAST DISCOVERED</div>
      <div>card 1</div>
      <div>card 2</div>
      <div>card 3</div>
      <div>LAST COMPLETED</div>
      <div>card 1</div>
      <div>card 2</div>
      <div>card 3</div>
      <div>buddies</div>
      <div className={styles.buddy}>
        <div>img</div>
        <div>19lvl</div>
        <div>Predo Medro</div>
        <button>send love</button>
      </div>
      <div className={styles.buddy}>
        <div>img</div>
        <div>19lvl</div>
        <div>Smiki miki</div>
        <button>send love</button>
      </div>
      <div className={styles.buddy}>
        <div>img</div>
        <div>19lvl</div>
        <div>Poki koki</div>
        <div>cta icon</div>
      </div>
      <div className={styles.buddy}>
        <div>img</div>
        <div>19lvl</div>
        <div>Kris mis</div>
        <div>cta icon</div>
      </div>
      <button>Share Buddy Link</button>
      <div>collection</div>
      <div>Filter 1</div>
      <div>Filter 2</div>
      <div>Filter 3</div>
      <div>c1, c2, c3</div>
      <Navbar />
    </div>
  );
};

export default Template;
