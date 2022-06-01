import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import _ from "lodash";
import styles from "../../styles/Realm.module.scss";

import NavBar from "../../components/NavBar";
import Card from "../../components/Card";

const GET_REALM_ID = gql`
  query ($id: ID!) {
    realm(id: $id) {
      id
      name
      description
      background {
        url
      }
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
        expansion {
          id
          name
        }
        realm {
          id
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
        const mergedCard = {
          ...collectionCard[0],
          id: card.id,
          image: card.image,
          isOpen: card.isOpen,
          rarity: card.rarity,
          type: card.type,
          realm: card.realm,
          name: card.name,
          expansion: card.expansion,
        };
        return mergedCard;
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
            <Link href="/learn">
              <div className={styles.back}>
                <ion-icon name="chevron-back-outline"></ion-icon>
              </div>
            </Link>
            <div className={styles.realmLogo}>
              <img
                src={`http://localhost:1337${data.realm.background.url}`}
                height="24px"
                className="mr1"
              />
              {data.realm.name}
            </div>
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
      <NavBar />
    </div>
  );
};

export default Cards;
