import Link from "next/link";
import { ContentStat } from "./ContentStat";

import iconCheck from "@/assets/checkmark.svg";
import iconClock from "@/assets/iconClock.svg";

import iconMessages from "@/assets/iconMessages.svg";

import iconTasks from "@/assets/iconTasks.svg";

import styles from "@/styles/Course.module.scss";

const countSteps = (content) => content.action?.steps?.length;
const countMessages = (input) => input.split("\n\n").length;
// const actionDuration = (content) =>
//   content.action?.steps?.map((step) => step.timer).reduce((a, b) => a + b, 0);

export const ContentComponent = ({
  content,
  cardId,
  isLast,
  index,
  isTicketPurchased,
  isProgramMastered,
}) => {
  const contentStats =
    content.type == "action"
      ? [
          { icon: iconClock, amount: content.action?.duration, label: "min" },
          {
            icon: iconTasks,
            amount: countSteps(content),
            label: "action steps",
          },
        ]
      : [
          { icon: iconClock, amount: content.duration, label: "min" },
          {
            icon: iconMessages,
            amount: countMessages(content.storyline),
            label: "messages ",
          },
        ];

  return (
    <div className={styles.content}>
      <div
        className={`${styles.contentCounter} ${
          isProgramMastered && styles.completed
        }`}
      >
        {!isLast && <div className={styles.contentDottedBorder}></div>}
        {isProgramMastered ? (
          <img src={iconCheck} alt="" height="20px" />
        ) : (
          <div>{index}</div>
        )}
      </div>
      <div className={styles.contentBox}>
        <div className={styles.contentLeftBox}>
          <div className="flex_start">
            <div
              className={`${styles.contentTag} ${
                content.type == "action" && styles.action
              }`}
            >
              {content.type}
            </div>
            {isProgramMastered && (
              <div className={`${styles.contentTag} ${styles.completed}`}>
                Completed
              </div>
            )}
          </div>

          <div className={styles.contentTitle}>{content.title}</div>
          <div className={styles.contentFooter}>
            <ContentStat
              icon={contentStats[1].icon}
              amount={contentStats[1].amount}
              label={contentStats[1].label}
            />
            {/* {contentStats.map((cs, i) => (
              <ContentStat
                icon={cs.icon}
                amount={cs.amount}
                label={cs.label}
                key={i}
              />
            ))} */}
          </div>
        </div>
        <div className="flex_center">
          {isTicketPurchased || isProgramMastered ? (
            <Link
              href={`/card/player/${cardId}?contentIndex=${content.index}`}
              as={`/card/player/${cardId}?contentIndex=${content.index}`}
            >
              <div className={styles.btnPlay}>
                <ion-icon size="medium" name="play"></ion-icon>
              </div>
            </Link>
          ) : (
            <div className={styles.btnPlayDisabled}>
              <ion-icon size="medium" name="play"></ion-icon>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
