import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from './types'
import { parseHeaders } from './helper/headers'
import { createError } from './helper/error'

// 发送http请求
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    // 错误处理
    request.onerror = function handler() {
      reject(createError('Network Error', config, null, request))
    }

    // 超时时间设置
    if (timeout) {
      request.timeout = timeout
    }

    request.ontimeout = function handleTimeout() {
      reject(
        createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
      )
    }

    // 返回类型
    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    //设置响应头header
    Object.keys(headers).forEach(name => {
      // data为空，header中的content-type属性可以删除
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name]) //遍历设置header
      }
    })

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
      handleResponse(response)
    }

    // 处理回调
    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }

    request.send(data)
  })
}
