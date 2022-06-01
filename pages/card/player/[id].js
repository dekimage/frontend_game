import ReactMarkdown from "react-markdown";
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
import StopWatch from "../../../components/StopWatch";

import Modal from "../../../components/Modal";

import useModal from "../../../hooks/useModal";

import { closeRewardsModal, updateCard } from "../../../actions/action";

import actionIcon from "../../../assets/player_actions.svg";
import rewardsIcon from "../../../assets/player_rewards.svg";
import completedIcon from "../../../assets/player_complete.svg";
import levelIcon from "../../../assets/player_lvlup.svg";
import progressIcon from "../../../assets/player_progress.svg";
import noEnergyIcon from "../../../assets/player_no_energy.svg";

const GET_CARD_PLAYER = gql`
  query ($id: ID!) {
    card(id: $id) {
      id
      name
      description
      type
      rarity
      realm {
        id
        color
        name
      }
      image {
        url
      }
      slides {
        id
        question
        answers {
          text
          isCorrect
        }
        ideaTitle
        ideaContent
      }
    }
  }
`;

const SliderProgress = ({
  maxSlides,
  currentSlide,
  setIsWarningModalOpen,
  openModal,
}) => {
  return (
    <div className={styles.header}>
      <div
        onClick={() => {
          setIsWarningModalOpen(true);
          openModal();
        }}
        className="flex_center"
      >
        <img src={clseIcon} height="20px" />
      </div>
      <div className={styles.sliderProgress}>
        {Array.from(Array(maxSlides).keys()).map((bar, i) => {
          return (
            <div
              key={i}
              className={cx([styles.sliderBar], {
                [styles.sliderBar_filled]: bar <= currentSlide,
              })}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

const SliderHeader = ({ rewards }) => {
  return (
    <div className={styles.sliderHeader}>
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
    </div>
  );
};

// const ContentTheory = ({ ideas, goNext }) => {
//   const [openIdeas, setOpenIdeas] = useState([ideas[0]]);
//   const isFirstSlideFinal = openIdeas.length === ideas.length;
//   const [isLastIdea, setIsLastIdea] = useState(isFirstSlideFinal);

//   const openNextIdea = () => {
//     const index = openIdeas.length;

//     if (index === ideas.length - 1) {
//       setIsLastIdea(true);
//     }
//     setOpenIdeas([...openIdeas, ideas[index]]);
//   };

//   return (
//     <div className={styles.contentTheory}>
//       {openIdeas.map((idea, i) => (
//         <div className={styles.theoryText} key={i}>
//           {idea.rich_text}
//         </div>
//       ))}
//       <div className="absolute_bottom">
//         <div className={styles.ctaBox}>
//           {isLastIdea ? (
//             <div className="btn btn-primary" onClick={goNext}>
//               Next
//             </div>
//           ) : (
//             <div className="btn btn-primary" onClick={openNextIdea}>
//               Tap To Continue
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

const CtaQuestions = () => {
  return (
    <div className={styles.ctaBox}>
      <div className="btn btn-disabled btn-stretch">Continue</div>
    </div>
  );
};

const CtaCorrectAnswer = ({ onContinue }) => {
  return (
    <div className={styles.ctaBox}>
      <div className={styles.ctaBox_header}>
        <div className={styles.ctaBox_image}>
          <img src={`http://localhost:1337/checked.png`} height="40px" />
        </div>
        <div>
          <div className={styles.ctaBox_correct}>Correct!</div>
          <div className={styles.ctaBox_text}>
            25% of users answer this correctly!
          </div>
        </div>
      </div>

      <div className="btn btn-correct btn-stretch" onClick={() => onContinue()}>
        Continue
      </div>
    </div>
  );
};

const CtaWrongAnswer = ({ onContinue }) => {
  return (
    <div className={styles.ctaBox}>
      <div className={styles.ctaBox_header}>
        <div className={styles.ctaBox_image}>
          <img src={`http://localhost:1337/wrong.png`} height="40px" />
        </div>
        <div>
          <div className={styles.ctaBox_wrong}>Try Again!</div>
          <div className={styles.ctaBox_text}>
            25% of users answer this correctly!
          </div>
        </div>
      </div>

      <div className="btn btn-wrong btn-stretch" onClick={() => onContinue()}>
        Continue
      </div>
    </div>
  );
};

const ContentQuestion = ({
  slide,
  onContinue,
  onAnswer,
  isQuestionScreen,
  isCorrectAnswer,
}) => {
  const answersIndex = ["A", "B", "C", "D"];

  return (
    <>
      <div>
        {isQuestionScreen ? (
          <div className={styles.contentQuestion}>
            <div className={styles.question}>{slide.question}</div>
            {slide.answers.map((answer, i) => {
              return (
                <div
                  className={cx([styles.answer], {
                    [styles.answer_selected]: false,
                  })}
                  onClick={() => {
                    onAnswer(answer);
                  }}
                  key={i}
                >
                  <div className={styles.answerIndex}>{answersIndex[i]}</div>
                  <div className={styles.answerText}> {answer.text}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {slide.image && <div></div>}
            <div className={styles.ideaTitle}>{slide.ideaTitle}</div>

            <div className={styles.ideaContent}>
              <ReactMarkdown children={slide.ideaContent} />
            </div>
          </div>
        )}

        {/* CTA BOX */}
        {isQuestionScreen && <CtaQuestions />}

        {!isQuestionScreen && isCorrectAnswer && (
          <CtaCorrectAnswer onContinue={onContinue} />
        )}
        {!isQuestionScreen && !isCorrectAnswer && (
          <CtaWrongAnswer onContinue={onContinue} />
        )}
      </div>
    </>
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
  const [completedActions, setCompletedActions] = useState([0]);

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
    <div className={styles.warningModal}>
      <div className="modal-title">Quit Player?</div>
      <div className="flex_center">
        Are you sure you want to quit this session? You will lose all progress.
      </div>
      <div className={styles.warningModal_cta}>
        <div
          className="btn btn-primary"
          onClick={() => setIsWarningModalOpen(false)}
        >
          Stay
        </div>
        <div className="btn btn-wrong" onClick={closePlayer}>
          Quit
        </div>
      </div>
    </div>
  );
};

// player_actions;
// player_rewards;
// player_completed;
// player_lvlup;
// player_progress;
// player_no_energy;

const GenericScreen = ({ img, title, content, stats, jsx }) => {
  return (
    <div className={styles.genericScreen}>
      <div className={styles.genericImage}>
        <img src={img} />
      </div>

      <div className={styles.genericTitle}>{title}</div>
      <div className={styles.genericContent}>
        <ReactMarkdown children={content} />
      </div>
      <div>{jsx}</div>
      <div className={styles.genericStats}>
        {stats &&
          stats.map((s, i) => {
            return (
              <div className={styles.genericStat} key={i}>
                <div className="flex_center">
                  <img src={`http://localhost:1337/${s.img}.png`} />
                  <div className={styles.genericStat_label}>{s.label}</div>
                </div>

                <div className={styles.genericStat_amount}>{s.amount}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const RepeatScreen = ({ card, mistakes }) => {
  return (
    <div>
      <GenericScreen
        img={progressIcon}
        title={"lesson complete"}
        content={
          "Repetion is the root of all knowledge. Now go to actions & put it in practice!"
        }
        stats={[{ img: "gems", label: "Errors", amount: mistakes }]}
      />

      <div className={styles.ctaBox}>
        <Link href={`/card/${card.id}`}>
          <div className="btn btn-primary btn-stretch">Back to Card</div>
        </Link>
      </div>
    </div>
  );
};

const LevelUpScreen = ({ setSuccessModal, level = 7 }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div>
      <GenericScreen
        img={levelIcon}
        title={"Level UP!"}
        content={`Congratualations! You've reached Level ${level}!`}
      />

      <div className={styles.ctaBox}>
        <Link href="/level-rewards">
          <div className="btn btn-primary btn-stretch">View Level Rewards</div>
        </Link>
      </div>
    </div>
  );
};

const ActionsScreen = ({ card }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div>
      <GenericScreen
        img={actionIcon}
        title={"Actions"}
        content={
          "Great! You've unlocked the actions for this level! It's time to put your wisdom into practice!"
        }
      />
      <div className={styles.ctaBox}>
        <Link href={`/card/${card.id}`}>
          <div className="btn btn-primary btn-stretch">Visit Actions</div>
        </Link>
      </div>
    </div>
  );
};

const RewardsScreen = ({ rewards, setSuccessModal }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div>
      <GenericScreen
        img={rewardsIcon}
        title={"Rewards"}
        content={"Congratualations! You've earned these rewards:"}
        stats={[
          { img: "xp", label: "XP", amount: rewards.xp },
          { img: "stars", label: "Stars", amount: rewards.stars },
        ]}
      />
      <div className={styles.ctaBox}>
        <div
          className="btn btn-primary btn-stretch"
          onClick={() => {
            //if level up -> set to level_screen
            setSuccessModal("actions_screen");
          }}
        >
          Continue
        </div>
      </div>
    </div>
  );
};

const CompleteScreen = ({ card, setSuccessModal }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div>
      <GenericScreen
        img={completedIcon}
        title={"lesson complete"}
        content={"Congratualations!! You have completed the theory check-in!"}
        stats={[
          { img: "gems", label: "Course Progress", amount: "25%" },
          { img: "play", label: "Practice", amount: `${card.completed}/5` },
        ]}
      />
      <div className={styles.ctaBox}>
        <div
          className="btn btn-primary btn-stretch"
          onClick={() => {
            setSuccessModal("rewards_screen");
            updateCard(dispatch, card.id, "complete");
          }}
        >
          Mark as Complete! 1 Energy
        </div>
      </div>
    </div>
  );
};

const CompleteScreenNoEnergy = ({ card }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div>
      <GenericScreen
        img={noEnergyIcon}
        title={"Reached Energy Limit"}
        content={
          "Uh oh.. You've reached your today's maximum energy limit. Come back in:"
        }
        jsx={<StopWatch lastCompleted={false} />}
      />

      <div className={styles.ctaBox}>
        <Link href={`/card/${card.id}`}>
          <div className="btn btn-primary btn-stretch mb1">Back to Card</div>
        </Link>
        <Link href="/shop">
          <div className="btn btn-primary btn-stretch">
            Get 6 Energy / Day (subscribe pro)
          </div>
        </Link>
      </div>
    </div>
  );
};

const FeedbackScreen = ({ card }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div>
      <GenericScreen
        img={"stars"}
        title={"Feedback"}
        content={
          "How much would you say this card would be valuable or applicable in your life?"
        }
      />
      <div className={styles.ctaBox}>
        <div className="btn btn-primary btn-stretch mb1">Not at all. :/</div>

        <div className="btn btn-primary btn-stretch mb1">Somewhat okay :|</div>

        <div className="btn btn-primary btn-stretch">Very much! :D</div>
      </div>
    </div>
  );
};

const Card = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_CARD_PLAYER, {
    variables: { id: router.query.id },
  });

  useEffect(() => {
    if (!loading && data) {
      setSlide(data.card.slides[0]);
      setSlides(data.card.slides);
    }
  }, [data, loading]);

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
  console.log(isLatestLevel);
  console.log(store.player.level + 1);
  console.log(store.player.selectedLevel);
  const hasEnergy = store.user.energy > 0;

  const updateRewards = (xp = 10, stars = 5) => {
    setRewards({
      ...rewards,
      ["xp"]: rewards.xp + xp,
      ["stars"]: rewards.stars + stars,
    });
  };

  const closePlayer = () => {
    router.push(`http://localhost:3000/card/${router.query.id}`);
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
        console.log(isLatestLevel);
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
    if (answer.isCorrect) {
      setIsCorrectAnswer(true);
      updateRewards();
      recordResults(answer.id, { isCorrect: true });
    } else {
      setMistakes(mistakes + 1);
      setIsCorrectAnswer(false);
      addWrongAnswerForLater(slide);
      recordResults(answer.id, { isCorrect: false });
    }
    setIsQuestionScreen(false);
  };

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {data && store.user && slide && (
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
              card={data.card}
              mistakes={mistakes}
            />
          )}
          {successModal === "complete_screen" && hasEnergy && (
            <CompleteScreen
              closePlayer={closePlayer}
              card={data.card}
              rewards={rewards}
              setSuccessModal={setSuccessModal}
            />
          )}
          {successModal === "complete_screen" && !hasEnergy && (
            <CompleteScreenNoEnergy
              closePlayer={closePlayer}
              card={data.card}
              rewards={rewards}
              setSuccessModal={setSuccessModal}
            />
          )}

          {successModal === "rewards_screen" && (
            <RewardsScreen
              closePlayer={closePlayer}
              card={data.card}
              setSuccessModal={setSuccessModal}
              rewards={rewards}
            />
          )}

          {successModal === "actions_screen" && (
            <ActionsScreen
              closePlayer={closePlayer}
              card={data.card}
              setSuccessModal={setSuccessModal}
            />
          )}

          {successModal === "feedback_screen" && (
            <FeedbackScreen
              closePlayer={closePlayer}
              card={data.card}
              setSuccessModal={setSuccessModal}
            />
          )}

          {successModal === "levelup_screen" && (
            <LevelUpScreen
              closePlayer={closePlayer}
              card={data.card}
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

export default Card;

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
