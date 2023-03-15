import { addZeroToInteger, getNumberSuffix } from "../utils/calculations";
import { skipAction, updateCard } from "../actions/action";
import { useContext, useEffect, useState } from "react";

import { CompleteCardSection } from "./cardPageComps";
import { Context } from "../context/store";
import { GenericScreen } from "./playerComps";
import ReactMarkdown from "react-markdown";
import _ from "lodash";
import completedIcon from "../assets/player_complete.svg";
import iconCheckmark from "../assets/checkmark.svg";
import { rateCard } from "../actions/action";
import styles from "../styles/Player.module.scss";
import { useTimer } from "react-timer-hook";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

//MAYBE IN CARD PLAYER?
export const RatingModal = ({ closePlayer, cardId }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div className={styles.ratingModal}>
      <div className="header mb1">Was this card helpful?</div>
      <div className="subHeader">Rate me!</div>

      <div>
        {[6, 7, 8].map((emotion, i) => (
          <div
            key={i}
            style={{ border: "2px solid white", height: "50px", width: "50px" }}
            onClick={() => {
              rateCard(dispatch, emotion, cardId);
              closePlayer();
            }}
          ></div>
        ))}
      </div>

      <div className="btn btn-outline" onClick={() => closePlayer()}>
        Skip For Now
      </div>
    </div>
  );
};

export const SuccessModal = ({
  closePlayer,
  card,
  usercard,
  totalTasksCount,
  setIsRatingModalOpen,
}) => {
  const [store, dispatch] = useContext(Context);
  const suffix = getNumberSuffix(usercard.completed);

  const day = card.days[card.last_day || 0];
  const completedContents = usercard.completed_contents || [];
  const contentsLength = day?.contents?.length;
  const completedLength = completedContents.length;

  return (
    <div className={styles.cardPlayerSuccessModal}>
      <div className="header mb1">Congratulations!</div>
      <div className="subHeader"></div>

      <GenericScreen
        img={completedIcon}
        title={"Session Complete"}
        content={
          contentsLength == completedLength
            ? `You have completed your ${usercard.completed}${suffix} session on ${card.name}`
            : "It seems you skipped some actions."
        }
        stats={[
          {
            img: "checked",
            label: "Tasks Completed",
            amount: `${store.completedTasks}/${totalTasksCount}`,
          },
          // {
          //   img: "play",
          //   label: "Skipped Tasks",
          //   amount: store.skippedTasks,
          // },
          {
            img: "mastery",
            label: "Mastery",
            amount: `${usercard.completed}/${usercard.completed_progress_max}`,
          },
        ]}
      />

      <CompleteCardSection
        card={card}
        usercard={usercard}
        contentsLength={contentsLength}
        completedLength={completedLength}
        closePlayer={closePlayer}
        setIsRatingModalOpen={setIsRatingModalOpen}
      />
    </div>
  );
};

export const CatReply = ({ message }) => {
  return (
    <div className="chat-thread">
      <div className="message message-reply">
        <div className="message-content">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={styles.p}>
            <ReactMarkdown children={message.reply} />
          </div>
        </div>
        <div
          className="avatar"
          style={{
            backgroundImage: `url(${baseUrl}/uploads/dogo_4d4f12c4ed.jpg?updated_at=2022-10-08T13:40:49.569Z)`,
          }}
        >
          avatar
        </div>
      </div>
    </div>
  );
};

export const CatContent = ({ message }) => {
  return (
    <div className="chat-thread">
      <div className="message ">
        <div
          className="avatar"
          style={{
            backgroundImage: `url(${baseUrl}/cat.png`,
          }}
        >
          avatar
        </div>
        <div className="message-content">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={styles.p}>
            <ReactMarkdown children={message.content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatResponses = ({ message, selectReply }) => {
  return (
    <div className={styles.responses}>
      {message.responses.map((r, i) => {
        return (
          <div key={i} className={styles.reply} onClick={() => selectReply(r)}>
            {r.reply}
          </div>
        );
      })}
    </div>
  );
};

const SkipAction = ({ isLastStep, goNext, goNextStep }) => {
  const [store, dispatch] = useContext(Context);

  const handleSkipAction = async () => {
    const response = await skipAction(dispatch);
    if (response.success) {
      isLastStep ? goNext() : goNextStep();
    } else {
      //show some error about no sufficent funds
      console.log("not enough stars");
    }
  };
  const freeSkipAction = () => {
    isLastStep ? goNext() : goNextStep();
    dispatch({ type: "SKIP_TASK" });
  };
  return (
    <div
      className="btn btn-primary ml1"
      onClick={() => {
        freeSkipAction();
      }}
    >
      Skip
      {/* <div className={`${styles.costBox} ml5`}>
        25
        <img height="12px" className="ml25" src={`${baseUrl}/stars.png`} />
      </div> */}
    </div>
  );
};

const TodoItem = ({ todo, isChecked, setIsChecked }) => {
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className={styles.todo} onClick={handleToggle}>
      <div className={styles.todo_checkbox}>
        {isChecked && <img src={iconCheckmark} height="14px" />}
      </div>
      <div className={styles.todo_label}>{todo}</div>
    </div>
  );
};

const ButtonWithTimer = ({ lastMessage, openNextIdea, goNext }) => {
  const [store, dispatch] = useContext(Context);
  const [isShowTimer, setIsShowTimer] = useState(!!lastMessage.timer);
  const time = new Date();

  useEffect(() => {
    setIsShowTimer(!!lastMessage.timer);
  }, [lastMessage]);

  const expiryTimestamp = time.setSeconds(
    time.getSeconds() + lastMessage.timer
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

  const isLastStep = lastMessage.action.steps.length === lastMessage.step;

  const goNextStep = () => {
    if (lastMessage.nextStepTimer) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + lastMessage.nextStepTimer);
      restart(time, false);
      setIsTimerCompleted(false);
    }
    openNextIdea();
  };

  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className={styles.ctaStepWrapper}>
      <div className={styles.ctaStepInfobar}>
        <div className={styles.ctaStepInfobar_nameAndGreen}>
          <div className="flex_center">
            You are now doing {lastMessage.action.name}
            <div className={styles.greenCircle}></div>
          </div>
        </div>

        <div className={styles.infoBarStep}>
          Step {lastMessage.step}/{lastMessage.action.steps.length}
        </div>
      </div>

      <TodoItem
        todo={lastMessage.task}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />

      <div className={styles.ctaButtonWrapper}>
        {!isTimerCompleted ? (
          <>
            {isRunning ? (
              <div className="btn btn-disabled btn-twin">Complete</div>
            ) : isShowTimer ? (
              <div className="btn btn-primary btn-twin" onClick={start}>
                Start Timer
              </div>
            ) : (
              <div className="btn btn-primary btn-twin" onClick={goNextStep}>
                Continue
              </div>
            )}
            {isShowTimer && (
              <div className={styles.stepTimer}>
                <div className={styles.stepTimer_image}>
                  <ion-icon name="stopwatch-outline"></ion-icon>
                </div>
                <div className={styles.count}>
                  <span>{addZeroToInteger(minutes, 2)}</span>:
                  <span>{addZeroToInteger(seconds, 2)}</span>
                </div>
              </div>
            )}

            {isRunning && !isTimerCompleted && isShowTimer && (
              <SkipAction
                isLastStep={isLastStep}
                goNext={goNext}
                goNextStep={goNextStep}
              />
            )}
          </>
        ) : isLastStep ? (
          <>
            <div
              className="btn btn-correct btn-twin"
              onClick={() => {
                dispatch({ type: "COMPLETE_TASK" });
                goNext();
              }}
            >
              Complete Action
            </div>

            <div className={styles.stepTimer}>
              <img src={iconCheckmark} height="20px" />
            </div>
          </>
        ) : (
          <>
            <div
              className="btn btn-correct btn-twin"
              onClick={() => {
                dispatch({ type: "COMPLETE_TASK" });
                goNextStep();
              }}
            >
              Complete Step {lastMessage.step}/{lastMessage.action.steps.length}
            </div>

            <div className={styles.stepTimer}>
              <img src={iconCheckmark} height="20px" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ChatCta = ({
  isLastIdea,
  goNext,
  openNextIdea,
  lastMessage,
  currentIdea,
  isLastSlide,
}) => {
  // console.log({ lastMessage, currentIdea });
  return (
    <div className="absolute_bottom">
      <div className={styles.ctaBox}>
        {isLastIdea ? (
          <>
            <div className={styles.ctaStepInfobar}>{lastMessage.title}</div>

            <div className={styles.ctaButtonWrapper}>
              <div className="btn btn-primary" onClick={goNext}>
                {isLastSlide ? "Complete" : "Next Slide"}
              </div>
            </div>
          </>
        ) : (
          <div>
            {lastMessage.type === "idea" && (
              <>
                <div className={styles.ctaStepInfobar}>
                  {!lastMessage.from ? (
                    <div>{lastMessage.title}</div>
                  ) : (
                    <div className="flex_center">
                      You are now doing {lastMessage.action.name}
                      <div className={styles.greenCircle}></div>
                    </div>
                  )}

                  <div className={styles.infoBarStep}>
                    {!lastMessage.from ? (
                      <div>
                        Idea {currentIdea}/{lastMessage.ideasLength}
                      </div>
                    ) : (
                      <div>
                        Step {lastMessage.step}/
                        {lastMessage.action.steps.length}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.ctaButtonWrapper}>
                  <div className="btn btn-primary" onClick={openNextIdea}>
                    Continue
                  </div>
                </div>
              </>
            )}
            {lastMessage.type === "step" && (
              <ButtonWithTimer
                lastMessage={lastMessage}
                openNextIdea={openNextIdea}
                goNext={goNext}
              />
            )}
            {lastMessage.type === "action" && (
              <>
                <div className={styles.ctaStepInfobar}>
                  <div>Get ready for action: {lastMessage.name}</div>
                  <div className={styles.infoBarStep}>
                    {lastMessage.steps.length} Steps
                  </div>
                </div>

                <div className={styles.ctaButtonWrapper}>
                  <div className="btn btn-action" onClick={openNextIdea}>
                    Start Action
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
