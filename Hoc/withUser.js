import { Context } from "@/context/store";
import LandingPage from "@/components/LandingPage";
import Loader from "@/components/reusable/Loader";
import { normalize } from "@/utils/calculations";
import { useContext, useEffect } from "react";
import { useConditionalQuery } from "@/hooks/useConditionalQuery"; // Import the custom hook
import { useRouter } from "next/router";
import Cookie from "js-cookie";

const AUTH_TOKEN = Cookie.get("token");

export const withUser = (
  WrappedComponent,
  query,
  isRouter = false,
  isUserQuery = false
) => {
  return (props) => {
    const [store, dispatch] = useContext(Context);
    const { user } = store;
    const router = useRouter();
    const isLandingPage = router.query.isLandingPage;

    useEffect(() => {
      if (!AUTH_TOKEN) {
        router.push("/");
      }
    }, []);

    const { loading, error, data } = useConditionalQuery(
      query,
      store.isAuthenticated,
      {
        variables: (isRouter || isUserQuery) && {
          id: isUserQuery ? store.user?.id : router.query.id,
        },
      }
    );

    const gql_data = data && normalize(data);

    if (isLandingPage) {
      return <LandingPage />;
    }

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <div>Error Comp</div>;
    }

    if (!AUTH_TOKEN && !store.isAuthenticated) {
      return <LandingPage />;
    }

    if (!query && AUTH_TOKEN && store.isAuthenticated) {
      return <WrappedComponent {...props} user={user} dispatch={dispatch} />;
    }

    if (gql_data && AUTH_TOKEN && store.isAuthenticated) {
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
