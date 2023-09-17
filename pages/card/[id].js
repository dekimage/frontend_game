import {
  CardCtaFooter,
  FavoriteButton,
  Title,
} from "@/components/cardPageComps";
import { GET_CARD_ID, GET_USERCARD_QUERY } from "@/GQL/query";
import { useContext, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { BackButton } from "@/components/reusable/BackButton";
import { Context } from "@/context/store";
import EnergyModal from "@/components/EnergyModal";
import Modal from "@/components/reusable/Modal";
import ReactMarkdown from "react-markdown";
import { RewardsModal } from "@/components/RewardsModal";
import _ from "lodash";
import { normalize } from "@/utils/calculations";
import styles from "@/styles/CardPage.module.scss";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/router";
import CardContentTab from "@/components/CardContent/CardContentTab";
import { ImageUI } from "@/components/reusableUI";
import { calculateCardMaxProgress, calculateCardProgress } from "@/utils/joins";
import ProgressBar from "@/components/ProgressBar";
import {
  MASTERY_PER_PROGRAM_COMPLETE,
  PROGRAM_COMPLETED_MAX,
} from "@/data/config";
import ObjectivesModal from "@/components/Modals/ObjectivesModal";

const CardPage = ({ dataUserCard, dataCard }) => {
  const [store, dispatch] = useContext(Context);

  const proxyUserCard = {
    completed: 0,
    proxy: true,
    completed_at: false,
  };
  const usercard = dataUserCard ? dataUserCard : proxyUserCard;

  const card = dataCard.card;

  const isUnlocked =
    card.is_open ||
    usercard.is_unlocked ||
    (card.type == "premium" && store.user.pro);

  const day = card.days[card.last_day || 0];
  const cardTickets = store?.user?.card_tickets || [];
  const isTicketPurchased = !!cardTickets.find((c) => c.id == card.id);

  const maxProgress =
    calculateCardMaxProgress(card.relationCount).totalMaxProgress +
    PROGRAM_COMPLETED_MAX * MASTERY_PER_PROGRAM_COMPLETE;
  const progress =
    calculateCardProgress(usercard.progressMap).totalProgress +
    usercard.completed * MASTERY_PER_PROGRAM_COMPLETE;
  const isProgramMastered = usercard.completed >= PROGRAM_COMPLETED_MAX;

  const { isShowing, openModal, closeModal } = useModal();

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <BackButton isBack />

        <ImageUI url={card.image.url} height={225} className={styles.image} />

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
            <ImageUI
              url={card.realm.image.url}
              height={28}
              className={styles.realmLogo}
            />

            <div className={styles.name}>{card.name}</div>
            {!card.coming_soon && isUnlocked && (
              <FavoriteButton
                isFavorite={usercard.is_favorite}
                id={card.id}
                type="card"
              />
            )}
            {!isUnlocked && (
              <div style={{ width: "25px", visibility: "hidden" }}>.</div>
            )}
          </div>
        </div>

        <div className="section_container">
          <div className={styles.description}>{card.description}</div>
        </div>

        {card.coming_soon && (
          <div className={styles.comingSoon}>
            <div className={styles.comingSoonText}>Coming Soon</div>
          </div>
        )}

        {!isUnlocked && (
          <>
            <Title name="Benefits" />
            <div className={styles.benefits}>
              <ReactMarkdown children={card.benefits} />
            </div>
          </>
        )}
      </div>

      {isUnlocked && (
        <div className="section mb1">
          <div className="flex_center mb5">
            <div className={styles.cardStats}>
              {progress}/{maxProgress}
            </div>
            <ImageUI
              url={"/mastery.png"}
              isPublic
              height="20px"
              className="ml5"
            />
          </div>
          <ProgressBar
            progress={progress}
            max={maxProgress}
            isReadyToClaim={progress >= maxProgress}
          />
        </div>
      )}

      <div className="section_container">
        {!card.coming_soon && usercard && card && isUnlocked && (
          <CardContentTab
            card={card}
            usercard={usercard}
            programData={{ day, isTicketPurchased, isProgramMastered }}
          />
        )}

        {card && !card.coming_soon && (
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

        <Modal
          isShowing={store.objectivesModal?.isOpen}
          closeModal={() => dispatch({ type: "CLOSE_OBJECTIVES_MODAL" })}
          jsx={<ObjectivesModal />}
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
    {
      variables: {
        userId: store.user.id,
        cardId: parseInt(router.query.id),
      },
      fetchPolicy: "network-only",
    }
  );
  const gql_usercard = data && normalize(data).usercards[0];

  useEffect(() => {
    if (store.user?.id) {
      getUserCard({
        userId: store.user.id,
        cardId: parseInt(router.query.id),
      });
    }
  }, [store.gqlRefetch, store.user.id]);

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
          dataUserCard={gql_usercard}
          getUserCard={getUserCard}
        />
      )}
    </div>
  );
};

export default Card;
