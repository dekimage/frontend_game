// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
// *** COMPONENTS ***
import { ImageUI } from "../components/reusableUI";

// *** ACTIONS ***
import { claimStreakReward } from "../actions/action";

// *** DATA ***
import { levelRewards } from "../data/rewards";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Streak.module.scss";

// streak_rewards:
// {
//   "1": true,
//   "3": true,
//   "14": true
// }

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

const streakData = [
  {
    reward_type: "card",
    reward_id: 5,
    streak: 1,
  },
];

const Streak = ({ streak, isSelected, setSelectedStreak }) => {
  const {
    name,
    reward_card,
    reward_box,
    id,
    reward_amount,
    streak_count,
    isCheckPoint,
    isCollected,
    isReady,
  } = streak;

  const reward = reward_card ? reward_card : reward_box;

  return (
    <div
      className={cx(styles.streak, isSelected && styles.active)}
      onClick={() => setSelectedStreak(streak_count)}
    >
      <div className={styles.image}>
        <img src={`http://localhost:1337${reward.image.url}`} alt="" />
        <div className={styles.streak_amount}>x{reward_amount || 1}</div>
      </div>

      <div className={styles.streak_name}>{reward.name}</div>

      {/* <div>{streak_count}</div> */}
      {/* <div>{isCollected && "CLaimed!"}</div> */}
      {/* <div>{isReady && "Ready To Collect!"}</div> */}
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

  // console.log(store.user && store.user.streak_rewards);
  console.log(selectedStreak);

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
        <div className={styles.label}>Streak</div>
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
                  parseInt(streak.streak_count) === selectedStreak;
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
            className="btn btn-primary"
            onClick={() => {
              claimStreakReward(dispatch, selectedStreak);
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
