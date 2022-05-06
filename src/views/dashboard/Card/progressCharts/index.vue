<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "progressCharts",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      tooltop:{},
      xAxis: {
        show: false, //隐藏X轴
        //最小值最大值设置
        mini:0,
        max:100
      },
      yAxis: {
        show: false,
        //均分
        type: "category",
      },
      series: [
        {
          type: "bar",
          data:[78],
          // 柱状宽度
          barWidth:10,
          color:'yellowgreen',
          //背景颜色设置
          showBackground:true,
          backgroundStyle:{
            color:"gray"
          },
          //
          label:{
            show:true,
            //改变文本内容
            formatter:'|',
            position:"right"
          }
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
.charts {
  width: 100%;
  height: 100%;
}
</style>
