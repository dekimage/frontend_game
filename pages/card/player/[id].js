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
import { Context } from "../../../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import _ from "lodash";
import styles from "../../../styles/CardOld.module.scss";
import ProgressBar from "../../../components/ProgressBar";
import cx from "classnames";
import { updateCard } from "../../../actions/action";

import Timer from "../../../components/Timer";
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

const Card = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_CARD_ID, {
    variables: { id: router.query.id },
  });

  useEffect(() => {
    if (!loading && data) {
      setSlide(data.card.slides[0]);
      setSlides(data.card.slides);
    }
  }, [data, loading]);
  const [slides, setSlides] = useState(false);
  const [slide, setSlide] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // const expiryTimestamp = slide && slide.timer ? slide.timer : 60;
  const time = new Date();
  time.setSeconds(time.getSeconds() + slide.timer); // 10 minutes timer
  const childRef = useRef();

  console.log(store.user);

  return (
    <div className="">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {data && store.user && (
        <div className={styles.container}>
          <div className={styles.section}></div>

          {/* HEADER SECTION */}
          <div className={`${styles.section} ${styles.sectionAround}`}>
            {slide.step !== 1 && (
              <span
                className={styles.icon}
                onClick={() => setSlide(data.card.slides[slide.step - 1 - 1])}
              >
                <ion-icon name="chevron-back-outline"></ion-icon>
              </span>
            )}

            <div>
              {slide.step}/{slides.length}
            </div>
            <div>rewards box</div>
            <span
              className={styles.icon}
              onClick={() => setIsPlayerOpen(false)}
            >
              <ion-icon name="close-outline"></ion-icon>
            </span>
          </div>

          {/* HEADER SECTION */}
          <div className={`${styles.section} ${styles.sectionAround}`}>
            <div className={styles.title}>{slide.title}</div>
            <div className={styles.type}>
              <div className={styles.typeFont}>{slide.type}</div>
              {slide.type == "idea" && (
                <ion-icon name="bulb-outline"></ion-icon>
              )}
              {slide.type == "example" && (
                <ion-icon name="dice-outline"></ion-icon>
              )}
              {slide.type == "action" && (
                <ion-icon name="rocket-outline"></ion-icon>
              )}
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className={styles.section}>
            <div className={styles.content}>
              {slide.image && (
                <div className={styles.image}>
                  <img
                    height="150px"
                    src={`http://localhost:1337${slide.image.url}`}
                  />
                </div>
              )}
              <p>{slide.content}</p>
            </div>
          </div>

          {/* CTA SECTION */}
          <div className={styles.section}>
            {/* TIMER SECTION */}
            {slide.timer && <Timer expiryTimestamp={time} ref={childRef} />}
            <button onClick={() => childRef.current.getStart()}>Click</button>

            {/* BUTTON --> NEXT */}
            {slide.step < data.card.slides.length && !slide.timer && (
              <div
                // className={styles_2.button_primary}
                onClick={() => setSlide(data.card.slides[slide.step - 1 + 1])}
              >
                Next
              </div>
            )}

            {/* BUTTON --> NEXT LOCKED GRAY */}

            {/* BUTTON --> PAUSE TIMER */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
