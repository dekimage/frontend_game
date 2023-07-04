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
  resetForm,
  setError,
  setIsErrorVisible
) => {
  api
    .signupApi(email, password, sharedByUserId)
    .then(({ data }) => {
      Cookie.set("token", data.jwt); //{ secure: true } in production
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
      console.log(err.response.data.error.message);
      setError(err.response.data.error.message);
      setSubmitting(false);
      setIsErrorVisible(true);

      // Clear the error message after 3 seconds
      setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);
    });
};

export const login = (
  dispatch,
  identifier,
  password,
  setSubmitting,
  resetForm,
  setError,
  setIsErrorVisible
) => {
  api
    .loginApi(identifier, password)
    .then(({ data }) => {
      setSubmitting(false);
      resetForm(true);

      Cookie.set("token", data.jwt);
      Cookie.set("userId", data.user.id);

      axios
        .get(`${backendAPi}/api/usercard/me`, {
          headers: { Authorization: `Bearer ${data.jwt}` },
        })
        .then(({ data }) => {
          dispatch({ type: "FETCH_USER", data });
          Router.push("/");
        });
    })

    .catch((err) => {
      setError(err.response.data.error.message);
      setSubmitting(false);

      setIsErrorVisible(true);

      // Clear the error message after 3 seconds
      setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);
    });
};

export const logout = (dispatch) => {
  dispatch({ type: "REMOVE_USER" });
  Cookie.remove("token");
  Cookie.remove("userId");
  Router.push("/login");
};
