<template>
  <view class="userInfo">
    <view class="user">

      <image lazy-load="true" @click="toDetailUserPage" class="useravatar" :src="`${user.userInfo.photoUser}`"></image>
      <view class="username" @click="toDetailUserPage">
        <view class="username-top">
          <text>{{ user.userInfo.userName }}</text>
          <i class="iconfont" :style="unicodeIcon.sex.color">{{ unicodeIcon.sex.icon }}</i>
        </view>
        <text class="introduction">{{ user.userInfo.aboutMe }}</text>
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
import {loginStore} from '@/store/login';
import {reactive} from 'vue';

const user = loginStore();

// 设置三方图标
const unicodeIcon = reactive({
  sex: {
    icon: '\ue601',
    color: 'color: #8150ff'
  }
})

const myPosts = async () => {
  await user.setUserInfo();
  await user.updateTieziID();

  await uni.navigateTo({
    url: '/pages/user/myPosts/index'
  });
}

// 跳转到用户界面
const toDetailUserPage = () => {
  uni.navigateTo({
    url: '/components/detailUserPage?userId=' + user.userInfo.id,
  })
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