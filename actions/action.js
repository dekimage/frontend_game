import * as api from "../api";

import { toast } from "react-toastify";
import { createAction } from "./config";

const _ = Symbol("ignored");

export const updateContentType = createAction("updateContentType");

export const updateUserBasicInfo = createAction(
  "updateUserBasicInfo",
  _,
  (inputName) => `${inputName} updated successfully.`
);

export const sendFeatureMail = createAction(
  "sendFeatureMail",
  "BLANK",
  "Thank you for your feedback."
);

export const notifyMe = createAction("notifyMe", "BLANK", (isNotifyMe) => {
  if (isNotifyMe) {
    return "Thank you for your interest. We'll notify you when the app is available.";
  }
});

// TESTING APIS
export const resetUser = createAction("resetUser");

export const acceptReferral = createAction("acceptReferral");
export const saveAvatar = createAction("saveAvatar");

export const claimArtifact = createAction("claimArtifact");
export const claimObjective = createAction("claimObjective");
export const claimLevelReward = createAction("collectLevelReward");
export const collectFriendsReward = createAction("collectFriendsReward");
export const collectStreakReward = createAction("collectStreakReward");

export const updateTutorial = createAction("updateTutorial");
export const purchaseExpansion = createAction("purchaseExpansion");

// deprecated
export const openPack = createAction("openPack");
export const purchaseLootBox = createAction("purchaseLootBox");

export const purchaseProduct = createAction("purchaseProduct");

// PROFILE
export const generateBuddyLink = createAction("generateBuddyLink");
export const updateSettings = createAction("updateSettings");
export const followBuddy = createAction("followBuddy");
export const cancelSubscription = createAction("cancelSubscription");

export const updateCard = createAction("updateCard");

// updateCard: new_disable, favorite, complete, upgrade, play, unlock, complete_action (action_id)

export const getRandomCard = async () => {
  return api
    .getRandomCardApi()
    .then((res) => {
      console.log(res.data);
      return res.data;
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
