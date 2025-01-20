import React, { } from "react";

const MyColumnGroup = ({ children, tag, border }) => {
    return (
        <>
            {React.Children.map(children, (child, index) => {
                return React.cloneElement(child, { tag: tag, border: border, key: index });
            })}
        </>
    );
};


export default MyColumnGroup;