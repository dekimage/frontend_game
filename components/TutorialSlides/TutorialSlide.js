import React, { useContext, useState } from "react";
import styles from "@/styles/OnboardingSlider.module.scss";
import { Context } from "@/context/store";
import { GET_REALMS } from "@/GQL/query";
import { Realm } from "@/components/Realm";
import { withUser } from "@/Hoc/withUser";
import { submitTutorial } from "@/actions/action";

const SlideIndicator = ({ totalSlides, currentSlideIndex }) => {
  const circles = Array.from({ length: totalSlides }, (_, index) => (
    <div
      key={index}
      className={`${styles.circle} ${
        index === currentSlideIndex ? styles.active : ""
      }`}
    ></div>
  ));

  return <div className={styles.slideIndicator}>{circles}</div>;
};

const RealmSelector = withUser(
  ({ favoriteRealms, setFavoriteRealms, data }) => {
    return (
      <div>
        {data.realms.map((realm, i) => (
          <Realm
            realm={realm}
            isTutorial
            favoriteRealms={favoriteRealms}
            setFavoriteRealms={setFavoriteRealms}
            key={i}
          />
        ))}
      </div>
    );
  },
  GET_REALMS
);

const OnboardingSlider = ({ closeModal }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [favoriteRealms, setFavoriteRealms] = useState([]);
  const [buddyCode, setBuddyCode] = useState("");
  const [store, dispatch] = useContext(Context);

  const REALM_SLIDE_INDEX = 2;

  const slides = [
    {
      title: "Welcome to Actionise",
      description: "description ...1",

      imageUrl: "image1.jpg",
    },
    {
      title: "Get Smarter!",
      description: "description ...2",
      imageUrl: "image2.jpg",
    },
    {
      title: "Select 3 Categories of Interest",
      description: "You can change this later",
      imageUrl: "",
      component: (
        <RealmSelector
          setFavoriteRealms={setFavoriteRealms}
          favoriteRealms={favoriteRealms}
        />
      ),
    },
    {
      title: "Got a Buddy Code?",
      description: "",
      imageUrl: "",
      component: (
        <>
          <input
            onChange={(e) => setBuddyCode(e.target.value)}
            value={buddyCode}
            placeholder="Enter Buddy Code"
            id="buddy-code"
            type="number"
            className="input"
          />
        </>
      ),
    },
  ];

  const prevSlide = () => {
    setSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const nextSlide = () => {
    setSlideIndex((prevIndex) => Math.min(prevIndex + 1, slides.length - 1));
  };

  const title = slides[slideIndex].title;
  const description = slides[slideIndex].description;
  const imageUrl = slides[slideIndex].imageUrl;
  const component = slides[slideIndex].component;

  return (
    <div className={styles["onboarding-slider"]}>
      <div className={styles["slider-content"]}>
        <div className={styles.slide}>
          {imageUrl && <img src={imageUrl} alt="Onboarding Slide" />}
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
          {component && <>{component}</>}
        </div>

        <div className={styles.cta}>
          {slideIndex == REALM_SLIDE_INDEX && (
            <>
              <div className="mb1">
                {favoriteRealms.length}/{3} Selected Categories
              </div>
              {favoriteRealms.length > 3 && (
                <div className="input-error">
                  Please Select Maximum 3 Categories
                </div>
              )}
            </>
          )}
          <SlideIndicator
            totalSlides={slides.length}
            currentSlideIndex={slideIndex}
          />

          <button onClick={prevSlide} disabled={slideIndex === 0}>
            Back
          </button>
          {slideIndex === slides.length - 1 ? (
            <button
              onClick={() => {
                submitTutorial(dispatch, favoriteRealms, buddyCode);
                closeModal();
              }}
            >
              Finish
            </button>
          ) : (
            <button
              onClick={nextSlide}
              disabled={
                slideIndex === slides.length - 1 ||
                (slideIndex == REALM_SLIDE_INDEX && favoriteRealms.length !== 3)
              }
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlider;
