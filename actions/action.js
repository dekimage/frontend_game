import * as api from "../api";

export const updateCard = (dispatch, cardId, action) => {
  api
    .updateCardApi(cardId, action)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_CARD", data });
      console.log("UPDATE CARD", data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const collectLevelReward = (dispatch, level) => {
  api
    .collectLevelRewardApi(level)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_LEVEL_REWARDS", data });
      console.log("COLLECT LEVEL REWARD RESPONSE DATA:", data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const claimObjective = (dispatch, objectiveId) => {
  api
    .claimObjectiveApi(objectiveId)
    .then(({ data }) => {
      console.log(dispatch);
      dispatch({ type: "CLAIM_OBJECTIVE", data });
      console.log("COLLECT LEVEL REWARD RESPONSE DATA:", data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const claimObjectiveCounter = (dispatch, objectiveId, temporal_type) => {
  api
    .claimObjectiveCounterApi(objectiveId, temporal_type)
    .then(({ data }) => {
      console.log(dispatch);
      dispatch({ type: "CLAIM_OBJECTIVE_COUNTER", data });
      console.log("COLLECT LEVEL REWARD RESPONSE DATA:", data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateItem = (dispatch, itemId, action) => {
  api
    .updateItemApi(itemId, action)
    .then(({ data }) => {
      dispatch({ type: "EQUIP_ITEM", data });
      console.log("data", data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const achievementTest = (dispatch, itemId, action) => {
  api.achievementTestApi(itemId, action);
  // .then(({ data }) => {
  //   dispatch({ type: "EQUIP_ITEM", data });
  //   console.log("data", data);
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
};

export const levelUp = (dispatch, xp, increase) => {
  dispatch({ type: "UPDATE_USER_XP", data: { xp, increase } });
};

// DEVELOPER API
export const developerModeApi = (dispatch, job) => {
  api
    .developerModeApi(job)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_USER_GLOBAL", data });
    })
    .catch((err) => {
      console.log(err);
    });
};
