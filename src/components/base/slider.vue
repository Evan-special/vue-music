<template>
  <div class='slider' ref='slider'>
    <!-- 轮播图 -->
    <div class='slider-group' ref='sliderGroup'>
      <div class='slider-item' v-for='(item, index) in sliderlist' :key='index'>
        <a :href='item.linkUrl'>
          <img :src='item.picUrl'>
        </a>
      </div>
    </div>
    <!-- 轮播点 -->
    <div class='dots'>
      <span class='dot' :class='{active: (currentPageIndex) === index}' v-for='(item, index) in dots' :key='index'></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  props: {
    sliderlist: {
      type: Array,
      default: []
    },
    //循环
    loop: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      // 循环轮播首尾各加一个,因此总宽度还要加两倍的宽度
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, //当快速滑动时是否开启滑动惯性
        // 1.6.3版本写法
        snap: {
          loop: this.loop,
          threshold: 0.3, //滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
          speed: 400
        },
        click: true
      });
      this.slider.on("scrollEnd", () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          this.play();
        }
      });
      this.slider.on("touchEnd", () => {
        if (this.autoPlay) {
          this.play();
        }
      });
      this.slider.on("beforeScrollStart", () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    initDots() {
      //1.6.3版本better-scroll 多出2个dots
      this.dots = new Array(this.children.length - 2);
    },
    play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    }
  },
  mounted() {
    this.setSliderWidth();
    this.initSlider();
    this.initDots();
    if (this.autoPlay) {
      this.play();
    }
    // 当窗口尺寸改变时，重新计算轮播宽度
    window.addEventListener("resize", () => {
      if (!this.slider) {
        return;
      }
      this.setSliderWidth(true);
      //刷新时触发
      this.slider.refresh();
    });
  },
  // 销毁定时器有利于内存释放
  beforeDestroy() {
    this.slider.disable();
    clearTimeout(this.timer);
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/styles/variable.styl';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      border: 1px solid $color-text-l;

      &.active {
        margin: -4px 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-ll;
      }
    }
  }
}
</style>