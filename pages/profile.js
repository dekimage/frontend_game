// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useRouter } from "next/router";
import Link from "next/link";

// *** COMPONENTS ***
import ProgressBar from "../components/ProgressBar";
import RewardImage from "../components/RewardImage";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { CommunityAction } from "../pages/card/[id]";

import settingsIcon from "../assets/menu-settings-dark.svg";

// *** ACTIONS ***
import { followBuddy } from "../actions/action";
import { calcTotal } from "../utils/calculations";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Profile.module.scss";
import router from "next/router";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Stat = ({ img, number, text, isPercent = false }) => {
  return (
    <div className={styles.statsBox}>
      <div className={styles.statsBox_img}>
        <img src={img} />
      </div>
      <div className={styles.statsBox_number}>
        {number}
        {isPercent && "%"}
      </div>
      <div className={styles.statsBox_text}>{text}</div>
    </div>
  );
};

export const Activity = ({ img, link, text, notification = false }) => {
  return (
    <Link href={link}>
      <div className={styles.activityBox}>
        {notification && (
          <div className={styles.activityBox_notification}>{notification}</div>
        )}
        <div className={styles.activityBox_img}>
          <img src={img} height="25px" />
        </div>

        <div className={styles.activityBox_text}>{text}</div>
      </div>
    </Link>
  );
};

const Buddy = ({ img, link, name, level }) => {
  return (
    <Link href={link}>
      <div className={styles.buddyBox}>
        <div className={styles.buddyAvatar}>
          <img
            // src={`${baseUrl}/${store.user.image.url}`

            src={`${baseUrl}/avatar-test.png`}
          />
        </div>
        <div className={styles.buddyBox_name}>{name}</div>

        <div className={styles.buddyBox_level}>{level} Lvl</div>
        <div className={styles.arrowRight}>
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </div>
      </div>
    </Link>
  );
};

// const CommunityAction = ({ actionProps }) => {
//   const { name, action, card, votes, type } = actionProps;
//   return (
//     <div className={styles.communityAction}>
//       <div className={styles.communityAction_name}>{name}</div>
//       <div className={styles.communityAction_action}>{action}</div>
//       <div className={styles.communityAction_card}>{card.name}</div>
//       <div className={styles.communityAction_votes}>{votes}</div>
//       <div className={styles.communityAction_type}>{type}</div>

//       <div className={styles.buddyBox_img}>
//         {/* <img src={img} height="25px" /> */}
//       </div>
//     </div>
//   );
// };

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

  return (
    <div className="background_dark">
      {/* <Header /> */}

      {store?.user?.image && (
        <div className="section-container">
          <div className={styles.profileHeader}>
            <div className={styles.escape} onClick={() => router.back()}>
              {/* <img src={iconBack} height="25px" /> */}
              <ion-icon name="chevron-back-outline"></ion-icon>
            </div>
            <div className={styles.profileHeader_box}>
              <div className={styles.avatarBox}>
                <div className={styles.avatar}>
                  <img
                    // src={`${baseUrl}/${store.user.image.url}`

                    src={`${baseUrl}/avatar-test.png`}
                    height="66px"
                  />
                </div>
                <div className={styles.level}>25</div>
                <div className={styles.username}>{store.user.username}</div>
                <ProgressBar progress={store.user.xp} max={50} />

                <div className={styles.xp}>XP {store.user.xp}/50</div>
                {/* <div className="btn btn-action" onClick={() => followBuddy()}>
                  Follow
                </div> */}
              </div>
            </div>
            <Link href="/settings">
              <div className={styles.settings}>
                <img src={settingsIcon} height="25px" />
              </div>
            </Link>
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
              number={store.user.highest_streak_count}
              img={`${baseUrl}/streak.png`}
              text={"Highest Streak"}
            />
            <Stat
              number={store.user.maxEnergy}
              img={`${baseUrl}/energy.png`}
              text={"Max Energy"}
            />
          </div>
          <div className={styles.tabs}>
            <div
              className={cx(
                styles.tabsButton,
                tab === "activity" && styles.active
              )}
              onClick={() => setTab("activity")}
            >
              Activity
            </div>
            <div
              className={cx(
                styles.tabsButton,
                tab === "buddies" && styles.active
              )}
              onClick={() => setTab("buddies")}
            >
              Buddies
            </div>
            <div
              className={cx(
                styles.tabsButton,
                tab === "content" && styles.active
              )}
              onClick={() => setTab("content")}
            >
              Content
            </div>
          </div>

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
                <div>Shared Buddies</div> {store.user.shared_buddies.length}/10
              </div>
              {store.user.shared_buddies.map((b) => (
                <Buddy
                  name={b.username}
                  link={`/users/${b.id}`}
                  // img={b.profile.url}
                  level={b.level}
                  key={b.id}
                />
              ))}
              <div className={styles.header}>
                <div>Following</div> {store.user.followers.length}/50
              </div>
              {store.user.followers.map((b) => (
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
                <div>Created Actions</div> {store.user.community_actions.length}
              </div>
              {store.user.community_actions.map((a) => (
                <CommunityAction action={a} type={"my"} key={a.id} />
              ))}
            </div>
          )}

          {/* SEPERATOR=--------------------------- */}
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Profile;
