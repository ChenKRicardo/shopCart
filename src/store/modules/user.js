import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter,anyRoutes,asyncRoutes,constantRoutes
} from '@/router'
import router from '@/router'
const getDefaultState = () => {
  return {
    //获取Token
    token: getToken(),
    //存储用户名
    name: '',
    //存储用户头像
    avatar: '',
    //服务器返回菜单信息，不同角色，返回的不同的标记信息
    routes:[],
    //按钮权限信息
    buttons:[],
    //角色信息
    roles:[],
    //对比之后，(项目中已有的异步路由，与服务器返回的标记信息对比最终要展示的路由)
    resultAsyncRoutes:[],
    //当前用户所呈现的完整路由
    resultAllRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO:(state,userInfo)=>{
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    //菜单权限标记
    state.routes = userInfo.routes
    //按钮权限标记
    state.buttons = userInfo.buttons
    //角色信息
    state.roles = userInfo.roles
  },
  //计算出异步路由
  SET_RESULTASYNCROUTES(state,asyncRoutes){
    //仅保存当前用户的异步路由,但需展示完整路由(常量路由,任意路由)
    state.resultAsyncRoutes = asyncRoutes
    //但需展示完整路由(常量路由,任意路由)
   state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
   //给路由器添加新的路由router.addRoutes(routes) //动态配置路由的API
   router.addRoutes(state.resultAllRoutes)
  }
}
//对两个数组进行对比，对比当前用户到底显示哪些一部分路由
const computedAsyncRoutes = (asyncRoutes,routes)=>{
  //过滤出当前用户【超级管理员||普通用户】需要展示的异步路由
 return asyncRoutes.filter(item=>{
    if(routes.indexOf(item.name)!=-1){
      //递归子路由，子路由进行对比
      if(item.children&&item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true;
    }
  })
}
const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        const {
          data
        } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response
        //data包含用户的信息，其中routes包含不同用户所分配的权限功能
        //roles:用户角色信息  buttons:按钮权限
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        //存储用户全部信息
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
