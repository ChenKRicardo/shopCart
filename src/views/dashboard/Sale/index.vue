<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 头部左侧 -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"> </el-tab-pane>
          <el-tab-pane label="访问量" name="visited"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            class="data"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            size="mini"
            v-model="data"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <!-- 内容区 -->
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <div class="range">
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li>
                  <span class="circile">1</span>
                  <span>肯德基</span>
                  <span class="rvalue">1223213</span>
                </li>
                <li>
                  <span class="circile">2</span>
                  <span>麦当劳</span>
                  <span class="rvalue">1223213</span>
                </li>
                <li>
                  <span class="circile">3</span>
                  <span>今麦郎</span>
                  <span class="rvalue">1223213</span>
                </li>
                <li>
                  <span>4</span>
                  <span>哇哈哈</span>
                  <span class="rvalue">1223213</span>
                </li>
                <li>
                  <span>5</span>
                  <span>地沟油</span>
                  <span class="rvalue">1223213</span>
                </li>
                <li>
                  <span>6</span>
                  <span>辣条</span>
                  <span class="rvalue">1223213</span>
                </li>
                <li>
                  <span>7</span>
                  <span>BBQ</span>
                  <span class="rvalue">1223213</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myCharts: null,
      data: [], //收集日历数据
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
    this.myCharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 110, 222, 333, 111, 222],
        },
      ],
    });
  },
  watch: {
    title() {
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
      });
    },
  },
  methods: {
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.data = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.data = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.data = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.data = [start, end];
    },
  },
};
</script>

<style scoped>
.box-card {
  margin: 12px;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.data {
  width: 215px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
.range {
  padding: 0;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%px;
  margin: 19px;
}
ul li span {
  margin: 0 10px;
}
.circile {
  float: left;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: black;
  color: #fff;
  text-align: center;
}

.rvalue {
  float: right;
}
</style>
