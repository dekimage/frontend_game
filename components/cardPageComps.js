import styles from "../styles/CardPage.module.scss";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context/store";
import { useRouter } from "next/router";
import cx from "classnames";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import iconCross from "../assets/close.svg";
import arrowDown from "../assets/arrow-down-white.png";
import checkmark1 from "../assets/checkmark-fill.svg";
import iconCollection from "../assets/progress-play-dark.svg";
import iconLock from "../assets/lock-white-border.svg";

import { static_levels, getMaxQuantity } from "../data/cardPageData";

import {
  updateCard,
  completeAction,
  interactCommunityAction,
  deleteCommunityAction,
  createCommunityAction,
} from "../actions/action";
import { stripSymbols } from "apollo-utilities";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const ActionsWrapper = ({
  label,
  type,
  length,
  actions,
  emptyDescription,
}) => {
  return (
    <>
      <div className={styles.header}>
        <div>{label}</div>
        {/* <div>{length}</div> */}
      </div>
      {actions?.length > 0 ? (
        actions.map((action, i) => {
          return <CommunityAction action={action} type={type} key={i} />;
        })
      ) : (
        <div className={styles.emptyActions}>{emptyDescription}</div>
      )}
    </>
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

export const Action = ({ action }) => {
  const [open, setOpen] = useState(false);
  const [store, dispatch] = useContext(Context);

  return (
    <div className={styles.action}>
      <div className={styles.action_closed} onClick={() => setOpen(!open)}>
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
          <img src={arrowDown} height="20px" />
        </div>
        {action.is_completed && (
          <div className={styles.action_checkmark}>
            <img src={`${baseUrl}/checked.png`} height="25px" />
          </div>
        )}
      </div>

      {open && (
        <div className={styles.action_open}>
          <div className={styles.stats}>
            {action.stats &&
              Object.keys(action.stats)
                .slice(0, 4)
                .map((key, i) => (
                  <ActionStat key={i} label={key} value={action.stats[key]} />
                ))}
          </div>

          <div className={styles.action_instructions}>
            <div className={styles.header}>Instructions</div>
            {action.steps.map((step, i) => {
              return (
                <div className={styles.action_open_step} key={i}>
                  <div className={styles.action_open_stepLabel}>
                    Step {i + 1}
                  </div>
                  {step.content}
                </div>
              );
            })}
          </div>

          <div className={styles.action_tips}>
            <div className={styles.header}>
              <div>Tips</div>
            </div>
            {action.tips && (
              <ReactMarkdown
                children={action.tips}
                className={styles.markdown}
              />
            )}
          </div>

          <div
            className={styles.action_open_complete}
            onClick={() => {
              action.is_completed
                ? completeAction(dispatch, action.id, "remove_complete")
                : completeAction(dispatch, action.id, "complete");
            }}
          >
            <img src={`${baseUrl}/checked.png`} height="25px" className="mr5" />
            {action.is_completed ? "Completed" : "Mark as Complete"}
          </div>
        </div>
      )}
    </div>
  );
};

export const BasicActionsWrapper = ({
  isLevelUnlocked,
  card,
  usercard,
  mergeActions,
  selectedLevel,
}) => {
  return (
    <div style={{ width: "100%" }}>
      {isLevelUnlocked ? (
        card.actions && usercard.completed_actions ? (
          mergeActions(
            usercard,
            card.actions,
            usercard.completed_actions,
            "is_completed"
          ).map((action, i) => {
            return <Action action={action} key={i} />;
          })
        ) : (
          card.actions
            .filter((a) => a.level === selectedLevel)
            .map((action, i) => {
              return <Action action={action} key={i} />;
            })
        )
      ) : (
        <div className={styles.emptyActions}>
          <img
            src={iconLock}
            style={{ height: "35px", marginBottom: "1rem" }}
          />
          Complete the Ideas for this level to unlock Actions.
        </div>
      )}
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

export const CreateActionModal = ({ card }) => {
  const [store, dispatch] = useContext(Context);
  const [data, updateData] = useState({
    action: "",
    duration: 1,
    name: "",
    type: "challenge",
    card: card.id,
    isPrivate: false,
  });

  const onChange = (event) => {
    updateData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <div className={styles.createActionModal}>
      <form action="">
        <label>Name:</label>

        <input onChange={(event) => onChange(event)} type="text" name="name" />

        <label>Action: (Max 500 words.)</label>

        <input
          onChange={(event) => onChange(event)}
          type="text"
          name="action"
        />
        <div
          onClick={() => updateData({ ...data, isPrivate: !data.isPrivate })}
        >
          {data.isPrivate ? "Private" : "Public"}
        </div>
        {data.isPrivate &&
          "Warning! Only you can see this action and other member will not benefit from your knowledge."}
        <label>Duration (minutes):</label>

        <input
          onChange={(event) => onChange(event)}
          type="number"
          name="duration"
        />
      </form>
      <div
        className="btn btn-primary"
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

export const FavoriteButton = ({ usercard, cardId }) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div
      className={styles.favorite}
      onClick={() => updateCard(dispatch, cardId, "favorite")}
    >
      {usercard.is_favorite ? (
        <img src={`${baseUrl}/favorite.png`} height="25px" />
      ) : (
        <img src={`${baseUrl}/notFavorite.png`} height="25px" />
      )}
    </div>
  );
};

export const BackButton = ({ routeStatic, routeDynamic, isBack = false }) => {
  const router = useRouter();
  return (
    <>
      {isBack ? (
        <div className={styles.backButton} onClick={() => router.back()}>
          <ion-icon name="chevron-back-outline"></ion-icon>
        </div>
      ) : (
        <Link href={`${routeStatic}${routeDynamic}`}>
          <div className={styles.backButton}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>
        </Link>
      )}
    </>
  );
};

export const UpgradeButton = ({ isLevelUnlocked, usercard, maxQuantity }) => {
  return (
    <div>
      {isLevelUnlocked ? (
        usercard.quantity >= maxQuantity ? (
          <div
            className="btn btn-action"
            onClick={() => updateCard(dispatch, card.id, "upgrade")}
          >
            Upgrade
          </div>
        ) : (
          <div className="btn btn-disabled">Upgrade</div>
        )
      ) : usercard && usercard.quantity >= 10 ? (
        <div
          className="btn btn-action"
          onClick={() => updateCard(dispatch, card.id, "unlock")}
        >
          <img src={iconCollection} height="14px" /> 10 Unlock
        </div>
      ) : (
        <div className="btn btn-disabled">Unlock</div>
      )}
    </div>
  );
};

export const LevelButtons = ({ usercard, selectedLevel, setSelectedLevel }) => {
  return (
    <div className={styles.section_levels}>
      {static_levels.map((level, i) => {
        return (
          <div className={styles.level_box} key={i}>
            {level.lvl < usercard.completed + 1 && (
              <div
                className={cx(styles.btn_play_passed, {
                  [styles.btn_play_active]: selectedLevel === level.lvl,
                })}
                onClick={() => setSelectedLevel(level.lvl)}
              >
                <ion-icon name="play"></ion-icon>
              </div>
            )}
            {level.lvl == usercard.completed + 1 && (
              <div
                className={cx(styles.btn_play_orange, {
                  [styles.btn_play_active]: selectedLevel === level.lvl,
                })}
                onClick={() => setSelectedLevel(level.lvl)}
              >
                <ion-icon name="play"></ion-icon>
              </div>
            )}
            {level.lvl > usercard.completed + 1 &&
              usercard.level >= level.required && (
                <div
                  className={cx(styles.btn_play_grayopen, {
                    [styles.btn_play_active]: selectedLevel === level.lvl,
                  })}
                >
                  <ion-icon name="play"></ion-icon>
                </div>
              )}
            {level.lvl > usercard.completed + 1 &&
              usercard.level < level.required && (
                <div className={styles.btn_play_graylocked}>
                  <ion-icon name="lock-closed-outline"></ion-icon>
                </div>
              )}
            {level.lvl}
          </div>
        );
      })}
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

export const CardCtaFooter = ({
  isPremiumLocked,
  isLevelUnlocked,
  card,
  usercard,
  selectedLevel,
  maxQuantity,
}) => {
  const [store, dispatch] = useContext(Context);
  const router = useRouter();
  return (
    <div className={styles.fixed}>
      {isPremiumLocked ? (
        <div
          className="btn"
          onClick={() => {
            router.push(`${feUrl}/shop`);
          }}
        >
          <ion-icon name="lock-closed-outline"></ion-icon>
          Purchase Expansion
        </div>
      ) : card.is_open ? (
        <PlayCta
          card={card}
          maxQuantity={maxQuantity}
          selectedLevel={selectedLevel}
          dispatch={dispatch}
          usercard={usercard}
          isLevelUnlocked={isLevelUnlocked}
        />
      ) : !card.is_unlocked ? (
        <div
          className={cx(usercard.quantity >= 10 ? "btn btn-action" : "btn")}
          onClick={() =>
            usercard.quantity >= 10 && updateCard(dispatch, card.id, "unlock")
          }
        >
          <ion-icon name="lock-closed-outline"></ion-icon>
          <div className="ml5">
            {usercard.quantity >= 10 ? "Unlock" : "Collect 10 to Unlock"}
          </div>
        </div>
      ) : (
        <PlayCta
          card={card}
          maxQuantity={maxQuantity}
          selectedLevel={selectedLevel}
          dispatch={dispatch}
          usercard={usercard}
          isLevelUnlocked={isLevelUnlocked}
        />
      )}
    </div>
  );
};
