<template>
    <view>
        <userInterface v-if="login.isLogin"/>
    </view>
</template>

<script setup lang="ts">
import {  onShow } from '@dcloudio/uni-app';
import { loginStore } from '@/store/login';
import userInterface from '@/pages/user/userInterface/index.vue'

const login = loginStore();


// 如果能获得到loginKey，就代表已经登陆了
if (uni.getStorageSync('loginKey')) {
    login.setIsLogin(true); // 状态改为已登录
}else{
    login.setIsLogin(false);
}

onShow(() => {
    // 没有登陆就跳转到登陆界面
    if (login.isLogin === false) {
        uni.navigateTo({
            url: 'login/index?name=user',
        })
    }

});
</script>

<style scoped lang="scss">
page{
    
    height: 100%;
    padding: 20rpx;
    background-color: #f7f7fa;
}
</style>