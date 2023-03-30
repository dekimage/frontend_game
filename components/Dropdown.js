import { useState } from "react";
import baseUrl from "../utils/settings";
import styles from "../styles/Dropdown.module.scss";

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
