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
import { normalize } from "../../utils/calculations";

const GET_REALM_ID = gql`
  query ($id: ID!) {
    realm(id: $id) {
      data {
        id
        attributes {
          name
          description
          image {
            data {
              id
              attributes {
                url
              }
            }
          }
          cards {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                is_open
                image {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
                expansion {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
                realm {
                  data {
                    id
                    attributes {
                      name
                      color
                      image {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
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

  const gql_data = data && normalize(data);

  const usercards = store.user && store.user.usercards;
  const joinCards = (cards, usercards) => {
    // remove as user will always have at least 1 usercard
    if (!usercards) {
      return cards;
    }
    const joinedCards = cards.map((card) => {
      let collectionCard = usercards.filter(
        (c) => c.card.id === parseInt(card.id)
      );
      if (collectionCard) {
        const mergedCard = {
          ...collectionCard[0],
          id: card.id,
          image: card.image,
          is_open: card.is_open,
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
        {gql_data && (
          <div className={styles.header}>
            <Link href="/learn">
              <div className={styles.back}>
                <ion-icon name="chevron-back-outline"></ion-icon>
              </div>
            </Link>
            <div className={styles.realmLogo}>
              <img
                src={gql_data.realm.image.url}
                height="24px"
                className="mr1"
              />
              {gql_data.realm.name}
            </div>
          </div>
        )}
        <div className={styles.grid}>
          {gql_data &&
            store.user &&
            joinCards(gql_data.realm.cards, usercards)
              .sort((a, b) => b.is_open - a.is_open)
              .map((card, i) => <Card card={card} key={i} />)}
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default Cards;
