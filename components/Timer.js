import { addZeroToInteger } from "../utils/calculations";
import styles from "../styles/Timer.module.scss";

import { completeAction } from "../actions/action";
import { useContext } from "react";
import { Context } from "../context/store";
import baseUrl from "../utils/settings";

const Timer = ({
  seconds,
  minutes,
  isRunning,
  start,
  pause,
  restart,
  isTimerCompleted,
  setIsTimerCompleted,
  duration,
  goNext,
  action = false,
  parent = "course",
}) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div className={styles.section}>
      {!isTimerCompleted && isRunning && (
        <div className={styles.btnPlay} onClick={pause}>
          <ion-icon size="large" name="pause-outline"></ion-icon>
        </div>
      )}
      {!isTimerCompleted && !isRunning && (
        <div className={styles.btnPlay} onClick={start}>
          <ion-icon size="large" name="play"></ion-icon>
        </div>
      )}
      {isTimerCompleted && (
        <div
          className={styles.btnPlay}
          onClick={() => {
            const time = new Date();
            time.setSeconds(time.getSeconds() + duration);
            restart(time);
            setIsTimerCompleted(false);
          }}
        >
          <ion-icon size="large" name="refresh-outline"></ion-icon>
        </div>
      )}

      {parent == "problem" &&
        (isTimerCompleted ? (
          <>
            <div className={styles.congrats}>Congratulations!</div>
            <div
              className={styles.action_open_complete}
              onClick={() => {
                action.is_completed
                  ? completeAction(dispatch, action.id, "remove_complete")
                  : completeAction(dispatch, action.id, "complete");
              }}
            >
              <img
                src={`${baseUrl}/checked.png`}
                height="25px"
                className="mr5"
              />
              {action.is_completed ? "Completed" : "Mark as Complete"}
            </div>
          </>
        ) : (
          <div className={styles.timer}>
            <div className={styles.icon}>
              <ion-icon name="stopwatch-outline"></ion-icon>
            </div>

            <div className={styles.count}>
              <span>{addZeroToInteger(minutes, 2)}</span>:
              <span>{addZeroToInteger(seconds, 2)}</span>
            </div>
          </div>
        ))}

      {parent == "course" &&
        (isTimerCompleted ? (
          <div className="btn btn-primary" onClick={goNext}>
            Complete Action
          </div>
        ) : (
          <div className={styles.timer}>
            <div className={styles.icon}>
              <ion-icon name="stopwatch-outline"></ion-icon>
            </div>

            <div className={styles.count}>
              <span>{addZeroToInteger(minutes, 2)}</span>:
              <span>{addZeroToInteger(seconds, 2)}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Timer;
