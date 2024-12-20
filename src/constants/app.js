import appPack from "../../package.json";
/**
 * app系统配置
 */
export default {
  /**
   * 系统版本号，自动读取package.json中的version字段
   */
  version: appPack.version,

  /**
   * 系统默认语言
   */
  defaultLang: "zh-CN",
//   defaultLang: "en-US",

  /**
   * api请求地址，这里读取env环境变量中的VITE_APP_API
   */
  api: import.meta.env.VITE_APP_API,

  /**
   * websocket 服务地址，这里读取env环境变量中的VITE_APP_SOCKET
   */
  websocket: import.meta.env.VITE_APP_SOCKET,

  /**
   * globalImg 加载图片地址，这里读取env环境变量中的VITE_IMG_URL
   */
  globalImg: import.meta.env.VITE_IMG_URL,

  /**
   * 启用logo图标，logo尺寸32*32，存放路径@/assets/images/logo.png
   */
  enabledLogo: false,

  /**
   * 开启页面缓存
   */
  // enabledKeepAlive: true,
  enabledKeepAlive: false,

  /**
   * 网络请求超时时间，单位毫秒
   */
  requestTimeout: 30000,

  /**
   * 全屏渲染的页面
   */
  fullscreenPages: ["/login"]
};
