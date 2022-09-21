// @calc
export const static_levels = [
  { lvl: 1, required: 1 },
  { lvl: 2, required: 2 },
  { lvl: 3, required: 3 },
  { lvl: 4, required: 4 },
  { lvl: 5, required: 5 },
];

export const getMaxQuantity = (level) => {
  const data = {
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 10,
  };
  return data[level];
};
