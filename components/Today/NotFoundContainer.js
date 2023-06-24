import Lottie from "lottie-react";
import styles from "@/styles/Today.module.scss";
import Link from "next/dist/client/link";
import notFoundLottie from "@/assets/lottie-animations/not-found.json";
export const NotFoundContainer = ({ text }) => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContainer_inner}>
        <Lottie
          animationData={notFoundLottie}
          loop={true}
          style={{ width: "150px" }}
        />
        <div className={styles.notFoundContainer_text}>{text}</div>
      </div>
      <Link
        href={{
          pathname: "/learn",
        }}
      >
        <div className="btn btn-outline mt1">Explore Categories</div>
      </Link>
    </div>
  );
};
