import cx from "classnames";
import styles from "@/styles/Rarity.module.scss";

import iconCommon from "@/assets/common-rarity.svg";
import iconRare from "@/assets/rare-rarity.svg";
import iconEpic from "@/assets/epic-rarity.svg";
import iconLegendary from "@/assets/legendary-rarity.svg";

export const Rarity = ({ rarity }) => {
  return (
    <div className={cx(styles.rarity, styles[rarity])}>
      {/* <div className={styles.rarity_image}> */}
      {/* {rarity === "common" && <img src={iconCommon} />}
        {rarity === "rare" && <img src={iconRare} />}
        {rarity === "epic" && <img src={iconEpic} />}
        {rarity === "legendary" && <img src={iconLegendary} />} */}
      {/* </div> */}
      <div className={styles.rarity_name}>{rarity}</div>
    </div>
  );
};
