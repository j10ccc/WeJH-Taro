import Taro from "@tarojs/taro";
import RequestError, { MPErrorCode, ServiceErrorCode } from "./requestError";
import CookieUtils from "./cookie";

interface IResponse<T> {
  code: number;
  msg: string;
  data: T
}

const globalConfig: Partial<Taro.request.Option> = {
  timeout: 12 * 1000
};

type RequestOptionsType<P> = {
  urlPrefix?: string;
  method: keyof Taro.request.Method;
  params?: P;
  /** 将请求参数转换成 snack case，将响应数据转换成 camel case */
  useCamelCase?: boolean;
  /** 请求是否携带 Cookie，默认为 true，若没有 Cookie 还请求则会触发登录获取 Cookie */
  auth: boolean;
};

/**
 * 发送接收 application/json 请求
 *
 * @param url 请求地址，不包含协议和域名，会和 `options.urlPrefix` 组成完整的地址
 * @param params GET 请求的 Query 参数，其他请求的 Body 数据
 * @param options
 * @throws `RequestError` Instance
 * @returns 转换成对象的响应 JSON 数据
 */
async function request<TData, TParams = Record<string, any>>(
  url: string,
  options?: RequestOptionsType<TParams>
): Promise<TData> {
  const {
    urlPrefix = process.env.HOST,
    method = "GET",
    params,
    auth = true
  } = options || {};

  let cookie = "";
  if (auth) {
    try {
      cookie = await CookieUtils.get();
    } catch (e) {
      if (e instanceof RequestError) {
        Taro.showToast({ title: e.message, icon: "error" });
      }
    }
  }

  try {
    const taroWrapped = await Taro.request<IResponse<TData> | undefined>({
      ...globalConfig,
      url: urlPrefix + url,
      method,
      header: {
        "Cookie": cookie
      },
      data: params
    });

    const realResponse = taroWrapped.data;
    if (realResponse) {
      if (realResponse.code === ServiceErrorCode.OK) {
        return realResponse.data;
      }

      return Promise.reject(
        new RequestError({ message: realResponse.msg, code: realResponse.code })
      );
    }
    // 如果没有服务端的数据，交给 catch 处理
    throw new Error(JSON.stringify(taroWrapped));
  } catch (e: any) {
    let message: string;
    if (e?.errMsg) {
      // 微信小程序 request 若抛出错误，一定有 errMsg
      message = "小程序客户端请求失败";
      console.error("[微精弘底层]请求发送失败", e);
    } else {
      message = "小程序未知网络错误";
      console.error("[微精弘底层]未知网络异常", e);
    }

    throw new RequestError({ message, code: MPErrorCode.MP_NETWORK_ERROR });
  }
}

export default request;
