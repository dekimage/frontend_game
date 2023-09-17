import { rewardsMap } from "@/data/contentTypesData";
import { ImageUI } from "../reusableUI";
import styles from "@/styles/CardContentTab.module.scss";

const LootBoxHelperModal = () => {
  return (
    <div>
      <div className="flex_center mb1">Quest LootBox</div>
      <div>
        <ImageUI
          url={"/loot-box.png"}
          style={{
            marginBottom: ".5rem",
          }}
          isPublic
          height="50px"
        />
      </div>
      <div className={styles.questTitle}>Rewards:</div>
      <div className={styles.questRewardsMap}>
        {rewardsMap.map((reward, i) => (
          <div className={styles.questReward} key={i}>
            <ImageUI url={reward.icon} height="36px" isPublic />
            <div className={styles.questRewardText}>
              {reward.amount} <br /> {reward.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LootBoxHelperModal;
