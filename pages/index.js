// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Context } from "../context/store";
import cx from "classnames";
// import { calculateNotifications } from "../utils/calculations";

// *** COMPONENTS ***
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";

import Objective from "../components/Objective";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { TutorialModal } from "../components/todayComp";

import RewardsModal from "../components/RewardsModal";
import { RewardLink } from "../components/todayComp";

// *** FUNCTIONS ***
import { normalize } from "../utils/calculations";
import { joinObjectives } from "../functions/todayFunc";
import { resetUser } from "../actions/action";

// *** GQL ***
import { GET_OBJECTIVES_QUERY } from "../GQL/query";

// *** STYLES ***
import styles from "../styles/Today.module.scss";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const calculateNotifications = () => {
  return 2;
};

const Home = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_OBJECTIVES_QUERY);
  const gql_data = data && normalize(data);

  const { isShowing, openModal, closeModal } = useModal();

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

  const [objectivesTabOpen, setObjectivesTabOpen] = useState("daily");

  return (
    <div className="background_dark">
      <Header />
      <div className="headerSpace"></div>

      {/* TUTORIAL MODAL */}
      {store && store.user?.usercourses && gql_data && (
        <div>
          {/* WELCOME */}
          <div className="section">
            <div className={styles.header}>
              Welcome back, {store.user.username}
            </div>
            {/* <div
              className="btn btn-primary"
              onClick={() => resetUser(dispatch)}
            >
              Reset User
            </div> */}
          </div>

          {/* OBJECTIVES FILTERS */}

          {/* OBJECTIVES SECTION*/}
          <div className="section">
            <RewardLink
              img={`${baseUrl}/favorite.png`}
              link={"/"}
              text={"Favorites"}
              notification={store.notifications.levels}
            />
            <RewardLink
              img={`${baseUrl}/random.png`}
              link={"/random"}
              text={"Random"}
              notification={store.notifications.levels}
            />
            <RewardLink
              img={`${baseUrl}/streak.png`}
              link={"/recent"}
              text={"Recent"}
              notification={store.notifications.streaks}
            />
            <div className={styles.objectivesHeadline}>
              <div className="header">
                {/* {objectivesTabOpen}  */}
                Objectives
              </div>

              {/* FIXME: */}
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
            <div>
              <div className={styles.objectiveTabsGrid}>
                <div
                  className={cx(styles.objectiveTab, {
                    [styles.active]: objectivesTabOpen == "daily",
                  })}
                  onClick={() => setObjectivesTabOpen("daily")}
                >
                  <div className={styles.objectiveTab_text}>
                    Daily
                    {calculateNotifications(gql_data, store).daily > 0 && (
                      <div className={styles.objectiveTabCounter}>
                        {calculateNotifications(gql_data, store).daily}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={cx(styles.objectiveTab, {
                    [styles.active]: objectivesTabOpen == "weekly",
                  })}
                  onClick={() => setObjectivesTabOpen("weekly")}
                >
                  <div className={styles.objectiveTab_text}>
                    Weekly{" "}
                    {calculateNotifications(gql_data, store).weekly > 0 && (
                      <div className={styles.objectiveTabCounter}>
                        {calculateNotifications(gql_data, store).weekly}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {gql_data && (
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
            )}
          </div>
        </div>
      )}

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
