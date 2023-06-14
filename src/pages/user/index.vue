<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { onTabItemTap } from '@dcloudio/uni-app';
import { loginStore } from '@/store/login';

const login = loginStore();


onTabItemTap(() => {
    // 没有登陆就跳转到登陆界面
    if(login.isLogin === false){
        uni.navigateTo({
            url:'login/index',
        })
    }
    
});
</script>

<style scoped lang="scss">

</style>