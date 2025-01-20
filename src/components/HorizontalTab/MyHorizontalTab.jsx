import React from "react";
import SimpleBar from "simplebar-react";

const MyHorizontalTab = ({ children, value, isCheckSamePath, onChange,
    type, fullwidth }) => {
    const makeStyle = React.useMemo(() => {
        let className = "";

        if (type === "underline") {
            className += " border-b border-gray-light/200 gap-3";
        } else if (type === "button-white-border") {
            className += " border border-gray-light/200 bg-gray-light/50 rounded-[10px] p-1 gap-1";
        }

        return className;
    }, [type]);

    return (
        <SimpleBar forceVisible="x" style={{ maxWidth: "100%" }}>
            <div className={`flex items-center w-full ${makeStyle}`}>
                {children && React.Children.map(children, (child, index) => {
                    return (React.cloneElement(child, {
                        "selected": value === child?.props?.value, "onChange": onChange,
                        "type": type, "isCheckSamePath": isCheckSamePath, "fullwidth": fullwidth, "key": index
                    }))
                })}
            </div>
        </SimpleBar>
    );
};

export default MyHorizontalTab;