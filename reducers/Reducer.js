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
    case "SAVE_AVATAR":
      return updateStore({ "user.avatar": action.data });

    case "CLAIM_ARTIFACT":
      return {
        ...store,
        claimed_artifacts: [...store.claimed_artifacts, action.data],
      };

    case "REWARD_MODAL":
      return {
        ...store,
        rewardsModal: {
          isOpen: true,
          rewards: action.data.rewards,
        },
        artifacts: action.data.rewards.artifact
          ? [...store.artifacts, action.data.rewards.artifact]
          : store.artifacts,
        // ARTIFACTS NOTIFICATIONS RECALCULATE?
        usercards: action.data.rewards.usercard
          ? [...store.usercards, action.data.rewards.usercard]
          : store.usercards,
        objectivesModal: {
          isOpen: action.data.objectivesForNotification?.length > 0,
          data: action.data.objectivesForNotification,
        },

        isLoading: false,
      };

    case "ADD_USERCARD":
      return {
        ...store,
        usercards: [...store.usercards, action.data],
        rewardsModal: {
          isOpen: action.data?.rewards?.artifact,
          rewards: action.data?.rewards,
        },
        objectivesModal: {
          isOpen: action.data.objectivesForNotification.length > 0,
          data: action.data.objectivesForNotification,
        },
      };

    // try to handle all relations on user via refetch GQL
    case "GQL_REFETCH":
      return {
        ...store,
        gqlRefetch: action.data,
        rewardsModal: {
          isOpen: action.data?.rewards?.artifact,
          rewards: action.data?.rewards,
        },
        objectivesModal: {
          isOpen: action.data.objectivesForNotification.length > 0,
          data: action.data.objectivesForNotification,
        },
      };

    case "TUTORIAL":
      return updateStore({ "user.tutorial_step": action.data });

    case "API_ERROR":
      return { ...store, error: action.data };

    case "COMPLETE_TASK":
      return { ...store, completedTasks: store.completedTasks + 1 };

    case "LOADING":
      return { ...store, isLoading: true };

    case "STOP_LOADING":
      return { ...store, isLoading: false };

    case "CLOSE_CALENDAR":
      return { ...store, showCalendar: false };

    case "REFRESH_USER":
      return {
        ...store,
        user: action.data,
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
            action.data.rewards_tower,
            action.data.levelRewards || store.allLevelRewards,
            action.data.pro
          ),
        },
      };

    case "FETCH_USER":
      return {
        ...store,
        usercards: action.data.usercards,
        claimed_artifacts: action.data.claimed_artifacts,
        artifacts: action.data.artifacts,
        favorite_cards: action.data.favorite_cards,
        last_completed_cards: action.data.last_completed_cards,
        last_unlocked_cards: action.data.last_unlocked_cards,
        shared_buddies: action.data.shared_buddies,
        user: action.data,
        allLevelRewards: action.data.levelRewards,

        showCalendar: !action.data.tutorial?.calendar?.isFinished,
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
            action.data.rewards_tower,
            action.data.levelRewards,
            action.data.pro
          ),
          artifacts: calcArtifactsReady(
            action.data.artifacts,
            action.data.claimed_artifacts
          ),
        },
      };

    // NOT API BOUND: ========>

    case "REMOVE_USER":
      // return { ...store, user: {}, isAuthenticated: false };
      return {
        isAuthenticated: false,
      };

    case "CLOSE_OBJECTIVES_MODAL":
      return {
        ...store,
        objectivesModal: {
          isOpen: false,
          data: [],
        },
      };

    case "OPEN_ENERGY_MODAL":
      return {
        ...store,
        energyModal: !store.energyModal,
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
