// *** REACT ***

import { Buddy, ProfileHeader, Stat, Tabs } from "../components/profileComps";
import { useContext, useEffect, useState } from "react";

import { Context } from "../context/store";
import { GET_ARTIFACTS_QUERY } from "../GQL/query";
import Header from "../components/Header";
import { ImageUI } from "../components/reusableUI";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import ProgressBar from "../components/ProgressBar";
import { RewardLink } from "../components/todayComp";
import ShareBuddyModal from "../components/Modals/ShareBuddyModal";
import { claimArtifact } from "../actions/action";
import cx from "classnames";
import { normalize } from "../utils/calculations";
import styles from "../styles/Profile.module.scss";
import useModal from "../hooks/useModal";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

// *** COMPONENTS ***

// *** GQL ***

// *** ACTIONS ***

// *** STYLES ***

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//POTENTIALLY ADD SIMPLE DATA TABLE TO DISPLAY PROGRESS ON ALL ARTIFACTS?

const getColorByRarity = (rarity) => {
  if (rarity === "common") {
    return "#e7e7e7";
  }
  if (rarity === "rare") {
    return "#246ee9";
  }
  if (rarity === "epic") {
    return "#5c16c5";
  }
  if (rarity === "legendary") {
    return "#eec402";
  }
  return "#fff";
};

export const ArtifactModal = ({ artifact, className }) => {
  return (
    <div>
      <div className={`${styles.artifactDetails} ${className}`}>
        {/* {artifact.image && artifact.isClaimed && (
          <ImageUI url={artifact.image.url} className={styles.artifactImage} />
        )} */}
        <div className={styles.artifactDetails_name}>
          {artifact.isCollected ? (
            <ImageUI
              url={artifact?.image?.url}
              className={styles.artifactImage}
            />
          ) : (
            <ImageUI url={"/badge.png"} isPublic />
          )}
        </div>
        <div className={styles.artifactDetails_name}>{artifact.name}</div>
        <div
          className={styles.artifactDetails_rarity}
          style={{ color: getColorByRarity(artifact.rarity) }}
        >
          {artifact.rarity}
        </div>
        <div className={styles.artifactDetails_obtainedBy}>
          <div>Obtained by: </div>
          {artifact.obtained_by_description}
        </div>
        {!artifact.isClaimed && (
          <div className={styles.artifactProgress}>
            <ArtifactProgress artifact={artifact} />
          </div>
        )}
      </div>
    </div>
  );
};

const ArtifactProgress = ({ artifact }) => {
  if (artifact.type !== "random") {
    return (
      <>
        <ProgressBar
          progress={
            artifact.progress >= artifact.require
              ? artifact.require
              : artifact.progress
          }
          max={artifact.require || 1}
          isReadyToClaim
        />
        <div>
          {artifact.progress >= artifact.require
            ? artifact.require
            : artifact.progress}
          /{artifact.require}
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export const Artifact = ({ artifact }) => {
  const { isShowing, openModal, closeModal } = useModal();
  const [store, dispatch] = useContext(Context);
  let className;
  switch (artifact.rarity) {
    case "rare":
      className = styles.rare;
      break;
    case "epic":
      className = styles.epic;
      break;
    case "legendary":
      className = styles.legendary;
      break;
    default:
      className = styles.rare;
  }

  return (
    <>
      {/* artifact.isClaimed */}
      <div
        className={cx(styles.artifact, {
          [styles.readyToClaim]: artifact.isCollected && !artifact.isClaimed,
        })}
        onClick={() => {
          if (!artifact.isClaimed && artifact.isCollected) {
            claimArtifact(dispatch, artifact.id);
          }
          openModal();
        }}
      >
        {artifact.isCollected ? (
          <>
            <div>{artifact.short_name}</div>

            {artifact.image && (
              <ImageUI
                url={artifact.image.url}
                className={styles.artifactImage}
              />
            )}

            <div className={styles.artifact_name}>{artifact.name}</div>

            {!(artifact.isCollected && !artifact.isClaimed) && (
              <ArtifactProgress artifact={artifact} />
            )}

            {artifact.isCollected && !artifact.isClaimed && (
              <div className="btn btn-action">Claim</div>
            )}
          </>
        ) : (
          <>
            <ImageUI url={"/badge.png"} isPublic />

            <div className={styles.artifact_name}>{artifact.name}</div>

            <ArtifactProgress artifact={artifact} />
          </>
        )}
      </div>
      <Modal
        isShowing={isShowing}
        closeModal={closeModal}
        isSmall
        jsx={
          <ArtifactModal
            artifact={artifact}
            className={className}
            openModal={openModal}
          />
        }
      />
    </>
  );
};

const Profile = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_ARTIFACTS_QUERY);
  const [tab, setTab] = useState("Rewards");

  const transformArtifacts = (
    allArtifacts,
    userArtifacts,
    userArtifactsClaimed,
    user
  ) => {
    const artifactsById = userArtifacts.map((a) => a.id);
    const artifactsClaimedById = userArtifactsClaimed.map((a) => a.id);
    // add isCollected key
    const addIsCollectedArray = allArtifacts.map((artifact) => {
      if (artifactsById.includes(parseInt(artifact.id))) {
        return { ...artifact, isCollected: true };
      } else {
        return { ...artifact, isCollected: false };
      }
    });

    // add isClaimed key
    const isClaimedArray = addIsCollectedArray.map((artifact) => {
      if (artifactsClaimedById.includes(parseInt(artifact.id))) {
        return { ...artifact, isClaimed: true };
      } else {
        return { ...artifact, isClaimed: false };
      }
    });

    const progressArray = isClaimedArray.map((artifact) => {
      let progress;
      if (artifact.type == "level") {
        progress = user.level;
      }
      if (artifact.type == "streak") {
        progress = user.highest_streak_count;
      }
      if (artifact.type == "buddy_share") {
        progress = user.highest_buddy_count;
      }
      if (artifact.type == "random") {
        progress = 0;
      }
      return {
        ...artifact,
        progress: user.stats[artifact.type] || progress || 0,
      };
    });
    return progressArray;
  };

  const tabsData = [
    { label: "Rewards", count: -1 },
    { label: "buddies", count: -1 },
    { label: "achievements", count: store.notifications.artifacts || -1 },
  ];

  const gql_data = data && normalize(data);
  const { isShowing, openModal, closeModal } = useModal();

  return (
    <div className="background_dark">
      {store?.user && gql_data && (
        <div className="section-container">
          <Header />
          <div className="headerSpace"></div>
          <ProfileHeader />

          {store.user.stats && (
            <div className={styles.stats}>
              <Stat
                number={store.user.stats.card_unlock}
                img={`${baseUrl}/legendary-cards.png`}
                text={"Cards Unlocked"}
                max={store.user.cards_count}
              />
              <Stat
                number={store.user.stats.cards_complete}
                img={`${baseUrl}/rise.png`}
                text={"Sessions Completed"}
              />
              <Stat
                number={store.user.highest_streak_count}
                img={`${baseUrl}/streak.png`}
                text={"Highest Streak"}
              />
              <Stat
                number={store.user.stats.action_complete}
                img={`${baseUrl}/mastery.png`}
                text={"Total Mastery"}
              />
              <Stat
                number={store.user.stats.claimed_artifacts || 0}
                img={`${baseUrl}/energy.png`}
                text={"Achievements"}
                max={store.user.artifacts_count}
              />
              <Stat
                img={`${baseUrl}/user.png`}
                text={store.user.is_subscribed ? "Pro User" : "Free User"}
              />
            </div>
          )}

          <Tabs tabState={tab} setTab={setTab} tabs={tabsData} />

          {/* "https://backendactionise.s3.eu-west-1.amazonaws.com/2022_07_08_10_58_31_Actionise_28d16b97b5.png?updated_at=2022-07-08T08:58:51.431Z" */}
          {tab === "Rewards" && (
            <div className="section">
              {/* REWARDS SECTION */}

              <RewardLink
                img={`${baseUrl}/trophy.png`}
                link={"/level-rewards"}
                text={"Level Rewards"}
                notification={store.notifications?.levels}
              />
              <RewardLink
                img={`${baseUrl}/streak.png`}
                link={"/streak"}
                text={"Streak Rewards"}
                notification={store.notifications?.streaks}
              />

              <RewardLink
                img={`${baseUrl}/gift.png`}
                link={"/buddies-rewards"}
                text={"Buddy Rewards"}
                notification={store.notifications?.friends}
              />
            </div>
          )}

          {tab === "buddies" && (
            <div className="section">
              <div
                className={styles.header}
                style={{ justifyContent: "space-between" }}
              >
                <div>Shared Buddies</div>
                {store.user.shared_buddies?.length || 0}
                /10
              </div>
              {store.user.shared_buddies?.map((b) => (
                <Buddy
                  name={b.username}
                  link={`/users/${b.id}`}
                  img={b.avatar?.image.url}
                  level={b.level}
                  key={b.id}
                />
              ))}
              {/* <div className={styles.header}>
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
              ))} */}
              <div
                className="btn btn-stretch btn-primary mt1 mb1"
                onClick={openModal}
              >
                <img
                  src={`${baseUrl}/add-user.png`}
                  height="20px"
                  className="mr1"
                />
                Share Buddy Link
              </div>
            </div>
          )}

          <Modal
            isShowing={isShowing}
            closeModal={closeModal}
            isSmall
            jsx={<ShareBuddyModal id={store.user.id} />}
          />

          {tab === "achievements" && (
            <div className="section">
              <div className={styles.artifactsWrapper}>
                {transformArtifacts(
                  gql_data.artifacts,
                  store.user.artifacts,
                  store.user.claimed_artifacts,
                  store.user
                ).map((artifact, i) => {
                  return <Artifact key={i} artifact={artifact} />;
                })}
              </div>
            </div>
          )}
          {/* {tab === "content" && (
            <div className="section">
              <div className={styles.header}>
                <div>Created Actions</div>{" "}
                {store.user.community_actions?.length || 0}
              </div>
              {store.user.community_actions?.map((a) => (
                <CommunityAction action={a} type={"my"} key={a.id} />
              ))}
            </div>
          )} */}
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Profile;
