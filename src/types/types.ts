// 用户信息
export type loginTypes = {
    username: string,
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