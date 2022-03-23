import Link from "next/link";
import ProgressBar from "./ProgressBar";
import styles from "../styles/Card.module.scss";
import cx from "classnames";

import iconCollection from "../assets/progress-collection-dark.svg";
import iconPlay from "../assets/progress-play-dark.svg";
import iconLock from "../assets/lock-white-border.svg";
import iconCommon from "../assets/common-rarity.svg";
import iconRare from "../assets/rare-rarity.svg";
import iconEpic from "../assets/epic-rarity.svg";
import iconLegendary from "../assets/legendary-rarity.svg";

const Card = ({ card }) => {
  const isCollected = card.card;
  return (
    <Link
      key={card.id}
      href={{
        pathname: "/card/[id]",
        query: { id: isCollected ? card.card : card.id },
      }}
    >
      <div className={cx(styles.card, { [styles.notCollected]: !isCollected })}>
        <div
          className={styles.background}
          style={{ "--background": card.realm.color }}
        ></div>
        <div
          className={styles.curve}
          style={{ "--background": card.realm.color }}
        ></div>
        {isCollected && (
          <div className={styles.level}>
            {card.level}
            <span className={styles.level_text}>Lvl.</span>
          </div>
        )}

        <div className={styles.realmLogo}>
          <img src={`http://localhost:1337${card.realm.background.url}`} />
        </div>

        <div className={styles.image}>
          <img src={`http://localhost:1337${card.image.url}`} />
        </div>

        <div className={styles.card_body}>
          <div className={styles.rarity_center}>
            <div className={cx(styles.type, [styles[card.type]])}>
              {card.type}
            </div>
          </div>

          <div className={styles.name}>{card.name}</div>

          {isCollected ? (
            <>
              <div className={styles.progress_box}>
                <img
                  src={iconPlay}
                  height="10px"
                  className={styles.progressIcon}
                />
                <ProgressBar progress={card.completed | 2} max={4} />

                <div className={styles.progressTextBox}>
                  <div className={styles.progress_text}>
                    {card.completed | 2}/4
                  </div>
                </div>
              </div>

              <div className={styles.progress_box}>
                <img
                  src={iconCollection}
                  height="10px"
                  className={styles.progressIcon}
                />
                <ProgressBar progress={card.completed | 0} max={10} />
                <div className={styles.progressTextBox}>
                  <div className={styles.progress_text}>
                    {card.completed | 0}/10
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.lockBox}>
              <img
                src={iconLock}
                style={{ height: "20px", marginRight: "1rem" }}
              />
              Open packs to unlock
            </div>
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
