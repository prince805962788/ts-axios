import { isPlainObject } from './util'
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
export function transformResponse(data: any): any {
  //转成对象形式
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (error) {}
  }
  return data
}
