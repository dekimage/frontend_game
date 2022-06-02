import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import _ from "lodash";
import styles from "../../styles/CardPage.module.scss";
import ProgressBar from "../../components/ProgressBar";
import Modal from "../../components/Modal";
import useModal from "../../hooks/useModal";
import cx from "classnames";
import {
  updateCard,
  completeAction,
  interactCommunityAction,
  deleteCommunityAction,
  createCommunityAction,
} from "../../actions/action";

import iconCross from "../../assets/close.svg";
import iconCommon from "../../assets/common-rarity.svg";
import iconRare from "../../assets/rare-rarity.svg";
import iconEpic from "../../assets/epic-rarity.svg";
import iconLegendary from "../../assets/legendary-rarity.svg";
import arrowDown from "../../assets/arrow-down-white.png";
import checkmark1 from "../../assets/checkmark-fill.svg";
import iconLock from "../../assets/lock-white-border.svg";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getMaxQuantity = (level) => {
  const data = {
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 10,
  };
  return data[level];
};

const GET_USERCARDS_QUERY = gql`
  query ($id: ID!) {
    usercard(id: $id) {
      id
      card {
        id
        name
        description
        type
        rarity
        expansion {
          id
          name
        }
        isOpen
        actions {
          id
          name
          type
          level
          duration
          steps {
            content
          }
        }
        community_actions {
          id
          name
          type
          duration
          steps {
            content
          }
          votes
          reports
          user {
            id
            username
          }
        }
        realm {
          id
          color
          name
          background {
            url
          }
        }
        image {
          url
        }
      }
      is_favorite
      level
      completed
      quantity
      is_new
      glory_points
      isUnlocked
      completed_actions {
        id
      }

      community_actions_claimed {
        id
        user {
          id
          username
        }
        type
        votes
        reports
        name
        duration
        steps {
          content
        }
      }
      my_community_actions {
        id
        user {
          id
          username
        }
        type
        votes
        reports
        name
        duration
        steps {
          content
        }
        isPrivate
      }
      upvoted_actions {
        id
      }
      community_actions_completed {
        id
      }
      reported_actions {
        id
      }
    }
  }
`;

const GET_CARD_ID = gql`
  query ($id: ID!) {
    card(id: $id) {
      id
      name
      description
      type
      rarity
      expansion {
        id
        name
      }
      isOpen
      community_actions {
        id
        name
        type
        duration
        steps {
          content
        }
        votes
        reports
        user {
          id
          username
        }
      }
      actions {
        id
        name
        type
        level
        duration
        steps {
          content
        }
      }
      realm {
        id
        color
        name
        background {
          url
        }
      }
      image {
        url
      }
    }
  }
`;

export const CommunityAction = ({ action, type }) => {
  const [open, setOpen] = useState(false);
  const [store, dispatch] = useContext(Context);
  const router = useRouter();
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
            <img src={checkmark1} height="25px" />
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
                <img src={checkmark1} height="30px" className="mr1" />
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
                <img src={checkmark1} height="30px" className="mr1" />
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

const Action = ({ action }) => {
  const [open, setOpen] = useState(false);
  const [store, dispatch] = useContext(Context);
  const router = useRouter();
  return (
    <div className={styles.action}>
      <div className={styles.action_closed} onClick={() => setOpen(!open)}>
        <div className={styles.action_img}></div>
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
        <div className={styles.action_checkmark}>
          <img src={checkmark1} height="25px" />
        </div>
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

          <div
            className={styles.action_open_complete}
            onClick={() => {
              action.isCompleted
                ? completeAction(dispatch, action.id, "remove_complete")
                : completeAction(dispatch, action.id, "complete");
            }}
          >
            <img src={checkmark1} height="30px" className="mr1" />
            {action.isCompleted ? "Completed" : "Mark as Complete"}
          </div>
        </div>
      )}
    </div>
  );
};

const static_levels = [
  { lvl: 1, required: 1 },
  { lvl: 2, required: 2 },
  { lvl: 3, required: 3 },
  { lvl: 4, required: 4 },
  { lvl: 5, required: 5 },
];

const CreateActionModal = ({ card }) => {
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

const PlayCta = ({
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

const CardPage = ({ dataUserCard, dataCard }) => {
  const proxyUserCard = {
    level: 1,
    completed: 0,
    quantity: 0,
  };
  const [store, dispatch] = useContext(Context);

  const { isShowing, openModal, closeModal } = useModal();

  const usercard = dataUserCard ? dataUserCard : proxyUserCard;
  const maxQuantity = getMaxQuantity(usercard.level) || 10;
  const [selectedLevel, setSelectedLevel] = useState(
    usercard && usercard.completed + 1
  );
  // const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("community");

  useEffect(() => {
    if (dataUserCard && dataUserCard.is_new) {
      updateCard(dispatch, card.id, "new_disable");
    }
  }, [dataUserCard]);

  const router = useRouter();
  const card = usercard.card || dataCard.card;

  const isPremiumLocked =
    card.expansion.name === "Pro" &&
    store.user.expansions.filter((e) => e.name === "Pro").length === 0;

  const mergeActions = (usercard, actions, checkingArray, keyword) => {
    const result = actions.map((action) => {
      return {
        ...action,
        [keyword]: !!checkingArray.filter((a) => a.id === action.id)[0],
        isReported: !!usercard.reported_actions.filter(
          (a) => a.id === action.id
        )[0],
        isUpvoted: !!usercard.upvoted_actions.filter(
          (a) => a.id === action.id
        )[0],
      };
    });
    return result;
  };

  const isLevelUnlocked =
    usercard.level >= selectedLevel && selectedLevel <= usercard.completed + 1;

  const communityActions =
    dataUserCard &&
    mergeActions(
      usercard,
      card.community_actions,
      usercard.community_actions_claimed,
      "isClaimed"
    );

  const addedActions =
    dataUserCard &&
    mergeActions(
      usercard,
      usercard.community_actions_claimed,
      usercard.community_actions_completed,
      "isCompleted"
    );

  const myActions =
    dataUserCard &&
    mergeActions(
      usercard,
      usercard.my_community_actions,
      usercard.community_actions_claimed,
      "isClaimed"
    );

  return (
    <div className="section_container">
      <div className={styles.card}>
        <div
          className={styles.favorite}
          onClick={() => updateCard(dispatch, card.id, "favorite")}
        >
          {usercard.is_favorite ? (
            <img src={`${baseUrl}/favorite.png`} height="25px" />
          ) : (
            <img src={`${baseUrl}/notFavorite.png`} height="25px" />
          )}
        </div>
        <Link href={`/realm/${card.realm.id}`}>
          <div className={styles.backButton}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>
        </Link>

        <img className={styles.image} src={`${baseUrl}${card.image.url}`} />
        <div
          className={styles.background}
          style={{ "--background": card.realm.color }}
        ></div>
        <div
          className={styles.curve}
          style={{ "--background": card.realm.color }}
        ></div>
        <div className={styles.section_name}>
          <div className={styles.name}>
            <div className={styles.realmLogo}>
              <img
                src={`${baseUrl}${card.realm.background.url}`}
                height="36px"
              />
            </div>
            {card.name}
          </div>
        </div>

        <div className={styles.section_level}>
          <div className={styles.level}>
            <span style={{ fontSize: "40px" }}>{usercard.level}</span> lvl
          </div>
          <div className={styles.progress_box}>
            <span>
              {usercard.quantity}/{maxQuantity}
            </span>
            <ProgressBar
              progress={usercard.quantity}
              max={maxQuantity}
              isReadyToClaim={usercard.quantity >= maxQuantity}
            />
          </div>
          {usercard.quantity >= maxQuantity ? (
            <div
              className="btn btn-action"
              onClick={() => updateCard(dispatch, card.id, "upgrade")}
            >
              Upgrade
            </div>
          ) : (
            <div className="btn btn-disabled">Upgrade</div>
          )}
        </div>

        <div className={styles.description}>{card.description}</div>

        <div className={styles.titleProgress}>
          <div className="title">Progress</div>
          <div className="title">{usercard.completed}/5</div>
        </div>

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

        <div className={styles.titleProgress}>
          <div className="title">Ideas</div>
        </div>

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
              router.push(`${feUrl}/card/player/${card.id}`);
            }}
          >
            <ion-icon name="play"></ion-icon>
          </div>
        </div>
        <div className={styles.header}>
          <div>Actions </div>
          <div>Level {selectedLevel}</div>
        </div>

        {isLevelUnlocked ? (
          card.actions &&
          dataUserCard &&
          mergeActions(
            usercard,
            card.actions,
            usercard.completed_actions,
            "isCompleted"
          )
            .filter((a) => a.level === selectedLevel)
            .map((action, i) => {
              return <Action action={action} key={i} />;
            })
        ) : (
          <div className={styles.emptyActions}>
            <img
              src={iconLock}
              style={{ height: "35px", marginBottom: "1rem" }}
            />
            Complete the Ideas for this level to unlock Actions.
          </div>
        )}

        {dataUserCard && (
          <div className={styles.tabs}>
            <div
              className={cx(
                styles.tabsButton,
                activeTab === "community" && styles.active
              )}
              onClick={() => setActiveTab("community")}
            >
              Community
              <div className={styles.tabCounter}>
                {card.community_actions.length}
              </div>
            </div>

            <div
              className={cx(
                styles.tabsButton,
                activeTab === "added" && styles.active
              )}
              onClick={() => setActiveTab("added")}
            >
              Added
              <div className={styles.tabCounter}>
                {usercard.community_actions_claimed.length}
              </div>
            </div>

            <div
              className={cx(
                styles.tabsButton,
                activeTab === "my" && styles.active
              )}
              onClick={() => setActiveTab("my")}
            >
              My Actions
              <div className={styles.tabCounter}>
                {usercard.my_community_actions.length}
              </div>
            </div>
          </div>
        )}

        {activeTab === "community" && (
          <>
            <div className={styles.header}>
              <div>Community Actions</div>
              <div>{card.community_actions.length}</div>
            </div>
            {communityActions?.length > 0 ? (
              communityActions.map((action, i) => {
                return (
                  <CommunityAction action={action} type={"community"} key={i} />
                );
              })
            ) : (
              <div className={styles.emptyActions}>
                Be the first one to create a community action.
              </div>
            )}
          </>
        )}

        {activeTab === "my" && (
          <>
            <div className={styles.header}>
              <div>My Actions</div>
              <div>{usercard.my_community_actions.length}/5</div>
            </div>

            {myActions?.length > 0 ? (
              myActions.map((action, i) => {
                return <CommunityAction action={action} type={"my"} key={i} />;
              })
            ) : (
              <div className={styles.emptyActions}>
                You haven't created any actions for this card. <br />
                <div
                  className="btn  btn-primary mb1 mt1"
                  onClick={() => openModal()}
                >
                  + Create New Action
                </div>
              </div>
            )}
          </>
        )}
        {activeTab === "added" && (
          <>
            <div className={styles.header}>
              <div>Added Actions</div>
              <div>{usercard.community_actions_claimed.length}</div>
            </div>
            {addedActions?.length > 0 ? (
              addedActions.map((action, i) => {
                return (
                  <CommunityAction action={action} type={"added"} key={i} />
                );
              })
            ) : (
              <div className={styles.emptyActions}>
                You don't have any added actions yet.
              </div>
            )}
          </>
        )}

        {isShowing && (
          <Modal
            isShowing={isShowing}
            closeModal={closeModal}
            jsx={<CreateActionModal closeModal={closeModal} card={card} />}
          />
        )}

        {/* <div className="margin">...</div> */}
      </div>

      {/* <div>
        <div
          className="btn btn-secondary margin"
          onClick={() => updateCard(dispatch, card.id, "play")}
        >
          Play Card (energy cost)
        </div>
        <div
          className="btn btn-secondary margin"
          onClick={() =>
            updateCard(dispatch, card.id, "complete_action", "action_id")
          }
        >
          Complete Action
        </div> */}
      {card && (
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
          ) : card.isOpen ? (
            <PlayCta
              card={card}
              maxQuantity={maxQuantity}
              selectedLevel={selectedLevel}
              dispatch={dispatch}
              usercard={usercard}
              isLevelUnlocked={isLevelUnlocked}
            />
          ) : !card.isUnlocked ? (
            <div
              className={cx(usercard.quantity >= 10 ? "btn btn-action" : "btn")}
              onClick={() => updateCard(dispatch, card.id, "unlock")}
            >
              <ion-icon name="lock-closed-outline"></ion-icon>
              {usercard.quantity >= 10 ? "Unlock" : "Collect 10 to Unlock"}
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
      )}
    </div>
  );
};

const Card = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const {
    data: card,
    loading: cardLoading,
    error: cardError,
  } = useQuery(GET_CARD_ID, {
    variables: { id: router.query.id },
  });
  const [getUserCard, { data, loading, error }] =
    useLazyQuery(GET_USERCARDS_QUERY);
  useEffect(() => {
    if (store.user.usercards) {
      const usercard = store.user.usercards.filter((uc) => {
        return uc.card === parseInt(router.query.id);
      })[0];

      if (!usercard) {
        return;
      }
      getUserCard({ variables: { id: usercard.id } });
    }
  }, [store.user]);

  // const joinCard = (card, usercards) => {
  //   let collectionCard = usercards.filter(
  //     (c) => c.card === parseInt(card.id)
  //   )[0];

  //   if (collectionCard) {
  //     const mergedCard = {
  //       ...collectionCard,
  //       id: card.id,
  //       image: card.image,
  //       isOpen: card.isOpen,
  //       rarity: card.rarity,
  //       type: card.type,
  //       realm: card.realm,
  //       name: card.name,
  //       actions: card.actions,
  //     };

  //     return mergedCard;
  //   }

  //   return card;
  // };

  return (
    <div className="background_dark">
      {error || (cardError && <div>Error: {error}</div>)}
      {loading || (cardLoading && <div>Loading...</div>)}
      {card && store.user && store.user.usercards && (
        <CardPage
          // card={joinCard(data.card, store.user.usercards || {})}
          dataCard={card}
          dataUserCard={data && data.usercard}
        />
      )}
    </div>
  );
};

export default Card;
