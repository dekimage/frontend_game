import React from "react";
import styles from "@/styles/EnergyModal.module.scss";
import iconLock from "@/assets/lock-white-border.svg";
import { deleteAccount } from "@/actions/action";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function DeleteConfirmModal({ closeModal }) {
  const router = useRouter();
  return (
    <div className={styles.energyModal}>
      <div className={styles.title}>Warning! This action is permanent.</div>

      <img src={iconLock} style={{ height: "32px", margin: "1rem 0" }} />

      <div>
        Are you sure you want to delete your account and all data related to
        your account?
      </div>

      <div className="btn btn-primary mt1" onClick={() => closeModal()}>
        No, I changed my mind
      </div>
      <div
        className="btn btn-warning mt1"
        onClick={async () => {
          Cookies.remove("token");
          Cookies.remove("userId");
          await deleteAccount();
          router.push({
            pathname: `/`,
            query: { isLandingPage: true },
          });
        }}
      >
        Yes, Delete my account
      </div>
    </div>
  );
}
