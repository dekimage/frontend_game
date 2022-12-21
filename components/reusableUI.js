import { useRouter } from "next/router";
import Link from "next/link";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import styles from "../styles/ReusableUI.module.scss";
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

export const Button = ({ type, isDisabled, isLoading, onClick, children }) => {
  const handleOnClick = (onClick) => (e) => {
    if (!onClick || isDisabled || isLoading) {
      return;
    }
    onClick(e);
  };

  const fullClass = cx(`btn btn-${type}`, className, {
    isDisabled,
    isLoading,
  });

  return (
    <div
      tabIndex="0"
      className={fullClass}
      onClick={() => handleOnClick(onClick)}
    >
      {isLoading && <div className="lds-dual-ring"></div>}
      <div className="btn--content">{children}</div>
    </div>
  );
};
