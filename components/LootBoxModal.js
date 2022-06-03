import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import Card from "../components/Card";
import { ImageUI } from "../components/reusableUI";
import styles from "../styles/Shop.module.scss";
import { closeRewardsModal } from "../actions/action";

const LootBoxModal = () => {
  const [store, dispatch] = useContext(Context);
  const results = store.rewardsModal.results;
  const box = store.rewardsModal.box;
  const [position, setPosition] = useState(0);
  const [card, setCard] = useState(results[position]);

  const [page, setPage] = useState("box");
  const [counter, setCounter] = useState(results.length);

  const nextPage = () => {
    setCounter(counter - 1);
    if (page === "box") {
      setPage("cards");
    }
    if (page === "cards") {
      if (position < results.length - 1) {
        setCard(results[position + 1]);
        setPosition(position + 1);
      } else {
        setPage("results");
      }
    }
  };

  return (
    <div className={styles.boxModal}>
      <div className="text__b">
        {page === "box" && box.name}
        {page === "cards" && (
          <div className={styles.rarityLabel}>{card.card.rarity} Card</div>
        )}
        {page === "results" && "You Got:"}
      </div>
      {page === "cards" && (
        <div className={styles.duplicateLabel}>
          {card.isNew ? "New" : "Duplicate"}
        </div>
      )}

      {page === "box" && (
        <div className={styles.wobbleAnimation}>
          <ImageUI imgUrl={box.image.url} height="250px" />
        </div>
      )}
      {page === "cards" && (
        <div className={styles.wobbleAnimation}>
          <Card card={card.card} /> Qty: {card.quantity}
        </div>
      )}
      {page === "results" && (
        <div>
          {results.map((c, i) => (
            <div key={i}>
              <div className={styles.duplicateLabel}>
                {card.isNew ? "New" : "Duplicate"}
              </div>
              <Card card={c.card} key={i} />
              Qty: {card.quantity}
            </div>
          ))}
        </div>
      )}
      {!(page === "results") && (
        <div className="modal-close-button-lootbox  m1">{counter}</div>
      )}
      {page === "results" ? (
        <div
          className="btn btn-primary m1"
          onClick={() => closeRewardsModal(dispatch)}
        >
          Claim
        </div>
      ) : (
        <div className="btn btn-primary m1" onClick={nextPage}>
          {counter === 0 ? "See Results" : "Tap to open next"}
        </div>
      )}
    </div>
  );
};
export default LootBoxModal;
