import { React, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import styles from "../styles/SearchBar.module.scss";
import debounce from "debounce";
import { normalize } from "../utils/calculations";
import { Tabs } from "../components/profileComps";
import { Action } from "../components/cardPageComps";
import { Problem } from "./problems";
import { BackButton } from "../components/reusableUI";
import CardsMapper from "../components/CardsMapper";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [resultProblems, setResultProblems] = useState([]);
  const [resultCards, setResultCards] = useState([]);
  const [resultActions, setResultActions] = useState([]);
  const [showNothing, setShowNothing] = useState(true);

  const [isSearching, setIsSearching] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const router = useRouter();

  const [tab, setTab] = useState("Cards");

  const tabsData = [
    { label: "Cards", count: -1 },
    { label: "Problems", count: -1 },
    { label: "Actions", count: -1 },
  ];

  const filterTab = (tab) => {
    if (tab === "Cards") {
      return "cards";
    }
    if (tab === "Problems") {
      return "problems";
    }
    if (tab === "Actions") {
      return "actions";
    }
  };

  const callback = () => {
    setSearch("");
  };

  const onSearch = (value) => {
    setShowNothing(false);
    const query = `?filters[name][$contains]=${value}&populate=%2A`;
    if (search.length > 0) {
      setIsSearching(true);
      axios
        .get(`/${filterTab(tab)}/${query}`)
        .then((res) => {
          if (tab === "Problems") {
            setResultProblems(normalize(res).data);
          }
          if (tab === "Cards") {
            setResultCards(normalize(res).data);
          }
          if (tab === "Actions") {
            setResultActions(normalize(res).data);
          }
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

      <Tabs
        tabState={tab}
        setTab={setTab}
        tabs={tabsData}
        callback={callback}
        value={search}
      />
      <div className="section">
        <div className={styles.searchBox} onFocus={() => setIsInputOpen(true)}>
          <input
            type="text"
            value={search}
            onChange={onChange}
            placeholder={`Search ${tab}...`}
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
                  Search for Meditations, Actions, Lessons, Friends and More!
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
              {tab === "Cards" && (
                <div className={styles.isSearching}>
                  {resultCards && resultCards.length > 0 && !isSearching && (
                    <CardsMapper cards={resultCards} />
                  )}
                  {/* resultCards.map((card, i) => (
                      <SearchCard key={i} card={card} />
                    )) */}
                </div>
              )}
              {tab === "Problems" && (
                <div className={styles.isSearching}>
                  {resultProblems &&
                    resultProblems.length > 0 &&
                    !isSearching &&
                    resultProblems.map((problem, i) => (
                      <Problem key={i} problem={problem} />
                    ))}
                </div>
              )}
              {tab === "Actions" && (
                <div className={styles.isSearching}>
                  {resultActions &&
                    resultActions.length > 0 &&
                    !isSearching &&
                    resultActions.map((action, i) => (
                      <Action key={i} action={action} />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default SearchBar;
