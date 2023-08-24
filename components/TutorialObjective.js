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
import { Context } from "@/context/store";
import { useContext } from "react";
import { tutorialData } from "@/data/tutorial";

const TutorialObjective = ({
  tutorialStep: {
    step,
    name,
    link,
    description,
    requirement,
    maxProgress,
    reward_type = "stars",
    reward_amount = 50,
    helperModal,
  },
}) => {
  const [store, dispatch] = useContext(Context);

  const timeColor = "#cc3363";
  const progress = 0;

  return (
    <div className={styles.objective} style={{ marginBottom: 0 }}>
      <div className={styles.tutorialStep}>
        Step {step}/{Object.keys(tutorialData).length}
      </div>
      <div
        className={styles.objective_timeType}
        style={{
          backgroundColor: timeColor,
        }}
      >
        <div style={{ padding: ".15rem .5rem" }}>{"Tutorial"}</div>
      </div>

      <RewardImage reward={reward_type} amount={reward_amount} isTask={true} />
      <div className={styles.objective_body}>
        <div className={styles.objective_name}>{requirement}</div>
        <div className={styles.objective_progress}>
          {progress || 0}/{maxProgress}
        </div>

        <div style={{ fontWeight: "500", fontSize: "18px" }}>
          <ProgressBar
            progress={progress || 0}
            isReadyToClaim={progress >= maxProgress && !isCollected}
            max={maxProgress}
          />
        </div>
      </div>

      <div
        className={styles.objective_checkmark}
        onClick={() => {
          progress >= maxProgress && claimTutorialStep(dispatch, step);

          event({
            action: "claim_tutorial_step",
            params: {
              step: step,
            },
          });
        }}
      >
        <div className={styles.progressCounter}></div>

        <>
          {progress >= maxProgress ? (
            <div className="btn btn-action">Claim!</div>
          ) : (
            <div
              className="btn btn-blank"
              onClick={() => {
                Router.push(`/${helperModal.link}`);
              }}
            >
              {progress > 0 ? "Continue" : "Start"}
            </div>
          )}
        </>
      </div>
    </div>
  );
};
export default TutorialObjective;
