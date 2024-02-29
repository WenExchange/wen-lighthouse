import React from "react";
import Popup from "reactjs-popup";

const useDanyModal = ({
  children,
  closeOnDocumentClick = true,
  contentStyle,
  overlayStyle
}) => {
  const [open, setOpen] = React.useState(false);
  const closeModal = React.useCallback(() => setOpen(false), [open]);
  const openModal = React.useCallback(() => setOpen(true), [open]);

  const modalComponent = React.useMemo(
    () => (
      <Popup
        open={open}
        modal
        closeOnDocumentClick={closeOnDocumentClick}
        closeOnEscape={true}
        repositionOnResize
        nested
        contentStyle={contentStyle}
        overlayStyle={{
          background: "rgba(0,0,0,0.5)",
          zIndex: 1600,
          ...overlayStyle
        }}
        onClose={() => {
          closeModal();
        }}
      >
        <section className={`flex flex-col items-center`}>{children}</section>
      </Popup>
    ),
    [open]
  );

  return {
    openModal,
    closeModal,
    modalComponent
  };
};

export default useDanyModal;
