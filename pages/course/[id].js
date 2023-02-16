import {
  ActionsWrapper,
  BasicActionsWrapper,
  CardCtaFooter,
  CreateActionModal,
  FavoriteButton,
  IdeaPlayer,
  LevelButtons,
  PlayCta,
  Title,
  UpgradeButton,
} from "../../components/cardPageComps";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import _, { forEach } from "lodash";
import { useContext, useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";

import { BackButton } from "../../components/reusableUI";
import { Context } from "../../context/store";
import { GET_COURSE_ID } from "../../GQL/query";
import Link from "next/link";
import ProgressBar from "../../components/ProgressBar";
import { Rating } from "../../components/Rating";
import ReactMarkdown from "react-markdown";
import { Tabs } from "../../components/Tabs";
import cx from "classnames";
import iconAction from "../../assets/progress-collection-dark.svg";
import iconCheck from "../../assets/checkmark.svg";
import iconClock from "../../assets/iconClock.svg";
import iconConcept from "../../assets/progress-play-dark.svg";
import iconLock from "../../assets/lock-white.svg";
import iconMessages from "../../assets/iconMessages.svg";
import iconPlay from "../../assets/progress-collection-dark.svg";
import iconQuestion from "../../assets/question.svg";
import iconTasks from "../../assets/iconTasks.svg";
import { normalize } from "../../utils/calculations";
import styles from "../../styles/Course.module.scss";
import { useRouter } from "next/router";

const feUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const countTasks = (content) =>
  content?.action?.steps.filter((item) => item.task).length;
const countMessages = (input) => input.split("\n\n").length;

// STATIC DATA
const links = [
  {
    label: "Overview",
    href: "#overview",
  },
  {
    label: "Curriculum",
    href: "#curriculum",
  },
  {
    label: "Reviews",
    href: "#reviews",
  },
];

const CourseSales = ({ course }) => {
  return (
    <div className="section">
      <BackButton routeDynamic={""} routeStatic={""} isBack />
      <div className={styles.image}>
        <img src={`${baseUrl}${course.image.url}`} width="100%" />
      </div>
      <div className={styles.name}>{course.name}</div>
      <div className={styles.description}>{course.description}</div>
      <div className={styles.shortRating}>
        <span className="mr25">{course.rating}</span>
        <Rating course={course} />
      </div>
      <div className={styles.ratingNumber}>
        ({course.rating_amount} ratings) {course.students} students
      </div>
      <div className={styles.smallText}>
        <img src={`${baseUrl}/language.png`} height="14px" className="mr5" />
        English
      </div>
      <div className={styles.smallText}>
        <img src={`${baseUrl}/date.png`} height="14px" className="mr5" />
        Last updated {course.updatedAt.slice(0, 7)}
      </div>
      <div className={styles.price}>
        ${course.price}
        {!!course.discount && (
          <div className={styles.fullPrice}>${course.full_price}</div>
        )}
      </div>
      {!!course.discount && (
        <div className={styles.discount}>
          <img src={`${baseUrl}/timer.png`} height="14px" /> {course.discount}%
          OFF - 12h left at this price!
        </div>
      )}

      {/* <Timer /> */}
      <div className="btn btn-action btn-stretch mt1">Buy Now</div>
      <div className={styles.moneyback}>30 Day Money-Back-Guarantee</div>
      <div className="flex_center">
        <div className={styles.share}>
          <img src={`${baseUrl}/trophy.png`} height="14px" className="mr25" />
          Share
        </div>
        <div className={styles.share}>
          <img src={`${baseUrl}/gift.png`} height="14px" className="mr25" />
          Gift this course
        </div>
      </div>
      <Tabs links={links} />
      {/* <BrandsTrust /> */}
      <div id="overview"></div>
      <SalesPoints name="What you'll learn" text={course.what_you_learn} />
      <SalesPoints name="Who this course is for" text={course.who_is_for} />
      <SalesPoints name="Requirements" text={course.requirements} />
      <SalesPoints
        name="What you'll complete"
        text={course.what_you_complete}
      />

      <div className={styles.salesName}>Course Details</div>

      <div className={styles.details}>
        <div className={styles.detailsItem}>
          <img src={`${baseUrl}/trophy.png`} height="14px" className="mr25" />{" "}
          Total Length: {course.course_details.duration} hours
        </div>
        <div className={styles.detailsItem}>
          <img src={`${baseUrl}/trophy.png`} height="14px" className="mr25" />
          Actions: {course.course_details.actions}
        </div>
        <div className={styles.detailsItem}>
          <img src={`${baseUrl}/trophy.png`} height="14px" className="mr25" />
          Concepts: {course.course_details.concepts}
        </div>
        <div className={styles.detailsItem}>
          <img src={`${baseUrl}/trophy.png`} height="14px" className="mr25" />
          Questions: {course.course_details.questions}
        </div>
      </div>

      <div id="curriculum" className={styles.name}>
        Curriculum
      </div>
      <Curriculum days={course.days} />
      {/* <CourseStats /> */}
      {/* <StudentFeedback /> */}
      {/* <Reviews /> */}
      {/* <FixedCta /> */}
    </div>
  );
};

const ContentStat = ({ icon, amount, label }) => {
  return (
    <div className={styles.contentStat}>
      <div className={styles.contentStatAmount}>
        <img src={icon} height="12px" alt="" />
      </div>
      <div className={styles.contentStatAmount}>
        {amount} {label}
      </div>
      {/* <div className={styles.contentStatAmount}>{label}</div> */}
    </div>
  );
};

const ContentComponent = ({ content, cardId, isCompleted, isLast, index }) => {
  const contentStats =
    content.type == "action"
      ? [
          { icon: iconClock, amount: content.duration, label: "min" },
          {
            icon: iconTasks,
            amount: countTasks(content),
            label: "tasks",
          },
        ]
      : [
          { icon: iconClock, amount: content.duration, label: "min" },
          {
            icon: iconMessages,
            amount: countMessages(content.storyline),
            label: "messages ",
          },
        ];

  return (
    <div className={styles.content}>
      <div
        className={`${styles.contentCounter} ${
          isCompleted && styles.completed
        }`}
      >
        {!isLast && <div className={styles.contentDottedBorder}></div>}
        {isCompleted ? (
          <img src={iconCheck} alt="" height="20px" />
        ) : (
          <div>{index}</div>
        )}
      </div>
      <div className={styles.contentBox}>
        <div className={styles.contentLeftBox}>
          <div className="flex_start">
            <div
              className={`${styles.contentTag} ${
                content.type == "action" && styles.action
              }`}
            >
              {content.type}
            </div>
            {isCompleted && (
              <div className={`${styles.contentTag} ${styles.completed}`}>
                Completed
              </div>
            )}
          </div>

          <div className={styles.contentTitle}>{content.title}</div>
          <div className={styles.contentFooter}>
            {contentStats.map((cs, i) => (
              <ContentStat
                icon={cs.icon}
                amount={cs.amount}
                label={cs.label}
                key={i}
              />
            ))}
          </div>
        </div>
        <div className="flex_center">
          <Link
            href={`/card/player/${cardId}?contentIndex=${content.index}`}
            as={`/card/player/${cardId}?contentIndex=${content.index}`}
          >
            <div className={styles.btnPlay} onClick={() => {}}>
              <ion-icon size="medium" name="play"></ion-icon>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Program = ({ day, completed_contents, cardId }) => {
  if (!day) {
    return null;
  }
  return (
    <div>
      {day.contents.map((c, i) => {
        const isLast = day.contents.length == i + 1;
        const isCompleted = completed_contents.includes(c.index);

        return (
          <ContentComponent
            content={c}
            cardId={cardId}
            isLast={isLast}
            isCompleted={isCompleted}
            index={i + 1}
            key={i}
          />
        );
      })}
    </div>
  );
};

export const Day = ({ day, usercourse, cardName = false }) => {
  const getDayState = (day) => {
    if (!usercourse) {
      return { color: "#222", icon: iconPlay, state: "locked" };
    } else {
      if (day.index > usercourse.last_completed_day) {
        return { color: "gray", icon: iconLock, state: "locked" };
      }
      if (day.index == usercourse.last_completed_day) {
        return { color: "orange", icon: iconPlay, state: "next" };
      }
      if (day.index < usercourse.last_completed_day) {
        return { color: "transparent", icon: iconCheck, state: "completed" };
      }
    }
  };

  const [isOpen, setIsOpen] = useState(true);
  const color = getDayState(day).color;
  const icon = getDayState(day).icon;
  const dayLockState = getDayState(day).state;

  const sumDurationSessions = (sessions) => {
    let sum = 0;
    sessions.forEach((s) => {
      if (!s.duration) {
        return;
      }
      sum = sum + s.duration;
    });
    return sum;
  };

  return (
    <div className={styles.day}>
      <div className={styles.dayHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.state} style={{ backgroundColor: color }}>
          <img
            src={icon}
            height={getDayState(day).state === "completed" ? "30px" : "20px"}
          />
        </div>
        <div className={styles.labelBox}>
          {/* <div className={styles.label}>Day {day.index}</div> */}
          {/* For single Day -> card name, for course/or multiple sessions put Day
          1,2,3 back */}
          <div className={styles.label}>{cardName}</div>
          <div className={styles.progress}>
            {/* ? `${completedSessions}/${day.contents.length} completed` */}
            {/* {usercourse && `${day.contents.length} steps`} */}
            {sumDurationSessions(day.contents)} min
          </div>
        </div>
        <div className={styles.iconDown}>
          {isOpen ? (
            <ion-icon name="chevron-up-outline"></ion-icon>
          ) : (
            <ion-icon name="chevron-down-outline"></ion-icon>
          )}
        </div>
      </div>
      {isOpen && (
        <div className={styles.contents}>
          {day.contents.map((c, i) => (
            <ContentStep
              content={c}
              usercourse={usercourse}
              dayLockState={dayLockState}
              key={i}
            />
          ))}
        </div>
      )}
      {/* {isOpen && dayLockState === "completed" && (
        <div className={styles.dayAgain}>
          <div className="btn btn-green ">Replay Day {i + 1}</div>
        </div>
      )}
      {isOpen && dayLockState === "next" && (
        <div className={styles.dayAgain}>
          <div className="btn btn-action">Play Session</div>
        </div>
      )} */}
    </div>
  );
};

export const NextContent = ({ course, title, duration, icon }) => {
  return (
    <Link href={`/course/player/${course.id}`}>
      <div className={styles.contentNext}>
        <div className={styles.contentState}>
          <div className={styles.contentNextTypeBackground}>
            <img src={icon} height="16px" style={{ zIndex: "200" }} />
          </div>
        </div>

        <div className={styles.contentNextNameBox}>
          <div className={styles.contentNextTitle}>{title}</div>
          <div className={styles.contentDuration}>{duration} min</div>
        </div>
        <div className={styles.continueButton}>Play</div>
      </div>
    </Link>
  );
};

export const getIconType = (type) => {
  if (type === "concept") {
    return { icon: iconConcept };
  }
  if (type === "action" || type === "technique") {
    return { icon: iconAction };
  }
  if (type === "question") {
    return { icon: iconQuestion };
  } else {
    return { icon: iconConcept };
  }
};

const ContentStep = ({ content, usercourse, dayLockState }) => {
  const getContentState = (content, usercourse) => {
    if (
      !usercourse ||
      (content.index == usercourse?.last_completed_content &&
        !(dayLockState === "completed"))
    ) {
      return { color: false, icon: false };
    } else {
      if (
        content.index < usercourse.last_completed_content ||
        dayLockState === "completed"
      ) {
        return { color: "green", icon: iconCheck, state: "completed" };
      }
      if (
        content.index > usercourse.last_completed_content ||
        dayLockState === "locked"
      ) {
        return { color: "black", icon: iconLock, state: "locked" };
      }
    }
  };

  // const isNext =
  //   usercourse?.last_completed_content == content.index &&
  //   !(dayLockState === "completed");
  const icon = getContentState(content, usercourse).icon;
  const contentState = getContentState(content, usercourse).state;
  const router = useRouter();

  return (
    <>
      {/* <NextContent
        title={content.title}
        duration={content.duration}
        icon={getIconType(content.type).icon}
        course={usercourse.course}
      /> */}

      <div className={styles.contentStep}>
        <div className={styles.contentState}>
          <div className={styles.contentTypeBackground}>
            <img
              src={getIconType(content.type).icon}
              height="13px"
              style={{ zIndex: "200" }}
            />
          </div>

          <div className={styles.line}></div>
        </div>
        <div className={styles.contentTitle}>
          {/* {icon && (
            <div className={styles.contentStateIcon}>
              <img src={icon} height="12px" />
            </div>
          )} */}
          {content.title}
        </div>
        <div className={styles.contentDuration}>{content.duration} min</div>
      </div>
    </>
  );
};

const SalesPoints = ({ name, text }) => {
  return (
    <div className={styles.salesPoints}>
      <div className={styles.salesName}>{name}</div>
      <div className={styles.salesText}>
        <ReactMarkdown children={text} />
      </div>
    </div>
  );
};

const CoursePurchased = ({ course, usercourse }) => {
  const mergeActions = (usercard, actions, checkingArray, keyword) => {
    const result = actions.map((action) => {
      return {
        ...action,
        [keyword]: !!checkingArray.filter((a) => a.id === action.id)[0],
        is_reported: !!usercard.reported_actions.filter(
          (a) => a.id === action.id
        )[0],
        is_upvoted: !!usercard.upvoted_actions.filter(
          (a) => a.id === action.id
        )[0],
      };
    });
    return result;
  };

  const percentage = (
    (usercourse.last_completed_day / usercourse.course.course_details.days) *
    100
  ).toFixed(1);

  return (
    <div>
      <div className={styles.card}>
        <BackButton routeDynamic={""} routeStatic={"/"} />

        <div
          className={styles.courseImage}
          style={{ backgroundImage: `url(${baseUrl}${course.image.url})` }}
        >
          <div className={styles.curveFancy}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#171717"
                fillOpacity="1"
                d="M0,96L80,128C160,160,320,224,480,213.3C640,203,800,117,960,122.7C1120,128,1280,224,1360,272L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="section mb2">
          <div className={styles.section_name}>
            <div className={styles.nameProgress}>
              <div>
                <div className={styles.name}>{course.name}</div>
                <div className={styles.description}>{course.description}</div>
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
          </div>

          <Curriculum days={course.days} usercourse={usercourse} />
          <div className={styles.fixed}>
            <Link href={`/course/player/${course.id}`}>
              <div className="btn btn-action btn-fullSize">
                Continue
                <div className="ml5 flex_center">
                  <img src={iconPlay} height="14px" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursePage = () => {
  const router = useRouter();
  const [usercourseState, setUsercourseState] = useState(false);
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_COURSE_ID, {
    variables: { id: router.query.id },
  });
  const gql_course = data && normalize(data);

  useEffect(() => {
    if (store.user.usercourses) {
      const usercourse = store.user.usercourses.filter((uc) => {
        return uc.course.id === parseInt(router.query.id);
      })[0];

      if (!usercourse) {
        return;
      }
      setUsercourseState(usercourse);
    }
  }, [store.user]);

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && (
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      )}

      {gql_course && !usercourseState && (
        <CourseSales course={gql_course.course} />
      )}
      {gql_course && usercourseState && (
        <CoursePurchased
          course={gql_course.course}
          usercourse={usercourseState}
        />
      )}
    </div>
  );
};

export default CoursePage;
