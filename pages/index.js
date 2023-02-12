// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Context } from "../context/store";
import cx from "classnames";

// *** COMPONENTS ***
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";
import Timer from "../components/reusable/Timer";

import Objective from "../components/Objective";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { TutorialModal } from "../components/todayComp";

import { Tabs } from "../components/profileComps";

import RewardsModal from "../components/RewardsModal";
import EnergyModal from "../components/EnergyModal";

import { RewardLink } from "../components/todayComp";

// *** FUNCTIONS ***
import { normalize } from "../utils/calculations";
import { joinObjectives, calculateNotifications } from "../functions/todayFunc";
import {
  resetUser,
  acceptReferral,
  fetchUser,
  getRandomCard,
} from "../actions/action";

// *** GQL ***
import { GET_OBJECTIVES_QUERY } from "../GQL/query";

// *** STYLES ***
import styles from "../styles/Today.module.scss";
import Countdown from "../components/Countdown";

import { withUser } from "../Hoc/withUser";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Home = (props) => {
  const { user, data, dispatch, store } = props;
  const { isShowing, openModal, closeModal } = useModal();

  const [objectivesTabOpen, setObjectivesTabOpen] = useState("daily");

  useEffect(() => {
    getRandomCard(dispatch);
  }, []);

  useEffect(() => {
    if (user.tutorial_step > 0) {
      openModal(dispatch);
    }
  }, [user]);

  const objectivesData = joinObjectives(
    data.objectives,
    user.objectives_json || []
  );

  const getCompletedObjectivesCount = (objectivesData, openTab) => {
    return objectivesData.filter(
      (o) => o.time_type === openTab && o.isCollected
    ).length;
  };

  const notif = calculateNotifications(data, user);

  const tabsData = [
    { label: "daily", count: notif?.daily || -1 },
    { label: "weekly", count: notif?.weekly || -1 },
  ];

  return (
    <div className="background_dark">
      <Header />
      <div className="headerSpace"></div>

      <div>
        <div>
          {!user.is_referral_accepted && user.shared_by?.id && (
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
                Claim 400
                <img
                  height="18px"
                  src={`${baseUrl}/stars.png`}
                  className="ml5"
                />
              </div>
            </div>
          )}
          <div
            className="btn btn-primary"
            onClick={() => dispatch({ type: "OPEN_ENERGY_MODAL" })}
          >
            Open Energy Modal test
          </div>
          <div className="section">
            <div className={styles.objectivesHeadline}>
              <div className="header">Objectives</div>

              <span className={styles.objectivesHeadline_number}>
                {getCompletedObjectivesCount(objectivesData, objectivesTabOpen)}
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

          <Countdown tab={objectivesTabOpen} isObjectives />

          <div className="section" style={{ paddingTop: 0 }}>
            <div>
              {objectivesData
                .filter((o) => o.time_type === objectivesTabOpen)
                .map((obj, i) => (
                  <Objective
                    objective={obj}
                    dispatch={dispatch}
                    isUserPremium={user.is_subscribed}
                    key={i}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

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

        <RewardLink
          img={`${baseUrl}/energy.png`}
          link={"/open-today"}
          text={"Open Today"}
        />
      </div>
      {user.tutorial_step > 0 && (
        <Modal
          isShowing={isShowing}
          closeModal={closeModal}
          jsx={<TutorialModal closeModal={closeModal} />}
        />
      )}
      <Modal
        isShowing={store.energyModal}
        closeModal={() => dispatch({ type: "OPEN_ENERGY_MODAL" })}
        jsx={<EnergyModal />}
        isSmall
      />
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

// export default Home;
export default withUser(Home, GET_OBJECTIVES_QUERY);

{
  /* WELCOME */
}
{
  /* <div className="section"> */
}
{
  /* <div className={styles.header}>
              Welcome back, {user.username}
            </div> */
}
{
  /* <div
              className="btn btn-primary"
              onClick={() => resetUser(dispatch)}
            >
              Reset User
            </div> */
}
{
  /* </div> */
}
