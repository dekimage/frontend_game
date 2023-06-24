import React, { useContext, useEffect, useState } from "react";
import { login, signup } from "@/actions/auth";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Context } from "@/context/store";
import Link from "next/link";
import iconLogo from "@/assets/menu-logo-dark.svg";
import styles from "@/styles/Login.module.scss";
import { useRouter } from "next/router";

import baseUrl from "@/utils/settings";
import { Button } from "@/components/reusableUI";
// import { login } from "@/lib/auth";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();
  const [store, dispatch] = useContext(Context);

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Email is Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  useEffect(() => {
    const isLoginPage = router.query.isLoginPage || true;
    setIsLogin(isLoginPage === true);
  }, [router.query]);

  useEffect(() => {
    if (store.isAuthenticated) {
      router.push("/"); //redirect if you're already logged in
    }
  }, [store]);

  function onChange(event) {
    updateData({ ...data, [event.target.name]: event.target.value });
  }

  const onSubmit = (dispatch, values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    if (isLogin) {
      login(dispatch, values.email, values.password, setSubmitting, resetForm);
    } else {
      signup(
        dispatch,
        values.email,
        values.password,
        router.query.ref && router.query.ref,
        setSubmitting,
        resetForm
      );
    }
  };

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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) =>
                onSubmit(dispatch, values, { setSubmitting, resetForm })
              }
            >
              {({ isSubmitting, isValid, submitForm }) => (
                <Form>
                  <div>
                    <div className="input-label">Email Address</div>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      className="input"
                    />

                    <div className="input-error">
                      <ErrorMessage name="email" />
                    </div>
                  </div>

                  <br />

                  <div>
                    <div className="input-label">Password</div>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="input"
                    />
                    <div className="input-error">
                      <ErrorMessage name="password" />
                    </div>
                  </div>

                  <Button
                    type={"primary"}
                    className="mb1 mt1"
                    onClick={submitForm}
                    children={!isSubmitting && "Login"}
                    isLoading={isSubmitting}
                    isDisabled={!isValid}
                    autofit
                  />
                </Form>
              )}
            </Formik>

            <Link href="/auth/forgot-password">
              <div className="yellow-link">Forgot your password?</div>
            </Link>
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) =>
                onSubmit(dispatch, values, { setSubmitting, resetForm })
              }
            >
              {({ isSubmitting, isValid, submitForm }) => (
                <Form>
                  <div>
                    <div className="input-label">Email Address</div>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      className="input"
                    />

                    <div className="input-error">
                      <ErrorMessage name="email" />
                    </div>
                  </div>

                  <br />

                  <div>
                    <div className="input-label">Password</div>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="input"
                    />
                    <div className="input-error">
                      <ErrorMessage name="password" />
                    </div>
                  </div>

                  <Button
                    type={"primary"}
                    className="mb1 mt1"
                    onClick={submitForm}
                    children={!isSubmitting && "Create an account"}
                    isLoading={isSubmitting}
                    isDisabled={!isValid}
                    autofit
                  />
                </Form>
              )}
            </Formik>

            <div className={styles.description}>
              Link an account to log in faster in the future
            </div>
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
