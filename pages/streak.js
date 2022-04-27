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

const Streak = ({ streak, setSelectedStreak }) => {
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
      className={styles.streak}
      onClick={() => setSelectedStreak(streak_count)}
    >
      <ImageUI imgUrl={reward.image.url} className={styles.image} />
      <div>{reward.name}</div>
      <div>X{reward_amount}</div>
      <div>{streak_count}</div>
      <div>{isCollected && "CLaimed!"}</div>
      <div>{isReady && "Ready To Collect!"}</div>
    </div>
  );
};

const StreakTower = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_STREAKS_QUERY);

  const [selectedStreak, setSelectedStreak] = useState(0);

  console.log(data && data);
  console.log(store.user && store.user.streak_rewards);
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
      <div>Streak: {store.user.highest_streak_count}</div>
      {data && store.user && store.user.streak_rewards && (
        <div>
          {mergeStreaks(data.streaks, store.user.streak_rewards).map(
            (streak, i) => (
              <Streak
                streak={streak}
                key={i}
                setSelectedStreak={setSelectedStreak}
              />
            )
          )}
        </div>
      )}
      <div
        className="btn btn-primary"
        onClick={() => {
          claimStreakReward(dispatch, selectedStreak);
        }}
      >
        Claim
      </div>
    </div>
  );
};

export default StreakTower;
