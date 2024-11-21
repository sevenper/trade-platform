import http from "./http";

export function get(path, params, headers) {
    return new Promise((resolve, reject) => {
      http({
        url: path,
        params,
        headers,
        method: "GET"
      })
        .then(resolve)
        .catch((error) => {
          if (error !== "-999") {
            reject(error);
          }
        });
    });
  }
  export function getDow(path, params, headers) {
    return new Promise((resolve, reject) => {
      http({
        url: path,
        params,
        headers,
        responseType: "blob",
        method: "GET"
      })
      .then(resolve)
      .catch((error) => {
        if (error !== "-999") {
          reject(error);
        }
      });
    });
  }
  export function put(path, params, headers) {
    return http({
      url: path,
      data: params,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      method: "PUT"
    });
  }
  /**
   * 通用post方法
   * @param path
   * @param body
   * @returns
   */
  export function post(path, body, headers){
    return http({
      url: path,
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      data: body
    });
  }

  /**
   * 通用post方法
   * @param path
   * @param params
   * @returns
   */
  export function postParams(path, body, headers){
    return http({
      url: path,
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      params: body
    });
  }

  /**
   * 通用post方法
   * @param path
   * @param body
   * @returns
   */
  export function postfile(path, file, headers) {
    // 文件上传
    let formData = new FormData();
    formData.append("file", file);
    return http({
      url: path,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers
      },
      data: formData
    });
  }
// };

