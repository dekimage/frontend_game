import Cookie from "js-cookie";
import axios from "axios";

const backendAPi = process.env.NEXT_PUBLIC_API_URL;
import { generateRandomCode } from "@/utils/calculations";

const baseUrl = `${backendAPi}/api`;
const userUrl = "/usercard";

const AUTH_TOKEN = Cookie.get("token");
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN
  ? "Bearer " + AUTH_TOKEN
  : "";

// LEGACY APIS (require customizations)
export const fetchUserApi = () => axios.get("/usercard/me");
export const rateCardApi = () => axios.put(`${userUrl}/rate-card`);
export const updateEmailSettingsApi = (data) =>
  axios.put(`${userUrl}/update-settings`, { settings: data });
export const updateCardApi = (cardId, action, contentIndex = 0) =>
  axios.put(`${userUrl}/update-card/${cardId}`, {
    action,
    contentIndex,
  });

export const signupApi = (email, password, sharedByUserId) =>
  axios.post(
    "/auth/local/register",
    {
      username: `User-${generateRandomCode()}`,
      email,
      password,
      shared_by: sharedByUserId ? sharedByUserId : null,
    },
    {
      headers: { Authorization: "" },
    }
  );

export const loginApi = (identifier, password) =>
  axios.post(
    "/auth/local",
    { identifier, password },
    {
      headers: { Authorization: "" },
    }
  );
