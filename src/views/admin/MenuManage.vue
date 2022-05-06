<template>
  <div id="MenuManage" class="MenuManage" v-loading="loading">
<el-card shadow="always" :body-style="{ padding: '10px' }">
    <el-table
      :data="menuList"
      style="width: 100%; "
      border stripe
      default-expand-all
      row-key="id"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign:'center'}"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="权限名称" sortable width="180">
      </el-table-column>
      <el-table-column prop="code" label="权限值"> </el-table-column>
      <el-table-column prop="toCode" label="跳转权限值"> </el-table-column>
      <el-table-column prop="level" label="权限级别"  > </el-table-column>
      <el-table-column  label="操作"> 
        <template slot-scope= '{row}'>
          <el-tooltip content="新增" placement="top"  >
              <el-button size="mini" type="primary"  class="el-icon-plus"   @click="createMenuShow(row)"></el-button>
          </el-tooltip>  
          <el-tooltip content="修改" placement="top"  >
            <el-button size="mini" type="primary" class="edit-tm" icon="el-icon-edit" style="margin:0 10px;"  @click="updateMenuShow(row)" ></el-button>
          </el-tooltip> 
          <el-tooltip content="删除" placement="top"  >
            <el-popconfirm title="确定删除权限吗？"  @confirm="confirmDelete(row.id)">
              <el-button slot="reference" size="mini" type="danger"  class="delete-tm" icon="el-icon-delete" ></el-button>
            </el-popconfirm>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
</el-card>
 <!-- 添加菜单 -->
    <el-dialog
      title="添加菜单"
      :visible.sync="crateDialog"
      width="600px"
      @close="closeCreateDialog"
    >
      <el-form
        :model="rightForm"
        ref="roleFormRef"
        label-width="80px"
      >
        <el-form-item label="权限名称"  >
          <el-input v-model="rightForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限值" >
          <el-input v-model="rightForm.code" clearable></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="closeCreateDialog">取消</el-button>
        <el-button type="primary" @click="createMenuDone">确定</el-button>
      </span>
    </el-dialog>
 <!-- 修改菜单 -->
    <el-dialog
      title="修改菜单"
      :visible.sync="updateDialog"
      width="600px"
      @close="closeUpdateDialog"
    >
      <el-form
        :model="rightForm1"
        label-width="80px"
      >
        <el-form-item label="权限名称"  >
          <el-input v-model="rightForm1.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限值" >
          <el-input v-model="rightForm1.code" clearable></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="closeUpdateDialog">取消</el-button>
        <el-button type="primary" @click="updateMenuDone">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MenuManage",

  components: {
    // 组件引用
  },

  props: {
    // 父传子
  },

  data() {
    return {
      loading: false,
      crateDialog: false,
      updateDialog: false,
      menuList: [],
      rightForm:{
          pid:'',
          name:'',
          code:''
      },
      rightForm1:{
          id :'',
          pid:'',
          name:'',
          code:''
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
    async getMenuList() {
      this.loading = true;
      let res = await this.$API.permission.reqMenuData();
      if (res.code == 20000) {
        this.menuList = res.data.children;
      }
      this.loading = false;
    },
    async confirmDelete(id){
      console.log('id: ', id);
      this.loading = true
      let res = await this.$API.permission.deleteRightById(id)
      if(res.code == 20000){
        this.$notify({
          title:'删除成功！',
          type:'success'
        })
      }
      this.getMenuList()
      this.loading = false
    },
    //添加
    createMenuShow(row){
      this.rightForm.pid = row.id
      this.crateDialog = true
    },
    closeCreateDialog(){
      this.crateDialog = false
      this.rightForm =  {
          pid:'',
          name:'',
          code:''
      }
    },
    async createMenuDone(){
      let res = await this.$API.permission.saveMenu(this.rightForm)
      if(res.code == 20000){
        this.$notify({
          title:'添加成功！',
          type:'success'
        })
      }
      this.getMenuList()
      this.closeCreateDialog()
    },
    // 修改
    updateMenuShow(row){
      console.log('row: ', row);
      this.rightForm1 = {...row}
      this.updateDialog = true
    },
    closeUpdateDialog(){
      this.updateDialog = false
      this.rightForm1 =  {
          id: '',
          pid:'',
          name:'',
          code:''
      }
    },
    async updateMenuDone(){
      let res = await this.$API.permission.updateMenu(this.rightForm1)
      if(res.code == 20000){
        this.$notify({
          title:'修改成功！',
          type:'success'
        })
      }
      this.getMenuList()
      this.closeUpdateDialog()
    }
  },

  created() {
    // 实例被创建钩子
  },

  mounted() {
    // Dom挂载钩子
    this.getMenuList();
  },
};
</script>

<style scoped lang="scss">
.MenuManage {
 .edit-tm,.delete-tm,.el-icon-plus{
        padding: 7px 12px;
  }
  .edit-tm{
    background:#f3c526;
    border-color: #f3c526;
  }
  .tool-tm{
    background: rgb(194, 202, 212);
    border: rgb(194, 202, 212);
  }
}
</style>
