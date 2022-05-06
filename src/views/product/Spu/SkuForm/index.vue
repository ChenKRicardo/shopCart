<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="sku.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="sku.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          placeholder="规格描述"
          type="textarea"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in spuInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrvalue.valueName"
                :value="`${attr.id}:${attrvalue.id}`"
                v-for="attrvalue in attr.attrValueList"
                :key="attrvalue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          :data="spuImgList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column width="80px" type="selection"></el-table-column>
          <el-table-column label="图片" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            prop="imgName"
            width="width"
          ></el-table-column>
          <el-table-column label="操作" prop="" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button type="success" size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //收集SKU数据
      sku: {
        //父组件的数据
        category3Id: "",
        spuId: "",
        tmId: "",
        //双向绑定数据
        price: "",
        weight: "",
        skuDefaultImg: "",
        skuDesc: "",
        skuName: "",
        //需自己传递
        skuAttrValueList: [
          //需要携带参数
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        skuImageList: [
          // {
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   spuImgId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          //需要携带参数
          // {
          //   // saleAttrId: 0,
          //   // saleAttrValueId: 0,
          // },
        ],
      },
      spuImgList: [],
      spuAttrList: [],
      spuInfoList: [],
      spu: {},
      imgList: [],
    };
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      this.sku.category3Id = spu.category3Id;
      this.sku.spuId = spu.id;
      this.sku.tmId = spu.tmId;
      this.spu = spu;
      let resultImg = await this.$API.spu.reqGetSkuImgList(spu.id);
      if (resultImg.code === 200) {
        let imageList = resultImg.data;
        imageList.forEach((item) => {
          this.$set(item, "isDefault", 0);
        });
        this.spuImgList = imageList;
      }
      let resultSku = await this.$API.spu.reqGetSkuAttrList(spu.id);
      if (resultSku.code === 200) {
        this.spuAttrList = resultSku.data;
      }
      let resultInfo = await this.$API.spu.reqGetAttrInfoList(
        category1Id,
        category2Id,
        spu.id
      );
      if (resultInfo.code === 200) {
        this.spuInfoList = resultInfo.data;
      }
    },
    //图片勾选的信息
    handleSelectionChange(val) {
      //服务器需要isDefault数据，而前端并没有，需要整理数据
      this.imgList = val;
    },
    //改变isDfault 排他
    changeDefault(row) {
      this.spuImgList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //设置默认图片
      this.sku.skuDefaultImg = row.imgUrl;
    },
    //取消 清空数据，回到主页
    cancel() {
      this.$emit("changeScence", { scence: 0 });
      Object.assign(this._data, this.$options.data());
    },
   async save() {
      //整理参数
      //1.平台属性attrIdAndValueId
      const { spuInfoList, spuAttrList, imgList, sku } = this;
      spuInfoList.forEach((item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          sku.skuAttrValueList.push({ attrId, valueId });
        }
      });
      //整理销售属性
      spuAttrList.forEach((item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          sku.skuSaleAttrValueList.push({ saleAttrId, saleAttrValueId });
        }
      });
      //整理图片属性
      sku.skuImageList = imgList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let result = await this.$API.spu.reqPostSkuInfo(sku)
      if(result.code===200){
        this.cancel()
        this.$message({type:"success",message:"添加成功"})
      }
    },
  },
};
</script>

<style></style>
