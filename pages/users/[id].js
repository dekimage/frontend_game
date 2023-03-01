// *** REACT ***

import {
  Activity,
  Buddy,
  ProfileHeader,
  Stat,
  Tabs,
} from "../../components/profileComps";
import { useContext, useEffect, useState } from "react";

import { Artifact } from "../profile";
import CardsMapper from "../../components/CardsMapper";
import { CommunityAction } from "../../components/cardPageComps";
import { Context } from "../../context/store";
import { GET_USER_ID } from "../../GQL/query";
import Header from "../../components/Header";
import NavBar from "../../components/NavBar";
import { calcTotal } from "../../utils/calculations";
import { followBuddy } from "../../actions/action";
import { gql } from "apollo-boost";
import { normalize } from "../../utils/calculations";
import styles from "../../styles/Profile.module.scss";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

// *** COMPONENTS ***

// *** ACTIONS ***

// *** STYLES ***

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const tabsData = [
  { label: "activity", count: -1 },
  { label: "buddies", count: -1 },
  { label: "artifacts", count: -1 },
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

  const followers = store?.user?.followers;

  return (
    <div className="background_dark">
      {user && followers && (
        <>
          <Header />

          <div className="section-container">
            <div className="headerSpace"></div>
            <ProfileHeader buddy={user} isBuddy />

            {/* FOLLOW */}
            {/* <div className="flex_center mt1">
            {followers.filter((b) => b.id == user.id).length > 0 ? (
              <div
                onClick={() => followBuddy(dispatch, user.id)}
                className="btn btn-blank"
              >
                Unfollow
              </div>
            ) : (
              <div
                onClick={() => followBuddy(dispatch, user.id)}
                className="btn btn-primary"
              >
                + Follow
              </div>
            )}
          </div> */}

            <div className={styles.stats}>
              <Stat
                number={user.stats?.card_unlock || 0}
                img={`${baseUrl}/legendary-cards.png`}
                text={"Cards Unlocked"}
                max={store.user.cards_count}
              />
              <Stat
                number={user.stats?.cards_complete || 0}
                img={`${baseUrl}/rise.png`}
                text={"Sessions Completed"}
              />
              <Stat
                number={user.highest_streak_count || 0}
                img={`${baseUrl}/streak.png`}
                text={"Highest Streak"}
              />
              <Stat
                number={user.stats?.action_complete || 0}
                img={`${baseUrl}/energy.png`}
                text={"Actions Done"}
              />
              <Stat
                number={user.stats?.claimed_artifacts || 0}
                img={`${baseUrl}/energy.png`}
                text={"Achievements"}
                max={store.user.artifacts_count}
              />
              <Stat
                img={`${baseUrl}/user.png`}
                text={user.is_subscribed ? "Pro User" : "Free User"}
              />
            </div>

            <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />

            {tab === "activity" && (
              <div className="section">
                <div>Last Completed Cards</div>
                <CardsMapper cards={user.last_completed_cards} />
              </div>
            )}

            {tab === "buddies" && (
              <div className="section">
                <div className={styles.header}>
                  <div>Following</div> {user.followers?.length || 0}/50
                </div>
                {user.followers?.map((b) => (
                  <Buddy
                    name={b.username}
                    link={`/users/${b.id}`}
                    img={b.avatar?.image.url}
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

            {tab === "artifacts" && (
              <div className="section">
                <div className={styles.header}>
                  <div>Artifacts</div> {user.stats?.claimed_artifacts || 0}/
                  {store.user.artifacts_count}
                </div>
                <div className={styles.artifactsWrapper}>
                  {store.user.artifacts.map((artifact, i) => {
                    return <Artifact key={i} artifact={artifact} />;
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
