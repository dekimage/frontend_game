// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useRouter } from "next/router";
// *** COMPONENTS ***
import { ImageUI } from "../components/reusableUI";
import Link from "next/link";

// *** ACTIONS ***
import { claimStreakReward } from "../actions/action";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Streak.module.scss";

const GET_STREAKS_QUERY = gql`
  {
    streaks {
      id
      reward_box {
        image {
          url
        }
        name
      }
      reward_card {
        id
        image {
          url
        }
        name
      }
      reward_amount
      streak_count
      isCheckPoint
    }
  }
`;

const Streak = ({ streak, isSelected, setSelectedStreak }) => {
  const {
    name,
    reward_card,
    reward_box,
    id,
    reward_amount,
    streak_count,
    isCollected,
    isReady,
  } = streak;

  const reward = reward_card ? reward_card : reward_box;

  return (
    <div
      className={cx(
        styles.streak,
        isSelected && [styles.active],
        isReady && [styles.isReady],
        isCollected && [styles.isCollected]
      )}
      onClick={() => setSelectedStreak({ streak_count, isReady, isCollected })}
    >
      <div className="flex_center">
        <div className={styles.image}>
          {isCollected ? (
            <img src={`http://localhost:1337/checked.png`} height="20px" />
          ) : (
            <img src={`http://localhost:1337${reward.image.url}`} alt="" />
          )}
          {!isCollected && (
            <div className={styles.streak_amount}>x{reward_amount || 1}</div>
          )}
        </div>

        <div className={styles.streak_name}>{reward.name}</div>
      </div>

      <div className={styles.streakIcon}>
        <img src={`http://localhost:1337/streak.png`} alt="" />
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

  const mergeStreaks = (streaks, userStreaks) => {
    return streaks.map((s) => {
      if (userStreaks[s.streak_count]) {
        return {
          ...s,
          isCollected: true,
        };
      }

      return {
        ...s,
        isReady: store.user.highest_streak_count >= s.streak_count,
      };
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading Streaks...</div>;
  }

  return (
    <div className="background_dark">
      <div className="section">
        <div className={styles.header}>
          <div className={styles.back} onClick={() => router.back()}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>

          <div className={styles.label}>Streak</div>
        </div>

        <div className={styles.streakTitle}>
          <img src={`http://localhost:1337/streak.png`} height="60px" />
          <div className={styles.streakTitle_amount}>
            {store.user.highest_streak_count}
          </div>
        </div>
        <div className={styles.subTitle}>Log in daily to unlock rewards.</div>
        <div className={styles.subTitle_muted}>
          It takes only 1 second to log in and claim.
        </div>
        {data && store.user && store.user.streak_rewards && (
          <div>
            {mergeStreaks(data.streaks, store.user.streak_rewards).map(
              (streak, i) => {
                const isSelected =
                  parseInt(streak.streak_count) === selectedStreak.streak_count;
                return (
                  <Streak
                    streak={streak}
                    key={i}
                    isSelected={isSelected}
                    setSelectedStreak={setSelectedStreak}
                  />
                );
              }
            )}
          </div>
        )}
        <div className={styles.fixed}>
          <div
            className={cx(
              "btn",
              selectedStreak.isReady && !selectedStreak.isCollected
                ? "btn-primary"
                : "btn-disabled"
            )}
            onClick={() => {
              selectedStreak.isReady &&
                !selectedStreak.isCollected &&
                claimStreakReward(dispatch, selectedStreak.streak_count);
            }}
          >
            Claim
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakTower;
