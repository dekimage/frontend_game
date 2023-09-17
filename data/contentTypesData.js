export const CONTENT_MAP = {
  ideas: { max: 3, color: "#bde0fe", single: "idea", plural: "ideas" },
  exercises: {
    max: 5,
    color: "#f4a261",
    single: "exercise",
    plural: "exercises",
  },
  stories: { max: 1, color: "#80ed99", single: "example", plural: "examples" }, // examples
  casestudies: {
    max: 1,
    color: "#d4a373",
    single: "casestudy",
    plural: "casestudies",
  },
  metaphores: {
    max: 3,
    color: "#ecf39e",
    single: "metaphore",
    plural: "metaphores",
  },
  questions: {
    max: 3,
    color: "#415a77",
    single: "question",
    plural: "questions",
  },
  // quotes: { max: 5, color: "#f2cc8f", single: "quote" },
  // tips: { max: 3, color: "#766153", single: "tip" },
  // experiments: { max: 2, color: "#f7ede2", single: "experiment" },
  // expertopinions: { max: 3, color: "#e07a5f", single: "expert opinion" },
};

export const SAVED_TYPES = {
  savedCasestudies: "casestudies",
  savedExercises: "exercises",
  savedIdeas: "ideas",
  savedMetaphors: "metaphores",
  savedQestions: "questions",
  savedStories: "stories",
};

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
    name: "Random Content",
    icon: "/legendary-cards.png",
    amount: 1,
  },
];

export const tabs = (programNotifications) => [
  { label: "program", count: -1 },
  { label: "content", count: -1 },
  { label: "progress", count: programNotifications || -1 },
];
