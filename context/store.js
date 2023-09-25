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

  user: {}, // NO RELATIONS,
  // USER RELATIONS
  usercards: [],
  claimed_artifacts: [],
  artifacts: [],
  favorite_cards: [],
  last_completed_cards: [],
  last_unlocked_cards: [],
  shared_buddies: [],
  allLevelRewards: [],

  refetch: false,

  modals: [],
  toasts: [],
  rewardsModal: {
    isOpen: false,
    results: [],
  },
  showCalendar: false,
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

  useEffect(() => {
    if (AUTH_TOKEN && !router.route.includes(GOOGLE_CALLBACK_ROUTE)) {
      fetchUser(dispatch);
    } else {
      Cookie.remove("token");

      if (
        !router.pathname.includes("auth") &&
        !router.pathname == "/" &&
        !router.pathname.includes("/login/ref")
      ) {
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
