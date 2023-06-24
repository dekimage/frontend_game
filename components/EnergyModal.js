import React from "react";
import styles from "@/styles/EnergyModal.module.scss";
import Countdown from "./Countdown";
import Link from "next/link";

export default function EnergyModal() {
  return (
    <div className={styles.energyModal}>
      <div className="mt1">Time to next energy:</div>
      <div className="mt1 mb1">
        <Countdown tab={"daily"} isEnergy />
      </div>
      <div className={styles.title}>- or - </div>
      <Link href={`/shop`}>
        <div className="btn btn-action mt1">Purchase Energy</div>
      </Link>
    </div>
  );
}
