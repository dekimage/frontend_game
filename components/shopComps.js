import { CardType } from "../components/Card";
import cx from "classnames";
import { useContext, useState } from "react";
import { Context } from "../context/store";
import Link from "next/link";
import { ImageUI } from "./reusableUI";

// *** ACTIONS ***
import {
  openPack,
  purchaseLootBox,
  purchaseExpansion,
  purchaseProduct,
} from "../actions/action";

import { Rating } from "../components/Rating";

// *** STYLES ***
import styles from "../styles/Shop.module.scss";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

import iconCheckmark from "../assets/red-checkmark.svg";
import iconLock from "../assets/lock-white-border.svg";

import iconCalendar from "../assets/calendar.svg";
import iconClock from "../assets/clock.svg";
import iconSessions from "../assets/sessions.svg";

export const Course = ({ course }) => {
  const {
    id,
    name,
    students,
    price,
    discount,
    duration,
    course_details,
    last_updated,
    image,
    rating,
  } = course;

  return (
    <Link href={`/course/${id}`}>
      <div
        className={styles.course}
        style={{ backgroundImage: `url(${baseUrl}${image.url})` }}
      >
        <div className={styles.course_blackScreen}>
          <div className={styles.course_name}>{name}</div>
          <div className={styles.course_detail}>
            <img src={iconClock} height="15px" className="mr5" />
            {course_details.duration} days
          </div>
          <div className={styles.course_detail}>
            <img src={iconSessions} height="15px" className="mr5" />
            {course_details.sessions} sessions
          </div>

          <div className={styles.course_detail}>
            <img src={iconCalendar} height="15px" className="mr5" />
            {last_updated.slice(0, 7)} updated
          </div>
          <div className={styles.course_priceAndRating}>
            <div className={styles.course_price}>${price}</div>
            <div className={styles.course_rating}>
              <span className="mr5">{rating}</span> <Rating course={course} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const DropLabel = ({}) => {
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

export const PaymentSoonModal = ({ closeModal }) => {
  return (
    <div>
      Thanks for being here! Currently the app is in Testing Beta. Payments will
      be avialable once it launches on Playstore (Android) & App Store (IOS). If
      you wish to be notified when it fully launhes as mobile app, you can join
      the wait list here.
    </div>
  );
};

export const GemsProduct = ({ gems, setSelectedProduct, openModal }) => {
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
      {/* <div className={styles.box_name}>{name}</div> */}
      <div className={styles.boxModal_amount}>
        {gems.amount}
        {gems.bonus_amount && (
          <span className={styles.boxModal_bonus}> + {gems.bonus_amount}</span>
        )}
      </div>

      <div className="mb1">
        {/* {image && <img src={image.url} alt="" height={`${height}px`} />} */}
        {image && <ImageUI url={image.url} height="45px" />}

        {/* <ImageUI url={`/${gems.type}.png`} height="40px" /> */}
      </div>
      <div
        className={styles.box_cta}
        // onClick={() => purchaseProduct(dispatch, 2)}
      >
        ${price}
      </div>
    </div>
  );
};

export const Pack = ({ box, setSelectedProduct, openModal }) => {
  const [store, dispatch] = useContext(Context);
  return (
    store.user && (
      <div
        className={styles.box}
        onClick={() => {
          setSelectedProduct(box);
          openModal(true);
        }}
      >
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
          {box.image && <img src={box.image.url} alt="" height="125px" />}
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

export const BoxModal = ({ product, closeModal }) => {
  const [store, dispatch] = useContext(Context);

  return (
    <div>
      <div className={styles.boxModal}>
        <div className={styles.boxModal_name}>{product.name}</div>
        {product.image && (
          <img src={product.image.url} height={"100px"} alt="" />
        )}
        <div className={styles.boxModal_amount}>
          {product.amount}
          <span className={styles.boxModal_bonus}>
            {" "}
            + {product.bonus_amount}
          </span>
          <img height="14px" src={`${baseUrl}/gems.png`} className="ml5" />
        </div>
        <span className={styles.boxModal_bonusLabel}>First Purchase Bonus</span>
        <div
          className="btn btn-primary"
          onClick={() => {
            // purchaseProduct(dispatch, gems.id, "android");
            closeModal();
          }}
        >
          $ {product.price}
        </div>
      </div>
    </div>
  );
};

export const Subscription = () => {
  return (
    <div className={styles.subscription}>
      <div className={styles.subscription_name}>Premium Subscription</div>
      <div className={styles.subscription_body}>
        <div className={styles.subscription_reward}>Gain progress faster!</div>

        <div className={styles.subscriptionContainer}>
          <div className={styles.subscription_reward}>
            <img height="18px" src={`${baseUrl}/energy.png`} className="mr5" />
            x2 Energy
          </div>
          <div className={styles.subscription_reward}>
            <img height="18px" src={`${baseUrl}/stars.png`} className="mr5" />
            x2 Stars
          </div>

          <div className={styles.subscription_reward}>
            <img height="18px" src={`${baseUrl}/gems.png`} className="mr5" />
            +30 Gems
          </div>
          <div className={styles.subscription_reward}>
            <img height="18px" src={`${baseUrl}/gift.png`} className="mr5" />
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
  );
};

export const Expansion = ({ gql_data }) => {
  const [store, dispatch] = useContext(Context);
  const hasExpansion = (expansionId) => {
    if (store.user.expansions?.length === 0) {
      return false;
    }
    return (
      store.user.expansions?.filter((e) => e.id === expansionId).length === 1
    );
  };
  return (
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
        <div className={styles.expansion_salesPoint}>+ 120 New Actions</div>
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
              <img height="18px" src={`${baseUrl}/gems.png`} className="mr5" />
              {gql_data.expansion.price}
            </div>
            <div className={styles.subscription_monthly}>Lifetime Access.</div>
          </>
        )}
      </div>
    </div>
  );
};

const pricingData = [
  {
    name: "lifetime",
    discount: 50,
    valueTag: "Best Value",
    duration: "Lifetime",
    oldPrice: "$99.99",
    price: "$49.99",
  },
  {
    name: "yearly",
    discount: false,
    valueTag: "",
    duration: "12 Months",
    oldPrice: "",
    price: "$39.99",
  },
  {
    name: "monthly",
    discount: false,
    // valueTag: "Most Popular",
    valueTag: false,
    duration: "1 Month",
    oldPrice: "",
    price: "$4.99",
  },
];

const PricingBox = ({
  name,
  discount,
  valueTag,
  duration,
  oldPrice,
  price,
  isSelected,
  setSelectedPrice,
}) => {
  return (
    <div
      className={cx([styles.pricingBox], {
        [styles.active]: isSelected,
      })}
      onClick={() => setSelectedPrice(name)}
    >
      {discount && (
        <div className={styles.pricingBox_discount}>{discount}%</div>
      )}
      {valueTag && (
        <div className={styles.pricingBox_valueTag}> {valueTag}</div>
      )}
      <div className={styles.pricingBox_duration}>{duration} </div>
      <div className={styles.pricingBox_oldPrice}>{oldPrice}</div>
      <div className={styles.pricingBox_price}>{price}</div>
      <div className={styles.pricingBox_dayPrice}>
        {name === "monthly" && "Only $0.16/Day"}
      </div>
      <div className={styles.pricingBox_radioOuter}>
        <div
          className={cx([styles.pricingBox_radioInner], {
            [styles.active]: isSelected,
          })}
        ></div>
      </div>
    </div>
  );
};

export const PremiumSubscription = ({}) => {
  const [selectedPrice, setSelectedPrice] = useState("monthly");
  return (
    <div>
      {/* <div>Premium Pass</div> */}
      <div className={styles.pricingWrapper}>
        {pricingData.map((d, i) => {
          return (
            <PricingBox
              isSelected={selectedPrice === d.name}
              setSelectedPrice={setSelectedPrice}
              name={d.name}
              discount={d.discount}
              valueTag={d.valueTag}
              duration={d.duration}
              oldPrice={d.oldPrice}
              price={d.price}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
};

const premiumBenefitsData = [
  {
    name: "",
    free: "Free",
    premium: "Premium",
  },
  {
    name: "Categories",
    free: 4,
    premium: 8,
  },
  {
    name: "Open Cards",
    free: "30",
    premium: "60",
  },
  {
    name: "Collectable Cards",
    free: "20",
    premium: "40",
  },
  {
    name: "Actions",
    free: "120",
    premium: "340",
  },
  {
    name: "Energy / Day",
    free: 3,
    premium: 6,
  },
  {
    name: "Premium Level Rewards",
    free: <img src={iconLock} height="18px" />,
    premium: (
      <img src={iconCheckmark} height="18px" className={styles.progressIcon} />
    ),
  },
  {
    name: "Premium Objectives",
    free: <img src={iconLock} height="18px" />,
    premium: (
      <img src={iconCheckmark} height="18px" className={styles.progressIcon} />
    ),
  },
];

const BenefitRow = ({ name, free, premium, i }) => {
  return (
    <div className={cx([styles.row], { [styles.gray]: i % 2 === 1 })}>
      <div className={styles.row_name}>{name}</div>
      <div className={styles.row_free}>{free}</div>
      <div className={styles.row_premium}>{premium}</div>
    </div>
  );
};

export const BenefitsTable = ({}) => {
  return (
    <div>
      {premiumBenefitsData.map((d, i) => {
        return (
          <BenefitRow
            key={i}
            i={i}
            name={d.name}
            free={d.free}
            premium={d.premium}
          />
        );
      })}
    </div>
  );
};
