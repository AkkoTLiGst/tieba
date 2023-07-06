import { defineStore } from 'pinia'
import { names } from '../storeName'
import { reactive, ref } from 'vue'
import type { User } from '@/types/types';
// import { getTokenTiezi, getUser } from '@/server/uniRequest/login';
import {getTokenTiezi, getUser} from "@/server/axiosRequest/login";
import ENV_VAR from '@/config/env';

export const loginStore = defineStore(
    names.Login,
    () => {
        // state
        const isLogin = ref(false); // 是否登陆

        // 用户信息
        const userInfo: User = reactive({
            userName: '',
            id: 0,
            userId: '',
            photoUser: '',
            email: '',
            aboutMe: '',
            tiezisID: []
        }); // 用户信息

        // 更改登录状态
        function setIsLogin(bool: boolean) {
            isLogin.value = bool;
        }

        function clearUser() {
            Object.assign(userInfo, {
                userName: '',
                id: 0,
                userId: '',
                photoUser: '',
                email: '',
                aboutMe: '',
                tiezisID: []
            });
            isLogin.value = false;
        }

        // 保存用户信息
        async function setUserInfo() {
            const data = await getUser() as AnyObject;

            data.photoUser = ENV_VAR.BASE_API + '/user/' + data.photoUser;
            Object.assign(userInfo, data);
        }

        // 更新用户信息
        function updateUserInfo(user: User) {
            Object.assign(userInfo, user);
            userInfo.photoUser = ENV_VAR.BASE_API + '/user/' + userInfo.photoUser;
        }


        // 获取用户的所有帖子的ID
        async function updateTieziID() {
            const arr: number[] = await getTokenTiezi() as any;
            userInfo.tiezisID = arr.reverse(); // reverse倒序输出数组
        }

        return { isLogin, userInfo, setIsLogin, updateUserInfo, setUserInfo, clearUser, updateTieziID }
    },
    {
        unistorage: true // 持久化
    }
);