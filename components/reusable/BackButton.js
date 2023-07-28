import Link from "next/link";
import styles from "@/styles/BackButton.module.scss";
import { useRouter } from "next/router";

export const BackButton = ({
  routeStatic,
  routeDynamic,
  isBack = false,
  callback = false,
}) => {
  const router = useRouter();
  return (
    <>
      {isBack ? (
        <div
          className={styles.backButton}
          onClick={() => {
            if (callback) {
              callback();
            } else {
              router.back();
            }
          }}
        >
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
