import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useState, useEffect, useContext } from "react";
import { useTimer } from "react-timer-hook";
import { Context } from "../../../context/store";
import { useRouter } from "next/router";
import Timer from "../../../components/Timer";
import styles from "../../../styles/Player.module.scss";
import Link from "next/link";
import clseIcon from "../../../assets/close.svg";
import _ from "lodash";
import cx from "classnames";

const GET_CARD_ID = gql`
  query ($id: ID!) {
    card(id: $id) {
      id
      name
      description
      type
      rarity
      realm {
        color
        name
      }
      image {
        url
      }
      slides {
        id
        Title
        type
        Image {
          url
        }
        restrictedLevels
        actions {
          text
          timer
          tips
        }
        answers {
          text
          isCorrect
        }
        idea {
          rich_text
        }
      }
    }
  }
`;

const SliderProgress = ({ maxSlides, currentSlide }) => {
  return (
    <div className={styles.sliderProgress}>
      {Array.from(Array(maxSlides).keys()).map((bar) => {
        return (
          <div
            className={cx([styles.sliderBar], {
              [styles.sliderBar_filled]: bar <= currentSlide,
            })}
          ></div>
        );
      })}
    </div>
  );
};

const SliderHeader = ({ type, rewards, goBack, setIsWarningModalOpen }) => {
  return (
    <div className={styles.sliderHeader}>
      <div className={styles.back} onClick={goBack}>
        <ion-icon name="chevron-back-outline"></ion-icon>
      </div>
      <div className={styles.grayBubble}>
        <div>{type}</div>
      </div>
      <div className={styles.grayBubble}>
        <div className={styles.grayBubble_rewards}>
          <img height="14px" src="http://localhost:1337/xp.png" />
          <span>{rewards.xp}</span>
          <img height="14px" src="http://localhost:1337/stars.png" />

          <span> {rewards.stars}</span>
          <img height="14px" src="http://localhost:1337/gems.png" />

          <span> {rewards.gems}</span>
        </div>
      </div>

      <div onClick={() => setIsWarningModalOpen(true)} className="flex_center">
        <img src={clseIcon} height="20px" />
      </div>
    </div>
  );
};

const ContentTheory = ({ ideas, goNext }) => {
  const [openIdeas, setOpenIdeas] = useState([ideas[0]]);
  const [isLastIdea, setIsLastIdea] = useState(false);

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
        <div className={styles.theoryText}>{idea.rich_text}</div>
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

const ContentQuestion = ({
  answers,
  selectedAnswers,
  checkAnswer,
  isModalOpen,
  isCorrectAnswer,
  setSelectedAnswers,
  goNext,
  tryAgain,
  setIsModalOpen,
}) => {
  const addOrRemoveAnswer = (answer) => {
    if (selectedAnswers.some((a) => a.text === answer.text)) {
      setSelectedAnswers(selectedAnswers.filter((a) => a.text !== answer.text));
    } else {
      setSelectedAnswers([...selectedAnswers, answer]);
    }
  };
  const answersIndex = ["A", "B", "C", "D"];

  return (
    <div className={styles.contentQuestion}>
      {answers.map((answer, i) => {
        const isSelected = selectedAnswers.some((a) => a.text === answer.text);
        return (
          <div
            className={cx([styles.answer], {
              [styles.answer_selected]: isSelected,
            })}
            onClick={() => {
              addOrRemoveAnswer(answer);
            }}
          >
            <div className={styles.answerIndex}>{answersIndex[i]}</div>
            <div className={styles.answerText}> {answer.text}</div>
          </div>
        );
      })}
      <div className="absolute_bottom">
        <div className={styles.ctaBox}>
          <div className="btn btn-primary" onClick={checkAnswer}>
            Check Answer
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ModalQuestion
          isCorrectAnswer={isCorrectAnswer}
          goNext={goNext}
          tryAgain={tryAgain}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

const ModalQuestion = ({
  isCorrectAnswer,
  goNext,
  tryAgain,
  setIsModalOpen,
}) => {
  return (
    <div className={styles.dimScreen}>
      <div className={styles.playerModal}>
        {isCorrectAnswer ? (
          <div className={styles.playerModal_Wrapper}>
            <div className={styles.playerModal_titleBox}>
              <div
                className={styles.playerModal_back}
                onClick={() => setIsModalOpen(false)}
              >
                <img src={clseIcon} height="16px" />
              </div>
              <div className={styles.playerModal_title}>
                Yay! Correct Answer
              </div>
            </div>

            <div className={styles.playerModal_section}>
              <div>stars</div>
            </div>
            <div className={styles.playerModal_section}>
              <div className={styles.playerModal_greenBackground}>
                <img src={clseIcon} height="40px" />
              </div>
            </div>
            <div className={styles.playerModal_section}>
              <div>You are right!</div>
            </div>
            <div className={styles.playerModal_section}>
              <div className="btn btn-primary" onClick={goNext}>
                Go Next
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.playerModal_Wrapper}>
            <div className={styles.playerModal_titleBox}>
              <div onClick={() => setIsModalOpen(false)}>
                <img src={clseIcon} height="16px" />
              </div>
              <div className={styles.playerModal_title}>
                Oops! Incorrect Answer
              </div>
            </div>

            <div className={styles.playerModal_section}>
              <div>stars</div>
            </div>
            <div className={styles.playerModal_section}>
              <div className={styles.playerModal_redBackground}>
                <img src={clseIcon} height="40px" />
              </div>
            </div>
            <div className={styles.playerModal_section}>
              <div>Give it another shot!</div>
            </div>
            <div className={styles.playerModal_section}>
              <div className="btn btn-primary" onClick={tryAgain}>
                Try Again
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentAction = ({
  actions,
  isModalOpen,
  skipAction,
  setIsModalOpen,
  goNext,
}) => {
  const [currentAction, setCurrentAction] = useState(actions[0]);
  const [completedActions, setCompletedActions] = useState([]);

  const goNextAction = () => {
    setIsModalOpen(false);
    setCompletedActions([...completedActions, currentAction]);
    const index = actions.findIndex((a) => a.text === currentAction.text);
    if (index === actions.length - 1) {
      goNext();
    } else {
      setCurrentAction(actions[index + 1]);
    }
  };
  console.log(currentAction);
  console.log(completedActions);

  return (
    <div>
      {actions.map((action, i) => (
        <div
          className={cx([styles.answer], {
            [styles.answer_selected]: action == currentAction,
            [styles.answer_completed]: completedActions.includes(action),
            [styles.answer_upcoming]:
              !(action == currentAction) && !completedActions.includes(action),
          })}
          onClick={() => {
            addOrRemoveAnswer(answer);
          }}
        >
          {completedActions.includes(action) ? (
            <div className={styles.answerIndex}>
              <ion-icon name="checkmark-outline"></ion-icon>
            </div>
          ) : (
            <div className={styles.answerIndex}>{i + 1}</div>
          )}
          <div className={styles.answerText}> {action.text}</div>
        </div>
      ))}
      <div className={styles.ctaBox}>
        <div
          className="btn btn-primary mb1"
          onClick={() => setIsModalOpen(true)}
        >
          Start Player
        </div>
        <div className="btn btn-gray" onClick={skipAction}>
          Skip for Later
        </div>
      </div>

      {isModalOpen && (
        <ModalAction
          goNext={goNext}
          currentAction={currentAction}
          setIsModalOpen={setIsModalOpen}
          completedActions={completedActions}
          setCompletedActions={setCompletedActions}
          setCurrentAction={setCurrentAction}
          actions={actions}
          goNextAction={goNextAction}
        />
      )}
    </div>
  );
};

const ModalAction = ({ currentAction, setIsModalOpen, goNextAction }) => {
  const time = new Date();
  const expiryTimestamp = time.setSeconds(
    time.getSeconds() + currentAction.timer
  );
  const [isTimerCompleted, setIsTimerCompleted] = useState(false);

  const onExpire = () => {
    setIsTimerCompleted(true);
  };
  const { seconds, minutes, isRunning, start, pause, restart } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: onExpire,
  });

  return (
    <div className={styles.dimScreen}>
      <div className={styles.playerModal}>
        <div className={styles.playerModal_Wrapper}>
          <div className={styles.playerModal_titleBox}>
            <div
              className={styles.playerModal_back}
              onClick={() => setIsModalOpen(false)}
            >
              <img src={clseIcon} height="16px" />
            </div>
            <div className={styles.playerModal_title}>Step backend 1</div>
          </div>
          <div className={styles.playerModal_section}>
            <div>{currentAction.text}</div>
          </div>
          <div className={styles.playerModal_section}>
            <div>Tips:</div>
          </div>
          <div className={styles.playerModal_section}>
            <div> {currentAction.tips}</div>
          </div>

          <Timer
            seconds={seconds}
            minutes={minutes}
            isRunning={isRunning}
            start={start}
            pause={pause}
            restart={restart}
            isTimerCompleted={isTimerCompleted}
            setIsTimerCompleted={setIsTimerCompleted}
            currentAction={currentAction}
            goNextAction={goNextAction}
          />
        </div>
      </div>
    </div>
  );
};

const WarningModal = ({ setIsWarningModalOpen, closePlayer }) => {
  return (
    <div>
      Are you sure you wish to quit this session? You will lose all progress.
      <button onClick={closePlayer}>Quit</button>
      <button onClick={() => setIsWarningModalOpen(false)}>Stay</button>
    </div>
  );
};

const Card = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_CARD_ID, {
    variables: { id: router.query.id },
  });

  useEffect(() => {
    if (!loading && data) {
      setSlide(data.card.slides[0]);
      setSlides(data.card.slides);
    }
  }, [data, loading]);

  const [slides, setSlides] = useState(false);
  const [slide, setSlide] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [rewards, setRewards] = useState({
    xp: 0,
    stars: 0,
    gems: 0,
  });
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [guesses, setGuesses] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [skippedActions, setSkippedActions] = useState([]);

  const updateRewards = (currency, amount) => {
    setRewards({ ...rewards, [currency]: rewards[currency] + amount });
  };

  const goBack = () => {
    const index = slides.findIndex((s) => s.id === slide.id);
    if (index === 0) {
      closePlayer();
    } else {
      setSlide(slides[index - 1]);
    }
    setSelectedAnswers([]);
  };

  const goNext = () => {
    const index = slides.findIndex((s) => s.id === slide.id);
    if (index === slides.length - 1) {
      setIsSuccessModalOpen(true);
    } else {
      setSlide(slides[index + 1]);
      setSelectedAnswers([]);
    }
  };

  const closePlayer = () => {
    router.push(`http://localhost:3000/card/${router.query.id}`);
  };

  const skipAction = (action) => {
    goNext();
    setSkippedActions([...skippedActions, action]);
  };

  const tryAgain = () => {
    setIsModalOpen(false);
    setSelectedAnswers([]);
  };

  const checkAnswer = () => {
    setGuesses(guesses + 1);
    let rightGuesses = 0;
    let wrongGuesses = 0;
    const numberOfCorrectAnswers = slide.answers.filter(
      (a) => a.isCorrect === true
    ).length;
    selectedAnswers.forEach((answer) => {
      if (answer.isCorrect) {
        rightGuesses++;
      } else {
        wrongGuesses++;
      }
    });
    const isResultCorrect =
      rightGuesses === numberOfCorrectAnswers && !wrongGuesses;
    setIsCorrectAnswer(isResultCorrect);
    setIsModalOpen(true);
  };

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {data && store.user && (
        <div className="section_container">
          <SliderProgress
            maxSlides={slides.length}
            currentSlide={slides && slides.findIndex((s) => s.id === slide.id)}
          />
          <SliderHeader
            rewards={rewards}
            type={slide.type}
            goBack={goBack}
            closePlayer={closePlayer}
            setIsWarningModalOpen={setIsWarningModalOpen}
          />

          <div className={styles.title}>{slide.Title}</div>

          {slide.type === "theory" && (
            <ContentTheory ideas={slide.idea} goNext={goNext} />
          )}

          {slide.type === "question" && (
            <ContentQuestion
              answers={slide.answers}
              selectedAnswers={selectedAnswers}
              guesses={guesses}
              checkAnswer={checkAnswer}
              goNext={goNext}
              isModalOpen={isModalOpen}
              isCorrectAnswer={isCorrectAnswer}
              setSelectedAnswers={setSelectedAnswers}
              tryAgain={tryAgain}
              setIsModalOpen={setIsModalOpen}
            />
          )}

          {slide.type === "action" && (
            <ContentAction
              actions={slide.actions}
              goNext={goNext}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              skipAction={skipAction}
            />
          )}

          {isWarningModalOpen && (
            <WarningModal
              setIsWarningModalOpen={setIsWarningModalOpen}
              closePlayer={closePlayer}
            />
          )}
          {isSuccessModalOpen && (
            <WarningModal
              setIsWarningModalOpen={setIsSuccessModalOpen}
              closePlayer={closePlayer}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
