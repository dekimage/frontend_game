import { RatingModal, SuccessModal } from "@/components/playerCourseComps";
import {
  SliderHeader,
  SliderProgress,
  WarningModal,
} from "@/components/playerComps";
import { useEffect, useState } from "react";

import { ContentTheory } from "@/components/ContentTheory";
import { GET_PLAYER_CARD } from "@/GQL/query";
import Modal from "@/components/reusable/Modal";
import _ from "lodash";
import { getTotalStepsInSlides } from "@/utils/calculations";
import { updateCard } from "@/actions/action";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/router";
import { withUser } from "@/Hoc/withUser";

const Player = (props) => {
  const router = useRouter();
  const { user, store, data, dispatch } = props;

  const [slides, setSlides] = useState(false);
  const [slide, setSlide] = useState(false);
  const [chatSlides, setChatSlides] = useState(false);
  const { isShowing, openModal, closeModal } = useModal();

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const [rewards, setRewards] = useState({
    xp: 0,
    stars: 0,
    gems: 0,
  });

  useEffect(() => {
    if (user && data) {
      const cardTickets = user.card_tickets || [];

      // if (!cardTickets?.find((c) => c?.id == data?.card?.id)) {
      //   router.push("/learn");
      // }
    }
    dispatch({ type: "STOP_LOADING" });

    // const last_completed_content = 1;
    // const last_completed_day = (usercard && usercard.completed) || 0;

    if (data) {
      const { card } = data;
      const sessionIndex = card.last_day || 0;
      const slidesArray = card.days[sessionIndex]?.contents;

      const contentIndex = router.query.contentIndex
        ? parseInt(router.query.contentIndex) - 1
        : 0;

      setSlide(slidesArray[contentIndex]);
      setSlides(slidesArray);
      setChatSlides([slidesArray[contentIndex]]);
    }
  }, [data, user, store.usercards]);

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
    const index = slide.index;

    if (index === slides.length) {
      setIsRatingModalOpen(true);
      setIsSuccessModalOpen(true);
    } else {
      setSlide(slides[index]);
      setChatSlides([...chatSlides, slides[index]]);
    }
  };

  const usercard = store.usercards?.filter(
    (uc) => parseInt(uc.card?.id) == parseInt(router.query.id)
  )[0];

  const isLastSlide =
    slides && slides.findIndex((s) => s.id === slide.id) === slides.length - 1;

  const totalTasksCount = slides && getTotalStepsInSlides(slides);
  console.log(store.usercards);
  console.log(usercard, slide);

  return (
    <div className="background_dark">
      {usercard && slide && (
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
          <div className="section" style={{ paddingTop: "6rem" }}>
            {chatSlides.map((slide, i) => {
              return (
                <ContentTheory
                  card={data.card}
                  slide={slide}
                  goNext={goNext}
                  lastSlideIndex={chatSlides.length}
                  isLastSlide={isLastSlide}
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

            <Modal
              isShowing={isSuccessModalOpen}
              closeModal={closeModal}
              showCloseButton={false}
              jsx={
                <SuccessModal
                  closePlayer={closePlayer}
                  card={data.card}
                  usercard={usercard}
                  totalTasksCount={totalTasksCount}
                />
              }
            />
            {!usercard.isRated && isRatingModalOpen && (
              <Modal
                isShowing={isRatingModalOpen}
                closeModal={() => {}}
                showCloseButton={false}
                jsx={
                  <RatingModal
                    closePlayer={() => setIsRatingModalOpen(false)}
                    cardId={router.query.id}
                    usercard={usercard}
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

export default withUser(Player, GET_PLAYER_CARD, true);
