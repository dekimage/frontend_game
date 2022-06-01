import React, { createContext, useReducer, useEffect } from "react";
import Reducer from "../reducers/Reducer";
import * as api from "../api";
import Cookie from "js-cookie";

const AUTH_TOKEN = Cookie.get("token");

const initialState = {
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
};

const Store = ({ children }) => {
  const [store, dispatch] = useReducer(Reducer, initialState);
  useEffect(() => {
    if (AUTH_TOKEN) {
      api
        .fetchUserApi()
        .then((response) => {
          // console.log(response.data);
          dispatch({ type: "FETCH_USER", data: response.data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);

export default Store;
