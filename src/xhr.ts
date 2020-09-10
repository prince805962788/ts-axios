import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'

import { paresHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType //设置返回数据类型
    }

    request.open(method.toUpperCase(), url, true) //开启连接

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      const responseHeaders = request.getAllResponseHeaders() //请求数据响应头
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        //返回值设定
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: paresHeaders(responseHeaders),
        config,
        request
      }
      resolve(response)
    }

    Object.keys(headers).forEach(name => {
      //设置响应头
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
