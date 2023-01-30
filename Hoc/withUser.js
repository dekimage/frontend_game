import { useContext } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { normalize } from "../utils/calculations";

export const withUser = (WrappedComponent, query) => {
  return (props) => {
    const [store, dispatch] = useContext(Context);
    const { user } = store;

    if (!query) {
      return <WrappedComponent {...props} user={user} dispatch={dispatch} />;
    }

    const { loading, error, data } = useQuery(query);
    const gql_data = data && normalize(data);

    if (loading || error || !user) {
      return <div>loading...</div>;
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
