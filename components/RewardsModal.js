import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/store";
import styles from "@/styles/RewardsModal.module.scss";
import { closeRewardsModal } from "@/actions/action";
import { ArtifactModal } from "@/pages/profile";
import ProgressBar from "./ProgressBar";
import baseUrl from "@/utils/settings";
import Card from "./Card";
import { ContentTypeTag } from "./CardContent/CardContentTab";
import { CONTENT_MAP } from "@/data/contentTypesData";
import { useRouter } from "next/router";
import congratsLottie from "@/assets/lottie-animations/congrats.json";
import Lottie from "lottie-react";
import { ImageUI } from "./reusableUI";

const META_DATA = ["usercard", "cardMeta"]; // KEYS IN REWARDS OBJECT HERE ARE IGNORED IN MODAL

export const RewardsModal = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const rewards = store.rewardsModal.rewards;

  const [pages, setPages] = useState(
    rewards
      ? Object.keys(rewards).filter(
          (key) => !META_DATA.includes(key) && rewards[key]
        )
      : []
  );
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [counter, setCounter] = useState(pages.length);

  useEffect(() => {
    return () => {
      dispatch({ type: "CLOSE_REWARDS_MODAL" });
    };
  }, []);

  useEffect(() => {
    setPages(
      rewards
        ? Object.keys(rewards).filter(
            (key) => !META_DATA.includes(key) && !!key
          )
        : []
    );
    setCurrentPage(pages[0]);
    setCounter(pages.length);
  }, [rewards]);

  const nextPage = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    }
    setCounter(counter - 1);
  };

  const renderPage = (currPage) => {
    if (rewards[currPage]) {
      const reward = rewards[currPage];

      if (currPage === "xp") {
        const { xpGained, level, xp, xpLimit, isLevelnew } = reward;

        return (
          <div className={styles.rewardsBox}>
            <div className={styles.level_progress}>Level {level}</div>
            <img height="60px" src={`${baseUrl}/xp.png`} />
            <div className={styles.xp}>+ {xpGained} XP</div>

            {isLevelnew && <div className={styles.levelUp}>LEVEL UP!</div>}

            {/* calc progress current */}
            <ProgressBar progress={xp} max={xpLimit} />

            <div className={styles.xp_progress}>
              XP {xp}/{xpLimit}
            </div>
          </div>
        );
      } else if (currPage === "stars") {
        return (
          <div className={styles.rewardsBox}>
            <img height="50px" src={`${baseUrl}/stars.png`} />
            <div className={styles.stars}>+ {reward} Stars</div>
          </div>
        );
      } else if (currPage === "artifact") {
        return (
          <div>
            <ArtifactModal
              artifact={{ ...reward, isCollected: true, isClaimed: true }}
            />
          </div>
        );
      } else if (currPage === "card") {
        return (
          <div className={styles.cardRewardBox}>
            <div className={styles.newCardLabel}>New Card!</div>
            <Card card={{ ...reward, is_unlocked: true }} />
          </div>
        );
      } else if (currPage === "content") {
        const card = rewards.cardMeta;
        const navigateToContent = () => {
          closeRewardsModal(dispatch);
          router.push({
            pathname: `/card/${card.id}`,
            query: { contentId: reward.id, contentType: reward.type },
          });
        };
        const single = CONTENT_MAP[reward.type]?.single;
        const maxProgress = CONTENT_MAP[reward.type]?.max;
        return (
          <div className={styles.cardRewardBox}>
            <div className={styles.newCardLabel}>New {single}!</div>

            <ImageUI
              url={"/loot-box-2.png"}
              isPublic
              height="50px"
              className="mb1"
            />

            <div
              className={styles.newContent}
              onClick={() => navigateToContent()}
            >
              <div className="new">new</div>
              <div className="pb1">
                #{reward.id} {reward.title}
              </div>
              <div className="flex_between wFull">
                <ContentTypeTag type={reward.type} />
                <div className="flex_center">0 / {maxProgress}</div>
              </div>
            </div>

            {/* <div className={styles.newCardLabel}>From Card:</div>
            <Card card={card} /> */}
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className={styles.rewardsModal}>
      <div className={styles.lottiePosition}>
        <Lottie
          animationData={congratsLottie}
          loop={3}
          style={{ width: "220px" }}
        />
      </div>

      {renderPage(currentPage)}

      <div className={styles.ctaBox}>
        {counter === 1 ? (
          <div
            className="btn btn-primary mt1"
            onClick={() => closeRewardsModal(dispatch)}
          >
            Claim
          </div>
        ) : (
          <div className="btn btn-primary m1" onClick={nextPage}>
            Next Reward ({counter - 1})
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsModal;

// import { useContext, useEffect, useState } from "react";
// import { Context } from "@/context/store";
// import styles from "@/styles/RewardsModal.module.scss";
// import { closeRewardsModal } from "@/actions/action";
// import { ArtifactModal } from "@/pages/profile";
// import ProgressBar from "./ProgressBar";
// import baseUrl from "@/utils/settings";

// export const RewardsModal = () => {
//   const [store, dispatch] = useContext(Context);

//   const rewardsModal = store.rewardsModal;

//   const pages = Object.keys(rewardsModal.rewards);

//   const [page, setPage] = useState(Object.keys(rewardsModal.rewards)[0]);
//   const [pageCounter, setPageCounter] = useState(0);
//   const [counter, setCounter] = useState(
//     Object.keys(rewardsModal.rewards).length
//   );

//   const nextPage = () => {
//     setCounter(counter - 1);
//     setPage(pages[pageCounter + 1]);
//     setPageCounter(pageCounter + 1);
//   };

//   const AnimatedCurrency = ({ max }) => {
//     const [currency, setCurrency] = useState(1);
//     console.log("max", max);
//     console.log("currency", currency);

//     const iterate = (stop) => {
//       for (let i = 0; i <= stop; i++) {
//         console.log(currency);
//         setTimeout(
//           setCurrency((oldCurrency) => oldCurrency + 1),
//           1000
//         );
//       }
//     };

//     useEffect(() => {
//       iterate(max);
//     }, []);
//     return <div>{currency}</div>;
//   };

//   return (
//     <div className={styles.rewardsModal}>
//       {page === "xp" && (
//         <div className={styles.rewardsBox}>
//           <img height="60px" src={`${baseUrl}/xp.png`} />
//           <div className={styles.xp}>+ {xpGained} XP</div>

//           {isLevelnew && <div className={styles.levelUp}>LEVEL UP!</div>}
//           <div className={styles.level_progress}>Level {level}</div>
//           {/* calc progress current */}
//           <ProgressBar progress={xp} max={xpLimit} />

//           <div className={styles.xp_progress}>
//             XP {xp}/{xpLimit}
//           </div>
//         </div>
//       )}

//       {page === "stars" && (
//         <div className={styles.rewardsBox}>
//           <img height="50px" src={`${baseUrl}/stars.png`} />
//           <div className={styles.stars}>+ {stars} Stars</div>
//         </div>
//       )}

//       {page === "artifact" && (
//         <div>
//           <ArtifactModal
//             artifact={{ ...artifact, isCollected: true, isClaimed: true }}
//           />
//         </div>
//       )}
//       <div className={styles.ctaBox}>
//         {counter === 1 ? (
//           <div
//             className="btn btn-primary m1"
//             onClick={() => closeRewardsModal(dispatch)}
//           >
//             Claim
//           </div>
//         ) : (
//           <div className="btn btn-primary m1" onClick={nextPage}>
//             Next Reward
//           </div>
//         )}
//         {!(page === "artifact") && (
//           <div className="modal-close-button-lootbox ">{counter}</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RewardsModal;
