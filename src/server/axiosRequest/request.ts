import axios from 'axios';
import errorCode from "@/server/axiosRequest/errorCode";
import type {InternalAxiosRequestConfig} from "axios";
import ENV_CONFIG from '@/config/env'; // 判断是什么环境

// 设置请求体是JSON格式
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// 创建axios实例
const request = axios.create({
    // 配置默认匹配
    baseURL: ENV_CONFIG.BASE_API,
    timeout: 5000
});

// 请求拦截器
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // 判断是否需要token
    const isToken = (config.headers || {}).isToken === false;
    if (isToken) {
        // 如果需要token就获取token，并再请求头携带token
        const token: string | null = uni.getStorageSync('loginKey');
        if (token) {
            config.headers['Authorization'] = 'Bearer' + token;
        }
    }
    return config
}, error => {
    console.log(error)
});

// 响应拦截器
request.interceptors.response.use(res => {
        // 未设置状态码就默认成功状态
        // 使用关键字 keyof 可以映射对象的所有键名（string或number）作为一个联合类型
        const code: keyof typeof errorCode = res.data.code || 200;
        // 设置错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default'];

        if (code === 401) {
            return Promise.reject(msg);
        } else if (code === 500) {
            uni.showToast({
                title: msg,
                duration: 2000
            }).then(r => r);

            return Promise.reject(new Error(msg));
        } else if (code !== 200) {
            uni.showToast({
                title: msg,
                duration: 2000
            }).then(r => r);

            return Promise.reject('error')
        } else {
            return res.data;
        }
    },
    error => {
        // 设置报错信息
        let {message} = error;
        if (message === 'Network Error') {
            message = ' 后端接口连接异常';
        } else if (message.includes('timeout')) {
            message = '系统接口请求超时'
        } else if (message.includes('Request failed with status code')) {
            message = '系统接口' + message.substr(message.length - 3) + '异常'
        }

        // 将报错信息反馈给用户
        uni.showModal({
            title: '提示',
            content: message
        }).then(r => r);

        return Promise.reject(error);
    }
);

export default request;

