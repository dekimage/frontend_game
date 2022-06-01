import RewardImage from "./RewardImage";
import { claimObjectiveCounter } from "../actions/action";
import styles from "../styles/Today.module.scss";

const ObjectiveCounter = ({
  objCounter: {
    reward_type,
    reward_quantity,
    isCollected,
    isReadyToCollect,
    objectiveId,
    temporal_type,
  },
  dispatch,
}) => {
  return (
    <div
      className={styles.objectiveCounter}
      onClick={() =>
        !isCollected &&
        isReadyToCollect &&
        claimObjectiveCounter(dispatch, objectiveId, temporal_type)
      }
    >
      <RewardImage reward={reward_type} amount={reward_quantity} />
    </div>
  );
};
export default ObjectiveCounter;
