import React, { useState, useEffect, useContext } from "react";
// import { login } from "../lib/auth";
import { Context } from "../context/store";
import { useRouter } from "next/router";
import { login, signup } from "../actions/auth";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [data, updateData] = useState({
    identifier: "",
    password: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const [store, dispatch] = useContext(Context);

  useEffect(() => {
    console.log(isLogin);
    console.log(data);
    if (store.isAuthenticated) {
      router.push("/"); // redirect if you're already logged in
    }
  }, [store, data]);

  function onChange(event) {
    updateData({ ...data, [event.target.name]: event.target.value });
  }

  return (
    <div>
      {isLogin ? (
        <>
          <form>
            <label>Name:</label>

            <input
              onChange={(event) => onChange(event)}
              type="text"
              name="identifier"
            />

            <label>Password:</label>
            <input
              onChange={(event) => onChange(event)}
              type="password"
              name="password"
            />
            <div
              onClick={() => {
                setLoading(true);
                login(dispatch, data.identifier, data.password);
              }}
            >
              Submit
            </div>
          </form>
          <div onClick={() => setIsLogin(!isLogin)}>
            Don't have account? Sign up
          </div>
        </>
      ) : (
        <>
          <form>
            <label>Username</label>

            <input
              onChange={(event) => onChange(event)}
              type="text"
              name="username"
            />

            <label>Email:</label>

            <input
              onChange={(event) => onChange(event)}
              type="text"
              name="email"
            />

            <label>Password:</label>
            <input
              onChange={(event) => onChange(event)}
              type="password"
              name="password"
            />
            <div
              onClick={() => {
                setLoading(true);
                signup(dispatch, data.username, data.email, data.password);
              }}
            >
              Submit
            </div>
          </form>
          <div onClick={() => setIsLogin(!isLogin)}>
            Already have an account? Login
          </div>
        </>
      )}
    </div>
  );
};
export default Login;
