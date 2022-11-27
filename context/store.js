import React, { createContext, useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import Reducer from "../reducers/Reducer";
import * as api from "../api";
import Cookie from "js-cookie";
import { fetchUser } from "../actions/action";

const AUTH_TOKEN = Cookie.get("token");
const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

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
  notifications: {
    streaks: 0,
    friends: 0,
    levels: 0,
    daily: 0,
    weekly: 0,
    achievements: 0,
  },
  coursePlayerSlides: [],
};

const Store = ({ children }) => {
  const [store, dispatch] = useReducer(Reducer, initialState);
  const router = useRouter();
  useEffect(() => {
    if (AUTH_TOKEN) {
      fetchUser(dispatch);
    } else {
      router.push(`/login`);
    }
  }, []);

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);

export default Store;
