<template>
    <view class="home">
        <hm-recommend v-for="i in count"></hm-recommend>
    </view>
</template>

<script setup lang="ts">
import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
import hmRecommend from './hm-recommend.vue';
import { ref } from 'vue'

const count = ref<number>(10);

onReachBottom(() => {
    count.value = count.value + 10;
    
});

const init = async () => {
}
init();
</script>

<style scoped lang="scss">
page {
    height: 100%;
    padding: 20rpx;
    background-color: #f7f7fa;
}

.home {
    padding-bottom: 100rpx;
    .scroll {
        height: 700px;
    }
}
</style>