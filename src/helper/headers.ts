import { deepMerge, isPlainObject } from './util'
import { Method } from '../types/'
function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    // header中本身有的属性，但是大小写不同，替换成最新的
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-type')
  // data是对象,更换Content-type的值
  if (isPlainObject(data)) {
    if (headers && !headers['Content-type']) {
      headers['Content-type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}
// 格式化请求返回的header字符串
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) return parsed

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    if (val) val = val.trim()
    parsed[key] = val
  })
  return parsed
}
// 格式化header,通过 deepMerge 的方式把 common、post 的属性拷贝到 headers 这一级，然后再把 common、post 这些属性删掉。
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  console.log(1, headers)
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })
  console.log(2, headers)
  return headers
}
