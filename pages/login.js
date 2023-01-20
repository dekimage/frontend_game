import React, { useState, useEffect, useContext } from "react";
// import { login } from "../lib/auth";
import { Context } from "../context/store";
import { useRouter } from "next/router";
import { login, signup } from "../actions/auth";
import styles from "../styles/Login.module.scss";
import iconLogo from "../assets/menu-logo-dark.svg";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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
            <div className="flex_center">
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
                className={styles.input}
              />

              <input
                onChange={(event) => onChange(event)}
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
              />
              <div className="yellow-link">Forgot your password?</div>
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
            <div className="flex_center">
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
                className={styles.input}
              />

              <input
                onChange={(event) => onChange(event)}
                type="text"
                name="email"
                placeholder="Email Address"
                className={styles.input}
              />

              <input
                onChange={(event) => onChange(event)}
                type="password"
                name="password"
                placeholder="Password (8+ characters)"
                className={styles.input}
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
          <a href={`${baseUrl}/api/connect/google/callback`}>
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
