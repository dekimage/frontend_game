import Link from "next/link";
import styles from "@/styles/Today.module.scss";

export const RewardLink = ({ img, link, text, onClick, notification = 0 }) => {
  return (
    <Link href={link}>
      <div className={styles.activityBox} onClick={onClick}>
        {notification !== 0 && (
          <div className={styles.activityBox_notification}>{notification}</div>
        )}
        <div className={styles.activityBox_img}>
          <img src={img} height="25px" />
        </div>

        <div className={styles.activityBox_text}>{text}</div>
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </div>
    </Link>
  );
};
