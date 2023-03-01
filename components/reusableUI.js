import Link from "next/link";
import cx from "classnames";
import styles from "../styles/ReusableUI.module.scss";
import { useRouter } from "next/router";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// src={`${baseUrl}/gift.png`}
const dev = process.env.NODE_ENV == "development";

export const ImageUI = ({
  className = "",
  url,
  isPublic = false,
  height = "auto",
  width = "auto",
}) => {
  return (
    <div className={className}>
      <img
        height={height}
        width={width}
        src={dev || isPublic ? `${baseUrl}${url}` : `${url}`}
      />
    </div>
  );
};

export const BackButton = ({ routeStatic, routeDynamic, isBack = false }) => {
  const router = useRouter();
  return (
    <>
      {isBack ? (
        <div className={styles.backButton} onClick={() => router.back()}>
          <ion-icon name="chevron-back-outline"></ion-icon>
        </div>
      ) : (
        <Link href={`${routeStatic}${routeDynamic}`}>
          <div className={styles.backButton}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>
        </Link>
      )}
    </>
  );
};

export const Button = ({
  type = "primary",
  children,
  className = "",
  autofit = false,
  isLoading = false,
  isDisabled = false,
  onClick,
}) => {
  const handleOnClick = () => {
    console.log({ onClick, isDisabled, isLoading });
    if (!onClick || isDisabled || isLoading) {
      return;
    }

    onClick();
  };
  const buttonStyle = autofit ? { width: "100%", maxWidth: "100%" } : {};
  const fullClass = cx(`btn btn-${type}`, className, {
    isDisabled: "btn-disabled",
    isLoading,
  });

  return (
    <div
      tabIndex="0"
      className={fullClass}
      style={buttonStyle}
      onClick={handleOnClick}
    >
      {isLoading ? (
        <div className="lds-dual-ring"></div>
      ) : (
        <div className="btn--content">{children}</div>
      )}
    </div>
  );
};
