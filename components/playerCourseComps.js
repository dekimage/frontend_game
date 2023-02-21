import { skipAction, updateCard } from "../actions/action";
import { useContext, useEffect, useState } from "react";

import { Context } from "../context/store";
import ReactMarkdown from "react-markdown";
import _ from "lodash";
import { addZeroToInteger } from "../utils/calculations";
import iconCheckmark from "../assets/checkmark.svg";
import styles from "../styles/Player.module.scss";
import { useTimer } from "react-timer-hook";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

//MAYBE IN CARD PLAYER?
export const SuccessModal = ({ closePlayer, card }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div className={styles.cardPlayerSuccessModal}>
      Congratualations! You have completed this card!
      <div
        className="btn btn-success"
        onClick={() => {
          closePlayer();
          updateCard(dispatch, card.id, "complete");
        }}
      >
        Mark as Complete!
      </div>
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
            backgroundImage: `url(${baseUrl}/uploads/cat_a7d3867339.png?updated_at=2022-10-07T12:38:43.522Z)`,
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
  return (
    <div
      className="btn btn-primary"
      onClick={() => {
        handleSkipAction();
      }}
    >
      Skip
      <div className={`${styles.costBox} ml5`}>
        25
        <img height="12px" className="ml25" src={`${baseUrl}/stars.png`} />
      </div>
    </div>
  );
};

const ButtonWithTimer = ({ lastMessage, openNextIdea, goNext }) => {
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

  return (
    <div className={styles.ctaStepWrapper}>
      <div className={styles.ctaStepInfobar}>
        <div className={styles.ctaStepInfobar_nameAndGreen}>
          You are now doing {lastMessage.action.name}
          <div className={styles.greenCircle}></div>
        </div>

        <div className={styles.infoBarStep}>
          Step {lastMessage.step}/{lastMessage.action.steps.length}
        </div>
      </div>

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
          </>
        ) : isLastStep ? (
          <>
            <div className="btn btn-correct btn-twin" onClick={goNext}>
              Complete Action
            </div>

            <div className={styles.stepTimer}>
              <img src={iconCheckmark} height="20px" />
            </div>
          </>
        ) : (
          <>
            <div className="btn btn-correct btn-twin" onClick={goNextStep}>
              Complete Step {lastMessage.step}/{lastMessage.action.steps.length}
            </div>

            <div className={styles.stepTimer}>
              <img src={iconCheckmark} height="20px" />
            </div>
          </>
        )}
      </div>
      {isRunning && !isTimerCompleted && isShowTimer && (
        <SkipAction
          isLastStep={isLastStep}
          goNext={goNext}
          goNextStep={goNextStep}
        />
      )}
    </div>
  );
};

export const ChatCta = ({
  isLastIdea,
  goNext,
  openNextIdea,
  lastMessage,
  currentIdea,
}) => {
  console.log({ lastMessage, currentIdea });
  return (
    <div className="absolute_bottom">
      <div className={styles.ctaBox}>
        {isLastIdea ? (
          <>
            <div className={styles.ctaStepInfobar}>
              Session: {lastMessage.title}
            </div>

            <div className={styles.ctaButtonWrapper}>
              <div className="btn btn-primary" onClick={goNext}>
                Next Slide
              </div>
            </div>
          </>
        ) : (
          <div>
            {lastMessage.type === "idea" && (
              <>
                <div className={styles.ctaStepInfobar}>
                  <div>Session: {lastMessage.title}</div>
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
