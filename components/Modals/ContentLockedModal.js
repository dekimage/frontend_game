import React from "react";
import styles from "@/styles/EnergyModal.module.scss";
import iconLock from "@/assets/lock-white-border.svg";
import { ImageUI } from "../reusableUI";

export default function ContentLockedModal({ callBack }) {
  return (
    <div className={styles.energyModal}>
      <div className={styles.title}> Content Locked</div>

      <img src={iconLock} style={{ height: "32px", margin: "1rem 0" }} />

      <div>Open lootboxes to discover new content</div>

      <ImageUI url={"/loot-box-2.png"} isPublic height="50px" />

      <div className="btn btn-action mt1" onClick={() => callBack()}>
        View Quests
      </div>
    </div>
  );
}
