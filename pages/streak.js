// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useRouter } from "next/router";
// *** COMPONENTS ***
import { Rarity } from "../components/Rarity";

// *** ACTIONS ***
import { claimStreakReward } from "../actions/action";

import { normalize } from "../utils/calculations";
import { BackButton } from "../components/reusableUI";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Streak.module.scss";
import { GET_STREAKS_QUERY } from "../GQL/query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Streak = ({ streak, isSelected, setSelectedStreak }) => {
  const {
    name,
    reward_card,
    reward_box,
    id,
    reward_amount,
    streak_count,
    is_collected,
    is_ready,
  } = streak;

  const reward = reward_card ? reward_card : reward_box;

  return (
    <div
      className={cx(
        styles.streak,
        isSelected && [styles.active],
        is_ready && [styles.isReady],
        is_collected && [styles.isCollected]
      )}
      onClick={() =>
        setSelectedStreak({ streak_count, is_ready, is_collected })
      }
    >
      <div className="flex_center">
        <div className={styles.image}>
          {is_collected ? (
            <img src={`${baseUrl}/checked.png`} height="20px" />
          ) : (
            <img src={reward.image.url} alt="" />
          )}
          {!is_collected && (
            <div className={styles.streak_amount}>x{reward_amount || 1}</div>
          )}
        </div>
        <div className="ml1">
          <div className={styles.streak_name}>{reward.name}</div>
          {reward.rarity && <Rarity rarity={reward.rarity} />}
        </div>
      </div>

      <div className={styles.streakIcon}>
        <img src={`${baseUrl}/streak.png`} alt="" />
        <div className={styles.streakIcon_amount}>{streak_count}</div>
      </div>
    </div>
  );
};

const StreakTower = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_STREAKS_QUERY);
  const [selectedStreak, setSelectedStreak] = useState(0);
  const router = useRouter();

  const gql_data = data && normalize(data);

  const mergeStreaks = (streaks, userStreaks) => {
    if (!userStreaks) {
      return streaks;
    }
    return streaks.map((s) => {
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
  };

  return (
    <div className="background_dark">
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {data && (
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
                    const isSelected =
                      parseInt(streak.streak_count) ===
                      selectedStreak.streak_count;
                    return (
                      <Streak
                        streak={streak}
                        key={i}
                        isSelected={isSelected}
                        setSelectedStreak={setSelectedStreak}
                      />
                    );
                  })}
              </div>
            )}
            <div className={styles.fixed}>
              <div
                className={cx(
                  "btn",
                  selectedStreak.is_ready && !selectedStreak.is_collected
                    ? "btn-primary"
                    : "btn-disabled"
                )}
                onClick={() => {
                  selectedStreak.is_ready &&
                    !selectedStreak.is_collected &&
                    claimStreakReward(dispatch, selectedStreak.streak_count);
                }}
              >
                Claim
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StreakTower;
