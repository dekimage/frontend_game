// import { Rating } from "./Rating";

import React, { useRef, useState } from "react";

import { ImageUI } from "@/components/reusableUI";
import Link from "next/link";
import iconLogo from "@/assets/menu-logo-dark.svg";
import styles from "@/styles/LandingPage.module.scss";
import { useRouter } from "next/router";

import baseUrl from "@/utils/settings";
import SEO from "./SEO";
import { SEO_CONFIG } from "@/data/configSEO";

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
    description: "We first collect knowledge from 150+ books and videos...",
  },
  {
    title: "2. Process",
    description:
      "We break down this knowledge into bite-sized pieces, making it digestible and easy to understand...",
  },
  {
    title: "3. Refine",
    description: "We filter the 20% essential gems and remove all FAT...",
  },
  {
    title: "4. Create",
    description:
      "We pack all this goodness into our app, making your personal development journey fun and user-friendly!    ",
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
    name: "Ana S.",
    level: 18,
    comment:
      "“I'm a visual learner, and this app simply hits the mark. The images help me remember the concepts and make my learning journey so much more enjoyable. Love it!“",
    at: "6:24 PM - October 03, 2023",
    stars: 5,
  },
  {
    profileImg: "img",
    name: "Neno B.",
    level: 22,
    comment:
      "“I like the gamification aspect of it. It really motivates me to play & learn a bit every day.”",
    at: "8:35 PM - September 19, 2023",
    stars: 4,
  },
  {
    profileImg: "img",
    name: "Robert T.",
    level: 33,
    comment:
      "“I was looking for a way to apply the theory to real life, and this app does exactly that. The practical actions bring the concepts home. Fantastic job!”",
    at: "4:34 PM - September 04, 2023",
    stars: 5,
  },
  {
    profileImg: "img",
    name: "Senad R.",
    level: 16,
    comment:
      "“The user-friendly design is easy to navigate, and the content is spot on! This app provides practical self-development lessons in a digestible format. Can't recommend it enough!”",
    at: "9:35 AM - August 08, 2023",
    stars: 5,
  },
];

const Header = ({ navigateSignup }) => {
  return (
    <div className={styles.header}>
      <div className="flex_center">
        <img src={iconLogo} height="28px" className="mr5" />
        <div className={styles.logoText}>Actionise</div>
      </div>
      <div className="flex_center">
        <Link href="/login">
          <div className={styles.secondaryBtn}>Sign In</div>
        </Link>

        <div onClick={navigateSignup} className={`${styles.primaryBtn} ml5`}>
          Create Free Account
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ navigateSignup }) => {
  return (
    <div className="landing-section " style={{ textAlign: "center" }}>
      <div className={`${styles.heroHeader} mt1`}>
        Become The Best Version Of You
      </div>
      <div className={`${styles.heroDescription} mt1 mb1`}>
        Learn from the best books and resourses all in one place. Gamified and
        Action-based.
      </div>

      <div onClick={navigateSignup} className={styles.primaryBtn}>
        Create Free Account
      </div>
    </div>
  );
};

const FunnelSection = () => {
  return (
    <div className="landing-section" style={{ flexDirection: "row" }}>
      <div className={styles.funnelDescriptionList}>
        {descriptions.map((d, i) => {
          return (
            <div className={styles.dContainer} key={i}>
              <ImageUI
                isPublic
                url={`/p${i + 1}.png`}
                height={150}
                width={150}
              />
            </div>
          );
        })}
      </div>
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
    <div className="landing-section">
      <div className={styles.title}>Actionise Values</div>
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

const images = [
  {
    url: "https://backendactionise.s3.eu-west-1.amazonaws.com/today_screenshot_459189a002.png?updated_at=2023-03-22T12:56:10.375Z",
    title: "Objectives",
    description:
      "Learn a tiny bit every day to complete objectives and earn rewards",
  },
  {
    url: "https://backendactionise.s3.eu-west-1.amazonaws.com/learn_screenshot_531b26c31d.png?updated_at=2023-03-22T15:17:32.754Z",
    title: "Categories",
    description: "We offer multiple areas of self-development to explore",
  },
  {
    url: "https://backendactionise.s3.eu-west-1.amazonaws.com/realms_screenshot_84eb532dbe.png?updated_at=2023-03-22T15:18:19.705Z",
    title: "Concept Cards",
    description: "Explore 100+ concepts visualized as collectable cards.",
  },
  {
    url: "https://backendactionise.s3.eu-west-1.amazonaws.com/cardscreenshot_e229e1641b.png?updated_at=2023-03-22T15:18:07.319Z",
    title: "Card Details",
    description: "Each concept card has detailed program and actions to take.",
  },
  {
    url: "https://backendactionise.s3.eu-west-1.amazonaws.com/profile_screenshot_9a10fefb95.png?updated_at=2023-03-22T15:17:47.165Z",
    title: "Profile",
    description: "Track your progress and collect rewards as you learn.",
  },
];

const imagesJsx = images.map((img, i) => {
  return (
    <div className={styles.screenshot} key={i}>
      <div className={styles.screenshot_header}>
        <div className={styles.title}>{img.title}</div>
        <div className={styles.subTitle}>{img.description}</div>
      </div>

      <img style={{ marginTop: "1.5rem" }} src={img.url} height="500px" />
    </div>
  );
});

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
      <div className={styles.title}>See What Others Say About Actionise</div>
      <div className={styles.reviewsList}>
        <SwipeableContainer children={reviewsJsx} />
      </div>
    </div>
  );
};

const ScreensSection = () => {
  return (
    <div className="landing-section">
      <div className={styles.title}>Peak Inside The App</div>
      <div className={styles.reviewsList}>
        <SwipeableContainer children={imagesJsx} />
      </div>
    </div>
  );
};

const icons = [1, 2, 3];

const Footer = () => {
  return (
    <div className={styles.header} style={{ flexDirection: "column" }}>
      <div className="flex_between mt1">
        <div className={styles.footerLink}>@ 2023 Actionise Inc.</div>
        <Link href="/terms-of-service">
          <div className={styles.footerLink}>Terms & Conditions</div>
        </Link>
        <Link href="/privacy-policy">
          <div className={styles.footerLink}>Privacy Policy</div>
        </Link>
      </div>
      <div className="flex_between">
        {icons.map((icon, i) => {
          return (
            <div className={styles.icon} key={i}>
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FixedCta = ({ navigateSignup }) => {
  return (
    <div className={styles.fixedCta}>
      {/* <Link href="/login"> */}
      <div
        className={styles.primaryBtn}
        style={{ width: "100%", maxWidth: "40rem" }}
        onClick={navigateSignup}
      >
        Start Your Journey
      </div>
      {/* </Link> */}
    </div>
  );
};

const LandingPage = () => {
  const router = useRouter();
  function navigateSignup() {
    router.push({
      pathname: "/login",
      query: { isLoginPage: false },
    });
  }
  return (
    <div className="background_dark">
      <SEO
        title={SEO_CONFIG.landingPage.title}
        description={SEO_CONFIG.landingPage.description}
        keywords={SEO_CONFIG.landingPage.keywords}
      />
      <Header navigateSignup={navigateSignup} />
      <HeroSection navigateSignup={navigateSignup} />
      <FunnelSection />
      <div className={styles.divider}></div>
      <ValuesSection />
      <ReviewSection />
      <ScreensSection />
      <Footer />
      <FixedCta navigateSignup={navigateSignup} />
    </div>
  );
};

export default LandingPage;
