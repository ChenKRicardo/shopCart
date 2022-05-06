<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm" :disabled="show">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          value=""
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" value="">
        <el-select
          placeholder="请选择"
          @change="handler2"
          v-model="cForm.category2Id"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" value="">
        <el-select placeholder="请选择" v-model="cForm.category3Id"  @change="handler3">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Category",
  props:['show'],
  data() {
    return {
      //一级分类的数据
      list1: [],
      //二级分类的数据
      list2: [],
      //三级分类的数据
      list3: [],
      //收集相应的一级二级三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    //组件挂在完毕获取以及商品分类数据
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqGetCategory1List();
      if (result.code === 200) {
        this.list1 = result.data;
      }
    },
    //当一级数据改变发请求获取二级数据
    async handler1() {
      let result = await this.$API.attr.reqGetCategory2List(
        this.cForm.category1Id
      );
      if (result.code === 200) {
        this.list2 = [];
        this.list3 = [];
        this.cForm.category2Id = "";
        this.cForm.category3Id = "";
        this.list2 = result.data;
      }
    },
    async handler2() {
      let result = await this.$API.attr.reqGetCategory3List(
        this.cForm.category2Id
      );
      if (result.code === 200) {
        this.list3 = [];
        this.cForm.category3Id = "";
        this.list3 = result.data;
      }
    },
    handler3(){
      this.$emit('getCategoryId',this.cForm)
    }
  },
};
</script>

<style></style>
