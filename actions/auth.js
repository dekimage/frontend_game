import * as api from "../api";

import Cookie from "js-cookie";
import Router from "next/router";
import axios from "axios";

const backendAPi = process.env.NEXT_PUBLIC_API_URL;

export const signup = (
  dispatch,
  email,
  password,
  sharedByUserId = false,
  setSubmitting,
  resetForm
) => {
  api
    .signupApi(email, password, sharedByUserId)
    .then(({ data }) => {
      Cookie.set("token", data.jwt);
      Cookie.set("userId", data.user.id);
      axios
        .get(`${backendAPi}/api/usercard/me`, {
          headers: { Authorization: `Bearer ${data.jwt}` },
        })
        .then(({ data }) => {
          dispatch({ type: "FETCH_USER", data });
        });
      setSubmitting(false);
      resetForm(true);
      Router.push("/");
    })

    .catch((err) => {
      console.log(err);
    });
};

export const login = (
  dispatch,
  identifier,
  password,
  setSubmitting,
  resetForm
) => {
  api
    .loginApi(identifier, password)
    .then(({ data }) => {
      setSubmitting(false);
      resetForm(true);
      dispatch({ type: "FETCH_USER", data: data.user });
      Cookie.set("token", data.jwt);
      Cookie.set("userId", data.user.id);
      Router.push("/");

      axios
        .get(`${backendAPi}/api/usercard/me`, {
          headers: { Authorization: `Bearer ${data.jwt}` },
        })
        .then(({ res }) => console.log(res));
    })

    .catch((err) => {
      console.log(err);
    });
};

export const logout = (dispatch) => {
  dispatch({ type: "REMOVE_USER" });
  Cookie.remove("token");
  Router.push("/login");
};
