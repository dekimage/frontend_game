import { BackButton, ImageUI } from "../components/reusableUI";
import { useContext, useEffect, useState } from "react";

import { Action } from "../components/cardPageComps";
import CardsMapper from "../components/CardsMapper";
import { Context } from "../context/store";
import { GET_USER_FAVORITES } from "../GQL/query";
import Link from "next/link";
import NavBar from "../components/NavBar";
import { Tabs } from "../components/profileComps";
import _ from "lodash";
import { getRandomCard } from "../actions/action";
import { normalize } from "../utils/calculations";
import styles from "../styles/Realm.module.scss";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

const Random = () => {
  const [store, dispatch] = useContext(Context);
  const [randomCard, setRandomCard] = useState();

  // const generateRandomCard = () => {
  //   return getRandomCard(dispatch).then((randomCard) => {
  //     return randomCard.id;
  //   });
  // };

  useEffect(() => {
    getRandomCard(dispatch).then((randomCard) => {
      setRandomCard(randomCard);
      console.log(randomCard);
      return randomCard.id;
    });
  }, []);

  return (
    <div className="background_dark">
      {!randomCard && <div>Loading...</div>}
      {randomCard && (
        <div>
          <div className="section">
            <div className={styles.header}>
              <BackButton routeDynamic={""} routeStatic={"/"} />

              <div className={`${styles.realmLogo} ml1 mr1`}>Random Card</div>
              <div className="flex_center">
                <ImageUI url={"/random.png"} height="22px" />
              </div>
            </div>
          </div>

          <div className="section">
            <div>
              <CardsMapper cards={[randomCard]} />
            </div>
          </div>
        </div>
      )}
      <NavBar />
    </div>
  );
};

export default Random;
