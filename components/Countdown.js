import React, { useContext } from "react";

import { Context } from "@/context/store";
import { ImageUI } from "./reusableUI";
import Timer from "./reusable/Timer";
import { fetchUser } from "@/actions/config";
import styles from "@/styles/Countdown.module.scss";

export default function Countdown({ type, tab, timeLeft }) {
  const [store, dispatch] = useContext(Context);
  const onComplete = () => {
    fetchUser(dispatch);
  };

  const dailyTime = Date.parse(store?.user?.reset_date || 0);
  const weeklyTime = parseInt(store?.user?.reset_week_date || 0);

  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  }

  function calculateTimeLeftProp(timeType) {
    // const resetFutureTime = timeType == "daily" ? dailyTime : weeklyTime;

    return timeType == "daily"
      ? getTimeUntilMidnight()
      : weeklyTime - Date.now();
  }

  let content;

  switch (type) {
    case "objectives":
      content = (
        <div className={styles.countdown}>
          <div>Objectives reset in:</div>

          {tab === "daily" ? (
            <>
              <Timer
                timeLeftProp={calculateTimeLeftProp("daily")}
                jsxComplete={
                  <div className="btn btn-correct" onClick={() => onComplete()}>
                    Refresh
                  </div>
                }
                onComplete={onComplete}
              />
            </>
          ) : (
            <Timer
              timeLeftProp={calculateTimeLeftProp("weekly")}
              jsxComplete={
                <div className="btn btn-correct" onClick={() => onComplete()}>
                  Refresh
                </div>
              }
              onComplete={onComplete}
            />
          )}

          {/* <div className={styles.countdown_timer}></div> */}
        </div>
      );
      break;

    case "energy":
      content = (
        <div className={styles.timerEnergy}>
          <div className={styles.timerEnergy_inner}>
            + 10 <ImageUI url={"/energy.png"} height={"16px"} isPublic />
          </div>
          <Timer
            timeLeftProp={calculateTimeLeftProp("daily")}
            jsxComplete={<div className="btn btn-correct">Refresh</div>}
            onComplete={onComplete}
          />
        </div>
      );
      break;

    // Add more cases for additional scenarios

    default:
      content = null; // Or return a default component if needed
  }

  return <>{content}</>;
}
