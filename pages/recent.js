import { BackButton, ImageUI } from "../components/reusableUI";
import { useContext, useEffect, useState } from "react";

import Card from "../components/Card";
import { Context } from "../context/store";
import { GET_USER_RECENTS } from "../GQL/query";
import NavBar from "../components/NavBar";
import { NotFoundContainer } from "../components/todayComp";
import _ from "lodash";
import { joinCards } from "../utils/joins";
import { normalize } from "../utils/calculations";
import styles from "../styles/Realm.module.scss";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

const Recents = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_USER_RECENTS, {
    variables: { id: store.user.id },
  });

  const gql_data = data && normalize(data).usersPermissionsUser;
  const [recentCards, setRecentCards] = useState([]);

  useEffect(() => {
    if (gql_data?.last_completed_cards) {
      setRecentCards(gql_data.last_completed_cards);
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

              <div className={`${styles.realmLogo} ml1 mr1`}>
                Recently Completed
              </div>
              <div className="flex_center">
                <ImageUI url={"/recent.png"} height="22px" />
              </div>
            </div>
          </div>

          <div className="section">
            <div className={styles.grid}>
              {recentCards.length &&
                store.user &&
                joinCards(recentCards, usercards)
                  .sort((a, b) => b.is_open - a.is_open)
                  .map((card, i) => <Card card={card} key={i} />)}
              {!recentCards.length && (
                <NotFoundContainer
                  text={"You don't have any activated Cards for today."}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <NavBar />
    </div>
  );
};

export default Recents;
