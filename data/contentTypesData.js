// @CALC
export const maxProgressPerContentType = {
  ideas: 3,
  actions: 5,
  stories: 1,
  faq: 2,
  program: 3,
  casestudy: 1,
  tips: 3,
  metaphors: 3,
  experiments: 2,
  expertopinions: 3,
  quotes: 5,
  questions: 3,
};

// { label: "Social", count: store.notifications.artifacts || -1 },
export const rewardsMap = [
  {
    name: "Stars",
    icon: "/stars.png",
    amount: 50,
  },
  {
    name: "Xp",
    icon: "/xp.png",
    amount: 100,
  },
  {
    name: "Random",
    icon: "/streak.png",
    amount: 1,
  },
];

export const questMap = {
  ideas: {
    name: "Idea Quest",
  },
  actions: {
    name: "Action Quest",
  },
  stories: {
    name: "Story Quest",
  },
  program: {
    name: "Program Quest",
  },
  casestudy: {
    name: "Case Study Quest",
  },
  tips: {
    name: "Tips Quest",
  },
  faq: {
    name: "FAQ Quest",
  },
  metaphors: {
    name: "Metaphors Quest",
  },
  experiments: {
    name: "Experiments Quest",
  },
  expertopinions: {
    name: "Opinions Quest",
  },
  quotes: {
    name: "Quotes Quest",
  },
  questions: {
    name: "Questions Quest",
  },
};

export const mainTabs = [
  { label: "content", count: -1 },
  { label: "support", count: -1 },
  { label: "research", count: -1 },

  // { label: "social", count: -1 },
];

export const subTabsMap = {
  content: [
    { label: "ideas", count: -1 },
    { label: "actions", count: -1 },
    { label: "questions", count: -1 },
    { label: "program", count: -1 },
  ],
  support: [
    { label: "stories", count: -1 },
    { label: "metaphors", count: -1 },
    { label: "tips", count: -1 },
    { label: "faq", count: -1 },
  ],
  research: [
    { label: "quotes", count: -1 },
    { label: "experiments", count: -1 },
    { label: "expertopinions", count: -1 },
    { label: "casestudy", count: -1 },
  ],
};
