import { Context } from "@/context/store";
import { ImageUI } from "@/components/reusableUI";
import Link from "next/link";
import ProgressBar from "./ProgressBar";
import cx from "classnames";
import iconCheck from "@/assets/checkmark.svg";
import iconCollection from "@/assets/progress-play-dark.svg";
import iconLock from "@/assets/lock-white-border.svg";
import iconPlay from "@/assets/progress-collection-dark.svg";
import styles from "@/styles/Card.module.scss";
import { useContext } from "react";
import baseUrl from "@/utils/settings";
import { ProLabel } from "@/pages/shop";

export const CardType = ({ type }) => {
  return <div className={cx(styles.type, styles[type])}>{type}</div>;
};

export const ProgressBox = ({
  icon,
  progress,
  maxProgress,
  isPercent = false,
}) => {
  return (
    <>
      <div className={styles.progress_box}>
        <img src={icon} height="10px" className={styles.progressIcon} />
        <ProgressBar
          progress={progress}
          max={maxProgress}
          isReadyToClaim={progress >= maxProgress}
        />

        <div className={styles.progressTextBox}>
          <div className={styles.progress_text}>
            {isPercent
              ? `${progress || 0}%`
              : `${progress || 0}/${maxProgress || 0}`}
          </div>
        </div>
      </div>
    </>
  );
};

const OpenCard = ({ card }) => {
  return (
    <div className={styles.openBox}>
      <div className={styles.name}>{card.name}</div>
      <ProgressBox
        icon={iconPlay}
        progress={card.progress}
        maxProgress={card.maxProgress}
        // isPercent
      />
    </div>
  );
};

const ClosedCard = ({ card, comingSoon }) => {
  return (
    <div className={styles.lockBox}>
      <img src={iconLock} style={{ height: "18px" }} />
      <div className={styles.name}>{card.name}</div>
      <div className={styles.costBox}>
        {comingSoon && <div className={styles.comingSoon}>Coming Soon</div>}
        {card.streakreward && (
          <>
            {card.streakreward.streak_count}
            <img height="12px" className="ml25" src={`${baseUrl}/streak.png`} />
          </>
        )}
        {card.friendreward && (
          <>
            {card.friendreward.friends_count}
            <img height="12px" className="ml25" src={`${baseUrl}/user.png`} />
          </>
        )}
        {card.cost > 0 && (
          <>
            {card.cost}
            <img height="12px" className="ml25" src={`${baseUrl}/stars.png`} />
          </>
        )}
        {card.type == "premium" && <ProLabel />}
      </div>
    </div>
  );
};

const Card = ({ card, setCardTabTo = false, isFromShop = false }) => {
  const [store, dispatch] = useContext(Context);
  const isCollected = card.card;
  const isPremiumLocked = card.type == "premium" && !store.user.pro;
  // card.expansion &&
  // card.expansion.name === "Pro" &&
  // store.user.expansions.filter((e) => e.name === "Pro").length === 0;

  const coming_soon = card.card?.coming_soon || card.coming_soon;

  const isUnlocked =
    !isPremiumLocked && (card.is_open || card.is_unlocked) && !coming_soon;

  return (
    <Link
      // key={card.id}
      href={{
        pathname: "/card/[id]",
        query: {
          id: isCollected ? card.card.id : card.id,
          tab: setCardTabTo && setCardTabTo,
        },
      }}
    >
      <div
        className={cx(styles.card, { [styles.notCollected]: !isUnlocked })}
        style={{ "--background": card.realm.color }}
      >
        <div
          className={styles.background}
          style={{ "--background": card.realm.color }}
        ></div>
        <div
          className={styles.curve}
          style={{ "--background": card.realm.color }}
        ></div>

        <div
          className={styles.realmTag}
          style={{ "--background": card.realm.color }}
        >
          {card.realm.name}
        </div>

        <div className={styles.realmLogo}>
          {card.realm?.image && <ImageUI url={card.realm.image.url} />}
        </div>

        <div className={styles.image}>
          <ImageUI
            url={card.image.url}
            style={{
              filter: isFromShop
                ? "none"
                : isUnlocked
                ? "none"
                : "grayscale(100%)",
            }}
          />
        </div>

        <div className={styles.card_body}>
          {isUnlocked ? (
            <OpenCard card={card} />
          ) : (
            <ClosedCard card={card} comingSoon={coming_soon} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default Card;
