"use strict";

import axios from "axios";
import qs from "qs";
import axiosConfig from "../config/axiosConfig";

// axios.defaults 默认值设置

axios.defaults.timeout = 120000; //响应时间
// axios.defaults.timeout = 60000; //响应时间


//配置请求头
axios.defaults.headers.get["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

// axios.defaults.baseURL = 'http://iacloud.ceway.com.cn/gatewaytest/'; //网关配置接口地址 测试环境

//  axios.defaults.baseURL = 'http://imcloud.ceway.com.cn:8080/gateway/'; //网关配置接口地址 IM的测试环境

//  axios.defaults.baseURL = 'http://119.23.105.72/gateway/'; //网关配置接口地址 样板工厂环境 Trace和测试环境一样就好
 

//  axios.defaults.baseURL = 'http://116.236.109.226:9001/gateway/'; //网关配置接口地址 铠胜环境

axios.defaults.baseURL = 'https://traceapp.casetekcorp.com:9001/gateway/'; //网关配置接口地址   铠胜新环境

// axios.defaults.baseURL = 'http://192.168.16.139:9001'; //杨乐服务器   开发环境


  // axios.defaults.baseURL = 'http://172.16.4.29:9001'; //陈念中服务器   开发环境

// axios.defaults.baseURL = 'http://172.16.3.6:9001'; //柳腾服务器   开发环境

// axios.defaults.baseURL = 'http://172.16.4.29:9001'; //柳腾服务器   开发环境

// axios.defaults.baseURL = 'http://iacloud.ceway.com.cn/gateway/'; //网关配置接口地址  产品环境

// axios.defaults.baseURL = 'http://119.23.105.72/gateway'; //imcloud EP demo环境

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  config => {
    if (config.data instanceof FormData) {
      // 如果是FormData类型，表示为上传图片
      return config;
    }
    if (config.headers.UseFormData == false) {
      return config;
    }
    var dataParams = {
      encData: "", // 加密后的参数
      encKey: "" // 加密的Key
    };
    // 对请求参数进行统一处理
    if (config.data) {
      (dataParams.encData = JSON.stringify(config.data)),
        (dataParams.encKey = ""),
        (config.data = dataParams);
    }
    //处理不同的请求类型
    if (config.method === "post") {
      config.headers["Content-Type"] =
        "application/x-www-form-urlencoded;charset=UTF-8";
      config.data = qs.stringify(config.data);
    }
    if (config.method === "get") {
      config.headers["Content-Type"] =
        "application/x-www-form-urlencoded;charset=UTF-8";
      if (config.data) {
        config.url += "?" + qs.stringify(config.data);
      }
    }
    return config;
  },
  error => {
    // _.toast("错误的传参", 'fail');
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);


function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (
    response &&
    (response.status === 200 ||
      response.status === 304 ||
      response.status === 400)
  ) {
    return response.data;
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    code: -404,
    msg: "系统异常，请稍后再试",
    data: null
  };
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === 500) {
    alert(res.msg);
  }
  if (res.data && !res.data.success) {
    alert(res.data.error_msg);
  }
  return res;
}

export default {
  //返回一个Promise(发送post请求)
  axiosPost(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, axiosConfig)
        .then(
          response => {
            resolve(checkStatus(response));
          },
          err => {
            reject(checkCode(err));
          }
        )
        .catch(error => {
          reject(checkCode(error));
        });
    });
  },

  //返回一个Promise(发送get请求)
  axiosGet(url, params) {
    return new Promise((resolve, reject) => {
      axiosConfig.data = params;
      axios
        .get(url, axiosConfig)
        .then(
          response => {
            resolve(response.data);
          },
          err => {
            reject(err);
          }
        )
        .catch(error => {
          reject(error);
        });
    });
  },
  //返回一个Promise(发送上传文件请求)
  axiosUpload(url, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: url,
        data: params,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then(
          response => {
            resolve(checkStatus(response));
          },
          err => {
            reject(checkCode(err));
          }
        )
        .catch(error => {
          reject(checkCode(error));
        });
    });
  }
};
