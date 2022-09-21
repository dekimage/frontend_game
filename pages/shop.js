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
} from "../components/shopComps";

// *** STYLES ***
import styles from "../styles/Shop.module.scss";

// *** HOOKS ***
import useModal from "../hooks/useModal";
import { normalize } from "../utils/calculations";

// *** GQL ***
import { GET_BOX_ID, GET_COURSES } from "../GQL/query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Shop = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_BOX_ID, {
    variables: { id: 1 },
  });
  const { data: gql_courses_data } = useQuery(GET_COURSES);
  const { isShowing, openModal, closeModal } = useModal();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tab, setTab] = useState("Packs");

  const tabsData = [
    { label: "Packs", count: -1, link: "packs" },
    { label: "Programs", count: -1, link: "programs" },
    { label: "Subscription", count: -1, link: "subscription" },
  ];

  const gql_data = data && normalize(data);
  const courses = gql_courses_data && normalize(gql_courses_data).courses;

  return (
    <div className="background_dark">
      <Header />

      <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />

      <div className="section">
        {/* *** PACKS *** */}
        <div id="packs"></div>
        <div className={styles.header}>Packs</div>

        {gql_data && store.user?.boxes && (
          <Pack
            box={gql_data.box}
            setSelectedProduct={setSelectedProduct}
            openModal={openModal}
          />
        )}

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

        {/* *** COURSES *** */}

        <div id="programs" className="seperator"></div>
        <div className={styles.header}>Programs</div>
        {courses && courses.map((c, i) => <Course course={c} key={i} />)}

        <div id="subscription" className="seperator"></div>
        <div className={styles.subscription_name}>Premium Subscription</div>
        <PremiumSubscription />
        <BenefitsTable />
        <div className={styles.subscriptionCta}>
          <div className="btn btn-primary mt1">Try 3 Days For Free</div>
          <div className={styles.subscription_monthly}>
            Billed Monthly. Cancel anytime.
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default Shop;
