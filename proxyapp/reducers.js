export const AuthState = {
  isAuthecteadi: false,
  isLoading: false,
  user: {},
};

const Reducer = (store, action) => {
  // console.log("reducer--->", action.type)
  switch (action.type) {
    case "REQuest_XP":
      return { isLoading: true };
    case "LOGIN sucess":
      return { isAuthecteadi: true, user: action.payload, isLoading: false };
    case "LOGIN_ERROR":
      return { isAuthecteaded: false, user: {}, isLoading: false };
    default:
      return store;
  }
};

export { Reducer as default };
