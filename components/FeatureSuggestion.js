import React, { useContext, useState } from "react";

import { Button } from "./reusableUI";
import { Context } from "../context/store";
import { sendFeatureMail } from "../actions/action";
import styles from "../styles/FeatureSuggestion.module.scss";

function FeatureSuggestion({ type }) {
  const [details, setDetails] = useState("");
  const [store, dispatch] = useContext(Context);

  const isDisabled =
    details.length <= 0 || !type || store.user.mail_send_count >= 25;

  const handleSubmit = (event) => {
    event.preventDefault();
    // generate custom subject based on email type
    const subject =
      type === "feature request"
        ? "New feature request"
        : type === "bug report"
        ? "New bug report"
        : type === "contact us"
        ? "New contact request"
        : "";
    // send feature suggestion or bug report to Strapi API
    if (isDisabled) {
      return;
    }
    sendFeatureMail(dispatch, details, subject);
  };

  const maxFeedbackMessage =
    "You have reached the maximum number of times you can send us feedback. If you wish to reset this limit, please contact us at contact@actionise.com";
  const defaultFeedbackMessage =
    "Feel free to write your wildest ideas here. This will go directly to our email, and we'll handle it from there. Remember, there is no good or bad feedback :)";

  return (
    <div className={styles.feedbackForm}>
      <div className={styles.feedbackForm__label}>
        {store.user.mail_send_count >= 25
          ? maxFeedbackMessage
          : defaultFeedbackMessage}
      </div>
      <textarea
        id="feedback-input"
        className={styles.feedbackForm__input}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <Button
        type={"primary"}
        isDisabled={isDisabled}
        onClick={handleSubmit}
        children={"Send Feedback"}
        isLoading={store.isLoading}
      />
    </div>
  );
}

export default FeatureSuggestion;
