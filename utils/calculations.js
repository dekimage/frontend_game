export const isReadyToComplete = (timestamp) => {
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const currentTime = Date.now(); // Current timestamp in milliseconds

  // Calculate the time difference in milliseconds
  const timeDifference = currentTime - timestamp;

  // Check if 24 hours have passed since the timestamp
  return timeDifference >= twentyFourHours;
};

export const getTotalStepsInSlides = (slides) =>
  slides.reduce((total, slide) => {
    if (slide.action && slide.action.steps) {
      return total + slide.action.steps.length;
    }
    return total;
  }, 0);

export function generateRandomCode() {
  const length = 10;
  const characters = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

export function getNumberSuffix(number) {
  if (number >= 11 && number <= 13) {
    return "th";
  }

  const lastDigit = number % 10;

  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

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
  //init new collection
  let userCollectionFixed = userCollection || { 1: false };
  // @staticRewards = [1, 3, 5, 7, 14...] => streak points
  // @currentCount = highest_streak = 20
  // @userCollection = {"1": true, "2": true, "3": true}
  const availableArr = staticRewards.filter((r) => r <= currentCount);
  const notCollected = availableArr.filter((r) => !userCollectionFixed[r]);
  const notifCount = notCollected.length;
  return notifCount;
};

export const calcArtifactsReady = (artifacts, claimedArtifacts) => {
  if (!claimedArtifacts) {
    return 0;
  }
  const claimedArtifactsIds = claimedArtifacts.map((a) => a.id);
  const readyToClaimArtifacts = artifacts.filter(
    (a) => !claimedArtifactsIds.includes(a.id)
  ).length;
  return readyToClaimArtifacts;
};

export const calcLevelRewards = (
  level_rewards, // users json
  allLevelRewards, // all objects
  pro
) => {
  // console.log({ level_rewards, allLevelRewards, pro });
  if (!level_rewards) {
    return 0;
  }

  const claimedLevels = Object.keys(level_rewards).map((id) => parseInt(id));

  const readyToClaimLevels = allLevelRewards.filter(
    (alr) => !claimedLevels.includes(alr.id)
  );

  let notificationsCount;

  if (pro) {
    notificationsCount = readyToClaimLevels.length;
  } else {
    notificationsCount = readyToClaimLevels.filter((l) => !l.is_premium).length;
  }

  return notificationsCount;
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
