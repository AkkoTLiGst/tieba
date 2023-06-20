// 获取用户信息
export const getUserById = (id: number) => {
    return uni.request({
        url: '/api/user/findById',
        data: {
            id
        },
        method: 'GET',
        timeout: 5000,
    }).then(res => res.data)
}   