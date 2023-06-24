import { Button, ImageUI } from "./reusableUI";

import { useContext, useEffect, useState } from "react";

import { Context } from "@/context/store";
import { GenericDropDown } from "@/pages/problems";
import Link from "next/link";
import Timer from "./reusable/Timer";
import arrowDown from "@/assets/arrow-down-white.png";

import checkmark1 from "@/assets/checkmark-fill.svg";
import cx from "classnames";
import iconCross from "@/assets/close.svg";
import styles from "@/styles/CardPage.module.scss";
import { useRouter } from "next/router";
import baseUrl from "@/utils/settings";

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

  closePlayer = false,
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
    <div style={{ marginBottom: "2rem" }} className="flex_center">
      {isMoreThan24HoursAgo ? (
        <div
          className={`${styles.completeCardSection} flex_center flex_column`}
        >
          {/* You can play this card as many times as you want, throughout the day.
          <br />
          However, you can complete each card once every 24 hours.
          <br /> */}
          You can mark this card as complete again in:
          <div className="mt1 mb1">
            <Timer
              timeLeftProp={isMoreThan24HoursAgo}
              jsxComplete={<div className="btn btn-correct">Refresh</div>}
              // onComplete={onComplete}
            />
          </div>
          {closePlayer && (
            <div
              className="btn btn-primary"
              onClick={() => {
                closePlayer();
              }}
            >
              Back to Card
            </div>
          )}
        </div>
      ) : contentsLength === completedLength ? (
        <div
          className="btn btn-primary"
          onClick={() => {
            updateCard(dispatch, card.id, "complete");
          }}
        >
          Complete Card{" "}
          <ImageUI
            url={`/mastery.png`}
            isPublic
            height="16px"
            className="ml5"
          />
        </div>
      ) : (
        <div className="flex_center flex_column">
          You must complete all sections to mark this card as completed.
          <div className="btn btn-disabled mt1 mb1">
            Complete {completedLength} / {contentsLength}
          </div>
          {closePlayer && (
            <div
              className="btn btn-success"
              onClick={() => {
                closePlayer();
              }}
            >
              Back to Card
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CardCtaFooter = ({
  isUnlocked,
  card,
  isTicketPurchased,
  isSubscribed,
}) => {
  const [store, dispatch] = useContext(Context);
  const hasStars = store?.user?.stars >= card.cost;
  const energy = store?.user?.energy;

  const canStreakUnlock =
    store?.user?.highest_streak_count >= card.streakreward?.streak_count;
  const canBuddyUnlock =
    store?.user?.highest_buddy_shares >= card.friendreward?.friends_count;
  console.log(card);

  const router = useRouter();

  const openPlayerAfterTicket = () => {
    router.push(`${feUrl}/card/player/${card.id}`);
  };

  if (card.coming_soon) {
    return (
      <div className={styles.fixed}>
        <div className={styles.comingSoon}>Coming Soon</div>
      </div>
    );
  }

  if (card.streakreward && !isUnlocked) {
    return (
      <div className={styles.fixed}>
        {canStreakUnlock ? (
          <Link href="/streak">
            <div className="btn btn-action">Claim Card</div>
          </Link>
        ) : (
          <div className="btn btn-disabled">
            {card.streakreward.streak_count}
            <img height="12px" className="ml25" src={`${baseUrl}/streak.png`} />
          </div>
        )}
      </div>
    );
  }

  if (card.friendreward && !isUnlocked) {
    return (
      <div className={styles.fixed}>
        {canBuddyUnlock ? (
          <Link href="/buddies-rewards">
            <div className="btn btn-action">Claim Card</div>
          </Link>
        ) : (
          <div className="btn btn-disabled">
            {card.friendreward.friends_count}
            <img height="12px" className="ml25" src={`${baseUrl}/user.png`} />
          </div>
        )}
      </div>
    );
  }

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
          {isTicketPurchased || isSubscribed ? (
            <Button
              onClick={() => {
                router.push(`${feUrl}/card/player/${card.id}`);
              }}
              children={"Play"}
              isLoading={store.isLoading}
            />
          ) : (
            <Button
              isLoading={store.isLoading}
              onClick={() => {
                if (energy > 0) {
                  openPlayerAfterTicket();
                } else {
                  console.log("here");
                  dispatch({ type: "OPEN_ENERGY_MODAL" });
                }
              }}
              children={
                <div>
                  Play
                  <span className="ml5 md">1</span>
                  <img src={`${baseUrl}/energy.png`} height="20px" />
                </div>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};
