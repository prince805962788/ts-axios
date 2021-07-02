import { buildURL } from './helper/url'
import { transformRequest } from './helper/data'
import { processHeaders } from './helper/headers'
import { AxiosRequestConfig } from './types/index'
import xhr from './xhr'
import { config } from 'shelljs'
// 初始化axios
function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}
// 初始化参数
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}
// 转换url参数格式
function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}
// 转换body的数据格式
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}
// 处理响应头headers
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}
export default axios
