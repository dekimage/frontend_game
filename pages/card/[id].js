import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  useState,
  useEffect,
  useContext,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import { Context } from "../../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import _ from "lodash";
import styles from "../../styles/CardPage.module.scss";
import ProgressBar from "../../components/ProgressBar";
import cx from "classnames";
import { updateCard } from "../../actions/action";

// import styles from "../../styles/card.module.scss";
// REMOVE SECOND STYLE - FIGURE OUT WAY FOR DOUBLE MODULES
// import styles_2 from "../../styles/Item.module.scss";

const GET_CARD_ID = gql`
  query ($id: ID!) {
    card(id: $id) {
      id
      name
      description
      type
      rarity
      duration
      realm {
        color
        name
      }
      image {
        url
      }
      slides {
        id
        title
        type
        image {
          url
        }
        content
        tips
        examples
        step
        timer
        card {
          id
          name
        }
      }
    }
  }
`;

const static_levels = [
  { lvl: 1, required: 1 },
  { lvl: 2, required: 1 },
  { lvl: 3, required: 1 },
  { lvl: 4, required: 1 },
  { lvl: 5, required: 2 },
  { lvl: 6, required: 2 },
  { lvl: 7, required: 2 },
  { lvl: 8, required: 3 },
  { lvl: 9, required: 3 },
  { lvl: 10, required: 3 },
];

const CardPage = ({ card, dispatch }) => {
  const proxyCard = {
    level: 2,
    completed: 4,
    totalProgress: 4,
    completed_at: "date-2022-22-22",
    obtained_at: "date-2022-22-22",
    quantity: 2,
    is_new: true,
    is_favorite: false,
  };
  const addFavoriteCard = (id) => {
    console.log(`Card with ID:${id} is now your favorite!`);
  };

  const [selectedLevel, setSelectedLevel] = useState(proxyCard.completed);
  return (
    <div className="section">
      <div className={styles.card}>
        <img
          className={styles.image}
          src={`http://localhost:1337${card.image.url}`}
        />
        <div
          className={styles.background}
          style={{ "--background": card.realm.color }}
        ></div>
        <div
          className={styles.curve}
          style={{ "--background": card.realm.color }}
        ></div>
        <div className={styles.section_name}>
          <div className={styles.name}>{card.name}</div>
          <div className={styles.favorite}>
            <div onClick={() => addFavoriteCard(card.id)}>
              {proxyCard.is_favorite ? (
                <ion-icon name="heart-outline"></ion-icon>
              ) : (
                <ion-icon name="heart-half-outline"></ion-icon>
              )}
            </div>
          </div>
        </div>

        <div className={styles.section_level}>
          <div className={styles.level}>
            <span style={{ fontSize: "40px" }}>{proxyCard.level}</span> lvl
          </div>
          <div className={styles.progress_box}>
            <span>
              {proxyCard.quantity}/{proxyCard.totalProgress}
            </span>
            <ProgressBar
              progress={proxyCard.quantity}
              max={proxyCard.totalProgress}
            />
          </div>
          {proxyCard.quantity >= proxyCard.totalProgress ? (
            <div className="btn btn-action">Upgrade</div>
          ) : (
            <div className="btn btn-disabled">Upgrade</div>
          )}
        </div>

        <div className={styles.section_stats}>
          <div className={styles.stats_component}>
            <div className={styles.stats_component__label}>Category:</div>
            <div className={styles.stats_component__label}>Health</div>
          </div>
          <div className={styles.stats_component}>
            <div className={styles.stats_component__label}>Rarity:</div>
            <div className={styles.stats_component__label}>Epic</div>
          </div>
          <div className={styles.stats_component}>
            <div className={styles.stats_component__label}>Type:</div>
            <div className={styles.stats_component__label}>Collectable</div>
          </div>
          <div className={styles.stats_component}>
            <div className={styles.stats_component__label}>Tier:</div>
            <div className={styles.stats_component__label}>Free</div>
          </div>
        </div>

        <div className="section">
          <hr className="seperator" />
        </div>

        <div className={styles.section_levels}>
          {static_levels.map((level, i) => {
            return (
              <div className={styles.level_box} key={i}>
                {level.lvl < proxyCard.completed && (
                  <div
                    className={styles.btn_play_passed}
                    onClick={() => setSelectedLevel(level.lvl)}
                  >
                    <ion-icon name="play"></ion-icon>
                  </div>
                )}
                {level.lvl == proxyCard.completed && (
                  <div
                    className={styles.btn_play_orange}
                    onClick={() => setSelectedLevel(level.lvl)}
                  >
                    <ion-icon name="play"></ion-icon>
                  </div>
                )}
                {level.lvl > proxyCard.completed &&
                  proxyCard.level >= level.required && (
                    <div className={styles.btn_play_grayopen}>
                      <ion-icon name="play"></ion-icon>
                    </div>
                  )}
                {level.lvl > proxyCard.completed &&
                  proxyCard.level < level.required && (
                    <div className={styles.btn_play_graylocked}>
                      <ion-icon name="lock-closed-outline"></ion-icon>
                    </div>
                  )}
                {level.lvl}
              </div>
            );
          })}
        </div>
        <div className="section">
          <hr className="seperator" />
        </div>
      </div>
      <div>
        <div
          className="btn btn-secondary margin"
          onClick={() => updateCard(dispatch, card.id, "favorite")}
        >
          Favorite Card
        </div>
        <div
          className="btn btn-secondary margin"
          onClick={() => updateCard(dispatch, card.id, "new_disable")}
        >
          Make this card Not New
        </div>
        <div
          className="btn btn-secondary margin"
          onClick={() => updateCard(dispatch, card.id, "new_activate")}
        >
          Make this Card New
        </div>
        <div
          className="btn btn-secondary margin"
          onClick={() => updateCard(dispatch, card.id, "complete")}
        >
          Complete Card
        </div>
        <div
          className="btn btn-secondary margin"
          onClick={() => updateCard(dispatch, card.id, "upgrade")}
        >
          Upgrade Card
        </div>
        <div
          className="btn btn-secondary margin"
          onClick={() => updateCard(dispatch, card.id, "obtain")}
        >
          Obtain Random Card
        </div>
        <div className="margin">...</div>
      </div>
      {/* <div>{card.level || 1}</div>
      <div>{card.completed || 1}</div>
      <div>{card.quantity || 0}</div>
      <div>{card.is_new || false}</div> */}

      <div className={styles.fixed}>
        <div
          className={cx(
            selectedLevel == proxyCard.completed ? "btn btn-action" : "btn"
          )}
        >
          <ion-icon name="play"></ion-icon> Play Level {selectedLevel}
        </div>
      </div>
    </div>
  );
};

const Card = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_CARD_ID, {
    variables: { id: router.query.id },
  });
  const joinCard = (card, collection_json) => {
    let collectionCard = collection_json[card.id];
    if (collectionCard) {
      return _.merge(card, collectionCard);
    }
    console.log("collection", collection_json);
    console.log("card - updated", card);
    return card;
  };

  console.log(store.user);

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {data && store.user && (
        <CardPage
          card={joinCard(data.card, store.user.collection_json || {})}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default Card;
