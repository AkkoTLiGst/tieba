<template>
    <view class="userInfo">
        <view class="user">
            <image class="useravatar" :src="`http://localhost:3000/user/${user.userInfo.photoUser}`"></image>
            <view class="username">
                <view class="username-top">
                    <text>{{ user.userInfo.username }}</text>
                    <i class="iconfont" :style="unicodeIcon.sex.color">{{ unicodeIcon.sex.icon }}</i>
                </view>
                <text class="introduction">暂无简介</text>
            </view>
        </view>
        <view class="items" @click="myPosts">
            <view>
                <u-icon name="file-text" color="#63bcff" size="30px"></u-icon>
                <text>我的帖子</text>
            </view>
            <u-icon name="arrow-right" :bold="true"></u-icon>
        </view>
        <view class="items">
            <view>
                <u-icon name="star" color="#fb70a1" size="30px"></u-icon>
                <text>我的收藏</text>
            </view>
            <u-icon name="arrow-right" :bold="true"></u-icon>
        </view>
        <view class="items">
            <view>
                <u-icon name="warning" color="#fac46b" size="30px"></u-icon>
                <text>投诉反馈</text>
            </view>
            <u-icon name="arrow-right" :bold="true"></u-icon>
        </view>
    </view>
</template>



<script setup lang="ts">
import { loginStore } from '@/store/login';
import { reactive } from 'vue';

const user = loginStore();

// 设置三方图标
const unicodeIcon = reactive({
    sex: {
        icon: '\ue601',
        color: 'color: #8150ff'
    }
})

const myPosts = () => {
    user.setUserInfo();
    user.updateTieziID();

    uni.navigateTo({
        url: '/pages/user/myPosts/index'
    });
}


</script>

<style scoped lang="scss">
@import "@/static/font/iconfont.css";

.userInfo {
    width: 100%;
    height: 280px;
    background-color: white;
    padding: 20px 10px 0;
    box-sizing: border-box;
    border-radius: 20rpx;
    box-shadow: 0 0 3px rgba(gray, .1);

    .user {
        display: flex;

        image {
            width: 68px;
            height: 68px;
            border-radius: 50%;
        }

        .username {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 10px;

            i {
                margin-left: 5px;
            }

            .introduction {
                font-size: 10px;
                color: rgba(black, .4);
            }
        }

    }

    .items {
        display: flex;
        justify-content: space-between;
        height: 56px;

        view {
            display: flex;

            text {
                line-height: 56px;
                margin-left: 5px;
            }
        }
    }
}
</style>