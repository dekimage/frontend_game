import Lottie from "lottie-react";
import cx from "classnames";
import heartLottie from "@/assets/lottie-animations/gift-heart.json";
import styles from "@/styles/Modals.module.scss";
import { useState } from "react";

import baseUrl from "@/utils/settings";
const ShareBuddyModal = ({ id }) => {
  const [copyButton, setCopyButton] = useState("Copy");
  const perks = [
    { content: "Share your referral link" },
    { content: "Your buddy creates an account" },
    { content: "Logs in to the app & claims gift" },
    { content: "Both of you get + 400 stars" },
  ];
  const Perk = ({ content, i }) => {
    return (
      <div className={styles.perk}>
        <div className={styles.perk_iterate}>{i}</div>
        <div className={styles.perk_content}>{content}</div>
      </div>
    );
  };
  return (
    <div className={styles.shareBuddyModal}>
      <div className={styles.shareBuddyModal_title}>Refer & Earn</div>
      <Lottie
        animationData={heartLottie}
        loop={true}
        style={{ width: "150px" }}
      />
      <div className={styles.shareBuddyModal_reward}>
        + 400 <img src={`${baseUrl}/star.png`} alt="" height="14px" />
      </div>
      <div className={styles.perkBox}>
        {perks.map((p, i) => {
          return <Perk key={i} i={i + 1} content={p.content} />;
        })}
      </div>

      <div className={styles.ctaLink}>
        <input value={`https://actionise.com/login?ref=${id}`} readOnly></input>
        <div
          className={cx([styles.ctaLink_copy], {
            [styles.green]: copyButton == "Copied!",
          })}
          onClick={() => {
            navigator.clipboard.writeText(
              `https://actionise.com/login?ref=${id}`
            );
            setCopyButton("Copied!");
          }}
        >
          {copyButton}
        </div>
      </div>
    </div>
  );
};

export default ShareBuddyModal;
