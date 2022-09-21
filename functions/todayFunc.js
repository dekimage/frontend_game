import { objectiveCounterRewardsTable } from "../data/rewards";

export const joinObjectivesCounter = (
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

export const joinObjectives = (objectives, objectives_json) => {
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

export const filterObjectives = (objectives, time_type) => {
  return objectives.filter((obj) => obj.time_type === time_type);
};

export const calculateNotifications = (gql_data, store) => {
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
