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
  TutorialModal,
  ProblemsBox,
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

{
  /* "https://backendactionise.s3.eu-west-1.amazonaws.com/tutorial_dailyprogress_bf72cd27c2.png?updated_at=2022-06-10T15:03:24.932Z"*/
}

const Home = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_OBJECTIVES_QUERY);
  const gql_data = data && normalize(data);

  const { isShowing, openModal, closeModal } = useModal();

  const objectivesData =
    gql_data &&
    joinObjectives(gql_data.objectives, store.user.objectives_json || []);

  useEffect(() => {
    //TODO: FIX TUTORIAL
    if (store.tutorial < 10) {
      openModal();
    }
    openModal();
  }, [store.user]);

  return (
    <div className="background_dark">
      <Header />
      {store && store.user?.usercourses && gql_data && (
        <div>
          {store?.tutorialModal && (
            <Modal
              isShowing={isShowing}
              closeModal={closeModal}
              jsx={<TutorialModal closeModal={closeModal} />}
            />
          )}

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

          <div className="section">
            <div className={styles.header}>Problems</div>
            <ProblemsBox />
          </div>
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Home;
