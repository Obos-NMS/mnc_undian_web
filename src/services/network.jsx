import axios from "axios";
import moment from "moment-timezone";

const baseURL =
  process.env.REACT_APP_API_HOST ||
  `http://${window.location.hostname}:${process.env.REACT_APP_API_PORT}`;

export const instance = axios.create({ baseURL: baseURL });

export const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  } catch (error) {
    console.log("getCookie", error);
    return null;
  }
};
export const setCookie = (key, value, expiry) => {
  var expires = new Date();
  expires.setTime(expires.getTime() + expiry * 60 * 60 * 1000);
  document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();
};

export const getLocalStorage = (key) => {
  try {
    const local = localStorage.getItem(key);
    if (!local) return null;

    const parse = JSON.parse(local);
    return parse;
  } catch (error) {
    return null;
  }
};
export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const logout = () => {
  setCookie("mnc-undian.id", null, "-1");
  window.location.href = "/login";
};

const getHeader = (type) => {
  const timezone = moment.tz.guess();
  var headers = {};

  switch (type) {
    case "json": {
      headers = {
        ...headers,
        "Content-Type": "application/json",
        "Accept-Language": "en",
      };
      break;
    }
    case "form-data": {
      headers = {
        ...headers,
        "Accept-Language": "en",
        "Time-Zone": timezone,
      };
      break;
    }
    default:
  }

  return headers;
};
export const get = async (endpoint, params, timeout = 30000) => {
  try {
    const headers = getHeader();
    var url = `${baseURL}${endpoint}`;
    const response = await instance.get(url, { headers, params, timeout });
    return response.data;
  } catch (error) {
    if (error.response?.status == 401) logout();
    throw error.response?.data;
  }
};

export const post = async (
  endpoint,
  data,
  type = "json",
  timeout = 30000,
  config = {}
) => {
  try {
    const headers = getHeader(type);
    var url = `${baseURL}${endpoint}`;

    const response = await instance.post(url, data, {
      headers,
      timeout,
      ...config,
      onUploadProgress: (progressEvent) => {
        if (config.onUploadProgress && progressEvent.total) {
          config.onUploadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            progress: progressEvent.loaded / progressEvent.total,
          });
        }
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) logout();
    throw error.response?.data;
  }
};

export const patch = async (
  endpoint,
  data,
  params,
  type = "json",
  timeout = 30000,
  config
) => {
  try {
    const headers = getHeader(type);

    var url = `${baseURL}${endpoint}`;
    const response = await instance.patch(url, data, {
      headers,
      params,
      timeout,
      ...config,
    });
    return response.data;
  } catch (error) {
    if (error.response?.status == 401) logout();
    throw error.response?.data;
  }
};

export const remove = async (endpoint, timeout = 10000) => {
  try {
    const headers = { authorization: "Bearer " + getCookie("mnc-undian.id") };
    var url = `${baseURL}${endpoint}`;
    const response = await instance.delete(url, { headers, timeout });
    return response.data;
  } catch (error) {
    if (error.response?.status == 401) logout();
    throw error.response?.data;
  }
};
export const download = (endpoint, params) => {
  var url = `${baseURL}${endpoint}?token=${getCookie("mnc-undian.id") || ""}`;
  if (params) {
    Object.keys(params).forEach((key) => {
      url += `&${key}=${params[key] ?? ""}`;
    });
  }

  return url;
};
