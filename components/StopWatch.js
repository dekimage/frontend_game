import { useState, useEffect } from "react";
import { msToTime } from "../utils/calculations";
import styles from "../styles/Timer.module.scss";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const StopWatch = ({}) => {
  const reward = {
    label: "+3",
    img: `${baseUrl}/energy.png`,
  };
  const today = new Date();
  today.setHours(23, 59);
  const restartMs = today.getTime();

  const [timeDiff, setTimeDiff] = useState(restartMs - Date.now());

  useEffect(() => {
    setInterval(() => setTimeDiff(restartMs - Date.now()), 1050);
  }, []);

  return (
    <div className={styles.timer}>
      <div className={styles.icon}>
        <ion-icon name="stopwatch-outline"></ion-icon>
      </div>
      <div className={styles.count}>{msToTime(timeDiff)}</div>
      {reward && (
        <div className={styles.reward}>
          {reward.label} <img src={reward.img} />
        </div>
      )}
    </div>
  );
};

export default StopWatch;
