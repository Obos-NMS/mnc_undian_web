import React, { createContext, useContext, useState } from "react";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [modal, setModal] = useState({ current: null });
  const [slider, setSlider] = useState({ current: null });
  const [bottomSheet, setBottomSheet] = useState({ current: null });

  const handleOpenSlider = (slider, id) => {
    if (slider && slider.current) {
      setSlider({ ...slider, id });
    }
  };
  const handleCloseSlider = () => {
    setSlider({ current: null });
  };

  const handleOpenModal = (modal, id) => {
    console.log("handle single winner", id);
    if (modal && modal.current) {
      setModal({ ...modal, id });
    }
  };

  const handleOpenWinnerModal = (modal, counter) => {
    console.log("handle multiple winner", counter);
    console.log("handle multiple winner", modal);
    if (modal && modal.current) {
      setModal({ ...modal, counter });
    }
  };
  const handleCloseModal = () => {
    setModal({ current: null });
  };

  const handleOpenBottomSheet = (modal, id) => {
    if (modal && modal.current) {
      setBottomSheet({ ...modal, id });
    }
  };
  const handleCloseBottomSheet = () => {
    setBottomSheet({ current: null });
  };
  return (
    <AppContext.Provider
      value={{
        slider,
        setSlider,
        handleOpenSlider,
        handleCloseSlider,
        modal,
        setModal,
        handleOpenModal,
        handleCloseModal,
        handleOpenWinnerModal,
        bottomSheet,
        setBottomSheet,
        handleOpenBottomSheet,
        handleCloseBottomSheet,
      }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};

export { AppProvider, useApp };
