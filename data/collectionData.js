const sortByRealms = [
  "Health",
  "Energy",
  "Minimalism",
  "Mindfulness",
  "Character",
  "Negative patterns",
  "Productivity",
  "Learning",
  "Big picture",
];
const sortByRarity = ["common", "rare", "epic", "legendary"];
const sortByType = ["Free", "Premium", "Special"];
const sortByLevel = [1, 2, 3];
const sortByCompleted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const sortSettings = [
  { label: "realm", sortBy: sortByRealms },
  { label: "rarity", sortBy: sortByRarity },
  { label: "type", sortBy: sortByType },
  { label: "level", sortBy: sortByLevel },
  { label: "completed", sortBy: sortByCompleted },
];
