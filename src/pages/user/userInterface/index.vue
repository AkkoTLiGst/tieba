<template>
    <view class='userInterface'>
        <userInfo />
        <u-button @click="logOut" :hairline="false" class="btnStyle" :custom-style="btnStyle">退出登录</u-button>
    </view>
</template>

<script setup lang="ts">
import userInfo from './userInfo.vue';
import { loginStore } from '@/store/login';

const user = loginStore();

// 退出登录按钮样式
const btnStyle = {
    borderRadius: '20rpx',
    marginTop: '20px',
    height: '56px',
    fontSize: '17px'
}

const logOut = () => {
    uni.setStorageSync('loginKey', '');
    user.clearUser();
    uni.reLaunch({
        url: '/pages/home/index'
    });
}

</script>

<style scoped lang="scss">
.userInterface {
    margin: 0 auto;

    .btnStyle {

        box-shadow: 0 0 3px rgba(gray, .1);
    }
}
</style>