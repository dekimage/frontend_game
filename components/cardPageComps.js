import { Button, ImageUI } from "./reusableUI";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/store";
import Link from "next/link";
import Timer from "./reusable/Timer";
import styles from "@/styles/CardPage.module.scss";
import { useRouter } from "next/router";
import baseUrl from "@/utils/settings";
import { buyCardTicket, updateCard } from "@/actions/action";
import { PROGRAM_COMPLETED_MAX } from "@/data/config";

const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

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

export const FavoriteButton = ({ isFavorite, id, type }) => {
  //type == "action" or "card"
  const [store, dispatch] = useContext(Context);

  return (
    <div
      className={styles.favorite}
      onClick={() => updateCard(dispatch, id, "favorite")}
    >
      {isFavorite ? (
        <img src={`${baseUrl}/favorite.png`} height="25px" />
      ) : (
        <img src={`${baseUrl}/notFavorite.png`} height="25px" />
      )}
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
  isProgramMastered,
  closePlayer = false,
}) => {
  const [store, dispatch] = useContext(Context);
  const router = useRouter();

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
  console.log(card.id);

  return (
    <div style={{ marginBottom: "2rem" }} className="flex_center">
      {isMoreThan24HoursAgo && !isProgramMastered ? (
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
      ) : (
        <div
          className="btn btn-primary"
          onClick={() => {
            updateCard(dispatch, card.id, "complete");
            router.push(`/card/${card.id}`);
          }}
        >
          Complete Card
          <ImageUI
            url={usercard.glory_points > 0 ? `/glory.png` : `/mastery.png`}
            isPublic
            height="16px"
            className="ml5"
          />
        </div>
      )}
    </div>
  );
};

export const PlayerCtaFooter = ({ card, isTicketPurchased }) => {
  const [store, dispatch] = useContext(Context);
  const router = useRouter();
  const energy = store?.user?.energy;
  const openPlayerAfterTicket = () => {
    buyCardTicket(dispatch, card.id);
    router.push(`${feUrl}/card/player/${card.id}`);
  };

  return (
    <div className={styles.fixed}>
      {isTicketPurchased ? (
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
  );
};

export const CardCtaFooter = ({ isUnlocked, card }) => {
  const [store, dispatch] = useContext(Context);
  const hasStars = store?.user?.stars >= card.cost;

  const canStreakUnlock =
    store?.user?.highest_streak_count >= card.streakreward?.streak_count;
  const canBuddyUnlock =
    store?.user?.highest_buddy_shares >= card.friendreward?.friends_count;

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

  if (card.cost > 0 && !isUnlocked) {
    return (
      <div className={styles.fixed}>
        {hasStars ? (
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
            <span className="text-red">{card.cost}</span>
            <img height="12px" className="ml25" src={`${baseUrl}/stars.png`} />
          </div>
        )}
      </div>
    );
  }

  return null;
};
