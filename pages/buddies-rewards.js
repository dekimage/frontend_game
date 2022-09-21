// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
// *** COMPONENTS ***
import { Rarity } from "../components/Rarity";

// *** ACTIONS ***
import { claimStreakReward } from "../actions/action";

import { normalize } from "../utils/calculations";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Streak.module.scss";
import { GET_FRIENDS_QUERY } from "../GQL/query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const FriendReward = ({ friendReward, isSelected, setSelectedReward }) => {
  const { reward_card, reward_amount, friends_count, is_collected, is_ready } =
    friendReward;

  return (
    <div
      className={cx(
        styles.streak,
        isSelected && [styles.active],
        is_ready && [styles.isReady],
        is_collected && [styles.isCollected]
      )}
      onClick={() => setSelectedReward({ friends_count })}
    >
      <div className="flex_center">
        <div className={styles.image}>
          {is_collected ? (
            <img src={`${baseUrl}/checked.png`} height="20px" />
          ) : (
            <img src={reward_card.image.url} alt="" />
          )}
          {!is_collected && (
            <div className={styles.streak_amount}>x{reward_amount || 1}</div>
          )}
        </div>

        <div className={styles.streak_name}>
          <div className="ml1">
            <div className={styles.streak_name}>{reward_card.name}</div>
            <Rarity rarity={reward_card.rarity} />
          </div>
          <div className={styles.gemReward}>
            <div className={styles.gemReward_name}>+ 10</div>
            <img src={`${baseUrl}/gem.png`} alt="" height="14px" />
          </div>
        </div>
      </div>

      <div className={styles.streakIcon}>
        <img src={`${baseUrl}/user.png`} alt="" />
        <div className={styles.streakIcon_amount}>{friends_count}</div>
      </div>
    </div>
  );
};

const FriendsTower = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_FRIENDS_QUERY);
  const [selectedReward, setSelectedReward] = useState(0);
  const router = useRouter();

  const gql_data = data && normalize(data);

  const mergeStreaks = (rewards, userRewards) => {
    if (!userRewards) {
      return rewards;
    }
    console.log(rewards);
    return rewards.map((s) => {
      if (userRewards[s.friends_count]) {
        return {
          ...s,
          is_collected: true,
        };
      }

      return {
        ...s,
        is_ready: store.user.highest_buddy_shares >= s.friends_count,
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

          <div className={styles.label}>Buddy Rewards</div>
        </div>

        <div className={styles.streakTitle}>
          <div style={{ position: "relative" }}>
            <img src={`${baseUrl}/user.png`} height="60px" />
          </div>

          <div className={styles.streakTitle_amount}>
            {store.user.highest_buddy_shares}
          </div>
        </div>
        <div className={styles.subTitle}>
          Help your buddies improve with you.
        </div>
        <div className={styles.subTitle_muted}>
          For each buddy you bring, both of you get an exclusive reward!
        </div>
        {gql_data && store.user && (
          <div>
            {mergeStreaks(gql_data.friendrewards, store.user.friends_rewards)
              .sort((a, b) => a.id - b.id)
              .map((friendReward, i) => {
                const isSelected =
                  parseInt(friendReward.friends_count) ===
                  selectedReward.friends_count;
                return (
                  <FriendReward
                    friendReward={friendReward}
                    key={i}
                    isSelected={isSelected}
                    setSelectedReward={setSelectedReward}
                  />
                );
              })}
          </div>
        )}

        <div className="btn btn-stretch btn-primary mt1 mb1">
          <img src={`${baseUrl}/add-user.png`} height="20px" className="mr1" />
          Share Buddy Link
        </div>
        <div className="description_muted">
          * The buddy must confirm their email address and complete the tutorial
          to unlock the rewards.
        </div>

        <div className={styles.fixed}>
          <div
            className={cx(
              "btn",
              selectedReward.is_ready && !selectedReward.is_collected
                ? "btn-primary btn-stretch"
                : "btn-disabled btn-stretch"
            )}
            onClick={() => {
              selectedReward.is_ready &&
                !selectedReward.is_collected &&
                claimStreakReward(dispatch, selectedReward.friends_count);
            }}
          >
            Claim
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsTower;
