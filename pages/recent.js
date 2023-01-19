import { useQuery } from "@apollo/react-hooks";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import _ from "lodash";
import styles from "../styles/Realm.module.scss";

import NavBar from "../components/NavBar";
import Card from "../components/Card";
import { Tabs } from "../components/profileComps";
import { normalize } from "../utils/calculations";
import { BackButton } from "../components/reusableUI";
import { Action } from "../components/cardPageComps";
import { joinCards } from "../utils/joins";

import { GET_USER_RECENTS } from "../GQL/query";

const Recents = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_USER_RECENTS, {
    variables: { id: store.user.id },
  });
  const [tab, setTab] = useState("Cards");

  const tabsData = [
    { label: "Cards", count: -1 },
    { label: "Actions", count: -1 },
  ];

  const gql_data = data && normalize(data).usersPermissionsUser;
  const [recentCards, setRecentCards] = useState([]);
  const [recentActions, setRecentActions] = useState([]);

  useEffect(() => {
    if (gql_data?.last_completed_cards) {
      setRecentCards(gql_data.last_completed_cards);
    }
    if (gql_data?.last_completed_actions) {
      setRecentActions(gql_data.last_completed_actions);
    }
  }, [gql_data]);

  const usercards = store.user && store.user.usercards;

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {gql_data && (
        <div>
          <div className="section">
            <div className={styles.header}>
              <BackButton routeDynamic={""} routeStatic={"/"} />

              <div className={styles.realmLogo}>Recently Completed</div>
            </div>
          </div>

          <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />

          <div className="section">
            {tab === "Cards" && (
              <div className={styles.grid}>
                {recentCards.length &&
                  store.user &&
                  joinCards(recentCards, usercards)
                    .sort((a, b) => b.is_open - a.is_open)
                    .map((card, i) => <Card card={card} key={i} />)}
                {!recentCards.length && <div>You dont have favorites</div>}
              </div>
            )}
            {tab === "Actions" && (
              <div className={styles.grid}>
                {recentActions.length ? (
                  <div>
                    {recentActions.map((a, i) => (
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

export default Recents;
