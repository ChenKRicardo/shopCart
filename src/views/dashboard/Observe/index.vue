<template>
  <div class="Observe">
    <el-row :gutter="10">
      <el-col :span="12"
        ><Search />
        </el-col>
      <el-col :span="12">
        <Category />
        </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from "./Search";
import Category from "./Category";
export default {
  name: "Observe",
  components: {
    Search,
    Category,
  },
};
</script>

<style scoped>
.Observe{
    padding: 10px;
}
.el-card {
  border: none;
}
</style>
