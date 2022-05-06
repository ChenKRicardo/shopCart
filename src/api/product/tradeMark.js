import request from '@/utils/request'
// 获取品牌数据信息
export const reqTradeMarkList = (page, limit) => request.get(`admin/product/baseTrademark/${page}/${limit}`)
// 添加品牌 id由服务器生成 参数 品牌名称、品牌logo
//修改品牌 要传id
//根据携带参数有无id判断是否是修改or添加
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({
      url: `/admin/product/baseTrademark/update`,
      method: 'PUT',
      data: tradeMark
    })
  } else {
    return request({
      url: `/admin/product/baseTrademark/save`,
      method: 'post',
      data: tradeMark
    })
  }
}

//删除品牌
export const reqDeleteTradeMark = (id)=>request.delete(`/admin/product/baseTrademark/remove/${id}`)
