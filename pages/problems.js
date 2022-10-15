import { useQuery } from "@apollo/react-hooks";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GET_REALMS } from "../GQL/query";

import { normalize } from "../utils/calculations";
import styles from "../styles/Problems.module.scss";

import { GET_PROBLEMS } from "../GQL/query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const GenericDropDown = ({ items, label, callback }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);

  return (
    <div
      tabIndex={0}
      onBlur={(e) => {
        setIsOpen(false);
      }}
    >
      <div className={styles.dropDown} onClick={() => setIsOpen(!isOpen)}>
        <div className="mr5">{selectedItem ? selectedItem : label}</div>
        {isOpen ? (
          <ion-icon name="chevron-up-outline"></ion-icon>
        ) : (
          <ion-icon name="chevron-down-outline"></ion-icon>
        )}
      </div>
      {isOpen && (
        <div className={styles.dropDown_items}>
          {items.map((item, i) => (
            <div
              className={styles.dropDown_item}
              key={i}
              onClick={() => {
                setIsOpen(!isOpen);
                setSelectedItem(item);
                callback(item);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const DropDown = ({ realms, filter, setFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filters = [{ name: "All" }, ...realms];

  return (
    <div
      tabIndex={0}
      onBlur={(e) => {
        setIsOpen(false);
      }}
    >
      <div className={styles.dropDown} onClick={() => setIsOpen(!isOpen)}>
        <div className="mr5">
          {filter && filter != "All" ? filter : "Category"}
        </div>
        {isOpen ? (
          <ion-icon name="chevron-up-outline"></ion-icon>
        ) : (
          <ion-icon name="chevron-down-outline"></ion-icon>
        )}
      </div>
      {isOpen && (
        <div className={styles.dropDown_items}>
          {filters.map((realm, i) => (
            <div
              className={styles.dropDown_item}
              key={i}
              onClick={() => setFilter(realm.name)}
            >
              {realm.image && (
                <img
                  src={`${baseUrl}${realm.image.url}`}
                  height="15px"
                  className="mr5"
                />
              )}

              {realm.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Problem = ({ problem, isInside = false }) => {
  const { id, name, realm } = problem;

  return (
    <Link href={`/problem/${id}`}>
      <div className={styles.problem}>
        {/* <div className={styles.id} style={{ backgroundColor: realm.color }}>
          <span className="text__s">#</span>
          {id}
        </div> */}
        <div className={styles.name}>{name}</div>

        {/* <div className={styles.tag}>
          <img src={realm.image.url} />
          <img
            src={`${baseUrl}/uploads/Asset_18_513564218e.png`}
            height="15px"
            className="mr25"
          />

          {realm.name}
        </div> */}
        {!isInside && (
          <div className={styles.iconRight}>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
        )}
      </div>
    </Link>
  );
};

const Problems = () => {
  const { data, loading, error } = useQuery(GET_PROBLEMS);
  const gql_data = data && normalize(data);

  const { data: realmData, realmsLoading } = useQuery(GET_REALMS);
  const realms = realmData && normalize(realmData).realms;

  const [filter, setFilter] = useState(false);
  const [query, setQuery] = useState(false);

  const filterProblems = (problems, filter, query) => {
    if (query) {
      return problems.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (!filter || filter === "All") {
      return problems;
    }

    return problems.filter((p) => p.realm.name === filter);
  };

  return (
    <div className="background_dark">
      <Header />

      <div className="section">
        {error && <div>Error: {error}</div>}
        {(loading || realmsLoading) && <div>Loading...</div>}

        <div className={styles.filters}>
          <input
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
            placeholder="Search..."
          />

          {realms && (
            <DropDown realms={realms} filter={filter} setFilter={setFilter} />
          )}
        </div>

        {gql_data && (
          <div>
            {filterProblems(gql_data.problems, filter, query).map(
              (problem, i) => (
                <Problem problem={problem} key={i} />
              )
            )}
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default Problems;
