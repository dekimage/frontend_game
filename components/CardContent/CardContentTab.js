import { useContext, useEffect, useState } from "react";

import { PlayerCtaFooter, Title } from "../cardPageComps";
import styles from "@/styles/CardContentTab.module.scss";
import { Button, ImageUI } from "../reusableUI";
import iconLock from "@/assets/lock-white-border.svg";
import ProgressBar from "../ProgressBar";
import { updateContentType } from "@/actions/action";
import { Context } from "@/context/store";
import { CONTENT_MAP, tabs } from "@/data/contentTypesData";
import { Program } from "../Program/Program";
import { Tabs } from "../reusable/Tabs";
import Modal from "../reusable/Modal";
import EnergyModal from "../EnergyModal";
import { DropDown } from "../reusable/Dropdown";
import ReactMarkdown from "react-markdown";
import { BackButton } from "../reusable/BackButton";
import { BookmarkButton } from "../reusable/BookmarkButton";
import { isReadyToComplete } from "@/utils/calculations";
import IsReadyToCompleteModal from "../Modals/IsReadyToCompleteModal";
import RewardsModal from "../RewardsModal";
import { useRouter } from "next/router";
import Timer from "../reusable/Timer";
import ContentLockedModal from "../Modals/ContentLockedModal";
import ObjectivesModal from "../Modals/ObjectivesModal";
import {
  MASTERY_PER_PROGRAM_COMPLETE,
  PROGRAM_COMPLETED_MAX,
} from "@/data/config";
import { calculateCardMaxProgress, calculateCardProgress } from "@/utils/joins";
import LootBoxHelperModal from "../Modals/LootBoxHelperModal";

const mergeCardProperties = (card, usercard) => {
  const mergedArray = [];
  const allowedProperties = Object.keys(CONTENT_MAP);

  for (const property in card) {
    if (
      card.hasOwnProperty(property) &&
      Array.isArray(card[property]) &&
      allowedProperties.includes(property)
    ) {
      const { progressMap } = usercard;
      const type = property;
      const maxProgress = CONTENT_MAP[property].max;
      const mergedObjects = card[property].map((content) => {
        const progress = progressMap?.[type]?.[content.id]?.completed || 0;
        const lastTimeMS = progressMap?.[type]?.[content.id]?.lastTime;
        const isNew = progressMap?.[type]?.[content.id]?.isNew || false;
        const saved = progressMap?.[type]?.[content.id]?.saved;
        const isUnlocked =
          content.isOpen || !!progressMap?.[type]?.[content.id];
        const isCompleted = maxProgress == progress;
        const isReady = lastTimeMS ? isReadyToComplete(lastTimeMS) : true;

        const transformedContent = {
          ...content,
          type,
          maxProgress,
          progress,
          saved,
          isUnlocked,
          isCompleted,
          isReady,
          lastTimeMS,
          isNew,
        };

        return transformedContent;
      });
      mergedArray.push(...mergedObjects);
    }
  }

  return mergedArray;
};

export const ContentTypeTag = ({ type }) => {
  const color = CONTENT_MAP[type]?.color;
  const single = CONTENT_MAP[type]?.single;
  return (
    <div className={styles.contentTypeTag} style={{ backgroundColor: color }}>
      <div className={styles.contentTypeTagText}>{single}</div>
    </div>
  );
};

export const TableHeader = ({ isFromBookmark = false }) => {
  return (
    <div className={styles.tableHeader}>
      {/* <div className={styles.tableHeader_item}>Index</div> */}
      <div
        className={styles.tableHeader_item}
        style={{
          flexGrow: 0.4,
          justifyContent: "flex-start",
          marginLeft: ".5rem",
          maxWidth: "400px",
        }}
      >
        Title
      </div>
      <div className={styles.tableHeader_item}>Type</div>
      <div
        className={styles.tableHeader_item}
        style={{
          flexGrow: 0.2,
          marginRight: "1.75rem",
        }}
      >
        {isFromBookmark ? "Card" : "Progress"}
      </div>
    </div>
  );
};

export const ContentRow = ({
  content,
  setContentPage,
  updateContentType,
  setIsLockModalOpen,
}) => {
  const {
    progress,
    maxProgress,
    isUnlocked,
    id,
    title: baseTitle,
    isNew,
    type,
    // from bookmark
    isFromBookmark = false,
    card = false,
  } = content;

  const router = useRouter();

  const transformedTitle = baseTitle
    ? baseTitle
    : content.content
    ? content.content
    : content.question;
  const title =
    (transformedTitle || "").length > 35
      ? `${transformedTitle.slice(0, 35)}...`
      : transformedTitle;

  const cardName = isFromBookmark
    ? card.name.length > 10
      ? `${card.name.slice(0, 10)}...`
      : card.name
    : false;

  // <div className={styles.rowWithBookmark}>
  //   {isFromBookmark ? (
  //     <div>
  //       <Row />
  //       {isFromBookmark && (
  //         <div className={styles.fromCardLabel}>{card.name}</div>
  //       )}
  //     </div>
  //   ) : (
  //     <Row />
  //   )}
  // </div>

  return (
    <div
      className={styles.tableRow}
      onClick={() => {
        if (isFromBookmark) {
          router.push({
            pathname: `/card/${card.id}`,
            query: { contentId: id, contentType: type },
          });
        } else {
          if (isUnlocked) {
            setContentPage(content);
            isNew &&
              updateContentType(dispatch, "removeNew", card.id, type, id);
          } else {
            setIsLockModalOpen(true);
          }
        }
      }}
    >
      {/* {isCompleted && (
        <div className={styles.tableRow_complete}>
          <ImageUI url="/checked.png" height="16px" isPublic />
        </div>
      )} */}
      {/* <div className={styles.tableRow_item}>
        <span className={styles.hash}>#</span>
        {id}
      </div> */}
      <div
        className={styles.tableRow_item}
        style={{
          flexGrow: 0.6,
          justifyContent: "flex-start",
          fontWeight: "500",
        }}
      >
        {title}
      </div>
      <div
        className={styles.tableRow_item}
        style={{
          maxWidth: "3.5rem",
        }}
      >
        <ContentTypeTag type={type} />
      </div>
      <div
        className={styles.tableRow_item}
        style={{
          flexGrow: 0.2,
          maxWidth: "6rem",
          fontSize: "14px",
        }}
      >
        {isFromBookmark ? (
          <div className="flex_center">
            <div className={styles.fromCardLabel}>{cardName}</div>
            {/* <ImageUI url={"/bookmark.png"} height="18px" isPublic /> */}
          </div>
        ) : isNew ? (
          <div className="new">new</div>
        ) : isUnlocked ? (
          <div className="flex_center">
            {progress} / {maxProgress}
            <ImageUI
              url={"/mastery.png"}
              isPublic
              height="12px"
              className="ml5"
            />
          </div>
        ) : (
          <img src={iconLock} alt="locked" height="16px" />
        )}
      </div>
    </div>
  );
};

const CardContentTab = ({ card, usercard, programData }) => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const [isEnergyModalOpen, setIsEnergyModalOpen] = useState(false);
  const [isReadyToCompleteModal, setIsReadyToCompleteModal] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  const [contentData, setContentData] = useState(
    mergeCardProperties(card, usercard)
  );
  const [activeTab, setActiveTab] = useState("program");
  const [selectedType, setSelectedType] = useState(null);
  const [contentPage, setContentPage] = useState(null);
  const [openTypeContainer, setOpenTypeContainer] = useState(null);

  // calculate quests count for notification in tab!
  const [questsReadyToClaimCount, setQuestsReadyToClaimCount] = useState(-1);

  const [isLootboxModalopen, setIsLootboxModalOpen] = useState(false);

  useEffect(() => {
    const { progressQuest } = usercard;

    const readyToClaimArray = Object.keys(CONTENT_MAP).map((type) => {
      const userQuest = progressQuest?.[type] || {
        progress: 0,
        level: 1,
      };
      return userQuest.progress >= CONTENT_MAP[type].max;
    });
    const readyToClaimCount = readyToClaimArray.filter(Boolean).length;

    setQuestsReadyToClaimCount(readyToClaimCount);
  }, [usercard]);

  const onStart = (type) => {
    setActiveTab("content");
    // setSelectedType(type);
    setOpenTypeContainer(type);
  };

  useEffect(() => {
    const id = router.query.contentId || false;
    const type = router.query.contentType || false;

    if (id && type) {
      setActiveTab("content");
      setContentPage(
        contentData.find((content) => content.id == id && content.type == type)
      );
    }
  }, [router.query]);

  useEffect(() => {
    const tabOpen = router.query.tab;
    if (tabOpen) {
      setActiveTab(tabOpen);
    }
  }, [router.query]);

  useEffect(() => {
    const newMergedData = contentData.filter(
      (content) => content.type == selectedType
    );

    if (selectedType) {
      setContentData(newMergedData);
    }

    if (selectedType == "All") {
      setContentData(mergeCardProperties(card, usercard));
    }
  }, [selectedType]);

  useEffect(() => {
    const newMergedData = mergeCardProperties(card, usercard);

    setContentData(newMergedData);
  }, [usercard]);

  // const typesDataForDropdown = Object.keys(CONTENT_MAP).map((type) => {
  //   return {
  //     name: type,
  //   };
  // });

  const renderTabs = () => {
    return (
      <Tabs
        tabState={activeTab}
        setTab={(tab) => setActiveTab(tab)}
        tabs={tabs(questsReadyToClaimCount)}
      />
    );
  };

  const Quest = ({ type, onStart, setIsLootboxModalOpen }) => {
    const { progressQuest } = usercard;
    const userQuest = progressQuest?.[type] || {
      progress: 0,
      level: 1,
    };
    const isReadyToClaim = userQuest.progress >= CONTENT_MAP[type].max;
    const isInProgress = userQuest.progress >= 1;
    const color = CONTENT_MAP[type].color;

    return (
      <div className={styles.quest}>
        <div className={styles.questTag} style={{ backgroundColor: color }}>
          <ContentTypeTag type={type} />
        </div>
        <div className="p5">
          <div className="flex_center mb5">
            <div className={styles.questLevel}>Level {userQuest.level}</div>
          </div>

          {/* {isReadyToClaim && ( */}
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setIsLootboxModalOpen(true)}
          >
            <ImageUI
              url={"/loot-box.png"}
              style={{
                marginBottom: ".5rem",
                filter: !isReadyToClaim && "grayscale(100%)",
              }}
              isPublic
              height="50px"
            />
          </div>
          {/* )} */}

          <ProgressBar
            progress={userQuest.progress}
            max={CONTENT_MAP[type].max}
            withNumber
            isReadyToClaim={isReadyToClaim}
            withIcon={"mastery"}
          />

          <div className="flex_center mt1">
            {isReadyToClaim ? (
              <div
                className="btn btn-action mt1"
                onClick={() =>
                  updateContentType(dispatch, "claim", card.id, type)
                }
              >
                Claim
              </div>
            ) : isInProgress ? (
              <div
                className="btn btn-primary mt1"
                onClick={() => onStart(type)}
              >
                Continue
              </div>
            ) : (
              <div className="btn btn-green mt1" onClick={() => onStart(type)}>
                Start
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ContentPage = ({ content, closeModal }) => {
    const {
      progress,
      maxProgress,
      isCompleted,
      sortOrder,
      id,
      type,
      saved,
      title,
      isReady,
      lastTimeMS,
    } = content;

    //attempt to make reusable - maybe change
    const contentText = content.content || content.question || "empty";
    const timeLeft = 86400000 - (Date.now() - lastTimeMS);

    const [exerciseTitle, stepsText] = contentText.split("\nSteps:\n\n");

    // EXERCISE markdown
    const processedSteps =
      type === "exercises"
        ? stepsText
            .split("\n")
            .map((line, index) => {
              // Skip empty lines
              if (line.trim() === "") {
                return null;
              }
              return `${index + 1}. ${line}`;
            })
            .filter(Boolean)
            .join("\n")
        : contentText;

    return (
      <div className={styles.tip} key={id}>
        <div className={styles.contentTitle}>
          {/* {type} # {sortOrder} */}
          {title}
        </div>

        <BackButton isBack callback={() => closeModal()} />

        <BookmarkButton
          callBack={() =>
            updateContentType(dispatch, "save", card.id, type, id)
          }
          saved={saved}
        />

        {/* <div className={styles.progressIndicator}>
          {progress}/{maxProgress}
        </div> */}

        <ContentTypeTag type={type} />

        <div className={styles.tipContent}>
          {type == "exercises" ? (
            <div>
              <p>{exerciseTitle}</p>
              <p>Steps:</p>

              <ReactMarkdown>{processedSteps}</ReactMarkdown>
            </div>
          ) : (
            <ReactMarkdown>{processedSteps}</ReactMarkdown>
          )}
        </div>

        <div className={styles.contentPageCta}>
          {isCompleted ? (
            <div className={styles.actionBarComplete}>
              Completed
              <ImageUI
                url="/checked.png"
                height="20px"
                isPublic
                className="ml5"
              />
            </div>
          ) : isReady ? (
            <div
              className="btn btn-primary"
              onClick={() => {
                if (isReady && store.user.energy >= 1) {
                  updateContentType(dispatch, "complete", card.id, type, id);
                  setContentPage(null);
                }

                if (store.user.energy < 1) {
                  setIsEnergyModalOpen(true);
                }
              }}
            >
              Mark as{" "}
              {type == "exercises"
                ? "Complete"
                : type == "questions"
                ? "Answered"
                : "Read"}
              <ImageUI
                url="/energy.png"
                height="20px"
                isPublic
                className="ml5"
              />
            </div>
          ) : (
            <div className="flex_center">
              <Timer
                timeLeftProp={timeLeft}
                jsxComplete={<div className="btn btn-correct">Refresh</div>}
              />
              <div
                className="btn btn-primary ml1"
                onClick={() => setIsReadyToCompleteModal(true)}
              >
                ?
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // NEW V2 !!
  const ContentItem = ({
    content,
    setContentPage,
    updateContentType,
    setIsLockModalOpen,
    index,
  }) => {
    const {
      progress,
      maxProgress,
      isUnlocked,
      id,
      title: baseTitle,
      isNew,
      type,
      // from bookmark
      isFromBookmark = false,
      card = false,
    } = content;

    const router = useRouter();

    const transformedTitle = baseTitle
      ? baseTitle
      : content.content
      ? content.content
      : content.question;
    const title =
      (transformedTitle || "").length > 30
        ? `${transformedTitle.slice(0, 30)}...`
        : transformedTitle;

    const cardName = isFromBookmark
      ? card.name.length > 10
        ? `${card.name.slice(0, 10)}...`
        : card.name
      : false;

    const timeLeft =
      content.lastTimeMS && 86400000 - (Date.now() - content.lastTimeMS);

    return (
      <div
        className={styles.contentItem}
        onClick={() => {
          if (isFromBookmark) {
            router.push({
              pathname: `/card/${card.id}`,
              query: { contentId: id, contentType: type },
            });
          } else {
            if (isUnlocked) {
              setContentPage(content);
              isNew &&
                updateContentType(
                  dispatch,
                  "removeNew",
                  router.query.id,
                  type,
                  id
                );
            } else {
              setIsLockModalOpen(true);
            }
          }
        }}
      >
        <div className={styles.contentItem_body}>
          <div className={styles.contentItem_title}>{title}</div>
          <div className={styles.typeAbsolute}>
            <ContentTypeTag type={type} />
          </div>
          {timeLeft && timeLeft > 0 && (
            <div className={styles.doneToday}>Done Today</div>
          )}
          {isNew && <div className="new">new</div>}
          {isUnlocked && (
            <div className="flex_center">
              <ProgressBar
                isComplete={progress == maxProgress}
                progress={progress}
                max={maxProgress}
                withNumber
                withIcon="mastery"
              />
            </div>
          )}
        </div>

        <div className={styles.contentItem_action}>
          {isUnlocked ? (
            <div className={styles.btnPlay}>
              <ion-icon size="medium" name="play"></ion-icon>
            </div>
          ) : (
            <img src={iconLock} alt="locked" height="24px" />
          )}
        </div>

        {isFromBookmark && (
          <div className="flex_center">
            <div className={styles.fromCardLabel}>{cardName}</div>
          </div>
        )}
      </div>
    );
  };

  // NEW V2 !!!
  const ContentTypeContainer = ({ type }) => {
    // const [isOpen, setIsOpen] = useState(false);
    const totalProgressForType = contentData
      .filter((content) => content.type === type)
      .reduce((acc, content) => acc + content.progress, 0);

    const totalProgressMaxForType =
      contentData.filter((content) => content.type === type).length *
      CONTENT_MAP[type].max;
    return (
      <div className={styles.typeGroupContainer}>
        <div
          className={styles.typeGroup}
          onClick={() =>
            setOpenTypeContainer(openTypeContainer == type ? null : type)
          }
        >
          <div
            className={styles.typeGroup_image}
            style={{ backgroundColor: CONTENT_MAP[type].color }}
          >
            <ImageUI url={`/${type}.png`} height="30px" isPublic />
          </div>
          <div className={styles.typeGroup_body}>
            <div className={styles.typeGroup_title}>
              {CONTENT_MAP[type].plural} (
              {contentData.filter((content) => content.type === type).length})
            </div>
            <ProgressBar
              isComplete={totalProgressForType == totalProgressMaxForType}
              progress={totalProgressForType}
              max={totalProgressMaxForType}
            />
          </div>
          <div className={styles.typeGroup_arrow}>
            {openTypeContainer == type ? (
              <ion-icon name="caret-up-outline"></ion-icon>
            ) : (
              <ion-icon name="caret-down-outline"></ion-icon>
            )}
          </div>
        </div>
        {openTypeContainer == type && (
          <div className={styles.typeGroup_content}>
            {contentData
              .filter((content) => content.type === type)
              .map((content, i) => (
                <ContentItem
                  content={content}
                  setContentPage={setContentPage}
                  updateContentType={updateContentType}
                  key={i}
                  index={i}
                />
              ))}
          </div>
        )}
      </div>
    );
  };

  const ContentTable = () => {
    const maxProgressContent = calculateCardMaxProgress(
      card.relationCount
    ).totalMaxProgress;
    const progressContent = calculateCardProgress(
      usercard.progressMap
    ).totalProgress;

    return (
      <div className="section">
        {/* <div className={styles.dropdownSection}>
          <DropDown
            data={typesDataForDropdown}
            label="Type"
            filter={selectedType}
            setFilter={setSelectedType}
            fullWidth
            // Jsx={ContentTypeTag}
          />
        </div> */}

        {/* <TableHeader /> */}

        {/* {contentData.map((content, i) => (
          <ContentRow
            content={content}
            setContentPage={setContentPage}
            updateContentType={updateContentType}
            setIsLockModalOpen={setIsLockModalOpen}
            key={i}
          />
        ))} */}

        <div className="flex_center mt5 mb5">
          Content Completed &nbsp; {progressContent}/{maxProgressContent}
          <ImageUI
            url={"/mastery.png"}
            isPublic
            height="20px"
            className="ml5"
          />
        </div>

        {Object.keys(CONTENT_MAP).map((type, i) => {
          return <ContentTypeContainer type={type} key={i} />;
        })}

        {contentPage && (
          <Modal
            showCloseButton={false}
            isShowing={contentPage}
            isAnimate={false}
            jsx={
              <ContentPage
                content={contentPage}
                closeModal={() => setContentPage(null)}
              />
            }
          />
        )}

        {isReadyToCompleteModal && (
          <Modal
            isShowing={isReadyToCompleteModal}
            closeModal={() => setIsReadyToCompleteModal(false)}
            jsx={<IsReadyToCompleteModal contentType={contentPage} />}
            isSmall
          />
        )}

        {isEnergyModalOpen && (
          <Modal
            isShowing={isEnergyModalOpen}
            closeModal={() => setIsEnergyModalOpen(false)}
            jsx={<EnergyModal closeModal={() => setIsEnergyModalOpen(false)} />}
            isSmall
          />
        )}

        {isLockModalOpen && (
          <Modal
            isShowing={isLockModalOpen}
            closeModal={() => setIsLockModalOpen(false)}
            jsx={
              <ContentLockedModal
                callBack={() => {
                  setIsLockModalOpen(false);
                  setActiveTab("progress");
                }}
              />
            }
            isSmall
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.tabsDataContainer}>
      {renderTabs()}

      {activeTab == "progress" && (
        <div className="section">
          <div className={styles.grid}>
            {Object.keys(CONTENT_MAP).map((type, i) => (
              <Quest
                type={type}
                onStart={onStart}
                setIsLootboxModalOpen={setIsLootboxModalOpen}
                key={i}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab == "content" && (
        <div>
          <ContentTable />
        </div>
      )}

      {activeTab == "program" && (
        <div className="section">
          <div className="flex_center mt5 mb5">
            Program Completed &nbsp;{" "}
            {usercard.completed * MASTERY_PER_PROGRAM_COMPLETE}/
            {PROGRAM_COMPLETED_MAX * MASTERY_PER_PROGRAM_COMPLETE}
            <ImageUI
              url={"/mastery.png"}
              isPublic
              height="20px"
              className="ml5"
            />
          </div>
          <div className="flex_center">
            {programData.isTicketPurchased && (
              <div className={styles.programOpen}>
                <ImageUI
                  isPublic
                  url={"/energy.png"}
                  height={24}
                  width={24}
                  className="mr5"
                />
                Open Today
              </div>
            )}
          </div>

          <Program
            day={programData.day}
            cardId={card.id}
            isTicketPurchased={programData.isTicketPurchased}
            isProgramMastered={programData.isProgramMastered}
          />
          <PlayerCtaFooter
            card={card}
            isTicketPurchased={programData.isTicketPurchased}
          />
        </div>
      )}

      <Modal
        isShowing={isLootboxModalopen}
        closeModal={() => setIsLootboxModalOpen(false)}
        showCloseButton={true}
        jsx={<LootBoxHelperModal />}
        isSmall
      />

      <Modal
        isShowing={store.rewardsModal?.isOpen}
        closeModal={() => dispatch({ type: "CLOSE_REWARDS_MODAL" })}
        showCloseButton={false}
        jsx={<RewardsModal />}
        isSmall
      />

      <Modal
        isShowing={store.objectivesModal?.isOpen}
        closeModal={() => dispatch({ type: "CLOSE_OBJECTIVES_MODAL" })}
        jsx={<ObjectivesModal />}
        isSmall
      />
    </div>
  );
};

export default CardContentTab;
