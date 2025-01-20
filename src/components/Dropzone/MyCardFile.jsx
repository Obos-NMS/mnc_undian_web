import React, { useEffect, useMemo, useState } from "react";
import {
  CsvDefault,
  GifDefault,
  JpgDefault,
  PdfDefault,
  PictureDefault,
  PngDefault,
  XlsDefault,
  XlsxDefault,
} from "../Icon/Extension";
import MyButtonIcon from "../Button/MyButtonIcon";
import { Trash01 } from "untitledui-js";
import { formatFileSize } from "../../services/helper";

const MyCardFile = ({ progressUpload, file, onDeleteFile, progress = 0 }) => {
  const [blob, setBlob] = useState(null);

  useEffect(() => {
    if (file) {
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif"
      ) {
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const blob = new Blob([reader.result], { type: file.type });
            const url = URL.createObjectURL(blob);
            setBlob(url);
          };
          reader.readAsArrayBuffer(file);
        }
      }
    }
  }, [file]);

  const IconExtension = () => {
    const fileType = file.type;
    switch (fileType) {
      case "image/jpeg":
        return <PictureDefault size={40} />;
      case "image/jpg":
        return <PictureDefault size={40} />;
      case "image/png":
        return <PictureDefault size={40} />;
      case "image/gif":
        return <GifDefault size={40} />;
      case "application/pdf":
        return <PdfDefault size={40} />;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <XlsxDefault size={40} />;
      case "application/vnd.ms-excel":
        return <XlsDefault size={40} />;
      case "text/csv":
        return <CsvDefault size={40} />;
      default:
        return <></>;
    }
  };

  return (
    <section className="w-full relative overflow-hidden rounded-lg border border-gray-light/200 p-4">
      <div className="w-full flex items-start gap-3">
        <div className="w-10 h-10 min-w-[40px] min-h-[40px]">
          <IconExtension />
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <div className="flex flex-col overflow-hidden pr-8">
            <p className="text-sm-medium text-gray-light/700 line-clamp-1">
              {file.name}
            </p>
            <p className="text-sm-regular text-gray-light/600">
              {formatFileSize(file.size)}
            </p>
          </div>
          {
            <div
              className={
                "flex items-center gap-3 " + `${progress || progress === 0 ? "" : "invisible"}`
              }
            >
              <div className="flex-1">
                {(progressUpload && progressUpload.import) ? <div
                  className="h-2 rounded-full duration-300 bg-success/600"
                  style={{ width: `${progress}%` }}
                ></div> : <div
                  className="h-2 rounded-full duration-300 bg-blue-600"
                  style={{ width: `${progress}%` }}
                ></div>}

              </div>
              <p className="text-sm-medium text-gray-light/700">{progress}%</p>
            </div>
          }
          {blob && (
            <div className="rounded-lg overflow-hidden w-full flex justify-center items-center">
              <img className="w-full h-full object-contain" src={blob} alt="" />
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <MyButtonIcon
          disabled={progress}
          onClick={onDeleteFile}
          color={"gray"}
          variant={"text"}
          size={"md"}
        >
          <Trash01
            size={20}
            className={"text-gray-light/600"}
            stroke={"currentColor"}
          />
        </MyButtonIcon>
      </div>
    </section>
  );
};

export default MyCardFile;
