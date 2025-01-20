import React from "react";

const MyButton = ({ children, type = "button", color, variant, size, rounded = "lg", disabled = false, expanded = false, onClick }) => {
    const makeStyle = React.useMemo(() => {
        let className = `${expanded ? 'w-full' : 'w-max'} h-max flex items-center justify-center text-center `;

        if (color === "primary" && variant === "text") {
            className += (disabled) ? "text-gray-light/400 focus:outline-none"
                : "text-brand/700 hover:text-brand/800 focus:outline-none";
        } else if (color === "primary" && variant === "outlined") {
            className += (disabled) ? "text-gray-light/400 bg-white shadow-shadows/shadow-xs border border-gray-light/200 focus:outline-none"
                : "text-brand/700 hover:text-brand/800 bg-white hover:bg-brand/50 shadow-shadows/shadow-xs border border-brand/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#f3e7bb]";
        } else if (color === "primary" && variant === "filled") {
            className += (disabled) ? "text-gray-light/400 bg-gray-light/100 shadow-shadows/shadow-xs border border-gray-light/200 focus:outline-none"
                : "text-white bg-brand/600 hover:bg-brand/700 shadow-shadows/shadow-xs focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#f3e7bb]";
        } else if (color === "primary" && variant === "filledTonal") {
            className += (disabled) ? "text-gray-light/400 focus:outline-none"
                : "text-brand/700 hover:text-brand/800 bg-brand/50 focus:outline-none";
        } else if (color === "secondary" && variant === "text") {
            className += (disabled) ? "text-gray-light/400 focus:outline-none"
                : "text-gray-light/700 hover:text-gray-light/800 focus:outline-none"
        } else if (color === "secondary" && variant === "outlined") {
            className += (disabled) ? "text-gray-light/400 bg-white shadow-shadows/shadow-xs border border-gray-light/200 focus:outline-none"
                : "text-gray-light/700 hover:text-gray-light/800 bg-white hover:bg-gray-light/50 shadow-shadows/shadow-xs border border-gray-gray-light/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]";
        } else if (color === "secondary" && variant === "filled") {
            className += (disabled) ? "text-gray-light/400 bg-gray-light/100 shadow-shadows/shadow-xs border border-gray-light/200 focus:outline-none"
                : "text-white bg-gray-light/600 hover:bg-gray-light/700 shadow-shadows/shadow-xs focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]";
        } else if (color === "secondary" && variant === "filledTonal") {
            className += (disabled) ? "text-gray-light/400 focus:outline-none"
                : "text-gray-light/700 hover:text-gray-light/800 bg-gray-light/50 focus:outline-none";
        } else if (color === "success" && variant === "text") {
            className += (disabled) ? "text-success/400 focus:outline-none"
                : "text-success/700 hover:text-success/800 focus:outline-none"
        } else if (color === "success" && variant === "outlined") {
            className += (disabled) ? "text-success/400 bg-white shadow-shadows/shadow-xs border border-success/200 focus:outline-none"
                : "text-success/700 hover:text-success/800 bg-white hover:bg-success/50 shadow-shadows/shadow-xs border border-gray-success/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]";
        } else if (color === "success" && variant === "filled") {
            className += (disabled) ? "text-success/400 bg-success/100 shadow-shadows/shadow-xs border border-success/200 focus:outline-none"
                : "text-white bg-success/600 hover:bg-success/700 shadow-shadows/shadow-xs focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]";
        } else if (color === "success" && variant === "filledTonal") {
            className += (disabled) ? "text-success/400 focus:outline-none"
                : "text-success/700 hover:text-success/800 bg-success/50 focus:outline-none";
        }else if (color === "error" && variant === "text") {
            className += (disabled) ? "text-error/400 focus:outline-none"
                : "text-error/700 hover:text-error/800 focus:outline-none"
        } else if (color === "error" && variant === "outlined") {
            className += (disabled) ? "text-error/400 bg-white shadow-shadows/shadow-xs border border-error/200 focus:outline-none"
                : "text-error/700 hover:text-error/800 bg-white hover:bg-error/50 shadow-shadows/shadow-xs border border-gray-error/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]";
        } else if (color === "error" && variant === "filled") {
            className += (disabled) ? "text-error/400 bg-error/100 shadow-shadows/shadow-xs border border-error/200 focus:outline-none"
                : "text-white bg-error/600 hover:bg-error/700 shadow-shadows/shadow-xs focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]";
        } else if (color === "error" && variant === "filledTonal") {
            className += (disabled) ? "text-error/400 focus:outline-none"
                : "text-error/700 hover:text-error/800 bg-error/50 focus:outline-none";
        }

        if (size === "sm") {
            className += " py-2 px-3 gap-x-1";
        } else if (size === "md") {
            className += " py-2.5 px-3.5 gap-x-1";
        } else if (size === "lg") {
            className += " py-2.5 px-4 gap-x-1.5";
        } else if (size === "xl") {
            className += " py-3 px-[18px] gap-x-1.5";
        } else if (size === "2xl") {
            className += " py-4 px-[22px] gap-x-2.5";
        }

        if (rounded === "none") {
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
    }, [color, variant, size, rounded, disabled, expanded]);


    return (
        <>
            <button type={type} onClick={onClick} disabled={disabled} className={makeStyle}>
                {children}
            </button>
        </>
    );
};

export default MyButton;