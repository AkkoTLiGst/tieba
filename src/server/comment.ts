// 发表评论
export const createComment = (comment: string, floor: number, file: string, userId: number, tieziId: number) => {
    return uni.request({
        url: '/api/comment/create',
        method: 'POST',
        data: {
            comment, floor, file, userId, tieziId
        },
        timeout: 5000
    }).then(res => res.data);
}

// 发表评论的同时上传图片
export const uploadImg = (id: number, file: string) => {
    return uni.uploadFile({
        url: '/api/comment/uploadImg',
        fileType: 'image',
        filePath: file,
        name: 'file',
        formData: {id}
    }).then(res => res.data);
}

// 通过帖子ID获取对应所有评论的ID数组
export const findAllCommentId = (id: number) => {
    return uni.request({
        url: `/api/tiezi/findAllCommentId`,
        data: { id },
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}

// 通过评论ID获取评论
export const getComment = (id: number) => {
    return uni.request({
        url: `/api/comment/findOne`,
        data: { id },
        method: 'GET',
        timeout: 5000
    }).then(res => res.data);
}