<template>
    <view class="createBar">
        <view class="topBar" :style="{ height: statusBarHeight + 'px' }">
            <u-icon @click="rollback" name="arrow-left" :custom-style="{ width: '56px' }" size="20" color="black"></u-icon>
            <text>创建自己喜欢的吧</text>
            <view></view>
        </view>

        <view class="content">
            <text>吧名</text>
            <input type="text" v-model="createBarInfo.tiebaName" placeholder="请输入吧名，最长10个字符" maxlength="10">

            <text>吧头像</text>
            <view class="avatar" @click="avatarEvent">
                <u-avatar :src="createBarInfo.file" size="30"></u-avatar>
                <u-icon name="arrow-right"></u-icon>
            </view>

            <text>简介</text>
            <input type="text" v-model="createBarInfo.aboutTieba" placeholder="请输入简介">
        </view>

        <view class="bottom">
            <u-button @click="createBarEvent" type="primary" :disabled="isShow">创建</u-button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { debounce, rollback } from '@/hooks';
import { watchEffect } from 'vue';
import { createTieba, tiebaByName } from '@/server/uniRequest/tiebas'

// 贴吧信息
const createBarInfo = reactive({
    tiebaName: '',
    aboutTieba: '',
    file: ''
});

// 是否可以创建
const isShow = ref(true);

watchEffect((event) => {
    createBarInfo.aboutTieba;
    createBarInfo.tiebaName;

    event(debounce(() => {
        if (createBarInfo.file && createBarInfo.aboutTieba && createBarInfo.tiebaName) {
            isShow.value = false;
        } else {
            isShow.value = true;
        }
    }, 300, { first: true, end: true }))
})

// 选择头像
const avatarEvent = () => {
    uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
            const img = res.tempFilePaths as string[];
            createBarInfo.file = img[0];
        }
    })
}

// 创建贴吧
const createBarEvent = async () => {
    const a = await createTieba(createBarInfo);
    const data: { code: number, message: string } = JSON.parse(a); // 返回的是一个JOSN，需要转换
    const tiebaId = await tiebaByName(createBarInfo.tiebaName) as AnyObject; // 通过吧名获取ID，跳转到贴吧详情页用
    
    if (data.code === 200) {
        createBarInfo.aboutTieba = '';
        createBarInfo.file = '';
        createBarInfo.tiebaName = '';
        uni.showToast({
             title: '创建成功，跳转到贴吧' ,
             success: () => {
                uni.redirectTo({
                    url: '/components/detailPostBar?data=' + tiebaId.id,
                });
             }
            });

    } else {
        uni.showToast({ title: data.message, icon: 'fail' });

    }
}

const statusBarHeight = ref(0); // 给topbar定位
onLoad(() => {
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight as number || 44;
})
</script>

<style scoped lang="scss">
.createBar {
    padding: 0 10px;
    flex-direction: column;

    .topBar {
        display: flex;
        justify-content: space-between;
        align-items: center;

        view {
            width: 56px;
        }
    }

    .content {
        border-top: 1px solid rgba(gray, .2);
        border-bottom: 1px solid rgba(gray, .2);
        margin: 20px 0 20px;
        padding: 20px 0 20px;
        display: grid;
        grid-template-columns: 20% 80%;
        grid-template-rows: repeat(3, 60px);
        align-items: center;

        .avatar {
            display: flex;
        }
    }
}
</style>