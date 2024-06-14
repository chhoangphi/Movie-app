import Axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type CustomParamsSerializer
  } from "axios";
  import type {
    PureHttpError,
    RequestMethods,
    PureHttpResponse,
    PureHttpRequestConfig
  } from "./types";
  import { setToken, getToken, formatToken } from "@/utils/auth";
  import { useUserStoreHook } from "@/stores/modules/user";
  


  const defaultConfig: AxiosRequestConfig = {
    // 请求超时时间
    baseURL: import.meta.env.VITE_BASE_URL_API,
    timeout: 10000,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    },
  };
  
  class PureHttp {
    constructor() {
      this.httpInterceptorsRequest();
      this.httpInterceptorsResponse();
    }
  
  
    /** token过期后，暂存待执行的请求 */
    private static requests = [];
  
    /** 防止重复刷新token */
    private static isRefreshing = false;
  
    /** 初始化配置对象 */
    private static initConfig: PureHttpRequestConfig = {};
  
    /** 保存当前Axios实例对象 */
    private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);
  
    /** 重连原始请求 */
    private static retryOriginalRequest(config: PureHttpRequestConfig) {
      return new Promise(resolve => {
        PureHttp.requests.push((token: string) => {
          config.headers["Authorization"] = formatToken(token);
          resolve(config);
        });
      });
    }
  
  
    /** 请求拦截 */
    private httpInterceptorsRequest(): void {
      PureHttp.axiosInstance.interceptors.request.use(
        async (config: PureHttpRequestConfig): Promise<any> => {
          // 开启进度条动画
          // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
          if (typeof config.beforeRequestCallback === "function") {
            config.beforeRequestCallback(config);
            return config;
          }
          if (PureHttp.initConfig.beforeRequestCallback) {
            PureHttp.initConfig.beforeRequestCallback(config);
            return config;
          }
          /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
          const whiteList = ["/admin/oauth/refresh-token", "/admin/oauth/token"];
          return whiteList.find(url => url === config.url)
            ? config
            : new Promise(resolve => {
              const data = getToken();
              // console.log('config.url', config.url, 'getToken', data, );
              if (data.accessToken) {
                const now = new Date().getTime();
                // console.log('now', now, 'data.expires', data.expires, parseInt(data.expires));
                const expired = parseInt(data.expires) - now <= 0;
                // console.log('expired', expired, PureHttp.isRefreshing);
                
                if (expired) {
                  if (!PureHttp.isRefreshing) {
                    PureHttp.isRefreshing = true;
                    // token过期刷新
                    console.log('refreshToken');
                    
                    useUserStoreHook()
                      .handRefreshToken(data.refreshToken)
                      .then((res) => {
                        console.log('res', res);
                        
                        const token = res.data.access_token;
                        config.headers["Authorization"] = formatToken(token);
                        console.log('PureHttp.requests', PureHttp.requests);
                        PureHttp.requests.forEach(cb => cb(token));
                        PureHttp.requests = [];
                        setToken(res.data);
                      })
                      .finally(() => {
                        PureHttp.isRefreshing = false;
                      })
                      .catch(e => {
                        console.log(e)
                        useUserStoreHook().clearAuth();
                        PureHttp.isRefreshing = false;
                      });
                  }
                  resolve(PureHttp.retryOriginalRequest(config));
                } else {
                  config.headers["Authorization"] = formatToken(
                    data.accessToken
                  );
                  resolve(config);
                }
              } else {
                resolve(config);
              }
            });
        },
        error => {
          return Promise.reject(error);
        }
      );
    }
  
    /** 响应拦截 */
    private httpInterceptorsResponse(): void {
      // console.log('httpInterceptorsResponse');
      
      const instance = PureHttp.axiosInstance;
      instance.interceptors.response.use(
        (response: PureHttpResponse) => {
          const $config = response.config;
      
          // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
          if (typeof $config.beforeResponseCallback === "function") {
            $config.beforeResponseCallback(response);
            return response.data;
          }
          if (PureHttp.initConfig.beforeResponseCallback) {
            PureHttp.initConfig.beforeResponseCallback(response);
            return response.data;
          }
          return response.data;
        },
        (error: PureHttpError) => {
          const $error = error;
          $error.isCancelRequest = Axios.isCancel($error);

          // 所有的响应异常 区分来源为取消请求/非取消请求
          return Promise.reject($error);
        }
      );
    }
  
    /** 通用请求工具函数 */
    public request<T>(
      method: RequestMethods,
      url: string,
      param?: AxiosRequestConfig,
      axiosConfig?: PureHttpRequestConfig
    ): Promise<T> {
      const config = {
        method,
        url,
        ...param,
        ...axiosConfig
      } as PureHttpRequestConfig;
  
      // 单独处理自定义请求/响应回调
      return new Promise((resolve, reject) => {
        PureHttp.axiosInstance
          .request(config)
          .then((response: undefined) => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  
    /** 单独抽离的post工具函数 */
    public post<T, P>(
      url: string,
      params?: AxiosRequestConfig<T>,
      config?: PureHttpRequestConfig
    ): Promise<P> {
      return this.request<P>("post", url, params, config);
    }
  
    /** 单独抽离的get工具函数 */
    public get<T, P>(
      url: string,
      params?: AxiosRequestConfig<T>,
      config?: PureHttpRequestConfig
    ): Promise<P> {
      return this.request<P>("get", url, params, config);
    }
  }
  
  
  export const http = new PureHttp();