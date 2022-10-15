import { useContext, useEffect, useState } from "react";
import cx from "classnames";
import { Context } from "../context/store";
import RewardImage from "../components/RewardImage";
import { tutorialSlides } from "../data/todayData";
import { claimObjectiveCounter, updateTutorial } from "../actions/action";
import Link from "next/link";
import styles from "../styles/Today.module.scss";

import { Course } from "../components/shopComps";
import { getIconType, NextContent } from "../pages/course/[id]";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const TinyReward = ({
  objCounter: {
    reward_type,
    reward_quantity,
    isCollected,
    isReadyToCollect,
    objectiveId,
    temporal_type,
  },
  dispatch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={cx(
        [styles.tinyReward],
        { [styles.collected]: isCollected },
        { [styles.ready]: isReadyToCollect && !isCollected }
      )}
      onClick={() => !isCollected && setIsOpen(!isOpen)}
    >
      {isOpen && (
        <div className={styles.tinyReward_loot}>
          <RewardImage reward={reward_type} amount={reward_quantity} />
          <div
            className={cx([styles.tinyReward_loot__button], {
              [styles.ready]: isReadyToCollect,
            })}
            onClick={() =>
              !isCollected &&
              isReadyToCollect &&
              claimObjectiveCounter(dispatch, objectiveId, temporal_type)
            }
          >
            Claim
          </div>
        </div>
      )}
      {isCollected ? <span>&#10003;</span> : "?"}
    </div>
  );
};

export const TutorialModal = ({}) => {
  const [store, dispatch] = useContext(Context);
  const [active, setActive] = useState(0);
  const slide = tutorialSlides(store.user.username)[active];

  const nextSlide = () => {
    if (active + 1 === tutorialSlides().length) {
      router.push("/card/player/41");
    } else {
      setActive(active + 1);
    }
  };
  return (
    <div className={styles.tutorial}>
      <h1>{slide.title}</h1>
      <img src={slide.image} alt="" height="250px" className="mb1" />
      <div className={styles.tutorial_content}>
        {slide.content}
        <br />
        {slide.content_2 && slide.content_2}
      </div>
      <div
        className="btn btn-primary"
        onClick={() => updateTutorial(dispatch, 0)}
      >
        Skip Tutorial
      </div>
      <div className="btn btn-primary mu1" onClick={() => nextSlide()}>
        {slide.button}
      </div>
    </div>
  );
};

export const RewardLink = ({ img, link, text, notification = 0 }) => {
  return (
    <Link href={link}>
      <div className={styles.activityBox}>
        {notification !== 0 && (
          <div className={styles.activityBox_notification}>{notification}</div>
        )}
        <div className={styles.activityBox_img}>
          <img src={img} height="25px" />
        </div>

        <div className={styles.activityBox_text}>{text}</div>
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </div>
    </Link>
  );
};

export const ProblemsBox = () => {
  return (
    <div
      className={styles.problemBox}
      style={{
        backgroundImage: `url(${baseUrl}/uploads/problems_807f73b57d.jfif?updated_at=2022-10-11T09:55:36.632Z)`,
      }}
    >
      <div className={styles.problemBox_blackScreen}>
        <div className={styles.problemBox_name}>
          What problems do you want to solve?
        </div>
        <Link href="/problems">
          <div className="btn btn-empty">
            <span className={styles.exploreProblemsBtn}>Explore Problems</span>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
        </Link>
      </div>
    </div>
  );
};

export const EmptyCourseBox = () => {
  return (
    <div
      className={styles.problemBox}
      style={{
        backgroundImage: `url(${baseUrl}/uploads/2022_09_19_15_46_00_general_Art_AI_Discord_4907a6303b.png?updated_at=2022-09-19T13:46:20.015Z`,
      }}
    >
      <div className={styles.problemBox_blackScreen}>
        <div className={styles.problemBox_name}>
          You have 0 programs started
        </div>
        <Link href="/shop">
          <div className="btn btn-empty">
            <span className={styles.exploreProblemsBtn}>Explore Programs</span>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
        </Link>
      </div>
    </div>
  );
};

export const CourseBox = ({ usercourse }) => {
  const lastContent =
    usercourse.course.days[usercourse.last_completed_day - 1].contents[
      usercourse.last_completed_content - 1
    ];

  const percentage = (
    (usercourse.last_completed_day / usercourse.course.course_details.days) *
    100
  ).toFixed(1);

  return (
    <div className={styles.courseBox}>
      <div
        className={styles.courseBox_header}
        style={{
          backgroundImage: `url(${baseUrl}${usercourse.course.image.url})`,
        }}
      >
        <div>
          <div className={styles.courseBox_name}>{usercourse.course.name}</div>
          <div className={styles.courseBox_progress}>
            {usercourse.last_completed_day}/
            {usercourse.course.course_details.days} Days
          </div>
        </div>

        <div className={styles.progressCircle}>
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={{
              text: {
                fill: "#c9ff75",
                fontSize: "24px",
                fontWeight: "700",
              },
              path: {
                stroke: "#3dbc4a",
              },
            }}
          />
        </div>
      </div>
      <NextContent
        title={lastContent.title}
        duration={lastContent.duration}
        icon={getIconType(lastContent.type).icon}
        course={usercourse.course}
      />
    </div>
  );
};
