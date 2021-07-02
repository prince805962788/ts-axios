import { buildURL } from './helper/url'
import { AxiosRequestConfig } from './types/index'
import xhr from './xhr'
// 初始化axios
function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}
// 初始化参数
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
}
// 转换参数格式
function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}
export default axios
