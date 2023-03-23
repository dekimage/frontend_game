import * as Yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";

import { Button } from "../../components/reusableUI";
import axios from "axios";
import styles from "../../styles/Settings.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";

const ForgotPassword = () => {
  const [alert, setAlert] = useState();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Insert a valid email")
      .required("Email is required"),
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setAlert();

    axios
      .post("/auth/forgot-password", values)
      .then((response) => {
        const message = `Please check your email to reset your password.`;
        setAlert(["success", message]);

        resetForm();
      })
      .catch((error) => {
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

        <div className={styles.title}>Forgot Password</div>
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
                <div className="input-label">Email Address</div>
                <Field
                  className="input"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
                <div className="input-error">
                  <ErrorMessage name="email" />
                </div>
              </div>

              <div className="info">
                <div className="bold">Change Password</div>
                <div>
                  We'll send you an email with a link to change your password.
                  If you don't receive it, please check your spam or junk
                  folder.
                </div>
              </div>

              <Button
                type={"primary"}
                className="mb1 mt1"
                onClick={submitForm}
                children={
                  <>
                    {!isSubmitting && "Send link"}
                    {isSubmitting && "Loading..."}
                  </>
                }
                isLoading={isSubmitting}
                isDisabled={!isValid}
                autofit
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
