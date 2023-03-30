import { ArtifactModal } from "../pages/profile";
import { ImageUI } from "./reusableUI";
import Modal from "./Modal";
import checkmark from "../assets/checkmark.svg";
import cx from "classnames";
import gemIcon from "../assets/diamond-currency.svg";
import starIcon from "../assets/xp.svg";
import styles from "../styles/Reward.module.scss";
import { useState } from "react";
import baseUrl from "../utils/settings";

const RewardImage = ({
  reward,
  amount,
  isCollected,
  isReadyToCollect,
  isPremiumLock,
  isPremium = false,
  isUserPremium = false,
  isTask = false,
  artifact,
  userLevel,
}) => {
  const [isRewardModalShowing, setIsRewardModalShowing] = useState(false);
  return (
    <div
      className={cx([styles.reward], {
        [styles.premium]: isPremium,
        [styles.action]: isReadyToCollect && !isCollected && !isPremiumLock,
        [styles.done]: isCollected,
        [styles.task]: isTask,
      })}
    >
      {isCollected && (
        <div className={styles.checkmark}>
          <img src={checkmark} />
        </div>
      )}
      <div className={styles.reward_image}>
        {reward == "loot" && (
          <img height="8px" src={`${baseUrl}/loot-box.png`} />
        )}
        {reward == "stars" && <img height="8px" src={`${baseUrl}/star.png`} />}
        {reward == "streak" && (
          <img height="8px" src={`${baseUrl}/streak.png`} />
        )}
        {reward == "gems" && (
          <img src={`${baseUrl}/gems.png`} height="12px" className="mb5" />
        )}
        {reward == "artifact" && artifact?.image && (
          <div
            className={styles.artifactImage}
            onClick={() => {
              !isReadyToCollect &&
                !isCollected &&
                setIsRewardModalShowing(true);
            }}
          >
            <ImageUI url={artifact?.image?.url} height="100px" width="100px" />
          </div>
        )}
      </div>
      {amount > 1 && <div className={styles.reward_amount}>{amount || 1}</div>}
      <Modal
        isShowing={isRewardModalShowing}
        closeModal={() => setIsRewardModalShowing(false)}
        isSmall
        jsx={
          <ArtifactModal
            artifact={{ ...artifact, progress: userLevel, isCollected: true }}
            openModal={() => setIsRewardModalShowing(true)}
          />
        }
      />
    </div>
  );
};
export default RewardImage;
