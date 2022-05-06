<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px"
      @click="handlerAdd"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table style="width: 100%; margin: 10px" border :data="list">
      <el-table-column label="序号" width="100px" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img
            :src="row.logoUrl"
            alt="好🐍哦"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getPageList"
      background
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :total="total"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌信息' : '添加品牌信息'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传图片无法使用v-model收集数据 
          action:上传的地址
          on-success:图片上传成功会执行一次 
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0, //总数据条数
      list: [], //列表展示的数据
      dialogFormVisible: false,
      tmForm: {
        id: "",
        logoUrl: "",
        tmName: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请选择上传图片" }],
      },
    };
    //表单验证规则
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      //获取品牌列表参数
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //添加品牌信息
    handlerAdd() {
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "", id: "" };
    },
    //修改品牌信息
    handleEdit(index, tradeMark) {
      this.dialogFormVisible = true;
      //将已有的tmfrom信息展示在修改页上
      //将服务器返回的数据直接给了tmfrom
      Object.assign(this.tmForm, tradeMark);
    },
    //删除品牌
    handleDelete(tradeMark) {
      this.$confirm(`此操作将永久删除${tradeMark.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result =await this.$API.trademark.reqDeleteTradeMark(tradeMark.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      //res,file上传成功后服务器返回前端的数据
      this.tmForm.logoUrl = res.data;
    },
    //图片上传的限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //图片上传
    addOrUpdateTradeMark() {
      //全部字段验证通过才能进行上传
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            this.$message({
              message: this.tmForm.id ? "修改成功" : "上传成功",
              type: "success",
            });
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          return false;
        }
      });
    },
    //取消信息提示
    cancel() {
      this.dialogFormVisible = false;
      this.$message(this.tmForm.id ? "已取消修改" : "已取消添加");
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #141111;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
