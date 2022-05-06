import request from '@/utils/request'

//获取SPU数据
export const reqSpuList = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

//获取某一个SPU数据
export const reqGetSpuInfo = (spuId)=>request.get(`/admin/product/getSpuById/${spuId}`)

//获取品牌数据
export const reqGetTradeMarkList = ()=>request.get(`/admin/product/baseTrademark/getTrademarkList`)

//获取品牌图片
export const reqGetSpuImg = (spuId)=>request.get(`/admin/product/spuImageList/${spuId}`)

//获取所有品牌销售信息
export const reqGetSaleAttrList = ()=>request.get(`/admin/product/baseSaleAttrList`)

//添加修改SPU
export const reqAddOrUpdateSaleAttr = (spuInfo)=>{
    if(spuInfo.id){
        //修改
        return request({url:`/admin/product/updateSpuInfo`,method:"post",data:spuInfo})
    }else{
        //添加
        return request({url:`/admin/product/saveSpuInfo`,method:"post",data:spuInfo})
    }
}

//删除SPU
export const reqDeleteSpu = (spuId)=>request.delete(`/admin/product/deleteSpu/${spuId}`)

//获取SKU图片
export const reqGetSkuImgList = (spuId)=>request.get(`/admin/product/spuImageList/${spuId}`)

//获取SKU销售属性
export const reqGetSkuAttrList =(spuId)=>request.get(`/admin/product/spuSaleAttrList/${spuId}`)

//获取商品基础属性
export const reqGetAttrInfoList =(category1Id,category2Id,category3Id)=>request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)

//上传SKU
export const reqPostSkuInfo = (skuInfo)=>request({url:`/admin/product/saveSkuInfo`,method:"post",data:skuInfo})

//获取SKU数据信息
export const reqGetSkuInfo = (spuId)=>request.get(`/admin/product/findBySpuId/${spuId}`)