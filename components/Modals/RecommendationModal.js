import { getRecommendedCards } from "@/actions/action";
import { useContext, useEffect, useState } from "react";
import { Tabs } from "../reusable/Tabs";
import CardsMapper from "../CardsMapper";
import { Context } from "@/context/store";
import styles from "@/styles/RecommendationModal.module.scss";
import Link from "next/link";

const objRequirementToPrioritize = {
  complete: "program",
  master_card: "content",
  action: "progress",
};

const RecommendationModal = ({ objectiveRequirement, closeModal }) => {
  const [store, dispatch] = useContext(Context);
  let prioritize = objRequirementToPrioritize[objectiveRequirement];
  const [cardsTab, setCardsTab] = useState("Continue");

  const [continueList, setContinueList] = useState([]);
  const [newCardsList, setNewCardsList] = useState([]);
  useEffect(async () => {
    const { continueList, newCardsList } = await getRecommendedCards(
      dispatch,
      prioritize
    );

    setContinueList(continueList);
    setNewCardsList(newCardsList);

    if (continueList.length === 0) {
      setCardsTab("New Cards");
    }
  }, []);

  const tabsData = [
    { label: "Continue", count: -1 },
    { label: "New Cards", count: -1 },
  ];

  return (
    <div className="recommendModal">
      <div className={styles.title}>Recommended for you:</div>
      {prioritize != "progress" && (
        <Tabs tabState={cardsTab} setTab={setCardsTab} tabs={tabsData} />
      )}
      <div className="mt2">
        {cardsTab === "Continue" && continueList.length ? (
          <CardsMapper cards={continueList} setCardTabTo={prioritize} />
        ) : (
          <div className={styles.title}>
            No cards in progress. Please check out new cards.
          </div>
        )}
        {prioritize != "progress" &&
          cardsTab === "New Cards" &&
          newCardsList.length && (
            <CardsMapper cards={newCardsList} setCardTabTo={prioritize} />
          )}
        <div className={styles.title}>Looking for something different?</div>
        <Link href={"/learn"}>
          <div className="flex_center mb1 pb1">
            <div className="btn btn-outline">Explore All Categories</div>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default RecommendationModal;
