import { gql, useQuery } from "@apollo/react-hooks";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/store";
import { useRouter } from "next/router";
import _ from "lodash";
import Modal from "../../../components/Modal";
import useModal from "../../../hooks/useModal";
import { normalize } from "../../../utils/calculations";
import { GET_ACTION_ID } from "../../../GQL/query";
import { updateCard } from "../../../actions/action";
const feUrl = process.env.NEXT_PUBLIC_BASE_URL;

import {
  SliderProgress,
  SliderHeader,
  WarningModal,
} from "../../../components/playerComps";

import { SuccessModal } from "../../../components/playerCourseComps";

import { ContentTheory } from "../../../components/ContentTheory";

const ActionPlayer = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_ACTION_ID, {
    variables: { id: router.query.id },
  });

  const action = data && normalize(data).action;
  const [slides, setSlides] = useState(false);
  const [slide, setSlide] = useState(false);
  const [chatSlides, setChatSlides] = useState(false);
  const { isShowing, openModal, closeModal } = useModal();
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [steps, setSteps] = useState(0);

  const oneSlide = action && {
    index: 1,
    title: action.name,
    action: action,
  };

  console.log(oneSlide);

  useEffect(() => {
    if (store.user && action) {
      const actionTickets = store.user.action_tickets || [];
      if (!actionTickets.find((a) => a.id == action.id)) {
        router.push("/learn");
      }
    }
    dispatch({ type: "STOP_LOADING" });
    if (!loading && action) {
      setSlide(oneSlide);
      setSlides([oneSlide]);
      setChatSlides([oneSlide]);
    }
  }, [action, loading]);

  const closePlayer = () => {
    router.back();
  };

  const increaseSteps = () => {
    setSteps(steps + 1);
  };

  const goNext = () => {
    updateCard(dispatch, action.id, "complete_action");
    closePlayer();
  };

  return (
    <div className="background_dark">
      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {action && slide && (
        <div className="section">
          <SliderProgress
            maxSlides={action.steps.length}
            currentSlide={steps - 1}
            setIsWarningModalOpen={setIsWarningModalOpen}
            openModal={openModal}
          />

          <SliderHeader title={slide.title} closePlayer={closePlayer} />

          {chatSlides.map((slide, i) => {
            return (
              <ContentTheory
                slide={slide}
                goNext={goNext}
                lastSlideIndex={chatSlides.length}
                key={i}
                i={i}
                increaseSteps={increaseSteps}
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
        </div>
      )}
    </div>
  );
};

export default ActionPlayer;
