import {
  CardCtaFooter,
  FavoriteButton,
  Title,
} from "@/components/cardPageComps";
import { GET_CARD_ID, GET_USERCARD_QUERY } from "@/GQL/query";
import { useContext, useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";

import { BackButton } from "@/components/reusable/BackButton";
import { Context } from "@/context/store";
import EnergyModal from "@/components/EnergyModal";
import Modal from "@/components/reusable/Modal";

import ProgressBar from "@/components/ProgressBar";

import ReactMarkdown from "react-markdown";
import { RewardsModal } from "@/components/RewardsModal";
import _ from "lodash";
import { normalize } from "@/utils/calculations";
import styles from "@/styles/CardPage.module.scss";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/router";
import TabsData from "@/components/TabsData";
import { ImageUI } from "@/components/reusableUI";

const CardPage = ({ dataUserCard, dataCard, getUserCard }) => {
  const [store, dispatch] = useContext(Context);
  const proxyUserCard = {
    completed: 0,
    proxy: true,
    completed_progress_max: 3,
    completed_contents: [],
    completed_at: false,
  };
  const usercard = dataUserCard ? dataUserCard : proxyUserCard;

  const card = dataCard.card;

  const isUnlocked =
    card.is_open || (usercard.proxy ? card.is_open : usercard.is_unlocked);

  const day = card.days[card.last_day || 0];
  const completedContents = usercard.completed_contents || [];
  const cardTickets = store?.user?.card_tickets || [];
  const isTicketPurchased = !!cardTickets.find((c) => c.id == card.id);
  const isSubscribed = store?.user?.is_subscribed;

  const { isShowing, openModal, closeModal } = useModal();

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <BackButton routeDynamic={card.realm.id} routeStatic={"/realm/"} />

        <ImageUI url={card.image.url} height={225} className={styles.image} />

        <div
          className={styles.background}
          style={{ "--background": card.realm.color }}
        ></div>

        <div
          className={styles.curve}
          style={{ "--background": card.realm.color }}
        ></div>

        {!card.coming_soon && (
          <div className={styles.section_name}>
            <div className={styles.name}>
              <ImageUI
                url={card.realm.image.url}
                height={28}
                className={styles.realmLogo}
              />

              <div className={styles.name}>{card.name}</div>
              <FavoriteButton
                isFavorite={usercard.is_favorite}
                id={card.id}
                type="card"
              />
            </div>
          </div>
        )}

        <ProgressBar
          progress={usercard.completed}
          max={usercard.completed_progress_max}
          withNumber
          withIcon={"mastery"}
          fontSize={16}
        />

        <div className={styles.description}>{card.description}</div>

        {!isUnlocked && (
          <>
            <Title name="Benefits" />
            <div className={styles.benefits}>
              <ReactMarkdown children={card.benefits} />
            </div>
          </>
        )}
      </div>
      <div className="section_container">
        {!card.coming_soon && usercard && card && (
          <TabsData
            card={card}
            usercard={usercard}
            programData={{ day, completedContents, isTicketPurchased }}
          />
        )}

        {/* {card && (
        <CardCtaFooter
          isUnlocked={isUnlocked}
          card={card}
          isTicketPurchased={isTicketPurchased}
          usercard={usercard}
          is_subscribed={isSubscribed}
        />
      )} */}

        <Modal
          isShowing={store.rewardsModal.isOpen}
          closeModal={closeModal}
          showCloseButton={false}
          jsx={<RewardsModal defaultPage={"artifact"} />}
          isSmall
        />

        <Modal
          isShowing={store.energyModal}
          closeModal={() => dispatch({ type: "OPEN_ENERGY_MODAL" })}
          jsx={<EnergyModal />}
          isSmall
        />
      </div>
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
    GET_USERCARD_QUERY,
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
