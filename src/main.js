import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/styles/index.styl'
import fastclick from 'fastclick'
import vueLazyload from 'vue-lazyload'
import store from './store/index'

Vue.config.productionTip = false

fastclick.attach(document.body); 
// 注册懒加载插件
Vue.use(vueLazyload,{
  loading: require('./common/images/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
