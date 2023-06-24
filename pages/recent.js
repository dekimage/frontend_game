import { ImageUI } from "@/components/reusableUI";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/reusable/BackButton";

import { GET_USER_RECENTS } from "@/GQL/query";
import NavBar from "@/components/NavBar";
import { NotFoundContainer } from "@/components/Today/NotFoundContainer";
import _ from "lodash";

import styles from "@/styles/Realm.module.scss";
import { withUser } from "@/Hoc/withUser";
import CardsMapper from "@/components/CardsMapper";

const Recents = (props) => {
  const { user, data } = props;

  const [recentCards, setRecentCards] = useState([]);

  useEffect(() => {
    if (data?.usersPermissionsUser.last_completed_cards) {
      setRecentCards(data.usersPermissionsUser.last_completed_cards);
    }
  }, [data]);

  return (
    <div className="background_dark">
      <div>
        <div className="section">
          <div className={styles.header}>
            <BackButton routeDynamic={""} routeStatic={"/"} />

            <div className={`${styles.realmLogo} ml1 mr1`}>
              Recently Completed
            </div>
            <div className="flex_center">
              <ImageUI url={"/recent.png"} height="22px" isPublic />
            </div>
          </div>
        </div>

        <div className="section">
          <div className={styles.grid}>
            {recentCards.length > 0 && <CardsMapper cards={recentCards} />}
            {!recentCards.length && (
              <NotFoundContainer text={"You don't have any recent cards yet"} />
            )}
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default withUser(Recents, GET_USER_RECENTS, _, true);
