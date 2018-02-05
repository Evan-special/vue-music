<template>
  <div class="recommend">
    <scroll class='recommend-content' :data='playlist'>
      <div>
        <!-- 轮播图 -->
        <div class='slider-wrapper'>
          <!-- 必须保证数据请求到,有数据,才能进行DOM操作 -->
          <slider :sliderlist='recommend' v-if='recommend.length'></slider>  
        </div>
        <!-- 热门歌曲列表 -->
        <div class='recommend-list'>
          <h1 class='list-title'>热门歌曲推荐</h1>
          <ul>
            <li class='item' v-for='(item,index) in playlist' :key='index'
            @click='selectItem(item)'>
              <div class='icon'>
                <img v-lazy="item.imgurl" width='60' height='60'>
              </div>
              <div class='text'>
                <h2 class='name' v-html='item.creator.name'></h2>
                <p class='desc' v-html='item.dissname'></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- loading -->
      <div class='loading-container' v-show='!playlist.length'>
        <loading></loading> 
      </div>
    </scroll> 
     <!-- 渲染出口  -->
     <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getPlaylist } from "@/api/recommend";
import slider from "../base/slider";
import scroll from "../base/scroll";
import loading from "../base/loading/loading";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      recommend: [],
      playlist: []
    };
  },
  created() {
    this._getRecommend();
    this._getPlaylist();
  },
  methods: {
    _getRecommend() {
      getRecommend()
        .then(res => {
          if (res.code === 0) {
            this.recommend = res.data.slider;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getPlaylist() {
      getPlaylist().then(res => {
        if (res.code === 0) {
          this.playlist = res.data.list;
        }
      });
    },
    selectItem(item) {
      // 设置路由跳转
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
      this.setDiscItem(item);
    },
    ...mapMutations({
      setDiscItem: "SET_DISCITEM"
    })
  },
  components: {
    slider,
    scroll,
    loading
  }
};
</script>

<style scoped lang="stylus" >
@import '../../common/styles/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
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