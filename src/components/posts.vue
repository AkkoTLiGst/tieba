<!-- 显示顶部是贴吧头像的帖子 -->
<template>
    <view class="hm-recommend">
        <view class="top">
            <image :src="tiebas.url" lazy-load="true" @click="detailPostBar" />
            <view @click="detailPostBar">
                <text>{{ tiebas.tiebaName }}吧</text>
                <text>{{ tiezi.time }} </text>
            </view>
        </view>

        <view class="center" @click="detailPage">
            <text>{{ tiezi.threadTitle }}</text>
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

        <u-popup :show="isShowPop" mode="center" :custom-style="{maxWidth: '300px'}" @close="closePopup"
            :overlayStyle="{ backgroundColor: 'rgba(128,128,128, .1)' }">
            <view class="popup">
                <image mode="aspectFit" :src="`${ENV_CONFIG.BASE_API}/img_popup.png`"></image>
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
import { reactive, inject, ref, provide } from 'vue';
import type { tiezis, toDetailPage } from '@/types/types'
import { loginStore } from '@/store/login';
import { onShow } from '@dcloudio/uni-app';
import { mathTime } from '@/hooks';
import ENV_CONFIG from '@/config/env';
import ENV_VAR from '@/config/env';

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
    tieziImg: '',
    createrId: 0
})


// 从Home来的时候帖子的信息
const fromHome = async () => {
    const count: AnyObject = await tiebaCount() as AnyObject; // 获取贴吧总数
    const id = Math.floor(Math.random() * count.data + 1); // 在1到贴吧总数之间取随机数，用于随机获取贴吧信息

    // 获取贴吧信息
    const getTieba: AnyObject = await tiebaById(id) as AnyObject;
    Object.assign(tiebas, getTieba)
    tiebas.url = `${ENV_VAR.BASE_API}/tiebas/${getTieba.photoTieba}`;


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
    tiebas.url = `${ENV_VAR.BASE_API}/tiebas/${getTieba.photoTieba}`;

    // 判断是否点赞
    const isLikeData = await isLike(user.userInfo.id, tiezi.id) as AnyObject;
    userIsLike.value = isLikeData.isLike;

    return getTiezi;


}

// 显示pop
const pop = (func: Function) => {
    if (user.isLogin) {
        func();
    } else {
        isShowPop.value = true;
    }
}

// 实现点赞
const like = () => {
    pop(async () => {
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
    })

}

// 实现进入帖子详情页 
const detailPage = () => {
    const data = {
        id: tiezi.id,
        tiebaName: tiebas.tiebaName,
        tiebaImg: tiebas.url,
        createTime: tiezi.time
    }

    pop(() => {
        uni.navigateTo({
            url: '/components/detailPostPage?data=' + encodeURIComponent(JSON.stringify(data))
        })
    });
}

// 实现进入贴吧详情页
const detailPostBar = () => {
    pop(() => {
        uni.navigateTo({
            url: '/components/detailPostBar?data=' + tiebas.id,
        })
    })
}

// 实现收藏
const collection = () => {
    pop(() => {
        console.log(2);

    });
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
        tiezi.url = `${ENV_VAR.BASE_API}/tiezi/${getTiezi.tieziImg}`;
    }


    // 计算帖子发出时间
    tiezi.time = mathTime(tiezi.createTimeTiezi);
}
showInfo();

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

onShow(() => {
    // 用于回退的时候刷新信息
    const refresh = async () => {
        if (tiezi.id !== 0) {
            const getTiezi: tiezis = await getTieziById(tiezi.id) as tiezis;
            Object.assign(tiezi, getTiezi);

            if (user.isLogin) {
                const isLikeData = await isLike(user.userInfo.id, tiezi.id) as AnyObject;
                userIsLike.value = isLikeData.isLike;
            }
        }
    }
    refresh();
})

</script>

<style scoped lang="scss">
.hm-recommend {
    background-color: white;
    border-radius: 20rpx;
    padding: 10px;
    overflow: hidden;
    margin-bottom: 10px;

    :deep(.u-popup__content) {
        width: 50%;
        padding: 20px 30px;
        border-radius: 20rpx;
    }

    .popup {
        display: flex;
        align-items: center;
        flex-direction: column;
        font-size: 16px;

        text {
            margin-top: 10px;
        }

        text:nth-child(3) {
            font-size: 14px;
            color: gray;
            margin-bottom: 10px;
        }

        image {
            width: 200px;
            height: 200px;
        }

    }

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