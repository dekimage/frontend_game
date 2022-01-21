import Link from "next/link";
import ProgressBar from "./ProgressBar";
import styles from "../styles/Card.module.scss";
import cx from "classnames";

const Card = ({ card }) => {
  return (
    <Link
      key={card.id}
      href={{ pathname: "/card/[id]", query: { id: card.id } }}
    >
      <div className={styles.card}>
        <div
          className={styles.background}
          style={{ "--background": card.realm.color }}
        ></div>
        <div
          className={styles.curve}
          style={{ "--background": card.realm.color }}
        ></div>
        {/* <div className={styles.lock}>
            <img src="http://localhost:1337/lock-black.png" />
          </div> */}

        <div className={styles.image}>
          <img src={`http://localhost:1337${card.image.url}`} />
        </div>

        <div className={styles.card_body}>
          <div className={styles.lock}>
            <img src="http://localhost:1337/lock-black.png" />
          </div>
          <div className={styles.name}>{card.name}</div>

          {/* <div className={styles.rarity_center}>
            <div className={styles.rarity}>{card.rarity}</div>
          </div> */}

          <div className={styles.rarity_center}>
            {/* <div className={styles.rarity}>{card.type}</div> */}
            <div className={cx(styles.type, [styles[card.type]])}>
              {card.type}
            </div>
            <div className={styles.rarity}>
              {card.isOpen ? "open" : "collectable"}
            </div>
          </div>

          <div className={styles.progress_box}>
            <ProgressBar progress={card.completed | 50} max={100} />
            <div className={styles.progress_text}>{card.completed | 50}%</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
