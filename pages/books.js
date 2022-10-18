import { useQuery } from "@apollo/react-hooks";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Link from "next/link";
import { useEffect, useState } from "react";

import { normalize } from "../utils/calculations";
import styles from "../styles/Books.module.scss";

import { DropDown } from "../components/Dropdown";

import { GET_BOOKS, GET_REALMS } from "../GQL/query";

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

export const Book = ({ book, isInside = false }) => {
  const { id, name, image, author } = book;

  return (
    <Link href={`/book/${id}`}>
      <div className={styles.book}>
        <div className={styles.book_image}>
          {/* <img src={image.url} /> */}
          <img src={`${baseUrl}${image.url}`} height="100px" />
        </div>
        <div className={styles.book_name}>{name}</div>
        <div className={styles.book_author}>By {author}</div>
      </div>
    </Link>
  );
};

const Books = () => {
  const { data, loading, error } = useQuery(GET_BOOKS);
  const gql_data = data && normalize(data);

  const { data: realmData, realmsLoading } = useQuery(GET_REALMS);
  const realms = realmData && normalize(realmData).realms;

  const [filter, setFilter] = useState(false);
  const [query, setQuery] = useState(false);

  const filterBooks = (books, filter, query) => {
    if (query) {
      return books.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (!filter || filter === "All") {
      return books;
    }

    return books.filter((b) => b.realm.name === filter);
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
          <div className={styles.grid}>
            {filterBooks(gql_data.books, filter, query).map((book, i) => (
              <Book book={book} key={i} />
            ))}
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default Books;
