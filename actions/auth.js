import Router from "next/router";
import Cookie from "js-cookie";
import * as api from "../api";

export const signup = (
  dispatch,
  username,
  email,
  password,
  sharedByUserId = false
) => {
  api
    .signupApi(username, email, password, sharedByUserId)
    .then(({ data }) => {
      dispatch({ type: "FETCH_USER", data: data.user });
      Cookie.set("token", data.jwt);
      Cookie.set("userId", data.user.id);
      Router.push("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const login = (dispatch, identifier, password) => {
  api
    .loginApi(identifier, password)
    .then(({ data }) => {
      dispatch({ type: "FETCH_USER", data: data.user });
      Cookie.set("token", data.jwt);
      Cookie.set("userId", data.user.id);
      Router.push("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const logout = () => {
  dispatch({ type: "REMOVE_USER" });
  Cookie.remove("token");
  Router.push("/");
};
