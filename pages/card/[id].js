import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/store";
import { useRouter } from "next/router";

import _ from "lodash";
import styles from "../../styles/CardPage.module.scss";

import { Rarity } from "../../components/Rarity";

import { Tabs } from "../../components/profileComps";

import { normalize } from "../../utils/calculations";

import { GET_USERCARDS_QUERY, GET_CARD_ID } from "../../GQL/query";

import { updateCard } from "../../actions/action";

//send to player
import Modal from "../../components/Modal";
import useModal from "../../hooks/useModal";
import { RewardsModal } from "../../components/RewardsModal";

import {
  BasicActionsWrapper,
  FavoriteButton,
  Title,
  CardCtaFooter,
} from "../../components/cardPageComps";

import { Curriculum } from "../course/[id]";
import { BackButton } from "../../components/reusableUI";
import ProgressBar from "../../components/ProgressBar";

const CardPage = ({ dataUserCard, dataCard, getUserCard }) => {
  const [store, dispatch] = useContext(Context);
  const proxyUserCard = {
    completed: 0,
    proxy: true,
    completed_progress_max: 3,
  };
  const usercard = dataUserCard ? dataUserCard : proxyUserCard;
  console.log(usercard);

  // const [activeTab, setActiveTab] = useState("community");

  const card = dataCard.card;

  const isUnlocked =
    card.is_open || (usercard.proxy ? card.is_open : usercard.is_unlocked);

  // console.log(usercard);

  const mergeActions = (usercard, actions, checkingArray, keyword) => {
    const result = actions.map((action) => {
      return {
        ...action,
        [keyword]: !!checkingArray.filter((a) => a.id === action.id)[0],
        is_reported: !!usercard.reported_actions.filter(
          (a) => a.id === action.id
        )[0],
        is_upvoted: !!usercard.upvoted_actions.filter(
          (a) => a.id === action.id
        )[0],
      };
    });
    return result;
  };

  const cardToUserCourse = {
    last_completed_day: usercard.completed + 1,
    last_completed_content: 1,
    course: { id: 1 },
  };

  console.log(store.rewardsModal);
  const { isShowing, openModal, closeModal } = useModal();

  return (
    <div className="section_container">
      <div className={styles.card}>
        <BackButton routeDynamic={card.realm.id} routeStatic={"/realm/"} />

        <img className={styles.image} src={card.image.url} />

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
              <img src={card.realm.image.url} height="28px" />
            </div>
            <div className={styles.name}>{card.name}</div>
            <FavoriteButton
              isFavorite={usercard.is_favorite}
              id={card.id}
              type="card"
            />
          </div>
        </div>

        <div
          className="btn btn-primary mb1"
          onClick={() => {
            updateCard(dispatch, card.id, "complete");
            getUserCard({ variables: { id: usercard.id } });
          }}
        >
          Complete Card
        </div>

        {/* <Rarity rarity={card.rarity} /> */}

        <Rarity rarity={usercard.league} />

        <ProgressBar
          progress={usercard.completed}
          max={usercard.completed_progress_max}
          withNumber
        />

        <div className={styles.description}>{card.description}</div>

        <Title name="Sessions" />

        <Curriculum
          days={card.days}
          usercourse={cardToUserCourse}
          cardName={card.name}
        />

        {/* <IdeaPlayer cardId={card.id} /> */}

        <Title name="Actions" />

        <BasicActionsWrapper
          card={card}
          usercard={usercard}
          mergeActions={mergeActions}
        />
      </div>

      {card && (
        <CardCtaFooter
          isUnlocked={isUnlocked}
          card={card}
          usercard={usercard}
        />
      )}

      <Modal
        isShowing={store.rewardsModal.isOpen}
        closeModal={closeModal}
        showCloseButton={false}
        jsx={<RewardsModal defaultPage={"artifact"} />}
        isSmall
      />
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
  const gql_card = card && normalize(card);
  const [getUserCard, { data, loading, error }] = useLazyQuery(
    GET_USERCARDS_QUERY,
    { fetchPolicy: "network-only" }
  );
  const gql_usercard = data && normalize(data);

  useEffect(() => {
    if (store.user.usercards) {
      const usercard = store.user.usercards.filter((uc) => {
        return uc.card.id === parseInt(router.query.id);
      })[0];

      if (!usercard) {
        return;
      }
      getUserCard({ variables: { id: usercard.id } });
    }
  }, [store.user]);

  return (
    <div className="background_dark">
      {error || (cardError && <div>Error: {error}</div>)}
      {loading ||
        (cardLoading && (
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        ))}

      {gql_card && store.user && (
        <CardPage
          dataCard={gql_card}
          dataUserCard={gql_usercard && gql_usercard.usercard}
          getUserCard={getUserCard}
        />
      )}
    </div>
  );
};

export default Card;
