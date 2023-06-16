<template>
    <view class="mypostsIndex">
        <postsVue v-for="(item, index) in list" :index="index" :item="item" />
        <u-alert class="alert" :title="'您没帖子'" v-if="!tieziidLength" :center="true" type="primary"></u-alert>
    </view>
</template>

<script setup lang="ts">
import { loginStore } from '@/store/login';
import postsVue from '@/components/posts.vue'
import { onReachBottom } from '@dcloudio/uni-app';
import { provide, ref, reactive } from 'vue'

const from = 'user';
provide('from', from);


const user = loginStore();
const tieziidLength = user.userInfo.tiezisID.length; // 帖子总数量

const list = reactive<number[]>([]); // 用于从tiezisID中取出一部分显示在页面

// 帖子数量小于10的时候列出所有帖子，帖子数量大于10的时候列出前十个
if (tieziidLength <= 10) {
    for (let i = 0; i < tieziidLength; i++) {
        list.push(user.userInfo.tiezisID[i])
    }
} else {
    for (let i = 0; i < 10; i++) {
        list.push(user.userInfo.tiezisID[i])
    }
}

onReachBottom(() => {
    // 每次下拉多显示10个帖子
    const count = list.length;
    if (list.length + 10 > tieziidLength) {
        for (let i = count; i < tieziidLength; i++) {
            list.push(user.userInfo.tiezisID[i])
        }
        return;
    }

    if (list.length + 10 < tieziidLength) {
        for (let i = count; i < list.length + 10; i++) {
            list.push(user.userInfo.tiezisID[i]);
        }
        return;
    }
});

</script>

<style scoped lang="scss">
page {
    background-color: #f8f8f8;
}

.mypostsIndex {
    padding: 0 10px;    

    .alert{
        margin-top: 60px;
    }
}
</style>