import React, { useState, useEffect } from "react";
import styles from "../../styles/TimerReusable.module.scss";

const Timer = ({ resetFutureTime, onComplete, jsxComplete, timeType }) => {
  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  }

  const [timeLeft, setTimeLeft] = useState(
    // resetIn - (Date.now() - resetPastTime)
    timeType == "daily" ? getTimeUntilMidnight() : resetFutureTime - Date.now()
  );

  useEffect(() => {
    let intervalId;
    if (timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1000);
      }, 1000);
    } else {
      // onComplete();
    }
    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete]);

  const seconds = ("0" + Math.floor((timeLeft / 1000) % 60)).slice(-2);
  const minutes = ("0" + Math.floor((timeLeft / 1000 / 60) % 60)).slice(-2);
  const hours = ("0" + Math.floor((timeLeft / (1000 * 60 * 60)) % 24)).slice(
    -2
  );
  const days = ("0" + Math.floor(timeLeft / (1000 * 60 * 60 * 24))).slice(-2);

  return (
    <div>
      {timeLeft <= 0 ? (
        jsxComplete
      ) : (
        <div className={styles.timer}>
          {days > 0 && <div>{days}:</div>}
          <div>{hours}:</div>
          <div>{minutes}:</div>
          <div>{seconds}</div>
        </div>
      )}
    </div>
  );
};

export default Timer;
