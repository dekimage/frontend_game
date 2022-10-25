import { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import _ from "lodash";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import styles from "../styles/Collection.module.scss";
import Card from "../components/Card";

import { DropDown } from "./problems";
import { Tabs } from "../components/profileComps";
import { Course } from "../components/shopComps";
import { Action } from "../components/cardPageComps";

import Cookie from "js-cookie";
import { normalize } from "../utils/calculations";
import { GET_COLLECTION, GET_REALMS } from "../GQL/query";

import { sortSettings } from "../data/collectionData";

const USER_ID = Cookie.get("userId");

const Home = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_COLLECTION, {
    variables: { id: USER_ID },
  });

  const { data: realmData, realmsLoading } = useQuery(GET_REALMS);
  const realms = realmData && normalize(realmData).realms;

  const gql_data = data && normalize(data);
  const [cards, setCards] = useState([]);
  const [sortBy, setSortBy] = useState(sortSettings[0]);
  const [isSortAsc, setIsSortAsc] = useState(true);
  const [dropDownFilters, setDropDownFilters] = useState(false);
  const [tab, setTab] = useState("Concepts");

  const [filters, setFilters] = useState({
    type: "",
    rarity: "",
    realm: "",
  });

  const tabsData = [
    { label: "Concepts", count: -1, link: "cards" },
    { label: "Programs", count: -1, link: "courses" },
    { label: "Actions", count: -1, link: "actions" },
  ];

  const removeKeyFromObject = (object, key) => {
    delete object[key];
    return object;
  };

  const removeIdFromActionStats = (actions) => {
    const actionsWithFixedStats = actions.map((action) => {
      action.stats = removeKeyFromObject(action.stats, "id");
      return action;
    });

    return actionsWithFixedStats;
  };

  const filterContent = (contents, filter) => {
    if (!filter || filter === "All") {
      return contents;
    }

    if (tab === "Concepts") {
      return contents.filter((c) => c.realm.name === filter);
    }
    if (tab === "Programs") {
      return contents.filter((c) => c.course.realm.name === filter);
    }
    if (tab === "Actions") {
      return contents.filter((c) => c.card.realm.name === filter);
    }
    return contents;
  };

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
      <div className="headerSpace"></div>
      <div>
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />
        <div className="flex_end pr1">
          {realms && (
            <DropDown
              realms={realms}
              filter={dropDownFilters}
              setFilter={setDropDownFilters}
            />
          )}

          {/* <div className={styles.orderBtn}>
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
          </div> */}
        </div>

        <div className="section">
          {/* {gql_data &&
            gql_data.usersPermissionsUser &&
            store?.user?.usercourses?.length > 0 && (
              <div className={styles.headline}>
                {tab === "Concepts" && (
                  <div>
                    Discovered: {gql_data.usersPermissionsUser.usercards.length}
                    /{108}
                  </div>
                )}
                {tab === "Programs" && (
                  <div>Purchased Programs: {store.user.usercourses.length}</div>
                )}
                {tab === "Actions" && (
                  <div>
                    Discovered: {store.user.actions.length}/{330}
                  </div>
                )}
              </div>
            )} */}

          {tab === "Concepts" && cards.length > 0 && (
            <div>
              <div className={styles.grid}>
                {filterContent(mergeCards(cards), dropDownFilters).map(
                  (card, i) => {
                    return <Card card={card} key={i} />;
                  }
                )}
              </div>
            </div>
          )}

          {tab === "Programs" && store?.user?.usercourses.length > 0 && (
            <div>
              {filterContent(store.user.usercourses, dropDownFilters).map(
                (uc, i) => (
                  <Course course={uc.course} key={i} />
                )
              )}
            </div>
          )}

          {tab === "Actions" && store?.user?.actions.length > 0 && (
            <div>
              {filterContent(
                removeIdFromActionStats(store.user.actions, "id"),
                dropDownFilters
              ).map((a, i) => (
                <Action action={a} key={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default Home;
