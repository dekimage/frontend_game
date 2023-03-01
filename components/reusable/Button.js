import React from "react";
import styles from "../styles/reusable.module.scss";

const Button = ({
  children,
  className = "btn btn-primary",
  autofit = false,
  isLoading = false,
  isDisabled = false,
  onClick = () => {},
}) => {
  const buttonStyle = autofit ? { width: "100%", maxWidth: "100%" } : {};

  return (
    <div
      className={`${styles.button} ${className}`}
      style={buttonStyle}
      disabled={isLoading || isDisabled}
      onClick={onClick}
    >
      {isLoading ? <div className="lds-dual-ring"></div> : children}
    </div>
  );
};

export default Button;
