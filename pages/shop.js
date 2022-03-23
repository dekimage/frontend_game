// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";

// *** COMPONENTS ***
import RewardImage from "../components/RewardImage";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { ImageUI } from "../components/reusableUI";
import Modal from "../components/Modal";
import LootBoxModal from "../components/LootBoxModal";

// *** ACTIONS ***
import { purchaseLootBox } from "../actions/action";

// *** DATA ***
import { boxes, gems } from "../data/rewards";
import starIcon from "../assets/xp.svg";
import gemIcon from "../assets/diamond-currency.svg";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Shop.module.scss";

// *** HOOKS ***
import useModal from "../hooks/useModal";

const GET_BOXES = gql`
  query {
    boxes {
      id
      name
      description
      require
      price
      price_type
      image {
        url
      }
      drop_rates
      cards {
        id
        name
      }
    }
  }
`;

const DropLabel = ({}) => {
  const cards = [
    { url: "common-cards", chance: 70 },
    { url: "rare-cards", chance: 20 },
    { url: "epic-cards", chance: 9 },
    { url: "legendary-cards", chance: 1 },
  ];
  return (
    <div className={styles.dropLabel}>
      {cards.map((card, i) => (
        <div className={styles.dropLabel_item} key={i}>
          {card.chance}%
          <img height="26px" src={`http://localhost:1337/${card.url}.png`} />
        </div>
      ))}
    </div>
  );
};

const BoxModal = ({ box, closeModal }) => {
  const [, dispatch] = useContext(Context);
  return (
    <div className={styles.boxModal}>
      <div className={styles.boxModal_name}>{box.name}</div>
      <ImageUI imgUrl={box.image.url} height="250px" />
      <div className={styles.boxModal_label}>Chance to contain:</div>
      <DropLabel />
      <div
        className="btn btn-primary"
        onClick={() => {
          purchaseLootBox(dispatch, box.id);
          closeModal();
        }}
      >
        {" "}
        {box.price_type == "stars" && (
          <img height="18px" src="http://localhost:1337/star.png" />
        )}
        {box.price_type == "gems" && (
          <img height="18px" src="http://localhost:1337/gems.png" />
        )}
        {box.price}
      </div>
    </div>
  );
};

const Shop = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_BOXES);
  const { isShowing, openModal, closeModal } = useModal();
  const [selectedBox, setSelectedBox] = useState(null);

  return (
    <div className="background_dark">
      <Header />

      <div className="section">
        <div className={styles.boxes}>
          {data &&
            data.boxes.map((box) => {
              return (
                <div
                  className={styles.box}
                  key={box.id}
                  onClick={() => {
                    setSelectedBox(box);
                    openModal(true);
                  }}
                >
                  <ImageUI imgUrl={box.image.url} height="125px" />
                  <div className={styles.box_cta}>
                    {box.price_type == "stars" && (
                      <img height="18px" src="http://localhost:1337/star.png" />
                    )}
                    {box.price_type == "gems" && (
                      <img height="18px" src="http://localhost:1337/gems.png" />
                    )}
                    {box.price}
                  </div>
                </div>
              );
            })}
        </div>
        <Modal
          isShowing={isShowing}
          closeModal={closeModal}
          jsx={<BoxModal box={selectedBox} closeModal={closeModal} />}
        />
        <Modal
          isShowing={store.rewardsModal.isOpen}
          closeModal={closeModal}
          showCloseButton={false}
          jsx={<LootBoxModal />}
        />
      </div>

      {/* <div>GEMS</div>
      <div>
        {gems.map((gems) => {
          return (
            <div className={styles.product}>
              {gems.id}
              {gems.name}
              {gems.price_amount}
              {gems.price_type}
              {gems.reward_amount}
              {gems.description}
            </div>
          );
        })}
      </div>
      <div>EXPANSIONS</div>
      <div className={styles.product}>
        <div>Premium Expansion </div>
        <div>+ 30 new cards</div>
        <div> + 25 new collectable cards</div>
        <div> + 100 gems ** promo ** </div>
        <div> + 10 packs ** promo 2 **</div>
        <div>timer component: 19h: 33m: 12s</div>
        <div>* includes 3 months coaching worth of wisdom *</div>
        <button>Buy 47$</button>
        <button>Learn More</button>
      </div>
      <div>COACHING 1:1</div>
      <div className={styles.product}>
        <div>Premium Expansion </div>
        <div>1 session = 1 hour</div>
        <div> x 12 total sessions</div>
        <div> guided live calls</div>
        <div> live actions & tutoring</div>
        <div>live on camera sessions</div>
        <div>* includes premium access *</div>
        <button>Apply Now 999$</button>
      </div> */}
      <Navbar />
    </div>
  );
};

export default Shop;
