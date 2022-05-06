<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="item.tmName"
            :value="item.id"
            v-for="item in tradeMaskList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="请输入描述"
          v-model="spu.descrition"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleUpload"
          :file-list="spuImgList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unChooseNum.length}未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unChooseNum"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
      </el-form-item>
      <el-table border :data="spu.spuSaleAttrList">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="属性名"
          prop="saleAttrName"
          width="width"
        ></el-table-column>
        <el-table-column label="属性值" prop="saleAttrValueName" width="width">
          <template slot-scope="{ row, $index }">
            <el-tag
              :key="tag.id"
              v-for="(tag, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <!-- input和span的切换  @keyup.enter.native="handleInputConfirm"
              @blur=""-->
            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="addSalceAttrValue(row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="spu.spuSaleAttrList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item class="btn">
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="sendScence">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //添加SPU时，将填写的数据存储到spu中，保存发请求
      //修改时，服务器返回了SPU信息，进行修改时，直接将修改后的信息发送即可
      spu: {
        category3Id: 0,
        spuName: "",
        description: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
        tmId: "",
      }, //存储SPU属性
      tradeMaskList: [], //存储品牌信息
      spuImgList: [],
      saleAttrList: [],
      attrIdAndName: "", //收集未选择的销售属性ID和名称
    };
  },
  methods: {
    handleRemove(file, fileList) {
      //file:已删除的图片
      //fileList:删除后图片剩余个数
      //收集图片
      this.spuImgList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片上传成功后触发
    handleUpload(response, file, fileList) {
      //response:服务器返回的信息
      //收集图片
      this.spuImgList = fileList;
    },
    //将Scence传给父，改变视图 取消按钮
    sendScence() {
      this.$emit("changeScence", {
        scence: 0,
        flag: this.spu.id ? "修改" : "添加",
      });
      //清除数据
      //this._data:可以操作data当中的响应式数据
      //this.$options.data()执行后，data中的数据被清空
      Object.assign(this._data, this.$options.data());
    },
    async initSpuData(spu) {
      //获取SPU信息数据
      let spuResult = await this.$API.spu.reqGetSpuInfo(spu.id);
      if (spuResult.code === 200) {
        this.spu = spuResult.data;
      }
      //获取品牌数据信息
      let tradeMaskResult = await this.$API.spu.reqGetTradeMarkList();
      if (tradeMaskResult.code === 200) {
        this.tradeMaskList = tradeMaskResult.data;
      }
      //获取SPU图片信息
      let spuImgResult = await this.$API.spu.reqGetSpuImg(spu.id);
      if (spuImgResult.code === 200) {
        //饿了么UI展示图片需要name,url属性,因此重新整理返回的图片信息
        let imgList = spuImgResult.data;
        imgList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImgList = imgList;
      }
      //获取所有品牌销售信息
      let saleAttrResult = await this.$API.spu.reqGetSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    //添加新的销售属性
    addSaleAttr() {
      //将收集的销售属性进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      //添加到SPU数据
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrList: [] };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空属性
      this.attrIdAndName = "";
    },
    //添加新的销售属性值
    addSalceAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //el-input失去焦点事件
    handleInputConfirm(row) {
      
      const { baseSaleAttrId, inputValue } = row;
      //新增属性值不得重复,不得为空
      if (inputValue.trim() == "") {
        this.$message({ type: "error", message: "属性值不得为空" });
        return;
      }
      row.spuSaleAttrValueList=row.spuSaleAttrValueList||[]
      let isRepeat = row.spuSaleAttrValueList.findIndex((item) => {
        return item.saleAttrValueName == inputValue;
      });
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      if (isRepeat == -1) {
        row.spuSaleAttrValueList.push(newSaleAttrValue);
        row.inputVisible = false;
      } else {
        this.$message({ type: "error", message: "属性值不得重复" });
      }
    },
    //上传||修改SPU
    async addOrUpdateSpu() {
      //整理参数，图片参数
      this.spu.spuImageList = this.spuImgList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSaleAttr(this.spu);
      if (result.code === 200) {
        this.sendScence();
        this.$message({ type: "success", message: `修改成功` });
      }
      Object.assign(this._data, this.$options.data());
    },
    //父组件点击添加SPU时，此处发请求获取数据
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      //获取品牌数据信息
      let tradeMaskResult = await this.$API.spu.reqGetTradeMarkList();
      if (tradeMaskResult.code === 200) {
        this.tradeMaskList = tradeMaskResult.data;
      }
      //获取所有品牌销售信息
      let saleAttrResult = await this.$API.spu.reqGetSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
  },
  computed: {
    unChooseNum() {
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
};
</script>

<style>
.btn {
  margin: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
