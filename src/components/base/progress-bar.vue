<template>
  <div class="progress-bar" ref="progressBar" @click='clickProgressBar'>
    <div class="bar-inner">
      <div class="progress" ref="progress" ></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      @touchstart.prevent='touchStart'
      @touchmove.prevent='touchMove'
      @touchend='touchEnd'>
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    percent: {
      // 播放条进度 百分比
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPercent) {
      // 在拖动进度条时, 还在watch percent的变化, offsetWatch就会变, 解决: 在touch时候权值最大, 停止对 percent 的 watch 
      if (!this.touch.isStart && newPercent>=0) {
        const barWidth = this.$refs.progressBar.clientWidth - 16;
        const offsetWidth = barWidth * newPercent;
        this._offset(offsetWidth);
      }
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    touchStart(e) {
      // 定义一个标志位 , 为true 表示进入touchstart事件
      this.touch.isStart = true;
      // 获取当前 X 轴坐标
      this.touch.startX = e.touches[0].pageX;
      // 获取当前 的进度条的宽度
      this.touch.left = this.$refs.progress.clientWidth;
    },
    touchMove(e) {
      console.log('2222')
      // 判断有没有进入 touchstart
      if (!this.touch.isStart) {
        return;
      }
      // 当前移动的偏移量 distanceX
      const distanceX = e.touches[0].pageX - this.touch.startX;
      // 计算进度条偏移的总值 offsetWidth  0 ~ progressBar 之间
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - 16,
        Math.max(0, this.touch.left + distanceX)
      );
      // 改变播放进度条的进度
      this._offset(offsetWidth);
    },
    touchEnd(e) {
      // touchend 我们要向父组件派发一个事件,告诉父组件现在播放进度条 的percent是多少,我们在 watch 这个 percent
      this.tiggerPercent();
      this.touch.isStart = false;
    },
    tiggerPercent() {
      // 获取 progress-bar 的宽度
      const barWidth = this.$refs.progressBar.clientWidth - 16;
      // 获取 progress(进度条) 的宽度 / barWidth -> 新的percent
      const percent = this.$refs.progress.clientWidth / barWidth;
      // 向父组件派发事件,把新的percent传入
      this.$emit("percentChange", percent);
    },
    _offset(offsetWidth) {
      // 改变播放进度条的进度
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
    },
    clickProgressBar(e){
      this._offset(e.offsetX);
      this.tiggerPercent(); 
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/styles/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>