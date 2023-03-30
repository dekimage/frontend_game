// *** REACT ***
import { useEffect, useState, useMemo } from "react";

// *** COMPONENTS ***
import Countdown from "../components/Countdown";
import Header from "../components/Header";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import Objective from "../components/Objective";
import { RewardLink } from "../components/todayComp";
import RewardsModal from "../components/RewardsModal";
import { Tabs } from "../components/profileComps";
import { TutorialModal } from "../components/todayComp";
import RewardLinkSection from "../components/Today/RewardLinkSection";

// *** GQL ***
import { GET_OBJECTIVES_QUERY } from "../GQL/query";

// *** ACTIONS ***
import { acceptReferral } from "../actions/action";

// *** FUNCTIONS ***
import { calculateNotifications, joinObjectives } from "../functions/todayFunc";

// *** STYLES ***
import styles from "../styles/Today.module.scss";

// *** HOOKS ***
import useModal from "../hooks/useModal";
import { withUser } from "../Hoc/withUser";

const Home = ({ user, data, dispatch, store }) => {
  const { isShowing, openModal, closeModal } = useModal();

  const [objectivesTabOpen, setObjectivesTabOpen] = useState("daily");

  useEffect(() => {
    if (user.tutorial_step > 0) {
      openModal(dispatch);
    }
  }, [user]);

  const objectivesData = useMemo(
    () => joinObjectives(data.objectives, user.objectives_json || []),
    [data.objectives, user.objectives_json]
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
                .map((obj) => (
                  <Objective
                    objective={obj}
                    dispatch={dispatch}
                    isUserPremium={user.is_subscribed}
                    key={obj.id}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <RewardLinkSection />

      {user.tutorial_step > 0 && (
        <Modal
          isShowing={isShowing}
          closeModal={closeModal}
          jsx={<TutorialModal closeModal={closeModal} />}
        />
      )}

      <Modal
        isShowing={store.rewardsModal?.isOpen}
        closeModal={closeModal}
        showCloseButton={false}
        jsx={<RewardsModal />}
        isSmall
      />
      <NavBar />
    </div>
  );
};

export default withUser(Home, GET_OBJECTIVES_QUERY);
