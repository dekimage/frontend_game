const Reducer = (store, action) => {
  // console.log("action.data", action.data);
  switch (action.type) {
    case "FETCH_USER":
      return { ...store, user: action.data, isAuthenticated: true };
    case "REMOVE_USER":
      return { user: {}, isAuthenticated: false };
    case "UPDATE_USER_XP":
      return {
        ...store,
        user: {
          ...store.user,
          xp: action.data.increase
            ? store.user.xp + action.data.xp
            : store.user.xp - action.data.xp,
        },
      };
    case "UPDATE_LEVEL_REWARDS":
      return {
        ...store,
        user: {
          ...store.user,
          rewards_tower: action.data.rewards_tower,
          [action.data.updatedRewards.rewardType]:
            action.data.updatedRewards.quantity,
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
