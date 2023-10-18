import {
  Product,
  PaymentSoonModal,
  BoxModal,
  PricingBox,
} from "@/components/shopComps";
import iconLock from "@/assets/lock-white-border.svg";
import { useContext, useEffect, useState } from "react";
import { GET_PRODUCTS, GET_PRO_CARDS } from "@/GQL/query";
import Header from "@/components/Header";
import Modal from "@/components/reusable/Modal";
import NavBar from "@/components/NavBar";
import { normalize } from "@/utils/calculations";
import styles from "@/styles/Shop.module.scss";
import useModal from "@/hooks/useModal";
import { useQuery } from "@apollo/react-hooks";
import { ImageUI } from "@/components/reusableUI";
import iconCheckmark from "@/assets/checkmark.svg";

import Card from "@/components/Card";
import { BackButton } from "@/components/reusable/BackButton";
import { purchaseProduct } from "@/actions/action";
import { Context } from "@/context/store";
import { CALENDY_LINK_URL } from "@/data/config";

const ThankYouModal = ({ closeModal }) => {
  return (
    <div className=" flex_center flex_column">
      <ImageUI isPublic url={"/thanks.png"} height={100} width={100} />
      <span
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          justifyContent: "center",
        }}
      >
        Congratulations on Your Purchase!
      </span>
      <br />
      Your support means the world to us. With your recent purchase, you've
      taken a big step in enhancing your experience with Actionise.
      <br />
      <br />
      If you ever have questions or need assistance, don't hesitate to reach out
      to us. We're here to help you make the most of your Actionise journey.
      <div className="btn btn-primary mt1" onClick={closeModal}>
        Got it
      </div>
    </div>
  );
};

const MaxEnergyModal = ({ closeModal }) => {
  return (
    <div className=" flex_center flex_column">
      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
        Max Energy Upgrade.
      </span>
      {/* Your max energy determines how much energy you get per day. Every 24 hours
      your energy is refreshed to your max energy. Each time you play a card's
      program or make progress on the card's content, you use energy. By
      upgrading your max energy you will permanently increase your max energy to
      20. Also you will receive up to 20 energy immediately to fill your energy
      bar to maximum. */}
      10 Max Energy arrows --- 20 Max Energy. Max energy defines your daily
      energy allowance. Every day, your energy renews to match your max energy.
      Whenever you play a card's program or advance its content, you consume
      energy. Upgrading your max energy boosts this limit to 20, providing you
      with an immediate energy refill to reach the maximum level of 20.
      <div className="btn btn-primary mt1" onClick={closeModal}>
        Got it
      </div>
    </div>
  );
};

const ProCardsModal = ({ closeModal }) => {
  const { data, loading, error } = useQuery(GET_PRO_CARDS);
  const [cards, setCards] = useState(null);
  useEffect(() => {
    if (data && !cards) {
      const gql_data = normalize(data);
      setCards(gql_data.cards);
    }
  }, [data, cards]);

  return (
    <div className="background_dark">
      <BackButton callback={closeModal} isBack />
      <div className={styles.proCardsHeader}>Pro Cards</div>
      <div className={styles.proCards}>
        {cards?.length &&
          cards.map((card, i) => <Card card={card} isFromShop key={i} />)}
      </div>
    </div>
  );
};

export const ProLabel = () => {
  return (
    <div
      className="proLabel  mr25"
      style={{
        height: "20px",
        width: "fit-content",
        padding: "0.25rem .5rem",
        fontSize: "12px",
      }}
    >
      PRO
    </div>
  );
};

const ProItem = ({ setModal, dispatch, id, openModal }) => {
  return (
    <div className="section">
      {/* <div className={styles.header}>Subscription</div> */}
      <div className={styles.proxySubs}>
        <div className={styles.proxySubs_title}>
          ACTIONISE
          <div className="proLabel ml5">PRO</div>
        </div>
        <div className={styles.proxySubs_benefits}>
          {/* <div className={styles.proxySubs_image}>
          <ImageUI url={"/energy.png"} isPublic height="60px" />
          <div className={styles.proxySubs_infinity}>&#8734;</div>
        </div> */}
          <div className={styles.proxySubs_benefitsBox}>
            <div className={styles.proxySubs_benefit}>
              <img src={iconCheckmark} height="18px" className="mr5" />
              {/* + 20&nbsp;
            <ProLabel /> New Cards */}
              + 20 New Cards
              <div
                className="btn btn-outline ml5"
                style={{ padding: ".25rem .5rem" }}
                onClick={() => setModal("cards")}
              >
                View All
              </div>
            </div>

            <div className={styles.proxySubs_benefit}>
              <img src={iconCheckmark} height="18px" className="mr5" />
              {/* + 5&nbsp;
            <ProLabel /> Objectives */}
              + 5 Pro Objectives
            </div>
            <div className={styles.proxySubs_benefit}>
              <img src={iconCheckmark} height="18px" className="mr5" />
              {/* + 30&nbsp;
            <ProLabel /> Level Rewards */}
              + 30 Level Rewards
            </div>
            <div className={styles.proxySubs_benefit}>
              <img src={iconCheckmark} height="18px" className="mr5" />
              <ImageUI url={"/energy.png"} isPublic height="20px" />
              50/50 Max Energy{" "}
              {/* <div
                className="btn btn-outline ml5"
                style={{ padding: ".25rem .5rem" }}
                onClick={() => setModal("maxEnergy")}
              >
                i
              </div> */}
            </div>
          </div>
        </div>

        <div
          className="btn btn-action"
          onClick={openModal}
          style={{ fontSize: "18px", fontWeight: "bold" }}
          // onClick={() => purchaseProduct(dispatch, id, "apple")}
        >
          Buy Pro $20
        </div>
        <div className={styles.subscription_monthly}>(Lifetime Access)</div>

        {/* <div onClick={openModal} className={styles.proCtaButton}>
        $20
      </div> */}
      </div>
    </div>
  );
};

const Coaching = ({ setModal, user, dispatch, openModal }) => {
  const [selectedPricing, setSelectedPricing] = useState("monthly");
  return (
    <div className="section">
      {/* <div className={styles.header}>Subscription</div> */}
      <div className={styles.proxySubs}>
        <div className={styles.proxySubs_title_coaching}>COACHING</div>
        <h3 className="mt1">Need personalized training?</h3>
        <div className="flex_center w-full">
          <PricingBox
            isSelected={selectedPricing === "monthly"}
            setSelectedPrice={() => setSelectedPricing("monthly")}
            name={"1 Month"}
            discount={5}
            valueTag={false}
            duration={"1 Month"}
            oldPrice={"$1000"}
            price={"$950"}
          />
          <PricingBox
            isSelected={selectedPricing === "quarterly"}
            setSelectedPrice={() => setSelectedPricing("quarterly")}
            name={"3 Months"}
            discount={10}
            valueTag={false}
            duration={"3 Months"}
            oldPrice={"$3000"}
            price={"$2700"}
          />
        </div>
        <div className={styles.proxySubs_benefits}>
          <div className={styles.proxySubs_benefitsBox}>
            <div className={styles.proxySubs_benefit}>
              <img src={iconCheckmark} height="18px" className="mr5" />
              60 min live sessions
            </div>

            <div className={styles.proxySubs_benefit}>
              <img src={iconCheckmark} height="18px" className="mr5" />2
              Sessions per week
            </div>
            <div className={styles.proxySubs_benefit}>
              <img src={iconCheckmark} height="18px" className="mr5" />1 on 1
              Private calls on Google Meet
            </div>
            <div className={styles.proxySubs_benefit}>
              <img src={iconCheckmark} height="18px" className="mr5" />
              All inclusive coaching & tracking
            </div>
          </div>
        </div>

        {/* <div
          className="btn btn-outline"
          onClick={() => setModal("coachingDetails")}
        >
          View Details
        </div> */}
        <div
          className="btn btn-action"
          // onClick={() => setModal("coachingDetails")}
          // onclick -> open calendly??
          style={{ fontSize: "18px", fontWeight: "bold" }}
          onClick={() => openModal()}
        >
          Buy Coaching {selectedPricing === "monthly" ? "$950" : "$2700"}
        </div>
        <div className="mt1 mb1 ">OR</div>

        <div
          className="btn btn-green"
          style={{ fontSize: "18px", fontWeight: "bold" }}
          onClick={() => window.open(CALENDY_LINK_URL, "_blank")}
        >
          Book Free Session
        </div>

        <div className={styles.subscription_monthly}>
          (Free 15 minutes session)
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const { isShowing, openModal, closeModal } = useModal();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [store, dispatch] = useContext(Context);

  const [modal, setModal] = useState(null);

  const gql_data = data && normalize(data);

  const getEnergy = (products) => {
    return products.filter((p) => p.type === "energy");
  };
  const getStars = (products) => {
    return products.filter((p) => p.type === "stars");
  };

  const getPro = (products) => {
    return products.filter((p) => p.type === "subscription");
  };

  const proId = gql_data && getPro(gql_data.products)[0].id;

  return (
    <div className="background_dark">
      <Header />
      <div className="headerSpace"></div>

      <div className="section"></div>

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

      {!store.user.pro && (
        <ProItem
          setModal={setModal}
          dispatch={dispatch}
          id={proId}
          openModal={openModal}
        />
      )}

      {/* <div className="section">
 
        <div className={styles.header}>Energy</div>
        <div className={styles.boxes}>
          {gql_data &&
            getEnergy(gql_data.products)
              .sort((a, b) => a.amount - b.amount)
              .map((product, i) => {
                return (
                  <Product
                    product={product}
                    setSelectedProduct={setSelectedProduct}
                    openModal={openModal}
                    key={i}

                  />
                );
              })}
        </div>
      </div>

      <div className="section">
     
        <div className={styles.header}>Stars</div>
        <div className={styles.boxes}>
          {gql_data &&
            getStars(gql_data.products)
              .sort((a, b) => a.amount - b.amount)
              .map((product, i) => {
                return (
                  <Product
                    product={product}
                    setSelectedProduct={setSelectedProduct}
                    openModal={openModal}
                    key={i}
                  />
                );
              })}
        </div>
      </div> */}

      <Coaching
        dispatch={dispatch}
        user={store.user}
        setModal={setModal}
        openModal={openModal}
      />

      <Modal
        isShowing={isShowing}
        closeModal={closeModal}
        jsx={<PaymentSoonModal closeModal={closeModal} />}
        isSmall
      />

      <Modal
        isShowing={store.rewardsModal?.isOpen}
        closeModal={() => dispatch({ type: "CLOSE_REWARDS_MODAL" })}
        showCloseButton={true}
        jsx={
          <ThankYouModal
            closeModal={() => dispatch({ type: "CLOSE_REWARDS_MODAL" })}
          />
        }
        isSmall
      />

      <Modal
        isShowing={modal === "maxEnergy"}
        closeModal={() => setModal(null)}
        showCloseButton={false}
        jsx={<MaxEnergyModal closeModal={() => setModal(null)} />}
        isSmall
      />

      <Modal
        isShowing={modal === "cards"}
        closeModal={() => setModal(null)}
        showCloseButton={false}
        jsx={<ProCardsModal closeModal={() => setModal(null)} />}
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
