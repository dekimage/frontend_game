import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";
import cx from "classnames";

import Objective from "../components/Objective";
import ObjectiveCounter from "../components/ObjectiveCounter";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { objectiveCounterRewardsTable } from "../data/rewards";

import {
  levelUp,
  collectLevelReward,
  achievementTest,
  claimObjective,
  developerModeApi,
  claimObjectiveCounter,
} from "../actions/action";
import styles from "../styles/Today.module.scss";
import RewardImage from "../components/RewardImage";
// COMPONENTS
// import ProgressBar from "../components/ProgressBar/ProgressBar";

const GET_OBJECTIVES_QUERY = gql`
  {
    objectives {
      id
      name
      time_type
      requirement
      requirement_amount
      reward
      reward_amount
    }
  }
`;

const Home = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_OBJECTIVES_QUERY);
  const [objectivesTabOpen, setObjectivesTabOpen] = useState("daily");

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

  const filterObjectives = (objectives, time_type) => {
    return objectives.filter((obj) => obj.time_type === time_type);
  };

  const joinObjectives = (objectives, objectives_json) => {
    return objectives.map((obj) => {
      if (objectives_json[obj.id]) {
        return {
          ...obj,
          progress: objectives_json[obj.id].progress,
          isCollected: objectives_json[obj.id].isCollected,
        };
      }
      return obj;
    });
  };

  console.log(store.user);

  return (
    <div className="background_dark">
      <Header />
      <div className="section">
        <div>
          <div className={styles.objectiveTabsGrid}>
            <div
              className={cx(styles.objectiveTab, {
                [styles.active]: objectivesTabOpen == "daily",
              })}
              onClick={() => setObjectivesTabOpen("daily")}
            >
              <div className={styles.objectiveTab_text}>
                Daily <div className={styles.objectiveTabCounter}>4</div>
              </div>
            </div>
            <div
              className={cx(styles.objectiveTab, {
                [styles.active]: objectivesTabOpen == "weekly",
              })}
              onClick={() => setObjectivesTabOpen("weekly")}
            >
              <div className={styles.objectiveTab_text}>
                Weekly
                {/* <div className={styles.objectiveTabCounter}>4</div> */}
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
                {/* <div className={styles.objectiveTabCounter}>4</div> */}
              </div>
            </div>
          </div>
        </div>

        {/* MILESTONES */}
        <div className={styles.objectiveCounterGrid}>
          {data &&
            store.user.objectives_json &&
            Object.keys(store.user.objectives_json).length > 0 &&
            joinObjectivesCounter(
              store.user.objectives_counter || {},
              store.user.objectives_json,
              filterObjectives(data.objectives, objectivesTabOpen),
              objectivesTabOpen
            ).map((objCounter, i) => (
              <ObjectiveCounter
                objCounter={objCounter}
                dispatch={dispatch}
                key={i}
              />
            ))}
        </div>

        {data && (
          <div>
            {filterObjectives(
              joinObjectives(data.objectives, store.user.objectives_json || []),
              objectivesTabOpen
            ).map((obj, i) => (
              <Objective objective={obj} dispatch={dispatch} key={i} />
            ))}
          </div>
        )}

        {/* <button>
          <Link href="/user">
            <a>GO to User page</a>
          </Link>
        </button> */}
        <button onClick={() => levelUp(dispatch, 1, true)}>+1 XP</button>
        <button onClick={() => levelUp(dispatch, 1, false)}>-1 XP</button>
        <button onClick={() => achievementTest()}>TEST ACHIEVEMENTS API</button>
        <button onClick={() => developerModeApi(dispatch, "reset")}>
          Reset User Data API
        </button>
        <button onClick={() => developerModeApi(dispatch, "gainRandomCard")}>
          Get Random Card
        </button>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
