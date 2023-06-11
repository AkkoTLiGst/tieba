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


