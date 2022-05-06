<template>
  <div id='UsersManage'  class='UsersManage'>
         <el-card shadow="always" :body-style="{ padding: '10px' }">
             <div slot="header">
                 <!-- 头部 -->
                <el-input placeholder="请输入用户名" v-model="searchTemObj.username" class="input-with-select" @change="searchDone" @clear="clearSearch()" size="medium" clearable style="width:400px;margin-right:10px;" >
                    <el-button slot="append" icon="el-icon-search" @click="searchDone"></el-button>
                </el-input> 
                <el-button type="primary" size="small" icon="el-icon-plus" @click="createUserShow">添加用户</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteByIdList" :disabled="deleteEnable">批量删除</el-button>
             </div>
             <!-- table -->
              <el-table :data="userList" v-loading="loading"
               :header-cell-style="{textAlign: 'center'}"
                :cell-style="{textAlign:'center'}"
                @selection-change="selectChange"
               border stripe >
                <el-table-column type="selection" width="55">  </el-table-column>
                  <el-table-column    type="index" label="序号" width="80">
                  </el-table-column>
                  <el-table-column   prop="username" label="用户名" width="200">
                  </el-table-column>
                  <el-table-column   prop="nickName" label="用户昵称" width="200">
                  </el-table-column>
                  <el-table-column   prop="roleName" label="权限列表" >
                      <template slot-scope= '{row}' v-if="row.roleName !== ''">
                           <el-tag  size="small" v-for="(item,index) in row.roleName.split(',')" :key="index" style="margin-right:5px;">
                               {{item}}
                           </el-tag>
                      </template>
                  </el-table-column>
                  <el-table-column   prop="gmtCreate" label="创建时间" width="200">
                  </el-table-column>
                  <el-table-column   prop="gmtModified" label="更新时间" width="200">
                  </el-table-column>
                  <el-table-column    label="操作"  >
                    <template slot-scope= '{row}'>
                        <el-tooltip content="设置角色" placement="top"  >
                        <el-button size="mini" type="info" class="tool-tm" icon="el-icon-setting"   @click="setRoleShow(row)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="修改" placement="top"  >
                         <el-button size="mini" type="primary" class="edit-tm" icon="el-icon-edit" style="margin:0 10px;"  @click="updateUserShow(row)" ></el-button>
                         </el-tooltip>
                        <el-tooltip content="删除" placement="top"  >
                            <el-popconfirm title="确定删除用户吗？"  @confirm="confirmDelete(row.id)">
                            <el-button slot="reference" size="mini" type="danger"  class="delete-tm" icon="el-icon-delete" ></el-button>
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
        @current-change="getUserList"
        :current-page.sync="page"
        layout="prev, pager,next,jumper,->,total,sizes"
        >
        </el-pagination>

        <!-- 添加用户 -->
        <el-dialog
            title="添加用户"
            :visible.sync="createUserVisible"
            width="600px"
            @close="closeCreateDialog">
            <el-form :model="userForm" ref="userFormRef" :rules="userFormRules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username" clearable=""></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickName">
                    <el-input v-model="userForm.nickName" clearable=""></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password"  >
                    <el-input v-model="userForm.password" show-password></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer">
                <el-button @click="closeCreateDialog">取消</el-button>
                <el-button type="primary" @click="createUserDone">确定</el-button>
            </span>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog
            title="修改用户"
            :visible.sync="updateUserVisible"
            width="600px"
            @close="closeUpdateDialog">
            <el-form :model="userForm1" ref="userForm1Ref" :rules="userFormRules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm1.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickName" clearable> 
                    <el-input v-model="userForm1.nickName"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer">
                <el-button @click="closeUpdateDialog">取消</el-button>
                <el-button type="primary" @click="updateUserDone">确定</el-button>
            </span>
        </el-dialog>
        <!-- 设置角色 -->
        <el-dialog
            title="设置角色"
            :visible.sync="setRolesVisible"
            width="600px"
            @close="closeSetRoleDialog">
            <el-form :model="userForm2" ref="userForm2Ref"  label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm2.username"  disabled></el-input>
                </el-form-item>
                <el-form-item label="指定角色" size="normal">
                     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                     
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="userForm2.checkedRoles" @change="handleCheckedRolesChange">
                            <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id">{{item.roleName}}</el-checkbox>
                        </el-checkbox-group>
                </el-form-item>
                
            </el-form>
            
            <span slot="footer">
                <el-button @click="closeSetRoleDialog">取消</el-button>
                <el-button type="primary" @click="setRoleDone">确定</el-button>
            </span>
        </el-dialog>
        
  </div>
</template>

<script>
export default {
  name: 'UsersManage',
  data () {
    return {
        page:1,
        limit:3,
        total:0,
        searchVal:'',
        loading:false,
        createUserVisible:false,
        updateUserVisible:false,
        setRolesVisible:false,
        idList:[],

        curRow:{},//编辑当前行
        searchTemObj:{
            username:''
        },
        searchObj:{
            username:''
        },
        userList:[],
        // 添加用户
        userForm:{
            username:'',
            nickName:'',
            password:''
        },
        // 修改
        userForm1:{
            username:'',
            nickName:'',
        },
        // 设置角色
        userForm2:{
            id:'',
            username:'',
            checkedRoles:[],
        },
        roleList:[],
        
        checkAll:false,//全选
        isIndeterminate:false,//全选按钮状态
        userFormRules:{
            username:[
                {required:true,message:'请输入用户名',trigger:['blur','change']},
                { min:2,max:8,message:'用户名为2-10字',trigger:['blur','change']}
            ],
            nickName:[
                {required:false,message:'请输入用户昵称',trigger:['blur','change']},
                { min:2,max:8,message:'用户昵称为2-10字',trigger:['blur','change']}
            ],
            password:[
                {required:true,message:'请输入用户密码',trigger:['blur','change']},
                { min:4,max:10,message:'用户密码为4-10字',trigger:['blur','change']}
            ],


        }
    }
  },

  computed: { // 计算属性
        deleteEnable(){
            return (this.idList?this.idList:[]).length > 0? false :true
        }
  },

  watch: { // 监测变化

  },

  methods: { // 方法
    async searchDone(){
       this.searchObj = {...this.searchTemObj}
       this.getUserList()
    },
    // 清空搜索
    clearSearch(){ 
        this.searchObj = {}
        this.getUserList()
    },
    async getUserList(pages = 1){
       this.loading = true
       this.page = pages
        let {page,limit,searchObj} = this
        let res = await this.$API.user.reqUserList(page,limit,searchObj)
        if(res.code == 20000){
             let {items ,total} = res.data
            this.userList = items
            this.total = total
        }
        this.loading = false
    },
    sizeChange(limit){
        this.limit = limit
        this.getUserList()
    },
    selectChange(val){
       this.idList = val.map((item)=> item.id)
    },
    // 批量删除
     deleteByIdList(){
        this.$confirm('确定批量删除用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           this.loading = true
            let res = await this.$API.user.deleteUserByIds(this.idList)
            if(res.code == 20000){
            this.$notify({
                title:'批量删除成功！',
                type:'success'
            })
            this.loading = false
        }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
          this.loading = false
        });
        
        this.getUserList()
    },
    // 删除用户
    async confirmDelete(id){
         this.loading = true
         let res = await this.$API.user.deleteUserById(id)
        if(res.code == 200){
            this.$notify({
                title:'删除成功！',
                type:'success'
            })
        }
        this.loading = false
        this.getUserList()
    },
    // 添加用户
    createUserShow(){
         this.createUserVisible = true
    },
    closeCreateDialog(){
        this.createUserVisible = false
        this.$refs.userFormRef.resetFields()
    },
    async createUserDone(){
        this.$refs.userFormRef.validate( async (valid)=>{
            if(valid){
                this.loading = true
                let res = await this.$API.user.createUser(this.userForm)
                if(res.code == 20000){
                    this.$notify({
                    title:'添加成功！',
                    type:'success'
                })
            }
        }else{
            return
        }
            this.loading = false
            this.closeCreateDialog()
            this.getUserList()
        })
    },
    // 修改
     updateUserShow(row){
         this.userForm1 = {...row}
         this.updateUserVisible = true

    },
    closeUpdateDialog(){
        this.updateUserVisible = false
        this.$refs.userForm1Ref.resetFields()
    },
    async updateUserDone(){
        this.$refs.userForm1Ref.validate( async (valid)=>{
            if(valid){
                this.loading = true
                let res = await this.$API.user.updateUser(this.userForm1)
                if(res.code == 20000){
                    this.$notify({
                    title:'修改成功！',
                    type:'success'
                })
            }
        }else{
            return
        }
            this.loading = false
            this.closeUpdateDialog()
            this.getUserList()
        })
    },
  
    //设置角色
     async setRoleShow(row){
         console.log('row: ', row);
         this.userForm2.id = row.id
         this.userForm2.username = row.username
         console.log(' this.userForm2: ',  this.userForm2);
         let res = await this.$API.user.reqUserRolesById(row.id)
        //  let res2 = await this.$API.role.getRoleList(1,500)
         console.log('getRoleListres: ', res);
          if(  res.code == 20000 ){
              this.userForm2.checkedRoles = res.data.assignRoles.map(item => item.id)
              this.roleList = res.data.allRolesList
          }
         this.setRolesVisible = true
    },
    closeSetRoleDialog(){
        this.setRolesVisible = false
        this.userForm2 = {
            username:"",
            checkedRoles:[],
        }
    },
    async setRoleDone(){
        this.loading = true
        let {id,checkedRoles} = this.userForm2
        // ==小坑==，这里需要把checkedRoles角色id数组转为字符串，并用','隔开
        let roleIds = checkedRoles.join(',')
        let res = await this.$API.user.allotRole(id,roleIds)
        if(res.code == 20000){
            this.$notify({
            title:'分配成功！',
            type:'success'
        })
        this.loading = false
        this.closeSetRoleDialog()
        this.getUserList()
        }
    },
    // 勾选发生改变
    handleCheckedRolesChange(val){
        console.log('va1: ', val);
        let checkedCount =  val.length;
        this.checkAll = checkedCount === this.roleList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length;
    },
    // 全选|取消全选
    handleCheckAllChange(val){
        this.userForm2.checkedRoles = val ? this.roleList.map(item => item.id) : []
        this.isIndeterminate = false;
    }

  },
  mounted () { // Dom挂载钩子
    this.getUserList()
  }
};
</script> 

<style scoped lang='scss'>
 .UsersManage{
     height: calc( 100vh - 100px);
     position:relative;
   .edit-tm,.delete-tm,.tool-tm{
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
.el-pagination{
    width: 80vw;
   margin: 20px;
    text-align: center;
}
 }
</style>