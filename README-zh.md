
# 进入项目目录
cd vue-admin-template

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
### 文件概要
permission.js :导航首位

### 完成登录业务
1.静态组件完成
2.请求接口换成真是API
3.axios二次封装
4.换成真实接口要处理跨域问题

### 退出登录
1.页面的修改

### 项目路由的搭建

### 完成品牌管理列表的展示

### 添加品牌,修改品牌,删除品牌
1.静态组件

### 表单验证

### 平台属性管理的三级联动静态组件

### 完成三级联动业务

### 添加属性、修改属性、删除属性

### 查看模式与编辑模式的切换
v-if v-else
查看模式:显示span
编辑模式:显示input

### 完成SPU管理模块静态
1.添加SPU、修改SPU
2.要获取品牌的数据
3.获取平台所有销售属性
4.获取某一个sku信息
5.获取SPU图片

### SPU的增删改
清除data数据
 //this._data:可以操作data当中的响应式数据
 //this.$options.data()执行后，data中的数据被清空
Object.assign(this._data,this.$options.data())

### SKU静态组件
1.SKU查看列表的展示
2.完成查看SKU列表的loading[1.只会展现一次.2.切换数据查看，会看到上一次查看的数据]
3.深度选择器

### 数据的可视化

### 权限管理
权限，角色
admin:管理员
路由需根据不同的用户，分配相应的功能？
不同的用户，登录的时候会向服务器发请求，服务器会将用户相应的功能进行返回，
将返回的数据信息进行仓库存储
根据服务器返回的数据信息，根据用户的身份信息进行对比，当前用户需要展示哪些菜单，可以动态设置路由,

### 完成菜单权限
1.将所有的路由进行拆分
2.常量路由：任何角色都可以访问 登录，404，首页
export const constantRoutes =[]
3.//异步路由：不同的角色需要过滤筛选对应的功能路由
export const asyncRoutes =[]
4.//任意路由：路径错误时，重定向到404
export const anyRoutes = []
5.项目中已有的异步路由，与服务器返回的标记信息对比最终要展示的路由
6.整理常量，异步，任意路由
给路由器添加新的路由router.addRoutes(routes) //动态配置路由的API
7.（1）vuex中数据存储在内存中，刷新后失效需要重新获取。因此会出现动态页面失效问题。我们需要根据是否为刷新页面来重新加载即可。
（2）进入动态加载的页面，然后再刷新，也会出现上面的情况
8.在前置路由守卫进行判断routes是否为空，为空则再次请求
if(resultAllRoutes.length===0){
      await store.dispatch('user/getInfo').then(()=>{
       next({path:to.path})
     })
    }else{
      next()
    }
### 按钮权限