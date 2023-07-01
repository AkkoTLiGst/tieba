<template>
    <view class="editUser">
        <view class="topBar" :style="{ height: statusBarHeight + 'px' }">
            <u-icon @click="rollback" name="close" :custom-style="{ width: '20px' }" size="20" color="black"></u-icon>
            <text>编辑资料</text>
            <view @click="saveEvent">保存</view>
        </view>

        <view class="img">
            <image lazy-load="true"  :src="user.photoUser" mode="scaleToFill" />
            <view @click="chooseImgEvent" class="chooseImg"><u-icon name="photo" color="white" size="30"></u-icon></view>
        </view>


        <view class="msg">
            <text>用户名：</text>
            <input type="text" :value="user.userId" :disabled="true" />

            <text>昵称：</text>
            <input type="text" :placeholder="user.userName"  v-model="user.userName"  placeholder-style="color: black" />

            <text>贴吧ID：</text>
            <input type="text" :value="user.id" :disabled="true">

            <text>简介：</text>
            <textarea v-model="user.aboutMe"></textarea>
        </view>

    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { newUrl, rollback } from '@/hooks';
import { loginStore } from '@/store/login';
import type { User } from '@/types/types';
import { authUpdateUser } from '@/server/login'
import { uploadImg, getUserById } from '@/server/user'

const userLogin = loginStore();

const user = reactive<User>({
    userName: '',
    id: 0,
    userId: '',
    photoUser: '',
    email: '',
    aboutMe: '',
    tiezisID: []
});

const userChooseImg = ref('');
// 选择图片
const chooseImgEvent = () => {
    uni.chooseImage({
        sourceType: ['album', 'camera'],
        count: 1,
        success: (chooseImageRes) => {
            const tempFilePaths = chooseImageRes.tempFilePaths as string[];
            userChooseImg.value = tempFilePaths[0];
        },
        fail: (error) => { }
    })
}

const saveEvent = async () => {
    const data = await authUpdateUser(user) as { message: string, code: number };
    // 上传成功就继续上传图片，然后更新本地的信息
    if (data.code === 200) {
        // 选择了图片，就上传图片再push
        if (userChooseImg.value !== '') {
            await uploadImg(user.id, userChooseImg.value);
        }
        // 重新获取用户信息
        const data = await getUserById(user.id) as User;
        // 更新用户信息
        Object.assign(user, data);
        userLogin.updateUserInfo(user);
        user.photoUser = newUrl(user.photoUser, 'user');

        uni.showToast({
            title: '保存成功'
        })
    }

}

const statusBarHeight = ref(0); // 给topbar定位
onLoad((e) => {
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight as number || 44;

    Object.assign(user, userLogin.userInfo);
});

</script>

<style scoped lang="scss">
page{background-color: #f7f7f7;}
.editUser {
    padding: 10px 10px;
    background-color: white;
    height: 100vh;

    .topBar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;

        view:last-child {
            color: blue;
        }
    }

    .msg {
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: repeat(4, 30px);
        font-size: 13px;
        color: gray;

        input,
        textarea {
            font-size: 13px;
        }

        input:nth-child(2),
        input:nth-child(6) {
            caret-color: transparent;
        }

        input:nth-child(4) {
            color: black;
        }

        textarea:nth-child(8) {
            color: black;
        }
    }

    .img {
        width: 120px;
        height: 120px;
        margin: 10px auto;
        position: relative;

        image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
        }

        .chooseImg {
            position: absolute;
            bottom: 2%;
            right: 2%;
            background-color: rgba(blue, .8);
            border-radius: 50%;
            padding: 5px;
        }
    }
}
</style>