import styles from "../styles/Reward.module.scss";
import starIcon from "../assets/xp.svg";
import gemIcon from "../assets/diamond-currency.svg";
import checkmark from "../assets/checkmark.svg";
// import lock from "../assets/lock.svg";
import cx from "classnames";

const RewardImage = ({
  reward,
  amount,
  isCollected,
  isReadyToCollect,
  isPremium = false,
  isUserPremium = false,
  isTask = false,
}) => {
  return (
    <div
      className={cx([styles.reward], {
        [styles.premium]: isPremium,
        [styles.action]: isReadyToCollect && !isCollected,
        [styles.done]: isCollected,
        [styles.task]: isTask,
      })}
    >
      {isCollected && (
        <div className={styles.checkmark}>
          <img src={checkmark} />
        </div>
      )}
      {isPremium && !isUserPremium && (
        <div className={styles.lock}>
          <ion-icon name="lock-closed-outline"></ion-icon>
        </div>
      )}

      <div className={styles.reward_image}>
        {reward == "stars" && (
          <img height="8px" src="http://localhost:1337/star.png" />
        )}
        {reward == "gems" && <img src={gemIcon} />}
      </div>

      <div className={styles.reward_amount}>{amount}</div>
    </div>
  );
};
export default RewardImage;
