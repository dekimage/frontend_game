// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Context } from "../context/store";
import cx from "classnames";

// *** COMPONENTS ***
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";

import Objective from "../components/Objective";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { TutorialModal } from "../components/todayComp";

import { Tabs } from "../components/profileComps";

import RewardsModal from "../components/RewardsModal";
import { RewardLink } from "../components/todayComp";

// *** FUNCTIONS ***
import { normalize } from "../utils/calculations";
import { joinObjectives, calculateNotifications } from "../functions/todayFunc";
import { resetUser, acceptReferral } from "../actions/action";

// *** GQL ***
import { GET_OBJECTIVES_QUERY } from "../GQL/query";

// *** STYLES ***
import styles from "../styles/Today.module.scss";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Home = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_OBJECTIVES_QUERY);
  const gql_data = data && normalize(data);

  const { isShowing, openModal, closeModal } = useModal();
  const [tab, setTab] = useState("Daily");

  const objectivesData =
    gql_data &&
    joinObjectives(gql_data.objectives, store.user.objectives_json || []);

  const getCompletedObjectivesCount = (objectivesData, openTab) => {
    return objectivesData.filter(
      (o) => o.time_type === openTab && o.isCollected
    ).length;
  };

  useEffect(() => {
    if (store.user.tutorial_step > 0) {
      openModal();
    }
  }, [store.user]);

  const notif =
    gql_data && store.user && calculateNotifications(gql_data, store);

  const tabsData = [
    { label: "daily", count: notif?.daily || -1 },
    { label: "weekly", count: notif?.weekly || -1 },
  ];

  const [objectivesTabOpen, setObjectivesTabOpen] = useState("daily");

  console.log(111, gql_data);

  return (
    <div className="background_dark">
      <Header />
      <div className="headerSpace"></div>

      {/* TUTORIAL MODAL */}
      {store && store.user && gql_data && (
        <div>
          {/* WELCOME */}
          {/* <div className="section"> */}
          {/* <div className={styles.header}>
              Welcome back, {store.user.username}
            </div> */}
          {/* <div
              className="btn btn-primary"
              onClick={() => resetUser(dispatch)}
            >
              Reset User
            </div> */}
          {/* </div> */}

          {/* OBJECTIVES SECTION*/}
          <div>
            {!store.user.is_referral_accepted && (
              <div className={styles.acceptReferralBox}>
                <div className="header">Welcome Gift</div>
                <div className="pb1 pt1">
                  Gain 400 <img height="16px" src={`${baseUrl}/stars.png`} />{" "}
                  because a buddy shared you an invite
                </div>
                <div
                  className="btn btn-action"
                  onClick={() => acceptReferral(dispatch)}
                >
                  Claim 400{" "}
                  <img
                    height="18px"
                    src={`${baseUrl}/stars.png`}
                    className="ml5"
                  />
                </div>
              </div>
            )}
            <div className="section">
              <div className={styles.objectivesHeadline}>
                <div className="header">Objectives</div>

                <span className={styles.objectivesHeadline_number}>
                  {getCompletedObjectivesCount(
                    objectivesData,
                    objectivesTabOpen
                  )}
                  /
                  {
                    objectivesData.filter(
                      (o) => o.time_type === objectivesTabOpen
                    ).length
                  }
                </span>
              </div>
            </div>
            <div>
              <Tabs
                tabState={objectivesTabOpen}
                setTab={setObjectivesTabOpen}
                tabs={tabsData}
              />
            </div>

            {gql_data && (
              <div className="section">
                <div>
                  {objectivesData
                    .filter((o) => o.time_type === objectivesTabOpen)
                    .map((obj, i) => (
                      <Objective
                        objective={obj}
                        dispatch={dispatch}
                        isUserPremium={store.user.is_subscribed}
                        key={i}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="section">
        <RewardLink
          img={`${baseUrl}/favorite.png`}
          link={"/favorites"}
          text={"Favorites"}
        />

        <RewardLink
          img={`${baseUrl}/streak.png`}
          link={"/recent"}
          text={"Recent"}
        />
      </div>

      {store?.user?.tutorial_step > 0 && (
        <Modal
          isShowing={isShowing}
          closeModal={closeModal}
          jsx={<TutorialModal closeModal={closeModal} />}
        />
      )}

      <Modal
        isShowing={store.rewardsModal.isOpen}
        closeModal={closeModal}
        showCloseButton={false}
        jsx={<RewardsModal />}
        isSmall
      />

      <NavBar />
    </div>
  );
};

export default Home;
