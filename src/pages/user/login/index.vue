<template>
    <view class="login">
        <view class="lg-img"></view>

        <view class="lg-bar" :style="{ height: statusBarHeight + 'px' }" @click="rollBack">
            <u-icon name="arrow-left" size="20" color="white"></u-icon>
        </view>

        <view class="lg-content">
            <login />
        </view>

        <view class="lg-bottom"></view>
    </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import login from './login.vue';
import { ref } from 'vue'

const statusBarHeight = ref(0);
let from = '';

onLoad((e) => {
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight as number || 44;
    from = e!.name;
});

const rollBack = () => {
    if (from === 'user') {
        uni.switchTab({
            url: '/pages/home/index'
        })
    }else{
        uni.navigateBack({
            delta: 1,
        })
    }
}

</script>

<style scoped lang="scss">
page {
    height: 100%;
    background-color: #f7f7fa;
}

.login {
    height: 100%;
    background-color: #f5f5f5;

    .lg-bar {
        display: flex;
        padding: 10px;
    }

    .lg-img {
        width: 100vw;
        height: 380rpx;
        background-image: linear-gradient(to top, #FFFFFF, transparent 50%), url("@/static/header-bg.png");
        background-repeat: no-repeat;
        background-size: cover;
        position: absolute;

    }

    .lg-content {
        position: relative;
        padding: 10px;
    }
}
</style>