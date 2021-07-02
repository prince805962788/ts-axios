import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from './types'
import { parseHeaders } from './helper/headers'

// 发送http请求
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config

    const request = new XMLHttpRequest()

    // 返回类型
    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    // 设置相应成功的回调
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return

      const responseHeaders = parseHeaders(request.getAllResponseHeaders()) //获取返回header并转成对象的形式
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText //返回数据
      // 设置返回值
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }

    //设置相应头header
    Object.keys(headers).forEach(name => {
      // data为空，header中的content-type属性可以删除
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name]) //遍历设置header
      }
    })

    request.send(data)
  })
}
