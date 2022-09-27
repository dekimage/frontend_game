import { useQuery } from "@apollo/react-hooks";
import { useState, useEffect, useContext } from "react";
import { useTimer } from "react-timer-hook";

import { Context } from "../../../context/store";
import { useRouter } from "next/router";

import _ from "lodash";

import Modal from "../../../components/Modal";

import useModal from "../../../hooks/useModal";

import { normalize } from "../../../utils/calculations";

import { GET_COURSE_ID } from "../../../GQL/query";

import Timer from "../../../components/Timer";

import { Action } from "../../../components/cardPageComps";

// import { ContentAction } from "../../../components/oldPlayerComps";

const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

import styles from "../../../styles/Player.module.scss";

import {
  ContentQuestion,
  SliderProgress,
  SliderHeader,
  WarningModal,
  RepeatScreen,
  LevelUpScreen,
  ActionsScreen,
  RewardsScreen,
  CompleteScreen,
  CompleteScreenNoEnergy,
  FeedbackScreen,
} from "../../../components/playerComps";

export const ContentTheory = ({ slide, goNext }) => {
  const ideas = slide.storyline.split("\n\n");

  const [openIdeas, setOpenIdeas] = useState([ideas[0]]);
  const isFirstSlideFinal = openIdeas.length === ideas.length;
  const [isLastIdea, setIsLastIdea] = useState(isFirstSlideFinal);

  useEffect(() => {
    if (openIdeas !== slide) {
      const ideas = slide.storyline.split("\n\n");
      setOpenIdeas([ideas[0]]);
      const isFirstSlideFinal = openIdeas.length === ideas.length;
      setIsLastIdea(isFirstSlideFinal);
    }
  }, [slide]);

  const openNextIdea = () => {
    const index = openIdeas.length;

    if (index === ideas.length - 1) {
      setIsLastIdea(true);
    }
    setOpenIdeas([...openIdeas, ideas[index]]);
  };

  return (
    <div className={styles.contentTheory}>
      {openIdeas.map((idea, i) => (
        <div className={styles.theoryText} key={i}>
          {idea}
        </div>
      ))}
      <div className="absolute_bottom">
        <div className={styles.ctaBox}>
          {isLastIdea ? (
            <div className="btn btn-primary" onClick={goNext}>
              Next
            </div>
          ) : (
            <div className="btn btn-primary" onClick={openNextIdea}>
              Tap To Continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Player = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_COURSE_ID, {
    variables: { id: router.query.id },
  });

  const gql_data = data && normalize(data);

  // for testing
  const states = [
    "feedback_screen",
    "complete_screen",
    "rewards_screen",
    "actions_screen",
    "levelup_screen",
  ];

  const [slides, setSlides] = useState(false);
  const [slide, setSlide] = useState(false);

  const { isShowing, openModal, closeModal } = useModal();

  const [successModal, setSuccessModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [rewards, setRewards] = useState({
    xp: 0,
    stars: 0,
    gems: 0,
  });

  useEffect(() => {
    const usercourse =
      store?.user?.usercourses &&
      store.user.usercourses.filter(
        (c) => parseInt(c.course.id) == parseInt(router.query.id)
      )[0];

    const last_completed_content =
      usercourse && usercourse.last_completed_content;
    const last_completed_day = usercourse && usercourse.last_completed_day;

    if (!loading && gql_data) {
      setSlide(
        gql_data.course.days[last_completed_day - 1].contents[
          last_completed_content - 1
        ]
      );
      setSlides(gql_data.course.days[last_completed_day - 1].contents);
    }
  }, [gql_data, loading]);

  // const isLatestLevel = store.player.level + 1 === store.player.selectedLevel;
  const isLatestLevel = false;

  const updateRewards = (xp = 10, stars = 5) => {
    setRewards({
      ...rewards,
      ["xp"]: rewards.xp + xp,
      ["stars"]: rewards.stars + stars,
    });
  };

  const closePlayer = () => {
    router.push(`${feUrl}/course/${router.query.id}`);
  };

  const onContinue = () => {
    const index = slides.findIndex((s) => s.id === slide.id);
    if (index === slides.length - 1) {
      if (isLatestLevel) {
        setSuccessModal("complete_screen");
      } else {
        setSlide(slides[index + 1]);
      }
    }
  };

  const goBack = () => {
    const index = slide.index;
    if (index === 1) {
      closePlayer();
    } else {
      setSlide(slides[index - 2]);
    }
  };

  const goNext = () => {
    const index = slide.index;

    if (index === slides.length) {
      setIsSuccessModalOpen(true);
    } else {
      setSlide(slides[index]);
    }
  };

  const ContentAction = ({ slide, goNext }) => {
    const action = slide.action;

    const time = new Date();
    const expiryTimestamp = time.setSeconds(time.getSeconds() + slide.timer);
    const [isTimerCompleted, setIsTimerCompleted] = useState(false);

    const onExpire = () => {
      setIsTimerCompleted(true);
    };

    const { seconds, minutes, isRunning, start, pause, restart } = useTimer({
      expiryTimestamp,
      autoStart: false,
      onExpire: onExpire,
    });

    return <Action action={action} goNext={goNext} parent={"course"} isOpen />;
  };

  const SuccessModal = ({ closePlayer, card, isLatestLevel }) => {
    const [store, dispatch] = useContext(Context);
    return (
      <div>
        {isLatestLevel ? (
          <div>
            Congratualations!! You have completed the theory check-in! Now, it's
            time for you to do some Actions!
            <button
              onClick={() => {
                closePlayer();
                updateCard(dispatch, card.id, "complete");
              }}
            >
              Mark as Complete!
            </button>
          </div>
        ) : (
          <div>
            <button onClick={closePlayer}>Back to Card</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {gql_data && store.user && slide && (
        <div className="section">
          <SliderProgress
            maxSlides={slides.length}
            currentSlide={slides && slides.findIndex((s) => s.id === slide.id)}
            setIsWarningModalOpen={setIsWarningModalOpen}
            openModal={openModal}
            goBack={goBack}
          />

          <SliderHeader rewards={rewards} closePlayer={closePlayer} />

          <div className={styles.title}>{slide.title}</div>

          {slide.type === "concept" && (
            <ContentTheory slide={slide} goNext={goNext} />
          )}

          {slide.type === "action" && (
            <ContentAction
              slide={slide}
              goNext={goNext}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          )}

          {isWarningModalOpen && (
            <Modal
              isShowing={isShowing}
              closeModal={closeModal}
              isSmall={true}
              jsx={
                <WarningModal
                  setIsWarningModalOpen={setIsWarningModalOpen}
                  closePlayer={closePlayer}
                />
              }
            />
          )}

          {isSuccessModalOpen && (
            <SuccessModal
              closePlayer={closePlayer}
              card={data.card}
              isLatestLevel={isLatestLevel}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Player;
