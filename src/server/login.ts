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
        data: {post_id, user_id, code},
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
export const followTieba = (user_id: number) => {
    return uni.request({
        url: '/api/auth/authUserTieba',
        method: 'GET',
        data: { user_id},
        header: { Authorization: `Bearer ${uni.getStorageSync('loginKey')}` },
        timeout: 5000
    }).then(res => res.data);
}