import { useContext } from "react";
import { Context } from "@/context/store";
import { joinCards } from "@/utils/joins";
import Card from "./Card";
import styles from "@/styles/Realm.module.scss";

const CardsMapper = ({ cards, setCardTabTo = false }) => {
  const [store, dispatch] = useContext(Context);
  const usercards = store.user?.usercards || store.usercards;

  return (
    <div className={styles.grid}>
      {cards.length &&
        usercards &&
        joinCards(cards, usercards)
          .sort((a, b) => b.is_open - a.is_open)
          .map((card, i) => (
            <Card card={card} setCardTabTo={setCardTabTo} key={i} />
          ))}
    </div>
  );
};

export default CardsMapper;
