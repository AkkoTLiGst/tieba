import { defineStore } from 'pinia'
import { names } from '../storeName'
import { reactive, ref } from 'vue'
import type { loginTypes } from '@/types/types';
import { getTokenTiezi, getUser } from '@/server/login';

export const loginStore = defineStore(
    names.Login,
    () => {
        id: 'login'
        // state
        const isLogin = ref(false); // 是否登陆

        // 用户信息
        const userInfo: loginTypes = reactive({
            username: '',
            id: 0,
            userId: '',
            photoUser: '',
            email: '',
            tiezisID: []
        }); // 用户信息

        // 更改登录状态
        function setIsLogin(bool: boolean) {
            isLogin.value = bool;
        }

        function clearUser() {
            Object.assign(userInfo, {
                username: '',
                id: 0,
                userId: '',
                photoUser: '',
                email: '',
                tiezisID: []
            });
            isLogin.value = false;
        }

        // 保存用户信息
        async function setUserInfo() {
            const data: loginTypes = await getUser() as loginTypes;
            Object.assign(userInfo, data);
        }


        // 获取用户的所有帖子的ID
        async function updateTieziID() {
            const arr: number[] = await getTokenTiezi() as number[];
            userInfo.tiezisID = arr.reverse(); // reverse倒序输出数组
        }

        return { isLogin, userInfo, setIsLogin, setUserInfo, clearUser, updateTieziID }
    },
    {
        unistorage: true // 持久化
    }
);