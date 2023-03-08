import { BackButton, ImageUI } from "../components/reusableUI";
import { useContext, useEffect, useState } from "react";

import CardsMapper from "../components/CardsMapper";
import { Context } from "../context/store";
import { GET_USER_FAVORITES } from "../GQL/query";
import NavBar from "../components/NavBar";
import { NotFoundContainer } from "../components/todayComp";
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

  const gql_data = data && normalize(data).usersPermissionsUser;
  const [favoriteCards, setFavoriteCards] = useState([]);

  useEffect(() => {
    if (gql_data?.favorite_cards) {
      setFavoriteCards(gql_data.favorite_cards);
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

              <div className={`${styles.realmLogo} ml1 mr1`}>Favorites</div>
              <div className="flex_center">
                <ImageUI url={"/favorite.png"} height="22px" />
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
      )}
      <NavBar />
    </div>
  );
};

export default Favorites;
