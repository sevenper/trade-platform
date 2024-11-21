import { CacheToken } from "@/constants/cacheKey";
import { isNullOrUndefined } from "./utils";

const fix = "v1@";

/**
 * 存储介质适配器
 * @param isSessionStorage
 * @returns
 */
const cacheAdapter = (isSessionStorage) => {
  return isSessionStorage ? sessionStorage : localStorage;
};

/**
 * 取缓存值
 * @param {*} key
 * @param {*} options
 */
export const getCache = (key, options, defaultValue) => {
  key = fix + key;
  options = { isParse: true, isDelete: false, ...options };
  try {
    const value = cacheAdapter(options.isSessionStorage).getItem(key);
    if (options.isDelete) {
      cacheAdapter(options.isSessionStorage).removeItem(key);
    }
    return isNullOrUndefined(value)
      ? defaultValue
      : options.isParse
      ? value
        ? JSON.parse(value)
        : defaultValue
      : value;
  } catch (error) {
    console.error("getCache", error);
    return defaultValue;
  }
};

/**
 * 设置缓存值
 * @param {*} key
 * @param {*} value
 */
export const setCache = (
  key,
  value,
  isSessionStorage
) => {
  key = fix + key;
  cacheAdapter(isSessionStorage).setItem(
    key,
    typeof value === "object" ? JSON.stringify(value) : value
  );
};

/**
 * 清除缓存
 * @param key
 * @param isSessionStorage
 */
export const removeCache = (key, isSessionStorage) => {
  key = fix + key;
  cacheAdapter(isSessionStorage).removeItem(key);
};


/**
 * 清除缓存
 * @param all
 * @param isSessionStorage
 */
export const removeAllCache = (isSessionStorage) => {
  cacheAdapter(isSessionStorage).clear();
};


export const getToken = () => {
  return getCache(CacheToken, { isSessionStorage: true }, {})["token"];
};
