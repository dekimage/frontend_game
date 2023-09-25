// IMAGES

import ProgressBar from "./ProgressBar";
import RewardImage from "./RewardImage";
import Router from "next/router";
import { claimObjective } from "@/actions/action";
import cx from "classnames";
import { event } from "@/utils/ga";
import iconCheckmark from "@/assets/checkmark.svg";
import iconCheckmarkFill from "@/assets/checkmark-fill.svg";
import styles from "@/styles/Today.module.scss";

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
  setRecommendedCardsModalOpen,
  dispatch,
  isUserPro,
  fromNotification = false,
}) => {
  const timeColor = time_type === "daily" ? "#009c68" : "#1e67ac";
  const isPremium = is_premium && !isUserPro;

  return (
    <div
      className={cx(styles.objective, {
        [styles.readyToClaim]: progress >= requirement_amount && !isCollected,
        [styles.completed]: isCollected,
      })}
      key={id}
    >
      {isPremium ? (
        <div className={styles.objective_timeType}>
          <div className="proLabel">PRO</div>
        </div>
      ) : (
        <div
          className={styles.objective_timeType}
          style={{
            backgroundColor: timeColor,
          }}
        >
          <div style={{ padding: ".15rem .5rem" }}>{time_type}</div>
        </div>
      )}
      {/* REWARD COMPONENT */}

      <RewardImage reward={reward_type} amount={reward_amount} isTask={true} />
      <div className={styles.objective_body}>
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
        </div>
      </div>

      <div
        className={styles.objective_checkmark}
        onClick={() => {
          if (fromNotification) {
            Router.push("/");
          } else {
            !isCollected &&
              progress >= requirement_amount &&
              !isPremium &&
              claimObjective(dispatch, id);
          }

          event({
            action: "search",
            params: {
              search_term: "test",
            },
          });
        }}
      >
        <div className={styles.progressCounter}></div>
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
                  className="btn btn-action"
                  onClick={() => Router.push(`/shop`)}
                >
                  Upgrade
                </div>
              ) : (
                <div className="btn btn-action">Claim!</div>
              )
            ) : (
              <div
                className="btn btn-action"
                onClick={() => {
                  console.log(requirement);
                  if (fromNotification) {
                    Router.push("/");
                  } else {
                    if (isPremium) {
                      Router.push(`/shop`);
                    } else {
                      if (
                        requirement == "master_card" ||
                        requirement == "action" ||
                        requirement == "energy" ||
                        requirement == "complete"
                      ) {
                        setRecommendedCardsModalOpen(requirement);
                      } else {
                        Router.push("/learn");
                      }
                    }
                  }

                  event({
                    action: "search",
                    params: {
                      search_term: "test",
                    },
                  });
                }}
              >
                {isPremium ? "Upgrade" : "Start"}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Objective;
