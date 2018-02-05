<template>
  <div class='singer'>
     <listview :data='singerList' @select='selectSinger'></listview>
     <transition name='trans'>
        <router-view></router-view>
     </transition>
  </div>
</template>

<script>
import { getSingerList } from "../../api/singer";
import listview from '../base/listview'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      singerList: []
    };
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === 0) {
          this.singerList = this.sortSingerList(res.data.list)
        }
      });
    },
    sortSingerList(list) {
      let map = {
        // 包含 hot 和字母对应的对象
        hot: {
          title: "热门",
          item: []
        }
      };
      list.forEach((obj, index) => {
        // 遍历list对象
        if (index < 10) {
          map.hot.item.push({
            id: obj.Fsinger_mid,
            name: obj.Fsinger_name,
            headImage: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${obj.Fsinger_mid}.jpg?max_age=2592000`
          });
        }
        // hot 数据有了, 在设置字母 A~Z 对应的数据
        let key = obj.Findex // 获取到字母 
        if(!map[key]){
          map[key] = {
            title: key,
            item:[]
          }
        }
        map[key].item.push({
          id: obj.Fsinger_mid,
          name:obj.Fsinger_name,
          headImage: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${obj.Fsinger_mid}.jpg?max_age=2592000`
        })
      });
      // 为了得到有序的数据,把对象转化为有序数组
      let hot = []; // 热门数据
      let ret = []; // A~Z 的数据 
      for(let key in map){
        let val = map[key];
        if(val.title.match(/[A-Z]/)){
          ret.push(val);
        }else if(val.title === '热门'){
          hot.push(val);
        }
      }
      // 给 ret 数据进行排序 charCodeAt() 
      ret.sort((a,b)=>{
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);  // 我们就拿到需要的数据结构
    },
    selectSinger(singer){
      // 实现路由的跳转 
      this.$router.push({
        path:`/singer/${ singer.id }`
      });
      this.setSinger(singer);  
    },
    ...mapMutations({
       setSinger:'SET_SINGER'     
    })
  },
  created() {
    this._getSingerList();
  },
  components:{
    listview
  }
};
</script>

<style scoped lang="stylus" >
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}

.trans-enter-active, .trans-leave-active{
    transition : all 0.3s;
}
.trans-enter, .trans-leave-to {
  transform : translate3d(100%,0,0)
}
</style>
