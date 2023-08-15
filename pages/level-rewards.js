import { BackButton } from "@/components/reusable/BackButton";
import { GET_REWARDS_QUERY } from "@/GQL/query";
import Link from "next/link";
import RewardImage from "@/components/RewardImage";
import { claimLevelReward } from "@/actions/action";
import cx from "classnames";
import iconLock from "@/assets/lock-white.svg";
import styles from "@/styles/LevelRewards.module.scss";
import { useRouter } from "next/router";
import { withUser } from "@/Hoc/withUser";
import { useState } from "react";
import Modal from "@/components/reusable/Modal";
import RewardsModal from "@/components/RewardsModal";
import useModal from "@/hooks/useModal";

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
  dispatch,
  user,
}) => {
  const router = useRouter();
  return (
    <div
      className={styles.levelReward}
      key={level}
      onClick={() => {
        isReadyToCollect && !isPremiumLock && claimLevelReward(dispatch, id);
        isPremiumLock && router.push("/shop");
      }}
    >
      <RewardImage
        reward={reward_type}
        amount={reward_amount}
        isCollected={isCollected}
        isReadyToCollect={isReadyToCollect}
        isPremiumLock={isPremiumLock}
        isUserPremium={user.is_subscribed}
        isPremium={is_premium}
        artifact={artifact}
        userLevel={user?.level}
      />
      {isPremiumLock && (
        <div className={styles.lock}>
          <img src={iconLock} height="13px" />
        </div>
      )}
    </div>
  );
};

const LevelRewardsTower = (props) => {
  const { store, user, data, dispatch } = props;
  const { closeModal } = useModal();

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
        !!user.rewards_tower && !!user.rewards_tower[level.id];
      const isReadyToCollect = user.level >= level.level && !isCollected;

      const isPremiumLock = !user.is_subscribed && level.is_premium;
      level.isCollected = isCollected;
      level.isReadyToCollect = isReadyToCollect;
      level.isPremiumLock = isPremiumLock;
      return level;
    });

    return levels;
  };

  // console.log(
  //   data &&
  //     joinArrays(filterPremium(data.levelrewards, "free")).sort(
  //       (a, b) => a.level - b.level
  //     )
  // );
  // console.log(
  //   data &&
  //     joinArrays(filterPremium(data.levelrewards, "premium")).sort(
  //       (a, b) => a.level - b.level
  //     )
  // );

  return (
    <div className="background_dark">
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
              <div className={styles.freeLabel} style={{ marginRight: "1rem" }}>
                Free Tier
              </div>
              {user.is_subscribed ? (
                <div
                  className={styles.freeLabel}
                  style={{ marginLeft: "1rem" }}
                >
                  Pro Tier
                </div>
              ) : (
                <Link href="/shop">
                  <div
                    className={`${styles.freeLabel} `}
                    style={{ marginLeft: "1rem", cursor: "pointer" }}
                  >
                    <div className="proLabel mr5">PRO</div> Tier
                  </div>
                </Link>
              )}
            </div>
          </div>
          <div className={styles.levelRewardsGrid}>
            <div className={styles.levelRewardsColumn}>
              {data &&
                joinArrays(filterPremium(data.levelrewards, "free"))
                  .sort((a, b) => a.level - b.level)
                  .map((level, i) => {
                    return (
                      <LevelReward
                        level={level}
                        user={user}
                        dispatch={dispatch}
                        key={i}
                      />
                    );
                  })}
            </div>
            <div className={styles.levelRewardsColumn}>
              {data &&
                filterPremium(data.levelrewards, "free")
                  .sort((a, b) => a.level - b.level)
                  .map((l, i) => (
                    <div className={styles.levelRewardLevel} key={i}>
                      <div
                        className={cx([styles.levelRewardLevel__stripe], {
                          [styles.passed]: l.level <= user.level,
                        })}
                      ></div>
                      <div
                        className={cx([styles.levelRewardLevel__text], {
                          [styles.passed]: l.level <= user.level,
                        })}
                      >
                        {l.level}
                      </div>
                    </div>
                  ))}
            </div>

            <div className={styles.levelRewardsColumn}>
              {data &&
                joinArrays(
                  filterPremium(data.levelrewards, "premium").sort(
                    (a, b) => a.level - b.level
                  )
                ).map((level, i) => {
                  return (
                    <LevelReward
                      level={level}
                      user={user}
                      dispatch={dispatch}
                      key={i}
                    />
                  );
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

export default withUser(LevelRewardsTower, GET_REWARDS_QUERY);
