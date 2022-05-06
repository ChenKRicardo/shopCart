import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
//此路由配置，使得不同用户登录所使用的功能一样
//拆分路由
//常量路由：任何角色都可以访问 登录，404，首页
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true

  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Dashboard',
        icon: 'dashboard'
      }
    }]
  },

]
//异步路由：不同的角色需要过滤筛选对应的功能路由
export const asyncRoutes = [{
    path: '/admin',
    component: Layout,
    name: 'Acl',
    meta: {
      title: '权限管理',
      icon: 'el-icon-s-custom'
    },
    children: [{
        path: '/userManage',
        name: 'User',
        component: () =>
          import('@/views/admin/UsersManage'),
        meta: {
          title: '用户管理',
        }
      },
      {
        path: '/roleManage',
        name: 'Role',
        component: () =>
          import('@/views/admin/RolesManage'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/menuManage',
        name: 'Permission',
        component: () =>
          import('@/views/admin/MenuManage'),
        meta: {
          title: '菜单管理'
        }
      },
    ]
  },
  {
    name: 'Product',
    path: '/product',
    component: Layout,
    meta: {
      title: '商品管理',
      icon: 'el-icon-goods'
    },
    children: [{
        name: 'TradeMark',
        path: 'tradeMark',
        component: () => import('@/views/product/tradeMark'),
        meta: {
          title: '品牌管理'
        }
      },
      {
        name: 'Attr',
        path: 'attr',
        component: () => import('@/views/product/Attr'),
        meta: {
          title: '平台属性管理'
        }
      },
      {
        name: 'Spu',
        path: 'spu',
        component: () => import('@/views/product/Spu'),
        meta: {
          title: 'Spu管理'
        }
      },
      {
        name: 'Sku',
        path: 'sku',
        component: () => import('@/views/product/Sku'),
        meta: {
          title: 'Sku管理'
        }
      },
    ]

  },
]
//任意路由：路径错误时，重定向到404
export const anyRoutes = [ 
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
