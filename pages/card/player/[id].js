import {
  SliderHeader,
  SliderProgress,
  WarningModal,
} from "../../../components/playerComps";
import { gql, useQuery } from "@apollo/react-hooks";
import { useContext, useEffect, useRef, useState } from "react";

import { ContentTheory } from "../../../components/ContentTheory";
import { Context } from "../../../context/store";
import { GET_CARD_ID } from "../../../GQL/query";
import Modal from "../../../components/Modal";
import { SuccessModal } from "../../../components/playerCourseComps";
import _ from "lodash";
import { normalize } from "../../../utils/calculations";
import { updateCard } from "../../../actions/action";
import useModal from "../../../hooks/useModal";
import { useRouter } from "next/router";

const Player = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_CARD_ID, {
    variables: { id: router.query.id },
  });

  const gql_data = data && normalize(data);
  const [slides, setSlides] = useState(false);
  const [slide, setSlide] = useState(false);
  const [chatSlides, setChatSlides] = useState(false);
  const { isShowing, openModal, closeModal } = useModal();

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [rewards, setRewards] = useState({
    xp: 0,
    stars: 0,
    gems: 0,
  });

  useEffect(() => {
    if (store.user && gql_data) {
      const cardTickets = store.user.card_tickets || [];
      if (!cardTickets.find((c) => c.id == gql_data.card.id)) {
        router.push("/learn");
      }
    }
    dispatch({ type: "STOP_LOADING" });
    // const usercard =
    //   store?.user?.usercards &&
    //   store.user.usercards.filter(
    //     (uc) => parseInt(uc.card.id) == parseInt(router.query.id)
    //   )[0];

    // const last_completed_content = 1;
    // const last_completed_day = (usercard && usercard.completed) || 0;

    if (gql_data) {
      const { card } = gql_data;
      const sessionIndex = card.last_day || 0;
      const slidesArray = card.days[sessionIndex]?.contents;

      const contentIndex = router.query.contentIndex
        ? parseInt(router.query.contentIndex) - 1
        : 0;

      setSlide(slidesArray[contentIndex]);
      setSlides(slidesArray);
      setChatSlides([slidesArray[contentIndex]]);
    }
  }, [gql_data, store.user]);

  // const isLatestLevel = false;

  // const updateRewards = (xp = 10, stars = 5) => {
  //   setRewards({
  //     ...rewards,
  //     ["xp"]: rewards.xp + xp,
  //     ["stars"]: rewards.stars + stars,
  //   });
  // };

  const closePlayer = () => {
    router.back();
  };

  // const onContinue = () => {
  //   const index = slides.findIndex((s) => s.id === slide.id);
  //   if (index === slides.length - 1) {
  //     if (isLatestLevel) {
  //       setSuccessModal("complete_screen");
  //     } else {
  //       setSlide(slides[index + 1]);
  //     }
  //   }
  // };

  const goBack = () => {
    const index = slide.index;
    if (index === 1) {
      closePlayer();
    } else {
      setSlide(slides[index - 2]);
    }
  };

  const goNext = () => {
    const cardId = router.query.id;
    console.log(router.query);
    const index = slide.index;
    updateCard(dispatch, cardId, "complete_contents", index);
    if (index === slides.length) {
      setIsSuccessModalOpen(true);
    } else {
      setSlide(slides[index]);
      setChatSlides([...chatSlides, slides[index]]);
    }
  };

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {gql_data && store.user && slide && (
        <>
          <SliderProgress
            maxSlides={slides.length}
            currentSlide={slides && slides.findIndex((s) => s.id === slide.id)}
            setIsWarningModalOpen={setIsWarningModalOpen}
            openModal={openModal}
            goBack={goBack}
          />

          <SliderHeader
            title={slide.title}
            rewards={rewards}
            closePlayer={closePlayer}
          />
          <div className="section" style={{ paddingTop: "4rem" }}>
            {chatSlides.map((slide, i) => {
              return (
                <ContentTheory
                  slide={slide}
                  goNext={goNext}
                  lastSlideIndex={chatSlides.length}
                  key={i}
                  i={i}
                />
              );
            })}

            {isWarningModalOpen && (
              <Modal
                isShowing={isShowing}
                closeModal={closeModal}
                isSmall={true}
                jsx={
                  <WarningModal
                    setIsWarningModalOpen={setIsWarningModalOpen}
                    closePlayer={closePlayer}
                  />
                }
              />
            )}

            {isSuccessModalOpen && (
              <Modal
                isShowing={isSuccessModalOpen}
                closeModal={closeModal}
                jsx={
                  <SuccessModal
                    closePlayer={closePlayer}
                    card={data.card}
                    // isLatestLevel={isLatestLevel}
                  />
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Player;
