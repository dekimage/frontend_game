import {
  calcArtifactsReady,
  calcLevelRewards,
  calcRewardReady,
} from "@/utils/calculations";

import { staticRewards } from "@/data/rewards";

const Reducer = (store, action) => {
  // add function here and add action and store so they are defaulted, and i easily reuse them
  // works both object/array - single or multiple changes
  //const updatesObject = { 'user.details.name': 'Jane' };
  // const updatesArray = [
  //   { 'user.details.name': 'Jane' },
  //   { usercards: ['card3', 'card4'] },
  // ];
  const updateStore = (updates) => {
    const updateNestedProperty = (obj, path, value) => {
      const pathArray = Array.isArray(path) ? path : path.split(".");
      const [current, ...rest] = pathArray;

      if (rest.length === 0) {
        return {
          ...obj,
          [current]: value,
        };
      }

      return {
        ...obj,
        [current]: updateNestedProperty(obj[current], rest, value),
      };
    };

    if (!Array.isArray(updates)) {
      updates = [updates];
    }

    let updatedStore = { ...store };
    for (let update of updates) {
      const [key, value] = Object.entries(update)[0];
      updatedStore = updateNestedProperty(updatedStore, key, value);
    }

    return updatedStore;
  };
  switch (action.type) {
    case "UPDATE_USER":
      return { ...store, user: action.data };
    case "API_ERROR":
      return { ...store, error: action.data };
    // return updateStore({ user: action.data });
    case "OPEN_PLAYER":
      return { ...store, player: action.data };
    case "COMPLETE_TASK":
      return { ...store, completedTasks: store.completedTasks + 1 };
    case "RESET_TASKS":
      return { ...store, completedTasks: 0 };
    case "LOADING":
      return { ...store, isLoading: true };
    case "STOP_LOADING":
      return { ...store, isLoading: false };
    case "SET_ERROR":
      return { ...store, isLoading: false, error: action.data };

    case "UPDATE_SETTINGS":
      // return updateStore([
      //   { isLoading: false },
      //   { "user.settings": action.data },
      // ]);
      return {
        ...store,
        isLoading: false,
        user: {
          ...store.user,
          settings: action.data,
        },
      };
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
    case "OPEN_ENERGY_MODAL":
      return {
        ...store,
        energyModal: !store.energyModal,
      };

    case "BUY_CARD_TICKET":
      return {
        ...store,
        user: {
          ...store.user,
          card_tickets: action.data.card_tickets,
          usercards: action.data.usercards,
        },
      };
    case "BUY_ACTION_TICKET":
      return {
        ...store,
        user: {
          ...store.user,
          action_tickets: action.data.action_tickets,
        },
      };
    case "REMOVE_USER":
      return { ...store, user: {}, isAuthenticated: false };
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

    case "REWARD_MODAL":
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

    // case "UPDATE_CARD":
    //   return {
    //     ...store,
    //     // rewardsModal: {
    //     //   isOpen: true,
    //     //   rewards: action.data.rewards,
    //     // },
    //     user: {
    //       ...store.user,
    //       collection_json: action.data.updated_collection_json,
    //     },
    //   };
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
