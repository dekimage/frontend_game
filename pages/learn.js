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
      background {
        url
      }
    }
  }
`;

const Learn = () => {
  const { data, loading, error } = useQuery(GET_REALMS);
  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      <Header />
      <div className="section">
        {data &&
          data.realms.map((realm) => (
            <Link href={{ pathname: "/realm/[id]", query: { id: realm.id } }}>
              <div className={styles.realm}>
                <div className={styles.realm_body}>
                  <div className={styles.realm_name}>{realm.name}</div>
                  <div className={styles.realm_description}>
                    {realm.description}
                  </div>
                  <ProgressBar progress={25} />
                  <div className={styles.progress}>25%</div>
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
      </div>
      <Navbar />
    </div>
  );
};

export default Learn;
