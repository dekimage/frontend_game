import { useContext, useEffect, useState } from "react";

import { Action } from "../components/cardPageComps";
import { BackButton } from "../components/reusableUI";
import CardsMapper from "../components/CardsMapper";
import { Context } from "../context/store";
import { GET_USER_FAVORITES } from "../GQL/query";
import Link from "next/link";
import NavBar from "../components/NavBar";
import { Tabs } from "../components/profileComps";
import _ from "lodash";
import { normalize } from "../utils/calculations";
import styles from "../styles/Realm.module.scss";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

const Favorites = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_USER_FAVORITES, {
    variables: { id: store?.user?.id },
  });
  const [tab, setTab] = useState("Cards");

  const tabsData = [
    { label: "Cards", count: -1 },
    { label: "Actions", count: -1 },
  ];

  const gql_data = data && normalize(data).usersPermissionsUser;
  const [favoriteCards, setFavoriteCards] = useState([]);
  const [favoriteActions, setFavoriteActions] = useState([]);

  useEffect(() => {
    if (gql_data?.favorite_cards) {
      setFavoriteCards(gql_data.favorite_cards);
    }
    if (gql_data?.favorite_actions) {
      setFavoriteActions(gql_data.favorite_actions);
    }
  }, [gql_data]);

  return (
    <div className="background_dark">
      {loading && error && <div>Loading...</div>}
      {gql_data && (
        <div>
          <div className="section">
            <div className={styles.header}>
              <BackButton routeDynamic={""} routeStatic={"/"} />

              <div className={styles.realmLogo}>
                {/* <img
                  src={gql_data.realm.image.url}
                  height="24px"
                  className="mr1"
                /> */}
                Favorites
              </div>
            </div>
          </div>

          <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />
          <div className="section">
            {tab === "Cards" && (
              <div>
                {favoriteCards.length ? (
                  <CardsMapper cards={favoriteCards} />
                ) : (
                  <div>You dont have favorites</div>
                )}
              </div>
            )}

            {tab === "Actions" && (
              <div className={styles.grid}>
                {favoriteActions.length ? (
                  <div>
                    {favoriteActions.map((a, i) => (
                      <Action action={a} key={i} />
                    ))}
                  </div>
                ) : (
                  <div>You dont have favorite actions yet</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <NavBar />
    </div>
  );
};

export default Favorites;
