import { useQuery } from "@apollo/react-hooks";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import _ from "lodash";
import styles from "../styles/Realm.module.scss";
import CardsMapper from "../components/CardsMapper";

import NavBar from "../components/NavBar";

import { Tabs } from "../components/profileComps";
import { normalize } from "../utils/calculations";
import { BackButton } from "../components/reusableUI";
import { Action } from "../components/cardPageComps";

const Random = () => {
  const [store, dispatch] = useContext(Context);

  useEffect(() => {
    getRandomCard(dispatch);
  }, []);

  return (
    <div className="background_dark">
      <div>
        <div className="section">
          <div className={styles.header}>
            <BackButton routeDynamic={""} routeStatic={"/"} />

            <div className={styles.realmLogo}>Random Card Of The Day</div>
          </div>
        </div>
        {store.random ? (
          <div className="section">{/* <Card card={card} /> */}</div>
        ) : (
          <div>Generating Random Card...</div>
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default Random;
