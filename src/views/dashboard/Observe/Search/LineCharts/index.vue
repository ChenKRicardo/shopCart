<template>
  <div>
    <div class="header">
        <span>搜索用户数</span>
        <i class="el-icon-info"></i>
    </div>
    <div class="main">
        <span class="main-title">122312</span>
        <span class="main-content">17.1<i class="el-icon-caret-top"></i></span>
    </div>
    <div class="footer">
        <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineCahrts",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false, //隐藏X轴
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "line",
          smooth: true,
          data: [20, 2, 10, 33, 1, 58, 9, 60, 30],
          // 拐点样式
          itemStyle: {
            opacity: 0,
          },
          //线条样式
          lineStyle: {
            color: "skyblue",
          },
          //填充颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "skyblue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.header{
    display:flex;
    align-items: center;
}
.el-icon-info{
    margin-left: 20px;
}
.el-icon-caret-top{
    color:red
}
.main{
    margin:10px 0;
}
.main-title,.main-contnet{
    margin-right: 30px;
    font-size: 18px;
}
.charts{
    width:100%;
    height:50px;
}
</style>
