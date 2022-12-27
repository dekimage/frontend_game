import { useQuery } from "@apollo/react-hooks";
import { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../../../context/store";
import { useRouter } from "next/router";
import _ from "lodash";
import Modal from "../../../components/Modal";
import useModal from "../../../hooks/useModal";
import { normalize } from "../../../utils/calculations";
import { GET_COURSE_ID } from "../../../GQL/query";
import { ChatAction } from "../../../components/cardPageComps";
const feUrl = process.env.NEXT_PUBLIC_BASE_URL;
import styles from "../../../styles/Player.module.scss";
import {
  SliderProgress,
  SliderHeader,
  WarningModal,
} from "../../../components/playerComps";

import {
  CatReply,
  CatContent,
  ChatCta,
  SuccessModal,
  ChatResponses,
} from "../../../components/playerCourseComps";

export const ContentTheory = ({
  slide,
  goNext,
  lastSlideIndex,
  i,
  increaseSteps = false, // for actions player only to move progressbar
}) => {
  const createChat = (slide) => {
    const action = slide.action;
    const responses = slide.responses;

    const hasStoryline = !!slide.storyline;

    const ideasLength = hasStoryline && slide.storyline.split("\n\n").length;
    const ideas =
      hasStoryline &&
      slide.storyline.split("\n\n").map((string) => {
        return {
          content: string,
          type: "idea",
          title: slide.title,
          ideasLength,
        };
      });

    let chat = hasStoryline ? ideas : [];

    if (responses) {
      chat = chat.concat({
        responses: responses.responses,
        type: "responses",
        index: slide.index,
      });
    }

    if (action) {
      const actionSteps = action.steps.map((step, i) => {
        const index = i + 1 === action.steps.length ? i : i + 1;

        return {
          ...step,
          type: "step",
          step: i + 1,
          action: action,
          nextStepTimer: action.steps[index].timer,
          title: slide.title,
        };
      });
      chat.push({ ...action, type: "action", title: slide.title });
      chat = chat.concat([...actionSteps]);
    }

    return chat;
  };

  const [ideas, setIdeas] = useState(createChat(slide));
  const [activeChat, setActiveChat] = useState([ideas[0]]);
  const [isLastIdea, setIsLastIdea] = useState(false);
  const [contentIndex, setContentIndex] = useState(1);

  const lastMessage = activeChat[activeChat.length - 1];

  useEffect(() => {
    if (activeChat !== slide) {
      const ideas = createChat(slide);
      setActiveChat([ideas[0]]);
      const isFirstSlideFinal = activeChat.length === ideas.length;
      setIsLastIdea(isFirstSlideFinal);
    }
  }, [slide]);

  const openNextIdea = () => {
    const ideaCount = slide.action == null ? ideas.length : ideas.length + 1;

    if (contentIndex + 1 === ideaCount) {
      setIsLastIdea(true);
    }

    setActiveChat([...activeChat, ideas[contentIndex]]);
    setContentIndex(contentIndex + 1);

    // removed after fixing multiple elements mapping
    setCurrentIdea(currentIdea + 1);

    increaseSteps && increaseSteps();
  };

  // make it scroll
  const bottom = useRef(null);
  const scrollToBottom = () => {
    bottom.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  // fix bug of multiple cta's
  const showCtaStep = i + 1 === lastSlideIndex;
  // removed after fixing multiple elements mapping
  const [currentIdea, setCurrentIdea] = useState(1);
  const [showResponses, setShowResponses] = useState(true);

  const selectReply = (reply) => {
    const link = reply.link;
    const index = activeChat.length;
    const newState = [...activeChat, { ...reply, type: "reply" }];
    setActiveChat(newState);

    if (!link) {
      setContentIndex(contentIndex + 1);
      setTimeout(() => {
        setActiveChat([...newState, ideas[index]]);
      }, 2000);
    }

    if (link == "examples" || link == "tips") {
      setTimeout(() => {
        const examples = ideas[index][link].split("\n\n").map((string) => {
          return {
            content: string,
            type: "idea",
            ideasLength: 0,
            title: "",
          };
        });

        setActiveChat([...newState, ...examples]);
      }, 2000);
    }
    if (Number.isInteger(link)) {
      setContentIndex(contentIndex + 1);
      setTimeout(() => {
        goNext(_, reply);
      }, 2000);
    }
    if (reply.isGhost) {
      setContentIndex(contentIndex + 1);
      setTimeout(() => {
        goNext(_, reply);
      }, 2000);
    }
    setShowResponses(false);
  };

  return (
    <div className={styles.contentTheory}>
      {activeChat.map((message, i) => {
        return (
          <div className={styles.chatWrapper} key={i}>
            {message.type === "idea" && (
              <CatContent message={message} key={i} />
            )}
            {message.type === "step" && (
              <CatContent message={message} key={i} />
            )}
            {message.type === "reply" && <CatReply message={message} key={i} />}
            {message.type === "action" && (
              <ChatAction action={message} startAction={openNextIdea} />
            )}
            {message.type === "responses" && showResponses && (
              <ChatResponses message={message} selectReply={selectReply} />
            )}
          </div>
        );
      })}

      <div style={{ marginTop: "4rem" }} ref={bottom}></div>

      {showCtaStep && (
        <ChatCta
          isLastIdea={isLastIdea}
          goNext={goNext}
          openNextIdea={openNextIdea}
          lastMessage={lastMessage}
          currentIdea={currentIdea}
        />
      )}
    </div>
  );
};

const Player = () => {
  const router = useRouter();
  const [store, dispatch] = useContext(Context);
  const { data, loading, error } = useQuery(GET_COURSE_ID, {
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
    const usercourse =
      store?.user?.usercourses &&
      store.user.usercourses.filter(
        (c) => parseInt(c.course.id) == parseInt(router.query.id)
      )[0];

    const last_completed_content =
      usercourse && usercourse.last_completed_content;
    const last_completed_day = usercourse && usercourse.last_completed_day;

    if (!loading && gql_data) {
      setSlide(
        gql_data.course.days[last_completed_day - 1].contents[
          last_completed_content - 1
        ]
      );
      setSlides(
        gql_data.course.days[last_completed_day - 1].contents.filter(
          (slide) => !slide.is_ghost
        )
      );
      // FIX GHOSTS??
      const ghosts = gql_data.course.days[
        last_completed_day - 1
      ].contents.filter((slide) => slide.is_ghost);
      setGhosts(ghosts);

      setChatSlides([
        gql_data.course.days[last_completed_day - 1].contents[
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
    router.push(`${feUrl}/course/${router.query.id}`);
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
