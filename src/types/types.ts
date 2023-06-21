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
export interface toDetailPage extends tiezis {
    tiebaName: string, // 对应贴吧名
    tiebaImg: string, // 贴吧头像
    url: string // 图片
}