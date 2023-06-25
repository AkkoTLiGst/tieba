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

// 发帖人信息
export type Creater = {
    id: number,
    photoUser: string,
    userName: string,
    url: string
}

// 传输给详情页的信息
export interface toDetailPage extends tiezis {
    tiebaName: string, // 对应贴吧名
    tiebaImg: string, // 贴吧头像
    url: string // 图片
}

// 贴吧信息
export type tieba = {
    id: number,
    tiebaName: string,
    aboutTieba: string,
    subscribeTieba: string,
    photoTieba: string,
    createTimeTieba: string,
    postCount: number
}