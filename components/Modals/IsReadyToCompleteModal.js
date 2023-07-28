import React from "react";
import styles from "@/styles/EnergyModal.module.scss";
import Countdown from "../Countdown";
import Timer from "../reusable/Timer";
import Lottie from "lottie-react";
import clockLottie from "@/assets/lottie-animations/clock.json";

export default function IsReadyToCompleteModal({ contentType }) {
  const timeLeft = 86400000 - (Date.now() - contentType.lastTimeMS);
  return (
    <div className={styles.energyModal}>
      <Lottie
        animationData={clockLottie}
        loop={true}
        style={{ width: "100px" }}
      />
      <div className="mt1">
        <span style={{ textTransform: "capitalize" }}>{contentType.type}</span>{" "}
        can be completed once per day.
      </div>
      <div className="mt1"> Please come back in: </div>

      <div className="mt1 mb1">
        <Timer
          timeLeftProp={timeLeft}
          jsxComplete={<div className="btn btn-correct">Refresh</div>}
        />
      </div>
    </div>
  );
}
