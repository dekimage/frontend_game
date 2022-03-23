import { useTimer } from "react-timer-hook";
import styles from "../styles/Timer.module.scss";
import { addZeroToInteger } from "../utils/calculations";
import { forwardRef, useRef, useImperativeHandle } from "react";
// REMOVE SECOND STYLE - FIGURE OUT WAY FOR DOUBLE MODULES
import styles_2 from "../styles/Item.module.scss";

//USAGE
//const childRef = useRef();

{
  /* <Timer expiryTimestamp={time} ref={childRef} />
      <button onClick={() => childRef.current.getStart()}>Play</button> */
}

const Timer = forwardRef(({ expiryTimestamp }, ref) => {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: () => console.warn("onExpire called"),
  });

  console.log(expiryTimestamp);

  useImperativeHandle(ref, () => ({
    getStart() {
      console.log(111);
      start();
    },
  }));

  return (
    <div className={styles.section}>
      <div className={styles.timer}>
        <div className={styles.icon}>
          <ion-icon name="stopwatch-outline"></ion-icon>
        </div>

        <div className={styles.count}>
          <span>{addZeroToInteger(minutes, 2)}</span>:
          <span>{addZeroToInteger(seconds, 2)}</span>
        </div>
      </div>
      {isRunning ? (
        <div className={styles_2.button_primary} onClick={pause}>
          Pause
        </div>
      ) : (
        <div className={styles_2.button_primary} onClick={start}>
          Start
        </div>
      )}
    </div>
  );
});

export default Timer;
