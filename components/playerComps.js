import { updateCard, updateTutorial } from "../actions/action";

import { Context } from "../context/store";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import StopWatch from "../components/StopWatch";
import _ from "lodash";
import actionIcon from "../assets/player_actions.svg";
import clseIcon from "../assets/close.svg";
import completedIcon from "../assets/player_complete.svg";
import cx from "classnames";
import levelIcon from "../assets/player_lvlup.svg";
import noEnergyIcon from "../assets/player_no_energy.svg";
import progressIcon from "../assets/player_progress.svg";
import rewardsIcon from "../assets/player_rewards.svg";
import styles from "../styles/Player.module.scss";
import { useContext } from "react";
import baseUrl from "../utils/settings";

const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const SliderProgress = ({
  maxSlides,
  currentSlide,
  setIsWarningModalOpen,
  openModal,
}) => {
  return (
    <div className={styles.header}>
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
      <div
        onClick={() => {
          setIsWarningModalOpen(true);
          openModal();
        }}
        className={styles.escapeBtn}
      >
        <img src={clseIcon} height="20px" />
      </div>
    </div>
  );
};

export const SliderHeader = ({ title }) => {
  return (
    <div className={styles.sliderHeader}>
      <div className={styles.sliderTitle}>{title}</div>
    </div>
  );
};

export const CtaQuestions = () => {
  return (
    <div className={styles.ctaBox}>
      <div className="btn btn-disabled btn-stretch">Continue</div>
    </div>
  );
};

export const CtaCorrectAnswer = ({ onContinue }) => {
  return (
    <div className={styles.ctaBox}>
      <div className={styles.ctaBox_header}>
        <div className={styles.ctaBox_image}>
          <img src={`${baseUrl}/checked.png`} height="40px" />
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

export const CtaWrongAnswer = ({ onContinue }) => {
  return (
    <div className={styles.ctaBox}>
      <div className={styles.ctaBox_header}>
        <div className={styles.ctaBox_image}>
          <img src={`${baseUrl}/wrong.png`} height="40px" />
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

export const ContentQuestion = ({
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
            <div className={styles.ideaTitle}>{slide.idea_title}</div>

            <div className={styles.ideaContent}>
              <ReactMarkdown children={slide.idea_content} />
            </div>
            {slide.image && (
              <>
                <div className="description_muted mb1">
                  **Screenshot taken from Actionise**
                </div>
                <div className="flex_center" style={{ marginBottom: "130px" }}>
                  <img src={slide.image.url} alt="" width="95%" />
                </div>
              </>
            )}
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

export const WarningModal = ({ setIsWarningModalOpen, closePlayer }) => {
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

export const GenericScreen = ({ img, title, content, stats, jsx }) => {
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
                  <img src={`${baseUrl}/${s.img}.png`} />
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

export const RepeatScreen = ({ card, mistakes }) => {
  const [store, dispatch] = useContext(Context);
  const isTutorial = card.id === "41";

  return (
    <div>
      <GenericScreen
        img={progressIcon}
        title={"Lesson complete"}
        content={
          isTutorial
            ? "Congratulations for completing the Tutorial! It's time to make real positive changes in your life. Click the button below to start exploring the app!"
            : "Repetion is the root of all knowledge. Now go to actions & put it in practice!"
        }
        stats={[{ img: "gems", label: "Errors", amount: mistakes }]}
      />

      <div className={styles.ctaBox}>
        {isTutorial ? (
          <Link href={`/`} onClick={() => updateTutorial(dispatch, 0)}>
            <div className="btn btn-primary btn-stretch">
              Start your journey
            </div>
          </Link>
        ) : (
          <Link href={`/card/${card.id}`}>
            <div className="btn btn-primary btn-stretch">Back to Card</div>
          </Link>
        )}
      </div>
    </div>
  );
};

export const LevelUpScreen = ({ setSuccessModal, level = 7 }) => {
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

export const ActionsScreen = ({ card }) => {
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

export const RewardsScreen = ({ rewards, setSuccessModal }) => {
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

export const CompleteScreen = ({ card, setSuccessModal }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div>
      <GenericScreen
        img={completedIcon}
        title={"lesson complete"}
        content={"Congratualations!! You have completed the theory check-in!"}
        stats={
          [
            // { img: "gems", label: "Course Progress", amount: "25%" },
            // { img: "play", label: "Practice", amount: `${card.completed}/5` },
          ]
        }
      />
      <div className={styles.ctaBox}>
        <div
          className="btn btn-primary btn-stretch"
          onClick={() => {
            setSuccessModal("rewards_screen");
            updateCard(dispatch, card.id, "complete");
          }}
        >
          1 <img src={`${baseUrl}/energy.png`} height="14px" className="mr5" />{" "}
          Mark as Complete!
        </div>
      </div>
    </div>
  );
};

export const CompleteScreenNoEnergy = ({ card }) => {
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

export const FeedbackScreen = ({ card }) => {
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
