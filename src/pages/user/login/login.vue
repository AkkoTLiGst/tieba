<template>
    <view class="content">
        <view class="ct-title"><text>登录百度账号 精彩永相随</text></view>

        <loginSlot/>
        

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

    </view>
</template>

<script setup lang="ts">
import { loginStore } from '@/store/login';
import { ref, reactive, provide } from 'vue'
import { throttle } from '@/hooks/index'
import loginSlot from './loginSlot.vue';

const isArgee = ref<boolean>(false); // 是否同意协议


const checkGroupVal = reactive(['']); // 默认不选中
const checkbox = reactive({ name: 'argee', disabled: false });
// 同意协议事件
// n为数组，数组内容为点击后选中的checkbox的name
const checkboxChange = (n: any) => {
    if(checkbox.name === n[0]){
        isArgee.value = true;
        checkGroupVal[0] = n[0];
    }else{
        isArgee.value = false;
        checkGroupVal[0] = '';
    }
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

    .ct-title {
        padding: 60rpx 0;
        font-size: 20px;
        text-align: center;
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

}
</style>