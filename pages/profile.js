// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useRouter } from "next/router";
import Link from "next/link";

// *** COMPONENTS ***
import RewardImage from "../components/RewardImage";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import clseIcon from "../assets/close.svg";
import settingsIcon from "../assets/menu-settings-dark.svg";

// *** ACTIONS ***
import { followBuddy } from "../actions/action";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Profile.module.scss";
import router from "next/router";

const Stat = ({ img, number, text }) => {
  return (
    <div className={styles.statsBox}>
      <div className={styles.statsBox_img}>
        <img src={img} height="25px" />
      </div>
      <div className={styles.statsBox_number}>{number}</div>
      <div className={styles.statsBox_text}>{text}</div>
    </div>
  );
};

const Activity = ({ img, link, text, notification = false }) => {
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
        <div className={styles.buddyBox_name}>{name}</div>

        <div className={styles.buddyBox_img}>
          {/* <img src={img} height="25px" /> */}
        </div>

        <div className={styles.buddyBox_level}>{level}</div>
      </div>
    </Link>
  );
};

const CommunityAction = ({ actionProps }) => {
  const { name, action, card, votes, type } = actionProps;
  return (
    <div className={styles.communityAction}>
      <div className={styles.communityAction_name}>{name}</div>
      <div className={styles.communityAction_action}>{action}</div>
      <div className={styles.communityAction_card}>{card.name}</div>
      <div className={styles.communityAction_votes}>{votes}</div>
      <div className={styles.communityAction_type}>{type}</div>

      <div className={styles.buddyBox_img}>
        {/* <img src={img} height="25px" /> */}
      </div>
    </div>
  );
};

const Profile = () => {
  const [store, dispatch] = useContext(Context);
  const router = useRouter();
  const [tab, setTab] = useState("activity");

  console.log(store?.user);

  return (
    <div className="background_dark">
      {/* <Header /> */}

      {store?.user && (
        <div className="section_container">
          <div className={styles.profileHeader}>
            <div className={styles.escape} onClick={() => router.back()}>
              <img src={clseIcon} height="25px" />
            </div>
            <div className={styles.profileHeader_box}>
              <div className={styles.avatarBox}>
                <div className={styles.avatar}>img</div>
                <div className={styles.level}>25</div>
                <div className={styles.xp}>XP 230/400</div>
                <div className="btn btn-action" onClick={() => followBuddy()}>
                  Follow
                </div>
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
              number={store.user.highest_streak_count}
              img={"http://localhost:1337/streak.png"}
              text={"Highest Streak"}
            />
            <Stat
              number={store.user.energy}
              img={"http://localhost:1337/streak.png"}
              text={"Energy"}
            />
          </div>
          <div className={styles.tabs}>
            <div
              className={styles.tabsButton}
              onClick={() => setTab("activity")}
            >
              Activity
            </div>
            <div
              className={styles.tabsButton}
              onClick={() => setTab("buddies")}
            >
              Buddies
            </div>
            <div
              className={styles.tabsButton}
              onClick={() => setTab("content")}
            >
              Content
            </div>
          </div>

          {tab === "activity" && (
            <div>
              <Activity
                img={"http://localhost:1337/streak.png"}
                link={"/streak"}
                text={"Streak Rewards"}
                notification={2}
              />

              <Activity
                img={"http://localhost:1337/streak.png"}
                link={"/buddies-rewards"}
                text={"Buddy Rewards"}
                notification={1}
              />

              <Activity
                img={"http://localhost:1337/streak.png"}
                link={"/level-rewards"}
                text={"Level Rewards"}
              />
            </div>
          )}

          {tab === "buddies" && (
            <div>
              Shared Buddies 0/10
              {store.user.shared_buddies.map((b) => (
                <Buddy
                  name={b.username}
                  link={`/users/${b.id}`}
                  // img={b.profile.url}
                  level={b.level}
                  key={b.id}
                />
              ))}
            </div>
          )}

          {tab === "content" && (
            <div>
              Created Actions - 10
              {store.user.community_actions.map((a) => (
                <CommunityAction actionProps={a} key={a.id} />
              ))}
            </div>
          )}

          {/* SEPERATOR=--------------------------- */}
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Profile;
