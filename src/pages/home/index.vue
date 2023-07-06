<template>
    <view class="home">
        <u-loading-page :loading="isShowLoading" style="z-index: 999; transition-duration: 0ms;"/>
        <postsVue v-for="i in count" :item="1" />
    </view>
</template>

<script setup lang="ts">
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import postsVue from '@/components/posts.vue'
import {ref, provide, watch} from 'vue'

// 用于判断首页数据是否加载完成
const num = ref(0);
provide('num', num);
const isShowLoading = ref(true);
const count = ref<number>(10); // 用于首页显示多少帖子

const from = 'home'; // 用于给post判断从哪里来的
provide('from', from);

// 监听计数器和帖子总数
watch([num, count], (newVal) => {
  // 如果计数器和帖子总数相等，就不显示加载页，如果不想的就显示加载页
  if(newVal[0] === newVal[1]){
    isShowLoading.value = false;
  }else {isShowLoading.value = true;}
})


// 触底增加帖子数量
onReachBottom(() => {
    count.value = count.value + 10;
});

onPullDownRefresh(() => {
    uni.reLaunch({
        url: '/pages/home/index',
        success: (success) => {
            uni.stopPullDownRefresh();
        },
    })
})

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