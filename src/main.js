import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
//引入三级联动组件
import Category from '@/components/Category'
import HintButton from '@/components/HintButton'
Vue.use(ElementUI)
Vue.component(Category.name,Category)
Vue.component(HintButton.name,HintButton)
Vue.config.productionTip = false
import API from './api'
Vue.prototype.$API = API

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
