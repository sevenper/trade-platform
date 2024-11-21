// 获取assets静态资源
const getAssetsFile = url => {
  if (url.startsWith("/")) {
    url = url.slice(1);
  }
  return new URL(`../${url}`, import.meta.url).href;
};

export default getAssetsFile;
