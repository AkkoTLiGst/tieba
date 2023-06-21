<template>
    <view class="detailComment">
        <view class="creater">
            <view>
                <image :src="data.user.photoUser" mode="scaleToFill" />

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
            <image v-if="data.tieziImg" :src="data.tieziImg" mode="widthFix" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue'

const data = reactive<AnyObject>({}); // 评论内容以及评论者

const item = defineProps<{ // 父组件传送的内容
    item: object
}>();
Object.assign(data, item.item);
// 评论者头像
data.user.photoUser = `http://localhost:3000/user/${data.user.photoUser}`;
// 评论图片
if (data.tieziImg) {
    data.tieziImg = `http://localhost:3000/comment/${data.tieziImg}`;
}
// 判断是不是楼主
const isCreater = ref(false);
if (data.user.id === data.creater) {
    isCreater.value = true;
}

// 计算评论发出时间
const createtime = Math.round(new Date(data.createTimeTiezi).getTime() / 1000); // 评论时间
const now = Math.round(new Date().getTime() / 1000);
let time = 0;
if (Math.round((now - createtime) / 60) > 0) {
    time = Math.round((now - createtime) / 60);
    if (time < 60) {
        data.createTimeTiezi = `${time}分钟前`;
    } else if (time >= 60 && time < 1440) {
        time = Math.floor(time / 60);
        data.createTimeTiezi = `${time}小时前`;
    } else {
        time = Math.floor(time / 60 / 24);
        data.createTimeTiezi = `${time}天前`
    }
} else {
    time = Math.round((now - createtime));
    data.createTimeTiezi = `${time}秒前`;

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