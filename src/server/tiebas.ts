// 通过吧名获取贴吧信息
export const tiebaByName = (name: string) => {
    return uni.request({
        url: `/api/tiebas/tiebaByName/${name}`,
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}

// 通过id获取贴吧信息
export const tiebaById = (num: number) => {
    return uni.request({
        url: `/api/tiebas/tiebaById/${num}`,
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}

// 获取贴吧总数
export const tiebaCount = () => {
    return uni.request({
        url: '/api/tiebas/count',
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}

// 创建贴吧
export const createTieba = (data: AnyObject) => {
    return uni.uploadFile({
        url: '/api/tiebas/create',
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

