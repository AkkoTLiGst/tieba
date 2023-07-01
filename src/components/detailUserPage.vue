<template>
    <view class="detailUserPage">
        <view class="topBar" :style="{ height: statusBarHeight + 'px' }">
            <u-icon @click="rollback" name="arrow-left" :custom-style="{ width: '56px' }" size="20" color="black"></u-icon>
        </view>

        <view class="userMsg">
            <view class="top">
                <image :src="user.photoUser" mode="scaleToFill" />
                <view v-if="user.id === loginUser.userInfo.id" @click="editUserEvent">编辑资料</view>
            </view>

            <view class="bottom">
                <view>
                    <text>{{ user.userName }}</text>
                    <text>ID : {{ user.id }}</text>
                </view>
                <text>{{ user.aboutMe }}</text>
            </view>
        </view>

        <view class="contentBar">
            <text>帖子 {{ postsCount }}</text>
            <text>关注的吧</text>
        </view>

        <view class="content">
            <postsForBar v-for="item in posts" :index="item" :item="item" :from="'detailUserPage'" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, reactive } from 'vue';
import { newUrl, rollback } from '@/hooks';
import type { User, tieba, tiezis, toDetailPage } from '@/types/types';
import { getUserById, userPosts } from '@/server/user';
import { loginUserPosts } from '@/server/login';
import { loginStore } from '@/store/login';
import postsForBar from '@/components/postsForBar.vue'
import { tiebaById } from '@/server/tiebas'

interface newUser extends User {
    aboutMe: string
}

const loginUser = loginStore();

// 用户信息
const user: newUser = reactive({
    userName: '',
    id: 0,
    userId: '',
    photoUser: '',
    email: '',
    tiezisID: [],
    aboutMe: ''
})

// 需要展示的帖子
const posts = reactive<toDetailPage[]>([]);
// 用户的帖子数量
const postsCount = ref<number>(0);

// 帖子是第几页
const postPage = ref<number>(1);

// 初始化
const init = async () => {
    // 通过用户ID获取用户信息
    const data = await getUserById(user.id) as AnyObject;
    user.userName = data.userName;
    
    Object.assign(user, data);
    user.photoUser = newUrl(user.photoUser, 'user');

    // 根据用户ID获取用户的帖子
    if (user.id === loginUser.userInfo.id) {
        // 如果是登录用户查看自己的主页，即可以获取包括隐藏帖子在内的所有帖子
        const data = await loginUserPosts(loginUser.userInfo.id, postPage.value, 10) as { data: toDetailPage[], count: number, code: number, message: string };
        posts.push(...data.data);
        postsCount.value = data.count;
        
    } else {
        // 如果是登录用户查看别人的主页，即可以获取不包括隐藏帖子的所有帖子
        const data = await userPosts(user.id, postPage.value, 10) as { data: toDetailPage[], count: number, code: number, message: string };
        posts.push(...data.data);
        postsCount.value = data.count;
    }
}

const statusBarHeight = ref(0); // 给topbar定位
onLoad((e) => {
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight as number || 44;

    user.id = e!.userId; // 接受用户ID
});

onShow(() => {
    posts.length = 0;
    init();
})

// 编辑资料
const editUserEvent = () => {
    uni.navigateTo({
        url: '/components/editUser'
    })
}


</script>

<style scoped lang="scss">
page {
    background-color: #f7f7f7;
}

.detailUserPage {

    .topBar,
    .userMsg,
    .contentBar {
        background-color: white;
        padding: 0 10px;
    }

    .topBar {
        display: flex;
        align-items: center;
    }

    .userMsg {
        .top {
            padding-top: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            image {
                width: 70px;
                height: 70px;
                border-radius: 50%;
            }

            view {
                width: 50px;
                line-height: 20px;
                height: 20px;
                font-size: 12px;
                padding: 5px 15px;
                border: 1px solid blue;
                color: blue;
                border-radius: 15px;
            }
        }

        .bottom {
            margin-top: 10px;
            font-size: 14px;

            text {
                margin-right: 10px;
            }

            text:last-child {
                color: gray;
                font-size: 11px;
            }
        }
    }

    .contentBar {
        padding: 20px 10px 10px 10px;
        font-size: 12px;

        text {
            margin-right: 30px;
        }
    }

    .content {
        padding: 10px 10px;
    }
}
</style>