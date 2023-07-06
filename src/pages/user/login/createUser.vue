<template>
    <view class="createUser">
        <view class="baseInfo" v-if="!isNext">
            <text>手机号：</text>
            <view>
                <u-input placeholder="请输入手机号" maxlength="11" shape="circle" fontSize="14px" input-align="center"
                    :customStyle="inputStyle" v-model="userInputInfo.mobile"></u-input>
                <text v-if="mobileError">手机号格式错误</text>
            </view>

            <text>用户名：</text>
            <u-input placeholder="请输入用户名" maxlength="10" shape="circle" fontSize="14px" input-align="center"
                :customStyle="inputStyle" v-model="userInputInfo.userId"></u-input>

            <text>邮箱：</text>
            <view>
                <u-input placeholder="请输入邮箱" maxlength="30" shape="circle" fontSize="14px" input-align="center"
                    :customStyle="inputStyle" v-model="userInputInfo.email"></u-input>
                <text v-if="emialError">邮箱格式错误</text>
            </view>

            <text>昵称：</text>
            <u-input placeholder="请输入昵称" maxlength="10" shape="circle" fontSize="14px" input-align="center"
                :customStyle="inputStyle" v-model="userInputInfo.userName"></u-input>
        </view>

        <view class="password" v-if="isNext">
            <text>密码：</text>
            <view>
                <u-input placeholder="请输入密码" maxlength="20" :password="true" shape="circle" fontSize="14px"
                    input-align="center" :customStyle="inputStyle" v-model="password"></u-input>
                <text v-if="isShowError">两次密码不同</text>
            </view>
            <text>请确认密码：</text>
            <view>
                <u-input placeholder="请确认密码" maxlength="20" :password="true" shape="circle" fontSize="14px"
                    input-align="center" :customStyle="inputStyle" v-model="userInputInfo.password"></u-input>
                <text v-if="isShowError">两次密码不同</text>
            </view>

            <text>请选择头像:</text>
            <view class="avatar">
                <view @click="chooseAvatarEvent">
                    <u-avatar size="60"  :src="userInputInfo.file"></u-avatar>
                </view>
            </view>
        </view>


        <u-button :disabled="isChickBtn" v-if="!isNext" class="ct-btn" type="primary" shape="circle" :customStyle="btnStyle"
            @click="nextEvent">{{ btnChar.next }}</u-button>
        <u-button :disabled="isChickBtn" v-if="isNext" class="ct-btn" type="primary" shape="circle" :customStyle="btnStyle"
            @click="registerEvent">{{ btnChar.register }}</u-button>
    </view>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { watchEffect } from 'vue';
import { reactive, ref } from 'vue';
import { createUser } from '@/server/uniRequest/user'
import { isEmail, isMobile } from '@/hooks';

// 父组件发来是否同意
const isArgee = inject('isArgee', ref(false));

// 输入框和按钮样式
const inputStyle = {
    height: '25px',
    border: 'none',
    backgroundColor: '#F5F5F5'
}
const btnStyle = {
    height: '50px',
    fontWeight: 'bold',
    fontSize: '18px'
}

// 按钮文字
const btnChar = reactive({
    next: '下一步',
    register: '注册'
})
// 是否不可以点击按钮
const isChickBtn = ref(true);

// 是否进行下一步
const isNext = ref(false);

// 用户信息
const userInputInfo = reactive({
    userId: '',
    userName: '',
    password: '',
    email: '',
    mobile: '',
    file: ''
});

// 确认密码
const password = ref('');
// 是否显示密码不同的报错
const isShowError = ref(false);
// 是否显示邮箱和手机号格式不正确的报错
const mobileError = ref(false);
const emialError = ref(false);

// 当输入完baseInfo的时候可以点击下一步
watchEffect((event) => {
    userInputInfo.email;
    userInputInfo.userName;
    userInputInfo.userId;
    userInputInfo.mobile;
    userInputInfo.password;
    userInputInfo.file;

    event(() => {
        // 如果点击下一步，就不进行if里的逻辑，进行else里的逻辑
        if (!isNext.value) {
            // 判断手机号格式是否正确
            if (!isMobile(userInputInfo.mobile) && userInputInfo.mobile.length > 0) {
                mobileError.value = true
            } else { mobileError.value = false }
            // 判断邮箱格式是否正确
            if (!isEmail(userInputInfo.email) && userInputInfo.email.length > 0) {
                emialError.value = true
            } else { emialError.value = false }

            // 判断是不是输入全了除密码外的用户信息
            if (isEmail(userInputInfo.email) && isMobile(userInputInfo.mobile) && userInputInfo.userId && userInputInfo.userName) {
                isChickBtn.value = false;
            }
        } else {
            // 判断两次密码是否相同
            if (userInputInfo.password.length > 0 && password.value) {
                if (userInputInfo.password === password.value) {
                    isShowError.value = false; // 密码相同，隐藏报错
                    if (userInputInfo.file) { // 密码相同的情况下，选择了头像才能注册
                        isChickBtn.value = false;
                    }
                } else {
                    isShowError.value = true;
                }
            }
        }


    });
})

// 下一步单击事件
const nextEvent = () => {
    isNext.value = true;
    isChickBtn.value = true;
}

// 注册事件
const registerEvent = async () => {
    // 如果同意协议
    if (isArgee.value) {
        const a = await createUser(userInputInfo);
        const data: {code: number} = JSON.parse(a);
        if (data.code === 200) {
            isChickBtn.value = true;
            uni.showToast({
                title: '创建成功',
                success: () => {
                    uni.reLaunch({
                        url: '/pages/user/index'
                    });
                }
            })
        }
    }
}

// 选择头像事件
const chooseAvatarEvent = () => {
    
    uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
            const img = res.tempFilePaths as string[];
            userInputInfo.file = img[0];
        }
    })
}

</script>

<style scoped lang="scss">
.createUser {
    padding: 0 20px;

    .baseInfo {
        font-size: 14px;
        display: grid;
        grid-template-columns: 20% 80%;
        grid-template-rows: repeat(4, 60px);
        align-items: center;
        margin-bottom: 20px;

        view {
            position: relative;

            text {
                width: 100%;
                position: absolute;
                color: red;
                text-align: center;
                font-size: 11px;
            }
        }
    }

    .password {
        font-size: 14px;
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: repeat(2, 60px);
        align-items: center;
        margin-bottom: 20px;

        view {
            position: relative;

            text {
                width: 100%;
                position: absolute;
                color: red;
                text-align: center;
                font-size: 11px;
            }
        }

        .avatar {
            display: flex;
            justify-content: center;
        }
    }

}
</style>