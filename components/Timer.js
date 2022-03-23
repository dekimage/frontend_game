import { addZeroToInteger } from "../utils/calculations";
import styles from "../styles/Timer.module.scss";

const Timer = ({
  seconds,
  minutes,
  isRunning,
  start,
  pause,
  restart,
  isTimerCompleted,
  setIsTimerCompleted,
  currentAction,
  goNextAction,
}) => {
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
            time.setSeconds(time.getSeconds() + currentAction.timer);
            restart(time);
            setIsTimerCompleted(false);
          }}
        >
          <ion-icon size="large" name="refresh-outline"></ion-icon>
        </div>
      )}
      {isTimerCompleted ? (
        <div className="btn btn-primary" onClick={() => goNextAction()}>
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
      )}
    </div>
  );
};

export default Timer;
