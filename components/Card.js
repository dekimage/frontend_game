import Link from "next/link";
import ProgressBar from "./ProgressBar";
import styles from "../styles/Card.module.scss";
import cx from "classnames";

import { Context } from "../context/store";

import iconCheck from "../assets/checkmark.svg";
import iconPlay from "../assets/progress-collection-dark.svg";
import iconCollection from "../assets/progress-play-dark.svg";
import iconLock from "../assets/lock-white-border.svg";
import iconCommon from "../assets/common-rarity.svg";
import iconRare from "../assets/rare-rarity.svg";
import iconEpic from "../assets/epic-rarity.svg";
import iconLegendary from "../assets/legendary-rarity.svg";
import { useContext } from "react";

const getMaxQuantity = (level) => {
  const data = {
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 10,
  };
  return data[level];
};

export const CardType = ({ type }) => {
  return <div className={cx(styles.type, styles[type])}>{type}</div>;
};

const ProgressBox = ({ icon, progress, maxProgress }) => {
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
            {progress}/{maxProgress}
          </div>
        </div>
      </div>
    </>
  );
};

const OpenCard = ({ card, maxQuantity }) => {
  return (
    <>
      <ProgressBox
        icon={iconCollection}
        progress={card.quantity || 1}
        maxProgress={maxQuantity || 2}
      />
      <ProgressBox
        icon={iconPlay}
        progress={card.completed || 0}
        maxProgress={5}
      />
    </>
  );
};

const ClosedCard = ({ card }) => {
  return (
    <>
      <ProgressBox
        icon={iconCollection}
        progress={card.quantity || 0}
        maxProgress={10}
      />
      <div className={styles.lockBox}>
        <img
          src={card.quantity >= 10 ? iconCheck : iconLock}
          style={{ height: "20px", marginRight: "1rem" }}
        />
        {card.quantity >= 10 ? "Ready to Unlock!" : "Collect 10 to Unlock"}
      </div>
    </>
  );
};

const Card = ({ card }) => {
  const [store, dispatch] = useContext(Context);
  const isCollected = card.card;
  const maxQuantity = getMaxQuantity(card.level);
  const isPremiumLocked =
    card.expansion &&
    card.expansion.name === "Pro" &&
    store.user.expansions.filter((e) => e.name === "Pro").length === 0;

  // console.log(isPremiumLocked);
  // console.log(card);

  const isColored = !isPremiumLocked && (card.isOpen || card.isUnlocked);
  return (
    <Link
      key={card.id}
      href={{
        pathname: "/card/[id]",
        query: { id: isCollected ? card.card : card.id },
      }}
    >
      <div
        className={cx(styles.card, { [styles.notCollected]: !isColored })}
        style={{ "--background": card.realm.color }}
      >
        {!isColored && (
          <div className={styles.lock}>
            <img src={iconLock} />
          </div>
        )}

        <div
          className={styles.background}
          style={{ "--background": card.realm.color }}
        ></div>
        <div
          className={styles.curve}
          style={{ "--background": card.realm.color }}
        ></div>
        {isColored && (
          <div className={styles.level}>
            <span className={styles.level_text}>Lvl</span>
            {card.level || 1}
          </div>
        )}

        {card.is_new && <div className={styles.isNew}>New!</div>}

        <div className={styles.realmLogo}>
          <img src={`http://localhost:1337${card.realm.background.url}`} />
        </div>

        <div className={styles.image}>
          <img
            src={`http://localhost:1337${card.image.url}`}
            style={{ filter: !isColored && "grayscale(100%)" }}
          />
        </div>

        <div className={styles.card_body}>
          <div className={styles.rarity_center}>
            {isColored ? (
              <CardType type={"open"} />
            ) : (
              <CardType type={card.type} />
            )}
          </div>

          <div className={styles.name}>{card.name}</div>

          {isColored ? (
            <OpenCard card={card} maxQuantity={maxQuantity} />
          ) : (
            <ClosedCard card={card} />
          )}
        </div>

        <div className={styles.rarity}>
          {card.rarity === "common" && <img src={iconCommon} />}
          {card.rarity === "rare" && <img src={iconRare} />}
          {card.rarity === "epic" && <img src={iconEpic} />}
          {card.rarity === "legendary" && <img src={iconLegendary} />}
        </div>
      </div>
    </Link>
  );
};

export default Card;
