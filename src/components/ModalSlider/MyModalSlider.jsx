import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactDOM from "react-dom";

const MyModalSlider = ({ children, open = false, onClose, element }) => {
  const [isMounting, setIsMounting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const makeStyleBackDrop = useMemo(() => {
    let className = "w-full h-full z-[800] duration-500";
    if (open && isMounting) {
      className += " backdrop-blur-lg";
    }

    return className;
  }, [open, isMounting]);

  const makeStyleContent = useMemo(() => {
    let style = {};
    if (isOpen && isMounting) {
      style.right = "0";
    } else if (!isOpen && isMounting) {
      style.right = "-100%";
    }

    return style;
  }, [isOpen, isMounting]);

  useEffect(() => {
    if (open) {
      setIsMounting(true);
    } else {
      if (isMounting) {
        setIsOpen(false);
        setTimeout(() => setIsMounting(false), 500);
      }
    }
  }, [open]);

  useEffect(() => {
    if (isMounting) {
      setIsOpen(true);
    }
  }, [isMounting]);

  return ReactDOM.createPortal(
    isMounting && (
      <div className="flex">
        <div className="w-full h-full fixed top-0 left-0">
          <div className="flex relative w-full h-full overflow-hidden">
            <div
              onClick={() => onClose && onClose()}
              className={`${makeStyleBackDrop}`}
            ></div>
            <div
              style={makeStyleContent}
              className={`absolute top-0 z-[900] duration-500 ease-out bg-white h-screen shadow-shadows/shadow-xl border-l border-gray-light/200`}
            >
              <div className="h-screen relative flex justify-end">
                {children}
                <div>{open ? element : <></>}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default MyModalSlider;
