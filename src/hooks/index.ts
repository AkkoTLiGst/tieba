import ENV_VAR from "@/config/env";

/**
* 函数节流
* @param fn 节流方法
* @param deply 间隔时间
* @param config 配置 {first：首次点击是否执行 end：时间结束后是否执行}
* @returns 
*/
let throttleTimer: boolean = true;
export function throttle<T>(fn: T, deply = 500, config: { first?: boolean, end?: boolean } = { first: true, end: false }): T {
    if (typeof fn !== 'function') {
        throw new TypeError('类型错误，传入的不是一个函数');
    }
    return function (this: unknown) {
        const args = arguments;
        if (config.first && throttleTimer) {
            fn.apply(this, args as any)
        };

        if (!throttleTimer) return;

        throttleTimer = false;

        setTimeout(() => {
            config.end && fn.apply(this, args as any);
            throttleTimer = true;
        }, deply);
    } as any;
}

/**
 * 函数防抖
 * @param fn 防抖方法
 * @param time 间隔时间
 * @param config 配置 {first：首次点击是否执行 end：时间结束后是否执行}
 * @returns 
 */
let debounceTimeout: number | null = null;
export function debounce<T>(fn: T, time = 500, config: { first?: boolean, end?: boolean } = { first: true, end: false }): T {

    if (typeof fn !== 'function') {
        throw new TypeError('类型错误，传入函数不是一个方法')
    }
    return function (this: unknown) {
        const args = arguments
        if (config.first && !debounceTimeout) fn.apply(this, args as any)
        debounceTimeout && clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            config.end && fn.apply(this, args as any)
            debounceTimeout = null
        }, time);
    } as any;
}

/**
 * 判断是否是邮箱
 * @param str 字符串
 * @returns 是否为邮箱，true为是，false为不是
 */
export function isEmail(str: string): boolean {

    let isEmail: boolean = false;
    const expr = "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$";

    if (str.match(expr)) isEmail = true;

    return isEmail;
}

/**
 * 判断是否是手机号
 * @param str 字符串
 * @returns 是否为手机号，true为是，false为不是
 */
export function isMobile(str: string): boolean {
    let isMobile: boolean = /^1[3-9]\d{9}$/.test(str);

    return isMobile;
}

/**
 * 根据图片绘制canvas并获取其主题色
 * @param url 图片链接
 * @param canvasId canvas元素的canvasid
 * @param reactiveData 响应式reactive对象，用来保存主题色
 */
export const getImage = (url: string, canvasId: string, reactiveData: any) => {
    // 获得图片信息
    uni.getImageInfo({
        src: url,
        success(res) {
            let imgHeight = 54;
            let imgWidth = 54;
            let ctx = uni.createCanvasContext(canvasId) // 使用画布创建上下文 图片
            ctx.drawImage(res.path, 0, 0, 54, 54) // 设置图片坐标及大小，括号里面的分别是（图片路径，x坐标，y坐标，width，height）
            ctx.save(); //保存
            ctx.draw(true, () => {
                uni.canvasGetImageData({
                    canvasId: canvasId,
                    x: 0,
                    y: 0,
                    width: 54,
                    height: 54,
                    success: (res) => {
                        let data = res.data;

                        let arr = []
                        let r = 1,
                            g = 1,
                            b = 1;
                        // 取所有像素的平均值
                        for (let row = 0; row < imgHeight; row++) {
                            for (let col = 0; col < imgWidth; col++) {
                                if (row == 0) {
                                    r += data[((imgWidth * row) + col)];
                                    g += data[((imgWidth * row) + col) + 1];
                                    b += data[((imgWidth * row) + col) + 2];
                                    arr.push([r, g, b])
                                } else {
                                    r += data[((imgWidth * row) + col) * 4];
                                    g += data[((imgWidth * row) + col) * 4 + 1];
                                    b += data[((imgWidth * row) + col) * 4 + 2];
                                    arr.push([r, g, b])
                                }
                            }
                        }
                        // 求取平均值
                        r /= (imgWidth * imgHeight);
                        g /= (imgWidth * imgHeight);
                        b /= (imgWidth * imgHeight);
                        // 将最终的值取整
                        r = Math.round(r);
                        g = Math.round(g);
                        b = Math.round(b);

                        Object.assign(reactiveData, { r, g, b })
                    },
                    fail: (fail) => {
                        console.log(fail)
                    }
                })

            })

        }
    });
}

/**
 * 生成图片url
 * @param imgName 图片名
 * @param from 是tiebas还是tiezi还是user还是comment下的
 * @returns 拼好串的url
 */
export const newUrl = (imgName: string, from: string) => {
    if (imgName) {
        return `${ENV_VAR.BASE_API}/${from}/${imgName}`;
    } else {
        return '';
    }
}


/**
 * 计算发帖时间，返回xxx小时/分支/天前
 * @param createTime 发帖时间
 * @returns 发帖时间
 */
export const mathTime = (createTime: string) => {
    // 计算帖子发出时间
    const createtime = Math.round(new Date(createTime).getTime() / 1000); // 评论时间
    const now = Math.round(new Date().getTime() / 1000);
    let time = 0;
    if (Math.round((now - createtime) / 60) > 0) {
        time = Math.round((now - createtime) / 60);
        if (time < 60) {
            return `${time}分钟前`;
        } else if (time >= 60 && time < 1440) {
            time = Math.floor(time / 60);
            return `${time}小时前`;
        } else {
            time = Math.floor(time / 60 / 24);
            return `${time}天前`
        }
    } else {
        time = Math.round((now - createtime));
        return `${time}秒前`;
    }
}

// 回到上一页
export const rollback = () => {
    const pages = getCurrentPages() ? getCurrentPages() : [];
    // 有可返回的页面则直接返回，uni.navigateBack  默认返回失败之后会自动刷新页面 ，无法继续返回
    if (pages.length > 1) {
        uni.navigateBack({ delta: 1 });
        return;
    }

    let a = history.go(-1);
    // go失败之后则重定向到首页 
    if (a == undefined) {
        uni.reLaunch({
            url: "/pages/index/index"
        })
    }
    return;
}