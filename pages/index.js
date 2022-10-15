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
import {
  RewardLink,
  TutorialModal,
  EmptyCourseBox,
  CourseBox,
} from "../components/todayComp";

// *** FUNCTIONS ***
import { normalize } from "../utils/calculations";
import { joinObjectives } from "../functions/todayFunc";

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

  const objectivesData =
    gql_data &&
    joinObjectives(gql_data.objectives, store.user.objectives_json || []);

  useEffect(() => {
    if (store.user.tutorial_step > 0) {
      openModal();
    }
  }, [store.user]);

  return (
    <div className="background_dark">
      <Header />
      {/* TUTORIAL MODAL */}
      {store && store.user?.usercourses && gql_data && (
        <div>
          {/* WELCOME */}
          {/* <div className="section">
            <div className={styles.header}>
              Welcome back, {store.user.username}
            </div>
          </div> */}

          {/* CONTINUE YOUR PROGRAM */}
          <div className="section">
            <div className={styles.header}>Continue your Program</div>

            {store.user.usercourses.length > 0 ? (
              <CourseBox
                usercourse={
                  store.user.usercourses
                    .sort((a, b) => a.last_completed_day - b.last_completed_day)
                    .reverse()[0]
                }
              />
            ) : (
              <EmptyCourseBox />
            )}
          </div>

          {/* OBJECTIVES SECTION*/}
          <div className="section">
            <div className={styles.objectivesHeadline}>
              <div className={styles.objectivesHeadline_text}>Objectives</div>

              {/* FIXME: */}
              <span className={styles.objectivesHeadline_number}>2/4</span>
            </div>

            {gql_data && (
              <div>
                {objectivesData.map((obj, i) => (
                  <Objective objective={obj} dispatch={dispatch} key={i} />
                ))}
              </div>
            )}
          </div>

          {/* REWARDS SECTION */}
          <div className="section">
            <div className={styles.header}>Rewards</div>
            <RewardLink
              img={`${baseUrl}/trophy.png`}
              link={"/level-rewards"}
              text={"Level Rewards"}
              notification={store.notifications.levels}
            />
            <RewardLink
              img={`${baseUrl}/streak.png`}
              link={"/streak"}
              text={"Streak Rewards"}
              notification={store.notifications.streaks}
            />

            <RewardLink
              img={`${baseUrl}/gift.png`}
              link={"/buddies-rewards"}
              text={"Buddy Rewards"}
              notification={store.notifications.friends}
            />
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

      <NavBar />
    </div>
  );
};

export default Home;
