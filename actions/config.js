import * as api from "../api";

import { toast } from "react-toastify";

import Cookie from "js-cookie";
import axios from "axios";

const backendAPi = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = `${backendAPi}/api`;
const userUrl = "/usercard";

const AUTH_TOKEN = Cookie.get("token");
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN
  ? "Bearer " + AUTH_TOKEN
  : "";

const STRAPI_CONFIG = {
  resetUser: {
    route: "reset-user",
  },
  notifyMe: {
    route: "notify-me",
    inputs: ["isNotifyMe"],
  },
  updateUserBasicInfo: {
    route: "update-user-basic-info",
    inputs: ["value", "inputName"],
  },
  rateCard: {
    route: "rate-card",
    inputs: ["rating", "cardId", "feedbackType"],
  },
  sendFeatureMail: {
    route: "send-feature-mail",
    inputs: ["details", "subject"],
  },
  acceptReferral: {
    route: "accept-referral",
  },
  saveAvatar: {
    route: "save-avatar",
    inputs: ["avatarId"],
  },
  getRandomCard: {
    route: "get-random-card",
  },
  claimArtifact: {
    route: "claim-artifact",
    inputs: ["artifactId"],
  },
  claimObjective: {
    route: "claim-objective",
    inputs: ["objectiveId"],
  },
  collectLevelReward: {
    route: "collect-level-reward",
    inputs: ["id"],
  },
  collectFriendsReward: {
    route: "collect-friends-reward",
    inputs: ["userCount"],
  },
  collectStreakReward: {
    route: "collect-streak-reward",
    inputs: ["rewardCount"],
  },
  purchaseProduct: {
    route: "purchase-product",
    inputs: ["productId", "payment_env"],
  },
  updateCard: {
    route: "update-card",
    inputs: ["cardId", "action"],
  },
  updateEmailSettings: {
    route: "update-email-settings",
    inputs: ["settings"],
  },
  buyCardTicket: {
    route: "buy-card-ticket",
    inputs: ["cardId"],
  },
  deleteAccount: {
    route: "delete-account",
  },
  claimFaq: {
    route: "claim-faq",
    inputs: ["id"],
  },
  claimTutorialStep: {
    route: "claim-tutorial-step",
    inputs: ["step"],
  },
  claimCalendarReward: {
    route: "claim-calendar-reward",
  },
  getRecommendedCards: {
    route: "get-recommended-cards",
    inputs: ["prioritize"],
  },
  submitTutorial: {
    route: "submit-tutorial",
    inputs: ["favoriteRealms", "friendCode"],
  },
};

const toastBuilder = (message, params = false) => {
  if (typeof message === "function" && params) {
    const paramNames = Object.keys(params); // Get an array of parameter names
    const paramValues = paramNames.map((name) => params[name]); // Get an array of parameter values
    return message(...paramValues);
  } else if (typeof sMsgCallback === "string" && !params) {
    return message;
  }
  return "Saved";
};

export const refreshUser = (dispatch) => {
  dispatch({ type: "LOADING" });
  api
    .refreshUserApi()
    .then((response) => {
      dispatch({ type: "REFRESH_USER", data: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Fetch User
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

export const createApiEndpoint = (apiName, headers = {}) => {
  return (...params) => {
    const config = STRAPI_CONFIG[apiName];
    if (!config || !config.route) {
      throw new Error(`Configuration for ${apiName} is missing or incomplete`);
    }
    const { route, inputs, method } = config;
    const apiUrl = `${userUrl}/${route}`;

    const data = inputs?.reduce((obj, variableName, index) => {
      obj[variableName] = params[index];
      return obj;
    }, {});

    return axios({
      method: method || "PUT",
      url: apiUrl,
      data: data || undefined,
      headers,
    });
  };
};

export const createAction = (apiName, params) => {
  const fullParams = {
    reset: true,
    type: false,
    // sMsg: () => "Success!",
    sMsg: false,
    eMsg: () => "Error!",
    ...params,
  };

  const { reset, type, sMsg, eMsg } = fullParams;
  return async (dispatch, ...params) => {
    try {
      const apiFunc = createApiEndpoint(apiName);
      const response = await apiFunc(...params);
      // console.log({ response });

      if (reset) {
        // fetchUser(dispatch);
        refreshUser(dispatch);
      }

      if (type) {
        dispatch({ type, data: response.data });
      }

      if (sMsg) {
        const successMessage = toastBuilder(sMsg, ...params);
        toast(successMessage);
      }

      if (!type) {
        return response.data;
      }

      if (!sMsg) {
        return;
      }
    } catch (err) {
      console.error(err);
      dispatch && dispatch({ type: "API_ERROR", error: err });
      const errorMessage = toastBuilder(eMsg, ...params);
      toast(errorMessage);
    }
  };
};
