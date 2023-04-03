import axios from "axios";
import { useState, useEffect, useContext } from "react";
import Cookie from "js-cookie";
import { Context } from "../../../context/store";
import router from "next/router";
import Loader from "../../../components/reusable/Loader";
import baseUrl from "../../../utils/settings";

const GoogleCallback = ({ access_token, query }) => {
  const [store, dispatch] = useContext(Context);
  useEffect(() => {
    const fetchData = async () => {
      console.log({ query });
      try {
        // Make GET request to API endpoint with ID token
        const response = await axios.get(
          `${baseUrl}/api/auth/google/callback?access_token=${access_token}`
          // {
          //   headers: {
          //     Authorization: `Bearer ${id_token}`,
          //   },
          // }
        );
        console.log(response.data);
        // Make second API call using user data
        Cookie.remove("token");
        Cookie.remove("userId");
        Cookie.set("token", response.data.jwt);
        Cookie.set("userId", response.data.user.id);
        dispatch({ type: "FETCH_USER", data: response.data.user });
        router.push("/");

        // const secondResponse = await axios.post(`bk/api/user`, userData);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, []);

  return <Loader />;
};

GoogleCallback.getInitialProps = async ({ query }) => {
  return { access_token: query.access_token, query };
};

export default GoogleCallback;
