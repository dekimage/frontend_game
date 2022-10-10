import { useQuery } from "@apollo/react-hooks";
import { useState, useEffect, useContext, useRef } from "react";
import { useTimer } from "react-timer-hook";
import { addZeroToInteger } from "../../../utils/calculations";
import { Context } from "../../../context/store";
import { useRouter } from "next/router";

import _ from "lodash";

import Modal from "../../../components/Modal";

import useModal from "../../../hooks/useModal";

import { normalize } from "../../../utils/calculations";

import { GET_COURSE_ID } from "../../../GQL/query";

import Timer from "../../../components/Timer";

import { ChatAction } from "../../../components/cardPageComps";

import iconCheckmark from "../../../assets/checkmark.svg";

const feUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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

const CatReply = ({ message }) => {
  return (
    <div className="chat-thread">
      <div className="message message-reply">
        <div className="message-content">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>{message.reply}</p>
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

const CatContent = ({ message }) => {
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
          <p>{message.content}</p>
        </div>
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
    </div>
  );
};

const ChatCta = ({
  isLastIdea,
  goNext,
  openNextIdea,
  lastMessage,
  currentIdea,
}) => {
  console.log(lastMessage);
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
                    Idea {currentIdea}/{lastMessage.ideasLength}
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

export const ContentTheory = ({ slide, goNext }) => {
  const createChat = (slide) => {
    const action = slide.action;
    const responses = slide.responses;

    const ideasLength = slide.storyline.split("\n\n").length;
    const ideas = slide.storyline.split("\n\n").map((string) => {
      return {
        content: string,
        type: "idea",
        title: slide.title,
        ideasLength,
      };
    });

    let chat = ideas;
    if (action) {
      const actionSteps = action.steps.map((step, i) => {
        const index = i + 1 === action.steps.length ? i : i + 1;

        return {
          ...step,
          type: "step",
          step: i + 1,
          action: action,
          nextStepTimer: action.steps[index].timer,
          title: slide.title,
        };
      });
      chat.push({ ...action, type: "action", title: slide.title });
      chat = chat.concat([...actionSteps]);
    }
    if (responses) {
      const replies = responses.responses.map((res) => {
        return { ...res, type: "reply", title: slide.title };
      });
      chat = chat.concat([...replies]);
    }

    return chat;
  };

  const ideas = createChat(slide);

  const isFirstSlideFinal = ideas.length === ideas.length;

  const [activeChat, setActiveChat] = useState([ideas[0]]);
  const [isLastIdea, setIsLastIdea] = useState(isFirstSlideFinal);

  const lastMessage = activeChat[activeChat.length - 1];
  // console.log(111, ideas);

  useEffect(() => {
    if (activeChat !== slide) {
      const ideas = createChat(slide);
      setActiveChat([ideas[0]]);
      const isFirstSlideFinal = activeChat.length === ideas.length;
      setIsLastIdea(isFirstSlideFinal);
    }
  }, [slide]);

  const openNextIdea = () => {
    const index = activeChat.length;

    if (index === ideas.length) {
      setIsLastIdea(true);
    }

    setActiveChat([...activeChat, ideas[index]]);

    // removed after fixing multiple elements mapping
    setCurrentIdea(currentIdea + 1);
  };

  // make it scroll
  const bottom = useRef(null);
  const scrollToBottom = () => {
    bottom.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  // removed after fixing multiple elements mapping
  const [currentIdea, setCurrentIdea] = useState(1);

  return (
    <div className={styles.contentTheory}>
      {activeChat.map((message, i) => {
        return (
          <div className={styles.chatWrapper} key={i}>
            {message.type === "idea" && (
              <CatContent message={message} key={i} />
            )}
            {message.type === "step" && (
              <CatContent message={message} key={i} />
            )}
            {message.type === "reply" && <CatReply message={message} key={i} />}
            {message.type === "action" && (
              <ChatAction action={message} startAction={openNextIdea} />
            )}
          </div>
        );
      })}

      <div
        style={{
          marginTop: "4rem",
        }}
        ref={bottom}
      ></div>

      <ChatCta
        isLastIdea={isLastIdea}
        goNext={goNext}
        openNextIdea={openNextIdea}
        lastMessage={lastMessage}
        currentIdea={currentIdea}
      />
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

  const [chatSlides, setChatSlides] = useState(false);

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

      setChatSlides([
        gql_data.course.days[last_completed_day - 1].contents[
          last_completed_content - 1
        ],
      ]);
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
      setChatSlides([...chatSlides, slides[index]]);
    }
  };

  // const lastMessage = activeChat[activeChat.length - 1];

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

          <SliderHeader
            title={slide.title}
            rewards={rewards}
            closePlayer={closePlayer}
          />

          {chatSlides.map((slide, i) => {
            return <ContentTheory slide={slide} goNext={goNext} key={i} />;
          })}

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
