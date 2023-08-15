import React, { useContext, useState } from "react";

import classNames from "classnames";
import styles from "@/styles/Faq.module.scss";
import withSEO from "@/Hoc/withSEO";
import { useRouter } from "next/router";
import { BackButton } from "@/components/reusable/BackButton";
import { withUser } from "@/Hoc/withUser";
import { GET_FAQS } from "@/GQL/query";
import ReactMarkdown from "react-markdown";
import { ImageUI } from "@/components/reusableUI";
import iconCheckmark from "@/assets/checkmark.svg";
import { Context } from "@/context/store";
import { claimFaq } from "@/actions/action";
import Modal from "@/components/reusable/Modal";
import RewardsModal from "@/components/RewardsModal";
import useModal from "@/hooks/useModal";

function Faq({ faq, dispatch }) {
  const { question, answer, image, sortOrder, id, isClaimed } = faq;
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const faqClassNames = classNames(styles.faq, {
    [styles.open]: isOpen,
  });

  return (
    <div className={faqClassNames}>
      <div className={styles.question} onClick={handleToggle}>
        {question}
        <span className={styles.arrow}></span>
      </div>
      {isOpen && (
        <div className={styles.answer}>
          <div>
            <div>
              <img src={image.url} height="30px" />
            </div>
            <ReactMarkdown children={answer} />
          </div>
          <div>
            {isClaimed ? (
              <div className="btn btn-outline">
                Claimed
                <img src={iconCheckmark} className="ml25" height="16px" />
              </div>
            ) : (
              <div
                className="btn btn-outline"
                onClick={() => claimFaq(dispatch, id)}
              >
                Mark as read + 10
                <ImageUI
                  url="/stars.png"
                  isPublic
                  className="ml25"
                  height="16px"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const FaqPage = ({ data, user, dispatch, store }) => {
  const { closeModal } = useModal();
  const faqRewards = user.faq_rewards || [];
  const mergedFaqs = data.faqs.map((faq) => {
    const isClaimed = faqRewards.includes(faq.id);
    return { ...faq, isClaimed };
  });
  return (
    <div className="background_dark">
      <div className="section">
        <div className={styles.header}>
          <BackButton isBack />

          <div className={styles.title}>FAQ</div>
        </div>
        <div className="flex_column">
          {mergedFaqs.map((faq, index) => (
            <Faq key={index} faq={faq} dispatch={dispatch} />
          ))}
        </div>
      </div>
      <Modal
        isShowing={store.rewardsModal?.isOpen}
        closeModal={closeModal}
        showCloseButton={false}
        jsx={<RewardsModal />}
        isSmall
      />
    </div>
  );
};

export default withUser(FaqPage, GET_FAQS);
