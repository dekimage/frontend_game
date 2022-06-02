import { React, useState } from "react";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
// import { RealmsList } from "./learn";
import styles from "../styles/SearchBar.module.scss";
import debounce from "debounce";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// import SearchCard from "./SearchCard/SearchCard";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const router = useRouter();

  const onSearch = debounce((value) => {
    if (search.length > 0) {
      setIsSearching(true);
      strapi.getEntries("cards", { name_contains: value }).then((res) => {
        // const filtered = res.filter((card) => {
        //   return card.name.toLowerCase().startsWith(value);
        // });

        setResult(res);
        setIsSearching(false);
      });
    }
  }, 1000);

  const onChange = (e) => {
    e.preventDefault();
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setIsSearching(true);

    if (value.length > 0) {
      onSearch(value);
    }
    if (value.length < 1) {
      setResult([]);
    }
  };

  const onClose = (e) => {
    if (e) {
      e.persist();
    }
    setSearch("");
    setResult([]);
    setIsSearching(false);
  };

  const SearchCard = ({ card }) => {
    return (
      <Link
        href={{ pathname: "/card/[id]", query: { id: card.id } }}
        as={`/card/${card.id}`}
      >
        <div className={styles.searchCard}>
          <img className={styles.image} src={`${baseUrl}${card.image.url}`} />
          <div>{card.name}</div>
        </div>
      </Link>
    );
  };

  return (
    <div className="background_dark">
      <div className="section">
        <div className={styles.searchBox} onFocus={() => setIsInputOpen(true)}>
          {/* <div className={styles.btn_search}>
            <img src={SearchSVG} style={{ height: "15px" }} />
          </div> */}
          <div className={styles.backButton} onClick={() => router.back()}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>
          <input
            type="text"
            value={search}
            onChange={onChange}
            placeholder="Search Cards..."
          />
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
                  // src={`${baseUrl}/uploads/Asking_Questions_061ea6ce0f.png`}
                />
                Explore Actionise
                <span className={styles.searchDescription}>
                  Search for Meditations, Actions, Lessons, Friends and More!
                </span>
              </div>
            </div>
          )}
          {search.length > 0 && (
            <div className={styles.searchResult_box}>
              <div className={styles.isSearching}>
                {!isSearching && <div>Search Results for: "{search}"</div>}
                {isSearching && "Searching..."}

                {!isSearching && result.length === 0 && search.length > 0 && (
                  <div className={styles.noResults}>
                    <img
                      style={{ height: "200px", marginBottom: "1rem" }}
                      // src={`${baseUrl}/uploads/mech_6_3a2f8d0611.png`}
                    />
                    No Results Found...
                  </div>
                )}
              </div>
              <div className={styles.isSearching}>
                {result &&
                  result.length > 0 &&
                  !isSearching &&
                  result.map((card, i) => <SearchCard key={i} card={card} />)}
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
