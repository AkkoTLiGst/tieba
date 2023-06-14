import { defineStore } from 'pinia'
import { names } from '../storeName'
import { ref } from 'vue'

export const loginStore = defineStore(names.Login, () => {
    // 开启数据持久化
    persist: true;

    // state
    const isLogin = false; // 是否登陆
    const userInfo = {}; // 用户信息

    return { isLogin, userInfo }
});