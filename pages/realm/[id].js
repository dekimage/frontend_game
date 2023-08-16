import { BackButton } from "@/components/reusable/BackButton";
import Card from "@/components/Card";
import { GET_REALM_ID } from "@/GQL/query";
import NavBar from "@/components/NavBar";
import _ from "lodash";
import { joinCards } from "@/utils/joins";
import styles from "@/styles/Realm.module.scss";
import { withUser } from "@/Hoc/withUser";
import { ImageUI } from "@/components/reusableUI";

const Cards = (props) => {
  const { store, data } = props;

  const usercards = store.usercards;

  return (
    <div className="background_dark">
      <div>
        <div className="section">
          <div className={styles.header}>
            <BackButton routeDynamic={""} routeStatic={"/learn"} />

            <div className={styles.realmLogo}>
              <ImageUI url={data.realm.image.url} height="24px" />
              <div className="ml1">{data.realm.name}</div>
            </div>
          </div>
        </div>

        <div className="section-small">
          <div className={styles.grid}>
            {usercards &&
              joinCards(data.realm.cards, usercards)
                .sort((a, b) => b.is_open - a.is_open)
                .map((card, i) => <Card card={card} key={i} />)}
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default withUser(Cards, GET_REALM_ID, true);
