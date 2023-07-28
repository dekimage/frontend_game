import { ImageUI } from "@/components/reusableUI";
import { useContext, useEffect, useState } from "react";
import { BackButton } from "@/components/reusable/BackButton";

import { Context } from "@/context/store";
import Loader from "@/components/reusable/Loader";
import NavBar from "@/components/NavBar";
import _ from "lodash";
import { getRandomCard } from "@/actions/action";
import styles from "@/styles/Realm.module.scss";
import { joinCards } from "@/utils/joins";
import Card from "@/components/Card";

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
        <div
          className="flex_between flex_column pb1"
          style={{ height: "100vh" }}
        >
          <div className="section">
            <div className={styles.header}>
              <BackButton routeDynamic={""} routeStatic={"/"} />

              <div className={`${styles.realmLogo} ml1 mr1`}>Random Card</div>
              <div className="flex_center">
                <ImageUI url={"/random.png"} height="22px" isPublic />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: "8rem" }}>
            {joinCards([randomCard], store.usercards).map((card) => (
              <Card card={card} />
            ))}
          </div>

          <div
            className="btn btn-primary"
            style={{ marginBottom: "2rem" }}
            onClick={() => {
              handleGetRandomCard();
            }}
          >
            REROLL
          </div>
        </div>
      )}
    </div>
  );
};

export default Random;
