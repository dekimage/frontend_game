import { useQuery } from "@apollo/react-hooks";

export const useConditionalQuery = (query, isAuthenticated, options = {}) => {
  if (!query) {
    return { loading: false, error: null, data: null };
  }

  const result = useQuery(query, {
    ...options,
    skip: !isAuthenticated,
  });

  return isAuthenticated ? result : { loading: false, error: null, data: null };
};
