// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useRouter } from "next/router";

// *** COMPONENTS ***
import NavBar from "../components/NavBar";
import { CommunityAction } from "../components/cardPageComps";
import {
  Activity,
  Stat,
  Buddy,
  ProfileHeader,
  Tabs,
} from "../components/profileComps";

// *** ACTIONS ***
import { calcTotal } from "../utils/calculations";

// *** STYLES ***
import styles from "../styles/Profile.module.scss";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Profile = () => {
  const [store, dispatch] = useContext(Context);
  const router = useRouter();
  const [tab, setTab] = useState("activity");

  const completionProgress =
    store?.user?.usercards &&
    calcTotal(store.user.usercards, "completed", true);
  const collectionProgress =
    store?.user?.usercards &&
    calcTotal(store.user.usercards, "collected", true);

  const tabsData = [
    { label: "activity", count: -1 },
    { label: "buddies", count: -1 },
    { label: "content", count: -1 },
  ];

  return (
    <div className="background_dark">
      {store?.user && (
        <div className="section-container">
          <ProfileHeader />

          <div className={styles.stats}>
            <Stat
              number={collectionProgress}
              img={`${baseUrl}/legendary-cards.png`}
              text={"Collection"}
              isPercent
            />
            <Stat
              number={completionProgress}
              img={`${baseUrl}/rise.png`}
              text={"Progress"}
              isPercent
            />
            <Stat
              number={store.user.highest_streak_count}
              img={`${baseUrl}/streak.png`}
              text={"Highest Streak"}
            />
            <Stat
              number={store.user?.actions?.length}
              img={`${baseUrl}/energy.png`}
              text={"Actions Done"}
            />
          </div>

          <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />

          {/* "https://backendactionise.s3.eu-west-1.amazonaws.com/2022_07_08_10_58_31_Actionise_28d16b97b5.png?updated_at=2022-07-08T08:58:51.431Z" */}
          {tab === "activity" && (
            <div className="section">
              <Activity
                img={`${baseUrl}/streak.png`}
                link={"/streak"}
                text={"Streak Rewards"}
                notification={store.notifications.streaks}
              />

              <Activity
                img={`${baseUrl}/gift.png`}
                link={"/buddies-rewards"}
                text={"Buddy Rewards"}
                notification={store.notifications.friends}
              />

              <Activity
                img={`${baseUrl}/trophy.png`}
                link={"/level-rewards"}
                text={"Level Rewards"}
                notification={store.notifications.levels}
              />
            </div>
          )}

          {tab === "buddies" && (
            <div className="section">
              <div className={styles.header}>
                <div>Shared Buddies</div>{" "}
                {store.user.shared_buddies?.length || 0}
                /10
              </div>
              {store.user.shared_buddies?.map((b) => (
                <Buddy
                  name={b.username}
                  link={`/users/${b.id}`}
                  // img={b.profile.url}
                  level={b.level}
                  key={b.id}
                />
              ))}
              <div className={styles.header}>
                <div>Following</div> {store.user.followers?.length || 0}/50
              </div>
              {store.user.followers?.map((b) => (
                <Buddy
                  name={b.username}
                  link={`/users/${b.id}`}
                  // img={b.profile.url}
                  level={b.level}
                  key={b.id}
                />
              ))}
              <div className="btn btn-stretch btn-primary mt1 mb1">
                <img
                  src={`${baseUrl}/add-user.png`}
                  height="20px"
                  className="mr1"
                />
                Share Buddy Link
              </div>
            </div>
          )}

          {tab === "content" && (
            <div className="section">
              <div className={styles.header}>
                <div>Created Actions</div>{" "}
                {store.user.community_actions?.length || 0}
              </div>
              {store.user.community_actions?.map((a) => (
                <CommunityAction action={a} type={"my"} key={a.id} />
              ))}
            </div>
          )}
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Profile;
