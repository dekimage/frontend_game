// *** REACT ***

import { useContext, useEffect, useState } from "react";

import { BackButton } from "../components/reusableUI";
import { Context } from "../context/store";
import { GET_STREAKS_QUERY } from "../GQL/query";
import { GemReward } from "./buddies-rewards";
import { Rarity } from "../components/Rarity";
import { claimStreakReward } from "../actions/action";
import cx from "classnames";
import { gql } from "apollo-boost";
import { normalize } from "../utils/calculations";
import styles from "../styles/Streak.module.scss";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

// *** COMPONENTS ***

// *** ACTIONS ***

// *** STYLES ***

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Streak = ({ streak, dispatch }) => {
  const {
    reward_type,
    artifact,
    reward_amount,
    streak_count,
    is_collected,
    is_ready,
  } = streak;

  const calculateReward = (reward_type) => {
    if (reward_type === "artifact") {
      return { name: `Streak ${streak_count}`, artifact };
    }
    if (reward_type === "stars") {
      return { name: `Streak ${streak_count}`, image: { url: "/star.png" } };
    }
  };

  const reward = calculateReward(reward_type);

  console.log(1, reward);

  return (
    <div
      className={cx(
        styles.streak,
        is_ready && [styles.isReady],
        is_collected && [styles.isCollected]
      )}
      onClick={() => {
        is_ready && !is_collected && claimStreakReward(dispatch, streak_count);
      }}
      // onClick={() =>
      //   setSelectedStreak({ streak_count, is_ready, is_collected })
      // }
    >
      {is_collected && (
        <div className={styles.completedMark}>
          <img src={`${baseUrl}/checked.png`} height="20px" />
        </div>
      )}
      {reward && (
        <>
          <div className="flex_center">
            <div className={styles.streakIcon}>
              <img src={`${baseUrl}/streak.png`} alt="" />
              <div className={styles.streakIcon_amount}>{streak_count}</div>
            </div>

            <div className="ml1">
              <div className={styles.streak_name}>{reward.name}</div>
              {/* {reward.rarity && <Rarity rarity={reward.rarity} />} */}
            </div>
          </div>

          {reward_type !== "stars" ? (
            <div className={styles.image}>
              <img src={`${baseUrl}${reward.artifact?.image?.url}`} />

              <div className={styles.streak_amount}>x{reward_amount || 1}</div>
            </div>
          ) : (
            <div className={styles.streak_name}>
              <GemReward amount={reward_amount} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const StreakTower = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_STREAKS_QUERY);

  const gql_data = data && normalize(data);

  const mergeStreaks = (streaks, userStreaks) => {
    if (!userStreaks) {
      return streaks.map((s) => {
        return {
          ...s,
          is_collected: false,
          is_ready: store.user.highest_streak_count >= s.streak_count,
        };
      });
    }

    const transformedData = streaks.map((s) => {
      if (userStreaks[s.streak_count]) {
        return {
          ...s,
          is_collected: true,
        };
      }

      return {
        ...s,
        is_ready: store.user.highest_streak_count >= s.streak_count,
      };
    });

    return transformedData;
  };

  return (
    <div className="background_dark">
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {data && store.user && (
          <>
            <div className={styles.header}>
              <BackButton routeDynamic={""} routeStatic={""} isBack />

              <div className={styles.label}>Highest Streak</div>
            </div>

            <div className={styles.streakTitle}>
              <div style={{ position: "relative" }}>
                <img src={`${baseUrl}/streak.png`} height="60px" />
              </div>

              <div className={styles.streakTitle_amount}>
                {store.user.highest_streak_count}
              </div>
            </div>
            <div className={styles.subTitle}>
              Log in daily to unlock rewards.
            </div>
            <div className={styles.subTitle_muted}>
              It takes only 1 second to log in and claim.
            </div>

            {gql_data && store.user && (
              <div className={styles.streakContainer}>
                {mergeStreaks(gql_data.streakrewards, store.user.streak_rewards)
                  .sort((a, b) => a.id - b.id)
                  .map((streak, i) => {
                    return (
                      <Streak streak={streak} key={i} dispatch={dispatch} />
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StreakTower;
