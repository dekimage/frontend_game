// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";

// *** COMPONENTS ***
import RewardImage from "../components/RewardImage";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { ImageUI } from "../components/reusableUI";
import Modal from "../components/Modal";
import LootBoxModal from "../components/LootBoxModal";
import { CardType } from "../components/Card";

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
import { normalize } from "../utils/calculations";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const GET_BOXES = gql`
  query {
    boxes {
      data {
        id
        attributes {
          name
          description
          require
          price
          price_type
          image {
            data {
              attributes {
                url
              }
            }
          }
          expansion {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
      meta {
        pagination {
          page
          pageSize
          total
          pageCount
        }
      }
    }

    products {
      data {
        id
        attributes {
          name
          description
          price
          discount
          bonus_amount
          type
          google_id
          apple_id
          is_disabled
          amount
          image {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
      meta {
        pagination {
          page
          pageSize
          total
          pageCount
        }
      }
    }

    expansion(id: 2) {
      data {
        id
        attributes {
          name
          description
          price
          discount_price
          image {
            data {
              id
              attributes {
                url
              }
            }
          }
        }
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
          <img height="26px" src={`${baseUrl}/${card.url}.png`} />
        </div>
      ))}
    </div>
  );
};

const getHeight = (amount) => {
  const heights = {
    10: 50,
    20: 75,
    60: 70,
    80: 80,
  };
  return heights[amount];
};

const GemsProduct = ({ gems, setSelectedProduct, openModal }) => {
  const {
    amount,
    appleID,
    googleID,
    bonus_amount,
    description,
    discount,
    type,
    image,
    name,
    price,
  } = gems;

  const height = getHeight(type === "gems" && amount);

  return (
    <div
      className={styles.box}
      onClick={() => {
        setSelectedProduct(gems);
        openModal(true);
      }}
    >
      <div className={styles.box_name}>{name}</div>
      <div className={styles.boxModal_amount}>
        {gems.amount}
        <span className={styles.boxModal_bonus}> + {gems.bonus_amount}</span>
      </div>

      <div className="mt1 mb1">
        <img src={image.url} alt="" height={`${height}px`} />
      </div>
      <div
        className={styles.box_cta}
        onClick={() => purchaseProduct(dispatch, 2)}
      >
        $ {price}
      </div>
    </div>
  );
};

const BoxProduct = ({ box, setSelectedProduct, openModal }) => {
  const [store, dispatch] = useContext(Context);
  console.log(store.user);
  return (
    store.user && (
      <div
        className={styles.box}
        onClick={() => {
          setSelectedProduct(box);
          openModal(true);
        }}
      >
        {/* <div className={styles.box_type}>
          <CardType
            type={box.expansion.name === "Basic" ? "free" : "premium"}
          />
        </div> */}

        <div
          className={
            store.user.boxes[box.id] === 0
              ? styles.box_quantity
              : styles.box_quantity_red
          }
        >
          {store.user.boxes[box.id]}
        </div>
        <div className={styles.box_name}>{box.name}</div>
        <div>
          <img src={box.image.url} alt="" height="125px" />
        </div>
        <div className={styles.box_cta}>
          {box.price_type == "stars" && (
            <img height="18px" src={`${baseUrl}/stars.png`} />
          )}
          {box.price_type == "gems" && (
            <img height="18px" src={`${baseUrl}/gems.png`} />
          )}
          {box.price}
        </div>
      </div>
    )
  );
};

const BoxModal = ({ product, closeModal }) => {
  const box = product.type !== "gems" && product;
  const gems = product.type === "gems" && product;
  const [store, dispatch] = useContext(Context);
  let cantBuy = false;
  if (box) {
    cantBuy =
      box.price_type === "stars"
        ? box.price > store.user.stars
        : box.price > store.user.gems;
  }

  return (
    <div>
      {box && (
        <div className={styles.boxModal}>
          <div className={styles.boxModal_name}>{box.name}</div>
          <div>
            <img src={box.image.url} alt="" height="250px" />
          </div>
          <div className={styles.boxModal_label}>Chance to contain:</div>
          <DropLabel />
          <div className={styles.boxModal_quantity}>
            You have {store.user.boxes[box.id]} pack
            {store.user.boxes[box.id] == 1 ? "" : "s"}.
          </div>
          {store.user.boxes[box.id] > 0 ? (
            <div
              className="btn btn-stretch btn-primary"
              onClick={() => {
                openPack(dispatch, box.id);
                closeModal();
              }}
            >
              Open
            </div>
          ) : (
            <div
              className="btn btn-stretch btn-primary"
              onClick={() => {
                purchaseLootBox(dispatch, box.id);
                closeModal();
              }}
            >
              {box.price_type == "stars" && (
                <img
                  height="18px"
                  className="mr5"
                  src={`${baseUrl}/stars.png`}
                />
              )}
              {box.price_type == "gems" && (
                <img
                  height="18px"
                  className="mr5"
                  src={`${baseUrl}/gems.png`}
                />
              )}
              <span
                className={cx(styles.boxModal_cta, {
                  [styles.boxModal_ctaRed]: cantBuy,
                })}
              >
                {box.price}
              </span>
            </div>
          )}
        </div>
      )}
      {gems && (
        <div className={styles.boxModal}>
          <div className={styles.boxModal_name}>{gems.name}</div>
          <img src={gems.image.url} height={"100px"} alt="" />
          <div className={styles.boxModal_amount}>
            {gems.amount}
            <span className={styles.boxModal_bonus}>
              {" "}
              + {gems.bonus_amount}
            </span>
            <img height="14px" src={`${baseUrl}/gems.png`} className="ml5" />
          </div>
          <span className={styles.boxModal_bonusLabel}>
            First Purchase Bonus
          </span>
          <div
            className="btn btn-primary"
            onClick={() => {
              // purchaseProduct(dispatch, gems.id, "android");
              closeModal();
            }}
          >
            $ {gems.price}
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

  const gql_data = data && normalize(data);

  const hasExpansion = (expansionId) => {
    if (store.user.expansions?.length === 0) {
      return false;
    }
    return (
      store.user.expansions?.filter((e) => e.id === expansionId).length === 1
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

            <div className={styles.subscriptionContainer}>
              <div className={styles.subscription_reward}>
                <img
                  height="18px"
                  src={`${baseUrl}/energy.png`}
                  className="mr5"
                />
                x2 Energy
              </div>
              <div className={styles.subscription_reward}>
                <img
                  height="18px"
                  src={`${baseUrl}/stars.png`}
                  className="mr5"
                />
                x2 Stars
              </div>

              <div className={styles.subscription_reward}>
                <img
                  height="18px"
                  src={`${baseUrl}/gems.png`}
                  className="mr5"
                />
                +30 Gems
              </div>
              <div className={styles.subscription_reward}>
                <img
                  height="18px"
                  src={`${baseUrl}/gift.png`}
                  className="mr5"
                />
                Premium Rewards
              </div>
            </div>

            <div
              className="btn btn-stretch btn-primary mt1"
              // onClick={() => purchaseProduct(dispatch, 1, "android")}
            >
              $ 4.99
            </div>
            <div className={styles.subscription_monthly}>
              Billed Monthly. Cancel anytime.
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className={styles.header}>Packs</div>
        <div className={styles.boxes}>
          {gql_data &&
            store.user?.boxes &&
            gql_data.boxes
              .sort((a, b) => a.id - b.id)
              .map((box, i) => {
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
        <div className={styles.header}>Gems</div>
        <div className={styles.boxes}>
          {gql_data &&
            getGems(gql_data.products)
              .sort((a, b) => a.amount - b.amount)
              .map((gems, i) => {
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
      </div>

      {gql_data && store.user && (
        <div className="section">
          <div className={styles.header}>Expansions</div>

          <div className={styles.subscription}>
            <CardType type={"premium"} />
            <div className={styles.expansion_name}>
              {/* {gql_data.expansion.name} */}
              Expansion Set
            </div>

            <div className={styles.expansion_description}>
              {/* <div className={styles.expansion_salesPoint}>
                + Unlock the full Actionise Experience!
              </div> */}
              {/* <div className={styles.expansion_salesPoint}>
                + 20 New Open Cards (Instant Access)
              </div>
              <div className={styles.expansion_salesPoint}>
                + 20 New Collectable Cards (Premium Packs)
              </div> */}
              <div className={styles.expansion_salesPoint}>
                + 40 New Premium Cards
              </div>
              <div className={styles.expansion_salesPoint}>
                + 120 New Actions
              </div>
              <div className={styles.expansion_salesPoint}>
                + 150 New Ideas & Questions
              </div>
              <div className={styles.expansion_salesPoint}>
                + Wisdom from 50+ Books
              </div>
            </div>

            {gql_data.expansion.image && (
              <img src={gql_data.expansion.image.url} alt="" height="125px" />
            )}
            <div className={styles.subscription_body}>
              <div className={styles.subscription_reward}>
                {gql_data.expansion.description}
              </div>
              {hasExpansion(store.user && gql_data.expansion.id) ? (
                <div className={styles.expansion_alreadyPurchased}>
                  Already Purchased
                </div>
              ) : (
                <>
                  <div
                    className="btn btn-stretch btn-primary"
                    onClick={() => {
                      store.user.gems >= gql_data.expansion.price &&
                        purchaseExpansion(dispatch, gql_data.expansion.id);
                    }}
                  >
                    <img
                      height="18px"
                      src={`${baseUrl}/gems.png`}
                      className="mr5"
                    />
                    {gql_data.expansion.price}
                  </div>
                  <div className={styles.subscription_monthly}>
                    Lifetime Access.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Shop;
