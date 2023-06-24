import React from "react";
import classNames from "classnames";
import styles from "@/styles/Switch.module.scss";
import { useState } from "react";

function Switch({ className, checked, onChange, disabled = false }) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
    onChange();
  };

  const switchClassNames = classNames(
    styles.switch,
    {
      [styles.checked]: isChecked,
      [styles.disabled]: disabled,
    },
    className
  );

  const thumbClassNames = classNames(styles.thumb, {
    [styles.checked]: isChecked,
    [styles.disabled]: disabled,
  });

  return (
    <div className={switchClassNames} onClick={handleSwitchChange}>
      <div className={thumbClassNames} />
    </div>
  );
}

export default Switch;
