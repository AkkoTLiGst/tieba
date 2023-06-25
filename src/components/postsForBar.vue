<!-- 显示用户头像的帖子 -->
<template>
    <view class="postsForBar">
        <view class="top">
            <image :src="creater.url" mode="scaleToFill" />
            <view class="user">
                <text>{{ creater.userName }}</text>
                <text>{{ tiezi.createTimeTiezi }}</text>
            </view>
        </view>

        <view class="center" @click="detailPage">
            <text> {{ tiezi.threadTitle }} </text>
            <text>{{ tiezi.content }}</text>
        </view>

        <image @click="detailPage" v-if="tiezi.url" :src="tiezi.url" mode="widthFix" />

        <view class="footer">
            <view @click="collection">
                <u-icon size="24px" name="star"></u-icon>
                <text>收藏</text>
            </view>
            <view @click="detailPage">
                <u-icon size="24px" name="chat"></u-icon>
                <text>{{ tiezi.commentsNum }}</text>
            </view>
            <view @click="like" v-if="!userIsLike">
                <u-icon size="24px" name="thumb-up"></u-icon>
                <text>{{ tiezi.thumbUp }}</text>
            </view>
            <view @click="like" v-if="userIsLike">
                <u-icon size="24px" name="thumb-up" :color="'red'"></u-icon>
                <text>{{ tiezi.thumbUp }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getUserById } from '@/server/user';
import type { tiezis, Creater, toDetailPage } from '@/types/types';
import { reactive, ref } from 'vue';
import { mathTime, newUrl } from '@/hooks/index'
import { loginStore } from '@/store/login';
import { isLike, likePost } from '@/server/login';
import { getTieziById } from '@/server/tiezi';

// 用户信息
const user = loginStore();

const item = defineProps<{ item: tiezis }>(); // 从父组件获取item
// 帖子信息
const tiezi: toDetailPage = reactive({
    id: 0,
    threadTitle: '',
    content: '',
    createTimeTiezi: '',
    star: 0,
    thumbUp: 0,
    commentsNum: 0,
    tieziImg: '',
    createrId: 0,
    ctieBaId: 0,
    tiebaName: '', // 对应贴吧名
    tiebaImg: '', // 贴吧头像
    url: '' // 图片
});

// 发帖人信息
const creater: Creater = reactive({
    id: 0,
    photoUser: '',
    userName: '',
    url: ''
});
// 获取发帖人信息
const getCreater = async () => {
    const data = await getUserById(tiezi.createrId);
    Object.assign(creater, data);
    creater.url = newUrl(creater.photoUser, 'user'); // 用户头像
}

// 进入帖子详情页
const detailPage = () => {
    const data = {
        id: tiezi.id,
        tiebaName: tiezi.tiebaName,
        tiebaImg: tiezi.tiebaImg,
        createTime: tiezi.createTimeTiezi
    }
    
    uni.navigateTo({
        url: '/components/detailPostPage?data=' + encodeURIComponent(JSON.stringify(data))
    })
}


// 是否点赞
const userIsLike = ref<boolean>(false);
// 实现点赞
const like = async () => {
    if (userIsLike.value === false) {
        const a = await likePost(user.userInfo.id, tiezi.id, 'like');

        const getTiezi: tiezis = await getTieziById(tiezi.id) as tiezis;
        Object.assign(tiezi, getTiezi);
        userIsLike.value = true;
    } else {
        const a = await likePost(user.userInfo.id, tiezi.id, 'unlike');

        const getTiezi: tiezis = await getTieziById(tiezi.id) as tiezis;
        Object.assign(tiezi, getTiezi);
        userIsLike.value = false;
    }

}

// 实现收藏
const collection = () => {

}

const initPost = async () => {
    // 将父组件传入的帖子信息赋给 tiezi
    Object.assign(tiezi, item.item);

    // 计算发帖时间
    tiezi.createTimeTiezi = mathTime(tiezi.createTimeTiezi);

    // 获取发帖人信息
    getCreater();

    // 判断是否点赞
    const isLikeData = await isLike(user.userInfo.id, tiezi.id) as AnyObject;
    userIsLike.value = isLikeData.isLike;

}
initPost();
</script>

<style scoped lang="scss">
.postsForBar {
    background-color: white;
    border-radius: 20rpx;
    padding: 10px;
    overflow: hidden;
    margin-bottom: 10px;

    .top {
        display: flex;
        align-items: center;

        image {
            width: 35px;
            height: 35px;
            border-radius: 35px;
            margin-right: 5px;
        }

        view {
            display: flex;
            flex-direction: column;
            justify-content: center;

            text:first-child {
                font-size: 17px;
            }

            text:last-child {
                font-size: 12px;
                color: rgba($color: #000000, $alpha: .4);
            }
        }
    }

    .center {
        margin: 5px 0;

        text {
            display: flex;
        }

        text:first-child {
            font-size: 16px;
            font-weight: bold;
        }

        text:last-child {
            margin-top: 5px;
            font-size: 14px;
        }
    }

    image {
        border-radius: 20rpx;
        max-width: 89vw;
    }

    .footer {
        display: flex;
        justify-content: space-evenly;
        font-size: 13px;
        margin-top: 10px;

        view {
            display: flex;
            align-items: center;

            text {
                margin-left: 2px;
            }
        }
    }
}
</style>