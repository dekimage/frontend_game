import { ImageUI } from "@/components/reusableUI";
import { useContext, useEffect, useState } from "react";
import { BackButton } from "@/components/reusable/BackButton";

import CardsMapper from "@/components/CardsMapper";
import { GET_USER_FAVORITES } from "@/GQL/query";
import NavBar from "@/components/NavBar";
import { NotFoundContainer } from "@/components/Today/NotFoundContainer";
import _ from "lodash";
import styles from "@/styles/Realm.module.scss";
import { withUser } from "@/Hoc/withUser";
import { useLazyQuery } from "@apollo/react-hooks";
import { Context } from "@/context/store";
import { normalize } from "@/utils/calculations";
import Loader from "@/components/reusable/Loader";

const Favorites = () => {
  const [store, dispatch] = useContext(Context);
  const [getFavoriteCards, { data, loading, error }] = useLazyQuery(
    GET_USER_FAVORITES,
    {
      variables: {
        id: store.user.id,
      },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (store?.user?.id) {
      getFavoriteCards({
        id: store?.user?.id,
      });
    }
  }, [store.gqlRefetch, store.user.id]);

  const favoriteCards =
    data && normalize(data).usersPermissionsUser.favorite_cards;

  console.log(favoriteCards);

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

        {loading && <Loader />}

        <div className="section-small">
          {favoriteCards && (
            <div>
              {favoriteCards.length ? (
                <CardsMapper cards={favoriteCards} />
              ) : (
                <NotFoundContainer
                  text={"You don't have any favorite cards yet"}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default Favorites;
