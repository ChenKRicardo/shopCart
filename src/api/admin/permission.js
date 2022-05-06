import request from '@/utils/request'
const api_pre = `/admin/acl/permission`
export const reqMenuData = () => {
  return request({
    url: api_pre,
    method: "get",
  })
}
export const reqMenuByRole = (roleId) => {
  return request({
    url: `${api_pre}/toAssign/${roleId}`,
    method: "get",
  })
}
export const setRightsToRole = (roleId, permissionId) => {
  return request({
    url: `${api_pre}/doAssign`,
    method: "post",
    params: {
      roleId,
      permissionId
    }
  })
}
export const setRightsToRoleList = (permissionVo) => {
  return request({
    url: `${api_pre}/doAssignAcl`,
    method: "post",
    data: permissionVo
  })
}
export const saveMenu = (permission) => {
  return request({
    url: `${api_pre}/save`,
    method: "post",
    data: permission
  })
}

export const updateMenu = (permission) => {
  return request({
    url: `${api_pre}/update`,
    method: "put",
    data: permission
  })
}
export const deleteRightById = (id) => {
  return request({
    url: `${api_pre}/remove/${id}`,
    method: "delete",
  })
}
