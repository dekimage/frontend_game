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

import { calcRealmProgress, normalize } from "../utils/calculations";

import { CardType, ProgressBox } from "../components/Card";
import Cookie from "js-cookie";

import iconPlay from "../assets/progress-collection-dark.svg";
import iconCollection from "../assets/progress-play-dark.svg";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const USER_ID = Cookie.get("userId");

//fix_gql
const GET_USER_STATS = gql`
  query ($id: ID!) {
    user(id: $id) {
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
  query {
    realms {
      data {
        id
        attributes {
          name
          description
          coming_soon
          image {
            data {
              attributes {
                url
              }
            }
          }
          expansion {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
      meta {
        pagination {
          page
          pageSize
          total
          pageCount
        }
      }
    }
  }
`;

const Realm = ({ realm, completed, collected }) => {
  console.log(realm);
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
          {realm.image && <img className="image" src={realm.image.url} />}
        </div>
      </div>
    </Link>
  );
};

const Learn = () => {
  const { data, loading, error } = useQuery(GET_REALMS);
  const gql_data = data && normalize(data);
  console.log("realms", gql_data);
  const {
    data: usercardsData,
    loading: usercardsLoading,
    error: usercardsError,
  } = useQuery(GET_USER_STATS, {
    variables: { id: USER_ID },
  });

  const [store, dispatch] = useContext(Context);

  const realmHash = usercardsData
    ? calcRealmProgress(usercardsData.user.usercards)
    : { Essentials: 0 };

  const comingRealms = data && data.realms.filter((r) => r.coming_soon);
  const freeRealms =
    gql_data &&
    gql_data.realms.filter(
      (r) =>
        r.expansion.name === "Basic" &&
        r.name !== "Essentials" &&
        r.name !== "Character"
    );
  const proRealms =
    gql_data && gql_data.realms.filter((r) => r.expansion.name === "Pro");
  const tutorialRealm =
    gql_data && gql_data.realms.filter((r) => r.name === "Essentials");
  const specialRealm =
    gql_data && gql_data.realms.filter((r) => r.name === "Character");

  return (
    <div className="background_dark">
      <Header />
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {gql_data && realmHash && (
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
