import { ImageUI } from "@/components/reusableUI";
import { useContext, useEffect, useState } from "react";
import { BackButton } from "@/components/reusable/BackButton";

import CardsMapper from "@/components/CardsMapper";
import { Context } from "@/context/store";
import Loader from "@/components/reusable/Loader";
import NavBar from "@/components/NavBar";
import _ from "lodash";
import { getRandomCard } from "@/actions/action";
import styles from "@/styles/Realm.module.scss";

const Random = () => {
  const [store, dispatch] = useContext(Context);
  const [randomCard, setRandomCard] = useState();

  const handleGetRandomCard = () => {
    getRandomCard().then((randomCard) => {
      setRandomCard(randomCard);
    });
  };

  useEffect(() => {
    handleGetRandomCard();
  }, []);

  return (
    <div className="background_dark">
      {!randomCard && <Loader />}
      {randomCard && (
        <div>
          <div className="section">
            <div className={styles.header}>
              <BackButton routeDynamic={""} routeStatic={"/"} />

              <div className={`${styles.realmLogo} ml1 mr1`}>Random Card</div>
              <div className="flex_center">
                <ImageUI url={"/random.png"} height="22px" isPublic />
              </div>
            </div>
          </div>

          <div className="section">
            <div>
              <div
                className="btn btn-primary"
                onClick={() => {
                  handleGetRandomCard();
                }}
              >
                REROLL
              </div>
              <CardsMapper cards={[randomCard]} />
            </div>
          </div>
        </div>
      )}
      <NavBar />
    </div>
  );
};

export default Random;
