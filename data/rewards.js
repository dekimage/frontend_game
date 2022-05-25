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
      reward_type: "gems",
      reward_quantity: 1,
    },
    4: {
      reward_type: "pack", // ?? type?
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
      reward_type: "gems",
      reward_quantity: 3,
    },
    4: {
      reward_type: "pack", // ?? type?
      reward_quantity: 1,
    },
  },
};
