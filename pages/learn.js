import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Learn.module.scss";
import ProgressBar from "../components/ProgressBar";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

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
    }
  }
`;

export const RealmsList = ({ realms }) => {
  return (
    <>
      {realms.map((realm) => (
        <Link
          href={{ pathname: "/realm/[id]", query: { id: realm.id } }}
          as={`/realm/${realm.id}`}
          key={realm.id}
        >
          <div className={styles.realm}>
            <div className={styles.realm_body}>
              <div className={styles.realm_name}>{realm.name}</div>
              <div className={styles.realm_description}>
                {realm.description}
              </div>
              {realm.coming_soon ? (
                <div>Coming Soon...</div>
              ) : (
                <>
                  <ProgressBar progress={25} />
                  <div className={styles.progress}>25%</div>
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
      ))}
    </>
  );
};

const Learn = () => {
  const { data, loading, error } = useQuery(GET_REALMS);
  return (
    <div className="background_dark">
      <Header />
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {data && <RealmsList realms={data.realms} />}
      </div>

      <Navbar />
    </div>
  );
};

export default Learn;
