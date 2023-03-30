import React, { useState } from "react";

import classNames from "classnames";
import styles from "../styles/Faq.module.scss";
import withSEO from "../Hoc/withSEO";
import { useRouter } from "next/router";

const faqsData = [
  {
    question: "What is Lorem Ipsum?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    question: "Why do we use it?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    question: "Where does it come from?",
    answer:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
  {
    question: "What is the purpose of Lorem Ipsum?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    question: "What is Lorem Ipsum used for?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    question: "Is Lorem Ipsum good for web design?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    question: "What are the benefits of using Lorem Ipsum?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    question: "What are the origins of Lorem Ipsum?",
    answer:
      "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
  },
  {
    question: "What is the meaning of Lorem Ipsum?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    question: "Where can I get some Lorem Ipsum?",
    answer:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
  },
];

function Faq({ question, answer }) {
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
      {isOpen && <div className={styles.answer}>{answer}</div>}
    </div>
  );
}

function FaqList() {
  const router = useRouter();
  return (
    <div className="section background_dark">
      <div className={styles.header}>
        <div className={styles.back} onClick={() => router.back()}>
          <ion-icon name="chevron-back-outline"></ion-icon>
        </div>

        <div className={styles.title}>FAQ</div>
      </div>
      <div className="flex_column">
        {faqsData.map((faq, index) => (
          <Faq key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

export default withSEO(FaqList);
