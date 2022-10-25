import { gql, useQuery } from "@apollo/react-hooks";
import { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../../../context/store";
import { useRouter } from "next/router";
import _ from "lodash";
import Modal from "../../../components/Modal";
import useModal from "../../../hooks/useModal";
import { normalize } from "../../../utils/calculations";
import { GET_CARD_ID } from "../../../GQL/query";
const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

import {
  SliderProgress,
  SliderHeader,
  WarningModal,
} from "../../../components/playerComps";

import { SuccessModal } from "../../../components/playerCourseComps";

import { ContentTheory } from "../../course/player/[id]";

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
  const [successModal, setSuccessModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [ghosts, setGhosts] = useState([]);
  const [rewards, setRewards] = useState({
    xp: 0,
    stars: 0,
    gems: 0,
  });

  useEffect(() => {
    const usercard =
      store?.user?.usercards &&
      store.user.usercards.filter(
        (uc) => parseInt(uc.card.id) == parseInt(router.query.id)
      )[0];

    const last_completed_content = 1;
    const last_completed_day = (usercard && usercard.completed) || 0;

    if (!loading && gql_data) {
      setSlide(
        gql_data.card.days[last_completed_day].contents[
          last_completed_content - 1
        ]
      );
      setSlides(
        gql_data.card.days[last_completed_day].contents.filter(
          (slide) => !slide.is_ghost
        )
      );
      // FIX GHOSTS??
      const ghosts = gql_data.card.days[last_completed_day].contents.filter(
        (slide) => slide.is_ghost
      );
      setGhosts(ghosts);

      setChatSlides([
        gql_data.card.days[last_completed_day].contents[
          last_completed_content - 1
        ],
      ]);
    }
  }, [gql_data, loading]);

  const isLatestLevel = false;

  const updateRewards = (xp = 10, stars = 5) => {
    setRewards({
      ...rewards,
      ["xp"]: rewards.xp + xp,
      ["stars"]: rewards.stars + stars,
    });
  };

  const closePlayer = () => {
    router.back();
  };

  const onContinue = () => {
    const index = slides.findIndex((s) => s.id === slide.id);
    if (index === slides.length - 1) {
      if (isLatestLevel) {
        setSuccessModal("complete_screen");
      } else {
        setSlide(slides[index + 1]);
      }
    }
  };

  const goBack = () => {
    const index = slide.index;
    if (index === 1) {
      closePlayer();
    } else {
      setSlide(slides[index - 2]);
    }
  };

  const goNext = (_, reply = false) => {
    //reply is the link I pass manually with replies...
    const index = slide.index;
    if (index === slides.length) {
      setIsSuccessModalOpen(true);
    } else {
      if (reply.isGhost) {
        setSlide(77, ghosts[reply.link - 1]);
        setChatSlides([...chatSlides, ghosts[reply.link + 1]]);
      } else {
        setSlide(slides[reply ? reply.link - 1 : index]);
        setChatSlides([...chatSlides, slides[reply ? reply.link - 1 : index]]);
      }
    }
  };

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {gql_data && store.user && slide && (
        <div className="section">
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
            <SuccessModal
              closePlayer={closePlayer}
              card={data.card}
              isLatestLevel={isLatestLevel}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Player;
