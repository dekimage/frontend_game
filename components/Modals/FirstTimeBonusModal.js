import { GemReward, XpReward } from "../../pages/buddies-rewards";

import React from "react";
import styles from "../../styles/RanksModal.module.scss";

// Get a special first time bonus just for trying this card! You'll never
//         know how much you'll love it (or not) unless you give it a shot.

export const FirstTimeBonusModal = ({ closeModal }) => {
  return (
    <div className={styles.flex}>
      <div className={styles.title}>First Time Bonus</div>
      <div className={styles.smallText} style={{ marginBottom: "1rem" }}>
        It seems you've never played this card before. Complete it at least once
        to unlock special bonus:
      </div>
      <div className={`${styles.ranksMap} flex_center`}>
        <GemReward amount={100} />
      </div>
      <div className={styles.okBtn} onClick={closeModal}>
        OK
      </div>
    </div>
  );
};
