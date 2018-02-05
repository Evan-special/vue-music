// 入口文件  
import vue from 'vue'
import vuex from 'vuex'
import state from './state'
import mutations from './mutation'
import * as getters from './getter'
import * as actions from './action'
import createLogger from 'vuex/dist/logger'
vue.use(vuex);

const debug = process.env.NODE_ENV!== 'production'

export default new vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict:debug, // vuex 的严格模式
  plugins: debug ? [createLogger()] : [] 
})