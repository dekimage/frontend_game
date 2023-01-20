import axios from "axios";
import { useState, useEffect } from "react";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const GoogleCallback = ({ id_token, query }) => {
  const [userData, setUserData] = useState(null);
  console.log({ id_token, query });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make GET request to API endpoint with ID token
        const response = await axios.get(
          `${baseUrl}/auth/google/callback?access_token=${id_token}`,
          {
            headers: {
              Authorization: `Bearer ${id_token}`,
            },
          }
        );
        setUserData(response.data);
        // Make second API call using user data
        const secondResponse = await axios.post(`bk/api/user`, userData);
        // Handle success
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
