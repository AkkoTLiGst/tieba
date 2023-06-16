<template>
    <view class="recommended">
        <view class="top">
            <text>可能感兴趣的吧</text>
            <view>
                <u-icon name="reload"></u-icon>
                <text>换一换</text>
            </view>
        </view>
        <view class="content">
            <view class="ba">
                <view>
                    <image src="http://localhost:3000/tiebas/1686905984788.jpg" />
                    <text>{{ 'Steam吧' }}</text>
                </view>

                <button>加入</button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">

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

            button{
                margin: 0;
                width: 56; height: 29px;
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