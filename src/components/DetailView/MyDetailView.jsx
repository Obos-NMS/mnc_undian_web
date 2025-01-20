import React from "react";

const MyDetailView = ({ datas = {}, func = {} }) => {
  return (
    <>
      {Object.entries(datas).map(([key, e], index) => {
        let value = func[key] ? func[key](e) : e;
        return (
          <div key={index} className={"px-4 py-4 flex items-start gap-3 " + (index % 2 === 0 ? "bg-gray-light/50" : "")}>
            <p className="flex-1 text-sm-medium text-gray-light/900 first-letter:uppercase">
              {key}
            </p>
            <p className="text-sm text-gray-light/600 text-right">{value}</p>
          </div>
        );
      })}
    </>
  );
};

export default MyDetailView;
