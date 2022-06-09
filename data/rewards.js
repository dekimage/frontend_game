export const staticRewards = {
  friends: [1, 2, 3, 4, 5],
  streaks: [1, 3, 5, 7, 14, 21, 36, 48, 66, 108],
  levels: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
  ],
};

export const levelRewards = [
  { level: 1, reward: "stars", qty: 25 },
  { level: 2, reward: "gems", qty: 2 },
  { level: 3, reward: "pack", qty: 1 },
  { level: 4, reward: "stars", qty: 30 },
  { level: 5, reward: "gems", qty: 3 },
];

export const objectiveCounterRewardsTable = {
  daily: {
    1: {
      reward_type: "stars",
      reward_quantity: 10,
    },
    2: {
      reward_type: "stars",
      reward_quantity: 15,
    },
    3: {
      reward_type: "stars",
      reward_quantity: 40,
    },
    4: {
      reward_type: "gems", // ?? type?
      reward_quantity: 1,
    },
  },
  weekly: {
    1: {
      reward_type: "stars",
      reward_quantity: 50,
    },
    2: {
      reward_type: "stars",
      reward_quantity: 75,
    },
    3: {
      reward_type: "stars",
      reward_quantity: 100,
    },
    4: {
      reward_type: "gems", // ?? type?
      reward_quantity: 3,
    },
  },
};
