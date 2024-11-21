import app from "@/constants/app";
import { getValueByKeys, textI18n } from "@/utils/utils";
import { message } from "ant-design-vue";
import { getToken, removeAllCache } from "@/utils/cache";

import router from '@/router';
import axios from "axios";
const http = axios.create({
  baseURL: app.api,
  timeout: app.requestTimeout,
  responseType: 'json',
  withCredentials: true
});

http.interceptors.request.use(
  function (config) {
    // console.log(config, '11')
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    const token = getToken();
    if (token) {
      config.headers["USER_TOKEN"] = token
      config.headers["authorization"] = token;
    }
    if (config.method?.toUpperCase() === "GET") {
      config.params = { ...config.params, _t: new Date().getTime() };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  (response) => {
    // console.log(response, 'response')
    // 响应成功
    if (response.data.status === 0) {
      return response;
    }
    if (toString.call(response.data) === '[object Blob]') {
      return response;
    }
    // 如果 状态是1  并且是检测是否添加接口，，不弹出提示  新股缴纳缴纳成功 status 为1
    if (response.data.status === 1 &&
	 (response.config.url === '/user/isOption.do' 
	 || response.config.url === '/api/xingu/transfer.do' 
	 || response.config.url === '/user/bank/getBankInfo.do') ){
      return response;
    }
    
	if(!response.data.status){ //登录状态丢失
		removeAllCache(true)
		router.replace("/index");
	}
    // 错误提示
    message.error(response.data.msg);

    if (response.data.code === 401) {
      //自定义业务状态码
      redirectLogin();
    }

    return Promise.reject(new Error(response.data.msg || "Error"));
  },
  (error) => {
    console.log(error, 'error')
	message.error(textI18n('other.a1'));
    const status = getValueByKeys(error, "response.status", 500);
    const httpCodeLabel = {
      400: "请求参数错误",
      401: "未授权，请登录",
      403: "拒绝访问",
      404: `请求地址出错: ${getValueByKeys(error, "response.config.url", "")}`,
      408: "请求超时",
      500: "API接口报500错误",
      501: "服务未实现",
      502: "网关错误",
      503: "服务不可用",
      504: "网关超时",
      505: "HTTP版本不受支持"
    };
    if (error && error.response) {
      console.error("请求错误", error.response.data);
    }
    if (status === 401) {
      redirectLogin();
    }
    return Promise.reject(new Error(httpCodeLabel[status] || "接口错误"));
  }
);

const redirectLogin = () => {
  router.replace("/login");
  // window.location.href = import.meta.env.VITE_APP_DOMAIN
  return;
};

export default (o)=> {
  return new Promise((resolve, reject) => {
    http(o)
      .then((res) => {
        return resolve(res.data);
      })
      .catch(reject);
  });
};
