// import styles from "../styles/Home.module.scss";
import styles from "../styles/Item.module.scss";
import Modal from "./Modal";
import useModal from "../hooks/useModal";
import { useContext } from "react";
import { Context } from "../context/store";
import Cookie from "js-cookie";
import axios from "axios";
import { updateItem } from "../actions/action";

const ItemModal = ({ item, className, openModal, isEquipped }) => {
  const [store, dispatch] = useContext(Context);

  return (
    <div>
      {/* ITEM IMAGE */}
      <div className={`${styles.item_info} ${className}`}>
        <ItemImage item={item} className={className} openModal={openModal} />
        <div className={styles.item_info__name}>{item.name}</div>
        <div>{item.rarity}</div>
        {/* <div>{item.type}</div> */}
      </div>

      {/* STATS */}
      <div className={styles.item_label}>STATS</div>

      {Object.keys(item.stats).map((key) => (
        <div className={styles.item_row}>
          <div className="flex-row">
            <div className={styles.item_row__img}>
              <img src={`http://localhost:1337/${key}.png`} />
            </div>
            <div>{key}:</div>
          </div>
          <div>+{item.stats[key]}</div>
        </div>
      ))}

      {/* CONDITIONS */}
      <div className={styles.item_label}>CONDITIONS:</div>
      <div className={styles.item_row}>
        <div className="flex-row">
          <div className={styles.item_row__img}>
            <img src={`http://localhost:1337/key-limit.png`} />
          </div>
          <div>min level</div>
        </div>
        <div>10</div>
      </div>

      {/* OBTAINED BY: */}
      <div className={styles.item_label}>OBTAINED BY:</div>
      <div className={styles.item_row}>
        <div className="flex-row">
          <div className={styles.item_row__img}>
            <img src={`http://localhost:1337/influence.png`} />
          </div>
          <div>{item.obtainedBy}</div>
        </div>
        <div>Info</div>
      </div>

      {/* BUTTONS */}
      <div className={styles.button_section}>
        <div
          className={styles.button_primary}
          onClick={() =>
            updateItem(dispatch, item.id, isEquipped ? "unequip" : "equip")
          }
        >
          {isEquipped ? "UNEQUIP" : "EQUIP"}
        </div>
      </div>
    </div>
  );
};

const ItemImage = ({ item, className, openModal }) => (
  <div className={`${styles.item_border} ${className}`} onClick={openModal}>
    <div className={`${styles.item} ${className}`}>
      <img src={`http://localhost:1337${item.image.url}`} />
    </div>
  </div>
);

const Item = ({ item, isEquipped }) => {
  const { isShowing, openModal, closeModal } = useModal();
  let className;
  switch (item.rarity) {
    case "rare":
      className = styles.rare;
      break;
    case "epic":
      className = styles.epic;
      break;
    case "legendary":
      className = styles.legendary;
      break;
    default:
      className = styles.rare;
  }
  return (
    <>
      <ItemImage item={item} className={className} openModal={openModal} />
      <Modal
        isShowing={isShowing}
        closeModal={closeModal}
        jsx={
          <ItemModal
            item={item}
            className={className}
            openModal={openModal}
            isEquipped={isEquipped}
          />
        }
      />
    </>
  );
};

export default Item;
