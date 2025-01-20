import React from "react";

const Modal = ({ data = {} }) => {
    return (
        <div className="w-full max-h-[225px] relative rounded-xl overflow-hidden">
            <div className="w-full h-[225px]">
                <img className="w-full h-full object-contain" src={data?.photo} alt="" />
            </div>
        </div>
    );
};

export default Modal;