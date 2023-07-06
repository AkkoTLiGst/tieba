import ENV_CONFIG from '@/config/env';

// 通过吧名获取贴吧信息
export const tiebaByName = (name: string) => {
    return uni.request({
        url: `${ENV_CONFIG.BASE_API}/tiebas/tiebaByName/${name}`,
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}

// 通过id获取贴吧信息
export const tiebaById = (num: number) => {
    return uni.request({
        url: `${ENV_CONFIG.BASE_API}/tiebas/tiebaById/${num}`,
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}

// 获取贴吧总数
export const tiebaCount = () => {
    return uni.request({
        url: `${ENV_CONFIG.BASE_API}/tiebas/count`,
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}

// 创建贴吧
export const createTieba = (data: AnyObject) => {
    return uni.uploadFile({
        url: `${ENV_CONFIG.BASE_API}/tiebas/create`,
        files: [{uri: data.file}],
        fileType: 'image',
        timeout: 5000,
        formData: {
            tiebaName: data.tiebaName,
            aboutTieba: data.aboutTieba,
            subscribeTieba: 0
        }
    }).then(res => res.data);
}

// 获取头像blob
export const stream = (imgName: string) => {
    return uni.request({
        url: `${ENV_CONFIG.BASE_API}/tiebas/Stream`,
        method: 'GET',
        data: {imgName},
        responseType: 'arraybuffer',
        timeout: 5000
    }).then(res => res.data);
}
