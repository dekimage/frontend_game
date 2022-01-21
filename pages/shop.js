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

// *** ACTIONS ***
import { levelUp } from "../actions/action";

// *** DATA ***
import { boxes, gems } from "../data/rewards";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Shop.module.scss";

const Shop = () => {
  const [store, dispatch] = useContext(Context);
  // const { loading, error, data } = useQuery(GET_OBJECTIVES_QUERY);

  return (
    <div className="section">
      <Header />
      <div>BOXES</div>
      <div>
        {boxes.map((box) => {
          return (
            <div className={styles.product}>
              <div>img</div>
              <div>{box.price_amount}</div>
              {/* {box.id}
              {box.name}
              {box.price_amount}
              {box.price_type}
              {box.reward_amount}
              {box.description} */}
              {/* {box.drop_table} */}
            </div>
          );
        })}
      </div>
      <div>GEMS</div>
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
      </div>
      <Navbar />
    </div>
  );
};

export default Shop;
