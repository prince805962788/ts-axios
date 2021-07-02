import { isDate, isPlainObject } from './util'
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any) {
  if (!params) {
    return url
  }
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    let val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values: string[]
    // 对数组入参做处理
    if (Array.isArray(val)) {
      values = val
      key = key + '[]'
    } else {
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  let serialziedParams = parts.join('&')
  if (serialziedParams) {
    const markIndex = url.indexOf('#') //丢弃 url 中的哈希标记
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url = url + (url.indexOf('?') === -1 ? '?' : '&') + serialziedParams
  }
  return url
}
