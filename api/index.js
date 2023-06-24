import Cookie from "js-cookie";
import axios from "axios";

const backendAPi = process.env.NEXT_PUBLIC_API_URL;
import { generateRandomCode } from "@/utils/calculations";
import { createApiEndpoint } from "@/actions/config";

const baseUrl = `${backendAPi}/api`;
const userUrl = "/usercard";

const AUTH_TOKEN = Cookie.get("token");
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN
  ? "Bearer " + AUTH_TOKEN
  : "";

// API
export const fetchUserApi = () => axios.get("/usercard/me");

// AUTH API
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

export const updateCardApi = (cardId, action, contentIndex = 0) =>
  axios.put(`${userUrl}/update-card/${cardId}`, {
    action,
    contentIndex,
  });

export const updateSettingsApi = (data) =>
  axios.put(`${userUrl}/update-settings`, { settings: data });

export const getRandomCardApi = createApiEndpoint("getRandomCard");
export const rateCardApi = createApiEndpoint("rateCard");
