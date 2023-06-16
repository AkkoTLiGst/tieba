<template>
    <view class="home">
        <postsVue v-for="i in count" :item="1" />
    </view>
</template>

<script setup lang="ts">
import { onPageScroll, onReachBottom, onLoad, onShow } from '@dcloudio/uni-app';
import postsVue from '@/components/posts.vue'
import { ref, provide } from 'vue'

const count = ref<number>(10);
const from = 'home';

provide('from', from)

onReachBottom(() => {
    count.value = count.value + 10;

});

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