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