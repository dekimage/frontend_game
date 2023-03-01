import {
  completeAction,
  createCommunityAction,
  deleteCommunityAction,
  interactCommunityAction,
  updateCard,
} from "../actions/action";
import { useContext, useEffect, useState } from "react";

import { Context } from "../context/store";
import { GenericDropDown } from "../pages/problems";
import Link from "next/link";
import Timer from "./reusable/Timer";
import arrowDown from "../assets/arrow-down-white.png";
import { buyCardTicket } from "../actions/action";
import checkmark1 from "../assets/checkmark-fill.svg";
import cx from "classnames";
import iconCross from "../assets/close.svg";
import styles from "../styles/CardPage.module.scss";
import { useRouter } from "next/router";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const ActionsWrapper = ({
  label,
  type,
  length,
  actions,
  emptyDescription,
  openModal,
}) => {
  return (
    <div className={styles.actionWrapper}>
      <div className={styles.header}>
        <div>{label}</div>
        {/* <div>{length}</div> */}
      </div>
      {label === "My Actions" && actions?.length > 0 && (
        <div className="btn  btn-primary mt1" onClick={() => openModal()}>
          + Create New Action
        </div>
      )}
      {actions?.length > 0 ? (
        actions.map((action, i) => {
          return <CommunityAction action={action} type={type} key={i} />;
        })
      ) : (
        <>
          <div className={styles.emptyActions}>
            {emptyDescription}
            <div className="btn  btn-primary mt1" onClick={() => openModal()}>
              + Create New Action
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ActionStat = ({ label, value }) => {
  return (
    <div className={styles.stat}>
      <div className={styles.stat_label}>{label}</div>
      <div className={styles.stat_value}>{value}/10</div>
    </div>
  );
};

export const ChatAction = ({ action }) => {
  return (
    <div className={styles.action}>
      <div className={styles.action_closed}>
        <div className={styles.action_img}>
          {action.image?.url && <img src={`${baseUrl}${action.image.url}`} />}
        </div>
        <div className={styles.action_box}>
          <div className={styles.action_header}>
            <div className={styles.action_name}>{action.name}</div>
            <div className={styles.action_grouper}></div>
          </div>
          <div className={styles.action_header}>
            <div className={styles.action_grouper}>
              <div className={styles.action_type}>{action.type}</div>
              <div className={styles.action_duration}>
                {action.duration} min
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Action = ({ action }) => {
  return (
    <Link href={`/action/${action.id}`}>
      <div className={styles.action}>
        <div className={styles.action_closed}>
          <div className={styles.action_img}>
            {action.image?.url && <img src={`${baseUrl}${action.image.url}`} />}
          </div>
          <div className={styles.action_box}>
            <div className={styles.action_header}>
              <div className={styles.action_name}>{action.name}</div>
              <div className={styles.action_grouper}></div>
            </div>
            <div className={styles.action_header}>
              <div className={styles.action_grouper}>
                <div className={styles.action_type}>{action.type}</div>
                <div className={styles.action_duration}>
                  {action.duration} min
                </div>
              </div>
            </div>
          </div>
          <div className={styles.action_arrow}>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
          {action.is_completed && (
            <div className={styles.action_checkmark}>
              <img src={`${baseUrl}/checked.png`} height="25px" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export const BasicActionsWrapper = ({ card, usercard, mergeActions }) => {
  return (
    <div style={{ width: "100%", marginBottom: "2rem" }}>
      {card.actions && usercard.completed_actions
        ? mergeActions(
            usercard,
            card.actions,
            usercard.completed_actions,
            "is_completed"
          ).map((action, i) => {
            return <Action action={action} key={i} />;
          })
        : card.actions.map((action, i) => {
            return <Action action={action} key={i} />;
          })}
    </div>
  );
};

export const CommunityAction = ({ action, type }) => {
  const [open, setOpen] = useState(false);
  const [store, dispatch] = useContext(Context);
  return (
    <div className={styles.action}>
      <div className={styles.action_closed} onClick={() => setOpen(!open)}>
        <div className={styles.action_votingBox}>
          <div>
            <img src={`${baseUrl}/upvote.png`} height="24px" />
          </div>
          <div>{action.votes || 0}</div>
        </div>

        <div className={styles.action_box}>
          <div className={styles.action_header}>
            <div className={styles.action_name}>{action.name}</div>
            <div className={styles.action_grouper}></div>
          </div>
          <div className={styles.action_header}>
            <div className={styles.action_grouper}>
              <div className={styles.action_type}>{action.type}</div>
              <div className={styles.action_duration}>
                {action.duration} min
              </div>
            </div>
          </div>
        </div>
        <div className={styles.action_arrow}>
          <img src={arrowDown} height="20px" />
        </div>
        {action.isCompleted && (
          <div className={styles.action_checkmark}>
            <img src={`${baseUrl}/checked.png`} height="25px" />
          </div>
        )}
      </div>

      {open && (
        <div className={styles.action_open}>
          {action.steps.map((step, i) => {
            return (
              <div className={styles.action_open_step} key={i}>
                <div className={styles.action_open_stepLabel}>Step {i + 1}</div>
                {step.content}
              </div>
            );
          })}

          {type === "community" && (
            <>
              <div
                className={styles.action_open_complete}
                onClick={() =>
                  interactCommunityAction(
                    dispatch,
                    action.id,
                    action.isClaimed ? "remove_add" : "add"
                  )
                }
              >
                {action.isClaimed ? (
                  <div className="flex_center">
                    <img src={iconCross} height="16px" className="mr1" />
                    Remove from My Actions
                  </div>
                ) : (
                  <div className="flex_center">
                    <img src={iconCross} height="20px" className="mr1" />
                    Add to My Actions
                  </div>
                )}
              </div>
              <div className={styles.votingContainer}>
                <div
                  className={styles.upvoteBtn}
                  onClick={() =>
                    interactCommunityAction(
                      dispatch,
                      action.id,
                      action.isUpvoted ? "remove_vote" : "vote"
                    )
                  }
                >
                  <img
                    src={`${baseUrl}/upvote.png`}
                    height="18px"
                    className="mr1"
                  />
                  {action.isUpvoted ? "Remove Vote" : "Upvote"}
                </div>
                <div
                  className={styles.upvoteBtn}
                  onClick={() =>
                    interactCommunityAction(
                      dispatch,
                      action.id,
                      action.isReported ? "remove_report" : "report"
                    )
                  }
                >
                  <img
                    src={`${baseUrl}/flag.png`}
                    height="18px"
                    className="mr1"
                  />
                  {action.isReported ? "Remove Report" : "Report"}
                </div>
              </div>
            </>
          )}

          {type === "my" && (
            <>
              <div
                className={styles.action_open_complete}
                onClick={() =>
                  interactCommunityAction(
                    dispatch,
                    action.id,
                    action.isClaimed ? "remove_add" : "add"
                  )
                }
              >
                <img src={`${baseUrl}/checked.png`} height="25px" />
                {action.isClaimed
                  ? "Remove from My Actions"
                  : "Add to My Actions"}
              </div>
              <div className={styles.votingContainer}>
                <div
                  className={styles.upvoteBtn}
                  onClick={() => deleteCommunityAction(dispatch, action.id)}
                >
                  <img
                    src={`${baseUrl}/trash.png`}
                    height="18px"
                    className="mr1"
                  />
                  Delete
                </div>
              </div>
            </>
          )}

          {type === "added" && (
            <>
              <div
                className={styles.action_open_complete}
                onClick={() =>
                  interactCommunityAction(dispatch, action.id, "remove_add")
                }
              >
                <img src={`${baseUrl}/checked.png`} height="40px" />
                Remove from My Actions
              </div>
              <div
                className={styles.action_open_complete}
                onClick={() => {
                  action.isCompleted
                    ? interactCommunityAction(
                        dispatch,
                        action.id,
                        "remove_complete"
                      )
                    : interactCommunityAction(dispatch, action.id, "complete");
                }}
              >
                <img src={checkmark1} height="30px" className="mr1" />
                {action.isCompleted ? "Completed" : "Mark as Complete"}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Step = ({ step, index, removeStep, changeStep }) => {
  return (
    <div className={styles.step}>
      <div className={styles.stepIndex}>{index + 1}</div>
      <textarea
        onChange={(event) => changeStep(event.target.value, step.id)}
        type="text"
        name="step"
        placeholder={`Step ${index + 1}...`}
        className={styles.inputTips}
        style={{ height: "6rem" }}
      />
      <div
        className={styles.removeStep}
        onClick={() => {
          removeStep(step.id);
        }}
      >
        <span aria-hidden="true">&times;</span>
      </div>
    </div>
  );
};

const Instructions = ({}) => {
  const [steps, setSteps] = useState([]);
  const removeStep = (id) => {
    setSteps((current) => current.filter((step) => step.id !== id));
  };
  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: steps.length > 0 ? steps[steps.length - 1].id + 1 : 1,
        content: "",
      },
    ]);
  };

  const changeStep = (stepContent, id) => {
    const newState = steps.map((step) => {
      if (step.id === id) {
        return { ...step, content: stepContent };
      }
      return step;
    });
    setSteps(newState);
  };

  return (
    <div>
      {steps.map((step, i) => (
        <Step
          step={step}
          key={i}
          index={i}
          changeStep={changeStep}
          removeStep={removeStep}
        />
      ))}
      <div className={styles.addStep} onClick={() => addStep()}>
        <img
          src={`${baseUrl}/plus-step.png`}
          className="mr5"
          height="34px"
          alt=""
        />
        ADD STEPS
        {/* <div className="btn btn-blank">
          <span style={{ fontSize: "24px" }}>+</span>ADD STEP
        </div> */}
      </div>
    </div>
  );
};

export const CreateActionModal = ({ card }) => {
  const [store, dispatch] = useContext(Context);
  const [data, updateData] = useState({
    action: "",
    duration: 1,
    tips: "",
    name: "",
    type: "challenge",
    card: card.id,
    isPrivate: false,
  });

  const actionTypesData = ["Triggered", "Repeatable", "One Time"];

  const setActionType = (type) => {
    updateData({ ...data, type: type });
  };

  const onChange = (event) => {
    updateData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <div className={styles.createActionModal}>
      <div className={styles.header}>Action Creator</div>
      <form action="">
        <div className={styles.label}>Name</div>

        <input
          onChange={(event) => onChange(event)}
          type="text"
          name="name"
          placeholder="Example `Focus Meditation` "
          className={styles.inputTips}
        />

        <div>
          <div className={styles.label}>Type</div>
          <GenericDropDown
            items={actionTypesData}
            label="Type"
            callback={setActionType}
          />

          <div className={styles.label}>Duration (Minutes)</div>

          <input
            onChange={(event) => onChange(event)}
            type="number"
            name="duration"
            className={styles.inputTips}
            placeholder="10"
          />
        </div>

        <div className={styles.label}>Steps</div>

        <Instructions />

        <div className={styles.label}>Tips</div>

        <textarea
          onChange={(event) => onChange(event)}
          type="text"
          name="tips"
          placeholder="1. Tip One..."
          className={styles.inputTips}
          style={{ height: "10rem" }}
        />
      </form>

      {/* <div
        className="btn btn-blank"
        onClick={() => updateData({ ...data, isPrivate: !data.isPrivate })}
      >
        {data.isPrivate ? "Private" : "Public"}
      </div>

      {data.isPrivate &&
        "Warning! Only you can see this action and other member will not benefit from your knowledge."} */}
      <div
        className="btn btn-primary mt1"
        onClick={() => createCommunityAction(dispatch, data)}
      >
        Create
      </div>
    </div>
  );
};

export const PlayCta = ({
  card,
  maxQuantity,
  selectedLevel,
  dispatch,
  usercard,
  isLevelUnlocked,
}) => {
  const router = useRouter();
  return isLevelUnlocked ? (
    <div
      className={cx(
        selectedLevel == usercard.completed + 1 ? "btn btn-action" : "btn"
      )}
      onClick={() => {
        dispatch({
          type: "OPEN_PLAYER",
          data: { level: usercard.completed, selectedLevel },
        });
        router.push(`${feUrl}/card/player/${card.id}`);
      }}
    >
      <ion-icon name="play"></ion-icon> Play Day {selectedLevel}
    </div>
  ) : (
    <div
      className={cx(
        usercard.quantity >= maxQuantity ? "btn btn-action" : "btn btn-disabled"
      )}
      onClick={() => {
        usercard.quantity >= maxQuantity &&
          updateCard(dispatch, card.id, "upgrade");
      }}
    >
      <ion-icon name="lock-closed-outline"></ion-icon>&nbsp;
      <div>Upgrade Card &nbsp;</div>
      <div>
        {usercard.quantity}/{maxQuantity}
      </div>
    </div>
  );
};

export const FavoriteButton = ({ isFavorite, id, type }) => {
  //type == "action" or "card"
  const [store, dispatch] = useContext(Context);

  return (
    <div
      className={styles.favorite}
      onClick={() => updateCard(dispatch, id, `favorite_${type}`)}
    >
      {isFavorite ? (
        <img src={`${baseUrl}/favorite.png`} height="25px" />
      ) : (
        <img src={`${baseUrl}/notFavorite.png`} height="25px" />
      )}
    </div>
  );
};

export const IdeaPlayer = ({ cardId }) => {
  const router = useRouter();
  return (
    <div className={styles.ideaPlayer}>
      <div className="">
        <div className="title">Player</div>
        <div className={styles.ideaPlayer_group}>
          <div className="description mr1">6 Slides</div>
          <div className="description">2 Questions</div>
        </div>
      </div>

      <div
        className={styles.btn_play_passed}
        onClick={() => {
          router.push(`${feUrl}/card/player/${cardId}`);
        }}
      >
        <ion-icon name="play"></ion-icon>
      </div>
    </div>
  );
};

export const Title = ({ name, rightText, rightSeparator }) => {
  return (
    <div className={styles.titleProgress}>
      <div className="title">{name}</div>
      {rightText && (
        <div className="title">
          {rightText}
          {rightSeparator && `/${rightSeparator}`}
        </div>
      )}
    </div>
  );
};

export const CompleteCardSection = ({
  card,
  usercard,
  contentsLength,
  completedLength,
}) => {
  const [store, dispatch] = useContext(Context);

  const [isMoreThan24HoursAgo, setIsMoreThan24HoursAgo] = useState(null);

  useEffect(() => {
    if (usercard) {
      const newIsMoreThan24HoursAgo = calcIsMoreThan24HoursAgo(
        usercard.completed_at
      );
      setIsMoreThan24HoursAgo(newIsMoreThan24HoursAgo);
    }
  }, [usercard]);

  function calcIsMoreThan24HoursAgo(last_completed) {
    if (!last_completed) {
      return false;
    }

    const now = Date.now();
    const timeDiff = now - last_completed;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    if (hoursDiff >= 24) {
      return false;
    }
    return 86400000 - timeDiff;
  }

  return (
    <div style={{ marginBottom: "4rem" }}>
      {isMoreThan24HoursAgo ? (
        <div className="btn btn-primary">
          You can complete this card again in xx;xx
          <Timer
            timeLeftProp={isMoreThan24HoursAgo}
            jsxComplete={<div className="btn btn-correct">Refresh</div>}
            // onComplete={onComplete}
          />
        </div>
      ) : contentsLength === completedLength ? (
        <div
          className="btn btn-primary"
          onClick={() => updateCard(dispatch, card.id, "complete")}
        >
          Complete Card + mastery symbol
        </div>
      ) : (
        <div
          className="btn btn-disabled"
          onClick={() => updateCard(dispatch, card.id, "complete")}
        >
          Complete {completedLength} / {contentsLength}
        </div>
      )}
    </div>
  );
};

export const CardCtaFooter = ({ isUnlocked, card }) => {
  const [store, dispatch] = useContext(Context);
  const hasStars = store?.user?.stars >= card.cost;
  const energy = store?.user?.energy;
  const cardTickets = store?.user?.card_tickets || [];
  const isTicketPurchased = !!cardTickets.find((c) => c.id == card.id);
  const is_subscribed = store?.user?.is_subscribed;

  const router = useRouter();

  const openPlayerAfterTicket = () => {
    router.push(`${feUrl}/card/player/${card.id}`);
  };

  return (
    <div className={styles.fixed}>
      {!isUnlocked ? (
        hasStars ? (
          <div
            className="btn btn-correct"
            onClick={() => {
              updateCard(dispatch, card.id, "unlock");
            }}
          >
            {card.cost}
            <img height="12px" className="ml25" src={`${baseUrl}/stars.png`} />
          </div>
        ) : (
          <div className="btn btn-disabled">
            <span className="text-red">{card.cost}</span>{" "}
            <img height="12px" className="ml25" src={`${baseUrl}/stars.png`} />
          </div>
        )
      ) : (
        <div className={styles.fixed}>
          {isTicketPurchased || is_subscribed ? (
            <div
              className="btn btn-primary"
              onClick={() => {
                router.push(`${feUrl}/card/player/${card.id}`);
              }}
            >
              {store.isLoading ? <div>Spinner</div> : <div>Play</div>}
            </div>
          ) : (
            <div
              className={cx(
                energy > 0 ? "btn btn-primary" : "btn btn-disabled"
              )}
              onClick={() => {
                if (energy > 0) {
                  buyCardTicket(
                    dispatch,
                    card.id,
                    "card",
                    openPlayerAfterTicket
                  );
                }
              }}
            >
              {store.isLoading ? (
                <div>Spinner</div>
              ) : (
                <div>
                  Play
                  <span className="ml5 md">1</span>
                  <img src={`${baseUrl}/energy.png`} height="20px" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
