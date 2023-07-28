import React from "react";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import cx from "classnames";

const Modal = ({
  isShowing,
  openModal,
  closeModal,
  jsx,
  showCloseButton = true,
  isSmall = false,
  isAnimate = true,
}) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains("modal-wrapper")) {
        closeModal();
      }
    };

    if (isShowing) {
      document.addEventListener("click", handleOutsideClick);
      document.body.style.overflow = "hidden";
    }

    if (!isShowing) {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.body.style.overflow = "auto";
    };
  }, [isShowing, closeModal]);

  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className={cx("modal-wrapper", {
              "scale-in-center": isAnimate,
            })}
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className={isSmall ? "modal-small" : "modal"}>
              <div className="modal-header">
                {showCloseButton && (
                  <button
                    type="button"
                    className={
                      isSmall ? "modal-close-button" : "modal-close-button-big"
                    }
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={closeModal}
                  >
                    <div className="modal-icon">
                      <span aria-hidden="true">&times;</span>
                    </div>
                  </button>
                )}
              </div>
              <div style={{ height: "100%" }}>{jsx}</div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default Modal;
