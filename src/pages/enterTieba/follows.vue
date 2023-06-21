<template>
    <view class="follows">
        <view class="top">
            <text>关注的吧</text>
            <text>等级排序</text>
        </view>

        
        <view v-if="followArr.length === 0" class="nofollows">您没有关注的吧</view> 
        <view class="content" v-if="followArr.length !== 0">
            <view  class="contentItem" v-for="item in num" :index="item" style="height: 50px;">
                <image :src="`http://localhost:3000/tiebas/${followArr[item - 1].photoName}`" mode="scaleToFill" />
                <view>{{ followArr[item - 1].name }}吧</view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { loginStore } from '@/store/login';
import { followTieba } from '@/server/login'
import { reactive, ref } from 'vue'
import { onReachBottom, onShow } from '@dcloudio/uni-app';

// 用于智能提示
type objArr = {
    name: string;
    photoName: string
}

const user = loginStore();

const followArr = reactive<objArr[]>([]); // 贴吧数组

const num = ref(0); // 控制显示个数

const initFollows = async () => {
    const data = await followTieba(user.userInfo.id) as objArr[];
    followArr.push(...data);

    if (followArr.length > 16) {
        num.value = 16;
    } else {
        num.value = followArr.length;
    }

}
initFollows()

onReachBottom(() => {
    if (num.value + 16 < followArr.length) {
        num.value = num.value + 16;
    } else {
        num.value = followArr.length;
    }
});
</script>

<style scoped lang="scss">
.follows {
    padding: 0 10px;

    .top {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        margin-bottom: 20px;

        text:first-child {
            font-size: 18px;
        }
    }
    .nofollows{text-align: center; width: 100%;}
    .content {
        background-color: white;
        border-radius: 20rpx;
        display: grid;
        grid-template-columns: 50% 50%;
        padding: 16px 0;

        .contentItem {
            display: flex;
            align-items: center;
            padding: 12px 0 12px 16px;

            view {
                width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            image {
                width: 48px;
                height: 48px;
                border-radius: 20rpx;
                margin-right: 5px;
            }

        }

       
    }
}
</style>