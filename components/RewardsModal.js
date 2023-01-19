import { useContext, useEffect, useState } from "react";
import cx from "classnames";
import { Context } from "../context/store";

import { ImageUI } from "../components/reusableUI";
import styles from "../styles/RewardsModal.module.scss";
import { closeRewardsModal } from "../actions/action";
import { Rarity } from "./Rarity";
import { ArtifactModal } from "../pages/profile";
import ProgressBar from "./ProgressBar";
import { getXpLimit } from "../utils/calculations";
const baseUrl = "https://backend-actionise.herokuapp.com";

export const RewardsModal = ({ defaultPage = "xp" }) => {
  const [store, dispatch] = useContext(Context);
  const user = store.user;

  const rewardsModal = store.rewardsModal;

  const { isLevelnew, level, xp, stars, artifact } = rewardsModal.rewards;

  const [page, setPage] = useState(defaultPage);
  const [counter, setCounter] = useState(artifact ? 3 : stars ? 2 : 1);
  const nextPage = () => {
    setCounter(counter - 1);

    if (page === "xp" && stars) {
      setPage("stars");
    }

    if (page === "stars" && artifact) {
      setPage("artifact");
    }
  };

  const AnimatedCurrency = ({ max }) => {
    const [currency, setCurrency] = useState(1);
    console.log("max", max);
    console.log("currency", currency);

    const iterate = (stop) => {
      for (let i = 0; i <= stop; i++) {
        console.log(currency);
        setTimeout(
          setCurrency((oldCurrency) => oldCurrency + 1),
          1000
        );
      }
    };

    useEffect(() => {
      iterate(max);
    }, []);
    return <div>{currency}</div>;
  };

  return (
    <div className={styles.rewardsModal}>
      {page === "xp" &&
        (isLevelnew ? (
          <div className={styles.rewardsBox}>
            <img height="60px" src={`${baseUrl}/xp.png`} />
            <div className={styles.xp}>+ {xp} XP</div>

            <div className={styles.levelUp}>LEVEL UP!</div>
            <div className={styles.level_progress}>Level {level}</div>
            {/* calc progress current */}
            <ProgressBar progress={user.xp + xp} max={getXpLimit(level)} />

            <div className={styles.xp_progress}>
              XP {user.xp + xp}/{getXpLimit(level)}
            </div>
          </div>
        ) : (
          <div className={styles.rewardsBox}>
            <img height="60px" src={`${baseUrl}/xp.png`} />
            <div className={styles.xp}>+ {xp} XP</div>

            <div className={styles.level_progress}>Level {user.level}</div>
            <ProgressBar progress={user.xp + xp} max={getXpLimit(user.level)} />

            <div className={styles.xp_progress}>
              XP {user.xp + xp}/{getXpLimit(user.level)}
            </div>
          </div>
        ))}

      {page === "stars" && (
        <div className={styles.rewardsBox}>
          <img height="50px" src={`${baseUrl}/stars.png`} />
          <div className={styles.stars}>+ {stars} Stars</div>
        </div>
      )}

      {page === "artifact" && (
        <div>
          <ArtifactModal
            artifact={{ ...artifact, isCollected: true, isClaimed: true }}
          />
          {/* <Rarity rarity={card.card.rarity} /> */}
        </div>
      )}
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
        {!(page === "artifact") && (
          <div className="modal-close-button-lootbox ">{counter}</div>
        )}
      </div>
    </div>
  );
};

export default RewardsModal;
