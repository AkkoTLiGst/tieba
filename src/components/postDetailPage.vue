<template>
    <view class="postpage">
        <view class="topBar" :style="{ height: statusBarHeight + 'px' }">
            <u-icon @click="rollback" name="arrow-left" :custom-style="{ width: '56px' }" size="20" color="black"></u-icon>
            <view>
                <image :src="tiezi.tiebaImg" mode="scaleToFill" />
                <text>{{ tiezi.tiebaName }}吧 </text>
            </view>
            <text>打开贴吧</text>
        </view>
        <view class="threadStarter">
            <view class="title">{{ tiezi.threadTitle }}</view>
            <view class="user">
                <image :src="creater.createrImg" mode="scaleToFill" />
                <view>
                    <text>{{ creater.createrName }}</text>
                    <text>{{ tiezi.createTimeTiezi }}</text>
                </view>
            </view>
            <view class="content">
                {{ tiezi.content }}
            </view>
            <image v-if="tiezi.url" :src="tiezi.url" mode="widthFix" />

            <view class="interactionBar">
                <view>
                    <u-icon size="24px" name="star"></u-icon>
                    <text>收藏</text>
                </view>
                <view>
                    <u-icon size="24px" name="chat"></u-icon>
                    <text>{{ tiezi.commentsNum }}</text>
                </view>
                <view @click="postLike" v-if="!like">
                    <u-icon size="24px" name="thumb-up"></u-icon>
                    <text>{{ tiezi.thumbUp }}</text>
                </view>
                <view @click="postLike" v-if="like">
                    <u-icon size="24px" name="thumb-up" :color="'red'"></u-icon>
                    <text>{{ tiezi.thumbUp }}</text>
                </view>
            </view>
        </view>

        <view class="comment">
            <view class="commentBar">
                <view>
                    <text>全部回复</text>
                    <text>只看楼主</text>
                </view>
                <view>
                    <text>热门</text>
                    <text>正序</text>
                    <text>倒序</text>
                </view>
            </view>
            <view class="detailComment">
                <view v-for="item in comment" :index="item">
                    <detail-comment :item="item"></detail-comment>
                </view>
                <view class="end">已加载全部回复</view>
            </view>

        </view>

        <view v-if="userComment" class="iptBg" @click="notShowEvent"></view>
        <view class="userComment">
            <view v-if="!userComment" class="simple">
                <u-input type="text" placeholder="发帖千百度，文明第一步" placeholderStyle="fontSize: 12px" border="none"
                    :customStyle="simpleStyle" :disabled="true" @click="showComment" />

                <view>
                    <u-icon size="24px" name="chat"></u-icon>
                    <text>{{ tiezi.commentsNum }}</text>
                </view>
                <view @click="postLike" v-if="!like">
                    <u-icon size="24px" name="thumb-up"></u-icon>
                    <text>{{ tiezi.thumbUp }}</text>
                </view>
                <view @click="postLike" v-if="like">
                    <u-icon size="24px" name="thumb-up" :color="'red'"></u-icon>
                    <text>{{ tiezi.thumbUp }}</text>
                </view>
                <view>
                    <u-icon size="24px" name="star"></u-icon>
                </view>
            </view>

            <view class="ipt" v-if="userComment">
                <u-textarea placeholder="发帖千百度，文明第一步" placeholderStyle="fontSize: 12px" border="none"
                    :customStyle="iptStyle" height="40" v-model="userInput" :fixed="true" />
                <u-icon name="photo" class="icon" size="30" @click="chooseImgEvent"></u-icon>
                <u-button @click="addCommentEvent" :disabled="btnDisabled" type="primary"
                    :customStyle="btnStyle">发表</u-button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getUserById } from '@/server/user';
import { findAllCommentId, getComment, createComment, uploadImg } from '@/server/comment';
import { loginStore } from '@/store/login';
import type { tiezis, toDetailPage } from '@/types/types';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, reactive, watchEffect } from 'vue'
import detailComment from '@/components/detailComment.vue'
import { isLike, likePost } from '@/server/login';
import { getTieziById } from '@/server/tiezi';

const user = loginStore();

// 样式
const simpleStyle = {
    borderRadius: '20px',
    padding: '0 10px 0',
    caretColor: 'transparent',
    height: '30px'
}
const iptStyle = {
    height: '40px',
    backgroundColor: 'rgba(128, 128, 128, .1)',
    paddingRight: '32px'
}
const btnStyle = {
    width: '60px',
    height: '30px',
    borderRadius: '30px',
    marginLeft: '10px'
}

// 帖子信息
const tiezi: toDetailPage = reactive({
    id: 0,
    threadTitle: '',
    content: '',
    createTimeTiezi: '',
    star: 0,
    thumbUp: 0,
    commentsNum: 0,
    tieziImg: '',
    createrId: 0,
    ctieBaId: 0,
    tiebaName: '', // 对应贴吧名
    tiebaImg: '', // 贴吧头像
    url: '' // 图片
});

// 发帖人信息
const creater = reactive({
    createrName: '',
    createrImg: '',
    createrId: 0
})

// 所有评论
const comment = reactive<AnyObject[]>([]);

// 获取所有评论的ID
const getAllCommentId = async () => {
    return await findAllCommentId(tiezi.id);
}
// 通过ID将评论push到comment数组中
const pushComment = async (arr: number[]) => {
    for (let i = 0; i < arr.length; i++) {
        const data = await getComment(arr[i]) as AnyObject;
        data.creater = creater.createrId;
        comment.push(data);
    }
}

// 回到上一页
const rollback = () => {
    const pages = getCurrentPages()
	// 有可返回的页面则直接返回，uni.navigateBack  默认返回失败之后会自动刷新页面 ，无法继续返回
	if (pages.length > 1) {
	 uni.navigateBack({delta: 1})
	 return;
	}

	let a = history.go(-1);
	// go失败之后则重定向到首页 
	if (a == undefined) {
	 uni.reLaunch({
	  url: "/pages/index/index"
	 })
	}
	return;
}

const btnDisabled = ref(true); // 按钮是否禁用
const userInput = ref('');

// 节流
const userInputEvent = (first: boolean, timer: number) => {
    if (first && timer === 0) {
        btnDisabled.value = false;
    }
    return setTimeout(() => {
        btnDisabled.value = false;
    }, 600)
}
// 监听用户是否输入，如果输入就可以点击发表，如果清空了就无法点击发表
watchEffect((clear) => {
    let timer: number = 0;
    if (userInput.value) {
        timer = userInputEvent(true, timer)
    } else {
        btnDisabled.value = true;

    }
    clear(() => clearTimeout(timer));
})

// 是否显示发表评论
const userComment = ref(false);
// 当点击发表评论以外的区域隐藏发表评论
const notShowEvent = () => {
    if (userComment.value === true) {
        userComment.value = false;
    }
}
// 当点击最下方默认评论栏时显示发表评论
const showComment = () => {
    userComment.value = true;
}


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

// 发表评论
const addCommentEvent = async () => {
    const floor = comment.length === 0 ? 2 : comment.length + 2;
    const data = await createComment(userInput.value, floor, '', user.userInfo.id, tiezi.id) as AnyObject;
    // 如果创建成功将评论push到评论数组
    if (data.id) {
        // 选择了图片，就上传图片再push
        if (userChooseImg.value !== '') {
            await uploadImg(data.id, userChooseImg.value);
        }
        const com = await getComment(data.id) as AnyObject;
        comment.push(com);

        tiezi.commentsNum = tiezi.commentsNum + 1;

        // 发表完成隐藏发表栏
        userComment.value = false;

        // 然后清空输入的评论和选择的图片
        userInput.value = '';
        userChooseImg.value = '';
    }
}

// 是否已经点赞帖子
const like = ref(false);
// 帖子点赞或取消点赞
const postLike = async () => {
    if (like.value) {
        await likePost(user.userInfo.id, tiezi.id, 'like');
    } else {
        await likePost(user.userInfo.id, tiezi.id, 'unlike');
        like.value = false;
    }
}

const statusBarHeight = ref(0); // 给topbar定位
onLoad((e) => {
    // 给topbar定位
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight as number || 44;

    const getInfo = JSON.parse(decodeURIComponent(e!.data));

    const initDetail = async () => {
        // 获取帖子
        const getTiezi: tiezis = await getTieziById(getInfo.id) as tiezis;
        Object.assign(tiezi, getTiezi);
        if (getTiezi.tieziImg) {
            tiezi.url = `http://localhost:3000/tiezi/${getTiezi.tieziImg}`;
        }
        tiezi.tiebaName = getInfo.tiebaName;
        tiezi.tiebaImg = getInfo.tiebaImg;
        tiezi.createTimeTiezi = getInfo.createTime;

        // 获取发帖用户信息
        const usr = await getUserById(tiezi.createrId) as AnyObject;
        creater.createrId = usr.id;
        creater.createrName = usr.userName;
        creater.createrImg = 'http://localhost:3000/user/' + usr.photoUser;

        // 如果登录了，获取登录用户是否点赞了当前帖子
        if (user.isLogin) {
            const data = await isLike(user.userInfo.id, tiezi.id) as AnyObject;
            if (data) {
                like.value = data.isLike;
            }
        }


        // 获取评论ID数组
        const commentId: number[] = await getAllCommentId() as number[];

        // 获取所有评论
        await pushComment(commentId);
    }

    initDetail();
});
onShow(() => {
    // 如果没有登录跳转登录界面
    if (user.isLogin === false) {
        uni.navigateTo({
            url: '/pages/user/login/index'
        })
    }
})
</script>

<style scoped lang="scss">
page {
    height: 100%;
    background-color: #f7f7fa;
}

.postpage {
    .topBar {
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;

        view:nth-child(2) {
            display: flex;
            background-color: #f3f2f5;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 15px;

            image {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                margin-right: 5px;
            }
        }

        text:nth-child(3) {
            font-size: 14px;
            font-weight: bold;
            color: #6949c3;
        }
    }

    .threadStarter {
        display: flex;
        flex-direction: column;
        background-color: white;
        padding: 0 10px 25px;

        image {
            margin-top: 16px;
            border-radius: 20rpx;
            max-width: 89vw;
        }

        .title {
            font-size: 22px;
            font-weight: bold;
        }

        .user {
            display: flex;
            align-items: center;
            margin-top: 16px;

            image {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                margin-top: 0;
            }

            view:last-child {
                margin-left: 10px;
                display: flex;
                flex-direction: column;
                font-size: 15px;

                text:last-child {
                    font-size: 12px;
                    color: gray;
                }
            }
        }

        .content {
            margin-top: 16px;
        }

        .interactionBar {
            background-color: white;
            margin-top: 28px;
            display: flex;
            justify-content: space-around;

            view {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 12px;
            }
        }
    }

    .comment {
        margin-top: 16px;
        padding: 16px 10px;
        background-color: white;

        .commentBar {
            display: flex;
            justify-content: space-between;

            view:first-child {
                font-size: 14px;

                text {
                    margin-right: 10px;
                }
            }

            view:last-child {
                font-size: 12px;
                background-color: #f7f7fa;
                padding: 5px 10px;
                display: flex;
                border-radius: 20px;

                text {
                    width: 40px;
                    text-align: center;
                }
            }

        }

        .detailComment {
            margin-top: 16px;

            .end {
                margin-top: 10px;
                display: flex;
                justify-content: center;
                font-size: 13px;
            }
        }
    }


    .iptBg {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        z-index: 1000;
    }

    .userComment {
        max-width: 624px;
        box-sizing: border-box;
        width: 100%;
        background-color: white;
        position: fixed;
        bottom: 0;
        background-color: white;
        padding: 10px 10px;
        z-index: 1001;

        .simple {
            display: flex;

            view {
                display: flex;
                position: relative;
                padding-left: 8px;

                text {
                    background-color: white;
                    position: absolute;
                    left: 33px;
                    top: 0px;
                    font-size: 11px;
                    border-radius: 10px;
                }
            }
        }

        .ipt {
            display: flex;
            align-items: flex-end;
            position: relative;
            top: 0;

            .icon {
                position: absolute;
                right: 75px;
                top: 14px;
            }
        }



    }
}
</style>