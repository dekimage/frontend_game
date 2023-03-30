import {
  ActionsScreen,
  CompleteScreen,
  CompleteScreenNoEnergy,
  ContentQuestion,
  FeedbackScreen,
  LevelUpScreen,
  RepeatScreen,
  RewardsScreen,
  SliderHeader,
  SliderProgress,
  WarningModal,
} from "../../../components/playerComps";
import { useContext, useEffect, useState } from "react";

import { Context } from "../../../context/store";
import { GET_CARD_PLAYER } from "../../../GQL/query";
import Modal from "../../../components/Modal";
import _ from "lodash";
import { normalize } from "../../../utils/calculations";
import useModal from "../../../hooks/useModal";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Player = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_CARD_PLAYER, {
    variables: { id: router.query.id },
  });

  const gql_data = data && normalize(data);

  useEffect(() => {
    if (!loading && gql_data) {
      setSlide(gql_data.card.slides[0]);
      setSlides(gql_data.card.slides);
    }
  }, [gql_data, loading]);

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

  // const [successModal, setSuccessModal] = useState(states[1]);
  const [successModal, setSuccessModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [isQuestionScreen, setIsQuestionScreen] = useState(true);

  const [repeatSlides, setRepeatSlides] = useState([]);

  const [rewards, setRewards] = useState({
    xp: 0,
    stars: 0,
    gems: 0,
  });

  const [mistakes, setMistakes] = useState(0);

  const isLatestLevel = store.player.level + 1 === store.player.selectedLevel;

  const hasEnergy = store.user.energy > 0;

  const updateRewards = (xp = 10, stars = 5) => {
    setRewards({
      ...rewards,
      ["xp"]: rewards.xp + xp,
      ["stars"]: rewards.stars + stars,
    });
  };

  const closePlayer = () => {
    router.push(`${feUrl}/card/${router.query.id}`);
  };

  const recordResults = (answerId, answerCorrect) => {};

  const addWrongAnswerForLater = (slide) => {
    setRepeatSlides([...repeatSlides, slide]);
  };

  const onContinue = () => {
    const index = slides.findIndex((s) => s.id === slide.id);
    if (index === slides.length - 1) {
      if (repeatSlides.length) {
        //shuffle if I want
        setSlides(repeatSlides);
        setSlide(repeatSlides[0]);
        setRepeatSlides([]);
      } else {
        if (isLatestLevel) {
          setSuccessModal("complete_screen");
        } else {
          setSuccessModal("repeat_screen");
        }
      }
    } else {
      setSlide(slides[index + 1]);
    }
    setIsQuestionScreen(true);
  };

  const onAnswer = (answer) => {
    if (answer.is_correct) {
      setIsCorrectAnswer(true);
      updateRewards();
      recordResults(answer.id, { is_correct: true });
    } else {
      setMistakes(mistakes + 1);
      setIsCorrectAnswer(false);
      addWrongAnswerForLater(slide);
      recordResults(answer.id, { is_correct: false });
    }
    setIsQuestionScreen(false);
  };

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Load</div>}
      {gql_data && store.user && slide && (
        <div className="section">
          <SliderProgress
            maxSlides={slides.length}
            currentSlide={slides && slides.findIndex((s) => s.id === slide.id)}
            setIsWarningModalOpen={setIsWarningModalOpen}
            openModal={openModal}
          />

          <SliderHeader rewards={rewards} closePlayer={closePlayer} />

          {!successModal && (
            <ContentQuestion
              slide={slide}
              onContinue={onContinue}
              onAnswer={onAnswer}
              isQuestionScreen={isQuestionScreen}
              isCorrectAnswer={isCorrectAnswer}
              setIsModalOpen={setIsModalOpen}
              successModal={successModal}
            />
          )}

          {successModal === "repeat_screen" && (
            <RepeatScreen
              closePlayer={closePlayer}
              card={gql_data.card}
              mistakes={mistakes}
            />
          )}
          {successModal === "complete_screen" && hasEnergy && (
            <CompleteScreen
              closePlayer={closePlayer}
              card={gql_data.card}
              rewards={rewards}
              setSuccessModal={setSuccessModal}
            />
          )}
          {successModal === "complete_screen" && !hasEnergy && (
            <CompleteScreenNoEnergy
              closePlayer={closePlayer}
              card={gql_data.card}
              rewards={rewards}
              setSuccessModal={setSuccessModal}
            />
          )}

          {successModal === "rewards_screen" && (
            <RewardsScreen
              closePlayer={closePlayer}
              card={gql_data.card}
              setSuccessModal={setSuccessModal}
              rewards={rewards}
            />
          )}

          {successModal === "actions_screen" && (
            <ActionsScreen
              closePlayer={closePlayer}
              card={gql_data.card}
              setSuccessModal={setSuccessModal}
            />
          )}

          {successModal === "feedback_screen" && (
            <FeedbackScreen
              closePlayer={closePlayer}
              card={gql_data.card}
              setSuccessModal={setSuccessModal}
            />
          )}

          {successModal === "levelup_screen" && (
            <LevelUpScreen
              closePlayer={closePlayer}
              card={gql_data.card}
              setSuccessModal={setSuccessModal}
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
        </div>
      )}
    </div>
  );
};

export default Player;

{
  /* {slide.type === "action" && (
            <ContentAction
              actions={slide.actions}
              goNext={goNext}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              skipAction={skipAction}
            />
          )} */
}
