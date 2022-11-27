import React from "react";
import styles from "../styles/ProgressBar.module.scss";
import cx from "classnames";
const ProgressBar = ({ progress, max, isReadyToClaim, withNumber }) => {
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
        <div className={styles.progressNumber}>
          {progress || 0}/{max}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
