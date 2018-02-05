import * as types from './mutation-types'

// 对一系列的 mutations 的提交做了封装, 我们提交 actions 即可
// 第一参数是 context-当前上下文环境  第二参数是 playload  
export const selectPlay = function({commit,state},{list,index}){
  commit(types.SET_PLAYING,true);
  commit(types.SET_PLAYLIST,list);
  commit(types.SET_SEQUENCE_LIST,list);
  commit(types.SET_CURRENT_INDEX,index);
  commit(types.SET_FULLSCREEN,true);
}