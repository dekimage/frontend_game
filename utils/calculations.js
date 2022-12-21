export function addZeroToInteger(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

export const getTimeDiff = (lastCollectedMS) => {
  const now = Date.now();
  const timeDiffSecs = Math.floor((now - lastCollectedMS) / 1000);
  const timeDiffMins = Math.floor(timeDiffSecs / 60);
  const timeDiffHours = Math.floor(timeDiffMins / 60);
  const timeDiffDays = Math.floor(timeDiffHours / 24);

  const timeDiff = {
    days: timeDiffDays,
    hours: timeDiffHours,
    minutes: timeDiffMins,
    seconds: timeDiffSecs,
  };
  return timeDiff;
};

export const msToTime = (duration) => {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
};
// NOTIFICATIONS CALCULATIONS FOR REDUX STORE
export const calcRewardReady = (
  staticRewards,
  currentCount,
  userCollection
) => {
  // @staticRewards = [1, 3, 5, 7, 14...] => streak points
  // @currentCount = highest_streak = 20
  // @userCollection = {"1": true, "2": true, "3": true}
  const availableArr = staticRewards.filter((r) => r <= currentCount);
  const notCollected = availableArr.filter((r) => !userCollection[r]);
  const notifCount = notCollected.length;
  return notifCount;
};
export const calcLevelRewards = (level, level_rewards, levels, is_premium) => {
  const availableArr = levels.filter((l) => l <= level);
  const filtered = availableArr.map((l) =>
    level_rewards.filter((el) => el.level === l)
  );

  const collectedArr = filtered.filter((r) => r.length > 0);
  let collected = 0;
  collectedArr.forEach((el) => {
    if (el.length === 1) {
      collected++;
    }
    if (el.length === 2) {
      collected = collected + 2;
    }
  });

  return is_premium
    ? filtered.length * 2 - collected
    : filtered.length - collected;
};

export const normalize = (data) => {
  const isObject = (data) =>
    Object.prototype.toString.call(data) === "[object Object]";
  const isArray = (data) =>
    Object.prototype.toString.call(data) === "[object Array]";

  const flatten = (data) => {
    if (!data.attributes) return data;

    return {
      id: data.id,
      ...data.attributes,
    };
  };

  if (isArray(data)) {
    return data.map((item) => normalize(item));
  }

  if (isObject(data)) {
    if (isArray(data.data)) {
      data = [...data.data];
    } else if (isObject(data.data)) {
      data = flatten({ ...data.data });
    } else if (data.data === null) {
      data = null;
    } else {
      data = flatten(data);
    }

    for (const key in data) {
      data[key] = normalize(data[key]);
    }

    return data;
  }

  return data;
};

export const getXpLimit = (level) => {
  return 100 + level * 10 * 1.6;
};
