import axios from "axios";
import Cookie from "js-cookie";

const backendAPi = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = `${backendAPi}/api`;
const userUrl = "/users-permissions/users";

const AUTH_TOKEN = Cookie.get("token");
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN
  ? "Bearer " + AUTH_TOKEN
  : "";

// API
export const fetchUserApi = () => axios.get("/users/me");

// TESTING DEV MODE
export const developerModeApi = (job) =>
  axios.put(`${userUrl}/developer-mode`, { job });

export const achievementTestApi = () => axios.get(`${userUrl}/achievement`);

// AUTH API
export const signupApi = (username, email, password) =>
  axios.post(
    "/auth/local/register",
    {
      username,
      email,
      password,
    },
    {
      headers: { Authorization: "" },
    }
  );

// export const signupApi = (username, email, password) => {
//   axios({
//     method: "post",
//     headers: {
//       // 'Authorization': `Bearer ${props.jwtToken}`, **// see how the bearer token now has a single space**
//       "Content-Type": "application/json",
//     },
//     url: `/auth/local/register`,
//   });
// };

export const loginApi = (identifier, password) =>
  axios.post(
    "/auth/local",
    { identifier, password },
    {
      headers: { Authorization: "" },
    }
  );

// ------

// 1. HOME PAGE
export const startQuizApi = () => axios.put(`${userUrl}/start-quiz`);

export const submitQuizApi = (data) =>
  axios.put(`${userUrl}/submit-quiz`, { data });

export const claimObjectiveApi = (objectiveId) =>
  axios.put(`${userUrl}/collect-objective-reward/${objectiveId}`);

export const claimObjectiveCounterApi = (objectiveId, temporal_type) =>
  axios.put(`${userUrl}/collect-objective-counter-reward/${objectiveId}`, {
    temporal_type,
  });

export const collectLevelRewardApi = (id) =>
  axios.put(`${userUrl}/collect-level-reward/${id}`);

export const claimUserRewardApi = (userCount) =>
  axios.put(`${userUrl}/collect-friends-reward/${userCount}`);

export const claimStreakRewardApi = (rewardCount) =>
  axios.put(`${userUrl}/collect-streak-reward/${rewardCount}`);

// ------

// 2. SHOP PAGE
export const purchaseLootBoxApi = (boxId) =>
  axios.put(`/users-permissions/users/purchase-box/${boxId}`);

export const purchaseProductApi = (productId, payment_env) =>
  axios.put(`${userUrl}/purchase-product/${productId}`, {
    payment_env,
  });

export const purchaseExpansionApi = (expansionId) =>
  axios.put(`${userUrl}/purchase-expansion/${expansionId}`);

export const openPackApi = (boxId) =>
  axios.put(`${userUrl}/open-pack/${boxId}`);

// ------

// 3. CARD PAGE
export const updateCardApi = (cardId, action) =>
  axios.put(`/users-permissions/users/update-card/${cardId}`, {
    action,
  });

// ------

// 4. PROFILE PAGE
export const resetEnergyApi = () => axios.put(`${userUrl}/reset-energy`);

export const generateBuddyLinkApi = () =>
  axios.put(`${userUrl}/generate-buddy-link`);

export const updateSettingsApi = (data) =>
  axios.put(`${userUrl}/update-settings}`, { data });

export const followBuddyApi = (userId) =>
  axios.put(`${userUrl}/follow-buddy/${userId}`);

export const cancelSubscriptionApi = () =>
  axios.put(`${userUrl}/cancel-subscription`);

export const restorePurchaseApi = () =>
  axios.put(`${userUrl}/restore-purchase`);

// ------

// 5. COMMUNITY ACTIONS
//TODO: ADD DIFFERENT ROUTES - FOR DEFAULT SHADOW CRUD STRAPI
export const createCommunityActionApi = (dataForm) =>
  axios.post(`/community-actions`, dataForm);
export const deleteCommunityActionApi = (actionId) =>
  axios.delete(`/community-actions/${actionId}`);
export const interactCommunityActionApi = (actionId, intent) =>
  axios.put(`/community-actions/interact/${actionId}`, { intent });

// 6. ACTIONS ORIGINAL
export const completeActionApi = (actionId, intent) =>
  axios.put(`/actions/complete/${actionId}`, { intent });

// ARCHIVE OLD ACTIONS
export const updateItemApi = (itemId, action) =>
  axios.put("/users-permissions/users/update-item", {
    itemId,
    action,
  });
