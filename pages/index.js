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
  collectLevelReward,
  achievementTest,
  claimObjective,
  developerModeApi,
  purchaseProduct,
  claimObjectiveCounter,
} from "../actions/action";
import styles from "../styles/Today.module.scss";
import RewardImage from "../components/RewardImage";
import ProgressBar from "../components/ProgressBar";

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
      // onClickOutside={() => !isCollected && setIsOpen(false)}
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

  const LevelRewardsHeader = ({
    xp,
    maxXp,
    level,
    rewards: { nextLevel, reward_type, amount },
  }) => {
    return (
      <Link href="/level-rewards">
        <div className={styles.levelHeader}>
          <div>
            <div>Profile {level} LVL</div>
          </div>
          <div className={styles.levelHeader_box}>
            {nextLevel} Level Reward
            <span className={styles.levelHeader_box__xpText}>
              {xp}/{maxXp} XP
            </span>
            <ProgressBar progress={10} max={20} />
          </div>
          <div>
            <RewardImage reward={reward_type} amount={amount} />
          </div>
        </div>
      </Link>
    );
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
    console.log(level);
    //NE VAKA - LOOP ZA OBVJEKTI MI TREBA
    // const maxXp =
    // return {
    //   xp,
    //   maxXp,
    //   level,
    //   rewards: { nextLevel, reward_type, amount },
    // }
  }

  return (
    <div className="background_dark">
      <Header />
      <div className="section">
        {/* <LevelRewardsHeader xp={store.user.xp} maxXp={2} /> */}
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
                <div className={styles.objectiveTabCounter}>
                  <div>4</div>
                </div>
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

        {(objectivesTabOpen === "daily" || objectivesTabOpen === "weekly") && (
          <div className={styles.objectivesHeadline}>
            <div className={styles.objectivesHeadline_text}>
              {objectivesTabOpen === "daily"
                ? "Today's Objectives"
                : "Weekly's Objectives"}
            </div>
            <div className={styles.tinyRewards}>
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
            <span>2/4</span>
          </div>
        )}

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
        <div className="devtoolbox">
          <div className="btn btn-dev" onClick={() => achievementTest()}>
            TEST ACHIEVEMENTS API
          </div>
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "reset")}
          >
            Reset User Data API
          </div>

          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Get Random Card
          </div>
          {/*===== COMMUNITY ANSWERS =======*/}
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Create Community Answer
          </div>
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Report Community Answer
          </div>
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Upvote/Downvote Community Answer
          </div>
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Change User Settings
          </div>
          {/*===== SHOP =======*/}
          <div
            className="btn btn-dev"
            onClick={() => purchaseProduct(dispatch, "gems", 1)}
          >
            Purchase Gems / ID
          </div>
          <div
            className="btn btn-dev"
            onClick={() => purchaseProduct(dispatch, "subscription")}
          >
            Purchase Subscripton
          </div>
          <div
            className="btn btn-dev"
            onClick={() => purchaseProduct(dispatch, "bundle", 1)}
          >
            Purchase Bundle / ID
          </div>
          {/*===== FRIENDS =======*/}
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Generate Share Buddy Link
          </div>
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Validate Account Create Reward Gems/card + Limit
          </div>
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Login with Oauth
          </div>
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Follow Friend / ID
          </div>
          {/*===== STREAKS =======*/}
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Update Daily Streak
          </div>
          <div
            className="btn btn-dev"
            onClick={() => developerModeApi(dispatch, "gainRandomCard")}
          >
            Claim Streak Reward
          </div>
        </div>

        <div>Results:</div>
        <div>{store && store.response}</div>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
