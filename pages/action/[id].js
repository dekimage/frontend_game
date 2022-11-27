import { useQuery } from "@apollo/react-hooks";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/store";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ImageUI, BackButton } from "../../components/reusableUI";
import { FavoriteButton } from "../../components/cardPageComps";
import Card from "../../components/Card";
import iconLock from "../../assets/lock-white-border.svg";
import cx from "classnames";
import _ from "lodash";
import styles from "../../styles/Action.module.scss";

import { normalize } from "../../utils/calculations";

import { GET_ACTION_ID } from "../../GQL/query";
import { updateCard } from "../../actions/action";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const ActionCta = ({
  dispatch,
  isUnlocked,
  energy,
  actionId,
  cardId,
}) => {
  const router = useRouter();
  return (
    <div className={styles.actionCta}>
      {isUnlocked ? (
        <div
          className={cx(energy > 0 ? "btn btn-primary" : "btn btn-disabled")}
          onClick={() => {
            updateCard(dispatch, actionId, "complete_action");
          }}
        >
          Do this action {energy}/1
          <img src={`${baseUrl}/energy.png`} height="20px" className="ml5" />
        </div>
      ) : (
        <Link href={`/card/${cardId}`}>
          <div className="btn btn-primary">
            <ion-icon name="lock-closed-outline"></ion-icon>&nbsp;
            <div>Unlock Card</div>
          </div>
        </Link>
      )}
    </div>
  );
};

const ActionPage = ({ action, user }) => {
  const [store, dispatch] = useContext(Context);
  const [isShowTips, setIsShowTips] = useState(false);

  const usercard = user.usercards.filter(
    (usercard) => usercard.card.id === parseInt(action.card.id)
  )[0];

  const isUnlocked = action.card.is_open || (usercard && usercard.is_unlocked);
  // const isUnlocked = true;

  const isActionFavorite =
    user.favorite_actions.filter((a) => a.id == action.id).length > 0;

  return (
    <div className="section_container">
      <div className={styles.card}>
        {/* <FavoriteButton usercard={usercard} cardId={card.id} /> */}
        <BackButton isBack />
        <div className="section">
          <ImageUI
            className={"image-radius"}
            imgUrl={action.image?.url}
            width="100%"
          />
        </div>

        {/* <ImageUI imgUrl={action.card.realm.image.url} height="28px" /> */}
        <div className={styles.name_section}>
          <div className="flex_between">
            <div className={styles.name}>{action.name}</div>
            <FavoriteButton
              isFavorite={isActionFavorite}
              id={action.id}
              type={"action"}
            />
          </div>
          <div className="flex_start">
            <div className={styles.action_type}>{action.type}</div>
            <div className={styles.action_duration}>{action.duration} min</div>
          </div>
        </div>

        {!isUnlocked && (
          <div className="section">
            <div className={styles.unlockByCard}>
              <img src={iconLock} height="18px" className="mr5" /> Card Required
              to unlock this action:
            </div>
            <div className={styles.cardRequired}>
              <Card card={action.card} />
            </div>
          </div>
        )}
        {isUnlocked && (
          <>
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
              <div className={styles.tips}>
                {action.tips &&
                  (action.tips.length < 250 ? (
                    <ReactMarkdown
                      children={action.tips}
                      className={styles.markdown}
                    />
                  ) : (
                    <>
                      <ReactMarkdown
                        children={
                          isShowTips
                            ? action.tips
                            : action.tips.slice(0, 250).concat("...")
                        }
                        className={styles.markdown}
                      />
                      <div className="flex_center">
                        <div
                          className="btn btn-blank"
                          onClick={() => setIsShowTips(!isShowTips)}
                        >
                          {isShowTips ? "show less tips" : "show all tips"}
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </>
        )}

        <ActionCta
          isUnlocked={isUnlocked}
          energy={user.energy}
          dispatch={dispatch}
          actionId={action.id}
          cardId={action.card.id}
        />
      </div>
    </div>
  );
};

const Action = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);

  const {
    data: action,
    loading,
    error,
  } = useQuery(GET_ACTION_ID, {
    variables: { id: router.query.id },
  });
  const gql_action = action && normalize(action);

  // const isUnlocked =
  //   store?.user?.actions?.filter(
  //     (a) => a.id === parseInt(gql_action?.action?.id)
  //   ).length > 0;

  // const isUnlocked = true;

  useEffect(() => {}, [store.user]);

  const isEmpty = (obj) => {
    if (obj === undefined) {
      return false;
    }
    return Object.keys(obj).length === 0;
  };

  const Safe = ({ loading, error }) => {
    return (
      <div className="background_dark">
        {error && <div>Error: {error}</div>}
        {loading && (
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && (
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      )}
      {gql_action && !isEmpty(store.user) && (
        <ActionPage action={gql_action.action} user={store.user} />
      )}
    </div>
  );
};

export default Action;
