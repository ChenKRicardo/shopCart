<template>
  <div>
    <el-card class="box-card">
      <Category @getCategoryId="getCategoryId" :show="!isShowTable"/>
    </el-card>
    <el-card class="box-card">
      <div v-show="isShowTable">
        <el-button
          type="primary"
          class="el-button"
          icon="el-icon-plus"
          :disabled="isDisabled"
          @click="showTable"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table style="width: 100%; margin: 10px" border :data="attrList">
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row }" class="name-wrapper">
              <el-tag
                size="medium"
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button size="mini" type="danger" icon="el-icon-delete"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加修改属性操作 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" label-width="80px" :model="newattrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="newattrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          class="el-button"
          icon="el-icon-plus"
          :disabled="!newattrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="clearAttrInfo">取消</el-button>
        <el-table
          border
          style="width: 100%; margin: 20px"
          :data="newattrInfo.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称" prop="prop" width="width">
            <template slot-scope="{ row }">
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                ref="input"
                size="mini"
                v-if="row.flag"
                @blur="look(row)"
                @keyup.native.enter="row.flag = false"
              >
              </el-input>
              <span v-else @click="InputShow(row)" style="display: block">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @onConfirm="deleAttr($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" class="el-button" @click="postAttrs"
         :disabled="newattrInfo.attrValueList.length<1" >保存</el-button
        >
        <el-button @click="clearAttrInfo">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attrList: [],
      attrID: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      isShowTable: true,
      isDisabled: true,
      //收集新增属性或修改相关数据
      newattrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  name: "Attr",
  methods: {
    //子给父传商品属性ID
    getCategoryId(categoryId) {
      Object.assign(this.attrID, categoryId);
    },
    showTable() {
      this.isShowTable = false;
    },
    InputShow(row) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    look(row) {
      //如果input框输入为空则提示
      if (row.valueName.trim() === "") {
        this.$message({ type: "error", message: "属性值不能为空" });
        return;
      }
      //属性值不得重复
      let isRepeat = this.newattrInfo.attrValueList.some((item) => {
        //row：最新新增的属性值
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message({ type: "error", message: "属性值不能重复" });
        return;
      }
      row.flag = false;
    },
    addAttrValue() {
      //添加属性值
      this.newattrInfo.attrValueList.push({
        attrId: this.newattrInfo.id, //此ID由服务器给予
        valueName: "",
        flag: true, //给每个属性添加独立的flag用于切换编辑和修改
      });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    handleEdit(row) {
      this.isShowTable = false;
      //修改属性值时也为其加上flag
      Object.assign(this.newattrInfo, row);
      this.newattrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //提交属性值
    async postAttrs() {
      //判断属性值是否为空，为空禁止提交
      //提交数据不包括flag
      this.newattrInfo.attrValueList = this.newattrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      let result = await this.$API.attr.reqPostAttr(this.newattrInfo);
      if (result.code === 200) {
        const { category1Id, category2Id, category3Id } = this.attrID;
        this.isShowTable = true;
        this.$message({ type: "success", message: "保存成功" });
       let newResult = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id);
       this.attrList = newResult.data;
        this.newattrInfo = {
          attrName: "",
          attrValueList: [],
          categoryId: this.attrID.category3Id,
          categoryLevel: 3,
        };
      }
    },
    clearAttrInfo() {
      this.isShowTable = true;
      this.newattrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.attrID.category3Id,
        categoryLevel: 3,
      };
    },
    //气泡框确认删除属性值
    deleAttr(index) {
      this.newattrInfo.attrValueList.splice(index, 1);
    },
  },
  watch: {
    "attrID.category3Id": {
      async handler() {
        const { category1Id, category2Id, category3Id } = this.attrID;
        let result = await this.$API.attr.reqAttrList(
          category1Id,
          category2Id,
          category3Id
        );
        if (result.code === 200) {
          this.attrList = result.data;
          this.isDisabled = false;
        }
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
