import { BackButton, ImageUI } from "../components/reusableUI";
import { useEffect, useState } from "react";

import CardsMapper from "../components/CardsMapper";
import { GET_USER_FAVORITES } from "../GQL/query";
import NavBar from "../components/NavBar";
import { NotFoundContainer } from "../components/todayComp";
import _ from "lodash";
import styles from "../styles/Realm.module.scss";
import { withUser } from "../Hoc/withUser";

const Favorites = (props) => {
  const { data } = props;
  const [favoriteCards, setFavoriteCards] = useState([]);

  useEffect(() => {
    if (data?.favorite_cards) {
      setFavoriteCards(data.favorite_cards);
    }
  }, [data]);

  return (
    <div className="background_dark">
      <div>
        <div className="section">
          <div className={styles.header}>
            <BackButton routeDynamic={""} routeStatic={"/"} />

            <div className={`${styles.realmLogo} ml1 mr1`}>Favorites</div>
            <div className="flex_center">
              <ImageUI url={"/favorite.png"} height="22px" isPublic />
            </div>
          </div>
        </div>

        <div className="section">
          <div>
            {favoriteCards.length ? (
              <CardsMapper cards={favoriteCards} />
            ) : (
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

export default withUser(Favorites, GET_USER_FAVORITES, _, true);
