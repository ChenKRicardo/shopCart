<template>
  <div>
    <!-- 表格 -->
    <el-card style="margin: 20px">
      <el-table border style="width: 100%px" :data="records">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="名称"
          prop="skuName"
          width="width"
        ></el-table-column>
        <el-table-column
          label="描述"
          prop="skuDesc"
          width="width"
        ></el-table-column>
        <el-table-column label="默认图片" prop="" width="110px">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          label="重量"
          prop="weight"
          width="100px"
        ></el-table-column>
        <el-table-column label="价格(元)" prop="price" width="100px">
        </el-table-column>
        <el-table-column label="操作" prop="" width="width">
          <template slot-scope="{ row }">
            <el-button
              type="success"
              icon="el-icon-bottom"
              size="mini"
              @click="onSale(row)"
              v-if="row.isSale == 0"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-top"
              size="mini"
              @click="unSale(row)"
              v-else
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="lookSkuInfo(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页  @size-change="handleSizeChange"-->
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
    </el-card>
    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              style="margin: 5px"
              type="success"
              v-for="skuAttrValue in skuInfo.skuAttrValueList"
              :key="skuAttrValue.id"
              >{{ skuAttrValue.valueName }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <template>
            <div class="block">
              <el-carousel trigger="click" height="500px">
                <el-carousel-item
                  v-for="skuImage in skuInfo.skuImageList"
                  :key="skuImage.id"
                >
                  <img :src="skuImage.imgUrl" style="width: 100%; height: 100%" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      drawer: false, //抽屉开关
      direction: "rtl", //抽屉打开方向
      records: [],
      skuInfo: {},
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList(page = 1) {
      this.page = page;
      let result = await this.$API.sku.reqGetSkuList(this.page, this.limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList(limit);
    },
    //SKU上架与下架
    async onSale(row) {
      let result = await this.$API.sku.reqGetSkuOnSale(row.id);
      if (result.code === 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    async unSale(row) {
      let result = await this.$API.sku.reqGetSkuUnSale(row.id);
      if (result.code === 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    //查看SKU详细信息
    async lookSkuInfo(row) {
      let result = await this.$API.sku.reqGetSkuInfo(row.id);
      if (result.code === 200) {
        this.skuInfo = result.data;
        this.drawer = true;
      }
      console.log(result);
    },
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #31728b;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
