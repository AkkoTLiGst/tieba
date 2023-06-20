 /**
 * 函数防抖
 * @param fn 防抖方法
 * @param deply 间隔时间
 * @param config 配置 {first：首次点击是否执行 end：时间结束后是否执行}
 * @returns 
 */
export function throttle<T>(fn: T, deply = 500, config: { first?: boolean, end?: boolean } = { first: true, end: false }): T{
    let timer: boolean = true;
    
    
    if(typeof fn !== 'function'){
        throw new TypeError('类型错误，传入的不是一个函数');
    }
    return function(this: unknown){
        const args = arguments; 
        if(config.first && timer) {
            fn.apply(this, args as any)
        };

        if(!timer) return;

        timer = false;

        setTimeout(() => {
            config.end && fn.apply(this, args as any);
            timer = true;
        }, deply);
    }as any;

}

/**
 * 函数节流
 * @param fn 节流方法
 * @param time 间隔时间
 * @param config 配置 {first：首次点击是否执行 end：时间结束后是否执行}
 * @returns 
 */
export function debounce<T>(fn: T, time = 500, config: { first?: boolean, end?: boolean } = { first: true, end: false }): T {
    let timeout: number | null = null;
    if (typeof fn !== 'function') {
        throw new TypeError('类型错误，传入函数不是一个方法')
    }
    return function (this: unknown) {
        const args = arguments
        if (config.first && !timeout) fn.apply(this, args as any)
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
            config.end && fn.apply(this, args as any)
            timeout = null
        }, time);
    } as any;
}

/**
 * 判断是否是邮箱
 * @param str 字符串
 * @returns 是否为邮箱，true为是，false为不是
 */
export function isEmail(str: string): boolean{

    let isEmail: boolean = false;
    const expr = "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$";

    if(str.match(expr)) isEmail = true;

    return isEmail;
}

/**
 * 判断是否是手机号
 * @param str 字符串
 * @returns 是否为手机号，true为是，false为不是
 */
export function isMobile(str: string): boolean{
    let isMobile: boolean = /^1[3-9]\d{9}$/.test(str);

    return isMobile;
}