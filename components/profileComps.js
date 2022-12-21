// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import Link from "next/link";
import router from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { GET_AVATARS } from "../GQL/query";
import { normalize } from "../utils/calculations";

// *** COMPONENTS ***
import ProgressBar from "../components/ProgressBar";

// *** ACTIONS ***
import { saveAvatar } from "../actions/action";

import settingsIcon from "../assets/menu-settings-dark.svg";
import { getXpLimit } from "../utils/calculations";

// *** STYLES ***
import styles from "../styles/Profile.module.scss";
import cx from "classnames";
import useModal from "../hooks/useModal";
import Modal from "./Modal";
import { ImageUI } from "./reusableUI";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const Stat = ({ img, number, text, max, isPercent = false }) => {
  return (
    <div className={styles.statsBox}>
      <div className={styles.statsBox_img}>
        <img src={img} />
      </div>
      <div className={styles.statsBox_number}>
        {number}
        {max && `/${max}`}
        {isPercent && "%"}
      </div>
      <div className={styles.statsBox_text}>{text}</div>
    </div>
  );
};

export const Buddy = ({ img, link, name, level }) => {
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

const AvatarImage = ({ avatar, setSelected, selected }) => {
  const isSelected = avatar.image.id == selected?.image.id;
  return (
    <div
      className={cx([styles.avatar], {
        [styles.active]: isSelected,
      })}
      onClick={() => setSelected(avatar)}
    >
      <ImageUI
        url={avatar.image.url}
        height="50px"
        className={styles.avatar_image}
      />
      {/* <div className={styles.avatar_name}>{avatar.name}</div> */}
      {/* <div className={styles.avatar_require}>{avatar.require_level}</div>
      <div className={styles.avatar_require}>{avatar.require_artifact}</div>
      <div className={styles.avatar_isOpen}>{avatar.is_open}</div> */}
    </div>
  );
};

const ChangeAvatarModal = ({ closeModal }) => {
  const { data, loading, error } = useQuery(GET_AVATARS);
  const [selected, setSelected] = useState();
  const [store, dispatch] = useContext(Context);
  const avatars = data && normalize(data).avatars;

  return (
    <div className={styles.avatarModal}>
      {loading || (error && <div>Loading...</div>)}
      <div className="header">Change Avatar</div>
      {avatars && (
        <div className={styles.avatarWrapper}>
          {avatars.map((a, i) => {
            return (
              <AvatarImage
                avatar={a}
                key={i}
                setSelected={setSelected}
                selected={selected}
              />
            );
          })}
        </div>
      )}
      <div
        className={`btn btn-${selected ? "success" : "disabled"} mt1`}
        onClick={() => {
          if (selected) {
            saveAvatar(dispatch, selected.id);
          }
          closeModal();
        }}
      >
        Save
      </div>
    </div>
  );
};

export const ProfileHeader = ({ buddy, isBuddy = false }) => {
  const [store, dispatch] = useContext(Context);
  const { isShowing, openModal, closeModal } = useModal();
  const user = isBuddy ? buddy : store.user;
  const maxLevel = getXpLimit(user.level);
  return (
    <div className={styles.profileHeader}>
      <div className="ml1"></div>
      <div className={styles.profileHeader_box}>
        <div className={styles.avatarBox}>
          <div className={styles.avatar}>
            <div className={styles.level}>{user.level}</div>
            <img
              onClick={openModal}
              src={`${baseUrl}${user.avatar?.image.url}`}
              height="66px"
            />
          </div>

          <div className={styles.username}>{user.username}</div>
          <div className={styles.level_progress}>LEVEL {user.level}</div>
          <ProgressBar progress={user.xp} max={maxLevel} />

          <div className={styles.xp}>
            XP {user.xp}/{maxLevel}
          </div>
          {/* <div className="btn btn-action" onClick={() => followBuddy()}>
            Follow
          </div> */}
        </div>
      </div>
      <div style={{ width: "24px" }}>
        {!isBuddy && (
          <Link href="/settings">
            <div className={styles.settings}>
              <img src={settingsIcon} height="25px" />
            </div>
          </Link>
        )}
      </div>
      <Modal
        isShowing={isShowing}
        closeModal={closeModal}
        jsx={<ChangeAvatarModal closeModal={closeModal} />}
      />
    </div>
  );
};

export const Tabs = ({
  tabState,
  setTab,
  tabs,
  callback = false,
  value = false,
}) => {
  const tabWidth = tabs.length === 2 ? "50%" : "33.3%";

  const TabHoc = ({ children, tab, tabState, link, tabWidth }) => {
    return (
      <div
        className={cx(
          styles.tabsButton,
          tabState === tab.label && styles.active
        )}
        style={{ width: tabWidth }}
      >
        {link ? (
          <a href={link ? `#${link}` : ""}>
            <div>{children}</div>
          </a>
        ) : (
          <div>{children}</div>
        )}
      </div>
    );
  };
  const Tab = ({ tabState, setTab, tab, link }) => {
    return (
      <TabHoc
        tab={tab}
        tabState={tabState}
        link={link}
        tabWidth={tabWidth}
        children={
          <div
            onClick={() => {
              setTab(tab.label);
              callback && callback(value);
            }}
            className="flex_center"
          >
            {tab.label}
            {tab.count !== -1 && (
              <div className={styles.tabCounter}>
                {tab.count ? tab.count : 0}
              </div>
            )}
          </div>
        }
      />
    );
  };
  return (
    <div className={styles.tabs}>
      {tabs.map((t, i) => {
        return (
          <Tab
            key={i}
            tabState={tabState}
            setTab={setTab}
            tab={t}
            link={t.link}
            tabWidth={tabWidth}
          />
        );
      })}
    </div>
  );
};
