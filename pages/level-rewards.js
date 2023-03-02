// *** REACT ***

import { useContext, useEffect, useState } from "react";

import { BackButton } from "../components/reusableUI";
import { Context } from "../context/store";
import { GET_REWARDS_QUERY } from "../GQL/query";
import Link from "next/link";
import RewardImage from "../components/RewardImage";
import { claimLevelReward } from "../actions/action";
import cx from "classnames";
import iconLock from "../assets/lock-white.svg";
import { normalize } from "../utils/calculations";
import styles from "../styles/LevelRewards.module.scss";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

// *** COMPONENTS ***

// *** ACTIONS ***

// *** DATA ***

// *** STYLES ***

const LevelReward = ({
  level: {
    id,
    level,
    isPremiumLock,
    reward_type,
    reward_amount,
    isCollected,
    isReadyToCollect,
    is_premium,
    artifact = false,
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
        isPremiumLock={isPremiumLock}
        isUserPremium={store.user.is_subscribed}
        isPremium={is_premium}
        artifact={artifact}
      />
      {isPremiumLock && (
        <div className={styles.lock}>
          <img src={iconLock} height="13px" />
        </div>
      )}
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
      const isReadyToCollect = store.user.level >= level.level && !isCollected;

      const isPremiumLock = !store.user.is_subscribed && level.is_premium;
      level.isCollected = isCollected;
      level.isReadyToCollect = isReadyToCollect;
      level.isPremiumLock = isPremiumLock;
      return level;
    });

    return levels;
  };

  console.log(
    gql_data &&
      joinArrays(filterPremium(gql_data.levelrewards, "free")).sort(
        (a, b) => a.level - b.level
      )
  );
  console.log(
    gql_data &&
      joinArrays(filterPremium(gql_data.levelrewards, "premium")).sort(
        (a, b) => a.level - b.level
      )
  );

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {data && (
        <>
          <div className={styles.headerr}>
            <BackButton routeDynamic={""} routeStatic={""} isBack />
            <div className={styles.label}>Rewards Tower</div>
          </div>
          <div className="section_container">
            <div className={styles.header}>
              {/* <h1>Rewards Tower</h1> */}

              <div className="mb1">Collect rewards for leveling up!</div>
              <div className={styles.header_ctabox}>
                <div
                  className={styles.freeLabel}
                  style={{ marginRight: "1rem" }}
                >
                  Free Tier
                </div>
                {store.user.is_subscribed ? (
                  <div
                    className={styles.freeLabel}
                    style={{ marginLeft: "1rem" }}
                  >
                    Pro Tier
                  </div>
                ) : (
                  <Link href="/shop">
                    <div
                      className={`${styles.freeLabel} ${styles.premium}`}
                      style={{ marginLeft: "1rem" }}
                    >
                      Unlock Premium
                    </div>
                  </Link>
                )}
              </div>
            </div>
            <div className={styles.levelRewardsGrid}>
              <div className={styles.levelRewardsColumn}>
                {gql_data &&
                  joinArrays(filterPremium(gql_data.levelrewards, "free"))
                    .sort((a, b) => a.level - b.level)
                    .map((level, i) => {
                      return <LevelReward level={level} key={i} />;
                    })}
              </div>
              <div className={styles.levelRewardsColumn}>
                {gql_data &&
                  filterPremium(gql_data.levelrewards, "free")
                    .sort((a, b) => a.level - b.level)
                    .map((l, i) => (
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
                  joinArrays(
                    filterPremium(gql_data.levelrewards, "premium").sort(
                      (a, b) => a.level - b.level
                    )
                  ).map((level, i) => {
                    return <LevelReward level={level} key={i} />;
                  })}
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
        </>
      )}
    </div>
  );
};

export default LevelRewardsTower;
