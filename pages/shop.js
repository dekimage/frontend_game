// *** REACT ***
import { useContext, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";

// *** COMPONENTS ***
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";
import LootBoxModal from "../components/LootBoxModal";

import { Tabs } from "../components/profileComps";

import {
  Pack,
  BoxModal,
  PremiumSubscription,
  BenefitsTable,
  Course,
  GemsProduct,
  PaymentSoonModal,
} from "../components/shopComps";

// *** STYLES ***
import styles from "../styles/Shop.module.scss";

// *** HOOKS ***
import useModal from "../hooks/useModal";
import { normalize } from "../utils/calculations";

// *** GQL ***
import { GET_BOXES, GET_COURSES } from "../GQL/query";
import { ImageUI } from "../components/reusableUI";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Shop = () => {
  const [store, dispatch] = useContext(Context);

  const { loading, error, data } = useQuery(GET_BOXES);
  // const { data: gql_courses_data } = useQuery(GET_COURSES);
  const { isShowing, openModal, closeModal } = useModal();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const gql_data = data && normalize(data);
  // const courses = gql_courses_data && normalize(gql_courses_data).courses;
  const getEnergy = (products) => {
    return products.filter((p) => p.type === "energy");
  };
  const getStars = (products) => {
    return products.filter((p) => p.type === "stars");
  };

  return (
    <div className="background_dark">
      <Header />
      <div className="headerSpace"></div>

      {/* *** COURSES *** */}
      {/* <div className="section">
        <div className={styles.header}>Programs</div>
        {courses && courses.map((c, i) => <Course course={c} key={i} />)}
      </div> */}
      {/* *** SUBSCRIPTION *** */}

      {/* <div className="section">
        <div className="header">Premium Subscription</div>
        <PremiumSubscription />
        <BenefitsTable />
        <div className={styles.subscriptionCta}>
          <div className="btn btn-primary mt1">Try 3 Days For Free</div>
          <div className={styles.subscription_monthly}>
            Billed Monthly. Cancel anytime.
          </div>
        </div>
      </div> */}
      <div className="section">
        <div className={styles.header}>Subscription</div>
        <div className={styles.proxySubs}>
          <div className={styles.proxySubs_title}>
            Actionise <div className={styles.proLabel}> PRO</div>
          </div>
          <div className={styles.proxySubs_benefits}>
            <div className={styles.proxySubs_image}>
              <ImageUI url={"/energy.png"} height="60px" />
              <div className={styles.proxySubs_infinity}>&#8734;</div>
            </div>
            <div className={styles.proxySubs_benefitsBox}>
              <div className={styles.proxySubs_benefit}>+ Unlimited Energy</div>
              <div className={styles.proxySubs_benefit}>+ Extra Objectives</div>
              <div className={styles.proxySubs_benefit}>
                + Extra Level Rewards
              </div>
            </div>
          </div>
          {/* <div className={styles.proxySubs_price}>$4.99 / Mo</div> */}
          <div className={styles.proCtaButton}>$4.99 / Mo</div>
        </div>
      </div>

      <div className="section">
        {/* *** GEMS *** */}
        <div className={styles.header}>Energy</div>
        <div className={styles.boxes}>
          {gql_data &&
            getEnergy(gql_data.products)
              .sort((a, b) => a.amount - b.amount)
              .map((product, i) => {
                return (
                  <GemsProduct
                    gems={product}
                    setSelectedProduct={setSelectedProduct}
                    openModal={openModal}
                    key={i}
                  />
                );
              })}
        </div>
      </div>

      <div className="section">
        {/* *** GEMS *** */}
        <div className={styles.header}>Stars</div>
        <div className={styles.boxes}>
          {gql_data &&
            getStars(gql_data.products)
              .sort((a, b) => a.amount - b.amount)
              .map((product, i) => {
                return (
                  <GemsProduct
                    gems={product}
                    setSelectedProduct={setSelectedProduct}
                    openModal={openModal}
                    key={i}
                  />
                );
              })}
        </div>
      </div>

      <Modal
        isShowing={isShowing}
        closeModal={closeModal}
        jsx={<PaymentSoonModal closeModal={closeModal} />}
        isSmall
      />

      {/* <Modal
        isShowing={isShowing}
        closeModal={closeModal}
        jsx={<BoxModal product={selectedProduct} closeModal={closeModal} />}
        isSmall
      /> */}

      <NavBar />
    </div>
  );
};

export default Shop;
