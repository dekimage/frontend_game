import React, { createContext, useEffect, useReducer } from "react";
import Cookie from "js-cookie";
import Reducer from "@/reducers/Reducer";
import { fetchUser } from "@/actions/config";
import { useRouter } from "next/router";

const AUTH_TOKEN = Cookie.get("token");
const GOOGLE_CALLBACK_ROUTE = "/auth/google/callback";
const LOGIN_ROUTE = "/login";

const initialState = {
  tutorialModal: true,
  isLoading: false,
  error: null,
  tutorial: 0,
  player: {},
  isAuthenticated: false,
  response: {},
  user: {},
  modals: [],
  toasts: [],
  rewardsModal: {
    isOpen: false,
    results: [],
  },
  energyModal: false,
  notifications: {
    streaks: 0,
    friends: 0,
    levels: 0,
    daily: 0,
    weekly: 0,
    achievements: 0,
  },
  coursePlayerSlides: [],
  completedTasks: 0,
};

const Store = ({ children }) => {
  const [store, dispatch] = useReducer(Reducer, initialState);
  const router = useRouter();

  // useEffect(() => {
  //   if (AUTH_TOKEN && !router.route.includes(GOOGLE_CALLBACK_ROUTE)) {
  //     fetchUser(dispatch);
  //   } else {
  //     if (!router.pathname == "/") {
  //       router.push(LOGIN_ROUTE);
  //     }
  //   }
  // }, []);
  useEffect(() => {
    // Function to check if the token is expired

    const isTokenExpired = (token) => {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        return decoded.exp < Date.now() / 1000;
      } catch (e) {
        return true;
      }
    };

    // Check if the AUTH_TOKEN is set and not expired
    if (
      AUTH_TOKEN &&
      !isTokenExpired(AUTH_TOKEN) &&
      !router.route.includes(GOOGLE_CALLBACK_ROUTE)
    ) {
      fetchUser(dispatch);
    } else {
      Cookie.remove("token"); // remove token from cookie if expired

      if (router.pathname !== "/" && !router.pathname.includes("auth")) {
        router.push(LOGIN_ROUTE);
      }
    }
  }, []);

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);

export default Store;
