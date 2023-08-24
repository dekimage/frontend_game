export const CONTENT_MAP = {
  ideas: { max: 3, color: "#bde0fe", single: "idea" },
  exercises: { max: 5, color: "#f4a261", single: "exercise" },
  stories: { max: 1, color: "#80ed99", single: "story" },
  casestudies: { max: 1, color: "#d4a373", single: "casestudy" },
  tips: { max: 3, color: "#766153", single: "tip" },
  metaphores: { max: 3, color: "#ecf39e", single: "metaphore" },
  experiments: { max: 2, color: "#f7ede2", single: "experiment" },
  expertopinions: { max: 3, color: "#e07a5f", single: "expert opinion" },
  quotes: { max: 5, color: "#f2cc8f", single: "quote" },
  questions: { max: 3, color: "#415a77", single: "question" },
};

export const SAVED_TYPES = {
  savedCasestudies: "casestudies",
  savedExercises: "exercises",
  savedExperiments: "experiments",
  savedIdeas: "ideas",
  savedMetaphors: "metaphores",
  savedQestions: "questions",
  savedQuotes: "quotes",
  savedStories: "stories",
  savedTips: "tips",
  savedExpertOpinions: "expertopinions",
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
    name: "Random",
    icon: "/streak.png",
    amount: 1,
  },
];

export const tabs = (programNotifications) => [
  { label: "program", count: -1 },
  { label: "content", count: -1 },
  { label: "progress", count: programNotifications || -1 },
];
