import request from '@/utils/request'
const api_pre = `/admin/acl/user`
export const reqUserList = (page, limit, searchObj) => {
  return request({
    url: `${api_pre}/${page}/${limit}`,
    method: 'get',
    params: searchObj
  })
}
export const reqUserRolesById = (userId) => {
  return request({
    url: `${api_pre}/toAssign/${userId}`,
    method: 'get'
  })
}
export const searchUserById = (id) => {
  return request({
    url: `${api_pre}/get/${id}`,
    method: 'get',
  })
}
export const updateUser = (user) => {
  return request({
    url: `${api_pre}/update`,
    method: 'put',
    data: user
  })
}
export const createUser = (user) => {
  return request({
    url: `${api_pre}/save`,
    method: 'post',
    data: user
  })
}
export const allotRole = (userId, roleId) => {
  return request({
    url: `${api_pre}/doAssign`,
    method: 'post',
    params: {
      userId,
      roleId
    }
  })
}
export const deleteUserById = (id) => {
  return request({
    url: `${api_pre}/remove/${id}`,
    method: 'delete',
  })
}
export const deleteUserByIds = (idList) => {
  return request({
    url: `${api_pre}/batchRemove`,
    method: 'delete',
    data: idList
  })
}
