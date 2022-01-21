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
        duration
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

const example_json = {
  1: {
    level: 2,
    completed: 4,
    completed_at: "date-2022-22-22",
    obtained_at: "date-2022-22-22",
    quantity: 4,
    is_new: true,
  },
  2: {
    level: 1,
    completed: 1,
    completed_at: "date-2022-22-22",
    obtained_at: "date-2022-22-22",
    quantity: 0,
    is_new: false,
  },
};

const Cards = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_REALM_ID, {
    variables: { id: router.query.id },
  });
  const joinCards = (cards, collection_json) => {
    const joinedCards = cards.map((card) => {
      // let updatedCard = card;
      let collectionCard = collection_json[card.id];
      if (collectionCard) {
        return _.merge(card, collectionCard);
      }
      return card;
    });
    return joinedCards;
  };

  return (
    <div className="background">
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {data && (
          <div className={styles.header}>
            <div className={styles.back}>
              <ion-icon name="chevron-back-outline"></ion-icon>
            </div>

            {data.realm.name}
          </div>
        )}
        <div className={styles.grid}>
          {data &&
            joinCards(data.realm.cards, example_json).map((card, i) => (
              <Card card={card} key={i} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Cards;
