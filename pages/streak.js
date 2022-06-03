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

import { normalize } from "../utils/calculations";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Streak.module.scss";

const baseUrl = process.env.NEXT_PUBLIC_API_AWS;

const GET_STREAKS_QUERY = gql`
  query {
    streakrewards {
      data {
        id
        attributes {
          reward_amount
          streak_count
          reward_card {
            data {
              id
              attributes {
                name
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          reward_box {
            data {
              id
              attributes {
                name
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
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
            <img src={`${baseUrl}/checked.png`} height="20px" />
          ) : (
            <img src={reward.image.url} alt="" />
          )}
          {!isCollected && (
            <div className={styles.streak_amount}>x{reward_amount || 1}</div>
          )}
        </div>

        <div className={styles.streak_name}>{reward.name}</div>
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
          <img src={`${baseUrl}/streak_305510ebfc.png`} height="60px" />
          <div className={styles.streakTitle_amount}>
            {store.user.highest_streak_count}
          </div>
        </div>
        <div className={styles.subTitle}>Log in daily to unlock rewards.</div>
        <div className={styles.subTitle_muted}>
          It takes only 1 second to log in and claim.
        </div>
        {gql_data && store.user && (
          <div>
            {mergeStreaks(
              gql_data.streakrewards,
              store.user.streak_rewards
            ).map((streak, i) => {
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
            })}
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
