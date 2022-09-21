import { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import _ from "lodash";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import styles from "../styles/Collection.module.scss";
import Card from "../components/Card";

import Cookie from "js-cookie";
import { normalize } from "../utils/calculations";
import { GET_COLLECTION } from "../GQL/query";

import { sortSettings } from "../data/collectionData";

const USER_ID = Cookie.get("userId");

const Home = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_COLLECTION, {
    variables: { id: USER_ID },
  });

  const gql_data = data && normalize(data);
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
    !loading &&
      gql_data?.usersPermissionsUser.usercards &&
      setCards(gql_data.usersPermissionsUser.usercards);
  }, [gql_data, loading]);

  const mergeCards = () => {
    const mergedcards = cards.map((card) => {
      const mergedCard = _.merge(card, card.card);
      return { ...mergedCard, [card.id]: card.card.id };
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
        {gql_data && gql_data.usersPermissionsUser && (
          <div className={styles.headline}>
            Discovered: {gql_data.usersPermissionsUser.usercards.length}/{108}
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

        {cards.length > 0 && (
          <div>
            <div className={styles.grid}>
              {filterCards().map((card, i) => {
                return <Card card={card} key={i} />;
              })}
            </div>
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default Home;
