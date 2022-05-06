<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <i class="el-icon-more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts />
        </el-col>
        <el-col :span="12">
          <LineCharts />
        </el-col>
      </el-row>
      <el-table style="width: 100%; margin: 10px" border>
        <el-table-column label="排名" width="180"> </el-table-column>
        <el-table-column label="搜索关键字" width="180"> </el-table-column>
        <el-table-column label="用户数"> </el-table-column>
        <el-table-column label="周涨幅" sortable> </el-table-column>
      </el-table>
      <el-pagination style="float:right" layout="prev, pager, next" :total="1000"> </el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineCharts from "./LineCharts";
export default {
  name: "Search",
  components: {
    LineCharts,
  },
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
.clearfix {
  border-bottom: 1px solid rgb(207, 206, 206);
  padding: 5px 0;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
