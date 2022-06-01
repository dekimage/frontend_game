import React from "react";
import ReactDOM from "react-dom";

const Modal = ({
  isShowing,
  openModal,
  closeModal,
  jsx,
  showCloseButton = true,
  isSmall = false,
}) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className="modal-wrapper scale-in-center"
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
                    className="modal-close-button"
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
              <div>{jsx}</div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;

export default Modal;
