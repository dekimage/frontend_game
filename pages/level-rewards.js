// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";

// *** COMPONENTS ***
import RewardImage from "../components/RewardImage";

// *** ACTIONS ***
import { purchaseProduct } from "../actions/action";

// *** DATA ***
import { levelRewards } from "../data/rewards";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/LevelRewards.module.scss";

const LevelReward = ({
  level: { level, reward, qty, isCollected, isReadyToCollect },
}) => {
  return (
    <div className={styles.levelReward} key={level}>
      <RewardImage
        reward={reward}
        amount={qty}
        isCollected={isCollected}
        isReadyToCollect={isReadyToCollect}
      />
      {/* <div>{level}</div> */}

      {/* <div>{isCollected ? "COMPLETE DONE" : "NOT COMPLETE"}</div> */}

      {/* <button
        onClick={() =>
          isReadyToCollect && collectLevelReward(dispatch, level)
        }
      >
        {isReadyToCollect ? "ready to collect!" : "not ready yet"}
      </button> */}
    </div>
  );
};

const LevelRewardsTower = () => {
  const [store, dispatch] = useContext(Context);

  // *** FUNCTIONS ***
  const joinArrays = (levels) => {
    levels.forEach((level) => {
      const isCollected =
        !!store.user.rewards_tower && !!store.user.rewards_tower[level.level];
      const isReadyToCollect = store.user.xp >= level.level;

      level.isCollected = isCollected;
      level.isReadyToCollect = isReadyToCollect;
      return level;
    });
    return levels;
  };
  const proxyNextReward = joinArrays(levelRewards)[4];
  return (
    <div className="background_dark">
      <div className="section_container">
        <div className={styles.header}>
          <h1>Rewards Tower</h1>
          <h3>Collect rewards for leveling up!</h3>
          <div className={styles.header_ctabox}>
            <div className="btn">Free Tier</div>
            <div className="btn btn-premium">Go Premium</div>
          </div>
        </div>
        <div className={styles.levelRewardsGrid}>
          <div className={styles.levelRewardsColumn}>
            {joinArrays(levelRewards).map((level, i) => {
              return <LevelReward level={level} key={i} />;
            })}
          </div>
          <div className={styles.levelRewardsColumn}>
            {[1, 2, 3, 4, 5].map((l, i) => (
              <div className={styles.levelRewardLevel} key={i}>
                <div
                  className={cx([styles.levelRewardLevel__stripe], {
                    [styles.passed]: l <= store.user.level,
                  })}
                ></div>
                <div
                  className={cx([styles.levelRewardLevel__text], {
                    [styles.passed]: l <= store.user.level,
                  })}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.levelRewardsColumn}>
            {joinArrays(levelRewards).map((level, i) => {
              return <LevelReward level={level} key={i} />;
            })}
          </div>
        </div>
        <div className={styles.footer}>
          <div className="btn btn-close">x</div>
          <div className={styles.footer_label}>Your next big reward:</div>
          <div className={styles.footer_reward}>
            <LevelReward level={proxyNextReward} />
            <div className={styles.footer_requiredLevel}>
              <span style={{ fontSize: "1.2rem" }}>
                {proxyNextReward.level}
              </span>
              lvl
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelRewardsTower;
