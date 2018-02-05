import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, getSinger){
    state.singer = getSinger; 
  },
  [types.SET_PLAYING](state, flag){
    state.playing = flag;
  },
  [types.SET_FULLSCREEN](state, flag){
    state.fullScreen  = flag;
  },
  [types.SET_PLAYLIST](state, list){
    state.playList = list;
  },
  [types.SET_SEQUENCE_LIST](state, list){
    state.sequenceList  = list;
  },
  [types.SET_MODE](state, mode){
    state.mode = mode;
  },
  [types.SET_CURRENT_INDEX](state, index){
    state.currentIndex = index;
  },
  [types.SET_DISCITEM](state, item){
    state.discItem = item;
  },
  [types.SET_TOPLIST](state, item){
    state.toplist = item;
  }
}

export default mutations;