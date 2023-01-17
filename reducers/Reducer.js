import {
  calcLevelRewards,
  calcRewardReady,
  calcArtifactsReady,
} from "../utils/calculations";
import { staticRewards } from "../data/rewards";
const Reducer = (store, action) => {
  switch (action.type) {
    case "OPEN_PLAYER":
      return { ...store, player: action.data };
    case "LOADING":
      return { ...store, isLoading: true };
    case "SET_ERROR":
      return { ...store, isLoading: false, error: action.data };
    case "UPDATE_TUTORIAL":
      return {
        ...store,
        user: {
          ...store.user,
          tutorial_step: action.data,
        },
      };
    case "END_TUTORIAL":
      return { ...store, tutorial: 10 };
    case "FETCH_USER":
      return {
        ...store,
        user: action.data,
        isAuthenticated: true,
        isLoading: false,
        notifications: {
          // streaks: calcRewardReady(
          //   staticRewards.streaks,
          //   action.data.highest_streak_count,
          //   action.data.streak_rewards
          // ),
          // friends: calcRewardReady(
          //   staticRewards.friends,
          //   action.data.highest_buddy_shares,
          //   action.data.friends_rewards
          // ),
          levels: calcLevelRewards(
            action.data.levelrewards,
            action.data.levelRewards,
            action.data.is_subscribed
          ),
          artifacts: calcArtifactsReady(
            action.data.artifacts,
            action.data.claimed_artifacts
          ),
        },
      };
    case "REMOVE_USER":
      return { user: {}, isAuthenticated: false };
    case "DEV_TEST":
      return { ...store, response: action.data };
    case "UPDATE_LEVEL_REWARDS":
      return {
        ...store,
        user: {
          ...store.user,
          rewards_tower: action.data.rewards_tower,
          // [action.data.updatedRewards.rewardType]:
          //   action.data.updatedRewards.quantity,
        },
      };

      return {
        ...store,
        rewardsModal: {
          box: action.data.data.box,
          results: action.data.data.results,
          isOpen: true,
        },
        user: {
          ...store.user,
          collection_json: action.data.collection_json,
          stars: action.data.stars,
          gems: action.data.gems,
        },
      };

    case "CLAIM_ARTIFACT":
      return { ...store };
    // update artifact claimed + stats

    case "CLAIM_OBJECTIVE":
      return {
        ...store,
        rewardsModal: {
          isOpen: true,
          rewards: action.data.rewards,
        },
        isLoading: false,
        // user: {
        //   ...store.user,
        //   objectives_json: action.data.user_objectives,
        //   xp: action.data.rewards.xp,
        //   level: action.data.rewards.level,
        //   stars: action.data.rewards.stars + store.user.stars,
        // },
      };

    case "UPDATE_CARD":
      return {
        ...store,
        // rewardsModal: {
        //   isOpen: true,
        //   rewards: action.data.rewards,
        // },
        user: {
          ...store.user,
          collection_json: action.data.updated_collection_json,
        },
      };
    case "GEMS_PURCHASE_SUCCESS":
      return {
        ...store,
        user: {
          ...store.user,
          gems: action.data.data.gems,
        },
      };
    case "PURCHASE_BOX":
      return {
        ...store,
        user: {
          ...store.user,
          boxes: {
            ...store.user.boxes,
            [action.upData.boxId]: store.user.boxes[action.upData.boxId] + 1,
          },
          // stars: action.data.stars,
          // gems: action.data.gems,
        },
      };

    case "OPEN_BOX":
      return {
        ...store,
        rewardsModal: {
          box: action.data.data.box,
          results: action.data.data.results,
          isOpen: true,
        },
        user: {
          ...store.user,
          collection_json: action.data.collection_json,
          stars: action.data.stars,
          gems: action.data.gems,
        },
      };
    case "CLOSE_REWARDS_MODAL":
      return {
        ...store,
        rewardsModal: {
          xp: null,
          level: null,
          stars: null,
          artifact: null,
          isOpen: false,
        },
      };

    default:
      return store;
  }
};

export { Reducer as default };
