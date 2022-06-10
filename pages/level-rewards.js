// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { gql } from "apollo-boost";
import Link from "next/link";

// *** COMPONENTS ***
import RewardImage from "../components/RewardImage";

// *** ACTIONS ***
import { claimLevelReward } from "../actions/action";

// *** DATA ***
import { levelRewards } from "../data/rewards";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/LevelRewards.module.scss";
import { normalize } from "../utils/calculations";

const GET_REWARDS_QUERY = gql`
  query {
    levelrewards {
      data {
        id
        attributes {
          level
          is_premium
          reward_type
          reward_amount
        }
      }
      meta {
        pagination {
          page
          pageSize
          total
          pageCount
        }
      }
    }
  }
`;

const LevelReward = ({
  level: {
    id,
    level,
    isPremiumLock,
    reward_type,
    reward_amount,
    isCollected,
    isReadyToCollect,
  },
}) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div
      className={styles.levelReward}
      key={level}
      onClick={() =>
        isReadyToCollect && !isPremiumLock && claimLevelReward(dispatch, id)
      }
    >
      <RewardImage
        reward={reward_type}
        amount={reward_amount}
        isCollected={isCollected}
        isReadyToCollect={isReadyToCollect}
      />
      {/* {isPremiumLock && <div>"Requires Premium"</div>} */}

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
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_REWARDS_QUERY);

  const gql_data = data && normalize(data);

  const filterPremium = (levels, type) => {
    if (!levels) {
      return;
    }
    if (type === "free") {
      return levels.filter((l) => !l.is_premium);
    }
    if (type === "premium") {
      return levels.filter((l) => l.is_premium);
    }
  };

  const joinArrays = (levels) => {
    levels.forEach((level) => {
      const isCollected =
        !!store.user.rewards_tower && !!store.user.rewards_tower[level.id];
      const isReadyToCollect = store.user.level >= level.level;

      const isPremiumLock = !store.user.is_subscribed && level.is_premium;
      level.isCollected = isCollected;
      level.isReadyToCollect = isReadyToCollect;
      level.isPremiumLock = isPremiumLock;
      return level;
    });

    return levels;
  };

  const proxyNextReward = joinArrays(levelRewards)[4];

  if (loading) {
    return <div>Loading level Rewards...</div>;
  }
  if (error) {
    return <div>Error Fetching Level Rewards...</div>;
  }

  return (
    <div className="background_dark">
      <div className={styles.headerr}>
        <div className={styles.back} onClick={() => router.back()}>
          <ion-icon name="chevron-back-outline"></ion-icon>
        </div>
        <div className={styles.label}>Rewards Tower</div>
      </div>
      <div className="section_container">
        <div className={styles.header}>
          {/* <h1>Rewards Tower</h1> */}

          <div className="mb1">Collect rewards for leveling up!</div>
          <div className={styles.header_ctabox}>
            <div className="btn" style={{ width: "120px" }}>
              Free
            </div>
            <div className="btn btn-wrong">Premium</div>
          </div>
        </div>
        <div className={styles.levelRewardsGrid}>
          <div className={styles.levelRewardsColumn}>
            {gql_data &&
              joinArrays(filterPremium(gql_data.levelrewards, "free")).map(
                (level, i) => {
                  return <LevelReward level={level} key={i} />;
                }
              )}
          </div>
          <div className={styles.levelRewardsColumn}>
            {gql_data &&
              filterPremium(gql_data.levelrewards, "free").map((l, i) => (
                <div className={styles.levelRewardLevel} key={i}>
                  <div
                    className={cx([styles.levelRewardLevel__stripe], {
                      [styles.passed]: l.level <= store.user.level,
                    })}
                  ></div>
                  <div
                    className={cx([styles.levelRewardLevel__text], {
                      [styles.passed]: l.level <= store.user.level,
                    })}
                  >
                    {l.level}
                  </div>
                </div>
              ))}
          </div>

          <div className={styles.levelRewardsColumn}>
            {gql_data &&
              joinArrays(filterPremium(gql_data.levelrewards, "premium")).map(
                (level, i) => {
                  return <LevelReward level={level} key={i} />;
                }
              )}
          </div>
        </div>
        {/* <div className={styles.footer}>
          <div className="btn btn-close" onClick={() => router.back()}>
            x
          </div>
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
        </div> */}
      </div>
    </div>
  );
};

export default LevelRewardsTower;
