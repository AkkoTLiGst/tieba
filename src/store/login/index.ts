import {defineStore} from 'pinia'
import { names } from '../storeName'
import { ref } from 'vue'

export const loginStore = defineStore(names.Login, () => {
    // state
    const isLogin = false; // 是否登陆
    const userInfo = null; // 用户信息

    return {isLogin, userInfo}
});