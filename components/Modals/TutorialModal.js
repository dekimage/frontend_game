import "react-circular-progressbar/dist/styles.css";

import { useContext, useState } from "react";
import { Context } from "@/context/store";

import styles from "@/styles/Today.module.scss";
import { tutorialSlides } from "@/data/todayData";

export const TutorialModal = ({}) => {
  const [store, dispatch] = useContext(Context);
  const [active, setActive] = useState(0);
  const slide = tutorialSlides(store.user.username)[active];

  const nextSlide = () => {
    if (active + 1 === tutorialSlides().length) {
      router.push("/card/player/41");
    } else {
      setActive(active + 1);
    }
  };
  return (
    <div className={styles.tutorial}>
      <h1>{slide.title}</h1>
      <img src={slide.image} alt="" height="250px" className="mb1" />
      <div className={styles.tutorial_content}>
        {slide.content}
        <br />
        {slide.content_2 && slide.content_2}
      </div>
      <div
        className="btn btn-primary"
        // onClick={() => updateTutorial(dispatch, 0)}
      >
        Skip Tutorial
      </div>
      <div className="btn btn-primary mu1" onClick={() => nextSlide()}>
        {slide.button}
      </div>
    </div>
  );
};
