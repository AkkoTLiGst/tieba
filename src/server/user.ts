import ENV_CONFIG from '@/config/env';

// 创建用户
export const createUser = (data: AnyObject) => {
    return uni.request({
        url: `${ENV_CONFIG.BASE_API}/user/create`,
        data: {...data},
        method: `POST`,
        timeout: 5000
    }).then(res => res.data);
}

// 获取用户信息
export const getUserById = (id: number) => {
    return uni.request({
        url: `${ENV_CONFIG.BASE_API}/user/findById`,
        data: {
            id
        },
        method: `GET`,
        timeout: 5000,
    }).then(res => res.data)
}   

// 获取未登录用户的帖子
export const userPosts  = (id: number, page: number, pageSize: number) => {
    return uni.request({
        url: `${ENV_CONFIG.BASE_API}/user/userPost`,
        method: `GET`,
        data:{id, page, pageSize},
        timeout: 5000
    }).then(res => res.data);
}

// 更新用户头像
export const uploadImg = (id: number, file: string) => {
    return uni.uploadFile({
        url: `${ENV_CONFIG.BASE_API}/user/uploadUserImg`,
        fileType: `image`,
        filePath: file,
        name: `file`,
        formData: {id}
    }).then(res => res.data);
}


