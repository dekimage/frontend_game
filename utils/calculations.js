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
export const calcLevelRewards = (level, level_rewards, levels, isPremium) => {
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

  return isPremium
    ? filtered.length * 2 - collected
    : filtered.length - collected;
};

// REALM PROGRESS CALCULATIONS
export const calcRealmProgress = (usercards) => {
  let realmHash = {};
  usercards.forEach((uc) => {
    if (realmHash[uc.card.realm.name]) {
      realmHash[uc.card.realm.name].push(uc);
    } else {
      realmHash[uc.card.realm.name] = [uc];
    }
  });

  Object.keys(realmHash).map(function (key, index) {
    realmHash[key] = {
      completed: calcTotal(realmHash[key], "completed"),
      collected: calcTotal(realmHash[key], "collected"),
    };
  });

  return realmHash;
};

const calcLevelToQuantity = (level) => {
  if (level > 5) {
    return 100;
  }
  // @calc
  const table = {
    1: 0,
    2: 4,
    3: 6,
    4: 8,
    5: 10,
  };
  const quantity = table[level];
  return quantity;
};

export const calcTotal = (realmArr, type, isAllRealms = false) => {
  // @calc -> make these numbers env variable or fetch count from backend
  let total = 0;
  if (type === "completed") {
    realmArr.forEach((usercard) => {
      total = total + usercard[type];
    });
    const completedMax = isAllRealms ? 9 * 5 * 9 : 9 * 5;

    total = (total / completedMax) * 100;
  }
  if (type === "collected") {
    realmArr.forEach((usercard) => {
      total =
        total +
        (usercard.quantity +
          calcLevelToQuantity(usercard.level) +
          (usercard.isUnlocked ? 0 : 10));
    });
    const collectedMax = isAllRealms
      ? (10 + 2 + 4 + 6 + 8 + 10) * 9
      : 10 + 2 + 4 + 6 + 8 + 10;
    total = (total / collectedMax) * 100;
  }

  return Math.round(total);
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
