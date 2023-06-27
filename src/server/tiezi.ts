// 发表帖子
export const createPost = (post: object) => {
    return uni.request({
        url: `/api/tiezi/create`,
        method: 'POST',
        data: { ...post },
        timeout: 5000
    }).then(res => res.data);
}

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

// 获取对应贴吧的对应个数帖子
export const getPostByTieba = (tiebaId: number, page: number, pageSize: number) => {
    return uni.request({
        url: '/api/tiezi/allPost',
        data: { id: tiebaId, page, pageSize },
        timeout: 5000
    }).then(res => res.data);
}

// 获取对应贴吧的帖子数量
export const getPostCount = (tiebaId: number) => {
    return uni.request({
        url: '/api/tiezi/postCount',
        data: { id: tiebaId },
        timeout: 5000
    }).then(res => res.data);
}
