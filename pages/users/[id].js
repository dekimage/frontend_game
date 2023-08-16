import { Buddy, ProfileHeader, Stat } from "@/components/profileComps";
import { useContext, useState } from "react";
import { Tabs } from "@/components/reusable/Tabs";
import { Artifact } from "@/pages/profile";
import CardsMapper from "@/components/CardsMapper";

import { Context } from "@/context/store";
import { GET_USER_ID } from "@/GQL/query";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";

import { normalize } from "@/utils/calculations";
import styles from "@/styles/Profile.module.scss";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import baseUrl from "@/utils/settings";

const tabsData = [
  { label: "activity", count: -1 },
  { label: "buddies", count: -1 },
  { label: "achievements", count: -1 },
];

const User = () => {
  const [store, dispatch] = useContext(Context);
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_USER_ID, {
    variables: { id: router.query.id },
  });
  const user = data && normalize(data).usersPermissionsUser;

  const [tab, setTab] = useState("activity");

  // const completionProgress =
  //   user?.usercards && calcTotal(user.usercards, "completed", true);
  // const collectionProgress =
  //   user?.usercards && calcTotal(user.usercards, "collected", true);

  return (
    <div className="background_dark">
      {user && (
        <>
          <Header />

          <div className="section-container">
            <div className="headerSpace"></div>
            <ProfileHeader buddy={user} isBuddy />

            <div className={styles.stats}>
              <Stat
                number={user.stats?.card_unlock || 0}
                img={`${baseUrl}/legendary-cards.png`}
                text={"Cards Unlocked"}
                max={store.user.cards_count}
              />
              <Stat
                number={user.stats?.mastery || 0}
                img={`${baseUrl}/mastery.png`}
                text={"Total Mastery"}
              />
              <Stat
                number={user.highest_streak_count || 0}
                img={`${baseUrl}/streak.png`}
                text={"Highest Streak"}
              />
              <Stat
                number={user.claimed_artifacts?.length || 0}
                img={`${baseUrl}/energy.png`}
                text={"Achievements"}
                max={store.user.artifacts_count}
              />
              {/* <Stat
                img={`${baseUrl}/user.png`}
                text={user.pro ? "Pro User" : "Free User"}
              /> */}
            </div>

            <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />

            {tab === "activity" && (
              <div className="section">
                <div className={styles.header} style={{ marginBottom: "1rem" }}>
                  <div>Last Completed Cards</div>
                </div>
                <CardsMapper cards={user.last_completed_cards} />
              </div>
            )}

            {tab === "buddies" && (
              <div className="section">
                <div className={styles.header}>
                  <div>Shared Buddies</div>
                  {store.user.shared_buddies?.length || 0}
                  /10
                </div>
                {user.shared_buddies?.map((b) => (
                  <Buddy
                    name={b.username}
                    link={`/users/${b.id}`}
                    img={b.avatar?.image.url}
                    level={b.level}
                    key={b.id}
                  />
                ))}
              </div>
            )}

            {tab === "achievements" && (
              <div className="section">
                <div className={styles.header}>
                  <div>Achievements</div>
                  <div>
                    {user.claimed_artifacts?.length || 0}/
                    {store.user.artifacts_count}
                  </div>
                </div>
                <div
                  className={styles.artifactsWrapper}
                  style={{ marginTop: "1rem" }}
                >
                  {user.claimed_artifacts?.map((artifact, i) => {
                    return (
                      <Artifact
                        key={i}
                        artifact={{
                          ...artifact,
                          isClaimed: true,
                          isCollected: true,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <NavBar />
    </div>
  );
};

export default User;
