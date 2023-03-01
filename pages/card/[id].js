import {
  BasicActionsWrapper,
  CardCtaFooter,
  CompleteCardSection,
  FavoriteButton,
  Title,
} from "../../components/cardPageComps";
import { Day, Program } from "../course/[id]";
import { GET_CARD_ID, GET_USERCARDS_QUERY } from "../../GQL/query";
import { useContext, useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";

import { BackButton } from "../../components/reusableUI";
import { Context } from "../../context/store";
import { FirstTimeBonusModal } from "../../components/Modals/FirstTimeBonusModal";
import HelperPopup from "../../components/reusable/HelperModal";
import Modal from "../../components/Modal";
import ProgressBar from "../../components/ProgressBar";
import { RanksModal } from "../../components/Modals/RanksModal";
import { Rarity } from "../../components/Rarity";
import ReactMarkdown from "react-markdown";
import { RewardsModal } from "../../components/RewardsModal";
import { Tabs } from "../../components/profileComps";
import _ from "lodash";
import iconCheckmark from "../../assets/checkmark.svg";
import { normalize } from "../../utils/calculations";
import styles from "../../styles/CardPage.module.scss";
import { updateCard } from "../../actions/action";
import useModal from "../../hooks/useModal";
import { useRouter } from "next/router";

//send to player

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
  console.log(usercard);

  // const [activeTab, setActiveTab] = useState("community");

  const card = dataCard.card;

  const isUnlocked =
    card.is_open || (usercard.proxy ? card.is_open : usercard.is_unlocked);

  const day = card.days[card.last_day || 0];
  const completedContents = usercard.completed_contents || [];
  const contentsLength = day.contents.length;
  const completedLength = completedContents.length;

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

  // const cardToUserCourse = {
  //   last_completed_day: usercard.completed + 1,
  //   last_completed_content: 1,
  //   course: { id: 1 },
  // };

  const { isShowing, openModal, closeModal } = useModal();

  // console.log({ contentL: day.contents, completedContents });

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
            fontSize={16}
          />

          {/* <div className={styles.mastery}>
            Rarity
            <Rarity rarity={card.rarity} />
          </div> */}
        </div>

        {/* <div
          className="btn btn-primary mb1"
          onClick={() => {
            updateCard(dispatch, card.id, "complete");
            getUserCard({ variables: { id: usercard.id } });
          }}
        >
          Complete Card
        </div> */}

        <div className={styles.description}>{card.description}</div>

        <Title name="Benefits" />
        <div className={styles.benefits}>
          <ReactMarkdown children={card.benefits} />
        </div>

        <div className={styles.alertWarning}>
          <img src={iconCheckmark} height="20px" />
          First Time Bonus Available!
          <HelperPopup HelperModal={FirstTimeBonusModal} className="ml1" />
        </div>

        <Title name="Program" />

        <Program
          day={day}
          completedContents={completedContents}
          cardId={card.id}
        />

        {/* <Day
          day={card.days[card.last_day || 0]}
          usercourse={cardToUserCourse}
          cardName={card.name}
        /> */}

        {/* <IdeaPlayer cardId={card.id} /> */}

        {/* <Title name="Actions" /> */}

        {/* <BasicActionsWrapper
          card={card}
          usercard={usercard}
          mergeActions={mergeActions}
        /> */}
      </div>

      <CompleteCardSection
        card={card}
        usercard={usercard}
        contentsLength={contentsLength}
        completedLength={completedLength}
      />

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
