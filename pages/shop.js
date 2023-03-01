// *** REACT ***

import { BenefitsTable, PremiumSubscription } from "../components/shopComps";
import { GemsProduct, PaymentSoonModal } from "../components/shopComps";
import { useContext, useState } from "react";

import { Context } from "../context/store";
import { GET_BOXES } from "../GQL/query";
import Header from "../components/Header";
import { ImageUI } from "../components/reusableUI";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import iconCheckmark from "../assets/checkmark.svg";
import { normalize } from "../utils/calculations";
import styles from "../styles/Shop.module.scss";
import useModal from "../hooks/useModal";
import { useQuery } from "@apollo/react-hooks";

// *** COMPONENTS ***

// *** STYLES ***

// *** HOOKS ***

// *** GQL ***

const Shop = () => {
  const { loading, error, data } = useQuery(GET_BOXES);
  // const { data: gql_courses_data } = useQuery(GET_COURSES);
  const { isShowing, openModal, closeModal } = useModal();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const gql_data = data && normalize(data);

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
            Actionise <div className="proLabel">PRO</div>
          </div>
          <div className={styles.proxySubs_benefits}>
            <div className={styles.proxySubs_image}>
              <ImageUI url={"/energy.png"} isPublic height="60px" />
              <div className={styles.proxySubs_infinity}>&#8734;</div>
            </div>
            <div className={styles.proxySubs_benefitsBox}>
              <div className={styles.proxySubs_benefit}>
                <img src={iconCheckmark} height="18px" className="mr5" />
                Unlimited Energy
              </div>
              <div className={styles.proxySubs_benefit}>
                <img src={iconCheckmark} height="18px" className="mr5" /> Extra
                Objectives
              </div>
              <div className={styles.proxySubs_benefit}>
                <img src={iconCheckmark} height="18px" className="mr5" /> Extra
                Level Rewards
              </div>
            </div>
          </div>
          {/* <div className={styles.proxySubs_price}>$4.99 / Mo</div> */}
          <div onClick={openModal} className={styles.proCtaButton}>
            $4.99 / Mo
          </div>
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
