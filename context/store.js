import * as api from "../api";

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
  skippedTasks: 0,
  completedTasks: 0,
};

const Store = ({ children }) => {
  const [store, dispatch] = useReducer(Reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    if (AUTH_TOKEN && !router.route.includes(GOOGLE_CALLBACK_ROUTE)) {
      fetchUser(dispatch);
    } else {
      if (!router.pathname == "/") {
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
