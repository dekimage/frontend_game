import {
  CatContent,
  CatReply,
  ChatCta,
  ChatResponses,
  SuccessModal,
} from "./playerCourseComps";
import { useContext, useEffect, useRef, useState } from "react";

import { ChatAction } from "./cardPageComps";
import _ from "lodash";
import styles from "../styles/Player.module.scss";

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
      const actionStepsNew = [];
      const actionSteps = action.steps.map((step, i) => {
        const index = i + 1 === action.steps.length ? i : i + 1;

        let seckanContent = step.content.split("\n\n").map((step) => {
          return {
            content: step,
            type: "idea",
            title: slide.title,
            step: index + 1,
            ideasLength: index + 1,
          };
        });

        const lastStep = seckanContent[seckanContent.length - 1];

        seckanContent[seckanContent.length - 1] = {
          ...lastStep,
          type: "step",
          action: action,
          nextStepTimer: action.steps[index].timer,
        };

        return seckanContent;

        return {
          ...step,
          type: "step",
          step: i + 1,
          action: action,
          nextStepTimer: action.steps[index].timer,
          title: slide.title,
        };
      });
      console.log({ a: actionSteps.flat() });
      chat.push({ ...action, type: "action", title: slide.title });
      chat = chat.concat([...actionSteps.flat()]);
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
        console.log({ message });
        return (
          <div className={styles.chatWrapper} key={i}>
            {message.type === "idea" && (
              <CatContent message={message} key={i} />
            )}
            {message.type === "step" && (
              <CatContent message={message} key={i} />
            )}
            {message.type === "action" && (
              <ChatAction action={message} startAction={openNextIdea} />
            )}

            {message.type === "reply" && <CatReply message={message} key={i} />}

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
