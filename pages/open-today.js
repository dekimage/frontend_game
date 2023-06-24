import { ImageUI } from "@/components/reusableUI";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/reusable/BackButton";

import Card from "@/components/Card";
import { GET_USER_OPEN_TICKETS } from "@/GQL/query";
import NavBar from "@/components/NavBar";
import { NotFoundContainer } from "@/components/Today/NotFoundContainer";
import _ from "lodash";
import { joinCards } from "@/utils/joins";
import styles from "@/styles/Realm.module.scss";
import { withUser } from "@/Hoc/withUser";

const OpenToday = (props) => {
  const { user, data } = props;
  const [recentCards, setRecentCards] = useState([]);

  useEffect(() => {
    if (data?.card_tickets) {
      setRecentCards(data.card_tickets);
    }
  }, [data]);

  const usercards = user && user.usercards;

  return (
    <div className="background_dark">
      <div>
        <div className="section">
          <div className={styles.header}>
            <BackButton routeDynamic={""} routeStatic={"/"} />

            <div className={`${styles.realmLogo} ml1 mr1`}>Open Today</div>
            <div className="flex_center">
              <ImageUI url={"/energy.png"} height="22px" isPublic />
            </div>
          </div>
        </div>

        <div className="section">
          <div className={styles.grid}>
            {!!recentCards.length > 0 &&
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

      <NavBar />
    </div>
  );
};

export default withUser(OpenToday, GET_USER_OPEN_TICKETS, _, true);
