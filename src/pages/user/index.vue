<template>
    <view>
        <userInterface v-if="login.isLogin"/>
    </view>
</template>

<script setup lang="ts">
import { onTabItemTap } from '@dcloudio/uni-app';
import { loginStore } from '@/store/login';
import userInterface from '@/pages/user/userInterface/index.vue'
import { getUser } from '@/server/login';

const login = loginStore();



const getData = async () => {
    const data =  await getUser();
    console.log(data);
    
    return data
}

// 如果能获得到loginKey，就代表已经登陆了
if (uni.getStorageSync('loginKey')) {
    login.isLogin = true; // 状态改为已登录
    const data = getData();
}else{
    login.isLogin = false;
}

onTabItemTap(() => {
    // 没有登陆就跳转到登陆界面
    if (login.isLogin === false) {
        uni.navigateTo({
            url: 'login/index',
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