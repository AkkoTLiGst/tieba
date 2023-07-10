<template>
    <view class="posting">
        <view class="topBar" :style="{ height: statusBarHeight + 'px' }">
            <u-icon @click="rollback" name="close" :custom-style="{ width: '60px' }" size="20" color="black"></u-icon>
            <text>发布帖子</text>
            <button :disabled="isInput" @click="postingEvent" plain="true">发布</button>
        </view>

        <view class="content">
            <view class="tieba">
                <u-icon name="baidu" size="22"></u-icon>
                <text>{{ tiebaInfo.name }}吧</text>
            </view>

            <input type="text" @input="throttle(titleEvent, 500)()" v-model="post.threadTitle"
                placeholder="请输入完整的帖子标题（5-31个字）" maxlength="31" />

            <textarea maxlength="-1" v-model="post.content" placeholder="来吧，尽情发挥吧">
            </textarea>
            <view v-show="postImg"  class="chooseImg">
                <image :src="postImg" mode="scaleToFill" />
                <u-icon @click="postImg = ''" name="close" size="12" :bold="true" color="white"  class="icon"></u-icon>
            </view>


        </view>

        <view class="bottom">
            <view class="icon">
                <u-checkbox-group v-model="checkGroupVal" @change="checkboxChange">
                    <u-checkbox :name="checkbox.name" :disabled="checkbox.disabled" activeColor="blue" shape="circle"
                        size="14" label-size="14" label="同步到主页"></u-checkbox>
                </u-checkbox-group>
            </view>
            <view class="photo" @click="addPhoto">
                <u-icon size="18" name="photo"></u-icon>
                <text>添加图片</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import { rollback, throttle } from '@/hooks';
import { loginStore } from '@/store/login';
import { createPost } from '@/server/uniRequest/tiezi';

// 登录用户
const userLogin = loginStore();

// 帖子信息
const post = reactive({
    createrId: 0, // 发帖人ID
    ctieBaId: 0, // 目标贴吧
    threadTitle: '', // 帖子标题
    content: '', // 帖子内容
    isHidePost: true, //是否隐藏帖子
})

const checkGroupVal = reactive(['']); // 默认不选中
const checkbox = reactive({ name: 'argee', disabled: false });
// n为数组，数组内容为点击后选中的checkbox的name
const checkboxChange = (n: any) => {
    // 选中就是不隐藏，不选择就是隐藏
    if (checkbox.name === n[0]) {
        post.isHidePost = false;
        checkGroupVal[0] = n[0];
    } else {
        post.isHidePost = true;
        checkGroupVal[0] = '';
    }
}

// 是否输入了内容或标题
const isInput = ref(true);

// 标题输入事件
const titleEvent = () => {
    isInput.value = post.threadTitle.length < 5;
}

const postImg = ref('');
// 添加图片
const addPhoto = () => {
    uni.chooseImage({
        sourceType: ['album', 'camera'],
        sizeType: ['compressed'],
        count: 1,
        success: (chooseImageRes) => {
            const tempFilePaths = chooseImageRes.tempFilePaths as string[];
            console.log(tempFilePaths);
            
            postImg.value = tempFilePaths[0];
        },
        fail: (error) => { }
    });

};

// 发表帖子
const postingEvent = async () => {
    const data = await createPost(post, postImg.value);
    let temp;
    if (postImg.value) {
        temp = JSON.parse(data as string) as { message: string, code: number };
    } else {
        temp = data as { message: string, code: number };
    }

    if (temp.code === 200) {
        post.threadTitle = '';
        post.content = '';
        postImg.value = '';

        await uni.showToast({
            title: "发表成功",
            duration: 800
        })
    } else {
        await uni.showToast({
            title: "发表失败",
            duration: 800,
            icon: 'fail'
        })
    }

};

// 贴吧信息
const tiebaInfo = reactive({
    id: 0,
    name: ''
});

const statusBarHeight = ref(0); // 给topbar定位
onLoad((e) => {
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight as number || 44;

    tiebaInfo.id = e!.id;
    tiebaInfo.name = e!.name;


    post.ctieBaId = tiebaInfo.id;
    post.createrId = userLogin.userInfo.id;
});
</script>

<style scoped lang="scss">
page {
    background-color: #f7f7f7;
    overflow: hidden;
}

.posting {
    background-color: white;
    height: 100vh;
    padding: 0 10px;
    display: flex;
    flex-direction: column;

    .topBar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;

        button {
            margin: 0;
            padding: 0;
            width: 60px;
            height: 20px;
            font-size: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background-color: white;
        }
    }

    .content {
        padding-bottom: 10px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;

        .tieba {
            display: flex;
            align-items: center;
            font-size: 14px;

            text {
                margin-left: 5px;
            }

            padding-bottom: 10px;

            border-bottom: 1px solid rgba(gray, .2);
        }

        input {
            margin-top: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(gray, .2);
        }

        textarea {
            width: 100%;
            margin-top: 10px;
            font-size: 14px;
            flex-grow: 1;
        }

        .chooseImg{
            margin-top: 10px;
            position: relative;
            width: 120px; height: 120px;
            image{
                width: 120px; height: 120px;
                border-radius: 5px;
            }
            .icon{
                position: absolute;
                top: 0; 
                background-color: rgba(black, .5);
                border-radius: 50%;
                padding: 5px;
                right: 5px; top: 5px;
            }
        }
    }

    .bottom {
        display: flex;
        padding-bottom: 10px;

        .photo {
            margin-left: 15px;
            display: flex;
            align-items: center;
            font-size: 14px;

            text {
                margin-left: 3px;
            }
        }
    }
}
</style>