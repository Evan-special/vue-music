<template>
    <div ref='wrapper'>
      <!-- 插槽 -->
      <slot></slot> 
    </div>
</template>
<script>
import Bscroll from "better-scroll";
export default {
  props: {
    probeType: {
      // 监听滚动事件
      type: Number,
      default: 1
    },
    click: {
      // click 事件
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        // 没有组件加载,直接 return
        return;
      }
      // 实例化一个 scroll 对象, 第一个参数是DOM元素
      this.scroll = new Bscroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
    },
    enable() {
      // 启动 better-scroll
      this.scroll && this.scroll.enable();
    },
    disable() {
      // 禁用 better-scroll
      this.scroll && this.scroll.disable();
    },
    refresh() {
      // 刷新
      this.scroll && this.scroll.refresh();
    },
    scrollToElement(elem, ms) {
      this.scroll && this.scroll.scrollToElement(elem, ms);
    },
    scrollTo(x, y, ms) {
      this.scroll && this.scroll.scrollTo(x, y, ms);
    }
  },
  mounted() {
    setTimeout(() => {
      // 延时加载, 确保DOM加载
      this._initScroll();
    }, 20);
  },
  watch: {
    // data 内容发生变化, 触发重新计算高度
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>
<style>

</style>
