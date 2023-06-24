import { useContext, useState } from "react";

import { Title } from "./cardPageComps";
import styles from "@/styles/TabsData.module.scss";
import { ImageUI } from "./reusableUI";
import iconLock from "@/assets/lock-white-border.svg";
import ProgressBar from "./ProgressBar";
import { updateContentType } from "@/actions/action";
import { Context } from "@/context/store";
import {
  maxProgressPerContentType,
  rewardsMap,
  questMap,
  mainTabs,
  subTabsMap,
} from "@/data/contentTypesData";
import { Program } from "./Program/Program";
import { Tabs } from "./reusable/Tabs";

const getAdjacentLabels = (name) => {
  const flattenedTabs = Object.values(subTabsMap).flat();
  const index = flattenedTabs.findIndex((item) => item.label === name);

  if (index !== -1) {
    const previous = flattenedTabs[index - 1]?.label;
    const next = flattenedTabs[index + 1]?.label;

    return { previous, next };
  }

  return {};
};

const TabsData = ({ card, usercard, programData }) => {
  const [store, dispatch] = useContext(Context);

  const [activeMainTab, setActiveMainTab] = useState(mainTabs[0].label);
  const [activeSubTab, setActiveSubTab] = useState(
    subTabsMap[activeMainTab][0].label
  );

  const handleMainTabClick = (tab) => {
    setActiveMainTab(tab);
    // Reset the sub tab to the default when switching main tabs
    setActiveSubTab(subTabsMap[tab][0].label);
  };

  const handleSubTabClick = (tab) => {
    setActiveSubTab(tab);
  };

  const handleNextOrPrevious = (direction) => {
    const { previous, next } = getAdjacentLabels(activeSubTab);
    const tab = direction === "next" ? next : previous;
    if (tab) {
      setActiveSubTab(tab);
    }
    //change main tab
  };

  const renderMainTabs = () => {
    return (
      <Tabs
        tabState={activeMainTab}
        setTab={handleMainTabClick}
        tabs={mainTabs}
      />
    );
  };

  const renderSubTabs = () => {
    // const subTabs = subTabsMap[activeMainTab].map((tab) => {
    //   return { ...tab, label: formatTabName(tab.label) };
    // });
    const subTabs = subTabsMap[activeMainTab];
    return (
      <Tabs tabState={activeSubTab} setTab={handleSubTabClick} tabs={subTabs} />
    );
  };

  const Quest = ({ staticQuest }) => {
    const { progressQuest } = usercard;
    const userQuest = progressQuest?.[activeSubTab] || {
      progress: 0,
      level: 0,
    };
    return (
      <div className={styles.quest}>
        <div className={styles.questTitle}>Quest - {staticQuest.name}</div>
        <div className={styles.questLevel}>Lvl {userQuest.level}</div>
        <div className="mb1"></div>
        <ProgressBar
          progress={userQuest.progress}
          max={maxProgressPerContentType[activeSubTab]}
          withNumber
          isReadyToClaim={
            userQuest.progress >= maxProgressPerContentType[activeSubTab]
          }
        />
        <div
          className="btn btn-primary mt1"
          onClick={() =>
            updateContentType(dispatch, "claim", card.id, activeSubTab)
          }
        >
          Claim
        </div>
        <div className="mt1 mb1"></div>
        <div className={styles.questTitle}>Rewards:</div>
        <div className={styles.questRewardsMap}>
          {rewardsMap.map((reward, i) => (
            <div className={styles.questReward} key={i}>
              <ImageUI url={reward.icon} height="20px" isPublic />
              <div className={styles.questRewardText}>{reward.name}</div>
              <div className={styles.questRewardText}>{reward.amount}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ContentTypeCardMap = ({ contentTypes }) => {
    return (
      <div className={styles.tipsMap}>
        {contentTypes.map((contentType) => (
          <ContentTypeCard key={contentType.id} contentType={contentType} />
        ))}
      </div>
    );
  };

  const ContentTypeCard = ({ contentType }) => {
    const { progressMap } = usercard;

    const progress =
      progressMap?.[activeSubTab]?.[contentType.id]?.completed || 0;
    const saved = progressMap?.[activeSubTab]?.[contentType.id]?.saved;
    const maxProgress = maxProgressPerContentType[activeSubTab];
    const isViewMore = false;
    const isUnlocked = contentType.isOpen;
    const isCompleted = maxProgress == progress;

    //attempt to make reusable - maybe change
    const content = contentType.content || contentType.question;

    return (
      <div className={styles.tip} key={contentType.id}>
        <div className={styles.sortOrder}>
          {activeSubTab} # {contentType.sortOrder}
        </div>
        <div className={styles.progressIndicator}>
          {progress}/{maxProgress}
        </div>
        {isUnlocked ? (
          <div className={styles.tipContent}>{content}</div>
        ) : (
          <div className={styles.lockedContent}>
            <img src={iconLock} alt="locked" height="48px" />
          </div>
        )}

        <div className={styles.actionBar}>
          {isUnlocked ? (
            <>
              {isCompleted ? (
                <div className="btn btn-outline">
                  Completed
                  <ImageUI
                    url="/checked.png"
                    height="12px"
                    isPublic
                    className="ml5"
                  />
                </div>
              ) : (
                <div
                  className="btn btn-outline"
                  onClick={() =>
                    updateContentType(
                      dispatch,
                      "complete",
                      card.id,
                      activeSubTab,
                      contentType.id
                    )
                  }
                >
                  Mark as Read
                  <ImageUI
                    url="/energy.png"
                    height="12px"
                    isPublic
                    className="ml5"
                  />
                  1
                </div>
              )}

              {isViewMore && <div className="btn btn-outline mr5">View</div>}
              <div
                className={styles.bookmarkButton}
                onClick={() =>
                  updateContentType(
                    dispatch,
                    "save",
                    card.id,
                    activeSubTab,
                    contentType.id
                  )
                }
              >
                <ImageUI
                  url={saved ? "/bookmark.png" : "/bookmark-outline.png"}
                  height="20px"
                  isPublic
                />
              </div>
            </>
          ) : (
            <div className="btn btn-outline">Requires Mastery Lvl 5</div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const contentMap = {
      content: {
        ideas: <ContentTypeCardMap contentTypes={card.ideas} />,
        actions: <ContentTypeCardMap contentTypes={card.exercises} />,
        questions: <ContentTypeCardMap contentTypes={card.questions} />,
        program: (
          <Program
            day={programData.day}
            completedContents={programData.completedContents}
            cardId={card.id}
            isTicketPurchased={programData.isTicketPurchased}
          />
        ),
      },
      support: {
        stories: <ContentTypeCardMap contentTypes={card.stories} />,
        tips: <ContentTypeCardMap contentTypes={card.tips} />,
        faq: <ContentTypeCardMap contentTypes={card.faqs} />,
        metaphors: <ContentTypeCardMap contentTypes={card.metaphores} />,
      },
      research: {
        experiments: <ContentTypeCardMap contentTypes={card.experiments} />,
        expertopinions: (
          <ContentTypeCardMap contentTypes={card.expertopinions} />
        ),
        quotes: <ContentTypeCardMap contentTypes={card.quotes} />,
        casestudy: <ContentTypeCardMap contentTypes={card.casestudies} />,
      },
    };

    const content = contentMap[activeMainTab]?.[activeSubTab];

    return content || null;
  };
  return (
    <div className={styles.tabsDataContainer}>
      {renderMainTabs()}
      <Quest staticQuest={questMap[activeSubTab]} />
      {renderSubTabs()}
      {/* <Title name={activeSubTab} /> */}

      <div className="section">{renderContent()}</div>

      <div className="flex_between section">
        {getAdjacentLabels(activeSubTab).previous && (
          <div
            className="btn btn-outline"
            onClick={() => handleNextOrPrevious("previous")}
          >
            Previous: {getAdjacentLabels(activeSubTab).previous.toUpperCase()}
          </div>
        )}
        {getAdjacentLabels(activeSubTab).next && (
          <div
            className="btn btn-outline"
            onClick={
              () => handleNextOrPrevious("next")
              // handleSubTabClick(getAdjacentLabels(activeSubTab).next)
            }
          >
            Next: {getAdjacentLabels(activeSubTab).next.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsData;
