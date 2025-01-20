import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

const MyTabButton = ({ children, selected, value, onChange,
    type, isCheckSamePath, segment, rounded = 'lg', fullwidth = false }) => {

    const location = useLocation();
    const isSelected = useMemo(() => {
        if (isCheckSamePath) {
            if (segment) {
                var urlSplit = location.pathname.split('/');
                return urlSplit[segment] === value;
            } else {
                const isExistPath = location.pathname.includes(value);
                return isExistPath;
            }

        } else {
            return selected;
        }
    }, [isCheckSamePath, segment, location.pathname, value, selected])

    const makeStyle = useMemo(() => {
        let className = "";

        if (type === "underline") {
            className += " px-1 pb-3";
            className += isSelected ? " border-b-2 border-brand/600 text-sm-semibold text-brand/700 focus:outline-none"
                : " border-b-2 border-transparent text-sm-semibold text-gray-light/500 focus:outline-none hover:text-brand/700 hover:border-b-2 hover:border-brand/600";
        } else if (type === "buttonGray") {
            className += " px-3 py-2 text-sm-semibold rounded-md flex items-center justify-center gap-2";
            className += isSelected ? " bg-gray-light/50 text-gray-light/700" : " text-gray-light/500";
        } else if (type === "button-white-border") {
            className += " px-3 py-2 text-sm-semibold rounded-md flex items-center justify-center gap-2";
            className += isSelected ? " bg-white shadow-shadows/shadow-sm text-gray-light/700" : " text-gray-light/500";
        }

        if (fullwidth) {
            className += " w-full";
        } else {
            className += " w-max";
        }

        if (rounded === "none" || type === "underline") {
            className += " rounded-none";
        } else if (rounded === "sm") {
            className += " rounded-sm";
        } else if (rounded === "md") {
            className += " rounded-md";
        } else if (rounded === "lg") {
            className += " rounded-lg";
        } else if (rounded === "xl") {
            className += " rounded-xl";
        } else if (rounded === "2xl") {
            className += " rounded-2xl";
        } else if (rounded === "3xl") {
            className += " rounded-3xl";
        } else if (rounded === "full") {
            className += " rounded-full";
        }


        return className;
    }, [isSelected, type, rounded, fullwidth]);

    return (
        <>
            <button data-test={`btn-tab-setting-${value}`} onClick={() => onChange && onChange(value)} className={`flex items-center gap-2 ${makeStyle}`}>
                {children}
            </button>
        </>
    );
};

export default MyTabButton;