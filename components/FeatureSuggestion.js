import React, { useContext, useState } from "react";

import { Button } from "./reusableUI";
import { Context } from "../context/store";
import { rateCard, sendFeatureMail } from "../actions/action";
import styles from "../styles/FeatureSuggestion.module.scss";

export function FeatureSuggestion({
  type,
  cardId = false,
  defaultPlaceholder = false,
  handleRateCard,
}) {
  const [details, setDetails] = useState(defaultPlaceholder || "");
  const [store, dispatch] = useContext(Context);

  const isDisabled = details.length <= 0 || !type;
  // || store.user.mail_send_count >= 25;

  const handleSubmit = () => {
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
    if (type === "rateCard") {
      rateCard(dispatch, details, cardId, "message");
      handleRateCard();
    } else {
      sendFeatureMail(dispatch, details, subject);
    }
  };

  // const maxFeedbackMessage =
  //   "You have reached the maximum number of times you can send us feedback. If you wish to reset this limit, please contact us at contact@actionise.com";
  const rateCardMessage =
    "How would you implement this card in your life? Share your opinion about the card and you'll get a one time reward of 25 gems for each card you rate!";
  const defaultFeedbackMessage =
    "Feel free to write your wildest ideas here. This will go directly to our email, and we'll handle it from there. Remember, there is no good or bad feedback :)";

  return (
    <div className={styles.feedbackForm}>
      <div className={styles.feedbackForm__label}>
        {type === "rateCard" ? rateCardMessage : defaultFeedbackMessage}
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
