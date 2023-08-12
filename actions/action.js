import * as api from "../api";
import { toast } from "react-toastify";
import { createAction, fetchUser } from "./config";

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
        dispatch({ type: "REWARD_MODAL", data: res.data });
      }

      if (action == "complete" || action == "save" || action == "removeNew") {
        dispatch({ type: "GQL_REFETCH", data: res.data });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const resetUser = createAction("resetUser", { type: "FETCH_USER" });

export const saveAvatar = createAction("saveAvatar", {
  type: "SAVE_AVATAR",
  reset: false,
});

export const claimArtifact = createAction("claimArtifact", {
  type: "CLAIM_ARTIFACT",
  reset: false,
});

export const claimObjective = createAction("claimObjective", {
  type: "REWARD_MODAL",
});

export const buyCardTicket = createAction("buyCardTicket", {
  type: "ADD_USERCARD",
});

export const claimLevelReward = createAction("collectLevelReward", {
  type: "REWARD_MODAL",
});

export const collectFriendsReward = createAction("collectFriendsReward", {
  type: "REWARD_MODAL",
});

export const collectStreakReward = createAction("collectStreakReward", {
  type: "REWARD_MODAL",
});

export const updateTutorial = createAction("updateTutorial", {
  type: "TUTORIAL",
});

export const acceptReferral = createAction("acceptReferral", {
  type: "REWARD_MODAL",
});

export const purchaseExpansion = createAction("purchaseExpansion", {
  type: "REWARD_MODAL",
});

export const purchaseProduct = createAction("purchaseProduct", {
  type: "REWARD_MODAL",
});

export const deleteAccount = createAction("deleteAccount", {
  type: "REMOVE_USER",
});

// PROFILE
export const updateUserBasicInfo = createAction("updateUserBasicInfo", {
  sMsg: () => `Updated successfully.`,
});

export const updateEmailSettings = createAction("updateEmailSettings", {
  sMsg: () => `Updated successfully.`,
});

export const cancelSubscription = createAction("cancelSubscription");

export const getRandomCard = createAction("getRandomCard", { reset: false });

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
      switch (action) {
        case "unlock":
          dispatch({
            type: "ADD_USERCARD",
            data: res.data,
          });
          dispatch({
            type: "GQL_REFETCH",
            data: res.data,
          });
          break;

        case "complete":
          dispatch({
            type: "ADD_USERCARD",
            data: res.data,
          });
          break;

        case "favorite":
          dispatch({
            type: "GQL_REFETCH",
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
  dispatch({ type: "CLOSE_REWARDS_MODAL" });
};
