// 随机获取帖子
export const randomTieziTB = (tiebaId: number) => {
    return uni.request({
        url: `/api/tiezi/randomTieziTB/${tiebaId}`,
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}

// 通过帖子id获取
export const getTieziById = (tieziID: number) => {
    return uni.request({
        url: `/api/tiezi/getTieziById`,
        data: { tieziID },
        timeout: 5000
    }).then(res => res.data);
}

