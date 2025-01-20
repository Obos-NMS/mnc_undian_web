import React, { useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import { DownloadCloud01, UploadCloud02 } from "untitledui-js";
import MyCardFile from "./MyCardFile";
import MyButton from "../Button/MyButton";
import * as XLSX from 'xlsx';
import { convertToMimeDict, formatFileExtensions, formatFileSize } from "../../services/helper";

// Common MIME types
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

const MyDropzone = ({
  defaultValueUrl,
  maxSize,
  accept,
  progressUpload,
  multiple = false,
  onChange,
  onDrop,
  onDropAccepted,
  onDropRejected,
  failedFile,
  errors,
}) => {
  const [socket, setSocket] = useState(null);
  const [files, setFiles] = useState([]);
  // const [progress, setProgress] = useState([]);

  const handleDrop = (acceptedFiles, rejectedFiles, e) => {
    var _files = [...files, ...acceptedFiles];

    setFiles(_files);
    onChange && onChange(_files);
    onDrop && onDrop(acceptedFiles, rejectedFiles, e);
  };
  const handleDropAccepted = (acceptedFiles) => {
    onDropAccepted && onDropAccepted(acceptedFiles, handleDeleteFile)
  };

  const handleDeleteFile = (file) => {
    const _files = [...files];
    _files.splice(_files.indexOf(file), 1);

    setFiles(_files);
    onChange && onChange(_files);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(failedFile?.failed);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "downloaded-file.xlsx");
  };

  const progressList = useMemo(() => {
    if (files.length && progressUpload && progressUpload.progress != null) {
      var maxValue = 1 / files.length;
      var progress = progressUpload.progress;

      const lprogress = [];
      for (let i = 0; i < files.length; i++) {
        if (progress > maxValue) {
          lprogress.push(100);
          progress -= maxValue;
        } else {
          var value = Math.min(progress, maxValue);
          lprogress.push(Math.floor((value / maxValue) * 100));
          progress = 0;
        }
      }

      return lprogress;
    } else {
      return files.map((e) => 0);
    }
  }, [progressUpload, files]);

  return (
    <div className="flex flex-col gap-4">
      {(multiple || files.length === 0) && (
        <div className="flex flex-col gap-1.5">
          <Dropzone
            multiple={multiple}
            maxSize={maxSize}
            accept={convertToMimeDict(accept)}
            onDrop={handleDrop}
            onDropAccepted={handleDropAccepted}
            onDropRejected={onDropRejected}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragReject,
              rejectedFiles,
            }) => {
              return (
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <section
                    className={`${isDragReject
                      ? "border-2 border-error/600 cursor-not-allowed"
                      : isDragActive
                        ? "border-2 border-brand/600 cursor-pointer"
                        : "border border-gray-light/200 cursor-pointer"
                      } w-full flex flex-col items-center gap-y-3 px-6 py-4 rounded-xl`}
                  >
                    <div className="w-max block p-2.5 border border-gray-light/200 shadow-shadows/shadow-xs rounded-lg">
                      <UploadCloud02
                        size={20}
                        className={"text-gray-light/700"}
                        stroke={"currentColor"}
                      />
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`text-sm-semibold ${isDragReject ? "text-error/700" : " text-brand/700"
                            }`}
                        >
                          Click to upload
                        </p>
                        <p className="text-sm-regular text-gray-light/600">
                          or drag and drop
                        </p>
                      </div>
                      <p className="text-xs-regular text-gray-light/600 flex gap-1">
                        {accept && <span>{formatFileExtensions(accept)}</span>}
                        {maxSize && (
                          <span>(max. {formatFileSize(maxSize)})</span>
                        )}
                      </p>
                    </div>
                  </section>
                </div>
              );
            }}
          </Dropzone>
          {errors && files.length === 0 && (
            <p className="text-sm-medium text-error/600">{errors}</p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {files &&
          files.map((file, i) => {
            return (
              <MyCardFile
                key={i}
                progressUpload={progressUpload}
                progress={progressList[i]}
                onDeleteFile={() => {
                  handleDeleteFile(file);
                }}
                file={file}
              />
            );
          })}
      </div>
      {failedFile && (
        <div className=" rounded-lg border border-gray-light/200">
          <div
            className={
              "rounded-t-lg px-4 py-4 flex items-start gap-3 bg-gray-light/50"
            }
          >
            <p className="flex-1 text-sm-medium text-gray-light/900">
              Total data
            </p>
            <p className="text-sm-regular text-gray-light/600 text-right">
              {failedFile?.success + failedFile?.failed?.length ?? "-"}
            </p>
          </div>
          <div className={"px-4 py-4 flex items-start gap-3"}>
            <p className="flex-1 text-sm-medium text-gray-light/900">Success</p>
            <p className="text-sm-regular text-gray-light/600 text-right">
              {failedFile?.success ?? "-"}
            </p>
          </div>
          <div
            className={
              "rounded-b-lg px-4 py-4 flex items-start gap-3 bg-gray-light/50"
            }
          >
            <p className="flex-1 text-sm-medium text-gray-light/900">Failed</p>
            <p className="text-sm-regular text-gray-light/600 text-right">
              {failedFile?.failed?.length ?? "-"}
            </p>
          </div>
          {failedFile?.failed?.length ? (
            <div className={"px-1 py-4 flex justify-end gap-3"}>
              <MyButton size={"sm"} color={"primary"} variant={"text"}
                onClick={handleDownload}>
                <div className="flex gap-1.5 items-center">
                  <DownloadCloud01 stroke={"currentColor"} />
                  <p className="text-sm-semibold">Download failed data</p>
                </div>
              </MyButton>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default MyDropzone;
