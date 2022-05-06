import request from '@/utils/request'
const api_pre = `/admin/acl/role`
export const deleteRoleById = (id) => {
    return request({
        url: `${api_pre}/remove/${id}`,
        method: 'delete',
    })
}
export const getRole = (id) => {
    return request({
        url: `${api_pre}/get/${id}`,
        method: 'get',
    })
}
export const getRoleList = (page, limit, searchObj) => {
    return request({
        url: `${api_pre}/${page}/${limit}`,
        method: 'get',
        params: searchObj
    })
}
export const saveRole = (role) => {
    return request({
        url: `${api_pre}/save`,
        method: 'post',
        data: role
    })
}
export const updateRole = (role) => {
    return request({
        url: `${api_pre}/update`,
        method: 'put',
        data: role
    })
}