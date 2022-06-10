import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";
import cx from "classnames";
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";

import { getTimeDiff } from "../utils/calculations";

import { Activity } from "./profile";
import Objective from "../components/Objective";
import ObjectiveCounter from "../components/ObjectiveCounter";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

import { objectiveCounterRewardsTable } from "../data/rewards";
import { normalize } from "../utils/calculations";

import { claimObjectiveCounter } from "../actions/action";

import styles from "../styles/Today.module.scss";
import RewardImage from "../components/RewardImage";
import ProgressBar from "../components/ProgressBar";
import router from "next/router";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const kure = process.env.NEXT_PUBLIC_API_AWS;

const GET_OBJECTIVES_QUERY = gql`
  query {
    objectives {
      data {
        id
        attributes {
          name
          link
          time_type
          description
          requirement
          requirement_amount
          reward_type
          reward_amount
        }
      }
      meta {
        pagination {
          page
          pageSize
          total
          pageCount
        }
      }
    }
  }
`;

//export to component
const TinyReward = ({
  objCounter: {
    reward_type,
    reward_quantity,
    isCollected,
    isReadyToCollect,
    objectiveId,
    temporal_type,
  },
  dispatch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={cx(
        [styles.tinyReward],
        { [styles.collected]: isCollected },
        { [styles.ready]: isReadyToCollect && !isCollected }
      )}
      onClick={() => !isCollected && setIsOpen(!isOpen)}
    >
      {isOpen && (
        <div className={styles.tinyReward_loot}>
          <RewardImage reward={reward_type} amount={reward_quantity} />
          <div
            className={cx([styles.tinyReward_loot__button], {
              [styles.ready]: isReadyToCollect,
            })}
            onClick={() =>
              !isCollected &&
              isReadyToCollect &&
              claimObjectiveCounter(dispatch, objectiveId, temporal_type)
            }
          >
            Claim
          </div>
        </div>
      )}
      {isCollected ? <span>&#10003;</span> : "?"}
    </div>
  );
};

const Home = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_OBJECTIVES_QUERY);
  const [objectivesTabOpen, setObjectivesTabOpen] = useState("daily");

  const gql_data = data && normalize(data);

  const joinObjectivesCounter = (
    objectives_counter,
    objectives_json,
    objectives,
    temporal_type
  ) => {
    if (!objectives_json || !objectives) {
      return;
    }
    const objectivesIds = objectives.map((obj) => obj.id); // find only daily/weekly
    let joinedObjectives = [];
    for (const id in objectiveCounterRewardsTable[temporal_type]) {
      const isReadyToCollect =
        id <=
        Object.keys(objectives_json).filter(
          (id) => objectivesIds.includes(id) && objectives_json[id].isCollected
        ).length;
      const isCollected =
        objectives_counter[temporal_type] &&
        !!objectives_counter[temporal_type][id];
      joinedObjectives.push({
        ...objectiveCounterRewardsTable[temporal_type][id],
        isReadyToCollect,
        isCollected,
        objectiveId: id,
        temporal_type,
      });
    }
    return joinedObjectives;
  };

  const joinObjectives = (objectives, objectives_json) => {
    return objectives.map((obj) => {
      if (objectives_json[obj.id]) {
        if (obj.requirement === "login") {
          return {
            ...obj,
            progress: 1,
            isCollected: objectives_json[obj.id].isCollected,
          };
        }
        return {
          ...obj,
          progress: objectives_json[obj.id].progress,
          isCollected: objectives_json[obj.id].isCollected,
        };
      }

      return obj;
    });
  };

  const filterObjectives = (objectives, time_type) => {
    return objectives.filter((obj) => obj.time_type === time_type);
  };

  const static_levels = {
    1: { start: 0, end: 100 },
    2: { start: 101, end: 200 },
    3: { start: 201, end: 300 },
    4: { start: 301, end: 400 },
    5: { start: 401, end: 500 },
  };

  function convertXp(xp) {
    const level = Object.keys(static_levels).filter(
      (level) => level.start <= xp && level.end > xp
    );
    //NE VAKA - LOOP ZA OBVJEKTI MI TREBA
    // const maxXp =
    // return {
    //   xp,
    //   maxXp,
    //   level,
    //   rewards: { nextLevel, reward_type, amount },
    // }
  }

  const calculateNotifications = () => {
    const allTasks = joinObjectives(
      gql_data.objectives,
      store.user.objectives_json || []
    ).filter((o) => !o.isCollected && o.progress >= o.requirement_amount);

    const notifications = {
      daily: filterObjectives(allTasks, "daily").length,
      weekly: filterObjectives(allTasks, "weekly").length,
      achievements: filterObjectives(allTasks, "achievements").length,
    };
    return notifications;
  };

  const { isShowing, openModal, closeModal } = useModal();

  useEffect(() => {
    console.log(store);
    if (store.tutorial < 10) {
      openModal();
    }
    openModal();
  }, [store.user]);

  const tutorialSlides = [
    {
      title: `Welcome ${store.user.username}`,
      image:
        "https://backendactionise.s3.eu-west-1.amazonaws.com/just_do_it_554ead2616.png?updated_at=2022-06-03T12:39:22.558Z",
      content: "Let's explore Actionise together!",
      button: "Start",
    },
    {
      title: `Why Actionise?`,
      image:
        "https://backendactionise.s3.eu-west-1.amazonaws.com/tutorial_change_78980f7d25.png?updated_at=2022-06-10T14:42:05.164Z",
      content:
        "Our mission is to provide you with Ideas, Tools & Actions that will help you become the best version of yourself. ",
      button: "Next",
    },
    {
      title: `What's Inside?`,
      image:
        "https://backendactionise.s3.eu-west-1.amazonaws.com/tutorial_value_0b41c88c71.png?updated_at=2022-06-10T14:42:05.512Z",
      content: "Actionise contains:",
      content_2:
        "• 150 mini interactive lessons • 100 questions • 200 actions & tasks • 100 books worth of wisdom",
      button: "Next",
    },
    {
      title: `Let's Start`,
      image:
        "https://backendactionise.s3.eu-west-1.amazonaws.com/digital_declutter_fc71581fd2.png?updated_at=2022-06-04T10:10:04.811Z",
      content:
        "Your first task will be to complete the Tutorial Card, in which you will learn the 5 main concepts of Actionise!",
      button: "Let's Begin!",
    },
  ];

  const TutorialModal = ({}) => {
    const [store, dispatch] = useContext(Context);
    const [active, setActive] = useState(0);
    const slide = tutorialSlides[active];
    const nextSlide = () => {
      if (active + 1 === tutorialSlides.length) {
        router.push("/card/player/41");
      } else {
        setActive(active + 1);
      }
    };
    return (
      <div className={styles.tutorial}>
        <h1>{slide.title}</h1>
        <img src={slide.image} alt="" height="250px" className="mb1" />
        <div className={styles.tutorial_content}>
          {slide.content}
          <br />
          {slide.content_2 && slide.content_2}
        </div>
        <div className="btn btn-primary mu1" onClick={() => nextSlide()}>
          {slide.button}
        </div>
      </div>
    );
  };

  return (
    <div className="background_dark">
      <Header />
      {store && gql_data && (
        <div className="section">
          <Modal
            isShowing={isShowing}
            closeModal={closeModal}
            jsx={<TutorialModal closeModal={closeModal} />}
          />

          <div>
            <div className={styles.objectiveTabsGrid}>
              <div
                className={cx(styles.objectiveTab, {
                  [styles.active]: objectivesTabOpen == "daily",
                })}
                onClick={() => setObjectivesTabOpen("daily")}
              >
                <div className={styles.objectiveTab_text}>
                  Daily{" "}
                  {calculateNotifications().daily > 0 && (
                    <div className={styles.objectiveTabCounter}>
                      {calculateNotifications().daily}
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
                  {calculateNotifications().weekly > 0 && (
                    <div className={styles.objectiveTabCounter}>
                      {calculateNotifications().weekly}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={cx(styles.objectiveTab, {
                  [styles.active]: objectivesTabOpen == "achievements",
                })}
                onClick={() => setObjectivesTabOpen("achievements")}
              >
                <div className={styles.objectiveTab_text}>
                  Achievements
                  {calculateNotifications().achievements > 0 && (
                    <div className={styles.objectiveTabCounter}>
                      {calculateNotifications().achievements}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MILESTONES */}
          {/* <div className={styles.objectiveCounterGrid}>
          <div className={styles.objectiveCounterGrid_box}>
            {data &&
              store.user.objectives_json &&
              Object.keys(store.user.objectives_json).length > 0 &&
              joinObjectivesCounter(
                store.user.objectives_counter || {},
                store.user.objectives_json,
                filterObjectives(data.objectives, objectivesTabOpen),
                objectivesTabOpen
              ).map((objCounter, i) => (
                <TinyReward
                  objCounter={objCounter}
                  dispatch={dispatch}
                  key={i}
                />
              ))}
          </div>
          <div className={styles.progressBar}>
            <ProgressBar progress={2} max={4} />
          </div>
        </div> */}

          {/* "../public/objectiveRewardsCounter.png" */}

          {(objectivesTabOpen === "daily" ||
            objectivesTabOpen === "weekly") && (
            <div className={styles.objectivesHeadline}>
              <div className={styles.objectivesHeadline_text}>
                {objectivesTabOpen === "daily"
                  ? "Today's Objectives"
                  : "Weekly's Objectives"}
              </div>
              <div className={styles.tinyRewards}>
                {gql_data &&
                  store.user.objectives_json &&
                  Object.keys(store.user.objectives_json).length > 0 &&
                  joinObjectivesCounter(
                    store.user.objectives_counter || {},
                    store.user.objectives_json,
                    filterObjectives(gql_data.objectives, objectivesTabOpen),
                    objectivesTabOpen
                  ).map((objCounter, i) => (
                    <TinyReward
                      objCounter={objCounter}
                      dispatch={dispatch}
                      key={i}
                    />
                  ))}
              </div>
              <span>2/4</span>
            </div>
          )}

          {gql_data && (
            <div>
              {filterObjectives(
                joinObjectives(
                  gql_data.objectives,
                  store.user.objectives_json || []
                ),
                objectivesTabOpen
              ).map((obj, i) => (
                <Objective objective={obj} dispatch={dispatch} key={i} />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="section">
        <div className={styles.header}>Rewards</div>
        <Activity
          img={`${baseUrl}/streak.png`}
          link={"/streak"}
          text={"Streak Rewards"}
          notification={store.notifications.streaks}
        />

        <Activity
          img={`${baseUrl}/gift.png`}
          link={"/buddies-rewards"}
          text={"Buddy Rewards"}
          notification={store.notifications.friends}
        />

        <Activity
          img={`${baseUrl}/trophy.png`}
          link={"/level-rewards"}
          text={"Level Rewards"}
          notification={store.notifications.levels}
        />
      </div>
      <NavBar />
    </div>
  );
};

export default Home;
