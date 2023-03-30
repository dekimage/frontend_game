import { React, useState } from "react";

import { BackButton } from "../components/reusableUI";
import CardsMapper from "../components/CardsMapper";
import Link from "next/link";
import NavBar from "../components/NavBar";

import axios from "axios";
import debounce from "debounce";
import { normalize } from "../utils/calculations";
import styles from "../styles/SearchBar.module.scss";

import baseUrl from "../utils/settings";

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [resultProblems, setResultProblems] = useState([]);
  const [resultCards, setResultCards] = useState([]);
  const [resultActions, setResultActions] = useState([]);
  const [showNothing, setShowNothing] = useState(true);

  const [isSearching, setIsSearching] = useState(false);

  const callback = () => {
    setSearch("");
  };

  const onSearch = (value) => {
    setShowNothing(false);
    const query = `?filters[name][$contains]=${capitalizeFirstLetter(
      value
    )}&populate=%2A`;

    if (search.length > 0) {
      setIsSearching(true);
      axios
        .get(`/cards/${query}`)
        .then((res) => {
          setResultCards(normalize(res).data);

          setResult(normalize(res).data);
          setIsSearching(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onChange = (e) => {
    setShowNothing(true);
    e.preventDefault();
    const value = e.target.value.toLowerCase();
    setSearch(value);
  };

  const onClose = (e) => {
    if (e) {
      e.persist();
    }
    setSearch("");
    setResult([]);
  };

  const SearchCard = ({ card }) => {
    return (
      <Link
        href={{ pathname: "/card/[id]", query: { id: card.id } }}
        as={`/card/${card.id}`}
      >
        <div className={styles.searchCard}>
          {card.image && <img className={styles.image} src={card.image.url} />}
          <div>{card.name}</div>
        </div>
      </Link>
    );
  };

  return (
    <div className="background_dark">
      <BackButton isBack />
      <div className="section">
        <div className="header">Search</div>
      </div>

      <div className="section">
        <div className={styles.searchBox} onFocus={() => {}}>
          <input
            type="text"
            value={search}
            onChange={onChange}
            placeholder={`Search Cards...`}
          />

          <div className={styles.searchBtn} onClick={() => onSearch(search)}>
            <img height="18px" src={`${baseUrl}/search.png`} />
          </div>

          {search.length > 0 && (
            <div className="btn-search clear" onClick={() => onClose()}>
              {/* <img src={closeIcon} style={{ height: "15px" }} /> */}
            </div>
          )}

          {!isSearching && result.length === 0 && search.length === 0 && (
            <div className={styles.searchResult_box}>
              <div className={styles.noResults}>
                <img
                  style={{ height: "200px", marginBottom: "1rem" }}
                  src="https://backendactionise.s3.eu-west-1.amazonaws.com/declutter_lifestyle_955677a0df.png"
                />
                Explore Actionise
                <span className={styles.searchDescription}>
                  Search the Actionise Cards Database!
                </span>
              </div>
            </div>
          )}

          {search.length > 0 && (
            <div className={styles.searchResult_box}>
              <div className={styles.isSearching}>
                {!isSearching && showNothing && (
                  <div>
                    Click the{" "}
                    <img height="18px" src={`${baseUrl}/search.png`} /> to
                    search for "{search}"
                  </div>
                )}
                {isSearching && "Searching..."}

                {!showNothing &&
                  !isSearching &&
                  result.length === 0 &&
                  search.length > 0 && (
                    <>
                      <div>Search Results for: "{search}"</div>
                      <div className={styles.noResults}>
                        <img
                          style={{ height: "200px", marginBottom: "1rem" }}
                          src="https://backendactionise.s3.eu-west-1.amazonaws.com/strong_sit_f2e5f0f1a5.png"
                        />
                        No Results Found...
                      </div>
                    </>
                  )}
              </div>

              <div className={styles.isSearching}>
                {resultCards && resultCards.length > 0 && !isSearching && (
                  <CardsMapper cards={resultCards} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default SearchBar;
