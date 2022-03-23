// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";

// *** COMPONENTS ***

// *** ACTIONS ***
import { purchaseProduct } from "../actions/action";

// *** DATA ***
import { levelRewards } from "../data/rewards";

const streakData = [
  {
    reward_type: "card",
    reward_id: 5,
    streak: 1,
  },
];

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/LevelRewards.module.scss";

const StreakTower = () => {
  const [store, dispatch] = useContext(Context);

  return <div className="background_dark"></div>;
};

export default StreakTower;
