// *** REACT ***
import { useEffect, useState, useMemo } from "react";

// *** COMPONENTS ***
import Countdown from "@/components/Countdown";
import Header from "@/components/Header";
import Modal from "@/components/reusable/Modal";
import NavBar from "@/components/NavBar";
import Objective from "@/components/Objective";
import RewardsModal from "@/components/RewardsModal";
import { Tabs } from "@/components/reusable/Tabs";
import { TutorialModal } from "@/components/Modals/TutorialModal";
import RewardLinkSection from "@/components/Today/RewardLinkSection";

// *** GQL ***
import { GET_OBJECTIVES_QUERY } from "@/GQL/query";

// *** ACTIONS ***
import { acceptReferral, resetUser } from "@/actions/action";

// *** FUNCTIONS ***
import { calculateNotifications, joinObjectives } from "@/functions/todayFunc";

// *** STYLES ***
import styles from "@/styles/Today.module.scss";

// *** HOOKS ***
import useModal from "@/hooks/useModal";
import { withUser } from "@/Hoc/withUser";

const Home = ({ user, data, dispatch, store }) => {
  const { isShowing, openModal, closeModal } = useModal();

  const [objectivesTabOpen, setObjectivesTabOpen] = useState("daily");
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    if (user.tutorial_step > 0) {
      openModal(dispatch);
    }
  }, [user]);

  const objectivesData = useMemo(
    () => joinObjectives(data.objectives, user.objectives_json || []),
    [data.objectives, user.objectives_json]
  );

  const notif = calculateNotifications(data, user);

  const tabsData = [
    { label: "daily", count: notif?.daily || -1 },
    { label: "weekly", count: notif?.weekly || -1 },
  ];

  const filteredObjectives = objectivesData.filter(
    (o) => o.time_type === objectivesTabOpen
  );
  const completedObjectives = filteredObjectives.filter((o) => o.isCollected);
  const notCompletedObjectives = filteredObjectives.filter(
    (o) => !o.isCollected
  );
  const totalObjetivesCount = filteredObjectives.length;

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
              <div
                onClick={() => resetUser(dispatch)}
                className="btn btn-primary"
              >
                TEST
              </div>
              <div className="header">Objectives</div>

              <span className={styles.objectivesHeadline_number}>
                {completedObjectives.length}/{totalObjetivesCount}
              </span>
            </div>
          </div>
          <div className="section_container">
            <Tabs
              tabState={objectivesTabOpen}
              setTab={setObjectivesTabOpen}
              tabs={tabsData}
            />
            <Countdown tab={objectivesTabOpen} isObjectives />
          </div>

          <div className="section" style={{ paddingTop: 0 }}>
            <div>
              {notCompletedObjectives.map((obj) => (
                <Objective
                  objective={obj}
                  dispatch={dispatch}
                  isUserPremium={user.is_subscribed}
                  key={obj.id}
                />
              ))}
            </div>
            {completedObjectives.length > 0 && (
              <div
                className={styles.showCompletedBtn}
                onClick={() => setShowCompleted(!showCompleted)}
              >
                <div className="mr5">
                  {showCompleted ? "Hide Completed" : "Show Completed"}
                </div>
                {showCompleted ? (
                  <ion-icon name="chevron-up-outline"></ion-icon>
                ) : (
                  <ion-icon name="chevron-down-outline"></ion-icon>
                )}
              </div>
            )}

            {notCompletedObjectives.length == 0 && (
              <div className="pt1 pb1">
                <div className="header">You are done for today!</div>
              </div>
            )}

            {showCompleted &&
              completedObjectives.map((obj) => (
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
