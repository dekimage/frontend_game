import axios from "axios";
import Cookie from "js-cookie";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const userUrl = "/users-permissions/users";

const AUTH_TOKEN = Cookie.get("token");
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN
  ? "Bearer " + AUTH_TOKEN
  : "";

// API
export const fetchUserApi = () => axios.get("/users/me");

export const purchaseLootBoxApi = (boxId) =>
  axios.put(`/users-permissions/users/purchase-box/${boxId}`);

export const updateCardApi = (cardId, action) =>
  axios.put(`/users-permissions/users/update-card/${cardId}`, {
    action,
  });

export const updateItemApi = (itemId, action) =>
  axios.put("/users-permissions/users/update-item", {
    itemId,
    action,
  });

// AUTH API
export const signupApi = (username, email, password) =>
  axios.post("/auth/local/register", {
    username,
    email,
    password,
  });

export const loginApi = (identifier, password) =>
  axios.post("/auth/local", { identifier, password });

// USER API
export const collectLevelRewardApi = (level) =>
  axios.put(`${userUrl}/collect-level-reward/${level}`);

export const claimObjectiveApi = (objectiveId) =>
  axios.put(`${userUrl}/collect-objective-reward/${objectiveId}`);

export const claimObjectiveCounterApi = (objectiveId, temporal_type) =>
  axios.put(`${userUrl}/collect-objective-counter-reward/${objectiveId}`, {
    temporal_type,
  });
export const purchaseProductApi = (productId, product_type) =>
  axios.put(`${userUrl}/purchase-product/${productId}`, {
    product_type,
  });

export const achievementTestApi = () => axios.get(`${userUrl}/achievement`);
export const developerModeApi = (job) =>
  axios.put(`${userUrl}/developer-mode`, { job });
