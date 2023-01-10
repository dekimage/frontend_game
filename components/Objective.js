// IMAGES
import iconCheckmark from "../assets/checkmark.svg";
import iconCheckmarkFill from "../assets/checkmark-fill.svg";
import Router from "next/router";

import ProgressBar from "./ProgressBar";
import RewardImage from "./RewardImage";
import { claimObjective } from "../actions/action";
import cx from "classnames";

import styles from "../styles/Today.module.scss";

const Objective = ({
  objective: {
    id,
    name,
    link,
    time_type,
    description,
    requirement,
    requirement_amount,
    reward_type,
    reward_amount,
    isCollected,
    progress,
    is_premium,
  },
  dispatch,
  isUserPremium,
}) => {
  const timeColor = time_type === "daily" ? "#009c68" : "#1e67ac";
  const premiumColor = "orange";
  const isPremium = is_premium && !isUserPremium;
  return (
    <div
      className={cx(styles.objective, {
        [styles.readyToClaim]: progress >= requirement_amount && !isCollected,
        [styles.completed]: isCollected,
      })}
      key={id}
    >
      {isPremium ? (
        <div
          className={styles.objective_timeType}
          style={{
            backgroundColor: premiumColor,
          }}
        >
          Premium
        </div>
      ) : (
        <div
          className={styles.objective_timeType}
          style={{
            backgroundColor: timeColor,
          }}
        >
          {time_type}
        </div>
      )}
      {/* REWARD COMPONENT */}

      <RewardImage reward={reward_type} amount={reward_amount} isTask={true} />
      <div className={styles.objective_body}>
        {/* <div
          className={cx([styles.objective_name], {
            [styles.completed]: isCollected,
          })}
        >
          {name}
        </div> */}

        <div
          className={cx([styles.objective_name], {
            [styles.completed]: isCollected,
          })}
        >
          {description}
        </div>
        <div className={styles.objective_progress}>
          {progress || 0}/{requirement_amount}
        </div>

        {/* COMPONENT PROGRESS */}

        <div style={{ fontWeight: "500", fontSize: "18px" }}>
          <ProgressBar
            progress={progress || 0}
            isReadyToClaim={progress >= requirement_amount && !isCollected}
            max={requirement_amount}
          />

          {/* {progress == requirement_amount && !isCollected && "Ready to CLAIM!"} */}
        </div>
      </div>

      <div
        className={styles.objective_checkmark}
        onClick={() =>
          !isCollected &&
          progress >= requirement_amount &&
          !isPremium &&
          claimObjective(dispatch, id)
        }
      >
        <div className={styles.progressCounter}></div>
        {/* {isCollected ? "COLLECTED" : "NOT COLLECTED"} */}
        {isCollected ? (
          <img
            src={isCollected ? iconCheckmark : iconCheckmarkFill}
            style={{ width: "40px" }}
          />
        ) : (
          <>
            {progress >= requirement_amount ? (
              isPremium ? (
                <div
                  className={styles.btn_objective__active}
                  onClick={() => Router.push(`/shop`)}
                >
                  Upgrade
                </div>
              ) : (
                <div className={styles.btn_objective__active}>Claim!</div>
              )
            ) : (
              <div
                className={styles.btn_objective__disabled}
                onClick={() => Router.push(`/${link ? link : "learn"}`)}
              >
                Go
              </div>
            )}
          </>
        )}
        {/* <div>{time_type}</div> */}
      </div>
    </div>
  );
};
export default Objective;
