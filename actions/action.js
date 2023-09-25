import * as api from "../api";
import { toast } from "react-toastify";
import { createAction, refreshUser } from "./config";
import { REDUCER_TYPES } from "@/data/reducerTypes";

export const updateContentType = (
  dispatch,
  action,
  cardId,
  contentType,
  contentTypeId
) => {
  api
    .updateContentTypeApi(action, cardId, contentType, contentTypeId)
    .then((res) => {
      if (action == "claim") {
        dispatch({ type: REDUCER_TYPES.REWARD_MODAL, data: res.data });
      }

      if (action == "complete" || action == "save" || action == "removeNew") {
        dispatch({ type: REDUCER_TYPES.GQL_REFETCH, data: res.data });
        refreshUser(dispatch);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const resetUser = createAction("resetUser", { type: "FETCH_USER" });

export const getRecommendedCards = createAction("getRecommendedCards");

export const claimTutorialStep = createAction("claimTutorialStep", {
  type: REDUCER_TYPES.REWARD_MODAL,
});

export const submitTutorial = createAction("submitTutorial");

export const saveAvatar = createAction("saveAvatar", {
  type: REDUCER_TYPES.SAVE_AVATAR,
  reset: false,
});

export const claimArtifact = createAction("claimArtifact", {
  type: REDUCER_TYPES.CLAIM_ARTIFACT,
  reset: false,
});

export const claimObjective = createAction("claimObjective", {
  type: REDUCER_TYPES.REWARD_MODAL,
});

export const buyCardTicket = createAction("buyCardTicket", {
  type: REDUCER_TYPES.ADD_USERCARD,
});

export const claimLevelReward = createAction("collectLevelReward", {
  type: REDUCER_TYPES.REWARD_MODAL,
});

export const collectFriendsReward = createAction("collectFriendsReward", {
  type: REDUCER_TYPES.REWARD_MODAL,
});

export const collectStreakReward = createAction("collectStreakReward", {
  type: REDUCER_TYPES.REWARD_MODAL,
});

export const acceptReferral = createAction("acceptReferral", {
  type: REDUCER_TYPES.REWARD_MODAL,
});

export const deleteAccount = createAction("deleteAccount", {
  type: REDUCER_TYPES.REMOVE_USER,
});

// PROFILE
export const updateUserBasicInfo = createAction("updateUserBasicInfo", {
  sMsg: () => `Updated successfully.`,
});

export const updateEmailSettings = createAction("updateEmailSettings", {
  sMsg: () => `Updated successfully.`,
});

export const purchaseProduct = createAction("purchaseProduct", {
  type: REDUCER_TYPES.REWARD_MODAL,
});

export const getRandomCard = createAction("getRandomCard", { reset: false });

export const claimFaq = createAction("claimFaq", {
  type: REDUCER_TYPES.REWARD_MODAL,
});

export const claimCalendarReward = createAction("claimCalendarReward", {
  type: REDUCER_TYPES.REWARD_MODAL,
});

export const sendFeatureMail = createAction("sendFeatureMail", {
  sMsg: () => "Thank you for your feedback.",
  reset: false,
});

export const notifyMe = createAction("notifyMe", {
  sMsg: (isNotifyMe) => {
    if (isNotifyMe) {
      return "Thank you for your interest. We'll notify you when the app is available.";
    }
  },
});

// updateCard: new_disable, favorite, complete, unlock

export const updateCard = (dispatch, cardId, action) => {
  console.log(cardId, action);

  api
    .updateCardApi(cardId, action)
    .then((res) => {
      console.log({ backend_response: res.data });
      switch (action) {
        case "unlock":
          dispatch({
            type: REDUCER_TYPES.ADD_USERCARD,
            data: res.data,
          });
          dispatch({
            type: REDUCER_TYPES.GQL_REFETCH,
            data: res.data,
          });
          break;

        case "complete":
          dispatch({
            type: REDUCER_TYPES.ADD_USERCARD,
            data: res.data,
          });
          break;

        case "favorite":
          dispatch({
            type: REDUCER_TYPES.GQL_REFETCH,
            data: res.data,
          });

          break;

        default:
          return;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const rateCard = (dispatch, rating, cardId, feedbackType) => {
  api
    .rateCardApi(rating, cardId, feedbackType)
    .then((res) => {
      feedbackType === "message" && toast("Thank you for your feedback.");
      feedbackType === "message" &&
        res.data.hasRated &&
        toast("You gained 25 Stars");
    })
    .catch((err) => {
      console.log(err);
    });
};

// STATIC ACTIONS - NO API
export const closeRewardsModal = (dispatch) => {
  dispatch({ type: REDUCER_TYPES.CLOSE_REWARDS_MODAL });
};
