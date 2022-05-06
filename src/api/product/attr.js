import request from '@/utils/request'

//获取一级分类数据接口
export const reqGetCategory1List = () => request.get(`/admin/product/getCategory1`)
//获取二级分类数据接口
export const reqGetCategory2List = (category1Id) => request.get(`/admin/product/getCategory2/${category1Id}`)
//获取三级分类数据接口
export const reqGetCategory3List = (category2Id) => request.get(`/admin/product/getCategory3/${category2Id}`)

//获取商品属性数据
export const reqAttrList = (category1Id, category2Id, category3Id) => request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)

//上传商品属性
export const reqPostAttr = (data)=>request({url:`/admin/product/saveAttrInfo`,method:"post",data})