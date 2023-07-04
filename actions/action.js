import * as api from "../api";
import { toast } from "react-toastify";
import { createAction } from "./config";

export const updateContentType = createAction("updateContentType"); // ADD CUSTOM REDUCER

export const resetUser = createAction("resetUser");

export const acceptReferral = createAction("acceptReferral", {
  type: "REWARD_MODAL",
});
export const saveAvatar = createAction("saveAvatar");

export const claimArtifact = createAction("claimArtifact");

export const claimObjective = createAction("claimObjective", {
  type: "REWARD_MODAL",
  sMsg: false,
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

export const updateTutorial = createAction("updateTutorial");

export const purchaseExpansion = createAction("purchaseExpansion", {
  type: "REWARD_MODAL",
});

export const purchaseProduct = createAction("purchaseProduct", {
  type: "REWARD_MODAL",
});

// PROFILE
export const updateEmailSettings = createAction("updateEmailSettings");

export const followBuddy = createAction("followBuddy");

export const cancelSubscription = createAction("cancelSubscription");

export const getRandomCard = createAction("getRandomCard", { reset: false });

// updateCard: new_disable, favorite, complete, upgrade, play, unlock, complete_action (action_id)
export const updateCard = createAction("updateCard");

export const updateUserBasicInfo = createAction("updateUserBasicInfo", {
  sMsg: (inputName) => `${inputName} updated successfully.`,
});

export const sendFeatureMail = createAction("sendFeatureMail", {
  sMsg: "Thank you for your feedback.",
});

export const notifyMe = createAction("notifyMe", {
  sMsg: (isNotifyMe) => {
    if (isNotifyMe) {
      return "Thank you for your interest. We'll notify you when the app is available.";
    }
  },
});

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

// deprecated
export const openPack = createAction("openPack");

export const purchaseLootBox = createAction("purchaseLootBox");
