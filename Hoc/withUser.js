import { Context } from "../context/store";
import LandingPage from "../components/LandingPage";
import { normalize } from "../utils/calculations";
import { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

export const withUser = (WrappedComponent, query) => {
  return (props) => {
    const [store, dispatch] = useContext(Context);
    const { user } = store;
    const router = useRouter();

    if (!query) {
      return <WrappedComponent {...props} user={user} dispatch={dispatch} />;
    }

    const { loading, error, data } = useQuery(query);
    const gql_data = data && normalize(data);

    if (loading) {
      return <div>Loading Comp</div>;
    }

    if (error) {
      return <div>Error Comp</div>;
    }

    if (!store.isAuthenticated) {
      if (router.pathname === "/") {
        return <LandingPage />;
      }
      router.push("/login");
    }

    if (gql_data) {
      return (
        <WrappedComponent
          {...props}
          data={gql_data}
          user={user}
          dispatch={dispatch}
          store={store}
        />
      );
    }

    return null;
  };
};
