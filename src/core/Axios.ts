import { rejects } from 'assert'
import { AxiosRequestConfig, AxiosPromise, Method, ResolvedFn, RejectedFn } from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptors'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosPromise>
}
interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}
export default class Axios {
  interceptors: Interceptors //拦截器

  constructor() {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosPromise>()
    }
  }
  request(url: any, config?: any): AxiosPromise {
    // 接着在函数体我们判断 url 是否为字符串类型，一旦它为字符串类型，则继续对 config 判断，
    // 因为它可能不传，如果为空则构造一个空对象，然后把 url 添加到 config.url 中。如果 url 不是字符串类型，
    // 则说明我们传入的就是单个参数，且 url 就是 config，因此把 url 赋值给 config。
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    const chain: PromiseChain[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    // 先遍历请求拦截器插入到 chain 的前面
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    // 然后再遍历响应拦截器插入到 chain 后面
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    // 定义一个已经 resolve 的 promise
    let promise = Promise.resolve(config)
    // 循环这个 chain，拿到每个拦截器对象，把它们的 resolved 函数和 rejected 函数添加到 promise.then 的参数中
    // 这样就相当于通过 Promise 的链式调用方式，实现了拦截器一层层的链式调用的效果。
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }
  // 不携带data的请求
  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url }))
  }
  // 携带data的请求
  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
}
