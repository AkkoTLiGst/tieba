import { defineStore } from 'pinia'
import { names } from '../storeName'
import { reactive, ref } from 'vue'
import type { loginTypes } from '@/types/types';
import { getUser } from '@/server/login';

export const loginStore = defineStore(
    names.Login,
    () => {
        id: 'login'
        // state
        const isLogin = ref(false); // 是否登陆
        const userInfo: loginTypes = reactive({
            username: '',
            userId: '',
            photoUser: '',
            email: ''
        }); // 用户信息

        // 更改登录状态
        function setIsLogin(bool: boolean) {
            isLogin.value = bool;
        }

        function clearUser() {
            Object.assign(userInfo, {
                username: '',
                userId: '',
                photoUser: '',
                email: ''
            });
            isLogin.value = false;
        }

        // 保存用户信息
        async function setUserInfo() {
            const data: loginTypes = await getUser() as loginTypes;
            Object.assign(userInfo, data);
        }

        return { isLogin, userInfo, setIsLogin, setUserInfo, clearUser }
    },
    {
        unistorage: true // 持久化
    }
);