import { calcLevelRewards, calcRewardReady } from "../utils/calculations";
import { staticRewards } from "../data/rewards";
const Reducer = (store, action) => {
  switch (action.type) {
    case "OPEN_PLAYER":
      return { ...store, player: action.data };
    case "END_TUTORIAL":
      return { ...store, tutorial: 10 };
    case "END_TUTORIAL_MODAL":
      return { ...store, tutorialModal: false };
    case "FETCH_USER":
      return {
        ...store,
        user: action.data,
        isAuthenticated: true,
        notifications: {
          streaks: calcRewardReady(
            staticRewards.streaks,
            action.data.highest_streak_count,
            action.data.streak_rewards
          ),
          friends: calcRewardReady(
            staticRewards.friends,
            action.data.highest_buddy_shares,
            action.data.friends_rewards
          ),
          // levels: calcLevelRewards(
          //   action.data.level,
          //   action.data.rewards_tower,
          //   staticRewards.levels,
          //   action.data.is_premium
          // ),
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
    case "CLAIM_OBJECTIVE":
      return {
        ...store,
        user: {
          ...store.user,
          objectives_json: action.data.user_objectives,
          [action.data.updatedRewards.rewardType]:
            action.data.updatedRewards.quantity,
        },
      };
    case "EQUIP_ITEM":
      return {
        ...store,
        user: {
          ...store.user,
          equipped_items: action.data.equipped_items,
          inventory: action.data.inventory,
        },
      };
    case "UPDATE_CARD":
      return {
        ...store,
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
          box: "",
          results: [],
          isOpen: false,
        },
      };
    case "UPDATE_USER_GLOBAL":
      return {
        ...store,
        user: action.data,
      };
    default:
      return store;
  }
};

export { Reducer as default };
