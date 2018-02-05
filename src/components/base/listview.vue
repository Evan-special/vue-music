<template>
  <scroll class='listview' :data='data' ref='listview'>
    <!-- 歌手列表 -->
    <ul>
      <li v-for='(group,index) in data' :key='index' class='list-group' ref='listGroup'>
        <h2 class='list-group-title'>{{ group.title }}</h2>
        <ul>
          <li v-for='(item,index) in group.item' :key='index' class='list-group-item'
          @click='selectItem(item)'>
            <img v-lazy="item.headImage" class='avatar'>
            <span class='name'>{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 检索列表 -->
    <div class='list-shortcut'>
      <ul>
        <li class='item' v-for='(item, index) in getTitle' :key='index'  @touchstart='listTouch' :data-index='index' >{{ item }}</li>
      </ul>
    </div>
  </scroll>
</template>
 
<script>
import scroll from "../base/scroll";
import { getAttr } from "@/common/js/dom";
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    scroll
  },
  computed: {
    getTitle() {
      //  数组 map()
      return this.data.map(group => {
        // 遍历data数组,g -> 每一个元素
        return group.title.slice(0, 1);
      });
    }
  },
  methods: {
    listTouch(e) {
      //  获取 li 上 index 值
      let index = getAttr(e.target, "index");
      // 调用 scrollToElement
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index]);
    },
    selectItem(item) {
      //  将数据 item 作为事件参数传给父组件
      this.$emit("select", item);
    }
  }
};
</script>
<style scoped lang="stylus">
@import '../../common/styles/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

