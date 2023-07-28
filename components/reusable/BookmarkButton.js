import styles from "@/styles/BackButton.module.scss";
import { ImageUI } from "../reusableUI";

export const BookmarkButton = ({ callBack, saved }) => {
  return (
    <div className={styles.bookmarkButton} onClick={() => callBack()}>
      <ImageUI
        url={saved ? "/bookmark.png" : "/bookmark-outline.png"}
        height="18px"
        isPublic
      />
    </div>
  );
};
