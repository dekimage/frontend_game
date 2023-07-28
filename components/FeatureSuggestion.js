import React, { useContext, useState } from "react";

import { Button } from "./reusableUI";
import { Context } from "@/context/store";
import { rateCard, sendFeatureMail } from "@/actions/action";
import styles from "@/styles/FeatureSuggestion.module.scss";

export function FeatureSuggestion({
  type,
  cardId = false,
  defaultPlaceholder = false,
  handleRateCard,
  afterSendMail,
}) {
  const [details, setDetails] = useState(defaultPlaceholder || "");
  const [store, dispatch] = useContext(Context);

  const isDisabled = details.length <= 0 || !type;
  // || store.user.mail_send_count >= 25;

  const handleSubmit = async () => {
    // generate custom subject based on email type
    let subject;

    switch (type) {
      case "feature":
        subject = "New feature request";
        break;
      case "bug":
        subject = "New bug report";
        break;
      case "contact":
        subject = "Contact Us";
        break;
      default:
        subject = "Default subject";
        break;
    }

    if (isDisabled) {
      return;
    }

    if (type === "rateCard") {
      rateCard(dispatch, details, cardId, "message");
      handleRateCard();
    } else {
      await sendFeatureMail(dispatch, details, subject);
      afterSendMail();
    }
  };

  // const maxFeedbackMessage =
  //   "You have reached the maximum number of times you can send us feedback. If you wish to reset this limit, please contact us at contact@actionise.com";
  const rateCardMessage =
    "How would you implement this card in your life? Share your opinion about the card and you'll get a one time reward of 25 stars for each card you rate!";
  const feedBackMessage =
    "Feel free to write your wildest ideas here. This will go directly to our email, and we'll handle it from there. Remember, there is no good or bad feedback :)";
  const bugReportMessage =
    "If you've encountered any issues, glitches, or bugs while using our platform, please let us know. Your detailed description of the problem will help us investigate and resolve it promptly. Thank you for taking the time to report this issue!";
  const contactUsMessage =
    "Have any questions, suggestions, or simply want to get in touch with us? We'd love to hear from you! Feel free to reach out using this form, and we'll get back to you as soon as possible. Your feedback and inquiries are valuable to us!";
  let message;

  switch (type) {
    case "rateCard":
      message = rateCardMessage;
      break;
    case "feature":
      message = feedBackMessage;
      break;
    case "bug":
      message = bugReportMessage;
      break;
    case "contact":
      message = contactUsMessage;
      break;
    default:
      message = "Default message";
      break;
  }
  return (
    <div className={styles.feedbackForm}>
      <div className={styles.feedbackForm__label}>{message}</div>
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
