
// 随机获取帖子
export const randomTieziTB = (tiebaId: number) => {
    return uni.request({
        url: `/api/tiezi/randomTieziTB/${tiebaId}`,
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}