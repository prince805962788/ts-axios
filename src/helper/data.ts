import { isPlainObject } from './util'

// 请求参数对象转为JSON
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
// 回调参数JSON转对象
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {}
  }
  return data
}
