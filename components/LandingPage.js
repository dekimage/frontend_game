// import { Rating } from "./Rating";

import React, { useRef, useState } from "react";

import iconLogo from "../assets/menu-logo-dark.svg";
import styles from "../styles/LandingPage.module.scss";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const SwipeableContainer = ({ children }) => {
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef(null);

  const handleTouchStart = (event) => {
    setStartX(event.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (event) => {
    // event.preventDefault();
    const x = event.touches[0].pageX - containerRef.current.offsetLeft;
    const distance = x - startX;
    containerRef.current.scrollLeft = scrollLeft - distance;
  };

  const handleMouseDown = (event) => {
    // event.preventDefault();
    setStartX(event.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    // event.preventDefault();
    const x = event.pageX - containerRef.current.offsetLeft;
    const distance = x - startX;
    containerRef.current.scrollLeft = scrollLeft - distance;
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={styles.swipeableContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      ref={containerRef}
    >
      <div className={styles.swipeableContent}>{children}</div>
    </div>
  );
};

const Rating = ({ stars }) => {
  return (
    <div>
      {Array.from(Array(stars).keys()).map((s) => (
        <img
          src={`${baseUrl}/star.png`}
          key={s}
          height="15px"
          className="mr25"
        />
      ))}
    </div>
  );
};

const descriptions = [
  {
    title: "1. Collect",
    description: "We first collect data from 150+ books all around...",
  },
  {
    title: "2. Process",
    description: "We first collect data from 150+ books all around...",
  },
  {
    title: "3. Refine",
    description: "We first collect data from 150+ books all around...",
  },
  {
    title: "4. Create",
    description: "We first collect data from 150+ books all around...",
  },
];

const values = [
  {
    title: "Visual Memory Enforced",
    description: '"You don\'t remember words. You remember images."',
    img1: "url",
    img2: "url",
  },
  {
    title: "Practical Action Based",
    description: '"You don\'t change by reading. You change by doing."',
    img1: "url",
    img2: "url",
  },
  {
    title: "Visual Memory Enforced",
    description: '"You don\'t remember words. You remember images. "',
    img1: "url",
    img2: "url",
  },
  {
    title: "Visual Memory Enforced",
    description: '"You don\'t remember words. You remember images. "',
    img1: "url",
    img2: "url",
  },
];

const reviews = [
  {
    profileImg: "img",
    name: "Dejan",
    level: 21,
    comment:
      "“I have learned a lot with Actionise on my daily life and improved myself”",
    at: "8:35 PM - Mar 8, 2023",
    stars: 5,
  },
  {
    profileImg: "img",
    name: "Robert",
    level: 33,
    comment:
      "“I have learned a lot with Actionise on my daily life and improved myself”",
    at: "4:34 PM - April 15, 2022",
    stars: 5,
  },
  {
    profileImg: "img",
    name: "Smiki",
    level: 14,
    comment:
      "“I have learned a lot with Actionise on my daily life and improved myself”",
    at: "8:35 PM - Mar 8, 2023",
    stars: 5,
  },
  {
    profileImg: "img",
    name: "Smiki",
    level: 14,
    comment:
      "“I have learned a lot with Actionise on my daily life and improved myself”",
    at: "8:35 PM - Mar 8, 2023",
    stars: 5,
  },
];

const Header = () => {
  return (
    <div className={styles.header}>
      <div className="flex_center">
        <img src={iconLogo} height="28px" className="mr5" />
        <div className={styles.logoText}>Actionise</div>
      </div>
      <div className="flex_center">
        <div className={styles.secondaryBtn}>Sign In</div>
        <div className={`${styles.primaryBtn} ml5`}>Create Free Account</div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <div className="landing-section " style={{ textAlign: "center" }}>
      <div className={`${styles.heroHeader} mt1`}>
        Become The Best Version Of You
      </div>
      <div className={`${styles.heroDescription} mt1 mb1`}>
        Learn from the best books and resourses all in one place. Gamified and
        Action-based.
      </div>
      <div className={styles.primaryBtn}>Create Free Account</div>
    </div>
  );
};

const FunnelSection = () => {
  return (
    <div className="landing-section" style={{ flexDirection: "row" }}>
      <div className={styles.funnelImg}>funnel img</div>
      <div className={styles.funnelDescriptionList}>
        {descriptions.map((d, i) => {
          return (
            <div className={styles.dContainer} key={i}>
              <div className={styles.dTitle}>{d.title}</div>
              <div className={styles.dDescription}>{d.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ValuesSection = () => {
  return (
    <div className="landing-section  ">
      <div className={styles.title}>Application Values</div>
      <div className={styles.valuesList}>
        {values.map((v, i) => {
          return (
            <div className={styles.valueContainer} key={i}>
              <div className={styles.valueTitle}>{v.title}</div>
              <div className={styles.valueDescription}>{v.description}</div>
              <div className={styles.valueImagesContainer}>
                <div className={styles.valueImg}>{v.img1}</div>
                <div className={styles.valueImg}>{v.img2}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const reviewsJsx = reviews.map((r, i) => {
  return (
    <div className={styles.review} key={i}>
      <div className="flex_start mb1">
        <div className={styles.reviewImg}></div>
        <div className="flex_column ml5">
          <div className={styles.reviewName}>{r.name}</div>
          <div className={styles.reviewLvl}>Lvl {r.level}</div>
        </div>
      </div>
      <div className="mb1">
        <Rating stars={r.stars} />
      </div>
      <div className={styles.reviewBody}>{r.comment}</div>
      <div className="flex_between">
        <div className={styles.reviewLvl}>{r.at}</div>
      </div>
    </div>
  );
});

const ReviewSection = () => {
  return (
    <div className="landing-section">
      <div className={styles.title}>See What Others Say About Us</div>
      <div className={styles.reviewsList}>
        <SwipeableContainer children={reviewsJsx} />
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <Header />
      <HeroSection />
      <FunnelSection />
      <ValuesSection />
      <ReviewSection />
    </div>
  );
};

export default LandingPage;
