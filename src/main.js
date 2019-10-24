import Vue from 'vue'

import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import axios from 'axios'
import router from './router'
import './styles/common.css'

// 只要是vue的插件 如果的基于模块化的开发，必须use才能用
Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
