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
import {
  openPack,
  purchaseLootBox,
  purchaseExpansion,
  purchaseProduct,
} from "../actions/action";

// *** DATA ***
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
      expansion {
        name
      }
    }
    products {
      id
      name
      description
      price
      discount
      type
      image {
        url
      }
      googleID
      appleID
      isDisabled
      amount
      bonusAmount
    }
    expansion(id: 2) {
      id
      name
      description
      price
      discountPrice
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

const GemsProduct = ({ gems, setSelectedProduct, openModal }) => {
  const {
    amount,
    appleID,
    googleID,
    bonusAmount,
    description,
    discount,
    image,
    name,
    price,
  } = gems;
  return (
    <div
      className={styles.box}
      onClick={() => {
        setSelectedProduct(gems);
        openModal(true);
      }}
    >
      <div className={styles.box_quantity}>
        {amount} + {bonusAmount}
      </div>
      <div className={styles.box_expansion}>{name}</div>
      <ImageUI imgUrl={image.url} height="50px" />
      <div
        className={styles.box_cta}
        onClick={() => purchaseProduct(dispatch, 2)}
      >
        ${price}
      </div>
    </div>
  );
};

const BoxProduct = ({ box, setSelectedProduct, openModal }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div
      className={styles.box}
      onClick={() => {
        setSelectedProduct(box);
        openModal(true);
      }}
    >
      <div className={styles.box_quantity}>{store.user.boxes[box.id]}</div>
      <div className={styles.box_expansion}>{box.expansion.name}</div>
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
};

const BoxModal = ({ product, closeModal }) => {
  const box = product.type !== "gems" && product;
  const gems = product.type === "gems" && product;
  const [store, dispatch] = useContext(Context);

  return (
    <div>
      {box && (
        <div className={styles.boxModal}>
          <div className={styles.boxModal_name}>{box.name}</div>
          <ImageUI imgUrl={box.image.url} height="250px" />
          <div className={styles.boxModal_label}>Chance to contain:</div>
          <DropLabel />
          <div>Quantity: {store.user.boxes[box.id]}</div>
          {store.user.boxes[box.id] > 0 ? (
            <div
              className="btn btn-primary"
              onClick={() => {
                openPack(dispatch, box.id);
                closeModal();
              }}
            >
              Open
            </div>
          ) : (
            <div
              className="btn btn-primary"
              onClick={() => {
                purchaseLootBox(dispatch, box.id);
                closeModal();
              }}
            >
              {box.price_type == "stars" && (
                <img height="18px" src="http://localhost:1337/star.png" />
              )}
              {box.price_type == "gems" && (
                <img height="18px" src="http://localhost:1337/gems.png" />
              )}
              {box.price}
            </div>
          )}
        </div>
      )}
      {gems && (
        <div className={styles.boxModal}>
          <div className={styles.boxModal_name}>{gems.name}</div>
          <ImageUI imgUrl={gems.image.url} height="100px" />
          <div>
            x{gems.amount} + {gems.bonusAmount}
          </div>
          <div
            className="btn btn-primary"
            onClick={() => {
              purchaseProduct(dispatch, gems.id, "android");
              closeModal();
            }}
          >
            ${gems.price}
          </div>
        </div>
      )}
    </div>
  );
};

const Shop = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_BOXES);
  const { isShowing, openModal, closeModal } = useModal();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const hasExpansion = (expansionId) => {
    return (
      store.user.expansions.filter((e) => e.id === expansionId).length === 1
    );
  };

  const getGems = (products) => {
    return products.filter((p) => p.type === "gems");
  };

  return (
    <div className="background_dark">
      <Header />
      <div className="section">
        <div className={styles.subscription}>
          <div className={styles.subscription_name}>Premium Subscription</div>
          <div className={styles.subscription_body}>
            <div className={styles.subscription_reward}>
              Gain progress faster!
            </div>

            <div className={styles.subscription_reward}>Energy x2 </div>
            <div className={styles.subscription_reward}>Stars x2 </div>
            <div className={styles.subscription_reward}>30 Gems</div>
            <div className={styles.subscription_reward}>Premium Rewards</div>

            <div
              className={styles.subscription_price}
              onClick={() => purchaseProduct(dispatch, 1, "android")}
            >
              $ 4.99
            </div>
            <div className={styles.subscription_monthly}>Billed Monthly.</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div>BOXES</div>
        <div className={styles.boxes}>
          {data &&
            data.boxes.map((box, i) => {
              return (
                <BoxProduct
                  box={box}
                  key={i}
                  setSelectedProduct={setSelectedProduct}
                  openModal={openModal}
                />
              );
            })}
        </div>

        <Modal
          isShowing={isShowing}
          closeModal={closeModal}
          jsx={<BoxModal product={selectedProduct} closeModal={closeModal} />}
        />
        <Modal
          isShowing={store.rewardsModal.isOpen}
          closeModal={closeModal}
          showCloseButton={false}
          jsx={<LootBoxModal />}
        />
      </div>

      <div className="section">
        <div>GEMS</div>
        {data &&
          getGems(data.products).map((gems, i) => {
            return (
              <GemsProduct
                gems={gems}
                setSelectedProduct={setSelectedProduct}
                openModal={openModal}
                key={i}
              />
            );
          })}
      </div>

      {data && store.user && (
        <div className="section">
          <div>EXPANSIONS</div>
          <div className={styles.subscription}>
            <div className={styles.subscription_name}>
              {data.expansion.name}
            </div>
            <div className={styles.subscription_body}>
              <div className={styles.subscription_reward}>
                {data.expansion.description}
              </div>
              {hasExpansion(data.expansion.id) ? (
                <div
                  className={styles.subscription_price}
                  onClick={() => {
                    store.user.gems >= data.expansion.price &&
                      purchaseExpansion(dispatch, data.expansion.id);
                  }}
                >
                  <img height="18px" src="http://localhost:1337/gems.png" />
                  {data.expansion.price}
                </div>
              ) : (
                <div className={styles.subscription_price}>
                  Already Purchased
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Shop;
