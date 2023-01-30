import { toast } from "react-toastify";
import * as api from "../api";

// ACTION FACTORY
export const actionCreator = (dispatch, apiFunc, type, data) => {
  api[apiFunc](data)
    .then(({ data }) => {
      dispatch({ type: type, data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const resetUser = (dispatch) => {
  dispatch({ type: "LOADING" });
  api
    .resetUserApi()
    .then((res) => {
      fetchUser(dispatch);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const acceptReferral = (dispatch) => {
  dispatch({ type: "LOADING" });
  api
    .acceptReferralApi()
    .then((res) => {
      console.log(res);
      fetchUser(dispatch);
    })
    .catch((err) => {
      console.log(err);
    });
};

// QUERY
// Random Card GET
// export const getRandomCard = (dispatch) => {
//   dispatch({ type: "LOADING" });
//   api
//     .getRandomCardApi()
//     .then((response) => {
//       dispatch({ type: "FETCH_USER", data: response.data });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

//0. Fetch User
export const fetchUser = (dispatch) => {
  dispatch({ type: "LOADING" });
  api
    .fetchUserApi()
    .then((response) => {
      // console.log(response.data);
      dispatch({ type: "FETCH_USER", data: response.data });
    })
    .catch((err) => {
      console.log(err);
      // router.push(`/login`);
    });
};

// AVATAR SAVE
export const saveAvatar = (dispatch, avatarId) => {
  dispatch({ type: "LOADING" });
  api
    .saveAvatarApi(avatarId)
    .then(({ data }) => {
      dispatch({ type: "SAVE_AVATAR", data });
      fetchUser(dispatch);
    })
    .catch((err) => {
      dispatch({ type: "SET_ERROR", data: err });
      console.log(err);
    });
};

// 0. PROFILE PAGE

export const claimArtifact = (dispatch, artifactId) => {
  dispatch({ type: "LOADING" });
  api
    .claimArtifactApi(artifactId)
    .then(({ data }) => {
      dispatch({ type: "CLAIM_ARTIFACT", data });
      fetchUser(dispatch);
    })
    .catch((err) => {
      dispatch({ type: "SET_ERROR", data: err });
      console.log(err);
    });
};

// 1. HOME PAGE

export const claimObjective = (dispatch, objectiveId) => {
  dispatch({ type: "LOADING" });
  api
    .claimObjectiveApi(objectiveId)
    .then(({ data }) => {
      dispatch({ type: "CLAIM_OBJECTIVE", data });
      fetchUser(dispatch);
    })
    .catch((err) => {
      dispatch({ type: "SET_ERROR", data: err });
      console.log(err);
    });
};
export const claimObjectiveCounter = (dispatch, objectiveId, temporal_type) => {
  api
    .claimObjectiveCounterApi(objectiveId, temporal_type)
    .then(({ data }) => {
      dispatch({ type: "CLAIM_OBJECTIVE_COUNTER", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const claimLevelReward = (dispatch, id) => {
  api
    .collectLevelRewardApi(id)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_LEVEL_REWARDS", data });
      fetchUser(dispatch);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const claimUserReward = (dispatch, userCount) => {
  api
    .claimUserRewardApi(userCount)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_USER_REWARDS", data });
      fetchUser(dispatch);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const claimStreakReward = (dispatch, rewardCount) => {
  api
    .claimStreakRewardApi(rewardCount)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_STREAK_REWARDS", data });
      fetchUser(dispatch);
    })
    .catch((err) => {
      console.log(err);
    });
};

// ------

// TUTORIAL
export const updateTutorial = (dispatch, tutorialStep) => {
  api
    .updateTutorialApi(tutorialStep)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_TUTORIAL", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// 2. SHOP PAGE

export const purchaseLootBox = (dispatch, boxId) => {
  api
    .purchaseLootBoxApi(boxId)
    .then(({ data }) => {
      const upData = { ...data, boxId };
      console.log(11, upData);
      dispatch({ type: "PURCHASE_BOX", upData });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const purchaseProduct = (dispatch, productId, payment_env) => {
  api
    .purchaseProductApi(productId, payment_env)
    .then(({ data }) => {
      dispatch({ type: data.notification, data });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const purchaseExpansion = (dispatch, expansionId) => {
  api
    .purchaseExpansionApi(expansionId)
    .then(({ data }) => {
      dispatch({ type: "PURCHASE_EXPANSION", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const openPack = (dispatch, boxId) => {
  api
    .openPackApi(boxId)
    .then(({ data }) => {
      dispatch({ type: "OPEN_BOX", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// ------

// 3. CARD PAGE
// updateCard: new_disable, favorite, complete, upgrade, play, unlock, complete_action (action_id)
export const updateCard = (dispatch, cardId, action) => {
  api
    .updateCardApi(cardId, action)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_CARD", data });
      fetchUser(dispatch);
      if (action === "favorite") {
        toast("Favorited. View all favorites here link...");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//type == "card" || "action"
export const buyCardTicket = (dispatch, id, type, callback) => {
  dispatch({ type: "LOADING" });
  api
    .buyCardTicketApi(id, type)
    .then(({ data }) => {
      dispatch({
        type: type == "card" ? "BUY_CARD_TICKET" : "BUY_ACTION_TICKET",
        data,
      });
      setTimeout(() => callback(), 2000);

      // fetchUser(dispatch);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const skipAction = async (dispatch) => {
  dispatch({ type: "LOADING" });
  return api
    .skipActionApi()
    .then(({ data }) => {
      dispatch({ type: "STOP_LOADING" });
      return data;
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: "STOP_LOADING" });
      return { err };
    });
};

// 4. PROFILE PAGE
export const generateBuddyLink = (dispatch) => {
  api
    .generateBuddyLinkApi()
    .then(({ data }) => {
      dispatch({ type: "GENERATE_LINK", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateSettings = (dispatch, data) => {
  api
    .updateSettingsApi(data)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_SETTINGS", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const followBuddy = (dispatch, userId) => {
  api
    .followBuddyApi(userId)
    .then(({ data }) => {
      dispatch({ type: "FOLLOW_BUDDY", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const cancelSubscription = (dispatch) => {
  api
    .cancelSubscriptionApi()
    .then(({ data }) => {
      dispatch({ type: "CANCEL_SUBSCRIPTION", data });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const restorePurchase = (dispatch) => {
  api
    .restorePurchaseApi()
    .then(({ data }) => {
      dispatch({ type: "RESTORE_PURCHASE", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// 5. COMMUNITY ACTIONS
export const createCommunityAction = (dispatch, dataForm) => {
  api
    .createCommunityActionApi(dataForm)
    .then(({ data }) => {
      dispatch({ type: "CREATE_COMMUNITY_ACTION", data });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const deleteCommunityAction = (dispatch, actionId) => {
  api
    .deleteCommunityActionApi(actionId)
    .then(({ data }) => {
      dispatch({ type: "DELETE_COMMUNITY_ACTION", data });
      toast.success("Action deleted.");
    })
    .catch((err) => {
      console.log(err);
    });
};
export const interactCommunityAction = (dispatch, actionId, intent) => {
  api
    .interactCommunityActionApi(actionId, intent)
    .then(({ data }) => {
      dispatch({ type: "INTERACT_COMMUNITY_ACTION", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// 6. ACTIONS FROM CARD ORIGINAL (QUIZ)
export const completeAction = (dispatch, actionId, intent) => {
  api
    .completeActionApi(actionId, intent)
    .then(({ data }) => {
      dispatch({ type: "UPDATE_ACTION", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// STATIC ACTIONS - NO API
export const closeRewardsModal = (dispatch) => {
  dispatch({ type: "CLOSE_REWARDS_MODAL" });
};
