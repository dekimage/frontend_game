import {
  CardCtaFooter,
  CompleteCardSection,
  FavoriteButton,
  Title,
} from "../../components/cardPageComps";
import { GET_CARD_ID, GET_USERCARDS_QUERY } from "../../GQL/query";
import { useContext, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";

import { BackButton } from "../../components/reusableUI";
import { Context } from "../../context/store";
import EnergyModal from "../../components/EnergyModal";
import { FirstTimeBonusModal } from "../../components/Modals/FirstTimeBonusModal";
import HelperPopup from "../../components/reusable/HelperModal";
import Modal from "../../components/Modal";
import { Program } from "../course/[id]";
import ProgressBar from "../../components/ProgressBar";
import { RanksModal } from "../../components/Modals/RanksModal";
import { Rarity } from "../../components/Rarity";
import ReactMarkdown from "react-markdown";
import { RewardsModal } from "../../components/RewardsModal";
import _ from "lodash";
import iconCheckmark from "../../assets/checkmark.svg";
import { normalize } from "../../utils/calculations";
import styles from "../../styles/CardPage.module.scss";
import useModal from "../../hooks/useModal";
import { useRouter } from "next/router";

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
  const contentsLength = day?.contents?.length;
  const completedLength = completedContents.length;
  const cardTickets = store?.user?.card_tickets || [];
  const isTicketPurchased = !!cardTickets.find((c) => c.id == card.id);
  const isSubscribed = store?.user?.is_subscribed;

  // const mergeActions = (usercard, actions, checkingArray, keyword) => {
  //   const result = actions.map((action) => {
  //     return {
  //       ...action,
  //       [keyword]: !!checkingArray.filter((a) => a.id === action.id)[0],
  //       is_reported: !!usercard.reported_actions.filter(
  //         (a) => a.id === action.id
  //       )[0],
  //       is_upvoted: !!usercard.upvoted_actions.filter(
  //         (a) => a.id === action.id
  //       )[0],
  //     };
  //   });
  //   return result;
  // };

  const { isShowing, openModal, closeModal } = useModal();

  console.log(55, store.isLoading);

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

        {!card.coming_soon && (
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
        )}

        {!card.coming_soon && (
          <div className={styles.masteryWrapper}>
            <div className={styles.mastery}>
              <Title name="Sessions Completed" />

              <Rarity rarity={usercard.league} />
              <div style={{ marginLeft: ".5rem" }}></div>
              <HelperPopup HelperModal={RanksModal} />
            </div>

            <ProgressBar
              progress={usercard.completed}
              max={usercard.completed_progress_max}
              withNumber
              withIcon={"mastery"}
              fontSize={16}
            />
          </div>
        )}

        <div className={styles.description}>{card.description}</div>

        <Title name="Benefits" />
        <div className={styles.benefits}>
          <ReactMarkdown children={card.benefits} />
        </div>

        <Title name="Program" />

        <Program
          day={day}
          completedContents={completedContents}
          cardId={card.id}
          isTicketPurchased={isTicketPurchased}
        />

        {/* <IdeaPlayer cardId={card.id} /> */}

        {/* <Title name="Actions" /> */}

        {/* <BasicActionsWrapper
          card={card}
          usercard={usercard}
          mergeActions={mergeActions}
        /> */}
      </div>

      {!card.coming_soon && (
        <div className="section">
          <CompleteCardSection
            card={card}
            usercard={usercard}
            contentsLength={contentsLength}
            completedLength={completedLength}
          />
        </div>
      )}

      {!card.coming_soon && usercard.completed < 1 && (
        <div
          className="section"
          style={{ marginBottom: "3rem", paddingTop: "0" }}
        >
          <div className={styles.alertWarning}>
            <img src={iconCheckmark} height="20px" />
            First Time Bonus Available!
            <HelperPopup HelperModal={FirstTimeBonusModal} className="ml1" />
          </div>
        </div>
      )}

      {card && (
        <CardCtaFooter
          isUnlocked={isUnlocked}
          card={card}
          isTicketPurchased={isTicketPurchased}
          usercard={usercard}
          is_subscribed={isSubscribed}
        />
      )}

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
