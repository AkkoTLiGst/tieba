import request from "@/server/axiosRequest/request";

export const getUser = () => {
    return request({
        url: '/auth/profile',
        method: "GET",
        headers: {
            isToken: true
        }
    }).then(res => res.data);
}