import { useRouter } from "next/router";
import Link from "next/link";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import styles from "../styles/ReusableUI.module.scss";
// src={`${baseUrl}/gift.png`}

export const ImageUI = ({ className = "", imgUrl, height, width }) => {
  return (
    <div className={className}>
      <img height={height} width={width} src={`${baseUrl}${imgUrl}`} />
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
