import React, { useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import $ from "jquery";

const MyModal = ({
  children,
  maxWidth = 375,
  open = false,
  onClose = null,
}) => {
  const modalRef = useRef();
  const handleClose = function (e) {
    if (!$(e.target).closest(".my-modal-children").length) {
      if (onClose) onClose();
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        $(".my-modal-btn-close").on("click", function (e) {
          $(".my-modal-btn-close").off("click");
          if (onClose) onClose();
        });
      }, 200);
    }
  }, []);
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        "&.MuiModal-root .MuiBackdrop-root": {
          backgroundColor: "transparent",
          opacity: "1 !important",
        },
      }}>
      <div
        onClick={handleClose}
        style={{
          backgroundColor: "rgba(12, 17, 29, 0.7)",
          backdropFilter: "blur(4px)",
        }}
        className="w-full h-screen flex items-center justify-center relative"
        ref={modalRef}>

        <div
          style={{
            maxWidth: `900px`,
            minHeightheight:'900px'
          }}
          className={`h-[90vh] flex items-center overflow-hidden ${
            maxWidth && maxWidth !== 0 ? "w-full" : ""
          }`}>
          <div className="my-modal-children w-full">{children}</div>
        </div>
      </div>
    </Modal>
  );
};

export default MyModal;
