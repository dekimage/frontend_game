import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import _ from "lodash";
import styles from "../../styles/Realm.module.scss";
import ProgressBar from "../../components/ProgressBar";
import Card from "../../components/Card";

const GET_REALM_ID = gql`
  query ($id: ID!) {
    realm(id: $id) {
      id
      name
      description
      cards {
        id
        name
        description
        type
        rarity
        isOpen
        image {
          url
        }
        realm {
          name
          color
          background {
            url
          }
        }
      }
    }
  }
`;

const Cards = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_REALM_ID, {
    variables: { id: router.query.id },
  });
  const usercards = store.user && store.user.usercards;
  const joinCards = (cards, usercards) => {
    const joinedCards = cards.map((card) => {
      let collectionCard = usercards.filter(
        (c) => c.card === parseInt(card.id)
      );
      if (collectionCard) {
        return _.merge(card, collectionCard[0]);
      }
      return card;
    });
    return joinedCards;
  };

  return (
    <div className="background_dark">
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {data && (
          <div className={styles.header}>
            <div className={styles.back} onClick={() => router.back()}>
              <ion-icon name="chevron-back-outline"></ion-icon>
            </div>

            {data.realm.name}
          </div>
        )}
        <div className={styles.grid}>
          {data &&
            store.user &&
            store.user.usercards &&
            joinCards(data.realm.cards, usercards).map((card, i) => (
              <Card card={card} key={i} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Cards;
