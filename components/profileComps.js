// *** REACT ***

import { useContext, useState } from "react";

import { Context } from "@/context/store";
import { GET_AVATARS } from "@/GQL/query";
import { ImageUI } from "./reusableUI";
import Link from "next/link";
import Modal from "./reusable/Modal";
import ProgressBar from "@/components/ProgressBar";
import cx from "classnames";

import { normalize } from "@/utils/calculations";
import { saveAvatar } from "@/actions/action";
import settingsIcon from "@/assets/menu-settings-dark.svg";
import styles from "@/styles/Profile.module.scss";
import useModal from "@/hooks/useModal";
import { useQuery } from "@apollo/react-hooks";
import baseUrl from "@/utils/settings";
import Loader from "@/components/reusable/Loader";
import Icon from "./reusable/Icon";

// *** COMPONENTS ***

// *** ACTIONS ***

// *** STYLES ***

export const Stat = ({ img, number, text, max, isPercent = false }) => {
  return (
    <div className={styles.statsBox}>
      <div className={styles.statsBox_img}>
        <img src={img} />
      </div>
      <div className={styles.statsBox_number}>
        {number == null ? <div className="mt1"> </div> : number}
        {max && `/${max}`}
        {isPercent && "%"}
      </div>
      <div className={styles.statsBox_text}>{text}</div>
    </div>
  );
};

export const Buddy = ({ img, link, name }) => {
  return (
    <Link href={link}>
      <div className={styles.buddyBox}>
        <div className={styles.buddyAvatar}>
          {img ? (
            <ImageUI url={img} height="66px" />
          ) : (
            <img src={`${baseUrl}/avatar-test.png`} />
          )}
        </div>
        <div className={styles.buddyBox_name}>{name}</div>

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
      {(loading || error) && <Loader />}
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
        className={`btn btn-${selected ? "primary" : "disabled"} mt1`}
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
  const maxLevel = user.xpLimit || 300;
  return (
    <div className={styles.profileHeader}>
      <div style={{ width: "40px" }}></div>
      <div className={styles.profileHeader_box}>
        <div className={styles.avatarBox}>
          <div className={styles.avatar}>
            <div
              onClick={() => {
                !isBuddy && openModal();
              }}
            >
              <ImageUI url={user.avatar?.image.url} height="66px" />
            </div>
          </div>

          <div className={styles.username}>{user.username}</div>
          <div className={styles.level_progress}>Level {user.level}</div>
          <ProgressBar progress={user.xp} max={maxLevel} />

          <div className={styles.xp}>
            XP {user.xp}/{maxLevel}
          </div>
        </div>
      </div>
      <div style={{ width: "24px", marginRight: "1rem" }}>
        {!isBuddy && (
          <div className={styles.settingsButton}>
            <Icon href={"/settings"} src={settingsIcon} size="25px" />
          </div>
        )}
      </div>
      <Modal
        isShowing={isShowing}
        closeModal={closeModal}
        isSmall
        jsx={<ChangeAvatarModal closeModal={closeModal} />}
      />
    </div>
  );
};
