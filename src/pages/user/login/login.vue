<template>
    <view class="content">
        <view class="ct-title"><text>登录百度账号 精彩永相随</text></view>
        <view class="demo">
            <text>演示账号：noa 密码123</text>
            <text>也可以注册</text>
        </view>

        <loginSlot v-if="!isShowRegister" />
        <createUser v-if="isShowRegister" />


        <view class="argeement">
            <view>
                <u-checkbox-group v-model="checkGroupVal" @change="checkboxChange">
                    <u-checkbox :name="checkbox.name" :disabled="checkbox.disabled" shape="circle"></u-checkbox>
                </u-checkbox-group>
            </view>


            <view>
                <text class="arg-simple">请您阅读和同意</text>
                <text> 百度用户协议 </text>
                <text class="arg-simple">和</text>
                <text> 隐私政策 </text>
                <text class="arg-simple">及</text>
                <text> 儿童个人信息保护声明 </text>
            </view>
        </view>

        <view class="register">
            <view @click="registerEvent" v-if="!isShowRegister">注册</view>
            <view @click="registerEvent" v-if="isShowRegister">登录</view>
        </view>

    </view>
</template>

<script setup lang="ts">
import createUser from './createUser.vue';
import { ref, reactive, provide } from 'vue'
import loginSlot from './loginSlot.vue';

const isArgee = ref<boolean>(false); // 是否同意协议


const checkGroupVal = reactive(['']); // 默认不选中
const checkbox = reactive({ name: 'argee', disabled: false });
// 同意协议事件
// n为数组，数组内容为点击后选中的checkbox的name
const checkboxChange = (n: any) => {
    if (checkbox.name === n[0]) {
        isArgee.value = true;
        checkGroupVal[0] = n[0];
    } else {
        isArgee.value = false;
        checkGroupVal[0] = '';
    }
}

// 是否点击了注册
const isShowRegister = ref(false);

// 注册用户
const registerEvent = () => {
    isShowRegister.value = !isShowRegister.value;
}

provide("isArgee", isArgee);
provide('checkGroupVal', checkGroupVal);


</script>

<style scoped lang="scss">
.content {
    border-radius: 40rpx;
    height: 520px;
    background-color: white;
    font-weight: bold;
    margin: 30px 0;
    position: relative;

    .ct-title {
        padding: 60rpx 0 40rpx;
        font-size: 20px;
        text-align: center;
    }
    .demo{
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 14px;
        color: rgba($color: #000000, $alpha: .4);
    }

    .account {
        padding: 30rpx 40rpx;
        font-weight: normal;

        .ct-btn {
            box-shadow: 0 0 7px rgba($color: #1c0ac1, $alpha: .3)
        }
    }

    .argeement {
        color: rgba(128, 128, 128, .6);
        font-size: 12px;
        display: flex;
        justify-content: center;
        padding: 10px 50px 0;
        text-align: center;

        .arg-simple {
            width: 40px;
            color: rgba(128, 128, 128, .4);
            font-weight: normal;
        }
    }

    .register {
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: 20px;
        color: rgba(gray, .5);
        font-size: 14px;
    }

}
</style>