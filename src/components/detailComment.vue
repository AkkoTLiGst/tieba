<template>
    <view class="detailComment">
        <view class="creater" @click="toDetailUserPage">
            <view>
                <image lazy-load="true" :src="data.user.photoUser" mode="scaleToFill" />

                <view class="name">
                    <view class="name-top">
                        <text>
                            {{ data.user.userName }}
                        </text>
                        <view v-show="isCreater">
                            楼主
                        </view>
                    </view>
                    <view class="name-bottom">
                        <text>第{{ data.floor }}楼</text>
                        <text>{{ data.createTimeTiezi }}</text>
                    </view>
                </view>

            </view>
            <view class="trumbUp">
                <u-icon size="24px" name="thumb-up"></u-icon>
                <text>{{ 0 }}</text>
            </view>
        </view>
        <view class="content">
            <text>{{ data.comment }}</text>
            <image lazy-load="true"  v-if="data.tieziImg" :src="data.tieziImg" mode="widthFix" />
        </view>
    </view>
</template>

<script setup lang="ts">
import ENV_VAR from '@/config/env';
import { mathTime } from '@/hooks';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue'

const data = reactive<AnyObject>({}); // 评论内容以及评论者

const item = defineProps<{ // 父组件传送的内容
    item: object
}>();

const isCreater = ref(false);

onLoad(() => {
    Object.assign(data, item.item);
    // 评论者头像
    data.user.photoUser = `${ENV_VAR.BASE_API}/user/${data.user.photoUser}`;

    // 评论图片
    if (data.tieziImg) {
        data.tieziImg = `${ENV_VAR.BASE_API}/comment/${data.tieziImg}`;
    }
    
    // 判断是不是楼主
    if (data.user.id === data.creater) {
        isCreater.value = true;
    }
})

// 计算评论发出时间
data.createTimeTiezi = mathTime(data.createTimeTiezi);

// 跳转到用户详情
const toDetailUserPage = () => {
    uni.navigateTo({
        url: '/components/detailUserPage?userId=' + data.creater,
        animationType: 'pop-in'
    })
}
</script>

<style scoped lang="scss">
.detailComment {
    .creater {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        view {
            display: flex;
            justify-content: center;

            image {
                width: 36px;
                height: 36px;
                border-radius: 50%;
            }

            .name {
                display: flex;
                flex-direction: column;
                margin-left: 5px;

                .name-top {
                    font-size: 15px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    view {
                        width: 26px;
                        height: 13px;
                        line-height: 13px;
                        font-size: 10px;
                        padding: 1px;
                        border-radius: 5px;
                        border: 1px solid blue;
                        margin-left: 5px;
                    }
                }

                .name-bottom {
                    font-size: 12px;
                    margin-top: 3px;
                    color: rgba(black, .4);
                    display: flex;
                    justify-content: flex-start;

                    text:first-child {
                        margin-right: 5px;
                    }
                }
            }
        }

        .trumbUp {
            display: flex;
            align-items: center;
            font-size: 12px;

            text {
                margin-left: 3px;
            }
        }
    }

    .content {
        margin-left: 41px;
        padding-bottom: 5px;
        border-bottom: 1px solid rgba(128, 128, 128, .2);
        display: flex;
        flex-direction: column;

        image {
            border-radius: 20rpx;
            max-width: 89vw;
        }
    }
}
</style>