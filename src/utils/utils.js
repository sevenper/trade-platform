import dayjs from 'dayjs';

import { initI18n } from '@/i18n';
/**
 * 获取对象下的字段值
 * @param record {}
 * @param key 'a.b.c'
 * @param defaultValue
 * @returns
 */
export const getValueByKeys = (record, key, defaultValue) => {
  const keys = key.split(".");
  for (let i = 0; i < keys.length; i++) {
    record = record[keys[i]] || (i === keys.length - 1 ? defaultValue : {});
  }
  return record || defaultValue;
};

/**
 * 是否只null和undefined值
 * @param vl
 * @returns
 */
export const isNullOrUndefined = (vl) => {
    return vl === null || typeof vl === "undefined";
  };


  /**
   * 数组中 各个对象的某个属性 值相同 组成新的数组
   * @param {*} array 
   * @param {*} key 
   * @returns 
   */
export const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    // 获取当前对象的key属性值
    const keyValue = currentValue[key];
    // 如果结果对象中还没有这个key，则创建一个新数组
    if (!result[keyValue]) {
      result[keyValue] = [];
    }
    // 将当前对象添加到对应key的数组中
    result[keyValue].push(currentValue);
    return result;
  }, {}); // 初始值为一个空对象
}

export const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}

export const textI18n = (str) => {
  return initI18n.global.t(str)
}


// 字符串取中间几位***代替
export const replaceString = (str, start, end) => {
  if (str.length <= (start + end)) {
    return str.replace(/./g, '*');
  }
  let stringV = str.substring(0, start) + str.substring(start, str.length - end).replace(/./g, '*') + str.substring(str.length - end, str.length);
  return stringV;
}