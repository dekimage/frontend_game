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

export const calculateNotifications = (gql_data, user) => {
  const allTasks = joinObjectives(
    gql_data.objectives,
    user.objectives_json || []
  ).filter((o) => !o.isCollected && o.progress >= o.requirement_amount);

  const notifications = {
    daily: filterObjectives(allTasks, "daily").length,
    weekly: filterObjectives(allTasks, "weekly").length,
  };
  return notifications;
};
