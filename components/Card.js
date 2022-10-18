import Link from "next/link";
import ProgressBar from "./ProgressBar";
import styles from "../styles/Card.module.scss";
import cx from "classnames";

import { Context } from "../context/store";
import { ImageUI } from "../components/reusableUI";

import iconCheck from "../assets/checkmark.svg";
import iconPlay from "../assets/progress-collection-dark.svg";
import iconCollection from "../assets/progress-play-dark.svg";
import iconLock from "../assets/lock-white-border.svg";
import iconCommon from "../assets/common-rarity.svg";
import iconRare from "../assets/rare-rarity.svg";
import iconEpic from "../assets/epic-rarity.svg";
import iconLegendary from "../assets/legendary-rarity.svg";
import { useContext } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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
            {isPercent ? `${progress}%` : `${progress}/${maxProgress}`}
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
        progress={card.completed || 0}
        maxProgress={5}
      />
    </div>
  );
};

const ClosedCard = ({ card }) => {
  return (
    <div className={styles.lockBox}>
      <img
        src={card.quantity >= 10 ? iconCheck : iconLock}
        style={{ height: "18px" }}
      />
      <div className={styles.name}>{card.name}</div>
      <div className={styles.costBox}>
        400 <img height="12px" className="ml25" src={`${baseUrl}/stars.png`} />
      </div>
    </div>
  );
};

const Card = ({ card }) => {
  const [store, dispatch] = useContext(Context);
  const isCollected = card.card;
  const isPremiumLocked =
    card.expansion &&
    card.expansion.name === "Pro" &&
    store.user.expansions.filter((e) => e.name === "Pro").length === 0;

  const isColored = !isPremiumLocked && (card.is_open || card.is_unlocked);

  return (
    <Link
      // key={card.id}
      href={{
        pathname: "/card/[id]",
        query: { id: isCollected ? card.card.id : card.id },
      }}
    >
      <div
        className={cx(styles.card, { [styles.notCollected]: !isColored })}
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

        <div className={styles.rarity}>
          {card.rarity === "common" && <img src={iconCommon} />}
          {card.rarity === "rare" && <img src={iconRare} />}
          {card.rarity === "epic" && <img src={iconEpic} />}
          {card.rarity === "legendary" && <img src={iconLegendary} />}
        </div>

        <div className={styles.realmLogo}>
          <img src={card.realm.image.url} />
        </div>

        <div className={styles.image}>
          <img
            // src={card.image.url}
            src={`${baseUrl}${card.image.url}`}
            style={{ filter: !isColored && "grayscale(100%)" }}
          />
        </div>
        <div className={styles.card_body}>
          {isColored ? <OpenCard card={card} /> : <ClosedCard card={card} />}
        </div>
      </div>
    </Link>
  );
};

export default Card;
