import { useEffect, useState } from "react";

import { GET_PROBLEMS } from "@/GQL/query";
import { GET_REALMS } from "@/GQL/query";
import Header from "@/components/Header";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { normalize } from "@/utils/calculations";
import styles from "@/styles/Problems.module.scss";
import { useQuery } from "@apollo/react-hooks";
import { withUser } from "@/Hoc/withUser";
import { ImageUI } from "@/components/reusableUI";

export const DropDown = ({ realms, filter, setFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filters = [{ name: "All" }, ...realms];

  console.log(realms);

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
              {realm?.image && (
                <ImageUI url={realm.image.url} height="15px" className="mr5" />
              )}

              {realm?.name}
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
      <div className={`${styles.problem} ${isInside && styles.isInside}`}>
        <div className={styles.name}>{name}</div>

        {!isInside && (
          <div className={styles.iconRight}>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
        )}
      </div>
    </Link>
  );
};

const Problems = ({ data }) => {
  const realms = data.realms;
  const problems = data.problems;

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
      <div className="headerSpace"></div>

      <div className="section">
        <div className="header">Solve Your Problems</div>
      </div>

      <div className="section">
        <div className="section" style={{ padding: "0 1rem" }}>
          <div className={styles.filters}>
            <input
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
              placeholder="Search..."
            />

            <DropDown
              realms={realms}
              label="Category"
              filter={filter}
              setFilter={setFilter}
            />
          </div>
        </div>

        <div>
          {filterProblems(problems, filter, query).map((problem, i) => (
            <Problem problem={problem} key={i} />
          ))}
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default withUser(Problems, GET_PROBLEMS);
