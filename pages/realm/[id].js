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

import { GET_REALM_ID } from "../../GQL/query";

const Cards = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_REALM_ID, {
    variables: { id: router.query.id },
  });
  const [tab, setTab] = useState("Concepts");

  const tabsData = [
    { label: "Concepts", count: -1, link: "Concepts" },
    { label: "Problems", count: -1, link: "Problems" },
    { label: "Programs", count: -1, link: "Programs" },
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

  console.log(gql_data);

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {gql_data && (
        <div>
          <div className="section">
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
          </div>

          <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />
          <div className="section">
            <div id="concepts" className={styles.sectionHeader}>
              Concepts
            </div>
            <div className={styles.grid}>
              {store.user &&
                joinCards(gql_data.realm.cards, usercards)
                  .sort((a, b) => b.is_open - a.is_open)
                  .map((card, i) => <Card card={card} key={i} />)}
            </div>
            <div id="problems" className={styles.sectionHeader}>
              Problems
            </div>
            <div className={styles.problemsWrap}>
              {gql_data.realm.problems.map((problem, i) => (
                <Problem problem={problem} key={i} />
              ))}
            </div>
            <div id="programs" className={styles.sectionHeader}>
              Programs
            </div>
            <div className={styles.problemsWrap}>
              {gql_data.realm.courses.map((course, i) => (
                <Course course={course} key={i} />
              ))}
            </div>
          </div>
        </div>
      )}
      <NavBar />
    </div>
  );
};

export default Cards;
