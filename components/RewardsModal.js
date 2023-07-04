import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/store";
import styles from "@/styles/RewardsModal.module.scss";
import { closeRewardsModal } from "@/actions/action";
import { ArtifactModal } from "@/pages/profile";
import ProgressBar from "./ProgressBar";
import baseUrl from "@/utils/settings";
import Card from "./Card";

export const RewardsModal = () => {
  const [store, dispatch] = useContext(Context);
  const rewards = store.rewardsModal.rewards;
  const [pages, setPages] = useState(rewards ? Object.keys(rewards) : []);
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [counter, setCounter] = useState(pages.length);

  useEffect(() => {
    setPages(rewards ? Object.keys(rewards) : []);
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

  const renderPage = () => {
    if (rewards[currentPage]) {
      const reward = rewards[currentPage];

      if (currentPage === "xp") {
        const { xpGained, level, xp, xpLimit, isLevelnew } = reward;
        return (
          <div className={styles.rewardsBox}>
            <img height="60px" src={`${baseUrl}/xp.png`} />
            <div className={styles.xp}>+ {xpGained} XP</div>

            {isLevelnew && <div className={styles.levelUp}>LEVEL UP!</div>}
            <div className={styles.level_progress}>Level {level}</div>
            {/* calc progress current */}
            <ProgressBar progress={xp} max={xpLimit} />

            <div className={styles.xp_progress}>
              XP {xp}/{xpLimit}
            </div>
          </div>
        );
      }

      if (currentPage === "stars") {
        return (
          <div className={styles.rewardsBox}>
            <img height="50px" src={`${baseUrl}/stars.png`} />
            <div className={styles.stars}>+ {reward} Stars</div>
          </div>
        );
      }

      if (currentPage === "artifact") {
        return (
          <div>
            <ArtifactModal
              artifact={{ ...reward, isCollected: true, isClaimed: true }}
            />
          </div>
        );
      }

      if (currentPage === "card") {
        return (
          <div>
            <Card card={{ ...reward, is_unlocked: true }} />
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className={styles.rewardsModal}>
      {renderPage()}

      <div className={styles.ctaBox}>
        {counter === 1 ? (
          <div
            className="btn btn-primary m1"
            onClick={() => closeRewardsModal(dispatch)}
          >
            Claim
          </div>
        ) : (
          <div className="btn btn-primary m1" onClick={nextPage}>
            Next Reward
          </div>
        )}
        {!(rewards[currentPage]?.type === "artifact") && (
          <div className="modal-close-button-lootbox ">{counter}</div>
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
