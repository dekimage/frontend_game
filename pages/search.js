import { React, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import styles from "../styles/SearchBar.module.scss";
import debounce from "debounce";
import { normalize } from "../utils/calculations";
import { Tabs } from "../components/profileComps";
import { Course } from "../components/shopComps";
import { Problem } from "./problems";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [resultProblems, setResultProblems] = useState([]);
  const [resultCards, setResultCards] = useState([]);
  const [resultPrograms, setResultPrograms] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const router = useRouter();

  const [tab, setTab] = useState("Concepts");

  const tabsData = [
    { label: "Concepts", count: -1, link: "cards" },
    { label: "Problems", count: -1, link: "problems" },
    { label: "Programs", count: -1, link: "courses" },
  ];

  const filterTab = (tab) => {
    if (tab === "Concepts") {
      return "cards";
    }
    if (tab === "Problems") {
      return "problems";
    }
    if (tab === "Programs") {
      return "courses";
    }
  };

  console.log("resultProblems", resultProblems);
  console.log("resultCards", resultCards);
  console.log("resultPrograms", resultPrograms);

  const callback = () => {
    setSearch("");
  };

  const onSearch = debounce((value) => {
    const query = `?filters[name][$contains]=${value}&populate=%2A`;
    if (search.length > 0) {
      setIsSearching(true);
      axios
        .get(`/${filterTab(tab)}/${query}`)
        .then((res) => {
          if (tab === "Problems") {
            setResultProblems(normalize(res).data);
          }
          if (tab === "Concepts") {
            setResultCards(normalize(res).data);
          }
          if (tab === "Programs") {
            setResultPrograms(normalize(res).data);
          }
          setResult(normalize(res).data);
          setIsSearching(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, 1500);

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
          {card.image && <img className={styles.image} src={card.image.url} />}
          <div>{card.name}</div>
        </div>
      </Link>
    );
  };

  return (
    <div className="background_dark">
      <div className="section">
        <Tabs
          tabState={tab}
          setTab={setTab}
          tabs={tabsData}
          callback={callback}
          value={search}
        />
        <div className={styles.searchBox} onFocus={() => setIsInputOpen(true)}>
          <div className={styles.backButton} onClick={() => router.back()}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>
          <input
            type="text"
            value={search}
            onChange={onChange}
            placeholder={`Search ${tab}...`}
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
                {!isSearching && <div>Search Results for: "{search}"</div>}
                {isSearching && "Searching..."}

                {!isSearching && result.length === 0 && search.length > 0 && (
                  <div className={styles.noResults}>
                    <img
                      style={{ height: "200px", marginBottom: "1rem" }}
                      src="https://backendactionise.s3.eu-west-1.amazonaws.com/strong_sit_f2e5f0f1a5.png"
                    />
                    No Results Found...
                  </div>
                )}
              </div>
              {tab === "Concepts" && (
                <div className={styles.isSearching}>
                  {resultCards &&
                    resultCards.length > 0 &&
                    !isSearching &&
                    resultCards.map((card, i) => (
                      <SearchCard key={i} card={card} />
                    ))}
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
              {tab === "Programs" && (
                <div className={styles.isSearching}>
                  {resultPrograms &&
                    resultPrograms.length > 0 &&
                    !isSearching &&
                    resultPrograms.map((course, i) => (
                      <Course key={i} course={course} />
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
