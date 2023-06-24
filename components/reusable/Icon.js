import React from "react";
import Link from "next/link";
import styles from "@/styles/reusable/Icon.module.scss";

const Icon = ({ href, src, alt = "icon", size, onClick }) => {
  const iconStyle = {
    cursor: "pointer",
    width: size,
    height: size,
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href}>
      <div className={styles.iconContainer} onClick={handleClick}>
        <img src={src} alt={alt} style={iconStyle} />
      </div>
    </Link>
  );
};

export default Icon;
