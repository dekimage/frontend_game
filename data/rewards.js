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

export const boxes = [
  {
    id: 1,
    name: "basic loot box",
    description: "contains 5 random cards from free set.",
    price_amount: 100,
    price_type: "stars",
    reward_amount: 1,
    drop_table: { common: 70, rare: 20, epic: 7, legendary: 3 },
  },
  {
    id: 2,
    name: "core loot box",
    description: "contains 5 random cards from free set.",
    price_amount: 5,
    price_type: "gems",
    reward_amount: 1,
    drop_table: { common: 70, rare: 20, epic: 7, legendary: 3 },
  },
  {
    id: 3,
    name: "premium loot box",
    description: "contains 5 random cards from premium set.",
    price_amount: 100,
    price_type: "stars",
    reward_amount: 1,
    drop_table: { common: 70, rare: 20, epic: 7, legendary: 3 },
  },
  {
    id: 4,
    name: "mega loot box",
    description: "contains 5 random cards from free set.",
    price_amount: 5,
    price_type: "gems",
    reward_amount: 1,
    drop_table: { common: 70, rare: 20, epic: 7, legendary: 3 },
  },
];

export const gems = [
  {
    id: 1,
    name: "handeful of gems",
    description: "contains x10 gems.",
    price_amount: 4.99,
    price_type: "dollar",
    reward_amount: 10,
  },
  {
    id: 2,
    name: "bunch of gems",
    description: "contains x30 gems.",
    price_amount: 13.99,
    price_type: "dollar",
    reward_amount: 30,
  },
  {
    id: 3,
    name: "pile of gems",
    description: "contains x50 gems.",
    price_amount: 24.99,
    price_type: "dollar",
    reward_amount: 50,
  },
  {
    id: 4,
    name: "mountain of gems",
    description: "contains x100 gems.",
    price_amount: 47.99,
    price_type: "dollar",
    reward_amount: 100,
  },
];
