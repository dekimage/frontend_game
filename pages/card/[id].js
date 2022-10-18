import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/store";
import { useRouter } from "next/router";

import _ from "lodash";
import styles from "../../styles/CardPage.module.scss";

import Modal from "../../components/Modal";
import useModal from "../../hooks/useModal";

import { Rarity } from "../../components/Rarity";

import { Tabs } from "../../components/profileComps";

import { normalize } from "../../utils/calculations";

import { GET_USERCARDS_QUERY } from "../../GQL/query";
import { GET_CARD_ID } from "../../GQL/query";

import {
  ActionsWrapper,
  BasicActionsWrapper,
  CreateActionModal,
  FavoriteButton,
  Title,
  CardCtaFooter,
} from "../../components/cardPageComps";
import { BackButton } from "../../components/reusableUI";

const CardPage = ({ dataUserCard, dataCard }) => {
  const [store, dispatch] = useContext(Context);
  const proxyUserCard = {
    completed: 0,
    proxy: true,
  };
  const usercard = dataUserCard ? dataUserCard : proxyUserCard;

  const { isShowing, openModal, closeModal } = useModal();

  const [activeTab, setActiveTab] = useState("community");

  const card = dataCard.card;

  const isLocked = !(usercard.proxy ? card.is_open : usercard.is_unlocked);
  console.log(isLocked);

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

  const tabsData = [
    { label: "community", count: card?.communityactions?.length },
    { label: "added", count: usercard?.community_actions_claimed?.length },
    { label: "my", count: usercard?.my_community_actions?.length },
  ];

  const communityActions =
    dataUserCard &&
    mergeActions(
      usercard,
      card.communityactions,
      usercard.community_actions_claimed,
      "is_claimed"
    );

  const addedActions =
    dataUserCard &&
    mergeActions(
      usercard,
      usercard.community_actions_claimed,
      usercard.community_actions_completed,
      "is_completed"
    );

  const myActions =
    dataUserCard &&
    mergeActions(
      usercard,
      usercard.my_community_actions,
      usercard.community_actions_claimed,
      "is_claimed"
    );

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

        <Rarity rarity={card.rarity} />

        <div className={styles.description}>{card.description}</div>

        <Title name="Sessions" />

        {/* <IdeaPlayer cardId={card.id} /> */}

        <Title name="Actions" />

        <BasicActionsWrapper
          card={card}
          usercard={usercard}
          mergeActions={mergeActions}
        />
      </div>
      {!isLocked && (
        <>
          <Tabs tabState={activeTab} setTab={setActiveTab} tabs={tabsData} />

          {activeTab === "community" && card.communityactions && (
            <ActionsWrapper
              actions={card.communityactions}
              label={"Community Actions"}
              type={"community"}
              openModal={openModal}
              emptyDescription={
                "Be the first one to create a community action."
              }
            />
          )}

          {activeTab === "my" && (
            <ActionsWrapper
              actions={myActions}
              label={"My Actions"}
              type={"my"}
              openModal={openModal}
              emptyDescription={
                "You haven't created any actions for this card."
              }
            />
          )}
          {activeTab === "added" && (
            <ActionsWrapper
              actions={addedActions}
              label={"Added Actions"}
              type={"added"}
              openModal={openModal}
              emptyDescription={" You don't have any added actions yet."}
            />
          )}

          {isShowing && (
            <Modal
              isShowing={isShowing}
              closeModal={closeModal}
              jsx={<CreateActionModal closeModal={closeModal} card={card} />}
            />
          )}
        </>
      )}

      {card && (
        <CardCtaFooter isLocked={isLocked} card={card} usercard={usercard} />
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
  const gql_card = card && normalize(card);
  const [getUserCard, { data, loading, error }] =
    useLazyQuery(GET_USERCARDS_QUERY);
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
        />
      )}
    </div>
  );
};

export default Card;
