<template>
    <view class="detailPostBar" :style="{ backgroundColor: `rgb(${themeColor.r}, ${themeColor.g}, ${themeColor.b})` }">
        <view class="topBar" :style="{ height: statusBarHeight + 'px' }">
            <u-icon @click="rollback" name="arrow-left" :custom-style="{ width: '56px' }" size="20" color="white"></u-icon>
            <text>打开贴吧</text>
        </view>
        <view class="barMsg">
            <view class="left">
                <canvas canvas-id="logo" />
                <image :src="tiebaInfo.photoTieba" mode="scaleToFill" />
                <view class="msg">
                    <text>{{ tiebaInfo.tiebaName }}吧</text>
                    <view>
                        <text>关注 {{ tiebaInfo.subscribeTieba }}</text>
                        <text>帖子 {{ tiebaInfo.postCount }}</text>
                    </view>
                </view>
            </view>
            <view class="right" @click="subscribeEvent">
                <i class="iconfont" :style="unicodeIcon.icon.color">{{ unicodeIcon.icon.icon }}</i>
            </view>
        </view>

        <view class="content">
            <view class="contentTop">
                <view>
                    <view><text
                            :style="{ backgroundColor: `rgb(${themeColor.r}, ${themeColor.g}, ${themeColor.b})` }">置顶</text><text>{{
                                123123 }}</text></view>
                    <view><text
                            :style="{ backgroundColor: `rgb(${themeColor.r}, ${themeColor.g}, ${themeColor.b})` }">置顶</text><text>{{
                                123123 }}</text></view>
                </view>
                <view class="contentTopBar">
                    <text>全部</text>
                    <text>精华</text>
                </view>
            </view>

            <postsForBar v-for="item in tieziArr" :index="item" :item="item" :from="''" />
            <view class="end" v-if="isAllPost">已加载完所有帖子</view>
        </view>

        <view class="posting" @click="postingEvent"
            v-show="postingShow"
            :style="
                { 
                    backgroundColor: `rgb(${themeColor.r}, ${themeColor.g}, ${themeColor.b})` ,
                    transform: `translateX(${postingLeft}px)`
                }"
        >
            <u-icon name="plus" color="white" size="25"></u-icon>
        </view>
    </view>
</template>
<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { tiebaById } from '@/server/tiebas'
import { getPostByTieba, getPostCount } from '@/server/tiezi'
import { isSubscribe, subTieba } from '@/server/login'
import postsForBar from '@/components/postsForBar.vue'
import type { tieba, tiezis, toDetailPage } from '@/types/types'
import { reactive, ref } from 'vue';
import { getImage, newUrl } from '@/hooks/index'
import { loginStore } from '@/store/login';
import { rollback } from '@/hooks/index';

// 设置三方图标
const unicodeIcon = reactive({
    icon: {
        icon: '\ue662',
        color: 'color: white'
    }
})

let tiebaId = 0
const user = loginStore();

// 是否关注
const isSub = ref(false);

// 贴吧信息
const tiebaInfo = reactive<tieba>({
    id: 0,
    tiebaName: '',
    aboutTieba: '',
    subscribeTieba: '',
    photoTieba: '',
    createTimeTieba: '',
    postCount: 0
});
// 初始化贴吧信息
const initTieba = async () => {
    const getTieba = await tiebaById(tiebaId) as tieba;
    Object.assign(tiebaInfo, getTieba);
    tiebaInfo.photoTieba = newUrl(tiebaInfo.photoTieba, 'tiebas'); // 拼串图片
    // 绘制canvas，获取主题色
    getImage(tiebaInfo.photoTieba, 'logo', themeColor);

    // 获取当前贴吧的帖子总数
    const countData = await getPostCount(tiebaId) as { data: number, code: number, message: string };
    tiebaInfo.postCount = countData.data;

    // 用户是否关注贴吧
    const data = await isSubscribe(user.userInfo.id, tiebaId) as { data: boolean };

    if (data.data) {
        isSub.value = data.data;
        unicodeIcon.icon.icon = '\ue603';
    }

    // 是否显示完所有帖子
    if (tiebaInfo.postCount === tieziArr.length) {
        isAllPost.value = true;
    }

}

// 帖子信息
const tieziArr = reactive<toDetailPage[]>([]);
// 帖子第几页
const page = ref(1);
// 帖子一页显示多少个
const pageSize = ref(10);
// 初始化帖子信息
const initTiezi = async () => {
    const data = await getPostByTieba(tiebaId, page.value, pageSize.value) as AnyObject;
    for (let i = 0; i < data.data.length; i++) {
        tieziArr.push(data.data[i]);
    }
    // 设置帖子信息中的帖子图片、贴吧头像、贴吧名
    for (let i = 0; i < tieziArr.length; i++) {
        tieziArr[i].url = newUrl(tieziArr[i].tieziImg, 'tiezi'); // 帖子图片
        tieziArr[i].tiebaImg = tiebaInfo.photoTieba; // 对应贴吧头像
        tieziArr[i].tiebaName = tiebaInfo.tiebaName; // 对应贴吧名
    }
}

// 跳转到发帖界面
const postingEvent = () => {
    uni.navigateTo({
        url: '/components/posting?id=' + tiebaId + '&name=' + tiebaInfo.tiebaName,
    })
}

// 设置发帖按钮的位置
const postingLeft = ref<number>(0);
// 当移动到指定位置时才显示按钮
const postingShow = ref(false);


// 是否显示完全部帖子
const isAllPost = ref(false);

const themeColor = reactive({ r: 0, g: 0, b: 0 }); // 贴吧头像主题色

const statusBarHeight = ref(0); // 给topbar定位
onLoad((e) => {
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight as number || 44;

    tiebaId = e!.data as number; // 获取贴吧ID

    initTieba();
    initTiezi();

    // 设置发帖按钮的位置
    setTimeout(() => {
        // 获取页面宽度（非视口宽度）
        const query = uni.createSelectorQuery().select(".detailPostBar");
        query.boundingClientRect((data) => {
            const a = data as UniApp.NodeInfo;
            // 页面宽度减去发帖按钮的宽度+10等于 发帖按钮需要显示的位置
            postingLeft.value = a.width as number - 75;
            postingShow.value = true;
        }).exec();
    }, 1)
});


// 关注贴吧
const subscribeEvent = async () => {
    if (!isSub.value) {
        const data = await subTieba(user.userInfo.id, tiebaId) as { message: string, code: 200 };
        if (data.code === 200) {
            isSub.value = true;
            unicodeIcon.icon.icon = '\ue603';
        }

    }
}

onReachBottom(() => {
    // 每次下拉多push下一页的进入数组
    if (tiebaInfo.postCount > tieziArr.length) {
        page.value += 1;
        initTiezi();
    }

    // 如果全部帖子已经加载，显示已加载所有帖子的view
    if (tiebaInfo.postCount === tieziArr.length) {
        isAllPost.value = true;
    }
});



// 下拉刷新函数
const refreshEvent = () => {
    tieziArr.length = 0; // 清空数组
    initTieba();
    initTiezi();
    return true
}

onPullDownRefresh(() => {
    if(refreshEvent()){
        uni.stopPullDownRefresh();
    }

})

</script>

<style scoped lang="scss">
@import "/src/static/font/iconfont.css";

page {
    height: 100%;
    background-color: #f7f7fa;
}


.detailPostBar {
    .topBar {
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
    }

    .barMsg {
        padding: 10px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        color: white;

        .left {
            display: flex;
            align-items: center;

            image {
                width: 54px;
                height: 54px;
                border-radius: 15px;
                border: 1px solid white;
                margin-right: 10px;
            }

            .msg {
                view {
                    font-size: 12px;
                    margin-top: 5px;

                    text {
                        margin-right: 5px;
                    }
                }
            }


            canvas {
                // 隐藏canvas
                position: fixed;
                left: 100%;
            }
        }


        .iconfont {
            font-size: 30px;
            padding-right: 10px;
        }
    }

    .content {
        background-color: #f7f7fa;
        border-radius: 20rpx 20rpx 0 0;
        padding: 10px;

        .contentTop {
            view {
                display: flex;
                flex-direction: column;
                margin-bottom: 10px;

                view {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-top: 10px;
                    font-size: 12px;

                    text:first-child {
                        padding: 3px;
                        font-size: 10px;
                        margin-right: 5px;
                        border-radius: 5px;
                        color: white;
                    }
                }
            }

            .contentTopBar {
                flex-direction: row;
                justify-content: flex-start;
                font-size: 12px;

                text {
                    margin-right: 5px;
                }
            }


        }

        .end {
            margin-top: 10px;
            display: flex;
            justify-content: center;
            font-size: 13px;
        }
    }

    .posting {
        position: fixed;
        padding: 15px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 5%;
    }
}
</style>