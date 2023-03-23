import React, { useContext, useEffect, useState } from "react";
import { login, signup } from "../actions/auth";

import { Context } from "../context/store";
import Link from "next/link";
import iconLogo from "../assets/menu-logo-dark.svg";
import styles from "../styles/Login.module.scss";
import { useRouter } from "next/router";

// import { login } from "../lib/auth";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
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
    if (store.isAuthenticated) {
      router.push("/"); //redirect if you're already logged in
    }
  }, [store, data]);

  function onChange(event) {
    updateData({ ...data, [event.target.name]: event.target.value });
  }

  return (
    <div className="background_dark">
      <div className="section">
        <div className={styles.logo}>
          <img src={iconLogo} />
          <div>Actionise</div>
        </div>

        {isLogin ? (
          <div>
            <div className={styles.label}>Login</div>
            <div className="flex_center mb1">
              New to Actionise?
              <div className="yellow-link" onClick={() => setIsLogin(!isLogin)}>
                Sign up for free
              </div>
            </div>
            <form>
              <input
                onChange={(event) => onChange(event)}
                type="email"
                name="identifier"
                placeholder="Email address"
                className="input mb1"
              />

              <input
                onChange={(event) => onChange(event)}
                type="password"
                name="password"
                placeholder="Password"
                className="input mb1"
              />
              <Link href="/auth/forgot-password">
                <div className="yellow-link">Forgot your password?</div>
              </Link>
            </form>
            <div className={styles.buttons}>
              <div
                onClick={() => {
                  setLoading(true);
                  login(dispatch, data.identifier, data.password);
                }}
                className="btn btn-stretch btn-primary"
              >
                Login
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.label}>Sign Up</div>
            <div className={styles.description}>
              Welcome to Actionise! <br />
              Create an account to access bite-sized Ideas, Actions & Rewards!
            </div>
            <div className="flex_center mb1">
              Already have an account?{" "}
              <div className="yellow-link" onClick={() => setIsLogin(!isLogin)}>
                Login
              </div>
            </div>
            <form>
              <input
                onChange={(event) => onChange(event)}
                type="text"
                name="username"
                placeholder="Username"
                className="input mb1"
              />

              <input
                onChange={(event) => onChange(event)}
                type="text"
                name="email"
                placeholder="Email Address"
                className="input mb1"
              />

              <input
                onChange={(event) => onChange(event)}
                type="password"
                name="password"
                placeholder="Password (8+ characters)"
                className="input mb1"
              />
              <div className={styles.description}>
                By continuing, you agree to Actionise's
                <Link href="/terms-and-conditions">
                  <span className="yellow-link">Terms And Conditions</span>
                </Link>
                and
                <Link href="/privacy-policy">
                  <span className="yellow-link">Privacy Policy.</span>
                </Link>
              </div>
              <div
                onClick={() => {
                  setLoading(true);
                  signup(
                    dispatch,
                    data.username,
                    data.email,
                    data.password,
                    router.query.ref && router.query.ref
                  );
                }}
                className="btn btn-stretch btn-primary"
              >
                Create an Account
              </div>

              <div className={styles.description}>
                Link an account to log in faster in the future
              </div>
            </form>
          </div>
        )}
        <div className={styles.oauthSection}>
          <a href={`${baseUrl}/api/connect/google`}>
            <div className="btn btn-google">
              <img height="18px" src={`${baseUrl}/google.png`} />
            </div>
          </a>

          <div className="btn btn-facebook">
            <img height="18px" src={`${baseUrl}/facebook.png`} />
          </div>
          <div className="btn btn-apple">
            <img height="18px" src={`${baseUrl}/apple.png`} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
