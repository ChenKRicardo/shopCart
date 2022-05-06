<template>
  <el-card>
    <div slot="header">
      <div class="category-header">
        <span>销售占比</span>
        <el-radio-group v-model="value" size="mini" style="margin-bottom: 15px">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="线下"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: {},
    };
  },
  mounted() {
    let PieCharts = echarts.init(this.$refs.charts);
    PieCharts.setOption({
      title: {
        text: "原神",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "10%",
        left: "center",
      },
      series: [
        {
          width: "auto",
          height: "auto",
          top: "50px",
          left: "center",
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "原神" },
            { value: 735, name: "崩坏3rd" },
            { value: 580, name: "崩坏2rd" },
            { value: 484, name: "明日方舟" },
            { value: 300, name: "星辰彼岸" },
          ],
        },
      ],
    });
    PieCharts.on("mouseover", (params) => {
      //获取鼠标移上去的数据
      const { name, value } = params.data;
      PieCharts.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(207, 206, 206);
  align-items: center;
}
.charts {
  width: 100%;
  height: 247px;
}
</style>
