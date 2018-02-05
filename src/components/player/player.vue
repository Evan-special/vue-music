<template>
  <div class='player' v-show='playList.length>0'>
    <!-- 全局的播放页面 -->
    <transition name='normal'>
      <div class='normal-player' v-show='fullScreen'>
        <div class='background'>
          <img width='100%' height='100%' >
        </div>
        <!-- 返回按钮和歌曲信息 -->
        <div class='top'>
          <div class='back' @click='back'>
            <i class='icon-back'></i>
          </div>
          <h1 class='title' v-html='currentSong.name'></h1>
          <h2 class='subtitle' v-html='currentSong.singer'></h2>
        </div>
        <!-- 中间的CD -->
        <div class='middle'
          @touchstart.prevent='middleTouchStart'
          @touchmove.prevent='middleTouchMove'
          @touchend='middleTouchEnd'>
          <div class='middle-l' ref='cd'>
            <div class='cd-wrapper'>
              <div class='cd' :class='rotateCD'>
                <img class='image' :src='currentSong.image'>
              </div>
            </div>
          </div>
          <scroll class='middle-r' ref='lyricList'>
            <div class='lyric-wrapper'>
              <div v-if='currentLyric'>
                 <p v-for='(item, index) in currentLyric.lines' :key='index' ref='lyricLine' :class="{'current': currentLine===index}"
                 class='text'>{{ item.txt }}</p>
              </div>
            </div>  
          </scroll>  
        </div>
        <!-- 底部的播放按钮 -->
        <div class='bottom'>
          <div class='dot-wrapper'>
            <span class='dot' :class="{'active':currentShow=='CD'}"></span>
            <span class='dot' :class="{'active':currentShow=='lyric'}"></span>
          </div>
          <!-- 播放进度条控件 -->
          <div class='progress-wrapper'>
            <!-- 歌曲当前播放时间 -->
            <span class='time time-l'>
              {{ format(currentTime) }}
            </span>
            <!-- 播放进度条 -->
            <div class='progress-bar-wrapper'>
              <progress-bar :percent='percent'  @percentChange='timeChange'></progress-bar>    
            </div>
            <!-- 播放总时长 -->
            <span class='time time-r'>
              {{ format(currentSong.duration) }}
            </span>
          </div> 
          <!-- 按钮控件 -->
          <div class='operators'>
            <div class='icon i-left'>
              <i :class='iconMode' @click='changeMode'></i>
            </div>
            <div class='icon i-left' >
              <i class='icon-prev' @click='prev'></i>
            </div>
            <div class='icon i-center'>
              <i :class='playIcon' @click='togglePlay'></i>
            </div>
            <div class='icon i-right' >
              <i class='icon-next' @click='next'></i>
            </div>
            <div class='icon i-right'>
              <i class='icon-not-favorite'></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini的播放页面 -->
    <transition name='mini'>
      <div class='mini-player' v-show='!fullScreen' @click='open'>
        <div class='icon'>
          <img width='40' height='40' :src='currentSong.image' :class='rotateCD'>
        </div>
        <div class='text'>
          <h2 class='name' v-html='currentSong.name'></h2>
          <p class='desc' v-html='currentSong.singer'></p>
        </div>
        <div class='control'>
          <i :class='miniIcon' @click.stop='togglePlay'></i>
        </div>
        <div class='control'>
          <i class='icon-playlist'></i>
        </div>
      </div>  
    </transition>
    <!-- 添加 audio 标签 -->
    <audio :src="currentSong.url" ref='audio' @canplay='canplay' @error='error' @timeupdate='timeupdate' @ended='ended'></audio>
  </div> 
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from "vuex";
import progressBar from "../base/progress-bar.vue";
import { playMode } from "../../common/js/playMode";
import lyricParser from "lyric-parser";
import scroll from "../../components/base/scroll";
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLine: null,
      playLyric: "",
      currentShow: "CD"
    };
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playList",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
    ]),
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    rotateCD() {
      return this.playing ? "play" : "play pause";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop ? "icon-loop" : "icon-random";
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULLSCREEN",
      setPlaying: "SET_PLAYING",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setMode: "SET_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    togglePlay() {
      // 判断当前有没有 currentLyric
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
      this.setPlaying(!this.playing);
    },
    // 上一首
    prev() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlay();
      }
      this.songReady = false;
    },
    // 下一首
    next() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playList.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlay();
      }
      this.songReady = false;
    },
    canplay() {
      // canplay事件触发, songReady -> true
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    timeupdate(e) {
      this.currentTime = e.target.currentTime;
    },
    format(time) {
      time = Math.floor(time);
      let m = Math.floor(time / 60);
      let s = time % 60;
      if (s.toString().length < 2) {
        s = "0" + s;
      }
      if (m.toString().length < 2) {
        m = "0" + m;
      }
      return `${m}:${s}`;
    },
    timeChange(newPercent) {
      // 改变当前的播放时间 = 播放总时间 * 百分比
      const currentTime = this.currentSong.duration * newPercent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlay();
      }
      //  拖动歌曲, 歌词也跟着变化
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    // 改变播放模式，实质是修改 playlist
    changeMode() {
      let mode = (this.mode + 1) % 3;
      this.setMode(mode);
      let list = null;
      if (this.mode === playMode.random) {
        list = this.randomArr(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      // 重置 currentIndex
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    randomArr(list) {
      let _arr = list.slice();
      for (let i = 0; i < _arr.length; i++) {
        let j = Math.floor(Math.random() * (i + 1));
        let index = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = index;
      }
      return _arr;
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    ended() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      // 把播放时间重置为 0
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    getLyricParser() {
      this.currentSong
        ._getLyric()
        .then(lyric => {
          // 实例化一个 lyricParser , 传入歌词
          this.currentLyric = new lyricParser(lyric, ({ lineNum, txt }) => {
            // lineNum: 当前歌词播放行数
            // txt : 当前播放歌词内容
            this.currentLine = lineNum;
            this.playLyric = txt;
            // 歌词自动滚动
            if (lineNum > 5) {
              // 获取的是 开始要滚动的那一行
              let elem = this.$refs.lyricLine[lineNum - 5];
              this.$refs.lyricList.scrollToElement(elem, 1000);
            } else {
              this.$refs.lyricList.scrollTo(0, 0, 1000);
            }
          });
          // 播放歌词列表
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playLyric = "";
          this.currentLine = 0;
        });
    },
    middleTouchStart(e) {
      this.touch.isStart = true;
      // 判断当前是否是一次移动
      this.touch.isMove = false;
      this.touch.startX = e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.isStart) {
        return;
      }
      // 记录滑动距离
      let distanceX = e.touches[0].pageX - this.touch.startX;
      let distanceY = e.touches[0].pageY - this.touch.startY;
      if (Math.abs(distanceY) > Math.abs(distanceX)) {
        return;
      }
      if (!this.touch.isMove) {
        this.touch.isMove = true;
      }
      //  歌词列表在 CD 页面的右侧, 因此 distanceX 就是滚动的距离
      // left 值在 0 ~ -window.innerWidth 过渡
      let left = this.currentShow == "CD" ? 0 : -window.innerWidth;
      // 计算宽度
      let offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + distanceX)
      );
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      // 设置百分比
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      // 百分比越大, 透明度越小
      this.$refs.cd.style.opacity = 1 - this.touch.percent;
    },
    middleTouchEnd(e) {
      if (!this.touch.isMove) {
        return;
      }
      let offsetWidth;
      let opacity;
      if (this.currentShow == "CD") {
        if (this.touch.percent > 0.2) {
          offsetWidth = -window.innerWidth;
          this.currentShow = "lyric";
          opacity = 0;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.8) {
          offsetWidth = 0;
          this.currentShow = "CD";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style.transition = "all 0.3s";
      this.$refs.cd.style.opacity = opacity;
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      this.$nextTick(() => {
        // 在 DOM 更新之后在调用
        this.$refs.audio.play();
        // this.currentSong._getLyric();
        this.getLyricParser();
      });
    },
    playing(bool) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        bool ? audio.play() : audio.pause(); // 暂停
      });
    }
  },
  components: {
    progressBar,
    scroll
  },
  created() {
    this.touch = {};
  }
};
</script>
<style scoped lang="stylus">
@import '../../common/styles/variable';
@import '../../common/styles/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
          margin: 0 5px;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>