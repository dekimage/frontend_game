import { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";
import cx from "classnames";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import styles from "../styles/Collection.module.scss";
import RewardImage from "../components/RewardImage";
import Card from "../components/Card";

import Cookie from "js-cookie";
import { merge } from "lodash";

const USER_ID = Cookie.get("userId");
const GET_COLLECTION = gql`
  {
    user(id: ${USER_ID}) {
      usercards {
        id
        is_new
        is_favorite
        completed
        quantity
        glory_points
        level
        card {
          id
          name
          rarity
          type
          isOpen
          image {
            url
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
  }
`;

const sortByRealms = [
  "Health",
  "Energy",
  "Minimalism",
  "Mindfulness",
  "Character",
  "Negative patterns",
  "Productivity",
  "Learning",
  "Big picture",
];
const sortByRarity = ["common", "rare", "epic", "legendary"];
const sortByType = ["Free", "Premium", "Special"];
const sortByLevel = [1, 2, 3];
const sortByCompleted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const sortSettings = [
  { label: "realm", sortBy: sortByRealms },
  { label: "rarity", sortBy: sortByRarity },
  { label: "type", sortBy: sortByType },
  { label: "level", sortBy: sortByLevel },
  { label: "completed", sortBy: sortByCompleted },
];

const Home = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_COLLECTION);
  const [cards, setCards] = useState([]);
  const [sortBy, setSortBy] = useState(sortSettings[0]);
  const [isSortAsc, setIsSortAsc] = useState(true);

  const [filters, setFilters] = useState({
    type: "",
    rarity: "",
    realm: "",
  });

  const addFilters = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  useEffect(() => {
    !loading && data && setCards(data.user.usercards);
  }, [data, loading]);

  const mergeCards = () => {
    const mergedcards = cards.map((card) => {
      const mergedCard = _.merge(card, card.card);
      return { ...mergedCard, card: card.card.id };
    });
    return mergedcards;
  };

  const switchSortby = () => {
    const oldIndex = sortSettings.indexOf(sortBy);
    const newIndex = oldIndex + 1 === sortSettings.length ? 0 : oldIndex + 1;
    setSortBy(sortSettings[newIndex]);
  };

  const sortByCategory = (arr) => {
    const type = sortBy.label;
    let array = sortBy.sortBy;
    array = isSortAsc ? array.reverse() : array.reverse();
    // console.log("array AFTER REVERSE", array);
    if (type === "realm") {
      return arr.sort((a, b) => {
        return array.indexOf(a.realm.name) - array.indexOf(b.realm.name);
      });
    }

    return arr.sort((a, b) => {
      return array.indexOf(a[type]) - array.indexOf(b[type]);
    });
  };

  const filterCards = () => {
    const res = mergeCards().filter(
      (card) =>
        (!filters.type || card.type === filters.type) &&
        (!filters.realm || card.realm === filters.realm) &&
        (!filters.rarity || card.rarity === filters.rarity)
    );
    return sortByCategory(res);
  };

  return (
    <div className="background_dark">
      <Header />
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {/* TODO: ADD DROPDOWNS -> */}
        {/* <div onClick={() => addFilters("realm", "health")}>rarity</div>
        <div onClick={() => addFilters("type", "free")}>type</div>
        <div onClick={() => addFilters("rarity", "common")}>all</div> */}
        {data && data.user && (
          <div className={styles.headline}>
            Discovered: {data.user.usercards.length}/{108}
          </div>
        )}

        <div className={styles.orderBtn}>
          <div className={styles.sortBtn} onClick={() => switchSortby()}>
            Sort by&nbsp;<span className={styles.label}>{sortBy.label}</span>
          </div>
          <div
            className={styles.upBtn}
            onClick={() => setIsSortAsc(!isSortAsc)}
          >
            {isSortAsc ? (
              <ion-icon name="chevron-up-outline"></ion-icon>
            ) : (
              <ion-icon name="chevron-down-outline"></ion-icon>
            )}
          </div>
        </div>

        {data && (
          <div>
            <div className={styles.grid}>
              {filterCards().map((card, i) => {
                return <Card card={card} key={i} />;
              })}
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Home;
