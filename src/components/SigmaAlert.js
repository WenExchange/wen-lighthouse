import React from "react";
import Popup from "reactjs-popup";

export const SADefault = ({ defaultInfo, children }) => {
  /**
   * defaultInfo
   * - title
   * - subTitle
   *
   */
  return (
    <div className=" text-white w-full flex flex-col items-center">
      {defaultInfo.title && (
        <p className="sm:text-[32px] text-[24px]">{defaultInfo.title}</p>
      )}
      {defaultInfo.subTitle && (
        <p
          className="md:text-[18px] sm:text-[16px] text-[14px] opacity-50 mt-[6px] "
          style={{
            whiteSpace: "pre-line"
          }}
        >
          {defaultInfo.subTitle}
        </p>
      )}
      {children}
    </div>
  );
};

export const useSigmaAlert = ({
  defaultInfo,
  children,
  closeOnDocumentClick = true
}) => {
  const isDefaultSA = typeof defaultInfo === "object";
  const [open, setOpen] = React.useState(false);
  const closeModal = React.useCallback(() => setOpen(false), [open]);
  const openModal = React.useCallback(() => setOpen(true), [open]);

  const popupComponent = React.useMemo(
    () => (
      <Popup
        open={open}
        modal
        closeOnDocumentClick={closeOnDocumentClick}
        repositionOnResize
        nested
        overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
        onClose={() => {
          closeModal();
        }}
      >
        <section className={`flex flex-col items-center`}>
          {isDefaultSA && <SADefault defaultInfo={defaultInfo} />}
          {children}
        </section>
      </Popup>
    ),
    [open]
  );

  return {
    openModal,
    closeModal,
    popupComponent
  };
};
