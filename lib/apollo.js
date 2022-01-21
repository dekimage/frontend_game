import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-unfetch";
import Cookies from "js-cookie";

// Replace this with your project's endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
const GQL_API = `${API_URL}/graphql`;
let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

const httpLink = createHttpLink({
  uri: GQL_API,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Cookies.get("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

function create(initialState) {
  return new ApolloClient({
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
