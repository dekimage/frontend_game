// *** REACT ***

import { ImageUI } from "@/components/reusableUI";
import { useContext, useEffect, useState } from "react";
import { BackButton } from "@/components/reusable/BackButton";

import { ArtifactModal } from "./profile";
import Card from "@/components/Card";
import { GET_FRIENDS_QUERY } from "@/GQL/query";
import Modal from "@/components/reusable/Modal";
import ShareBuddyModal from "@/components/Modals/ShareBuddyModal";
import { collectFriendsReward } from "@/actions/action";
import cx from "classnames";
import { normalize } from "@/utils/calculations";
import styles from "@/styles/Streak.module.scss";
import useModal from "@/hooks/useModal";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { withUser } from "@/Hoc/withUser";

import baseUrl from "@/utils/settings";

// *** COMPONENTS ***

// *** ACTIONS ***

// *** STYLES ***

const FriendReward = ({ friendReward, user, dispatch }) => {
  const {
    reward_type,
    reward_card,
    reward_amount,
    friends_count,
    is_collected,
    is_ready,
    artifact,
  } = friendReward;

  const calculateReward = (reward_type) => {
    if (reward_type === "artifact") {
      console.log(artifact);
      return {
        name: artifact.name,
        image: artifact.image,
        rarity: artifact.rarity,
        type: reward_type,
        isCollected: true,
        require: artifact.require,
        progress: user.highest_buddy_shares,
      };
    }
    if (reward_type === "card") {
      return reward_card;
    }
    return false;
  };
  const reward = calculateReward(reward_type);
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
          collectFriendsReward(dispatch, friends_count);
      }}
    >
      {is_collected && (
        <div className={styles.completedMark}>
          <img src={`${baseUrl}/checked.png`} height="20px" />
        </div>
      )}

      <div className={styles.streakIcon}>
        <img src={`${baseUrl}/user.png`} alt="" />
        <div className={styles.streakIcon_amount}>{friends_count}</div>
      </div>

      {is_ready && !is_collected ? (
        "Claim"
      ) : (
        <div>Buddy Reward {friends_count}</div>
      )}

      <div className="flex_center">
        <div
          className={styles.image}
          onClick={() => setIsRewardModalShowing(true)}
        >
          <ImageUI url={reward?.image?.url} />

          {!is_collected && (
            <div className={styles.streak_amount}>x{reward_amount || 1}</div>
          )}
        </div>
        <div className={styles.streak_name}>
          {/* <div className="ml1">
            <div className={styles.streak_name}>{reward.name}</div>
            <Rarity rarity={reward.rarity} />
          </div> */}
          <GemReward amount={400} />
        </div>
      </div>
      <Modal
        isShowing={isRewardModalShowing}
        closeModal={() => setIsRewardModalShowing(false)}
        isSmall
        jsx={
          <>
            {reward_type === "artifact" && (
              <ArtifactModal
                artifact={reward}
                openModal={() => setIsRewardModalShowing(true)}
              />
            )}
            {reward_type === "card" && (
              <div className="flex_center">
                <Card
                  card={reward}
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

export const XpReward = ({ amount }) => {
  return (
    <div className={styles.gemReward}>
      <div className={styles.gemReward_name}> {amount}</div>
      <img src={`${baseUrl}/xp.png`} alt="" height="14px" />
    </div>
  );
};

export const GemReward = ({ amount }) => {
  return (
    <div className={styles.gemReward}>
      <div className={styles.gemReward_name}> {amount}</div>
      <img src={`${baseUrl}/star.png`} alt="" height="14px" />
    </div>
  );
};
const FriendsTower = (props) => {
  const { user, data, dispatch } = props;

  const { isShowing, openModal, closeModal } = useModal();

  const mergeStreaks = (rewards, userRewards) => {
    if (!userRewards) {
      return rewards;
    }

    return rewards.map((s) => {
      if (userRewards[s.friends_count]) {
        return {
          ...s,
          is_collected: true,
        };
      }

      return {
        ...s,
        is_ready: user.highest_buddy_shares >= s.friends_count,
      };
    });
  };

  return (
    <div className="background_dark">
      <div className="section">
        <>
          <div className={styles.header}>
            <BackButton routeDynamic={""} routeStatic={""} isBack />

            <div className={styles.label}>Buddy Rewards</div>
          </div>

          <div className={styles.streakTitle}>
            <div style={{ position: "relative" }}>
              <img src={`${baseUrl}/user.png`} height="60px" />
            </div>

            <div className={styles.streakTitle_amount}>
              {user.highest_buddy_shares}
            </div>
          </div>
          <div className={styles.subTitle}>
            Help your buddies improve with you.
          </div>
          <div className={styles.subTitle_muted}>
            For each buddy you bring, both of you get an exclusive reward!
          </div>
          <div className="flex_between">
            <div className="title">Shared Buddies </div>
            <div className="title">{user.highest_buddy_shares}/10</div>
          </div>
          {data && user && (
            <div>
              {mergeStreaks(data.friendrewards, user.friends_rewards)
                .sort((a, b) => a.id - b.id)
                .map((friendReward, i) => {
                  return (
                    <FriendReward
                      friendReward={friendReward}
                      user={user}
                      dispatch={dispatch}
                      key={i}
                    />
                  );
                })}
            </div>
          )}

          <div
            className="btn btn-stretch btn-primary mt1 mb1"
            onClick={openModal}
          >
            <img
              src={`${baseUrl}/add-user.png`}
              height="20px"
              className="mr1"
            />
            Share Buddy Link
          </div>
        </>

        <Modal
          isShowing={isShowing}
          closeModal={closeModal}
          isSmall
          jsx={<ShareBuddyModal id={user.id} />}
        />
      </div>
    </div>
  );
};

export default withUser(FriendsTower, GET_FRIENDS_QUERY);
