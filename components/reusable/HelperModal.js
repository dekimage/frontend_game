import React, { useState } from "react";

import Modal from "../Modal";
import useModal from "../../hooks/useModal";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const HelperPopup = ({ HelperModal, className }) => {
  const { isShowing, openModal, closeModal } = useModal();

  return (
    <>
      <div
        className={`${className} flex_center`}
        onClick={() => openModal(true)}
      >
        <img src={`${baseUrl}/help.png`} height="25px" />
      </div>

      {isShowing && (
        <Modal
          isShowing={isShowing}
          closeModal={closeModal}
          isSmall
          jsx={<HelperModal closeModal={closeModal} />}
        />
      )}
    </>
  );
};

export default HelperPopup;
