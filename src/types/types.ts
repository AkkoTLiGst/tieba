// 用户信息
export type loginTypes = {
    username: string,
    id: number,
    userId: string,
    photoUser: string,
    email: string,
    tiezisID: number[]
}

// 帖子信息
export type tiezis = {
    id: number,
    threadTitle: string,
    content: string,
    createTimeTiezi: string,
    star: number,
    thumbUp: number,
    commentsNum: number,
    tieziImg: string,
    createrId: number,
    ctieBaId: number
}

// 传输给详情页的信息
export type toDetailPage = {
    createrId: number, // 发帖人ID
    tiebaName: string, // 对应贴吧名
    tiebaImg: string, // 贴吧头像
    thumbUp: number, // 点赞数
    tieziId: number, // 帖子ID
    createTime: string, // 发帖时间
    content: string, // 内容
    title: string, // 标题
    commentsNum: number, // 评论数量
    url: string // 图片
}