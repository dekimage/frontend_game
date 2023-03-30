import * as Yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";

import { Button } from "../../components/reusableUI";
import Link from "next/link";
import axios from "axios";
import styles from "../../styles/Settings.module.scss";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const { push, query } = useRouter();
  const [alert, setAlert] = useState();

  const initialValues = {
    password: "",
    passwordConfirmation: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string().required("Required"),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  useEffect(() => {
    if (!query.code) {
      setAlert([
        "alert",
        "You don't have a valid code. Please request a new one via Forget Password page.",
      ]);
      return;
    }
  }, []);

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setAlert();

    values.code = query.code;

    axios
      .post("auth/reset-password", values)
      .then((response) => {
        const message = `Your password has been resetted. In a few second you'll be redirected to login page.`;
        setAlert(["success", message]);

        resetForm();

        setTimeout(() => {
          push("/login");
        }, 3000);
      })
      .catch((error) => {
        if (!query.code) {
          setAlert([
            "alert",
            "You don't have a valid code. Please request a new one via Forget Password page.",
          ]);
          return;
        }
        if (!error.response.data.error) {
          setAlert(["alert", "Something went wrong. Please try again."]);
        } else {
          const messages = error.response.data.error.message;

          setAlert(["alert", messages]);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const router = useRouter();

  return (
    <div className="background_dark">
      <div className={styles.header}>
        <div className={styles.back} onClick={() => router.back()}>
          <ion-icon name="chevron-back-outline"></ion-icon>
        </div>

        <div className={styles.title}>Reset Password</div>
      </div>
      <div className="section">
        {alert && (
          <div
            style={{
              backgroundColor:
                alert[0] === "success" ? "lightgreen" : "lightcoral",
            }}
            className="alert"
          >
            <div dangerouslySetInnerHTML={{ __html: alert[1] }} />
          </div>
        )}

        <br />
        {!query.code && (
          <Link href="/auth/forgot-password">
            <div className="btn btn-primary btn-stretch mb1">
              Request a new code
            </div>
          </Link>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) =>
            onSubmit(values, { setSubmitting, resetForm })
          }
        >
          {({ isSubmitting, isValid, submitForm }) => (
            <Form>
              <div>
                <div className="input-label">New Password</div>
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

              <br />

              <div>
                <div className="input-label">Confirm Password</div>
                <Field
                  type="password"
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  placeholder="Repeat password"
                  className="input"
                />
                <div className="input-error">
                  <ErrorMessage name="passwordConfirmation" />
                </div>
              </div>

              <br />

              <div className="info">
                <div className="bold">Reset Password</div>
                <div>
                  Enter your new password and then use it to login to your
                  account.
                </div>
              </div>

              <Button
                type={"primary"}
                className="mb1 mt1"
                onClick={submitForm}
                children={
                  <>
                    {!isSubmitting && "Reset password"}
                    {isSubmitting && "Loading..."}
                  </>
                }
                isLoading={isSubmitting}
                isDisabled={!isValid || !query.code}
                autofit
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
