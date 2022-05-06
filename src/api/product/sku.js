import request from '@/utils/request'

//获取SKU所有数据信息
export const reqGetSkuList =(page,limit)=>request.get(`/admin/product/list/${page}/${limit}`)

//SKU上架与下架
export const reqGetSkuOnSale = (skuId)=>request.get(`/admin/product/onSale/${skuId}`)
export const reqGetSkuUnSale = (skuId)=>request.get(`/admin/product/cancelSale/${skuId}`)

//查看SKU详细数据信息
export const reqGetSkuInfo = (skuId)=>request.get(`/admin/product/getSkuById/${skuId}`)
