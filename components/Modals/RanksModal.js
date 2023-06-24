import { ImageUI } from "../reusableUI";
import { Rarity } from "../Rarity";
import React from "react";
import styles from "../styles/RanksModal.module.scss";

const leagues = [
  { min: 0, max: 2, league: "unranked" },
  { min: 3, max: 5, league: "bronze" },
  { min: 6, max: 9, league: "silver" },
  { min: 10, max: 19, league: "gold" },
  { min: 20, max: 49, league: "platinum" },
  { min: 50, max: 99, league: "diamond" },
  { min: 100, max: 1000, league: "grandmaster" },
];

export const RanksModal = ({ closeModal }) => {
  return (
    <div className={styles.flex}>
      <div className={styles.title}>Ranks</div>
      <div className={styles.smallText} style={{ marginBottom: "1rem" }}>
        Practice makes learning stick better.
      </div>
      <div className={styles.ranksMap}>
        {leagues.map((r, i) => {
          return (
            <div className={styles.rank} key={i}>
              <Rarity rarity={r.league} />
              <div className="flex_center">
                {r.min} ~ {r.max}{" "}
                <div className="ml5">
                  <ImageUI url={"/mastery.png"} isPublic height="12px" />
                </div>
              </div>
              <div className={styles.smallText}>(Times Completed)</div>
            </div>
          );
        })}
      </div>
      <div className={styles.okBtn} onClick={closeModal}>
        OK
      </div>
    </div>
  );
};
