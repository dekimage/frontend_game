import { useQuery } from "@apollo/react-hooks";
import { useContext, useState } from "react";
import { Context } from "../../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import _ from "lodash";
import styles from "../../styles/Realm.module.scss";

import NavBar from "../../components/NavBar";
import Card from "../../components/Card";
import { Tabs } from "../../components/profileComps";
import { Problem } from "../problems";
import { Course } from "../../components/shopComps";
import { normalize } from "../../utils/calculations";
import { BackButton } from "../../components/reusableUI";

import { Book } from "../books";

import { GET_REALM_ID } from "../../GQL/query";

const Cards = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_REALM_ID, {
    variables: { id: router.query.id },
  });
  const [tab, setTab] = useState("Cards");

  const tabsData = [
    { label: "Cards", count: -1, link: "Cards" },
    { label: "Problems", count: -1, link: "Problems" },
    { label: "Books", count: -1, link: "Books" },
  ];

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
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {gql_data && (
        <div>
          <div className="section">
            <div className={styles.header}>
              <BackButton routeDynamic={""} routeStatic={"/learn"} />

              <div className={styles.realmLogo}>
                <img
                  src={gql_data.realm.image.url}
                  height="24px"
                  className="mr1"
                />
                {gql_data.realm.name}
              </div>
            </div>
          </div>

          <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />
          <div className="section">
            {tab === "Cards" && (
              <>
                <div className={styles.grid}>
                  {store.user &&
                    joinCards(gql_data.realm.cards, usercards)
                      .sort((a, b) => b.is_open - a.is_open)
                      .map((card, i) => <Card card={card} key={i} />)}
                </div>
                <div className={styles.problemsWrap}>
                  {gql_data.realm.courses.map((course, i) => (
                    <Course course={course} key={i} />
                  ))}
                </div>
              </>
            )}

            {tab === "Problems" && (
              <>
                <div className={styles.sectionHeader}>
                  Common {gql_data.realm.name} Problems
                </div>
                <div className={styles.problemsWrap}>
                  {gql_data.realm.problems.map((problem, i) => (
                    <Problem problem={problem} key={i} />
                  ))}
                </div>
              </>
            )}

            {tab === "Books" && (
              <div className={styles.grid}>
                {gql_data.realm.books.map((book, i) => (
                  <Book book={book} key={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <NavBar />
    </div>
  );
};

export default Cards;
