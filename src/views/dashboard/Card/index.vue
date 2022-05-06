<template>
  <div>
    <el-row :gutter="10" style="margin: 10px">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥ 502">
            <template v-slot:charts>
              <span
                >周同比&nbsp;&nbsp; 56.67%<svg
                  t="1648305936760"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2276"
                  width="18"
                  height="18"
                >
                  <path
                    d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z"
                    fill="#d81e06"
                    p-id="2277"
                  ></path></svg
              ></span>
              &nbsp;&nbsp;
              <span
                >日同比&nbsp;&nbsp; 19.96%<svg
                  t="1648306456946"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3475"
                  width="16"
                  height="16"
                >
                  <path
                    d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z"
                    fill="#1afa29"
                    p-id="3476"
                  ></path></svg
              ></span>
            </template>
            <template v-slot:footer>
              <span>日销售额￥ 1314520</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="1314">
            <template v-slot:charts>
              <lineCharts/>
            </template>
            <template v-slot:footer>
              <span>日访问量 13114</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="12360">
            <template v-slot:charts>
              <barCharts/>
            </template>
            <template v-slot:footer>
              <span>转化率 65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template v-slot:charts>
              <progressCharts/>
            </template>
            <template v-slot:footer>
              <span
                >周同比&nbsp;&nbsp; 12%<svg
                  t="1648305936760"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2276"
                  width="18"
                  height="18"
                >
                  <path
                    d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z"
                    fill="#d81e06"
                    p-id="2277"
                  ></path></svg
              ></span>
              &nbsp;&nbsp;
              <span
                >日同比&nbsp;&nbsp; 11%<svg
                  t="1648306456946"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3475"
                  width="16"
                  height="16"
                >
                  <path
                    d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z"
                    fill="#1afa29"
                    p-id="3476"
                  ></path></svg
              ></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import lineCharts from "./lineChart"
import barCharts from "./barCharts"
import progressCharts from "./progressCharts"

import Detail from "./Detail";
export default {
  name: "Card",
  components: {
    Detail,
    lineCharts,
    barCharts,
    progressCharts
  },
};
</script>

<style scoped></style>
