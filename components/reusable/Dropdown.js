import { useState } from "react";
import baseUrl from "@/utils/settings";
import styles from "@/styles/Dropdown.module.scss";

export const DropDown = ({
  data,
  label,
  filter,
  setFilter,
  fullWidth = false,
  Jsx,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filters = [{ name: "All" }, ...data];

  return (
    <div
      tabIndex={0}
      onBlur={(e) => {
        setIsOpen(false);
      }}
    >
      <div className={styles.dropDown} onClick={() => setIsOpen(!isOpen)}>
        <div className="mr5">{filter && filter != "All" ? filter : label}</div>
        {isOpen ? (
          <ion-icon name="chevron-up-outline"></ion-icon>
        ) : (
          <ion-icon name="chevron-down-outline"></ion-icon>
        )}
      </div>
      {isOpen && (
        <div
          className={styles.dropDown_items}
          style={fullWidth && { width: "90%" }}
        >
          {filters.map((item, i) => (
            <div
              className={styles.dropDown_item}
              key={i}
              onClick={() => setFilter(item.name)}
            >
              {item.image && (
                <img
                  src={`${baseUrl}${item.image.url}`}
                  height="15px"
                  className="mr5"
                />
              )}
              {/* {Jsx ? <Jsx type={item.name} /> : <div>{item.name}</div>} */}
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
