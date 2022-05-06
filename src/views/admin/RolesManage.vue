<template>
  <div id="RolesManage" class="RolesManage">
    <div class="showtable" v-if="showTable">
      <el-card shadow="always" :body-style="{ padding: '10px' }">
        <div slot="header">
          <!--  -->
          <el-input
            placeholder="请输入角色名"
            v-model="searchTemObj.roleName"
            class="input-with-select"
            @clear="clearSearch()"
            @change="searchDone"
            size="medium"
            clearable
            style="width: 400px; margin-right: 10px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchDone"
            ></el-button>
          </el-input>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="createRoleShow"
            >添加角色</el-button
          >
        </div>

        <el-table
          :data="roleList"
          v-loading="loading"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          border
          stripe
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="remark" label="角色描述"> </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间"> </el-table-column>
          <el-table-column prop="gmtModified" label="更新时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-tooltip content="权限分配" placement="top">
                <el-button
                  size="mini"
                  type="info"
                  class="tool-tm"
                  icon="el-icon-setting"
                  @click="showAssign(row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="修改" placement="top">
                <el-button
                  size="mini"
                  type="primary"
                  class="edit-tm"
                  icon="el-icon-edit"
                  style="margin: 0 10px"
                  @click="updateRoleShow(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-popconfirm
                  title="确定删除角色吗？"
                  @confirm="confirmDelete(row.id)"
                >
                  <el-button
                    slot="reference"
                    size="mini"
                    type="danger"
                    class="delete-tm"
                    icon="el-icon-delete"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 分页 -->
      <el-pagination
        background
        :page-size="limit"
        :page-sizes="[3, 5, 10]"
        :total="total"
        prev-text="上一页"
        next-text="下一页"
        @size-change="sizeChange"
        @current-change="getRoleList"
        :current-page.sync="page"
        layout="prev, pager,next,jumper,->,total,sizes"
      >
      </el-pagination>
    </div>
    <div class="showtree" v-else>
      <el-card shadow="always" :body-style="{ padding: '10px' }">
        <div slot="header">
          <span
            ><el-button
              type="info"
              size="mini"
              @click="showTable = true"
              class="el-icon-back"
              >返回</el-button
            >
          </span>
        </div>
        <!--  @node-click="" empty-text="" -->

        <el-tree
          ref="tree"
          :data="menuList"
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="[
            '1333331312338845697',
            '1333565287975448577',
            '1472102772968747010',
          ]"
          @check-change="handleCheckChange"
          show-checkbox
          highlight-current
          default-expand-all
        ></el-tree>
      </el-card>
    </div>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="createRoleVisible"
      width="600px"
      @close="closeCreateDialog"
    >
      <el-form
        :model="roleForm"
        ref="roleFormRef"
        :rules="roleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="roleForm.roleName" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input v-model="roleForm.remark" clearable=""></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="closeCreateDialog">取消</el-button>
        <el-button type="primary" @click="createRoleDone">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      title="修改角色"
      :visible.sync="updateRoleVisible"
      width="600px"
      @close="closeUpdateDialog"
    >
      <el-form
        :model="roleForm1"
        ref="roleForm1Ref"
        :rules="roleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="roleForm1.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input v-model="roleForm1.remark" clearable></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="closeUpdateDialog">取消</el-button>
        <el-button type="primary" @click="updateRoleDone">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RolesManage",

  components: {
    // 组件引用
  },

  props: {
    // 父传子
  },

  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      searchVal: "",
      loading: false,
      roleList: [],
      roleForm: {
        roleName: "",
        remark: "",
      },
      roleForm1: {
        roleName: "",
        remark: "",
      },
      searchObj: {
        roleName: "",
      },
      searchTemObj: {
        roleName: "",
      },
      createRoleVisible: false,
      updateRoleVisible: false,
      roleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 10, message: "规定2-10字", trigger: "blur" },
        ],
        remark: [
          { required: false, message: "请输入角色描述", trigger: "blur" },
          { min: 2, max: 20, message: "规定2-20字", trigger: "blur" },
        ],
      },

      // tree
      treeLoading: false,
      showTable: true,
      menuList: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },

  computed: {
    // 计算属性
  },

  watch: {
    // 监测变化
    
  },

  methods: {
    // 方法
    async getRoleList(pages = 1) {
      this.loading = true;
      this.page = pages;
      let { page, limit, searchObj } = this;
      let res = await this.$API.role.getRoleList(page, limit, searchObj);
      if (res.code == 20000) {
        this.$notify({
          title: "查询成功！",
          type: "success",
        });
        let { total, items } = res.data;
        this.total = total;
        this.roleList = items;
        this.loading = false;
      }
    },
    // 清空搜索
    clearSearch() {
      this.searchObj = {};
      this.getRoleList();
    },
    searchDone() {
      this.searchObj = { ...this.searchTemObj };
      this.getRoleList();
    },
    sizeChange(limit) {
      this.limit = limit;
      this.getRoleList();
    },
    // 添加角色
    createRoleShow() {
      this.createRoleVisible = true;
    },
    closeCreateDialog() {
      this.createRoleVisible = false;
      this.$refs.roleFormRef.resetFields();
    },
    createRoleDone() {
      this.$refs.roleFormRef.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          let res = await this.$API.role.saveRole(this.roleForm);
          if (res.code == 20000) {
            this.$notify({
              title: "添加成功！",
              type: "success",
            });
          }
        } else {
          return;
        }
        this.getRoleList(this.page);
        this.closeCreateDialog();
        this.loading = false;
      });
    },
    // 修改角色
    updateRoleShow(row) {
      this.roleForm1 = { ...row };
      this.updateRoleVisible = true;
    },
    closeUpdateDialog() {
      this.updateRoleVisible = false;
      this.$refs.roleForm1Ref.resetFields();
    },
    updateRoleDone() {
      this.$refs.roleForm1Ref.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          let res = await this.$API.role.updateRole(this.roleForm1);
          if (res.code == 20000) {
            this.$notify({
              title: "修改成功！",
              type: "success",
            });
          }
        } else {
          return;
        }
        this.getRoleList(this.page);
        this.closeUpdateDialog();
        this.loading = false;
      });
    },
    async confirmDelete(id) {
      this.loading = true;
      let res = await this.$API.role.deleteRoleById(id);
      if (res.code == 20000) {
        this.$notify({
          title: "删除成功！",
          type: "success",
        });
      }
      this.getRoleList(this.page);
      this.loading = false;
    },
    //权限
    async showAssign(id) {
      this.showTable = false;
      this.treeLoading = true;
      let res = await this.$API.permission.reqMenuByRole(id);
      if (res.code == 20000) {
        this.menuList = res.data.children;
        console.log("this.menuList: ", this.menuList);
      }
      this.treeLoading = false;
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
  },

  created() {
    // 实例被创建钩子
  },

  mounted() {
    // Dom挂载钩子
    this.getRoleList();
  },
};
</script>

<style scoped lang="scss">
.RolesManage {
 .el-pagination{
    width: 80vw;
   margin: 20px;
    text-align: center;
}
  .edit-tm,
  .delete-tm,
  .tool-tm {
    padding: 7px 12px;
  }
  .edit-tm {
    background: #f3c526;
    border-color: #f3c526;
  }
  .tool-tm,
  .el-icon-back {
    background: rgb(194, 202, 212);
    border: rgb(194, 202, 212);
  }
}
</style>
