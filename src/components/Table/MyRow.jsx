import React, { } from "react";

const MyRow = ({ children, tag, border }) => {
    return (
        <tr className="hover:bg-gray-light/25" >
            {React.Children.map(children, (child, index) => {
                return React.cloneElement(child, { tag: tag, border: border, index: index, key: index });
            })}
        </tr>
    );
};


export default MyRow;