import type { User } from "@/types/types";

// 登录
export const login = (username: string, password: string) => {
    return uni.request({
        url: '/api/auth/login',
        data: {
            username, password
        },
        method: 'POST',
        timeout: 5000,
    }).then(res => res.data)
}

// 登录后获取信息
export const getUser = () => {
    return uni.request({
        url: '/api/auth/profile',
        method: 'GET',
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        timeout: 5000
    }).then(res => res.data);
}

// 登录后获取用户帖子ID
export const getTokenTiezi = () => {
    return uni.request({
        url: '/api/auth/tokenTiezi',
        method: 'GET',
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        timeout: 5000
    }).then(res => res.data);
}

// 通过帖子ID和用户ID点赞
export const likePost = (user_id: number, post_id: number, code: string) => {
    return uni.request({
        url: '/api/auth/authLike',
        method: 'PUT',
        data: { post_id, user_id, code },
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        timeout: 5000
    }).then(res => res.data)
}

// 通过用户ID和帖子ID返回是否点赞
export const isLike = (user_id: number, post_id: number) => {
    return uni.request({
        url: '/api/auth/authIsLike',
        method: 'GET',
        data: { user_id, post_id },
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        timeout: 5000
    }).then(res => res.data);
}

// 通过ID获取关注的贴吧
export const followTieba = (id: number) => {
    return uni.request({
        url: '/api/auth/authUserTieba',
        method: 'GET',
        data: { id },
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        timeout: 5000
    }).then(res => res.data);
}

// 是否关注贴吧
export const isSubscribe = (userId: number, tiebaId: number) => {
    return uni.request({
        url: '/api/auth/isSubscribe',
        method: 'GET',
        data: { userId, tiebaId },
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        timeout: 5000
    }).then(res => res.data);
}

// 关注贴吧
export const subTieba = (user_id: number, tieba_id: number) => {
    return uni.request({
        url: '/api/auth/followTieba',
        method: 'POST',
        data: { user_id, tieba_id },
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        timeout: 5000
    }).then(res => res.data);
}


// 获取登录用户的帖子
export const loginUserPosts = (id: number, page: number, pageSize: number) => {
    return uni.request({
        url: '/api/auth/userPosts',
        method: 'GET',
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        data: { id, page, pageSize },
        timeout: 5000
    }).then(res => res.data);
}

// 更新用户信息
export const authUpdateUser = (userInfo: User) => {
    return uni.request({
        url: '/api/auth/authUpdateUser',
        method: 'PUT',
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        data: { userInfo },
        timeout: 5000
    }).then(res => res.data);
}