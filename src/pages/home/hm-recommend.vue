<template>
    <view class="hm-recommend">
        <view class="top">
            <image :src="tiebas.url" lazy-load="true" />
            <view>
                <text>{{ tiebas.tiebaName }}吧</text>
                <text>xx小时前 </text>
            </view>
        </view>

        <view class="center">
            <text>{{ tiezi.threadTitle }}</text>
            <text>{{ tiezi.content }}</text>
        </view>

        <image v-if="tiezi.url" :src="tiezi.url" mode="widthFix"  :style="{ width:img.width + 'px'}"/>

        <view class="footer">
            <view>
                <u-icon size="40rpx" name="star"></u-icon>
                <text>收藏</text>
            </view>
            <view>
                <u-icon size="40rpx" name="chat"></u-icon>
                <text>{{ tiezi.commentsNum }}</text>
            </view>
            <view>
                <u-icon size="40rpx" name="thumb-up"></u-icon>
                <text>{{ tiezi.thumbUp }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { tiebaById, tiebaCount } from '@/server/tiebas';
import { randomTieziTB } from '@/server/tiezi';
import { reactive } from 'vue'

// 用于页面
// 贴吧
const tiebas = reactive({
    tiebaName: '',
    aboutTieba: '',
    subscribeTieba: 0,
    url: '',
    id: 1

});

// 帖子
const tiezi = reactive({
    threadTitle: '',
    content: '',
    url: '',
    createTimeTiezi: '',
    time: '',
    star: 0,
    thumbUp: 0,
    commentsNum: 0
})

// 图片宽度
const img = reactive({
    width: 0
})

// 初始化贴吧信息
const showInfo = async () => {

    const count: AnyObject = await tiebaCount() as AnyObject; // 获取贴吧总数
    const id = Math.floor(Math.random() * count.data + 1); // 在1到贴吧总数之间取随机数，用于随机获取贴吧信息

    // 获取贴吧信息
    const getTieba: AnyObject = await tiebaById(id) as AnyObject;
    // console.log(getTieba);
    Object.assign(tiebas, getTieba.data)
    tiebas.url = getTieba.url;


    const getTiezi: AnyObject = await randomTieziTB(tiebas.id) as AnyObject;
    // console.log(getTiezi);
    Object.assign(tiezi, getTiezi.data);
    tiezi.url = getTiezi.url;
    // console.log(tiezi);


    // 获取原图宽度
    if (tiezi.url) {
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
    const time = Math.round((now - createtime) / 60);

    if (time < 60) {
        tiezi.time = `${time}分钟前`;
    } else {

    }

}
showInfo();
</script>

<style scoped lang="scss">
.hm-recommend {
    background-color: white;
    border-radius: 20rpx;
    padding: 20rpx;
    overflow: hidden;
    margin-bottom: 20rpx;

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
        font-size: 25rpx;

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