<template>
    <view class="hm-recommend">
        <view class="top">
            <image :src="tiebas.url" lazy-load="true" />
            <view>
                <text>{{ tiebas.tiebaName }}吧</text>
                <text>{{ tiezi.time }} </text>
            </view>
        </view>

        <view class="center">
            <text>{{ tiezi.threadTitle }}</text>
            <text>{{ tiezi.content }}</text>
        </view>

        <image v-if="tiezi.url" :src="tiezi.url" mode="widthFix" :style="{ width: img.width + 'px' }" />

        <view class="footer">
            <view>
                <u-icon size="45rpx" name="star"></u-icon>
                <text>收藏</text>
            </view>
            <view>
                <u-icon size="45rpx" name="chat"></u-icon>
                <text>{{ tiezi.commentsNum }}</text>
            </view>
            <view @click="like" v-if="!userIsLike">
                <u-icon size="45rpx" name="thumb-up"></u-icon>
                <text>{{ tiezi.thumbUp }}</text>
            </view>
            <view @click="like" v-if="userIsLike">
                <u-icon size="45rpx" name="thumb-up" :color="'red'"></u-icon>
                <text>{{ tiezi.thumbUp }}</text>
            </view>
        </view>

        <u-popup :show="isShowPop" mode="center" @close="closePopup"
            :overlayStyle="{ backgroundColor: 'rgba(128,128,128, .1)' }">
            <view class="popup">
                <image mode="aspectFit" src="http://localhost:3000/img_popup.png"></image>
                <text>继续操作需要登录贴吧账号</text>
                <text @click="userLoginEvent">立即登录</text>
                <u-button type="primary">打开APP</u-button>
            </view>
        </u-popup>
    </view>
</template>

<script setup lang="ts">
import { tiebaById, tiebaCount } from '@/server/tiebas';
import { randomTieziTB, getTieziById } from '@/server/tiezi';
import { isLike, likePost } from '@/server/login'
import { reactive, inject, ref } from 'vue';
import type { tiezis } from '@/types/types'
import { loginStore } from '@/store/login';
import { onShow } from '@dcloudio/uni-app';

const user = loginStore(); // 用户信息

const from = inject('from'); // 从哪里来

const props = defineProps<{ item: number }>();

const isShowPop = ref(false);

// 用于页面
// 贴吧
const tiebas = reactive({
    tiebaName: '',
    aboutTieba: '',
    subscribeTieba: 0,
    url: '',
    id: 1

});

const userIsLike = ref(false);

// 帖子
const tiezi = reactive({
    id: 0,
    threadTitle: '',
    content: '',
    url: '',
    createTimeTiezi: '',
    time: '',
    star: 0,
    thumbUp: 0,
    commentsNum: 0,
    tieziImg: ''
})

// 图片宽度
const img = reactive({
    width: 0
})

// 从Home来的时候帖子的信息
const fromHome = async () => {
    const count: AnyObject = await tiebaCount() as AnyObject; // 获取贴吧总数
    const id = Math.floor(Math.random() * count.data + 1); // 在1到贴吧总数之间取随机数，用于随机获取贴吧信息

    // 获取贴吧信息
    const getTieba: AnyObject = await tiebaById(id) as AnyObject;
    Object.assign(tiebas, getTieba)
    tiebas.url = `http://localhost:3000/tiebas/${getTieba.photoTieba}`;

    const getTiezi = await randomTieziTB(tiebas.id) as AnyObject;
    Object.assign(tiezi, getTiezi);

    if (user.isLogin) {
        // 判断是否点赞
        const isLikeData = await isLike(user.userInfo.id, tiezi.id) as AnyObject;
        userIsLike.value = isLikeData.isLike;
    }

    return getTiezi;
}

// 从user来的时候帖子的信息
const fromUser = async () => {

    // 获取帖子
    const getTiezi: tiezis = await getTieziById(props.item) as tiezis;
    Object.assign(tiezi, getTiezi);

    // 根据帖子的创建贴吧id返回贴吧信息
    const getTieba: AnyObject = await tiebaById(getTiezi.ctieBaId) as AnyObject;
    Object.assign(tiebas, getTieba)
    tiebas.url = `http://localhost:3000/tiebas/${getTieba.photoTieba}`;

    // 判断是否点赞
    const isLikeData = await isLike(user.userInfo.id, tiezi.id) as AnyObject;
    userIsLike.value = isLikeData.isLike;

    return getTiezi;


}


// 实现点赞
const like = async () => {

    if (user.isLogin) {
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
    } else {
        isShowPop.value = true;
    }
}

// 初始化贴吧信息
const showInfo = async () => {

    let getTiezi: AnyObject = {};

    if (from === 'home') {
        getTiezi = await fromHome();
    } else if (from === 'user') {
        getTiezi = await fromUser();
    }


    // 设置帖子图片
    if (getTiezi.tieziImg) {
        tiezi.url = `http://localhost:3000/tiezi/${getTiezi.tieziImg}`;

        // 获取原图宽度
        uni.getImageInfo({
            src: tiezi.url,
            success: ({ width, height, path, orientation, type }) => {
                // console.log(width, height, path, orientation, type);
                img.width = width;
            },
            fail: (error) => { }
        })
    }


    // 计算帖子发出时间
    const createtime = Math.round(new Date(tiezi.createTimeTiezi).getTime() / 1000); // 发帖时间
    const now = Math.round(new Date().getTime() / 1000);
    let time = Math.round((now - createtime) / 60);

    if (time < 60) {
        tiezi.time = `${time}分钟前`;
    } else if (time >= 60 && time < 1440) {
        time = Math.floor(time / 60);
        tiezi.time = `${time}小时前`;
    } else {
        time = Math.floor(time / 60 / 24);
        tiezi.time = `${time}天前`
    }

}
showInfo();

onShow(() => {

})

// 遮罩层相关
// 关闭遮罩层
const closePopup = () => {
    isShowPop.value = false;
}
// 切换至登录界面
const userLoginEvent = () => {
    uni.navigateTo({
        url: '/pages/user/login/index'
    });
}


</script>

<style scoped lang="scss">
.hm-recommend {
    background-color: white;
    border-radius: 20rpx;
    padding: 20rpx;
    overflow: hidden;
    margin-bottom: 20rpx;

    :deep(.u-popup__content) {
        width: 50%;
        padding: 20px 30px;
        border-radius: 20rpx;
    }

    .popup {
        display: flex;
        align-items: center;
        flex-direction: column;
        font-size: 27rpx;

        text {
            margin-top: 10px;
        }

        text:nth-child(3) {
            font-size: 23rpx;
            color: gray;
            margin-bottom: 10px;
        }

        image {
            width: 300rpx;
            height: 300rpx;
        }

    }

    .top {
        display: flex;
        align-items: center;

        image {
            width: 64rpx;
            height: 64rpx;
            border-radius: 20rpx;
            margin-right: 5rpx;
        }

        view {
            display: flex;
            flex-direction: column;
            justify-content: center;

            text:first-child {
                font-size: 30rpx;
            }

            text:last-child {
                font-size: 20rpx;
                color: rgba($color: #000000, $alpha: .4);
            }
        }
    }

    .center {
        margin: 5rpx 0;

        text {
            display: flex;
        }

        text:first-child {
            font-size: 30rpx;
            font-weight: bold;
        }

        text:last-child {
            font-size: 27rpx;
        }
    }

    image {
        border-radius: 20rpx;
        max-width: 89vw;
    }

    .footer {
        display: flex;
        justify-content: space-evenly;
        font-size: 26rpx;
        margin-top: 10px;

        view {
            display: flex;
            align-items: center;

            text {
                margin-left: 2rpx;
            }
        }
    }
}
</style>