import React, { useContext, useState } from "react";
import styles from "@/styles/OnboardingSlider.module.scss";
import { Context } from "@/context/store";
import { GET_REALMS } from "@/GQL/query";
import { Realm } from "@/components/Realm";
import { withUser } from "@/Hoc/withUser";
import { submitTutorial, updateUserBasicInfo } from "@/actions/action";

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
  const [username, setUsername] = useState("");
  const [store, dispatch] = useContext(Context);

  const REALM_SLIDE_INDEX = 4;

  const slides = [
    {
      title: `Welcome Friend!!`,
      imageUrl:
        "https://backendactionise.s3.eu-west-1.amazonaws.com/just_do_it_554ead2616.png?updated_at=2022-06-03T12:39:22.558Z",
      content: "Let's explore Actionise together!",
      button: "Start",
    },
    {
      title: `Why Actionise?`,
      imageUrl:
        "https://backendactionise.s3.eu-west-1.amazonaws.com/tutorial_change_78980f7d25.png?updated_at=2022-06-10T14:42:05.164Z",
      content:
        "Our mission is to provide you with Ideas, Tools & Actions that will help you become the best version of yourself. ",
      button: "Next",
    },
    {
      title: `What's Inside?`,
      imageUrl:
        "https://backendactionise.s3.eu-west-1.amazonaws.com/tutorial_value_0b41c88c71.png?updated_at=2022-06-10T14:42:05.512Z",
      content: "Actionise contains:",
      content_2:
        "• 150 mini interactive lessons • 100 questions • 200 actions & tasks • 100 books worth of wisdom",
      button: "Next",
    },
    {
      title: "How should we call you?",
      description: "This will be your avatar's name",
      imageUrl: "",
      component: (
        <>
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="Jonny"
            id="enter user"
            type="text"
            className="input"
          />
        </>
      ),
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
      description: "You can skip this if you don't have a code",
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
    {
      title: `Let's Start`,
      imageUrl:
        "https://backendactionise.s3.eu-west-1.amazonaws.com/digital_declutter_fc71581fd2.png?updated_at=2022-06-04T10:10:04.811Z",
      content:
        "Before you start your journey, remember to have fun and enjoy the learning process!",
      button: "Let's Begin!",
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
  const content = slides[slideIndex].content;
  const content_2 = slides[slideIndex].content_2;

  return (
    <div className="section">
      <div className={styles["onboarding-slider"]}>
        <div className={styles["slider-content"]}>
          <div className={styles.slide}>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Onboarding Slide"
                height="200px"
                width="200px"
              />
            )}
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
            {component && <>{component}</>}
            {content && <p className={styles.content}>{content}</p>}
            {content_2 && <p className={styles.content}>{content_2}</p>}
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
                onClick={async () => {
                  await updateUserBasicInfo(dispatch, username, "username");
                  await submitTutorial(dispatch, favoriteRealms, buddyCode);
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
                  (slideIndex == REALM_SLIDE_INDEX &&
                    favoriteRealms.length !== 3) ||
                  (slideIndex === 3 && !username)
                }
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlider;
