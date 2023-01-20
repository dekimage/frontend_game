import axios from "axios";
import { useState, useEffect, useContext } from "react";
import Cookie from "js-cookie";
import { Context } from "../../../context/store";
import router from "next/router";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const GoogleCallback = ({ id_token, query }) => {
  const [store, dispatch] = useContext(Context);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make GET request to API endpoint with ID token
        const response = await axios.get(
          `${baseUrl}/api/auth/google/callback?access_token=${id_token}`
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
        console.log({ responseData: response.data });

        // const secondResponse = await axios.post(`bk/api/user`, userData);
      } catch (error) {
        // Handle error
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {userData ? (
        <p>User data: {JSON.stringify(userData)}</p>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

GoogleCallback.getInitialProps = async ({ query }) => {
  return { id_token: query.id_token, query };
};

export default GoogleCallback;
