import $ from "jquery";
import { myToaster } from "../components/Toaster/MyToaster";
import { isArray, isObject } from "lodash";

const baseURL = process.env.REACT_APP_API_HOST ||
  `http://${window.location.hostname}:${process.env.REACT_APP_API_PORT}`;

export const convertUrlImage = (url) => {
  console.log("baseurl", baseURL);
  console.log("url", url);
  return `${url}`
}
export const handleError =
  (func, control, config = {}) =>
    async (data) => {
      if (!func) throw "func is required";
      if (!control) throw "control is required";
      await func(data, config).catch((e) => {
        console.log(e);
        myToaster(e);
        e.errors?.map((e, index) => {
          control.setError(e.path, { message: e.msg });
          if (index == 0)
            $(`[name=${e.path}]`)
              ?.get(0)
              ?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
      });
    };

export const checkErrorYup = (errors) => {
  if (errors) {
    var error = Object.keys(errors)[0];
    if (Array.isArray(errors[error])) {
      let _error = Object.keys(errors[error])[0];
      if ($(`#input-${error}-${_error}`).length) {
        $(`#input-${error}-${_error}`)
          .get(0)
          .scrollIntoView({ behavior: "smooth", block: "end" });
      }
    } else {
      if ($(`#input-${error}`).length) {
        $(`#input-${error}`)
          .get(0)
          .scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }
};

export const appendFormdata = (FormData, data, name) => {
  name = name || "";
  if (typeof data === "object") {
    $.each(data, function (index, value) {
      if (name == "") {
        appendFormdata(FormData, value, index);
      } else {
        appendFormdata(FormData, value, name + "[" + index + "]");
      }
    });
  } else if (data != undefined) {
    FormData.append(name, data);
  }
};

export const mimeTypes = {
  ".aac": "audio/aac",
  ".abw": "application/x-abiword",
  ".apng": "image/apng",
  ".arc": "application/x-freearc",
  ".avif": "image/avif",
  ".avi": "video/x-msvideo",
  ".azw": "application/vnd.amazon.ebook",
  ".bin": "application/octet-stream",
  ".bmp": "image/bmp",
  ".bz": "application/x-bzip",
  ".bz2": "application/x-bzip2",
  ".cda": "application/x-cdf",
  ".csh": "application/x-csh",
  ".css": "text/css",
  ".csv": "text/csv",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".eot": "application/vnd.ms-fontobject",
  ".epub": "application/epub+zip",
  ".gz": "application/gzip",
  ".gif": "image/gif",
  ".html": "text/html",
  ".ico": "image/vnd.microsoft.icon",
  ".ics": "text/calendar",
  ".jar": "application/java-archive",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".jsonld": "application/ld+json",
  ".midi": "audio/midi",
  ".mjs": "text/javascript",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".mpeg": "video/mpeg",
  ".mpkg": "application/vnd.apple.installer+xml",
  ".odp": "application/vnd.oasis.opendocument.presentation",
  ".ods": "application/vnd.oasis.opendocument.spreadsheet",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".oga": "audio/ogg",
  ".ogv": "video/ogg",
  ".ogx": "application/ogg",
  ".opus": "audio/opus",
  ".otf": "font/otf",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".php": "application/x-httpd-php",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".rar": "application/vnd.rar",
  ".rtf": "application/rtf",
  ".sh": "application/x-sh",
  ".svg": "image/svg+xml",
  ".tar": "application/x-tar",
  ".tiff": "image/tiff",
  ".ts": "video/mp2t",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".vsd": "application/vnd.visio",
  ".wav": "audio/wav",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xhtml": "application/xhtml+xml",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xml": "application/xml",
  ".xul": "application/vnd.mozilla.xul+xml",
  ".zip": "application/zip",
  ".3gp": "video/3gpp; audio/3gpp",
  ".3g2": "video/3gpp2; audio/3gpp2",
  ".7z": "application/x-7z-compressed",
};

export const convertToMimeDict = (fileExtensions) => {
  let resultDict = {};

  fileExtensions.forEach((ext) => {
    let mimeType = mimeTypes[ext];
    if (mimeType) {
      if (!resultDict[mimeType]) {
        resultDict[mimeType] = [ext];
      } else {
        resultDict[mimeType].push(ext);
      }
    }
  });

  return resultDict;
};

export const formatFileExtensions = (fileExtensions) => {
  let text = fileExtensions
    .map((ext) => ext.replace(".", "").toUpperCase())
    .join(", ");
  text = text.replace(/,(?=[^,]*$)/, " or ");

  return text;
};

export const formatFileSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + " " + sizes[i];
};

export const formatDateApproval = (dateAndTime) => {
  const date = new Date(dateAndTime);
  // Function to get the time zone offset
  function getTimezoneOffset(date, offsetHours) {
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(utcTime + offsetHours * 3600000);
  }
  // Define the target time zone offset (UTC+7)
  const targetTimezoneOffset = 7;
  const localDate = getTimezoneOffset(date, targetTimezoneOffset);
  // Format the date
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = localDate.toLocaleDateString("en-GB", options);
  // Format the time
  const formattedTime = localDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { formattedDate, formattedTime, targetTimezoneOffset };
};
