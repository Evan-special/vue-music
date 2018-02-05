<template>
  <div class='rank' ref='rank'>
    <scroll class='toplist' ref='toplist'>
      <ul>
        <li class='item' v-for='(item,index) in topList' :key='index' @click='selectItem(item)'>
          <div class='icon'>
            <img :src="item.picUrl" width='100' height='100'>
          </div>
          <ul class='songlist'>
            <li class='song' v-for='(song, index) in item.songList' :key='index'>
              <span>{{ index+1 }}</span>
              <span>{{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <!-- 渲染出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from "@/api/rank";
import scroll from '../base/scroll'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      topList: []
    };
  },
  methods:{
    _getTopList(){
      getTopList().then((res)=>{
        if(res.code === 0){
          this.topList = res.data.topList;
        }
      })
    },
    selectItem(item){
      this.$router.push({
        path:`/rank/${item.id}`
      })
      this.setToplist(item);
    },
    ...mapMutations({
      setToplist:'SET_TOPLIST'
    })
  },
  created(){
    this._getTopList();
  },
  components:{
    scroll
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/styles/variable';
@import '../../common/styles/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>