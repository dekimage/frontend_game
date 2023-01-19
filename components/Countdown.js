import React, { useContext } from "react";
import Timer from "./reusable/Timer";
import styles from "../styles/Countdown.module.scss";
import { Context } from "../context/store";
import { fetchUser } from "../actions/action";
import { ImageUI } from "./reusableUI";

export default function Countdown({ tab, isObjectives = false }) {
  const [store, dispatch] = useContext(Context);
  const onComplete = () => {
    fetchUser(dispatch);
  };

  const dailyTime = Date.parse(store?.user?.reset_date || 0);
  const weeklyTime = parseInt(store?.user?.reset_week_date);

  return (
    <>
      {isObjectives ? (
        <div className={styles.countdown}>
          <div className={styles.countdown}>Objectives reset in:</div>

          {tab === "daily" ? (
            <>
              <Timer
                resetFutureTime={dailyTime || 0}
                jsxComplete={<div className="btn btn-correct">Refresh</div>}
                onComplete={onComplete}
                timeType="daily"
              />
            </>
          ) : (
            <Timer
              resetFutureTime={weeklyTime || 0}
              jsxComplete={<div className="btn btn-correct">Refresh</div>}
              onComplete={onComplete}
            />
          )}

          {/* <div className={styles.countdown_timer}></div> */}
        </div>
      ) : (
        <div className={styles.timerEnergy}>
          <div className={styles.timerEnergy_inner}>
            + 10 <ImageUI url={"/energy.png"} height={"16px"} isPublic />
          </div>
          <Timer
            resetFutureTime={dailyTime || 0}
            jsxComplete={<div className="btn btn-correct">Refresh</div>}
            onComplete={onComplete}
            timeType="daily"
          />
        </div>
      )}
    </>
  );
}
