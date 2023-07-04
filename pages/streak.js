// *** REACT ***

import { useContext, useState } from "react";

import { ArtifactModal } from "./profile";
import { BackButton } from "@/components/reusable/BackButton";
import Card from "@/components/Card";
import { Context } from "@/context/store";
import { GET_STREAKS_QUERY } from "@/GQL/query";
import { GemReward } from "./buddies-rewards";
import Modal from "@/components/reusable/Modal";
import { collectStreakReward } from "@/actions/action";
import cx from "classnames";
import styles from "@/styles/Streak.module.scss";
import { withUser } from "@/Hoc/withUser";

import baseUrl from "@/utils/settings";
import RewardsModal from "@/components/RewardsModal";
import useModal from "@/hooks/useModal";

const calculateReward = (
  reward_type,
  streak_count,
  artifact,
  reward_card,
  user
) => {
  if (reward_type === "artifact") {
    return {
      name: `Streak ${streak_count}`,
      reward: {
        name: artifact.name,
        image: artifact.image,
        rarity: artifact.rarity,
        type: reward_type,
        isCollected: true,
        require: artifact.require,
        progress: user.highest_buddy_shares,
      },
    };
  }
  if (reward_type === "stars") {
    return { name: `Streak ${streak_count}`, image: { url: "/star.png" } };
  }
  if (reward_type === "card") {
    return { name: `Streak ${streak_count}`, reward: reward_card };
  }
};

const Streak = ({ streak, user, dispatch }) => {
  const {
    reward_type,
    artifact,
    reward_card,
    reward_amount,
    streak_count,
    is_collected,
    is_ready,
  } = streak;

  console.log("usercards{", user.usercards);
  console.log({ reward_card });

  const reward = calculateReward(
    reward_type,
    streak_count,
    artifact,
    reward_card,
    user
  );
  const [isRewardModalShowing, setIsRewardModalShowing] = useState(false);

  return (
    <div
      className={cx(
        styles.streak,
        is_ready && [styles.isReady],
        is_collected && [styles.isCollected]
      )}
      onClick={() => {
        is_ready &&
          !is_collected &&
          collectStreakReward(dispatch, streak_count);
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
            <div
              className={styles.image}
              onClick={() => setIsRewardModalShowing(true)}
            >
              <img src={`${baseUrl}${reward.reward?.image?.url}`} />

              <div className={styles.streak_amount}>x{reward_amount || 1}</div>
            </div>
          ) : (
            <div className={styles.streak_name}>
              <GemReward amount={reward_amount} />
            </div>
          )}
        </>
      )}
      <Modal
        isShowing={isRewardModalShowing}
        closeModal={() => setIsRewardModalShowing(false)}
        isSmall
        jsx={
          <>
            {reward_type === "artifact" && (
              <ArtifactModal
                artifact={reward.reward}
                openModal={() => setIsRewardModalShowing(true)}
              />
            )}
            {reward_type === "card" && (
              <div className="flex_center">
                <Card
                  card={reward.reward}
                  openModal={() => setIsRewardModalShowing(true)}
                />
              </div>
            )}
          </>
        }
      />
    </div>
  );
};

const StreakTower = (props) => {
  const { isShowing, openModal, closeModal } = useModal();
  const { store, user, data, dispatch } = props;
  const mergeStreaks = (streaks, userStreaks) => {
    if (!userStreaks) {
      return streaks.map((s) => {
        return {
          ...s,
          is_collected: false,
          is_ready: user.highest_streak_count >= s.streak_count,
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
        is_ready: user.highest_streak_count >= s.streak_count,
      };
    });

    return transformedData;
  };

  return (
    <div className="background_dark">
      <div className="section">
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
              {user.highest_streak_count}
            </div>
          </div>
          <div className={styles.subTitle}>Log in daily to unlock rewards.</div>
          <div className={styles.subTitle_muted}>
            It takes only 1 second to log in and claim.
          </div>

          {data && user && (
            <div className={styles.streakContainer}>
              {mergeStreaks(data.streakrewards, user.streak_rewards)
                .sort((a, b) => a.id - b.id)
                .map((streak, i) => {
                  return (
                    <Streak
                      streak={streak}
                      user={user}
                      dispatch={dispatch}
                      key={i}
                    />
                  );
                })}
            </div>
          )}
        </>
      </div>
      <Modal
        isShowing={store.rewardsModal?.isOpen}
        closeModal={closeModal}
        showCloseButton={false}
        jsx={<RewardsModal />}
        isSmall
      />
    </div>
  );
};

export default withUser(StreakTower, GET_STREAKS_QUERY);
