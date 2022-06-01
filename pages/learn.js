import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Learn.module.scss";
import ProgressBar from "../components/ProgressBar";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

import { calcRealmProgress } from "../utils/calculations";

import { CardType, ProgressBox } from "../components/Card";
import Cookie from "js-cookie";

import iconPlay from "../assets/progress-collection-dark.svg";
import iconCollection from "../assets/progress-play-dark.svg";

const USER_ID = Cookie.get("userId");
const GET_USER_STATS = gql`
  {
    user(id: ${USER_ID}) {
      usercards {
        completed
        quantity
        isUnlocked
        level
        card {          
          id
          isOpen
          realm {
            id
            name
          }
        }
      }
    }
  }
`;

const GET_REALMS = gql`
  {
    realms {
      id
      name
      description
      coming_soon
      background {
        url
      }
      expansion {
        id
        name
      }
    }
  }
`;

const Realm = ({ realm, completed, collected }) => {
  return (
    <Link
      href={{ pathname: "/realm/[id]", query: { id: realm.id } }}
      as={`/realm/${realm.id}`}
      key={realm.id}
    >
      <div className={styles.realm}>
        <div className={styles.realm_body}>
          <div className={styles.realm_name}>{realm.name}</div>
          <div className={styles.realm_description}>{realm.description}</div>
          {realm.coming_soon ? (
            <div className={styles.comingsoon}>Coming Soon...</div>
          ) : (
            <>
              <ProgressBox
                icon={iconPlay}
                progress={completed || 0}
                maxProgress={100}
                isPercent
              />
              <ProgressBox
                icon={iconCollection}
                progress={collected || 0}
                maxProgress={100}
                isPercent
              />
            </>
          )}
        </div>
        <div className={styles.realm_image}>
          {realm.background && (
            <img
              className="image"
              src={`http://localhost:1337${realm.background.url}`}
            />
          )}
        </div>
      </div>
    </Link>
  );
};

const Learn = () => {
  const { data, loading, error } = useQuery(GET_REALMS);
  const {
    data: usercardsData,
    loading: usercardsLoading,
    error: usercardsError,
  } = useQuery(GET_USER_STATS);

  const [store, dispatch] = useContext(Context);

  const realmHash =
    usercardsData && calcRealmProgress(usercardsData.user.usercards);

  const comingRealms = data && data.realms.filter((r) => r.coming_soon);
  const freeRealms =
    data &&
    data.realms.filter(
      (r) =>
        r.expansion.name === "Basic" &&
        r.name !== "Essentials" &&
        r.name !== "Character"
    );
  const proRealms =
    data && data.realms.filter((r) => r.expansion.name === "Pro");
  const tutorialRealm =
    data && data.realms.filter((r) => r.name === "Essentials");
  const specialRealm =
    data && data.realms.filter((r) => r.name === "Character");

  return (
    <div className="background_dark">
      <Header />
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {data && realmHash && (
          <div>
            <div className={styles.header}>Start Here</div>
            {tutorialRealm.map((realm, i) => (
              <Realm realm={realm} key={i} />
            ))}
            <div className={styles.header}>
              Basic Categories <CardType type={"free"} />
            </div>
            {freeRealms.map((realm, i) => (
              <Realm
                realm={realm}
                completed={
                  realmHash[realm.name] && realmHash[realm.name].completed
                }
                collected={
                  realmHash[realm.name] && realmHash[realm.name].collected
                }
                key={i}
              />
            ))}
            <div className={styles.header}>
              Pro Categories <CardType type={"premium"} />
            </div>
            {proRealms.map((realm, i) => (
              <Realm
                realm={realm}
                completed={
                  realmHash[realm.name] && realmHash[realm.name].completed
                }
                collected={
                  realmHash[realm.name] && realmHash[realm.name].collected
                }
                key={i}
              />
            ))}
            <div className={styles.header}>
              Special Category <CardType type={"special"} />
            </div>
            {specialRealm.map((realm, i) => (
              <Realm
                realm={realm}
                completed={
                  realmHash[realm.name] && realmHash[realm.name].completed
                }
                collected={
                  realmHash[realm.name] && realmHash[realm.name].collected
                }
                key={i}
              />
            ))}
            <div className={styles.header}>Coming Soon...</div>
            {comingRealms.map((realm, i) => (
              <Realm realm={realm} key={i} />
            ))}
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default Learn;

{
  /* <>
              <ProgressBar
                icon={iconPlay}
                progress={completed || 0}
                max={100}
              />
              <div className={styles.realm_progressBox}>
                <img
                  src={iconPlay}
                  height="10px"
                  className={styles.progressIcon}
                />

                <div className={styles.progress}>{completed || 0}%</div>
              </div>
            </> */
}
