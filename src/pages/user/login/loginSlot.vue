<template>
    <!-- 输入用户名 -->
    <view class="account">
        <u-input :placeholder="placeholder" shape="circle" fontSize="16px" style="margin-bottom: 25px;" input-align="center"
            @change="inputAccountEvent" :customStyle="inputStyle" v-model="inputVal"></u-input>

        <!-- 下一步 -->
        <view v-if="isShowNext">
            <u-button class="ct-btn" :disabled="isDisabled" type="primary" shape="circle" :customStyle="btnStyle"
                @click="nextBtn">下一步</u-button>
        </view>

        <!-- 手机号登录 -->
        <view v-if="isWhat.isMobile">
            <u-button class="ct-btn" :disabled="isDisabled" type="primary" shape="circle" :customStyle="btnStyle"
                @click="">发送验证码</u-button>

            <view class="code"><text @click="changeLoginMethods">账号密码登录</text></view>
        </view>

        <!-- 邮箱或用户名登录 -->
        <view v-if="isWhat.isEmail || isWhat.isUserId">
            <u-input placeholder="请输入密码" type="password" shape="circle" fontSize="16px" style="margin-bottom: 25px;"
                input-align="center" @change="inputAccountEvent" :customStyle="inputStyle" v-model="passwordVal"></u-input>
            <u-button class="ct-btn" :disabled="isDisabled" type="primary" shape="circle" :customStyle="btnStyle"
                @click="loginBtn">登录</u-button>

            <view class="code"><text @click="changeLoginMethods">短信验证码登录</text></view>
        </view>
    </view>

    <u-popup :show="isShowPop" :round="20" mode="center">
        <view class="popup">
            <text>为了更好的使用服务</text>
            <text>登录前请阅读并同意以下协议</text>
            <view class="agreement">
                <text> 百度用户协议 </text>
                <text class="arg-simple">和</text>
                <text> 隐私政策 </text>
                <text class="arg-simple">及</text>
                <text> 儿童个人信息保护声明 </text>
            </view>

            <view class="popupBtn">
                <view @click="argeeArgeement(false)">不同意</view>
                <view @click="argeeArgeement(true)">同意并继续</view>
            </view>
        </view>
    </u-popup>
</template>

<script setup lang="ts">
import { loginStore } from '@/store/login';
import { ref, reactive } from 'vue'
import { throttle, isEmail, isMobile } from '@/hooks/index'
import { inject } from 'vue';
import { login, getUser } from '@/server/login';



// 输入框和按钮样式
const inputStyle = {
    height: '40px',
    border: 'none',
    backgroundColor: '#F5F5F5'
}
const btnStyle = {
    height: '50px',
    fontWeight: 'bold',
    fontSize: '18px'
}

const placeholder = ref('请输入手机号/用户名/邮箱');

const isArgee = inject('isArgee', ref(false)); // 父组件发来是否同意
const checkGroupVal = inject('checkGroupVal', reactive([''])); // 父组件发来是否同意

const isDisabled = ref<boolean>(true); // 是否输入用户名, true为未输入

const inputVal = ref<string>(''); // 账号
const passwordVal = ref<string>(''); // 密码
const isShowNext = ref<boolean>(true);
const isWhat = reactive({ // 用于判断用户输入的账号类型
    isEmail: false,
    isMobile: false,
    isUserId: false
})

// 当输入账号时，按钮可以点击
const inputAccountEvent = throttle(() => { // 使用节流
    // 当初始和输入手机号后，判断是否清空手机号
    if (isShowNext || isWhat.isMobile) {
        inputVal.value === '' ?
            isDisabled.value = true :
            isDisabled.value = false;
    }
    // 当输入的是email或用户名，判断是否输入账号和密码
    if (isWhat.isEmail || isWhat.isUserId) {
        inputVal.value === '' || passwordVal.value === '' ?
            isDisabled.value = true :
            isDisabled.value = false;
    }
}, 100);

// accountBtn的单击事件
const nextBtn = () => {
    if (isArgee.value) {
        // 判断用户输入账号的类型
        if (isEmail(inputVal.value)) {
            isWhat.isEmail = true;
            isDisabled.value = true;
        } else if (isMobile(inputVal.value)) {
            isWhat.isMobile = true;
        } else {
            isWhat.isUserId = true;
            isDisabled.value = true;
        }

        // 隐藏输入账号的view
        isShowNext.value = false;
    } else {
        isShowPop.value = true;
    }
}

// 切换登录方式
const changeLoginMethods = () => {
    // 切换到手机号登陆
    if (isWhat.isEmail || isWhat.isUserId) {
        isWhat.isEmail = false;
        isWhat.isUserId = false;
        isWhat.isMobile = true;
        inputVal.value = '';
        placeholder.value = '请输入手机号';

    } else {
        // 切换到账号登陆
        isWhat.isMobile = false;
        isWhat.isUserId = true
        inputVal.value = '';
        placeholder.value = '请输入用户名';
    }

}

// 是否显示弹出层
const isShowPop = ref<boolean>(false);
// 弹出层中是否同意协议
const argeeArgeement = (argee: boolean) => {
    if (argee) {
        isArgee.value = true;
        checkGroupVal[0] = 'argee';
    }

    isShowPop.value = false
}

const user = loginStore();

// 登录事件
const loginBtn = async () => {
    let username = '';

    // 根据判断好的账号类型发送不同的username
    if (isWhat.isUserId) {
        username = `userId:${inputVal.value}`;
    } else if (isWhat.isEmail) {
        username = `email:${inputVal.value}`;
    } else if (isWhat.isMobile) {
        username = `mobile:${inputVal.value}`;
    }

    // 登录成功返回token和信息，登录失败弹出失败
    const data = await login(username, passwordVal.value) as AnyObject;

    if (data.token) {
        uni.setStorageSync('loginKey', data.token);
        user.setUserInfo(); // 用户信息存储到pinia
        user.setIsLogin(true); // 登录状态为true

        uni.reLaunch({
            url: '/pages/user/index'
        });
    } else {
        uni.showToast({
            title: '账号或密码错误',
            icon: 'error',
            duration: 1500
        })
    }




}



</script>

<style scoped lang="scss">
.account {
    padding: 30rpx 40rpx;
    font-weight: border;

    .code {
        font-weight: normal;
        font-size: small;
        text-align: center;
        margin-top: 15px;
    }

    .ct-btn {
        box-shadow: 0 0 7px rgba($color: #1c0ac1, $alpha: .3);
    }
}

.popup {
    width: 300px;
    height: 200px;
    font-weight: normal;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // padding: 0 50px;

    .agreement {
        font-weight: bold;
        color: gray;
        margin: 10px 50px 20px;
        font-size: 13px;

        .arg-simple {
            font-weight: normal;
        }
    }

    .popupBtn {
        width: 100%;
        display: flex;
        margin: 20px 50px 0;
        border-top: 1px solid rgba(gray, $alpha: .2);
        font-size: 14px;

        view {
            width: 162px;
            height: 48px;
            text-align: center;
            line-height: 48px;
        }

        view:last-child {
            color: blue;
            border-left: 1px solid rgba(gray, $alpha: .2);
        }
    }
}
</style>