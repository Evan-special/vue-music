import { playMode } from '../common/js/playMode'
// 设置 state 的状态
const state = {
  singer: {},
  playing: false,
  fullScreen: true,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  mode: playMode.sequence,
  discItem: {},
  toplist: {}
}

export default state;
