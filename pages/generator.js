import React, { useState } from "react";
import styles from "../styles/generator.module.scss";

const data = {
  arms: [
    "Shoulder taps",
    "Burpees",
    "Push-ups",
    "Pike push-ups",
    "Triceps dip",
    "Mountain to cobra",
    "Bear Crawl Kick Through",
    "Bicep curls",
    "Hammer curls",
    "Overhead tricep extensions",
    "Skull crushers",
    "Close-grip bench press",
    "Inverted rows",
    "Lateral raises",
    "Front raises",
    "Shoulder press",
    "Upright rows",
    "Dumbbell flyes",
    "Dumbbell pullovers",
    "Bear walk",
    "Hand walkout",
    "Triceps extensions",
    "Plank walking",
    "Reverse fly",
  ],
  abs: [
    "Crunches",
    "Reverse crunches",
    "Bicycle crunches",
    "Plank",
    "Side plank",
    "Russian twist",
    "Leg raises",
    "Flutter kicks",
    "Scissor kicks",
    "Mountain climbers",
    "V-ups",
    "L-sit hold",
    "Seated knee tucks",
    "Boat pose",
    "Side bends",
    "Hollow body hold",
    "Sit-ups",
    "Windshield wipers",
    "Spiderman plank",
    "Hanging knee raises",
    "High knees/kicks",
    "Jumping jacks",
    "Burpees",
    "X+Tuck jumps",
    "Single arm single leg plank",
  ],
  legs: [
    "Squats",
    "Lunges",
    "Deadlifts",
    "Bulgarian split squats",
    "Glute bridges",
    "Step-ups",
    "Calf raises",
    "Leg presses",
    "Box jumps",
    "Wall sits",
    "Leg extensions",
    "Leg curls",
    "Sumo squats",
    "Hip thrusts",
    "Single-leg deadlifts",
    "Goblet squats",
    "Side lunges",
    "Fire hydrants",
    "Donkey kicks",
    "Jump squats",
  ],
  back: [
    "Spiderman",
    "Lat pulldowns",
    "Seated rows",
    "One-arm dumbbell rows",
    "Barbell rows",
    "Renegade rows",
    "Back extensions",
    "Deadlifts",
    "Good mornings",
    "Superman hold",
    "Kettlebell swings",
    "Scapular retractions (wall)",
  ],
};

const frequencies = ["x10", "x20", "x30", "30s", "45s", "60s"];

const Exercise = ({ name }) => {
  return (
    <div className={styles.exercise}>
      <div className={styles.exerciseName}>{name}</div>
    </div>
  );
};

const Frequency = ({ value }) => {
  return (
    <div className={styles.frequency}>
      <div className={styles.frequencyValue}>{value}</div>
    </div>
  );
};

const PlayRandomButton = ({ handlePlayRandom }) => {
  return (
    <button className={styles.playRandomButton} onClick={handlePlayRandom}>
      Play Random
    </button>
  );
};

const ExerciseList = ({ exercises }) => {
  return (
    <div className={styles.exerciseList}>
      {exercises.map((exercise, index) => (
        <Exercise key={index} name={exercise} />
      ))}
    </div>
  );
};

const FrequencyList = ({ frequencies }) => {
  return (
    <div className={styles.frequencyList}>
      {frequencies.map((frequency, index) => (
        <Frequency key={index} value={frequency} />
      ))}
    </div>
  );
};

const Workout = ({ exercise, frequency }) => {
  return (
    <div className={styles.workout}>
      <Exercise name={exercise} />
      <div className={styles.plus}>+</div>
      <Frequency value={frequency} />
    </div>
  );
};

const ExerciseSelector = ({ data, handleSelection }) => {
  const options = Object.keys(data);

  return (
    <select className={styles.select} onChange={handleSelection}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const RandomWorkoutGenerator = () => {
  const [selectedPart, setSelectedPart] = useState(Object.keys(data)[0]);
  const [activeExercises, setActiveExercises] = useState(data[selectedPart]);
  const [activeFrequency, setActiveFrequency] = useState(frequencies[0]);
  const [randomExercise, setRandomExercise] = useState("");

  const handleSelection = (event) => {
    setSelectedPart(event.target.value);
    setActiveExercises(data[event.target.value]);
  };

  const handlePlayRandom = () => {
    const randomExercise =
      activeExercises[Math.floor(Math.random() * activeExercises.length)];
    const randomFrequency =
      frequencies[Math.floor(Math.random() * frequencies.length)];

    setActiveFrequency(randomFrequency);
    setRandomExercise(randomExercise);
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectWrapper}>
        <ExerciseSelector data={data} handleSelection={handleSelection} />
      </div>
      <div className={styles.contentWrapper}>
        <ExerciseList exercises={activeExercises} />
        <FrequencyList frequencies={frequencies} />
      </div>
      <PlayRandomButton handlePlayRandom={handlePlayRandom} />
      <div className={styles.workoutWrapper}>
        <Workout exercise={randomExercise} frequency={activeFrequency} />
      </div>
    </div>
  );
};

export default RandomWorkoutGenerator;
