<template>
    <view class="recommended">
        <view class="top">
            <text>可能感兴趣的吧</text>
            <view @click="randomTieba">
                <u-icon name="reload"></u-icon>
                <text>换一换</text>
            </view>
        </view>
        <view class="content">
            <view class="ba" v-for="(item, index) in arr" :index="index">
                <view>
                    <image :src="`http://localhost:3000/tiebas/${item.photoTieba}`" />
                    <text>{{ item.tiebaName }}吧</text>
                </view>

                <button @click="join">加入</button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { tiebaById, tiebaCount } from '@/server/tiebas';
import { reactive } from 'vue';

const arr = reactive<AnyObject[]>([]);

// 随机获取三个贴吧
const randomTieba = async () => {
    arr.length = 0; // 清空数组

    const count = await tiebaCount() as AnyObject;
    // 随机获得三个贴吧数据
    for (arr.length; arr.length < 3;) {
        const random = Math.floor(Math.random() * count.data + 1);

        const tieba = await tiebaById(random) as AnyObject;
        tieba.random = random;

        if (arr.findIndex(x => x.random === random) === -1) {
            arr.push(tieba)
        }
    }
}

// 点击加入跳转登录界面
const join = () => {
    uni.navigateTo({
        url:'/pages/user/login/index',
    })
}

randomTieba();


</script>

<style scoped lang="scss">
.recommended {
    padding: 0 10px;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        margin-bottom: 10px;
        font-size: 17px;
        height: 41px;

        view {
            display: flex;
            font-size: 13px;
        }
    }

    .content {
        background-color: white;
        height: 248px;
        padding: 16px;
        border-radius: 20rpx;
        box-shadow: 0 0 1px rgba(gray, $alpha: .1);
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .ba {
            display: flex;
            height: 72px;
            box-sizing: border-box;
            padding: 12px 0;
            justify-content: space-between;
            align-items: center;

            view {
                display: flex;
                font-size: 16px;
                align-items: center;

                image {
                    width: 48px;
                    height: 48px;
                    border-radius: 20rpx;
                    margin-right: 10px;
                }
            }

            button {
                margin: 0;
                width: 56;
                height: 29px;
                border-radius: 30rpx;
                background-color: #f2edff;
                color: #413dff;
                font-size: 14px;
                line-height: 29px;
                border: none;
            }
        }
    }
}
</style>