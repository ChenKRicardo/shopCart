<template>
  <div>
    <el-card class="box-card">
      <Category @getCategoryId="getCategoryId" :show="scence != 0" />
    </el-card>
    <el-card class="box-card">
      <!-- 展示SPU列表结构 -->
      <div v-show="scence === 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!spuID.category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="addSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="editSpu(row, $index)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SKU信息"
                @click="showSkuInfo(row)"
              ></HintButton>
              <el-popconfirm
                title="这是一段内容确定删除吗?"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                  slot="reference"
                >
                </HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :total="total"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          style="margin-top: 20px; text-align: center"
          @current-change="getSkuList"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
      <!-- 添加修改SPU -->
      <SpuForm v-show="scence === 1" @changeScence="changeScence" ref="spu" />
      <!-- 添加SKU信息 -->
      <SkuForm v-show="scence === 2" ref="sku" @changeScence="changeScence" />
      <!-- 对话框查看SKU信息 -->
      <el-dialog
        :title="`${skuName}的sku列表`"
        :visible.sync="dialogTableVisible"
        @close="closeDialog"
      >
        <el-table
          :data="skuInfoList"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column
            prop="skuName"
            label="名称"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            width="150"
          ></el-table-column>
          <el-table-column prop="weight" label="重量"></el-table-column>
          <el-table-column label="默认图片">
            <template slot-scope="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      dialogTableVisible: false,
      records: [],
      spuID: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      page: 1,
      limit: 3,
      total: 0,
      scence: 0, //0:代表展示SPU列表数据 1：添加修改SPU 2:添加SKU
      skuInfoList: [],
      skuName: "",
      loading: true
    };
  },
  methods: {
    getCategoryId(categoryId) {
      Object.assign(this.spuID, categoryId);
    },
    async getSkuList(page = 1) {
      this.page = page;
      const { category3Id } = this.spuID;
      let result = await this.$API.spu.reqSpuList(
        this.page,
        this.limit,
        category3Id
      );
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    //添加SPU
    addSpu() {
      this.scence = 1;
      //通知子组件Spu发请求，获取品牌属性和销售属性
      this.$refs.spu.addSpuData(this.spuID.category3Id);
    },
    //修改SPU
    editSpu(row, index) {
      this.scence = 1;
      this.$refs.spu.initSpuData(row);
    },
    //删除SPU
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code === 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSkuList(this.records.length <= 1 ? this.page - 1 : this.page);
      }
    },
    addSku(row) {
      this.scence = 2;
      this.$refs.sku.getData(
        this.spuID.category1Id,
        this.spuID.category2Id,
        row
      );
    },
    //接受子组件的scence改变视图
    changeScence({ scence, flag }) {
      //flag：区分是添加还是修改事件
      //修改保持原页面，添加回到第一页
      this.scence = scence;
      if (flag == "添加") {
        this.getSkuList();
      } else {
        this.getSkuList(this.page);
      }
    },
    //查看SKU信息
    async showSkuInfo(row) {
      this.skuName = row.spuName;
      this.dialogTableVisible = true;
      let result = await this.$API.spu.reqGetSkuInfo(row.id);
      if (result.code == 200) {
        this.skuInfoList = result.data;
        this.loading = false
      }
    },
    //关闭对话框要处理的事件
    closeDialog(){
      this.loading = true
      // 清除SKU列表数据
      this.skuInfoList = []
    }
  },
  watch: {
    "spuID.category3Id": {
      handler() {
        this.getSkuList();
      },
    },
  },
};
</script>

<style>
.text {
  font-size: 14px;
}
.el-button {
  margin: 0 10px 0 20px;
}
.box-card {
  width: 97%;
  margin: 20px;
}
</style>
