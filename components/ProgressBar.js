import { ImageUI } from "./reusableUI";
import React from "react";
import cx from "classnames";
import styles from "../styles/ProgressBar.module.scss";

const ProgressBar = ({
  progress,
  max,
  isReadyToClaim,
  withNumber,
  withIcon = false,
  fontSize = 12,
}) => {
  // delete if numbers are correct
  let progressCapped = progress;
  if (progressCapped > max) {
    progressCapped = max;
  }
  return (
    <div className={styles.empty}>
      <div
        className={cx([styles.filled], { [styles.action]: isReadyToClaim })}
        style={{ "--progress": (progressCapped / max) * 100 }}
      ></div>
      {withNumber && (
        <div className={styles.progressNumber} style={{ fontSize: fontSize }}>
          {progress || 0}/{max}{" "}
          {withIcon && (
            <ImageUI
              url={`/${withIcon}.png`}
              isPublic
              height="14px"
              className="ml5"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
