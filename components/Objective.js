// IMAGES
import iconCheckmark from "../assets/checkmark.svg";
import iconCheckmarkFill from "../assets/checkmark-fill.svg";

import ProgressBar from "./ProgressBar";
import RewardImage from "./RewardImage";
import { claimObjective } from "../actions/action";
import cx from "classnames";

import styles from "../styles/Today.module.scss";

const Objective = ({
  objective: {
    id,
    name,
    time_type,
    requirement,
    requirement_amount,
    reward,
    reward_amount,
    isCollected,
    progress,
  },
  dispatch,
}) => {
  return (
    <div
      className={cx(styles.objective, {
        [styles.readyToClaim]: progress >= requirement_amount && !isCollected,
        [styles.completed]: isCollected,
      })}
      key={id}
    >
      {/* REWARD COMPONENT */}

      <RewardImage reward={reward} amount={reward_amount} isTask={true} />
      <div className={styles.objective_body}>
        <div
          className={cx([styles.objective_name], {
            [styles.completed]: isCollected,
          })}
        >
          {name}
        </div>
        <div className={styles.objective_description}>{requirement}</div>
        {/* COMPONENT PROGRESS */}

        <div style={{ fontWeight: "500", fontSize: "18px" }}>
          <ProgressBar
            progress={progress}
            isReadyToClaim={progress >= requirement_amount && !isCollected}
            max={requirement_amount}
          />
          {/* {progress == requirement_amount && !isCollected && "Ready to CLAIM!"} */}
        </div>
      </div>

      <div
        className={styles.objective_checkmark}
        onClick={() => !isCollected && claimObjective(dispatch, id)}
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
              <div className={styles.btn_objective__active}>Claim!</div>
            ) : (
              <div className={styles.btn_objective__disabled}>Claim</div>
            )}
          </>
        )}
        {/* <div>{time_type}</div> */}
      </div>
    </div>
  );
};
export default Objective;
