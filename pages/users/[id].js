// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useRouter } from "next/router";

// *** COMPONENTS ***
import NavBar from "../../components/NavBar";
import { CommunityAction } from "../../components/cardPageComps";
import {
  Activity,
  Stat,
  Buddy,
  ProfileHeader,
  Tabs,
} from "../../components/profileComps";

import { normalize } from "../../utils/calculations";

import { GET_USER_ID } from "../../GQL/query";

// *** ACTIONS ***
import { calcTotal } from "../../utils/calculations";

// *** STYLES ***
import styles from "../../styles/Profile.module.scss";
import { followBuddy } from "../../actions/action";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const tabsData = [
  { label: "activity", count: -1 },
  { label: "buddies", count: -1 },
  { label: "content", count: -1 },
];

const User = () => {
  const [store, dispatch] = useContext(Context);
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_USER_ID, {
    variables: { id: router.query.id },
  });
  const user = data && normalize(data).usersPermissionsUser;

  const [tab, setTab] = useState("activity");

  const completionProgress =
    user?.usercards && calcTotal(user.usercards, "completed", true);
  const collectionProgress =
    user?.usercards && calcTotal(user.usercards, "collected", true);

  const followers = store?.user?.followers;

  return (
    <div className="background_dark">
      {user && followers && (
        <div className="section-container">
          <ProfileHeader buddy={user} isBuddy />
          <div className="flex_center mt1">
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
          </div>

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
              number={user.highest_streak_count}
              img={`${baseUrl}/streak.png`}
              text={"Highest Streak"}
            />
            <Stat
              number={user.actions?.length}
              img={`${baseUrl}/energy.png`}
              text={"Actions Done"}
            />
          </div>

          <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />

          {tab === "activity" && <div className="section">collection...</div>}

          {tab === "buddies" && (
            <div className="section">
              <div className={styles.header}>
                <div>Following</div> {user.followers?.length || 0}/50
              </div>
              {user.followers?.map((b) => (
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
                <div>Created Actions</div> {user.communityactions?.length || 0}
              </div>
              {user.communityactions?.map((a) => (
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

export default User;
